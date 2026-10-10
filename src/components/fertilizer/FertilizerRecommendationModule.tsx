import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  PackageCheck,
  Leaf,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Info,
  Calendar,
  DollarSign,
  ShieldCheck,
  Filter,
  FlaskConical,
  Sprout,
  Sliders,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Calculator,
  TrendingUp,
} from 'lucide-react';
import {
  FertilizerRecommendationInput,
  FertilizerRecommendationResponse,
  RecommendedFertilizerItem,
  RankedCropRecommendation,
} from '../../types';
import { getFertilizerRecommendations } from '../../services/fertilizerRecommendationService';
import { userScopedStorageKey } from '../../services/userScopedStorage';
import { useAuth } from '../../context/AuthContext';
import { soilAnalysisService } from '../../services/soilAnalysisService';
import { Upload, AlertCircle } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { translateFertilizerName, translateCropName } from '../../utils/agriI18n';
import { VoiceListenButton } from '../common/VoiceListenButton';

export const FertilizerRecommendationModule: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryCrop = searchParams.get('crop');
  const { user } = useAuth();
  const { language, t } = useI18n();
  const [formData, setFormData] = useState<FertilizerRecommendationInput>({
    soilN: null,
    soilP: null,
    soilK: null,
    ph: null,
    organicCarbon: null,
    targetCrop: queryCrop || '',
    farmArea: 0,
    soilType: '',
    targetYieldGoal: '',
    irrigationType: '',
  });

  const [farmAreaInput, setFarmAreaInput] = useState<string>('');
  const [showSoilTuning, setShowSoilTuning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FertilizerRecommendationResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Macronutrient' | 'Secondary & Micronutrient' | 'Bio-Fertilizer & Organic Conditioner'>('All');
  const [hasSyncedSoil, setHasSyncedSoil] = useState(false);
  const [isUsingRegionalBenchmark, setIsUsingRegionalBenchmark] = useState(false);
  const [syncedSoilMeta, setSyncedSoilMeta] = useState<{
    sampleName: string;
    location?: string;
    n: number | null;
    p: number | null;
    k: number | null;
    ph: number | null;
    oc: number | null;
    soilType: string;
    farmArea: number;
  } | null>(null);
  const [baselineSoil, setBaselineSoil] = useState<{
    n: number | null;
    p: number | null;
    k: number | null;
    ph: number | null;
    oc: number | null;
    soilType: string;
    farmArea: number;
  } | null>(null);

  const [availableRecommendedCrops, setAvailableRecommendedCrops] = useState<string[]>([]);
  const [syncedCropSource, setSyncedCropSource] = useState<string | null>(null);
  const [lastRecalculatedAt, setLastRecalculatedAt] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const handleGenerateWithData = useCallback(async (dataToUse: FertilizerRecommendationInput) => {
    if (!dataToUse.soilReportId || !dataToUse.targetCrop?.trim() || !Number.isFinite(dataToUse.farmArea) || dataToUse.farmArea <= 0) {
      setRequestError('Select a verified soil report and crop, then enter your cultivated area.'); return;
    }
    setLoading(true);
    setRequestError(null);
    try {
      const response = await getFertilizerRecommendations(dataToUse);
      setResults(response);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastRecalculatedAt(timeStr);
      setNotificationMsg(`Soil assessment completed for ${dataToUse.targetCrop}; fertilizer quantities are not available without validated local guidance.`);
      setTimeout(() => {
        setNotificationMsg(null);
      }, 5000);

      // Persist latest fertilizer plan and dispatch cross-module event so Pesticide and other modules react instantly
      try {
        localStorage.setItem(
          userScopedStorageKey('krishibhoomi_latest_fertilizer_plan', user?.id),
          JSON.stringify({
            targetCrop: dataToUse.targetCrop,
            farmArea: dataToUse.farmArea,
            soilType: dataToUse.soilType,
            soilN: dataToUse.soilN,
            soilP: dataToUse.soilP,
            soilK: dataToUse.soilK,
            ph: dataToUse.ph,
            organicCarbon: dataToUse.organicCarbon,
            fertilizers: response.fertilizers,
            updatedAt: new Date().toISOString(),
          })
        );
        localStorage.setItem(userScopedStorageKey('krishibhoomi_active_target_crop', user?.id), dataToUse.targetCrop);

        window.dispatchEvent(
          new CustomEvent('krishibhoomi_fertilizer_updated', {
            detail: {
              targetCrop: dataToUse.targetCrop,
              farmArea: dataToUse.farmArea,
              soilType: dataToUse.soilType,
              soilN: dataToUse.soilN,
              soilP: dataToUse.soilP,
              soilK: dataToUse.soilK,
              ph: dataToUse.ph,
              organicCarbon: dataToUse.organicCarbon,
              recommendations: response.fertilizers,
            },
          })
        );
      } catch {
        // ignore
      }
    } catch (err) {
      console.error('Failed to generate fertilizer recommendations', err);
      setRequestError(err instanceof Error ? err.message : 'Fertilizer recommendations are unavailable. Please retry.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-recalculate whenever formData changes (immediate for dropdowns, 350ms debounce for numeric inputs)
  const triggerAutoRecalculate = useCallback(
    (updatedData: FertilizerRecommendationInput, immediate: boolean = false) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (!updatedData.soilReportId || !updatedData.targetCrop?.trim() || updatedData.farmArea <= 0) return;
      if (immediate) handleGenerateWithData(updatedData);
      else debounceTimerRef.current = setTimeout(() => handleGenerateWithData(updatedData), 350);
    },
    [handleGenerateWithData]
  );

  // Clear debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [user?.id]);

  const syncSoilAndCropFromStorage = useCallback(
    (autoExecute: boolean = true, forcedCrop?: string) => {
      let nextTargetCrop = '';
      let cropSource: string | null = null;
      const recCrops: string[] = [];

      // 1. Sync Crop from Crop Recommendation module
      try {
        const storedRecs =
          localStorage.getItem(userScopedStorageKey('krishibhoomi_crop_recommendations', user?.id)) ||
          localStorage.getItem(userScopedStorageKey('krishibhoomi_latest_crop_recommendations', user?.id));
        if (storedRecs) {
          try {
            const parsed = JSON.parse(storedRecs);
            const list: RankedCropRecommendation[] = Array.isArray(parsed)
              ? parsed
              : parsed?.recommendations || [];
            if (Array.isArray(list) && list.length > 0) {
              list.forEach((r) => {
                if (r.cropName && !recCrops.includes(r.cropName)) {
                  recCrops.push(r.cropName);
                }
              });
              setAvailableRecommendedCrops(recCrops);
            }
          } catch {
            // ignore
          }
        }

        if (forcedCrop && forcedCrop.trim()) {
          nextTargetCrop = forcedCrop.trim();
          cropSource = 'Selected for Fertilizer Advisory';
        } else if (queryCrop && queryCrop.trim()) {
          nextTargetCrop = queryCrop.trim();
          cropSource = 'Selected from Crop Recommendation';
        } else {
          const activeTarget = localStorage.getItem(userScopedStorageKey('krishibhoomi_active_target_crop', user?.id));
          if (activeTarget && activeTarget.trim() && recCrops.includes(activeTarget.trim())) {
            nextTargetCrop = activeTarget.trim();
            cropSource = 'Selected from crop recommendations';
          } else if (recCrops.length > 0) {
            nextTargetCrop = recCrops[0];
            cropSource = 'Top Ranked Recommended Crop';
          } else if (user?.preferredCrop?.trim()) {
            nextTargetCrop = user.preferredCrop.trim();
            cropSource = 'Farmer profile preference';
          }
        }

        try {
          if (nextTargetCrop) localStorage.setItem(userScopedStorageKey('krishibhoomi_active_target_crop', user?.id), nextTargetCrop);
        } catch {
          // ignore
        }
      } catch (e) {
        console.warn('Failed to parse crop recommendations:', e);
      }

      // 2. Sync Soil from Soil Analysis service
      try {
        const activeSoil = soilAnalysisService.getActiveAnalysis(user);
        const hasRealReport = Boolean(
          activeSoil &&
          activeSoil.isUserReport === true &&
          activeSoil.id &&
          activeSoil.parameters
        );

        if (hasRealReport && activeSoil && activeSoil.parameters) {
          const n = activeSoil.parameters.nitrogen?.value ?? null;
          const p = activeSoil.parameters.phosphorus?.value ?? null;
          const k = activeSoil.parameters.potassium?.value ?? null;
          const ph = activeSoil.parameters.ph?.value ?? null;
          const oc = activeSoil.parameters.organicCarbon?.value ?? null;
          const farmArea = Number(activeSoil.fieldMetadata?.farmArea) || Number(user?.farmArea) || 0;
          const soilType =
            activeSoil.fieldMetadata?.soilType ||
            user?.soilType ||
            '';

          const nextData: FertilizerRecommendationInput = {
            soilReportId: activeSoil.id,
            soilN: n,
            soilP: p,
            soilK: k,
            ph,
            organicCarbon: oc,
            targetCrop: nextTargetCrop,
            farmArea,
            soilType,
            targetYieldGoal: '',
            irrigationType: '',
          };

          setFormData(nextData);
          setFarmAreaInput(farmArea.toString());
          setHasSyncedSoil(true);
          setIsUsingRegionalBenchmark(false);
          setSyncedCropSource(cropSource);
          setSyncedSoilMeta({
            sampleName: activeSoil.sampleName || 'Soil Health Card',
            location: activeSoil.fieldMetadata?.location || user?.location,
            n,
            p,
            k,
            ph,
            oc,
            soilType,
            farmArea,
          });
          setBaselineSoil({
            n,
            p,
            k,
            ph,
            oc,
            soilType,
            farmArea,
          });

          if (autoExecute && nextTargetCrop && farmArea > 0) {
            handleGenerateWithData(nextData);
          }
          return;
        }

        // No verified soil report exists yet. Do not substitute regional/sample values.
        setHasSyncedSoil(false);
        setIsUsingRegionalBenchmark(false);
        setSyncedSoilMeta(null);
        setBaselineSoil(null);
        setResults(null);
        setFormData((prev) => ({
          ...prev,
          soilN: null,
          soilP: null,
          soilK: null,
          ph: null,
          organicCarbon: null,
          soilType: '',
          farmArea: 0,
        }));
        setFarmAreaInput('');
        return;
      } catch (e) {
        console.warn('Failed to parse active soil report:', e);
      }

      setHasSyncedSoil(false);
      setIsUsingRegionalBenchmark(false);
      setSyncedSoilMeta(null);
      setBaselineSoil(null);
      setResults(null);
      setFormData((prev) => ({
        ...prev,
        soilN: null,
        soilP: null,
        soilK: null,
        ph: null,
        organicCarbon: null,
        farmArea: 0,
        soilType: '',
      }));
      setFarmAreaInput('');

    },
    [handleGenerateWithData, queryCrop, user]
  );

  // Initial recommendation run on component mount & cross-module updates
  useEffect(() => {
    syncSoilAndCropFromStorage(true, queryCrop || undefined);

    const handleSoilUpdate = (e?: Event) => {
      const customEvent = e as CustomEvent;
      syncSoilAndCropFromStorage(true, customEvent?.detail?.targetCrop);
    };

    const handleCropUpdate = (e?: Event) => {
      const customEvent = e as CustomEvent;
      syncSoilAndCropFromStorage(true, customEvent?.detail?.targetCrop);
    };

    window.addEventListener('krishibhoomi_soil_updated', handleSoilUpdate);
    window.addEventListener('krishi:soil-updated', handleSoilUpdate);
    window.addEventListener('krishibhoomi_crop_updated', handleCropUpdate);
    window.addEventListener('krishi:crop-updated', handleCropUpdate);
    window.addEventListener('krishi:fertilizer-sync-needed', handleCropUpdate);
    window.addEventListener('storage', handleSoilUpdate);

    return () => {
      window.removeEventListener('krishibhoomi_soil_updated', handleSoilUpdate);
      window.removeEventListener('krishi:soil-updated', handleSoilUpdate);
      window.removeEventListener('krishibhoomi_crop_updated', handleCropUpdate);
      window.removeEventListener('krishi:crop-updated', handleCropUpdate);
      window.removeEventListener('krishi:fertilizer-sync-needed', handleCropUpdate);
      window.removeEventListener('storage', handleSoilUpdate);
    };
  }, [syncSoilAndCropFromStorage, queryCrop, user?.id]);

  const handleRecalculate = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    const parsedArea = Number(farmAreaInput);
    if (!Number.isFinite(parsedArea) || parsedArea <= 0) { setRequestError('Enter your farm area to calculate a fertilizer plan.'); return; }
    if (!formData.targetCrop) { setRequestError('Select your crop before calculating a fertilizer plan.'); return; }
    if (![formData.soilN, formData.soilP, formData.soilK, formData.ph, formData.organicCarbon].every((value) => Number.isFinite(Number(value)) && Number(value) > 0)) { setRequestError('Actual soil N, P, K, pH and Organic Carbon values are required.'); return; }
    const updatedData: FertilizerRecommendationInput = {
      ...formData,
      farmArea: parsedArea,
    };
    setFormData(updatedData);
    handleGenerateWithData(updatedData);
  };

  const handleResetToBaselineSoil = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (baselineSoil) {
      const restored: FertilizerRecommendationInput = {
        ...formData,
        soilN: baselineSoil.n,
        soilP: baselineSoil.p,
        soilK: baselineSoil.k,
        ph: baselineSoil.ph,
        organicCarbon: baselineSoil.oc,
        soilType: baselineSoil.soilType,
        farmArea: baselineSoil.farmArea,
      };
      setFormData(restored);
      setFarmAreaInput(baselineSoil.farmArea.toString());
      handleGenerateWithData(restored);
    }
  };

  const handleInputChange = (field: keyof FertilizerRecommendationInput, value: any) => {
    const updated: FertilizerRecommendationInput = {
      ...formData,
      [field]: value,
    };
    setFormData(updated);

    if (field === 'targetCrop') {
      try {
        localStorage.setItem(userScopedStorageKey('krishibhoomi_active_target_crop', user?.id), String(value));
        window.dispatchEvent(
          new CustomEvent('krishibhoomi_crop_updated', {
            detail: { targetCrop: String(value) },
          })
        );
      } catch {
        // ignore
      }
    }

    setRequestError(null);
    // Wait for explicit calculation after the user confirms actual input values.
  };

  const filteredFertilizers = results?.fertilizers.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  ) || [];

  const totalCost = results?.fertilizers.reduce((acc, f) => acc + (f.estimatedCostTotal || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
            <span className="text-[11px] font-bold text-[#2E7D32] uppercase tracking-wider">
              Nutrient Management Plan (ICAR STCR)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#37474F]">
            AI Fertilizer Recommendation Engine
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Calculates crop-specific nutrient replenishment calibrated to your exact soil test report (N-P-K, pH, Organic Carbon) to prevent fertilizer overuse, eliminate soil acidity, and maximize nutrient uptake.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {hasSyncedSoil && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] rounded-xl text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              Soil Lab Data Linked
            </span>
          )}
          <button
            type="button"
            onClick={handleRecalculate}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-extrabold rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Recalculating...' : 'Recalculate Dosage'}
          </button>
        </div>
      </div>

      {/* Recalculation Notification Banner */}
      {requestError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">{requestError}</div>}
      {notificationMsg && (
        <div className="bg-[#E8F5E9] border border-[#A5D6A7] rounded-xl p-3 px-4 flex items-center justify-between gap-3 text-xs text-[#2E7D32] font-bold shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2E7D32]" />
            <span>{notificationMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotificationMsg(null)}
            className="text-gray-400 hover:text-gray-600 text-xs px-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Connected Soil Report & Crop Banner */}
      {syncedSoilMeta && (
        <div
          className={`border rounded-2xl p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs ${
            hasSyncedSoil ? 'bg-[#F1F8E9] border-[#C8E6C9]' : 'bg-amber-50/90 border-amber-200'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div
              className={`w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0 shadow-2xs ${
                hasSyncedSoil ? 'bg-[#2E7D32]' : 'bg-amber-600'
              }`}
            >
              {hasSyncedSoil ? <FlaskConical className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-xs font-black uppercase tracking-wider ${
                    hasSyncedSoil ? 'text-[#2E7D32]' : 'text-amber-800'
                  }`}
                >
                  {hasSyncedSoil ? 'Active Soil Report & Crop Synced' : 'Soil Report Required'}
                </span>
                <span
                  className={`text-[10px] bg-white px-2 py-0.5 rounded-full border font-extrabold ${
                    hasSyncedSoil ? 'border-[#C8E6C9] text-[#2E7D32]' : 'border-amber-300 text-amber-800'
                  }`}
                >
                  {hasSyncedSoil ? 'Live Lab Data' : 'Awaiting Verified Soil Data'}
                </span>
                {syncedCropSource && (
                  <span className="text-[10px] bg-[#E8F5E9] text-emerald-900 px-2 py-0.5 rounded-full border border-[#A5D6A7] font-bold flex items-center gap-1">
                    <Sprout className="w-3 h-3" />
                    {formData.targetCrop}
                  </span>
                )}
              </div>
              <p className="text-sm font-extrabold text-[#37474F] mt-0.5">
                {syncedSoilMeta.sampleName} {syncedSoilMeta.location ? `• ${syncedSoilMeta.location}` : ''}
              </p>
              {!hasSyncedSoil && (
                <p className="text-xs text-amber-900/80 mt-0.5 font-medium">
                  Upload your Soil Health Card or enter actual laboratory values before generating a fertilizer plan. Regional benchmark values are never used as a substitute.
                </p>
              )}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 mt-1">
                <span>pH: <strong className="text-[#37474F]">{formData.ph}</strong></span>
                <span>•</span>
                <span>N: <strong className="text-[#37474F]">{formData.soilN} kg/ha</strong></span>
                <span>•</span>
                <span>P: <strong className="text-[#37474F]">{formData.soilP} kg/ha</strong></span>
                <span>•</span>
                <span>K: <strong className="text-[#37474F]">{formData.soilK} kg/ha</strong></span>
                <span>•</span>
                <span>OC: <strong className="text-[#37474F]">{formData.organicCarbon}%</strong></span>
                <span>•</span>
                <span className="font-semibold text-emerald-800">{formData.soilType}</span>
                <span>•</span>
                <span>Area: <strong className="text-[#37474F]">{formData.farmArea} Acres</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {!hasSyncedSoil && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('krishi:open-soil-upload'));
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Soil Card
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowSoilTuning(!showSoilTuning)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#E8F5E9] text-[#37474F] border border-[#C8E6C9] text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 shadow-2xs"
            >
              <Sliders className="w-3.5 h-3.5 text-[#2E7D32]" />
              {showSoilTuning ? 'Hide Soil Tuning' : 'Tune Soil Test Values'}
              {showSoilTuning ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={() => syncSoilAndCropFromStorage(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Re-sync
            </button>
          </div>
        </div>
      )}

      {/* SECTION: Optional Soil Test Parameters Tuning Panel */}
      {showSoilTuning && (
        <div className="bg-[#F9FBF9] border border-[#C8E6C9] rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E0E0E0] pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#37474F] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#2E7D32]" />
                Fine-Tune Soil Test Nutrients for Scenario Simulation
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Adjust Nitrogen, Phosphorus, Potassium, or pH to recalculate required fertilizer dosages dynamically.
              </p>
            </div>
            {baselineSoil && (
              <button
                type="button"
                onClick={handleResetToBaselineSoil}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2E7D32] hover:text-[#1B5E20] cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset to Lab Card Baseline
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">
                Available N (kg/ha)
              </label>
              <input
                type="number"
                value={formData.soilN}
                onChange={(e) => handleInputChange('soilN', Number(e.target.value) || 0)}
                className="w-full bg-white border border-[#E0E0E0] rounded-xl px-3 py-1.5 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">
                Available P (kg/ha)
              </label>
              <input
                type="number"
                value={formData.soilP}
                onChange={(e) => handleInputChange('soilP', Number(e.target.value) || 0)}
                className="w-full bg-white border border-[#E0E0E0] rounded-xl px-3 py-1.5 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">
                Available K (kg/ha)
              </label>
              <input
                type="number"
                value={formData.soilK}
                onChange={(e) => handleInputChange('soilK', Number(e.target.value) || 0)}
                className="w-full bg-white border border-[#E0E0E0] rounded-xl px-3 py-1.5 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">
                Soil pH
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.ph}
                onChange={(e) => handleInputChange('ph', Number(e.target.value) || 7.0)}
                className="w-full bg-white border border-[#E0E0E0] rounded-xl px-3 py-1.5 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">
                Organic Carbon (%)
              </label>
              <input
                type="number"
                step="0.05"
                value={formData.organicCarbon || 0}
                onChange={(e) => handleInputChange('organicCarbon', e.target.value === '' ? 0 : Number(e.target.value) || 0)}
                className="w-full bg-white border border-[#E0E0E0] rounded-xl px-3 py-1.5 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleRecalculate}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-extrabold rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Recalculating...' : 'Apply & Recalculate Scenario'}
            </button>
          </div>
        </div>
      )}

      {/* SECTION 1: Soil Nutrient Condition Summary Cards */}
      {results?.nutrientConditions && (
        <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#37474F]">
                Soil Nutrient Condition Assessment
              </h2>
              <p className="text-xs text-gray-500">
                Direct assay of primary macronutrients and soil electrochemical acidity
              </p>
            </div>
            <span className="text-xs font-bold text-gray-400">
              Classification: unavailable without soil-test method and local calibration
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Nitrogen Condition */}
            <div className="p-4 rounded-xl border border-[#E0E0E0] bg-[#F7FBF7] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">Available Nitrogen</span>
                <span
                  className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                    results.nutrientConditions.nitrogen.status === 'Low'
                      ? 'bg-[#FFEBEE] text-[#C62828]'
                      : results.nutrientConditions.nitrogen.status === 'Medium'
                      ? 'bg-[#FFF8E1] text-[#E65100]'
                      : 'bg-[#E8F5E9] text-[#2E7D32]'
                  }`}
                >
                  {results.nutrientConditions.nitrogen.status}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#37474F]">
                  Nitrogen — {results.nutrientConditions.nitrogen.status}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                {results.nutrientConditions.nitrogen.value} kg/ha • {results.nutrientConditions.nitrogen.note}
              </p>
            </div>

            {/* Phosphorus Condition */}
            <div className="p-4 rounded-xl border border-[#E0E0E0] bg-[#F7FBF7] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">Available Phosphorus</span>
                <span
                  className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                    results.nutrientConditions.phosphorus.status === 'Low'
                      ? 'bg-[#FFEBEE] text-[#C62828]'
                      : results.nutrientConditions.phosphorus.status === 'Medium'
                      ? 'bg-[#FFF8E1] text-[#E65100]'
                      : 'bg-[#E8F5E9] text-[#2E7D32]'
                  }`}
                >
                  {results.nutrientConditions.phosphorus.status}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#37474F]">
                  Phosphorus — {results.nutrientConditions.phosphorus.status}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                {results.nutrientConditions.phosphorus.value} kg/ha • {results.nutrientConditions.phosphorus.note}
              </p>
            </div>

            {/* Potassium Condition */}
            <div className="p-4 rounded-xl border border-[#E0E0E0] bg-[#F7FBF7] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">Available Potassium</span>
                <span
                  className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                    results.nutrientConditions.potassium.status === 'Low'
                      ? 'bg-[#FFEBEE] text-[#C62828]'
                      : results.nutrientConditions.potassium.status === 'Medium'
                      ? 'bg-[#FFF8E1] text-[#E65100]'
                      : 'bg-[#E8F5E9] text-[#2E7D32]'
                  }`}
                >
                  {results.nutrientConditions.potassium.status}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#37474F]">
                  Potassium — {results.nutrientConditions.potassium.status}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                {results.nutrientConditions.potassium.value} kg/ha • {results.nutrientConditions.potassium.note}
              </p>
            </div>

            {/* pH Condition */}
            <div className="p-4 rounded-xl border border-[#E0E0E0] bg-[#F7FBF7] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">Soil Acidity / pH</span>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                  {results.nutrientConditions.ph.status}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#37474F]">
                  pH — {results.nutrientConditions.ph.value}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                {results.nutrientConditions.ph.note}
              </p>
            </div>
            {results.nutrientConditions.organicCarbon && <div className="p-4 rounded-xl border border-[#E0E0E0] bg-[#F7FBF7] space-y-2">
              <div className="flex items-center justify-between"><span className="text-xs font-bold text-gray-500">Organic Carbon</span><span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">{results.nutrientConditions.organicCarbon.status}</span></div>
              <p className="text-2xl font-black text-[#37474F]">{results.nutrientConditions.organicCarbon.value}%</p>
              <p className="text-[11px] text-gray-500">{results.nutrientConditions.organicCarbon.note}</p>
            </div>}
          </div>
          {results.nutrientConditions.otherMeasurements && <p className="text-xs text-gray-600">Other measured nutrients (status not interpreted): {Object.entries(results.nutrientConditions.otherMeasurements).map(([key,value])=>`${key}: ${value ?? 'Not reported'}`).join(' · ')}</p>}

          {/* Advisory statement */}
          {results.soilHealthAdvisory && (
            <div className="p-4 bg-[#E8F5E9] border border-[#C8E6C9] rounded-xl flex items-start justify-between gap-2.5">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                <p className="text-xs text-[#2E7D32] font-semibold leading-relaxed">
                  {results.soilHealthAdvisory}
                </p>
              </div>
              <VoiceListenButton
                text={results.soilHealthAdvisory}
                size="sm"
                variant="subtle"
              />
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: Interactive Controls to adjust Target Crop, Acreage & Yield Goal */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0F0F0] pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-[#37474F] flex flex-wrap items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2E7D32]" />
              Interactive Dosage & Crop Parameters
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                <span className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-amber-500 animate-ping' : 'bg-[#2E7D32]'}`} />
                {loading ? 'Recalculating...' : 'Live Auto-Recalculate Active'}
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Adjust crop variety, cultivated land size, target yield, and irrigation to recalculate precise fertilizer bags and application stages.
            </p>
          </div>
          {lastRecalculatedAt && (
            <span className="text-[11px] font-bold text-gray-400">
              Last updated: {lastRecalculatedAt}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
          {/* Target Crop */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-[#37474F]">
                Target Crop
              </label>
              {availableRecommendedCrops.length > 0 && (
                <span className="text-[10px] text-[#2E7D32] font-extrabold">
                  {availableRecommendedCrops.length} AI Recommended
                </span>
              )}
            </div>
            <select
              value={formData.targetCrop}
              onChange={(e) => {
                const newCrop = e.target.value;
                handleInputChange('targetCrop', newCrop);
                if (searchParams.get('crop')) {
                  setSearchParams({ crop: newCrop });
                }
              }}
              className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
            >
              <option value="">Select the farmer-selected or soil-recommended crop</option>
              {!availableRecommendedCrops.includes(formData.targetCrop) &&
                ![
                  'HD-2967 High-Yield Wheat',
                  'Pusa Bold Yellow Mustard',
                  'JG-11 Desi Chickpea (Gram)',
                  'Pioneer 3302 Hybrid Maize',
                  'Pusa Basmati 1121 Paddy',
                  'Bt Hybrid Cotton (RCH-659)',
                  'Soybean (JS-335 / JS-9560)',
                  'Sugarcane (Co 0238)',
                  'Tomato (Arka Rakshak)',
                  'Potato (Kufri Pukhraj)',
                  'Tur / Arhar (Pigeon Pea)',
                  'Moong (Greengram)',
                  'Urad (Blackgram)',
                  'Groundnut (Peanut)',
                  'Chilli (G4 / Teja)',
                  'Onion (Bhima Super)',
                  'Pearl Millet (Bajra)',
                  'Sorghum (Jowar)',
                ].includes(formData.targetCrop) && (
                  <option value={formData.targetCrop}>🎯 {formData.targetCrop} (Active)</option>
                )}
              {availableRecommendedCrops.length > 0 && (
                <optgroup label="🌱 AI Recommended for Your Soil">
                  {availableRecommendedCrops.map((cName) => (
                    <option key={`rec-${cName}`} value={cName}>
                      ⭐ {cName}
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="Standard Kharif & Rabi Crops">
                <option value="HD-2967 High-Yield Wheat">HD-2967 High-Yield Wheat</option>
                <option value="Pusa Bold Yellow Mustard">Pusa Bold Yellow Mustard</option>
                <option value="JG-11 Desi Chickpea (Gram)">JG-11 Desi Chickpea (Gram)</option>
                <option value="Pioneer 3302 Hybrid Maize">Pioneer 3302 Hybrid Maize</option>
                <option value="Pusa Basmati 1121 Paddy">Pusa Basmati 1121 Paddy</option>
                <option value="Bt Hybrid Cotton (RCH-659)">Bt Hybrid Cotton (RCH-659)</option>
                <option value="Soybean (JS-335 / JS-9560)">Soybean (JS-335 / JS-9560)</option>
                <option value="Sugarcane (Co 0238)">Sugarcane (Co 0238)</option>
                <option value="Tomato (Arka Rakshak)">Tomato (Arka Rakshak)</option>
                <option value="Potato (Kufri Pukhraj)">Potato (Kufri Pukhraj)</option>
                <option value="Tur / Arhar (Pigeon Pea)">Tur / Arhar (Pigeon Pea)</option>
                <option value="Moong (Greengram)">Moong (Greengram)</option>
                <option value="Urad (Blackgram)">Urad (Blackgram)</option>
                <option value="Groundnut (Peanut)">Groundnut (Peanut)</option>
                <option value="Chilli (G4 / Teja)">Chilli (G4 / Teja)</option>
                <option value="Onion (Bhima Super)">Onion (Bhima Super)</option>
                <option value="Pearl Millet (Bajra)">Pearl Millet (Bajra)</option>
                <option value="Sorghum (Jowar)">Sorghum (Jowar)</option>
              </optgroup>
            </select>
          </div>

          {/* Cultivated Area */}
          <div>
            <label className="block text-xs font-bold text-[#37474F] mb-1">
              Cultivated Area (Acres)
            </label>
            <input
              type="number"
              step="0.25"
              min="0.25"
              value={farmAreaInput}
              onChange={(e) => {
                setFarmAreaInput(e.target.value);
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val > 0) {
                  handleInputChange('farmArea', val);
                }
              }}
              className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
              placeholder="e.g. 5"
            />
          </div>

          {/* Target Yield Goal */}
          <div>
            <label className="block text-xs font-bold text-[#37474F] mb-1">
              Target Yield Goal
            </label>
            <select
              value={formData.targetYieldGoal || 'Standard Target Yield'}
              onChange={(e) => handleInputChange('targetYieldGoal', e.target.value)}
              className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
            >
              <option value="Standard Target Yield">Standard Target Yield (100%)</option>
              <option value="High Yield Hybrid (+20%)">High Yield Hybrid (+20% NPK)</option>
              <option value="Intensive High-Density (+35%)">Intensive High-Density (+35% NPK)</option>
            </select>
          </div>

          {/* Soil Type / Texture */}
          <div>
            <label className="block text-xs font-bold text-[#37474F] mb-1">
              Soil Type & Texture
            </label>
            <select
              value={formData.soilType}
              onChange={(e) => handleInputChange('soilType', e.target.value)}
              className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
            >
              <option value="Deep Black Cotton Soil (Regur)">Deep Black Cotton Soil (Regur)</option>
              <option value="Alluvial Loam">Alluvial Loam</option>
              <option value="Clay Loam">Clay Loam</option>
              <option value="Medium Deep Clay Loam">Medium Deep Clay Loam</option>
              <option value="Sandy Loam">Sandy Loam (Split Dosing)</option>
              <option value="Red Laterite Loam">Red Laterite Loam</option>
            </select>
          </div>

          {/* Recalculate Button */}
          <div>
            <button
              type="button"
              onClick={handleRecalculate}
              disabled={loading}
              className="w-full py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Refresh Assessment
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Metrics Bar */}
      {results && results.fertilizers.length > 0 && (
        <div className="bg-white border border-[#E0E0E0] rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                Calculated For
              </span>
              <span className="text-sm font-black text-[#37474F]">
                {formData.targetCrop}
              </span>
            </div>
            <div className="border-l border-[#E0E0E0] pl-4">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                Total Land
              </span>
              <span className="text-sm font-black text-[#2E7D32]">
                {formData.farmArea} Acres
              </span>
            </div>
            <div className="border-l border-[#E0E0E0] pl-4">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                Target Yield
              </span>
              <span className="text-sm font-black text-[#37474F]">
                {formData.targetYieldGoal || 'Standard Yield'}
              </span>
            </div>
            <div className="border-l border-[#E0E0E0] pl-4">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                Total Estimated Cost
              </span>
              <span className="text-sm font-black text-[#2E7D32]">
                ₹{totalCost.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-500 font-semibold">
            {filteredFertilizers.length} Nutrient Replenishment Items
          </div>
        </div>
      )}

      {/* ICAR STCR Dynamic Calibration Breakdown */}
      {results?.calibrationBreakdown && (
        <div className="bg-[#F8FAF8] border border-[#C8E6C9] rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E0E0E0] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2E7D32] text-white flex items-center justify-center shrink-0">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#37474F]">
                  ICAR STCR Dynamic Calibration Engine
                </h3>
                <p className="text-[11px] text-gray-500">
                  Dosages are mathematically calibrated to your crop ({results.calibrationBreakdown.cropCategory}), yield target multiplier ({results.calibrationBreakdown.yieldMultiplier}x), and soil test deficits.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] rounded-lg self-start sm:self-auto">
              Live Equation Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Nitrogen Calibration */}
            <div className="bg-white border border-[#E0E0E0] rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#37474F]">Nitrogen (N)</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#E8F5E9] text-[#2E7D32]">
                  {Math.round(results.calibrationBreakdown.factors.nFactor * 100)}% of RDF
                </span>
              </div>
              <div className="text-[11px] text-gray-500 space-y-0.5">
                <div>Base RDF: <strong>{results.calibrationBreakdown.baseRDF.n} kg/acre</strong></div>
                <div>Net Dose: <strong className="text-[#2E7D32]">{results.calibrationBreakdown.netRequirementPerAcre.n} kg/acre</strong></div>
                <div>Farm Total ({formData.farmArea} ac): <strong className="text-[#37474F]">{Math.round(results.calibrationBreakdown.netRequirementPerAcre.n * formData.farmArea)} kg N</strong></div>
              </div>
            </div>

            {/* Phosphorus Calibration */}
            <div className="bg-white border border-[#E0E0E0] rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#37474F]">Phosphorus (P₂O₅)</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#E8F5E9] text-[#2E7D32]">
                  {Math.round(results.calibrationBreakdown.factors.pFactor * 100)}% of RDF
                </span>
              </div>
              <div className="text-[11px] text-gray-500 space-y-0.5">
                <div>Base RDF: <strong>{results.calibrationBreakdown.baseRDF.p} kg/acre</strong></div>
                <div>Net Dose: <strong className="text-[#2E7D32]">{results.calibrationBreakdown.netRequirementPerAcre.p2o5} kg/acre</strong></div>
                <div>Farm Total ({formData.farmArea} ac): <strong className="text-[#37474F]">{Math.round(results.calibrationBreakdown.netRequirementPerAcre.p2o5 * formData.farmArea)} kg P₂O₅</strong></div>
              </div>
            </div>

            {/* Potassium Calibration */}
            <div className="bg-white border border-[#E0E0E0] rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#37474F]">Potassium (K₂O)</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#E8F5E9] text-[#2E7D32]">
                  {Math.round(results.calibrationBreakdown.factors.kFactor * 100)}% of RDF
                </span>
              </div>
              <div className="text-[11px] text-gray-500 space-y-0.5">
                <div>Base RDF: <strong>{results.calibrationBreakdown.baseRDF.k} kg/acre</strong></div>
                <div>Net Dose: <strong className="text-[#2E7D32]">{results.calibrationBreakdown.netRequirementPerAcre.k2o} kg/acre</strong></div>
                <div>Farm Total ({formData.farmArea} ac): <strong className="text-[#37474F]">{Math.round(results.calibrationBreakdown.netRequirementPerAcre.k2o * formData.farmArea)} kg K₂O</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Recommended Fertilizer Categories Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Macronutrient', 'Secondary & Micronutrient', 'Bio-Fertilizer & Organic Conditioner'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#2E7D32] text-white shadow-2xs font-extrabold'
                  : 'bg-white border border-[#E0E0E0] text-gray-600 hover:text-[#2E7D32]'
              }`}
            >
              {cat === 'All' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        <span className="text-xs text-gray-500 font-semibold">
          Showing {filteredFertilizers.length} recommended fertilizers for {formData.farmArea} acres of {formData.targetCrop}
        </span>
      </div>

      {/* SECTION 4: Fertilizer Cards with Full Agricultural Guidance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFertilizers.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#E0E0E0] hover:border-[#A5D6A7] rounded-2xl p-6 shadow-2xs transition-all space-y-4 flex flex-col justify-between"
          >
            {/* Header: Fertilizer Name & Category Badge */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F1F8E9] text-[#2E7D32] border border-[#C8E6C9]">
                  {item.category}
                </span>
                <span className="text-[11px] font-bold text-gray-400">
                  Target: {item.nutrientTargeted}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-extrabold text-[#37474F] flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-[#2E7D32] shrink-0" />
                  {translateFertilizerName(item.fertilizer, language)}
                </h3>
                <VoiceListenButton
                  text={`${translateFertilizerName(item.fertilizer, language)}. ${item.purpose}. ${item.applicationStage}. ${item.applicationGuidance}`}
                  size="xs"
                  variant="subtle"
                />
              </div>
            </div>

            {/* Purpose */}
            <div className="p-3 bg-[#F7FBF7] rounded-xl border border-[#E0E0E0] text-xs">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Purpose
              </span>
              <p className="text-gray-700 font-medium leading-relaxed">
                {item.purpose}
              </p>
            </div>

            {/* Quantity & Stage 2-Column Box */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Estimated Quantity */}
              <div className="p-3 bg-[#E8F5E9]/50 rounded-xl border border-[#C8E6C9]">
                <span className="text-[10px] font-extrabold text-[#2E7D32] uppercase tracking-wider block mb-0.5">
                  Estimated Quantity
                </span>
                <p className="font-extrabold text-[#2E7D32] text-sm">
                  {item.estimatedQuantityPerAcre}
                </p>
                <p className="text-[11px] text-gray-600 mt-1 font-semibold">
                  Farm Total: <strong>{item.estimatedTotalQuantity}</strong>
                </p>
              </div>

              {/* Application Stage */}
              <div className="p-3 bg-[#F7FBF7] rounded-xl border border-[#E0E0E0]">
                <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-0.5">
                  Application Stage
                </span>
                <p className="font-bold text-[#37474F]">
                  {item.applicationStage}
                </p>
              </div>
            </div>

            {/* Application Guidance */}
            <div className="p-3.5 bg-white border border-[#E0E0E0] rounded-xl text-xs space-y-1">
              <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#2E7D32]" />
                Application Guidance
              </span>
              <p className="text-gray-600 leading-relaxed">
                {item.applicationGuidance}
              </p>
            </div>

            {/* Organic Alternative & Environmental Impact */}
            {(item.organicAlternative || item.environmentalImpact) && (
              <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Leaf className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                  <span className="text-gray-600">
                    <strong>Bio-Alternative:</strong> {item.organicAlternative}
                  </span>
                </div>
                {item.environmentalImpact && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#F1F8E9] text-[#2E7D32] border border-[#C8E6C9] shrink-0 self-start sm:self-auto">
                    {item.environmentalImpact}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredFertilizers.length === 0 && (
        <div className="bg-white border border-[#E0E0E0] rounded-2xl p-8 text-center shadow-2xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
            <Calculator className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-extrabold text-[#37474F]">
              Ready to Calculate Fertilizer Schedule
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {results?.soilHealthAdvisory || (hasSyncedSoil
                ? `Analyzed soil report found for ${formData.targetCrop}. No quantity is shown because validated crop- and soil-test-specific guidance is unavailable.`
                : 'No verified soil report is available. Complete Soil Analysis and save your report before requesting a fertilizer assessment.')}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleGenerateWithData(formData)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-extrabold rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {results ? 'Retry assessment' : hasSyncedSoil ? 'Assess measured soil' : 'Open Soil Analysis'}
            </button>
            {!hasSyncedSoil && (
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('krishi:open-soil-upload'))}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-[#37474F] border border-gray-300 text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#2E7D32]" />
                Upload My Soil Card
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

