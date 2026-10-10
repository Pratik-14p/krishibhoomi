import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Leaf,
  Droplets,
  Clock,
  Sparkles,
  RefreshCw,
  Info,
  CheckCircle2,
  Bug,
  FlaskConical,
  Sprout,
  Scale,
  IndianRupee,
  ChevronDown,
  ChevronUp,
  Layers,
  Activity,
  UserCheck,
} from 'lucide-react';
import {
  PesticideRecommendationInput,
  PesticideRecommendationResult,
  RankedCropRecommendation,
} from '../../types';
import {
  getPesticideRecommendation,
  MANDATORY_PESTICIDE_DISCLAIMER,
} from '../../services/pesticideRecommendationService';
import { soilAnalysisService } from '../../services/soilAnalysisService';
import { userScopedStorageKey } from '../../services/userScopedStorage';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { translatePestName, translateCropName } from '../../utils/agriI18n';
import { VoiceListenButton } from '../common/VoiceListenButton';

export const PesticideRecommendationModule: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useI18n();

  const [formData, setFormData] = useState<PesticideRecommendationInput>({
    soilReportId: '',
    crop: '',
    growthStage: '',
    observedProblem: '',
    farmArea: 0,
    soilN: undefined,
    soilP: undefined,
    soilK: undefined,
    ph: undefined,
    organicCarbon: undefined,
    soilType: '',
    location: user?.location || '',
  });

  const [farmAreaInput, setFarmAreaInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PesticideRecommendationResult | null>(null);
  const [hasSyncedSoil, setHasSyncedSoil] = useState(false);
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
  const [showSoilCustomizer, setShowSoilCustomizer] = useState(false);
  const [lastRecalculatedAt, setLastRecalculatedAt] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleDiagnoseWithData = useCallback(async (dataToUse: PesticideRecommendationInput) => {
    if (!dataToUse.soilReportId?.trim()) {
      setRequestError('Save or select a soil report in Soil Analysis before requesting field guidance. No recommendation was generated.');
      return;
    }
    if (!dataToUse.crop?.trim() || !dataToUse.observedProblem?.trim() || !dataToUse.growthStage?.trim()) {
      setRequestError('Select the actual crop and growth stage, then describe the observed pest, disease, or symptoms.'); return;
    }
    setLoading(true);
    setRequestError(null);
    try {
      const response = await getPesticideRecommendation(dataToUse);
      setResult(response.diagnosis);
      try {
        localStorage.setItem(
          userScopedStorageKey('krishibhoomi_latest_pesticide_plan', user?.id),
          JSON.stringify({
            crop: dataToUse.crop,
            farmArea: dataToUse.farmArea,
            observedProblem: dataToUse.observedProblem,
            diagnosis: response.diagnosis,
            updatedAt: new Date().toISOString(),
          })
        );
        window.dispatchEvent(
          new CustomEvent('krishibhoomi_pesticide_updated', {
            detail: {
              crop: dataToUse.crop,
              farmArea: dataToUse.farmArea,
              observedProblem: dataToUse.observedProblem,
              diagnosis: response.diagnosis,
            },
          })
        );
      } catch {
        // ignore
      }
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastRecalculatedAt(timeStr);
      setNotificationMsg(`Advisory updated for ${dataToUse.farmArea} acres of ${dataToUse.crop} at ${timeStr}`);
      setTimeout(() => {
        setNotificationMsg(null);
      }, 4000);
    } catch (err) {
      console.error('Failed to get pesticide recommendation', err);
      setRequestError(err instanceof Error ? err.message : 'Pesticide advisory is unavailable. Please retry.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Auto-recalculate whenever inputs change (immediate for dropdowns, 350ms debounce for text/numbers)
  const triggerAutoRecalculate = useCallback(
    (updatedData: PesticideRecommendationInput, immediate: boolean = false) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (immediate) {
        handleDiagnoseWithData(updatedData);
      } else {
        debounceTimerRef.current = setTimeout(() => {
          handleDiagnoseWithData(updatedData);
        }, 350);
      }
    },
    [handleDiagnoseWithData]
  );

  // Clear debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [user?.id]);

  // Sync state from User Profile, Soil Analysis Service, Fertilizer Plan, and Crop Recommendations
  const syncSoilAndCropFromStorage = useCallback(
    (autoExecute: boolean = true) => {
      let nextCrop = '';
      let cropSource: string | null = null;
      const recCrops: string[] = [];

      // 1. Sync from AI Crop Recommendations
      try {
        const storedRecs =
          localStorage.getItem(userScopedStorageKey('krishibhoomi_crop_recommendations', user?.id)) ||
          localStorage.getItem(userScopedStorageKey('krishibhoomi_latest_crop_recommendations', user?.id));
        if (storedRecs) {
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
        }
      } catch (e) {
        console.warn('Failed to parse crop recommendations in pesticide module:', e);
      }

      // 2. Check active target crop or user preferred crop
      try {
        const activeTarget = localStorage.getItem(userScopedStorageKey('krishibhoomi_active_target_crop', user?.id));
        if (activeTarget && activeTarget.trim() && recCrops.includes(activeTarget.trim())) {
          nextCrop = activeTarget.trim();
          cropSource = 'Selected from crop recommendations';
        } else if (recCrops.length > 0) {
          nextCrop = recCrops[0];
          cropSource = 'Top ranked crop recommendation';
        } else if (user?.preferredCrop?.trim()) {
          nextCrop = user.preferredCrop;
          cropSource = 'Farmer profile preference';
        }
      } catch (e) {
        console.warn('Failed to check active target crop:', e);
      }

      // 3. Sync only from a verified user soil report. Never substitute a profile or regional baseline.
      try {
        const activeSoil = soilAnalysisService.getActiveAnalysis(user);
        const hasRealReport = Boolean(
          activeSoil?.isUserReport === true &&
          activeSoil.id
        );

        if (hasRealReport && activeSoil) {
          const p = activeSoil.parameters;
          const n = p.nitrogen?.value ?? null;
          const phosphorus = p.phosphorus?.value ?? null;
          const k = p.potassium?.value ?? null;
          const ph = p.ph?.value ?? null;
          const oc = p.organicCarbon?.value ?? null;
          const farmArea = Number(activeSoil.fieldMetadata?.farmArea) || Number(user?.farmArea) || 0;
          const soilType = activeSoil.fieldMetadata?.soilType || user?.soilType || '';

          setFormData({
            soilReportId: activeSoil.id,
            crop: nextCrop,
            growthStage: '',
            observedProblem: '',
            soilN: n,
            soilP: phosphorus,
            soilK: k,
            ph,
            organicCarbon: oc,
            farmArea,
            soilType,
            location: activeSoil.fieldMetadata?.location || user?.location || '',
          });
          setFarmAreaInput(farmArea > 0 ? String(farmArea) : '');
          setHasSyncedSoil(true);
          setSyncedCropSource(cropSource || 'Linked Soil Card');
          setSyncedSoilMeta({
            sampleName: activeSoil.sampleName || 'Soil Health Card',
            location: activeSoil.fieldMetadata?.location || user?.location,
            n, p: phosphorus, k, ph, oc, soilType, farmArea,
          });
          setBaselineSoil({ n, p: phosphorus, k, ph, oc, soilType, farmArea });
          return;
        }
      } catch (e) {
        console.warn('Failed to parse active soil report in pesticide module:', e);
      }

      setHasSyncedSoil(false);
      setSyncedSoilMeta(null);
      setBaselineSoil(null);
      setFormData((prev) => ({ ...prev, soilReportId: '', crop: nextCrop, soilN: undefined, soilP: undefined, soilK: undefined, ph: undefined, organicCarbon: undefined, farmArea: 0, soilType: '', observedProblem: '' }));
      setFarmAreaInput('');
      if (cropSource) setSyncedCropSource(cropSource);
    },
    [handleDiagnoseWithData, user]
  );

  // Initial sync and real-time event listeners across modules
  useEffect(() => {
    syncSoilAndCropFromStorage(false);

    const handleSoilUpdate = () => {
      syncSoilAndCropFromStorage(false);
    };

    const handleCropUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent?.detail?.source === 'pesticide_module') {
        return; // Avoid self-dispatch loop
      }

      if (customEvent?.detail?.targetCrop) {
        const newCrop = customEvent.detail.targetCrop;

        if (customEvent.detail.recommendations && Array.isArray(customEvent.detail.recommendations)) {
          const recList: RankedCropRecommendation[] = customEvent.detail.recommendations;
          const names = recList.map((r) => r.cropName).filter(Boolean);
          if (names.length > 0) setAvailableRecommendedCrops(names);
        }

        setFormData((prev) => {
          const updated: PesticideRecommendationInput = {
            ...prev,
            crop: newCrop,
            observedProblem: '',
          };
          setSyncedCropSource('Synced from Crop Recommendation');
          return updated;
        });
        return;
      }
      syncSoilAndCropFromStorage(false);
    };

    const handleFertilizerUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent?.detail?.source === 'pesticide_module') {
        return; // Avoid self-dispatch loop
      }

      if (customEvent?.detail) {
        const d = customEvent.detail;
        const targetCrop = d.targetCrop || formData.crop;

        setFormData((prev) => {
          const updated: PesticideRecommendationInput = {
            ...prev,
            crop: targetCrop,
            observedProblem: prev.observedProblem,
            farmArea: d.farmArea !== undefined ? Number(d.farmArea) : prev.farmArea,
            soilType: d.soilType || prev.soilType,
            soilN: d.soilN !== undefined ? Number(d.soilN) : prev.soilN,
            soilP: d.soilP !== undefined ? Number(d.soilP) : prev.soilP,
            soilK: d.soilK !== undefined ? Number(d.soilK) : prev.soilK,
            ph: d.ph !== undefined ? Number(d.ph) : prev.ph,
            organicCarbon: d.organicCarbon !== undefined ? Number(d.organicCarbon) : prev.organicCarbon,
          };
          setFarmAreaInput(String(updated.farmArea));
          setSyncedCropSource('Synced from Fertilizer Recommendation');
          return updated;
        });
      } else {
        syncSoilAndCropFromStorage(false);
      }
    };

    window.addEventListener('krishibhoomi_soil_updated', handleSoilUpdate);
    window.addEventListener('krishi:soil-updated', handleSoilUpdate);
    window.addEventListener('krishibhoomi_crop_updated', handleCropUpdate);
    window.addEventListener('krishi:crop-updated', handleCropUpdate);
    window.addEventListener('krishibhoomi_fertilizer_updated', handleFertilizerUpdate);
    window.addEventListener('krishi:fertilizer-sync-needed', handleCropUpdate);
    window.addEventListener('storage', handleSoilUpdate);

    return () => {
      window.removeEventListener('krishibhoomi_soil_updated', handleSoilUpdate);
      window.removeEventListener('krishi:soil-updated', handleSoilUpdate);
      window.removeEventListener('krishibhoomi_crop_updated', handleCropUpdate);
      window.removeEventListener('krishi:crop-updated', handleCropUpdate);
      window.removeEventListener('krishibhoomi_fertilizer_updated', handleFertilizerUpdate);
      window.removeEventListener('krishi:fertilizer-sync-needed', handleCropUpdate);
      window.removeEventListener('storage', handleSoilUpdate);
    };
  }, [
    syncSoilAndCropFromStorage,
    user?.id,
    user?.email,
    user?.farmArea,
    user?.soilType,
    user?.preferredCrop,
    user?.location,
    handleDiagnoseWithData,
  ]);

  const handleCropChange = (newCrop: string) => {
    const updated: PesticideRecommendationInput = {
      ...formData,
      crop: newCrop,
      observedProblem: formData.observedProblem,
    };
    setFormData(updated);

    try {
      localStorage.setItem(userScopedStorageKey('krishibhoomi_active_target_crop', user?.id), newCrop);
      window.dispatchEvent(
        new CustomEvent('krishibhoomi_crop_updated', {
          detail: { targetCrop: newCrop, source: 'pesticide_module' },
        })
      );
    } catch {
      // ignore
    }

    setRequestError(null);
  };

  const handleFarmAreaChange = (valStr: string) => {
    setFarmAreaInput(valStr);
    const parsed = Number(valStr);
    if (!Number.isFinite(parsed) || parsed <= 0) { setRequestError('Enter a valid farm area.'); return; }
    const updated: PesticideRecommendationInput = {
      ...formData,
      farmArea: parsed,
    };
    setFormData(updated);

    setRequestError(null);
  };

  const handleQuickAreaPreset = (acres: number) => {
    setFarmAreaInput(acres.toString());
    const updated: PesticideRecommendationInput = {
      ...formData,
      farmArea: acres,
    };
    setFormData(updated);

    setRequestError(null);
  };

  const handleInputChange = (field: keyof PesticideRecommendationInput, value: any) => {
    const updated: PesticideRecommendationInput = {
      ...formData,
      [field]: value,
    };
    setFormData(updated);

    setRequestError(null);
  };

  const handleResetSoilBaseline = () => {
    if (baselineSoil) {
      const restored: PesticideRecommendationInput = {
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
      triggerAutoRecalculate(restored, true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#E65100]" />
            <span className="text-[11px] font-bold text-[#E65100] uppercase tracking-wider">
              Plant Protection & Integrated Pest Management (IPM)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#37474F]">
            AI Pesticide & IPM Recommendation Engine
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Correlates plant pathology with your live soil health report and fertilizer schedule. Auto-scales chemical dosages to your farm acreage and prioritizes biological formulations with verified Pre-Harvest Intervals (PHI).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {user && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F1F8E9] text-[#2E7D32] border border-[#C8E6C9] rounded-xl text-xs font-bold">
              <UserCheck className="w-4 h-4" />
              {user.name || user.email.split('@')[0]}
            </span>
          )}
          {hasSyncedSoil && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] rounded-xl text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              Soil Lab Synced
            </span>
          )}
          <button
            onClick={() => handleDiagnoseWithData(formData)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E65100] hover:bg-[#BF360C] text-white text-xs font-extrabold rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Diagnosing...' : 'Re-run Diagnosis'}
          </button>
        </div>
      </div>

      {/* Dynamic Recalculation Toast Feedback */}
      {requestError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">{requestError}</div>}
      {notificationMsg && (
        <div className="bg-[#E8F5E9] border border-[#A5D6A7] text-[#2E7D32] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between shadow-2xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
            <span>{notificationMsg}</span>
          </div>
          {lastRecalculatedAt && (
            <span className="text-[11px] font-semibold text-[#388E3C] bg-white/70 px-2 py-0.5 rounded-md">
              Live Sync
            </span>
          )}
        </div>
      )}

      {/* Connected Soil Report & Crop Banner */}
      {syncedSoilMeta && (
        <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-2xl p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#E65100] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-[#E65100] uppercase tracking-wider">
                  Soil Chemistry & Disease Vulnerability Synced
                </span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#FFE082] font-extrabold text-[#E65100]">
                  Live Connected
                </span>
                {syncedCropSource && (
                  <span className="text-[10px] bg-white text-[#2E7D32] px-2 py-0.5 rounded-full border border-[#C8E6C9] font-bold flex items-center gap-1">
                    <Sprout className="w-3 h-3" />
                    {formData.crop}
                  </span>
                )}
              </div>
              <p className="text-sm font-extrabold text-[#37474F] mt-0.5">
                {syncedSoilMeta.sampleName} {syncedSoilMeta.location ? `• ${syncedSoilMeta.location}` : ''}
              </p>
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
                <span className="font-semibold text-[#E65100]">{formData.soilType}</span>
                <span>•</span>
                <span>Area: <strong className="text-[#37474F]">{formData.farmArea} Acres</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => syncSoilAndCropFromStorage(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#FFF3E0] text-[#E65100] border border-[#FFE082] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Re-sync Baseline
            </button>
          </div>
        </div>
      )}

      {/* Mandatory Regulatory Guidance Callout */}
      <div className="bg-[#FFF8E1] border-2 border-[#FFE082] rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-[#E65100] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs sm:text-sm font-extrabold text-[#E65100]">
            Mandatory Agricultural Safety Notice
          </h4>
          <p className="text-xs text-gray-700 font-semibold mt-0.5 leading-relaxed">
            "{MANDATORY_PESTICIDE_DISCLAIMER}"
          </p>
          <p className="text-[11px] text-gray-500 mt-1">
            Always verify label claims with the Central Insecticides Board & Registration Committee (CIB&RC) and adhere strictly to waiting intervals (PHI) before harvest.
          </p>
        </div>
      </div>

      {/* Diagnostic Form and Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Inputs (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="font-extrabold text-base text-[#37474F] flex items-center gap-2">
              <Bug className="w-5 h-5 text-[#E65100]" />
              Diagnostic & Field Inputs
            </h2>
            {lastRecalculatedAt && (
              <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#2E7D32]" />
                {lastRecalculatedAt}
              </span>
            )}
          </div>

          {/* Crop Selection */}
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
            <input list="actual-crop-options" value={formData.crop} onChange={(e) => handleCropChange(e.target.value)} placeholder="Enter your selected crop" className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-bold text-[#37474F]" />
            <datalist id="actual-crop-options">{availableRecommendedCrops.map((crop) => <option key={crop} value={crop} />)}</datalist>
          </div>

          {/* Cultivated Farm Area with Presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-[#37474F]">
                Cultivated Farm Area (Acres)
              </label>
              <span className="text-[10px] text-[#E65100] font-bold">
                Only your reported area is used; no chemical dose or cost is estimated.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0.25"
                max="500"
                step="0.25"
                value={farmAreaInput}
                onChange={(e) => handleFarmAreaChange(e.target.value)}
                className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
              />
              <span className="text-xs font-bold text-gray-500 shrink-0">Acres</span>
            </div>
            {/* Quick area preset pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[1, 2.5, 5, 10, 20].map((acres) => (
                <button
                  key={`pest-area-${acres}`}
                  type="button"
                  onClick={() => handleQuickAreaPreset(acres)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                    formData.farmArea === acres
                      ? 'bg-[#E65100] text-white border-[#E65100]'
                      : 'bg-[#F7FBF7] text-gray-600 border-gray-200 hover:border-[#E65100] hover:text-[#E65100]'
                  }`}
                >
                  {acres} {acres === 1 ? 'Acre' : 'Acres'}
                </button>
              ))}
            </div>
          </div>

          {/* Growth Stage Selection */}
          <div>
            <label className="block text-xs font-bold text-[#37474F] mb-1">
              Crop Growth Stage
            </label>
            <select
              value={formData.growthStage}
              onChange={(e) => handleInputChange('growthStage', e.target.value)}
              className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
            >
              <option value="">Select the observed growth stage</option>
              <option value="Seedling / Early Vegetative">Seedling / Early Vegetative</option>
              <option value="Tillering & Vegetative Surge">Tillering & Vegetative Surge (21-45 DAS)</option>
              <option value="Booting, Tasseling & Flowering">Booting, Tasseling & Flowering (46-70 DAS)</option>
              <option value="Pod Formation / Grain Filling">Pod Formation / Grain Filling (71-100 DAS)</option>
              <option value="Maturity / Pre-Harvest">Maturity / Pre-Harvest (100+ DAS)</option>
            </select>
          </div>

          {/* Observed Symptoms / Problem */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-[#37474F]">
                Observed Symptoms / Problem
              </label>
              <span className="text-[10px] text-gray-400">User-reported description</span>
            </div>
            <textarea
              rows={3}
              value={formData.observedProblem}
              onChange={(e) => handleInputChange('observedProblem', e.target.value)}
              placeholder="Describe discoloration, chewed leaves, holes, fungal powder, wilting, or insects..."
              className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-medium text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
            />
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            This feature does not analyze images or confirm a diagnosis. Describe what you observed; if the cause is unclear, share photographs with your local KVK/agricultural extension expert. No pesticide will be suggested without a verified crop/pest label source.
          </div>

          {/* Collapsible Soil Health & Chemistry Factors */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSoilCustomizer(!showSoilCustomizer)}
              className="w-full px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-xs font-bold text-[#37474F] cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-[#E65100]" />
                Soil Health & Vulnerability Baseline
              </span>
              {showSoilCustomizer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showSoilCustomizer && (
              <div className="p-3.5 bg-white space-y-3 border-t border-gray-200 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Soil Type</label>
                  <select
                    value={formData.soilType}
                    onChange={(e) => handleInputChange('soilType', e.target.value)}
                    className="w-full bg-[#F7FBF7] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#37474F]"
                  >
                    <option value="Deep Black Cotton Soil (Regur)">Deep Black Cotton Soil (Regur)</option>
                    <option value="Alluvial Loam / Indo-Gangetic Soil">Alluvial Loam (Indo-Gangetic)</option>
                    <option value="Red Sandy Loam">Red Sandy Loam</option>
                    <option value="Laterite / Acidic Coastal Soil">Laterite / Acidic Coastal</option>
                    <option value="Saline-Alkaline Clay">Saline-Alkaline Clay</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-0.5">Soil Nitrogen (N)</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={formData.soilN}
                        onChange={(e) => handleInputChange('soilN', Number(e.target.value))}
                        className="w-full bg-[#F7FBF7] border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold"
                      />
                      <span className="text-[10px] text-gray-400">kg/ha</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-0.5">Potassium (K)</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={formData.soilK}
                        onChange={(e) => handleInputChange('soilK', Number(e.target.value))}
                        className="w-full bg-[#F7FBF7] border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold"
                      />
                      <span className="text-[10px] text-gray-400">kg/ha</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-0.5">Soil pH</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.ph}
                      onChange={(e) => handleInputChange('ph', Number(e.target.value))}
                      className="w-full bg-[#F7FBF7] border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-0.5">Organic Carbon</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.05"
                        value={formData.organicCarbon}
                        onChange={(e) => handleInputChange('organicCarbon', Number(e.target.value))}
                        className="w-full bg-[#F7FBF7] border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold"
                      />
                      <span className="text-[10px] text-gray-400">%</span>
                    </div>
                  </div>
                </div>

                {baselineSoil && (
                  <button
                    type="button"
                    onClick={handleResetSoilBaseline}
                    className="w-full py-1.5 text-[11px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Reset to Soil Card Baseline
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Submit Action */}
          <button
            onClick={() => handleDiagnoseWithData(formData)}
            disabled={loading}
            className="w-full py-3 bg-[#E65100] hover:bg-[#BF360C] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Analyzing Pathology Rules...' : 'Diagnose & Recommend Treatment'}
          </button>
        </div>

        {/* Right Column: Treatment & Advisory Output (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-5">
          {result && (
            <>
              {/* Diagnosis Summary Card */}
              <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                      Farmer-reported observation · not diagnosed
                    </span>
                    <h2 className="text-xl font-black text-[#37474F] mt-0.5">
                      {translatePestName(result.possibleProblem, language)}
                    </h2>
                    {result.scientificName && (
                      <p className="text-xs italic text-gray-500 font-serif">
                        Causal Organism: {result.scientificName}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <VoiceListenButton
                      text={`${translatePestName(result.possibleProblem, language)}. ${result.problemCategory}. ${result.applicationGuidance.frequency}`}
                      size="sm"
                      variant="subtle"
                    />
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                      {result.problemCategory}
                    </span>
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full ${
                        result.severityLevel === 'Critical'
                          ? 'bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]'
                          : result.severityLevel === 'Severe'
                          ? 'bg-[#FFF8E1] text-[#E65100] border border-[#FFE082]'
                          : 'bg-[#F1F8E9] text-[#2E7D32] border border-[#C8E6C9]'
                      }`}
                    >
                      {result.severityLevel} Severity
                    </span>
                  </div>
                </div>

                {/* Area-Scaled Quantity Summary (Exact chemical and water scaled to farm acreage) */}
                {result.areaScaledQuantities && (
                  <div className="bg-[#F7FBF7] border border-[#C8E6C9] rounded-2xl p-4.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-[#2E7D32]" />
                        <h4 className="text-xs font-black text-[#2E7D32] uppercase tracking-wider">
                          Farm-Area Scaled Formulation Requirements ({formData.farmArea} Acres)
                        </h4>
                      </div>
                      <span className="text-[11px] font-bold text-gray-500">
                        Est. Cost: <strong className="text-[#2E7D32]">₹{result.areaScaledQuantities.estimatedCost.toLocaleString('en-IN')}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-2.5 bg-white rounded-xl border border-[#E0E0E0]">
                        <span className="text-[10px] font-bold text-gray-400 block uppercase">Total Chemical</span>
                        <p className="text-xs sm:text-sm font-black text-[#E65100] mt-0.5 truncate">
                          {result.areaScaledQuantities.chemicalTotal}
                        </p>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl border border-[#E0E0E0]">
                        <span className="text-[10px] font-bold text-gray-400 block uppercase">Total Spray Water</span>
                        <p className="text-xs sm:text-sm font-black text-[#1565C0] mt-0.5 truncate">
                          {result.areaScaledQuantities.waterTotal}
                        </p>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl border border-[#E0E0E0]">
                        <span className="text-[10px] font-bold text-gray-400 block uppercase">Knapsack Refills</span>
                        <p className="text-xs sm:text-sm font-black text-[#37474F] mt-0.5">
                          {result.areaScaledQuantities.knapsackRefills} tanks (16-20L)
                        </p>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl border border-[#E0E0E0]">
                        <span className="text-[10px] font-bold text-gray-400 block uppercase">Waiting Period</span>
                        <p className="text-xs sm:text-sm font-black text-[#E65100] mt-0.5">
                          {result.waitingPeriodDays === null ? 'Unavailable' : `${result.waitingPeriodDays} Days PHI`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Soil & Fertilizer Pathology Interaction Alert */}
                {(result.fertilizerInteractionInsight || result.soilVulnerabilityFactor || result.soilManagementIPM) && (
                  <div className="p-4.5 bg-[#FFF3E0] border border-[#FFE082] rounded-xl space-y-2">
                    <div className="flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 text-[#E65100]" />
                      <h4 className="text-xs font-extrabold text-[#E65100] uppercase tracking-wider">
                        Soil & Fertilizer Pathology Interaction
                      </h4>
                    </div>

                    {result.fertilizerInteractionInsight && (
                      <p className="text-xs text-[#37474F] font-bold leading-relaxed bg-white/70 p-2.5 rounded-lg border border-[#FFE082]">
                        🌾 {result.fertilizerInteractionInsight}
                      </p>
                    )}

                    {result.soilVulnerabilityFactor && (
                      <p className="text-xs text-gray-700 font-semibold leading-relaxed">
                        {result.soilVulnerabilityFactor}
                      </p>
                    )}

                    {result.soilManagementIPM && (
                      <div className="pt-2 border-t border-[#FFE082]/60 text-xs text-gray-600">
                        <strong className="text-[#E65100]">Soil Management Practice:</strong> {result.soilManagementIPM}
                      </div>
                    )}
                  </div>
                )}

                {/* Recommended Treatment: Bio vs Chemical Split */}
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold text-[#37474F] uppercase tracking-wider">
                    Tiered Integrated Pest Management (IPM) Solutions
                  </h3>

                  {/* Botanical / Bio Solution (Primary) */}
                  <div className="p-4 bg-[#F1F8E9] border border-[#C8E6C9] rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-[#2E7D32]" />
                        <h4 className="text-xs font-extrabold text-[#2E7D32] uppercase tracking-wider">
                          IPM checklist
                        </h4>
                      </div>
                      <span className="text-[10px] bg-white text-[#2E7D32] font-bold px-2 py-0.5 rounded-full border border-[#C8E6C9]">
                        No pesticide recommended
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 font-medium pl-6 leading-relaxed mt-1">
                      {result.recommendedTreatment.botanicalBio}
                    </p>
                  </div>

                  {/* Approved Chemical Backup (Conditional) */}
                  <div className="p-4 bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-gray-600" />
                        <h4 className="text-xs font-extrabold text-[#37474F] uppercase tracking-wider">
                        Chemical control
                        </h4>
                      </div>
                      <span className="text-[10px] bg-white text-[#E65100] font-bold px-2 py-0.5 rounded-full border border-gray-200">
                        Not provided
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium pl-6 leading-relaxed mt-1">
                      {result.recommendedTreatment.approvedChemical || 'No chemical recommendation: this project has no verified current Indian crop/pest registration and label source.'}
                    </p>
                  </div>
                </div>

                {/* All Treatment Options Breakdown (if available) */}
                {result.allTreatmentOptions && result.allTreatmentOptions.length > 0 && (
                  <div className="border border-[#E0E0E0] rounded-xl overflow-hidden">
                    <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs font-bold text-[#37474F] flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#2E7D32]" />
                        Ordered IPM steps
                      </span>
                      <span className="text-[10px] text-gray-400">No products or rates prescribed</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {result.allTreatmentOptions.map((opt, oIdx) => (
                        <div key={oIdx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                                  opt.type === 'Biological'
                                    ? 'bg-[#E8F5E9] text-[#2E7D32]'
                                    : 'bg-[#FFF3E0] text-[#E65100]'
                                }`}
                              >
                                {opt.type}
                              </span>
                              <strong className="text-[#37474F]">{opt.name}</strong>
                            </div>
                            <p className="text-gray-500 text-[11px] mt-0.5">
                              {opt.method}<br />Source: {opt.source || 'Not available'}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs font-black text-[#37474F] block">
                              {opt.totalNeeded}
                            </span>
                            {opt.cost > 0 && (
                              <span className="text-[11px] font-bold text-[#2E7D32]">
                                ≈ ₹{opt.cost.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900">
                  {result.applicationGuidance.timingAndWeather} {result.applicationGuidance.frequency}
                </div>

                {/* Safety Precautions & Pre-Harvest Interval (PHI) */}
                <div className="p-5 bg-[#FFF8E1]/60 border border-[#FFE082] rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-[#E65100] uppercase tracking-wider flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" />
                      Safety and identification limits
                    </h3>

                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-white border border-[#FFE082] text-[#E65100]">No treatment prescribed</span>
                  </div>

                  <ul className="space-y-2 text-xs text-gray-700">
                    {result.safetyPrecautions.map((precaution, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#E65100] shrink-0 mt-0.5" />
                        <span>{precaution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


