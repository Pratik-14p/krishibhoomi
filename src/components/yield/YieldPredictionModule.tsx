import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Scale,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  MapPin,
  User as UserIcon,
  FlaskConical,
  Bug,
  Leaf,
  Info,
  ChevronRight,
  Sliders,
  Compass,
  Upload,
} from 'lucide-react';
import {
  YieldPredictionInput,
  YieldPredictionResult,
} from '../../types';
import { predictCropYield } from '../../services/yieldPredictionService';
import { useAuth } from '../../context/AuthContext';
import { soilAnalysisService } from '../../services/soilAnalysisService';
import { userScopedStorageKey } from '../../services/userScopedStorage';
import { INDIAN_STATES_AND_UTS } from '../../data/indianStates';
import { useI18n } from '../../context/I18nContext';
import { translateCropName } from '../../utils/agriI18n';

export const YieldPredictionModule: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useI18n();

  const getInitialCrop = (): string => user?.preferredCrop || '';

  const initialLocation = user?.location || '';
  const initialSoilType = user?.soilType || '';

  const [formData, setFormData] = useState<YieldPredictionInput>(() => ({
    crop: getInitialCrop(),
    farmArea: user?.farmArea && user.farmArea > 0 ? user.farmArea : 0,
    soilN: 0,
    soilP: 0,
    soilK: 0,
    ph: 0,
    organicCarbon: 0,
    previousYield: 0,
    season: '',
    location: initialLocation,
    state: INDIAN_STATES_AND_UTS.find((state) => initialLocation.toLowerCase().includes(state.toLowerCase())) || '',
    district: '',
    soilType: initialSoilType,
    irrigationType: '',
    fertilizerPlanApplied: false,
    pesticideIpmManaged: false,
  }));

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<YieldPredictionResult | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [lastRecalculatedAt, setLastRecalculatedAt] = useState<string | null>(null);

  // Cross-module states
  const [hasSyncedSoil, setHasSyncedSoil] = useState(false);
  const [soilReportDate, setSoilReportDate] = useState<string | null>(null);
  const [connectedFertilizerPlan, setConnectedFertilizerPlan] = useState<any | null>(null);
  const [connectedPesticidePlan, setConnectedPesticidePlan] = useState<any | null>(null);
  const [availableRecommendedCrops, setAvailableRecommendedCrops] = useState<string[]>([]);
  const [activeCropSource, setActiveCropSource] = useState<string | null>(null);


  // Prevent concurrent duplicate submissions. Prediction requests are explicit:
  // this backend currently has no validated model and must not be spammed as
  // farmers edit each field.
  const predictionInFlightRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Core forecast calculation function
 const runPrediction = useCallback(async (inputToUse: YieldPredictionInput) => {
// Validate crop, state, season, and farm area
if (
!inputToUse.crop?.trim() ||
!inputToUse.state?.trim() ||
!inputToUse.season ||
!Number.isFinite(Number(inputToUse.farmArea)) ||
Number(inputToUse.farmArea) <= 0
) {
setRequestError(
'Select a crop, State/UT and season, and enter a positive cultivated area.'
);
setLoading(false);
return;
}

// Validate soil report measurements
const soilValues = [
inputToUse.soilN,
inputToUse.soilP,
inputToUse.soilK,
inputToUse.ph,
inputToUse.organicCarbon,
];

if (
!inputToUse.soilReportId ||
soilValues.some(
(value) => !Number.isFinite(Number(value)) || Number(value) <= 0
)
) {
setRequestError(
'A verified analyzed soil report with valid N, P, K, pH and Organic Carbon values is required.'
);
setLoading(false);
return;
}

if (predictionInFlightRef.current) return;

predictionInFlightRef.current = true;
setLoading(true);
setRequestError(null);

try {
      const response = await predictCropYield(inputToUse);
      setResult(response.prediction);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastRecalculatedAt(timeStr);
      setNotificationMsg(`Forecast updated for ${inputToUse.farmArea} acres of ${inputToUse.crop} in ${inputToUse.location || 'your farm'}`);
      setTimeout(() => setNotificationMsg(null), 4000);
    } catch (err) {
      console.error('Failed to compute yield prediction', err);
      setRequestError(err instanceof Error ? err.message : 'Yield prediction is unavailable. Please retry.');
    } finally {
      predictionInFlightRef.current = false;
      setLoading(false);
    }
  }, []);

  // Editing inputs invalidates old results, but does not send repeated requests.
  // The user can submit once the actual inputs are ready.
  const triggerAutoRecalculate = useCallback(
    (_updatedData: YieldPredictionInput, _immediate: boolean = false) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      setResult(null);
      setRequestError(null);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Sync state from User Profile, Soil Analysis Service, Fertilizer, and Pesticide modules
  const syncAllModulesAndProfile = useCallback(
    (autoExecute: boolean = true) => {
      // Priority 1: Check URL query parameter
      let urlCrop: string | null = null;
      try {
        const params = new URLSearchParams(window.location.search);
        urlCrop = params.get('crop');
      } catch {
        // ignore
      }

      let nextCrop = urlCrop || formData.crop;
      let nextFarmArea = formData.farmArea;
      let nextLocation = formData.location || (user?.location || '');
      let nextSoilType = formData.soilType || (user?.soilType || '');
      let nextSeason: 'Rabi' | 'Kharif' | 'Zaid' | '' = formData.season;
      let nextN = formData.soilN;
      let nextP = formData.soilP;
      let nextK = formData.soilK;
      let nextPh = formData.ph;
      let nextOc = formData.organicCarbon ?? 0;
      let nextSoilReportId = formData.soilReportId;
      let cropOrigin: string | null = urlCrop ? 'Live Crop Selection' : null;
      let soilSynced = false;
      let reportDate: string | null = null;
      const recCrops: string[] = [];

      // 1. Sync from User Profile (Account Awareness)
      if (user) {
        if (user.farmArea && user.farmArea > 0) {
          nextFarmArea = user.farmArea;
        }
        if (user.location && user.location.trim().length > 0) {
          nextLocation = user.location;
        }
        if (user.soilType && user.soilType.trim().length > 0) {
          nextSoilType = user.soilType;
        }
        if (user.preferredCrop && user.preferredCrop.trim().length > 0 && !urlCrop) {
          nextCrop = user.preferredCrop;
          cropOrigin = 'User Account Preferred Crop';
        }
      }

      // 2. Sync from Crop Recommendation Module
      try {
        const storedRecs = localStorage.getItem(userScopedStorageKey('krishibhoomi_crop_recommendations', user?.id));
        if (storedRecs) {
          const parsed = JSON.parse(storedRecs);
          if (Array.isArray(parsed)) {
            parsed.forEach((item: any) => {
              const name = item.cropName || item.name;
              if (name && !recCrops.includes(name)) recCrops.push(name);
            });
          }
        }
      } catch (err) {
        console.warn('Error syncing crop recommendations:', err);
      }

      // 3. Sync from Soil Analysis Service
      try {
        const activeSoil = soilAnalysisService.getActiveAnalysis(user);
        const hasRealReport = Boolean(
          activeSoil &&
          activeSoil.isUserReport === true &&
          activeSoil.analyzedAt &&
          activeSoil.analyzedAt !== '' &&
          (activeSoil.parameters?.nitrogen?.value > 0 || activeSoil.parameters?.ph?.value > 0)
        );

        if (hasRealReport && activeSoil.parameters) {
          nextSoilReportId = activeSoil.id;
          nextN = activeSoil.parameters.nitrogen.value;
          nextP = activeSoil.parameters.phosphorus.value;
          nextK = activeSoil.parameters.potassium.value;
          nextPh = activeSoil.parameters.ph.value;
          nextOc = activeSoil.parameters.organicCarbon.value;
          if (activeSoil.fieldMetadata?.farmArea) nextFarmArea = activeSoil.fieldMetadata.farmArea;
          if (activeSoil.fieldMetadata?.location) nextLocation = activeSoil.fieldMetadata.location;
          if (activeSoil.fieldMetadata?.soilType) nextSoilType = activeSoil.fieldMetadata.soilType;
          const savedSeason = activeSoil.fieldMetadata?.season.trim().toLowerCase();
          if (savedSeason === 'rabi' || savedSeason === 'winter') nextSeason = 'Rabi';
          else if (savedSeason === 'kharif' || savedSeason === 'monsoon') nextSeason = 'Kharif';
          else if (savedSeason === 'zaid' || savedSeason === 'summer') nextSeason = 'Zaid';
          soilSynced = true;
          reportDate = activeSoil.analyzedAt;

        } else {
          // No verified soil report: keep soil values empty. Never substitute a regional/sample profile.
          nextN = 0;
          nextP = 0;
          nextK = 0;
          nextPh = 0;
          nextOc = 0;

          soilSynced = false;
        }
      } catch (err) {
        console.warn('Error reading active soil analysis:', err);
      }

      // 4. Sync from Fertilizer Recommendation Module
      let fertPlanObj: any = null;
      try {
        const storedFert = localStorage.getItem(userScopedStorageKey('krishibhoomi_latest_fertilizer_plan', user?.id));
        if (storedFert) {
          fertPlanObj = JSON.parse(storedFert);
          if (fertPlanObj.targetCrop && !cropOrigin) {
            nextCrop = fertPlanObj.targetCrop;
            cropOrigin = 'Fertilizer Recommendation Plan';
          }
        }
      } catch (err) {
        console.warn('Error syncing fertilizer plan:', err);
      }

      // 5. Sync from Pesticide / IPM Module
      let pestPlanObj: any = null;
      try {
        const storedPest = localStorage.getItem(userScopedStorageKey('krishibhoomi_latest_pesticide_plan', user?.id));
        if (storedPest) {
          pestPlanObj = JSON.parse(storedPest);
        }
      } catch (err) {
        console.warn('Error syncing pesticide plan:', err);
      }

      // Historical comparison is optional; never fabricate a previous-yield baseline.
      const defaultPrev = 0;

     const updatedInput: YieldPredictionInput = {
soilReportId: nextSoilReportId,
crop: nextCrop,
farmArea: nextFarmArea,
soilN: nextN,
soilP: nextP,
soilK: nextK,
ph: nextPh,
organicCarbon: nextOc,
previousYield: formData.previousYield || 0,
season: nextSeason,
state: formData.state || '',
district: formData.district || '',
location: nextLocation,
soilType: nextSoilType,
irrigationType: formData.irrigationType || '',
fertilizerPlanApplied: Boolean(fertPlanObj),
pesticideIpmManaged: Boolean(pestPlanObj),
pestThreatMitigated:
pestPlanObj?.threatEvaluated || pestPlanObj?.observedProblem,
};

      setFormData(updatedInput);
      setHasSyncedSoil(soilSynced);
      setSoilReportDate(reportDate);
      setConnectedFertilizerPlan(fertPlanObj);
      setConnectedPesticidePlan(pestPlanObj);
      setAvailableRecommendedCrops(recCrops);
      setActiveCropSource(cropOrigin);

      // Prediction is an explicit user action, not an automatic request on
      // mount or every cross-module state update.
      void autoExecute;
    },
    [user, formData.crop, formData.farmArea, formData.location, formData.soilType, formData.season, formData.soilN, formData.soilP, formData.soilK, formData.ph, formData.organicCarbon, formData.irrigationType, runPrediction]
  );

  // Initial mount & user account changes
  useEffect(() => {
    syncAllModulesAndProfile(true);
  }, [user?.id, user?.location, user?.farmArea]);

  // Global Cross-Module Event Listeners
  useEffect(() => {
    const handleCropUpdated = (e: any) => {
      const targetCrop = e.detail?.targetCrop || e.detail?.cropName;
      if (targetCrop) {
        setFormData((prev) => {
          const updated: YieldPredictionInput = {
            ...prev,
            crop: targetCrop,
            previousYield: 0,
          };
          triggerAutoRecalculate(updated, true);
          return updated;
        });
        setActiveCropSource('Live AI Crop Recommendation');
        if (e.detail?.recommendations && Array.isArray(e.detail.recommendations)) {
          const names = e.detail.recommendations.map((r: any) => r.cropName || r.name).filter(Boolean);
          setAvailableRecommendedCrops(names);
        }
      }
    };

    const handleFertilizerUpdated = (e: any) => {
      const det = e.detail || {};
      setConnectedFertilizerPlan(det);
      setFormData((prev) => {
        const updated: YieldPredictionInput = {
          ...prev,
          crop: det.targetCrop || prev.crop,
          farmArea: det.farmArea ? Number(det.farmArea) : prev.farmArea,
          soilN: det.soilN !== undefined ? Number(det.soilN) : prev.soilN,
          soilP: det.soilP !== undefined ? Number(det.soilP) : prev.soilP,
          soilK: det.soilK !== undefined ? Number(det.soilK) : prev.soilK,
          ph: det.ph !== undefined ? Number(det.ph) : prev.ph,
          organicCarbon: det.organicCarbon !== undefined ? Number(det.organicCarbon) : prev.organicCarbon,
          fertilizerPlanApplied: true,
        };
        triggerAutoRecalculate(updated, true);
        return updated;
      });
      if (det.targetCrop) {
        setActiveCropSource('Fertilizer Recommendation Plan');
      }
    };

    const handlePesticideUpdated = (e: any) => {
      const det = e.detail || {};
      setConnectedPesticidePlan(det);
      setFormData((prev) => {
        const updated: YieldPredictionInput = {
          ...prev,
          crop: det.crop || prev.crop,
          farmArea: det.farmArea ? Number(det.farmArea) : prev.farmArea,
          pesticideIpmManaged: true,
          pestThreatMitigated: det.threatEvaluated || det.observedProblem,
        };
        triggerAutoRecalculate(updated, true);
        return updated;
      });
    };

    const handleProfileUpdated = (e: any) => {
      const updatedUser = e?.detail?.user || user;
      if (updatedUser) {
        setFormData((prev) => {
          const loc = updatedUser.location || prev.location;
          const soil = updatedUser.soilType || prev.soilType;
          const updated: YieldPredictionInput = {
            ...prev,
            farmArea: updatedUser.farmArea && updatedUser.farmArea > 0 ? updatedUser.farmArea : prev.farmArea,
            location: loc,
            soilType: soil,
            soilN: hasSyncedSoil ? prev.soilN : 0,
            soilP: hasSyncedSoil ? prev.soilP : 0,
            soilK: hasSyncedSoil ? prev.soilK : 0,
            ph: hasSyncedSoil ? prev.ph : 0,
            organicCarbon: hasSyncedSoil ? prev.organicCarbon : 0,
          };
          triggerAutoRecalculate(updated, true);
          return updated;
        });
      }
    };

    const handleSoilUpdated = () => {
      syncAllModulesAndProfile(true);
    };

    window.addEventListener('krishibhoomi_crop_updated', handleCropUpdated);
    window.addEventListener('krishi:crop-updated', handleCropUpdated);
    window.addEventListener('krishi:yield-sync-needed', handleCropUpdated);
    window.addEventListener('krishibhoomi_fertilizer_updated', handleFertilizerUpdated);
    window.addEventListener('krishi:fertilizer-sync-needed', handleFertilizerUpdated);
    window.addEventListener('krishibhoomi_pesticide_updated', handlePesticideUpdated);
    window.addEventListener('krishi:pesticide-updated', handlePesticideUpdated);
    window.addEventListener('krishi:profile-updated', handleProfileUpdated);
    window.addEventListener('krishibhoomi_soil_updated', handleSoilUpdated);
    window.addEventListener('storage', handleSoilUpdated);

    return () => {
      window.removeEventListener('krishibhoomi_crop_updated', handleCropUpdated);
      window.removeEventListener('krishi:crop-updated', handleCropUpdated);
      window.removeEventListener('krishi:yield-sync-needed', handleCropUpdated);
      window.removeEventListener('krishibhoomi_fertilizer_updated', handleFertilizerUpdated);
      window.removeEventListener('krishi:fertilizer-sync-needed', handleFertilizerUpdated);
      window.removeEventListener('krishibhoomi_pesticide_updated', handlePesticideUpdated);
      window.removeEventListener('krishi:pesticide-updated', handlePesticideUpdated);
      window.removeEventListener('krishi:profile-updated', handleProfileUpdated);
      window.removeEventListener('krishibhoomi_soil_updated', handleSoilUpdated);
      window.removeEventListener('storage', handleSoilUpdated);
    };
  }, [triggerAutoRecalculate, syncAllModulesAndProfile, hasSyncedSoil, user]);

  // Handle direct field input updates with immediate reactive feedback
  const handleInputChange = (field: keyof YieldPredictionInput, value: any) => {
    let updated: YieldPredictionInput = {
      ...formData,
      [field]: value,
    };

    if (field === 'crop') {
      updated.previousYield = 0;
    }



    setFormData(updated);

    // Instant client-side feedback for scaled total production
    if (field === 'farmArea' && result) {
      const newArea = Number(value);
      if (!Number.isFinite(newArea) || newArea <= 0) { setResult(null); return; }
      setResult((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          farmArea: newArea,
          expectedTotalProduction: Number((prev.expectedYield * newArea).toFixed(1)),
          previousTotalProduction: Number((prev.previousYield * newArea).toFixed(1)),
          averageTotalProduction: Number((prev.averageYield * newArea).toFixed(1)),
          comparisonChartData: prev.comparisonChartData.map((d) => ({
            ...d,
            totalYield: Number((d.yieldPerAcre * newArea).toFixed(1)),
          })),
        };
      });
    }

    const isImmediate = ['crop', 'season', 'location', 'soilType', 'irrigationType', 'fertilizerPlanApplied', 'pesticideIpmManaged'].includes(field);
    triggerAutoRecalculate(updated, isImmediate);
  };

  const handleApplyRegionalBenchmarkManual = () => {
    setNotificationMsg('Regional benchmark values are not used as substitutes for your verified soil report. Upload a Soil Health Card or enter actual lab values.');
    setTimeout(() => setNotificationMsg(null), 4500);
  };

  const handleQuickAreaPreset = (acres: number) => {
    handleInputChange('farmArea', acres);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Account & Live Sync Status */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
            <span className="text-[11px] font-bold text-[#2E7D32] uppercase tracking-wider">
              Harvest Forecasting & Agro-Climatic Intelligence
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#37474F]">
            AI Harvest Yield Prediction Engine
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Uses your selected crop, location, season, and authenticated soil report. A yield estimate is shown only when a validated prediction source is available.
          </p>

          {/* User Account & Location Context Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-semibold">
              <UserIcon className="w-3.5 h-3.5 text-gray-500" />
              <span>{user?.name || 'Farmer Account'}</span>
              <span className="text-gray-400 font-normal">({user?.email || 'Active User'})</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F1F8E9] border border-[#DCEDC8] rounded-lg text-[#33691E] font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>{formData.location || user?.location || 'Location not selected'}</span>
            </div>

            {hasSyncedSoil ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] rounded-lg font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Soil Lab Card Linked {soilReportDate ? `(${soilReportDate})` : ''}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-semibold">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Awaiting Verified Soil Data</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!hasSyncedSoil && (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('krishi:open-soil-upload'))}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Soil Card
            </button>
          )}
          <button
            onClick={() => syncAllModulesAndProfile(true)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#2E7D32] text-[#2E7D32] hover:bg-[#E8F5E9] text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            title="Re-synchronize with Soil Card, Crop and Fertilizer Modules"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Sync All Modules
          </button>
          <button
            onClick={() => runPrediction(formData)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-extrabold rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Computing Projections...' : 'Predict & Recalculate'}
          </button>
        </div>
      </div>

      {/* Real-time Notification Banner */}
      {requestError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">{requestError}</div>}
      {notificationMsg && (
        <div className="bg-[#E8F5E9] border border-[#A5D6A7] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-[#1B5E20] font-bold shadow-2xs transition-all animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
            <span>{notificationMsg}</span>
          </div>
          {lastRecalculatedAt && (
            <span className="text-[11px] text-[#388E3C] font-normal">Synced at {lastRecalculatedAt}</span>
          )}
        </div>
      )}

      {/* Cross-Module Integration Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Crop Recommendation Sync */}
        <div className="bg-white border border-[#E0E0E0] rounded-xl p-3 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Crop Recommendation</p>
              <p className="text-xs font-extrabold text-[#37474F] truncate max-w-[180px]">
                {formData.crop}
              </p>
            </div>
          </div>
          {activeCropSource && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
              Connected
            </span>
          )}
        </div>

        {/* 2. Fertilizer Recommendation Sync */}
        <div className="bg-white border border-[#E0E0E0] rounded-xl p-3 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E3F2FD] flex items-center justify-center text-[#1565C0]">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Fertilizer Schedule</p>
              <p className="text-xs font-extrabold text-[#37474F] truncate max-w-[180px]">
                {connectedFertilizerPlan ? 'Precision RDF Splits Applied' : 'Standard Balanced NPK'}
              </p>
            </div>
          </div>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${connectedFertilizerPlan ? 'bg-[#E3F2FD] text-[#1565C0] border border-[#BBDEFB]' : 'bg-gray-100 text-gray-600'}`}>
            {formData.fertilizerPlanApplied ? '+14% Uplift' : 'Off'}
          </span>
        </div>

        {/* 3. Pesticide & IPM Sync */}
        <div className="bg-white border border-[#E0E0E0] rounded-xl p-3 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFF3E0] flex items-center justify-center text-[#E65100]">
              <Bug className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Plant Protection (IPM)</p>
              <p className="text-xs font-extrabold text-[#37474F] truncate max-w-[180px]">
                {connectedPesticidePlan?.threatEvaluated || connectedPesticidePlan?.observedProblem || 'Prophylactic IPM Shield'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2]">
            {formData.pesticideIpmManaged ? 'Protected' : 'Unmanaged'}
          </span>
        </div>
      </div>

      {/* Grid: Inputs Form Left (4 cols), Results and Chart Right (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Input Controls */}
        <div className="lg:col-span-4 bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="font-extrabold text-base text-[#37474F] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#2E7D32]" />
              Live Forecast Parameters
            </h2>
            <span className="text-[11px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-md">
              Request estimate
            </span>
          </div>

          {/* Farm Location / Agro-Climatic Zone */}
          <div>
            <label className="block text-xs font-bold text-[#37474F] mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                Farm Location (District & State)
              </span>
              <span className="text-[10px] text-gray-400 font-normal">Use your actual farm location</span>
            </label>
            <select value={formData.state || ''} onChange={(e) => { const state = e.target.value; setFormData(prev => ({ ...prev, state, location: prev.district ? `${prev.district}, ${state}` : state })); }} className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-bold text-[#37474F]">
              <option value="">Select State or Union Territory</option>
              {INDIAN_STATES_AND_UTS.map((state) => <option key={state} value={state}>{state}</option>)}
            </select>
            <input value={formData.district || ''} onChange={(e) => { const district=e.target.value; setFormData(prev => ({ ...prev, district, location: [district, prev.state].filter(Boolean).join(', ') })); }} placeholder="District (enter actual district)" className="mt-2 w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs" />
          </div>

          {/* Crop Selection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-[#37474F]">
                Target Crop & Variety
              </label>
              {activeCropSource && (
                <span className="text-[10px] text-[#2E7D32] font-semibold">
                  Source: {activeCropSource}
                </span>
              )}
            </div>
            <input list="yield-crop-options" value={formData.crop} onChange={(e) => handleInputChange('crop', e.target.value)} placeholder="Enter your selected crop" className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-bold text-[#37474F]" />
            <datalist id="yield-crop-options">{availableRecommendedCrops.map((crop) => <option key={crop} value={crop} />)}</datalist>
          </div>

          {/* Farm Area with Quick Acreage Presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-[#37474F]">
                Farm Area (Acres)
              </label>
              <span className="text-[10px] text-gray-400 font-medium">Quick presets:</span>
            </div>

            <div className="flex items-center gap-1.5 mb-2">
              {[1, 2.5, 5, 10, 20].map((acres) => (
                <button
                  key={acres}
                  type="button"
                  onClick={() => handleQuickAreaPreset(acres)}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                    Number(formData.farmArea) === acres
                      ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                      : 'bg-[#F7FBF7] text-gray-700 border-[#E0E0E0] hover:bg-gray-100'
                  }`}
                >
                  {acres} {acres === 1 ? 'Ac' : 'Acs'}
                </button>
              ))}
            </div>

            <input
              type="number"
              step="0.5"
              min="0.25"
              value={formData.farmArea}
              onChange={(e) => handleInputChange('farmArea', Number(e.target.value))}
              className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
            />
          </div>

          {/* Season & Soil Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#37474F] mb-1">
                Crop Season
              </label>
              <select
                value={formData.season}
                onChange={(e) => handleInputChange('season', e.target.value as YieldPredictionInput['season'])}
                className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
              >
                <option value="">Select season</option>
                <option value="Rabi">Rabi (Winter/Spring)</option>
                <option value="Kharif">Kharif (Monsoon)</option>
                <option value="Zaid">Zaid (Summer)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#37474F] mb-1">
                Soil Classification
              </label>
              <input
                type="text"
                value={formData.soilType || ''}
                onChange={(e) => handleInputChange('soilType', e.target.value)}
                className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
                placeholder="Soil classification from report, if available"
              />
            </div>
          </div>

          {/* Previous Yield (Historical Anchor) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-[#37474F]">
                Previous Historical Yield (Qtl/Acre)
              </label>
              <span className="text-[10px] text-gray-400">Past performance baseline</span>
            </div>
            <input
              type="number"
              step="0.1"
              min="0.5"
              max="500"
              value={formData.previousYield}
              onChange={(e) => handleInputChange('previousYield', parseFloat(e.target.value) || 0)}
              className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
            />
          </div>

          {/* Soil Test Parameters (N, P, K, pH, OC) */}
          <div className="pt-3 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block">
                Soil Nutrient Assay
              </span>
              {hasSyncedSoil && (
                <span className="text-[10px] text-[#2E7D32] font-bold">Lab Calibrated</span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-0.5">N (kg/ha)</label>
                <input
                  type="number"
                  value={formData.soilN}
                  onChange={(e) => handleInputChange('soilN', parseInt(e.target.value) || 0)}
                  className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-0.5">P (kg/ha)</label>
                <input
                  type="number"
                  value={formData.soilP}
                  onChange={(e) => handleInputChange('soilP', parseInt(e.target.value) || 0)}
                  className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-0.5">K (kg/ha)</label>
                <input
                  type="number"
                  value={formData.soilK}
                  onChange={(e) => handleInputChange('soilK', parseInt(e.target.value) || 0)}
                  className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-0.5">Soil pH</label>
                <input
                  type="number"
                  step="0.1"
                  min="4.0"
                  max="9.5"
                  value={formData.ph}
                  onChange={(e) => handleInputChange('ph', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-0.5">Organic Carbon (%)</label>
                <input
                  type="number"
                  step="0.05"
                  min="0.1"
                  max="2.5"
                  value={formData.organicCarbon ?? 0}
                  onChange={(e) => handleInputChange('organicCarbon', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
                />
              </div>
            </div>
          </div>

          {/* Synergy Toggles: Fertilizer Plan & Pesticide Management */}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block">
              Cross-Module Synergy Controls
            </span>

            <label className="flex items-center justify-between p-2.5 bg-[#F7FBF7] rounded-xl border border-[#E0E0E0] cursor-pointer hover:border-[#2E7D32] transition-colors">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-[#1565C0]" />
                <div>
                  <p className="text-xs font-bold text-[#37474F]">Apply Recommended Fertilizer Plan</p>
                  <p className="text-[10px] text-gray-400">Nutrient splits boost grain filling</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.fertilizerPlanApplied ?? true}
                onChange={(e) => handleInputChange('fertilizerPlanApplied', e.target.checked)}
                className="w-4 h-4 text-[#2E7D32] rounded focus:ring-0 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-[#F7FBF7] rounded-xl border border-[#E0E0E0] cursor-pointer hover:border-[#2E7D32] transition-colors">
              <div className="flex items-center gap-2">
                <Bug className="w-4 h-4 text-[#E65100]" />
                <div>
                  <p className="text-xs font-bold text-[#37474F]">Apply IPM Plant Protection</p>
                  <p className="text-[10px] text-gray-400">Averts catastrophic pest crop defoliation</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.pesticideIpmManaged ?? true}
                onChange={(e) => handleInputChange('pesticideIpmManaged', e.target.checked)}
                className="w-4 h-4 text-[#2E7D32] rounded focus:ring-0 cursor-pointer"
              />
            </label>
          </div>

          {/* Action Button */}
          <button
            onClick={() => runPrediction(formData)}
            disabled={loading}
            className="w-full py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Running ML Projection Model...' : 'Calculate Yield Forecast'}
          </button>
        </div>

        {/* Right Column: Prediction Metrics, Comparisons, and Growth Projections */}
        <div className="lg:col-span-8 space-y-6">

      {result ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Expected Yield */}
            <div className="bg-white border border-[#C8E6C9] ring-2 ring-[#E8F5E9] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-[#2E7D32] uppercase tracking-wider">
                  Expected Yield
                </span>

                {Number.isFinite(result.percentageGainOverPrevious) ? (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                      result.percentageGainOverPrevious >= 0
                        ? 'bg-[#E8F5E9] text-[#2E7D32]'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {result.percentageGainOverPrevious >= 0 ? '+' : ''}
                    {result.percentageGainOverPrevious}% Gain
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-gray-500">
                    Gain unavailable
                  </span>
                )}
              </div>

              <p className="text-xl sm:text-2xl font-black text-[#2E7D32]">
                {Number.isFinite(result.expectedYield)
                  ? result.expectedYield
                  : 'Unavailable'}{' '}
                <span className="text-xs font-bold text-gray-500">
                  Qtl/Acre
                </span>
              </p>

              <p className="text-[11px] text-gray-500 font-medium">
                {Number.isFinite(result.expectedYield)
                  ? 'Estimated yield based on available validated data'
                  : 'A validated yield estimate is not available'}
              </p>
            </div>

            {/* 2. Expected Total Production */}
            <div className="bg-white border border-[#BBDEFB] ring-1 ring-[#E3F2FD] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-1">
              <span className="text-[10px] font-extrabold text-[#1565C0] uppercase tracking-wider block">
                Expected Total Production
              </span>
              <p className="text-xl sm:text-2xl font-black text-[#1565C0]">
                {result.expectedTotalProduction}{' '}
                <span className="text-xs font-bold text-gray-500">Quintals</span>
              </p>
              <p className="text-[11px] text-gray-500 font-medium">
                For your {result.farmArea} acre parcel
              </p>
            </div>

            {/* 3. Previous Yield */}
            <div className="bg-white border border-[#E0E0E0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-1">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                Previous Yield
              </span>
              <p className="text-xl sm:text-2xl font-black text-gray-700">
                {result.previousYield}{' '}
                <span className="text-xs font-bold text-gray-400">Qtl/Acre</span>
              </p>
              <p className="text-[11px] text-gray-500 font-medium">
                Total: {result.previousTotalProduction} Quintals
              </p>
            </div>

            {/* 4. District Benchmark */}
            <div className="bg-white border border-[#E0E0E0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-1">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                District Benchmark
              </span>
              <p className="text-xl sm:text-2xl font-black text-[#78909C]">
                {result.averageYield}{' '}
                <span className="text-xs font-bold text-gray-400">Qtl/Acre</span>
              </p>
              <p className="text-[11px] text-gray-500 font-medium truncate">
                {result.location || 'Location not provided'}
              </p>
            </div>
          </div>

              {/* Comparison Chart Section */}
              <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
                  <div>
                    <h3 className="font-extrabold text-base text-[#37474F]">
                      Yield Comparison Analysis (Quintals per Acre & Total Harvest)
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Comparing historical harvest vs {result.location || 'district'} regional benchmark vs AI target for {translateCropName(result.crop, language)}
                    </p>
                  </div>

                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] self-start sm:self-auto">
                    {result.confidenceScore}% Model Confidence
                  </span>
                </div>

                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={result.comparisonChartData}
                      margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                      <XAxis dataKey="category" tick={{ fill: '#37474F', fontSize: 12, fontWeight: 600 }} />
                      <YAxis tick={{ fill: '#78909C', fontSize: 11 }} />
                      <Tooltip
                        formatter={(val: any, name: any) => [
                          `${val} ${name === 'yieldPerAcre' ? 'Qtl/Acre' : 'Total Quintals'}`,
                          name === 'yieldPerAcre' ? 'Yield Rate' : 'Total Parcel Harvest',
                        ]}
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '12px',
                          border: '1px solid #E0E0E0',
                          fontSize: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        }}
                      />
                      <Legend
                        formatter={(val) => (val === 'yieldPerAcre' ? 'Yield per Acre (Quintals)' : 'Total Harvest for Farm (Quintals)')}
                        wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                      />
                      <Bar dataKey="yieldPerAcre" fill="#2E7D32" radius={[6, 6, 0, 0]} barSize={36} />
                      <Bar dataKey="totalYield" fill="#81C784" radius={[6, 6, 0, 0]} barSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Crop Biomass & Phenology Projection */}
              {result.monthlyGrowthProjection && result.monthlyGrowthProjection.length > 0 && (
                <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <div>
                      <h3 className="font-extrabold text-base text-[#37474F] flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#2E7D32]" />
                        Monthly Phenological Growth & Biomass Accumulation
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Projected vegetative expansion and milestone tracking through harvest for {result.season} season
                      </p>
                    </div>
                  </div>

                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={result.monthlyGrowthProjection}
                        margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorBiomass" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#2E7D32" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                        <XAxis dataKey="month" tick={{ fill: '#37474F', fontSize: 11, fontWeight: 600 }} />
                        <YAxis domain={[0, 100]} tick={{ fill: '#78909C', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                        <Tooltip
                          formatter={(val: any) => [`${val}% Biomass Accumulation`, 'Growth Index']}
                          labelFormatter={(label: any) => `Stage: ${label}`}
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #E0E0E0',
                            fontSize: '12px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="expectedBiomassPercentage"
                          stroke="#2E7D32"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#colorBiomass)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Growth Milestones Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                    {result.monthlyGrowthProjection.map((m, idx) => (
                      <div key={idx} className="bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl p-2.5 space-y-1">
                        <span className="text-[10px] font-extrabold text-[#2E7D32] block">{m.month}</span>
                        <p className="text-xs font-bold text-[#37474F]">{m.expectedBiomassPercentage}% Biomass</p>
                        <p className="text-[10px] text-gray-500 leading-tight line-clamp-2">{m.keyMilestone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary Drivers & Agronomic Risk Mitigations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Positive Drivers */}
                <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs space-y-3">
                  <h4 className="text-xs font-extrabold text-[#2E7D32] uppercase tracking-wider flex items-center gap-1.5">
                    <ArrowUpRight className="w-4 h-4" />
                    Key Yield Boost Drivers
                  </h4>
                  <ul className="space-y-2.5 text-xs text-gray-700">
                    {(result.primaryDrivers ?? []).map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risk Mitigations & Protection Checkpoints */}
                <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs space-y-3">
                  <h4 className="text-xs font-extrabold text-[#1565C0] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Agronomic Protection Checkpoints
                  </h4>
                  <ul className="space-y-2.5 text-xs text-gray-700">
                    {(result.riskMitigations ?? []).map((m, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-[#1565C0] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : loading ? (
            <div className="bg-white border border-[#E0E0E0] rounded-2xl p-12 text-center shadow-2xs space-y-3">
              <RefreshCw className="w-9 h-9 text-[#2E7D32] animate-spin mx-auto" />
              <p className="text-base font-extrabold text-[#37474F]">Calculating harvest forecast model...</p>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Checking the authenticated soil report and selected crop data. No regional benchmark is substituted.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-[#E0E0E0] rounded-2xl p-10 text-center shadow-2xs space-y-4">
              <div className="w-14 h-14 bg-[#E8F5E9] text-[#2E7D32] rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#37474F]">
                  Ready to Predict Harvest Yield
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                  A yield estimate is returned only when a validated yield model or verified local data source is configured.
                </p>
              </div>
              <button
                type="button"
                onClick={() => runPrediction(formData)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-extrabold rounded-xl shadow-2xs transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Calculate Harvest Forecast
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};







