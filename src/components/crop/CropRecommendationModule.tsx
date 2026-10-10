import React, { useState, useEffect, useCallback } from 'react';
import {
  Sprout,
  TrendingUp,
  Coins,
  ArrowRight,
  Sparkles,
  Layers,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileText,
  X,
  RefreshCw,
  Droplets,
  Scale,
  DollarSign,
  Info,
  FlaskConical,
  Upload,
  MapPin,
  Compass,
  Store,
  Globe,
  Search,
  ShieldCheck,
  Leaf,
} from 'lucide-react';
import {
  CropRecommendationInput,
  RankedCropRecommendation,
  CropRecommendationResponse,
} from '../../types';
import { getCropRecommendations } from '../../services/cropRecommendationService';
import { userScopedStorageKey } from '../../services/userScopedStorage';
import { useAuth } from '../../context/AuthContext';
import { soilAnalysisService } from '../../services/soilAnalysisService';
import { ALL_INDIAN_REGIONS } from '../../data/regionalSoilBenchmarks';
import { useI18n } from '../../context/I18nContext';
import { translateCropName, translateSeason, translateCropCategory, translateCropRisk, translateWaterNeed, translateCropUiTerm, translateSoilType } from '../../utils/agriI18n';
import { VoiceListenButton } from '../common/VoiceListenButton';
import cropFieldImage from '../../assets/images/krishibhoomi_crop_field_1788870107457.jpg';

interface CropRecommendationModuleProps {
  onSelectCropForProfit?: (cropName: string) => void;
  onSelectCropForAdvisory?: (cropName: string) => void;
  onSelectCropForYield?: (cropName: string) => void;
  onSelectCropForMarket?: (cropName: string, location?: string) => void;
}

export const CropRecommendationModule: React.FC<CropRecommendationModuleProps> = ({
  onSelectCropForProfit,
  onSelectCropForAdvisory,
  onSelectCropForYield,
  onSelectCropForMarket,
}) => {
  const { user } = useAuth();
  const { language, t } = useI18n();
  const cropUi = (key: string) => {
    const aliases: Record<string, string> = {
      category: 'crop.filterCategory',
      costBreakdown: 'profit.financialAnalysis',
      fertilizerManure: 'fertilizer.recommendation',
      idealSoilPh: 'soil.phLevel',
      marketPriceMsp: 'market.currentPrice',
      noRecommendationsYet: 'crop.recommendation',
      proceedProfit: 'profit.calculator',
      resetFilters: 'crop.filterCategory',
      recommendationsFor: 'crop.recommendation',
      noCropsFound: 'crop.allCrops',
      noCropsThreshold: 'crop.recommendation',
      laborMachinery: 'profit.laborCost',
      cropProtection: 'profit.pestCost',
      sustainableFilter: 'crop.suitabilityScore',
      checkInputFigures: 'soil.analysis',
    };
    if (key === 'acres') return 'acres';
    if (key === 'inSeason') return 'in';
    if (key === 'sustainableFilter') return `${t('crop.suitabilityScore')} · heuristic, not probability`;
    if (aliases[key]) return t(aliases[key]);
    return translateCropUiTerm(key, language);
  };
  const localizedReason = (crop: RankedCropRecommendation) => (crop.reasons || []).join(' ');
  // Input form state: start with clean zero-data state
  const [formData, setFormData] = useState<CropRecommendationInput>(() => ({
    soilN: 0,
    soilP: 0,
    soilK: 0,
    ph: 0,
    organicCarbon: 0,
    soilType: user?.soilType || '',
    farmArea: user?.farmArea || 0,
    season: '',
    previousCrop: user?.preferredCrop || '',
    location: user?.location || '',
  }));

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CropRecommendationResponse | null>(null);
  const [selectedDetailsCrop, setSelectedDetailsCrop] = useState<RankedCropRecommendation | null>(null);
  const [scopeFilter, setScopeFilter] = useState<'all' | 'national' | 'international'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [cropSearchQuery, setCropSearchQuery] = useState<string>('');
  const [hasSyncedSoil, setHasSyncedSoil] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [syncedSoilMeta, setSyncedSoilMeta] = useState<{
    sampleName: string;
    location?: string;
    n: number;
    p: number;
    k: number;
    ph: number;
    oc: number;
    soilType: string;
    season: string;
  } | null>(null);

  const handleSelectCropForAdvisory = (cropName: string) => {
    try {
      localStorage.setItem(userScopedStorageKey('krishibhoomi_active_target_crop', user?.id), cropName);
      window.dispatchEvent(new CustomEvent('krishibhoomi_crop_updated', { detail: { targetCrop: cropName } }));
      window.dispatchEvent(new CustomEvent('krishi:crop-updated', { detail: { targetCrop: cropName } }));
      window.dispatchEvent(new CustomEvent('krishi:fertilizer-sync-needed', { detail: { targetCrop: cropName } }));
    } catch {
      // ignore
    }
    if (onSelectCropForAdvisory) {
      onSelectCropForAdvisory(cropName);
    }
  };

  const handleSelectCropForYieldAction = (cropName: string) => {
    try {
      localStorage.setItem(userScopedStorageKey('krishibhoomi_active_target_crop', user?.id), cropName);
      localStorage.setItem(userScopedStorageKey('krishibhoomi_yield_target_crop', user?.id), cropName);
      window.dispatchEvent(new CustomEvent('krishibhoomi_crop_updated', { detail: { targetCrop: cropName } }));
      window.dispatchEvent(new CustomEvent('krishi:crop-updated', { detail: { targetCrop: cropName } }));
      window.dispatchEvent(new CustomEvent('krishi:yield-sync-needed', { detail: { targetCrop: cropName } }));
    } catch {
      // ignore
    }
    if (onSelectCropForYield) {
      onSelectCropForYield(cropName);
    } else {
      window.location.href = `/yield-prediction?crop=${encodeURIComponent(cropName)}`;
    }
  };


  const handleGenerateWithData = useCallback(async (dataToUse: CropRecommendationInput) => {
    setLoading(true);
    setInputError(null);
    try {
      const response = await getCropRecommendations({ ...dataToUse, userId: user?.id });
      setResults(response);

      if (response.recommendations && response.recommendations.length > 0) {
        try {
          localStorage.setItem(userScopedStorageKey('krishibhoomi_crop_recommendations', user?.id), JSON.stringify(response.recommendations));
          localStorage.setItem(userScopedStorageKey('krishibhoomi_latest_crop_recommendations', user?.id), JSON.stringify(response));
          const topCrop = response.recommendations[0].cropName;
          localStorage.setItem(userScopedStorageKey('krishibhoomi_active_target_crop', user?.id), topCrop);
          window.dispatchEvent(new CustomEvent('krishibhoomi_crop_updated', { detail: { targetCrop: topCrop, recommendations: response.recommendations } }));
          window.dispatchEvent(new CustomEvent('krishi:crop-updated', { detail: { targetCrop: topCrop, recommendations: response.recommendations } }));
          window.dispatchEvent(new CustomEvent('krishi:fertilizer-sync-needed', { detail: { targetCrop: topCrop } }));
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error('Failed to generate crop recommendations', err);
      setInputError(err instanceof Error ? err.message : 'Crop recommendations are unavailable. Please retry.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const syncSoilFromStorage = useCallback((autoExecute: boolean = true) => {
    try {
      const activeSoil = soilAnalysisService.getActiveAnalysis(user);
      const hasRealReport = Boolean(
        activeSoil &&
        activeSoil.isUserReport === true &&
        activeSoil.analyzedAt &&
        activeSoil.analyzedAt !== '' &&
        activeSoil.parameters?.nitrogen?.value != null && activeSoil.parameters?.ph?.value != null
      );

      if (hasRealReport && activeSoil.parameters) {
        const measured = (key: string): number | undefined => {
          const value = activeSoil.parameters[key]?.value;
          return value == null || !Number.isFinite(Number(value)) ? undefined : Number(value);
        };
        const n = measured('nitrogen');
        const p = measured('phosphorus');
        const k = measured('potassium');
        const ph = measured('ph');
        const oc = measured('organicCarbon');
        const soilType =
          activeSoil.fieldMetadata?.soilType ||
          user?.soilType ||
          '';
        const farmArea = Number(activeSoil.fieldMetadata?.farmArea) || user?.farmArea || 0;
        const previousCrop = activeSoil.fieldMetadata?.previousCrop || user?.preferredCrop || '';
        const userLoc = activeSoil.fieldMetadata?.location || user?.location || '';
         if ([n, p, k, ph, oc].some((value) => value === undefined) || (ph || 0) <= 0 || [n, p, k, oc].some((value) => (value ?? -1) < 0)) {
           setHasSyncedSoil(false);
           setSyncedSoilMeta(null);
           setInputError('The saved soil report is incomplete. Please review the report and confirm N, P, K, pH, Organic Carbon and farm area.');
           return;
         }

        let normSeason: 'Rabi' | 'Kharif' | 'Zaid' | '' = '';
        const sStr = String(activeSoil.fieldMetadata?.season || '').toLowerCase();
        if (sStr.includes('kharif')) normSeason = 'Kharif';
        else if (sStr.includes('zaid') || sStr.includes('summer')) normSeason = 'Zaid';
        else if (sStr.includes('rabi') || sStr.includes('winter')) normSeason = 'Rabi';

        const nextData: CropRecommendationInput = {
          soilReportId: activeSoil.id,
          soilN: n!,
          soilP: p!,
          soilK: k!,
          ph: ph!,
          organicCarbon: oc!,
          soilType,
          farmArea,
          season: normSeason,
          previousCrop,
          location: userLoc,
          electricalConductivity: measured('electricalConductivity'),
          sulphur: measured('sulphur'),
          zinc: measured('zinc'),
          iron: measured('iron'),
          manganese: measured('manganese'),
          copper: measured('copper'),
          boron: measured('boron'),
          irrigationAvailability: '',
          sowingMonth: '',
        };

        setFormData(nextData);
        setHasSyncedSoil(true);
        setSyncedSoilMeta({
          sampleName: activeSoil.sampleName || 'Soil Health Card',
          location: activeSoil.fieldMetadata?.location || user?.location,
          n: n!,
          p: p!,
          k: k!,
          ph: ph!,
          oc: oc!,
          soilType,
          season: activeSoil.fieldMetadata?.season || normSeason,
        });

        if (autoExecute && nextData.season && nextData.soilType) {
          handleGenerateWithData(nextData);
        }
        return;
      }

      // For accounts that have not uploaded a soil report:
      // Maintain clean zero-data state.
      setHasSyncedSoil(false);
      setSyncedSoilMeta(null);
      setResults(null);
    } catch (e) {
      console.error('Failed to read active soil report for crop recommendation.', e);
      setInputError('The analyzed soil report could not be read. Reopen Soil Analysis and retry.');
      setLoading(false);
    }
  }, [user, handleGenerateWithData]);

  // Initial sync on component mount & cross-module updates
  useEffect(() => {
    syncSoilFromStorage(true);

    const handleCustomUpdate = () => {
      syncSoilFromStorage(true);
    };

    const handleProfileUpdate = (e: any) => {
      const updatedUser = e?.detail?.user || user;
      if (updatedUser) {
        setFormData((prev) => ({
          ...prev,
          farmArea: updatedUser.farmArea && updatedUser.farmArea > 0 ? updatedUser.farmArea : prev.farmArea,
          location: updatedUser.location || prev.location,
          soilType: updatedUser.soilType || prev.soilType,
          previousCrop: updatedUser.preferredCrop || prev.previousCrop,
        }));
      }
    };

    window.addEventListener('krishibhoomi_soil_updated', handleCustomUpdate);
    window.addEventListener('krishi:soil-updated', handleCustomUpdate);
    window.addEventListener('krishi:profile-updated', handleProfileUpdate);
    window.addEventListener('storage', handleCustomUpdate);

    return () => {
      window.removeEventListener('krishibhoomi_soil_updated', handleCustomUpdate);
      window.removeEventListener('krishi:soil-updated', handleCustomUpdate);
      window.removeEventListener('krishi:profile-updated', handleProfileUpdate);
      window.removeEventListener('storage', handleCustomUpdate);
    };
  }, [syncSoilFromStorage, user]);

  const handleGenerate = () => {
    if (!hasSyncedSoil) {
      setInputError('Complete Soil Analysis and save a report on your account before requesting crop recommendations.');
      return;
    }
    const required = [formData.soilN, formData.soilP, formData.soilK, formData.ph, formData.organicCarbon];
    if (required.some((value) => !Number.isFinite(Number(value))) || formData.ph <= 0 || [formData.soilN, formData.soilP, formData.soilK, formData.organicCarbon].some((value) => value < 0)) {
      setInputError('Verified soil N, P, K, pH and Organic Carbon values are required. Upload a Soil Health Card or enter your actual laboratory values.');
      return;
    }
    setInputError(null);
    handleGenerateWithData(formData);
  };

  const handleInputChange = (
    field: keyof CropRecommendationInput,
    value: string | number
  ) => {
    setInputError(null);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Visual Crop Intelligence Hero - light cinematic style inspired by the reference */}
      <section className="overflow-hidden rounded-[28px] border border-[#DDEBDD] bg-white shadow-[0_18px_50px_rgba(46,125,50,0.08)]">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] min-h-[250px]">
          <div className="relative overflow-hidden min-h-[230px] lg:min-h-full">
            <img
              src={cropFieldImage}
              alt="Green crop field"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1B5E20]/75 via-[#2E7D32]/35 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8 text-white">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/40 bg-white/15 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] backdrop-blur-sm">
                <Sprout className="h-3.5 w-3.5" />
                {t('crop.recommendation')}
              </span>
              <h1 className="mt-3 max-w-xl text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tight">
                {t('crop.recommendation')}
              </h1>
              <p className="mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-white/90">
                {cropUi('recommendationDescription')}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between bg-gradient-to-br from-white via-[#F7FCF6] to-[#EEF8EE] p-6 sm:p-8">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C8E6C9] bg-[#EAF6EA] px-3 py-1 text-[10px] font-black text-[#2E7D32]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {cropUi('sustainableFilter')}
                </span>
                {hasSyncedSoil && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D7EAD8] bg-white px-3 py-1 text-[10px] font-bold text-[#2E7D32]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {cropUi('syncedSoilCard')}
                  </span>
                )}
              </div>

              <div className="mt-7 grid grid-cols-3 gap-2.5">
                <div className="rounded-2xl border border-[#E1EEE1] bg-white/85 p-3 shadow-sm">
                  <Leaf className="h-4 w-4 text-[#2E7D32]" />
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Soil fit</p>
                  <p className="mt-0.5 text-sm font-black text-[#26352A]">N-P-K</p>
                </div>
                <div className="rounded-2xl border border-[#E1EEE1] bg-white/85 p-3 shadow-sm">
                  <TrendingUp className="h-4 w-4 text-[#2E7D32]" />
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Yield</p>
                  <p className="mt-0.5 text-sm font-black text-[#26352A]">{formData.season || 'Select'}</p>
                </div>
                <div className="rounded-2xl border border-[#E1EEE1] bg-white/85 p-3 shadow-sm">
                  <Coins className="h-4 w-4 text-[#2E7D32]" />
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Inputs</p>
                  <p className="mt-0.5 text-sm font-black text-[#26352A]">Soil report</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2E7D32] px-5 py-3 text-xs sm:text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(46,125,50,0.18)] transition-all hover:bg-[#256B2A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? cropUi('analyzing') : results ? cropUi('regenerate') : cropUi('generateRecommendations')}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Connected Soil Report Banner */}
      {syncedSoilMeta && (
        <div className="bg-[#F1F8E9] border border-[#C8E6C9] rounded-2xl p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#2E7D32] uppercase tracking-wider">
                  {cropUi('activeSoilCardSynced')}
                </span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#C8E6C9] font-extrabold text-[#2E7D32]">
                  {cropUi('liveReportData')}
                </span>
              </div>
              <p className="text-sm font-extrabold text-[#37474F] mt-0.5">
                {syncedSoilMeta.sampleName} {syncedSoilMeta.location ? `• ${syncedSoilMeta.location}` : ''}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 mt-1">
                <span>pH: <strong className="text-[#37474F]">{syncedSoilMeta.ph}</strong></span>
                <span>•</span>
                <span>N: <strong className="text-[#37474F]">{syncedSoilMeta.n} kg/ha</strong></span>
                <span>•</span>
                <span>P: <strong className="text-[#37474F]">{syncedSoilMeta.p} kg/ha</strong></span>
                <span>•</span>
                <span>K: <strong className="text-[#37474F]">{syncedSoilMeta.k} kg/ha</strong></span>
                <span>•</span>
                <span>OC: <strong className="text-[#37474F]">{syncedSoilMeta.oc}%</strong></span>
                <span>•</span>
                <span className="font-semibold text-emerald-800">{syncedSoilMeta.soilType}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => syncSoilFromStorage(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {cropUi('resyncReport')}
          </button>
        </div>
      )}

      {/* Main Grid: Form Inputs on Left, Ranked Recommendations on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Inputs (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="font-extrabold text-base text-[#37474F] flex items-center gap-2">
              <Sprout className="w-5 h-5 text-[#2E7D32]" />
              {cropUi('soilFarmParameters')}
            </h2>
            <span className="text-[11px] font-bold text-gray-400">{cropUi('step1of2')}</span>
          </div>

          {/* Farm Location Selection (Synced with User Profile) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-[#37474F] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                {cropUi('selectFarmLocation')}
              </label>
              {user?.location && formData.location === user.location && (
                <span className="text-[10px] text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full font-bold border border-[#C8E6C9]">
                  {cropUi('accountSynced')}
                </span>
              )}
            </div>

            <select
              value={formData.location || ''}
              onChange={(e) => {
                const newLoc = e.target.value;
                handleInputChange('location', newLoc);
              }}
              className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
            >
              <option value="">{cropUi('selectFarmLocation')}</option>
              {ALL_INDIAN_REGIONS.map((reg) => (
                <option key={reg.value} value={reg.value}>
                  {reg.label}
                </option>
              ))}
              {user?.location && !ALL_INDIAN_REGIONS.some((r) => r.value === user.location) && (
                <option key={`profile-loc-${user.location}`} value={user.location}>{t('profile.location')}: {user.location}</option>
              )}
            </select>
            <p className="text-[10px] text-gray-400 mt-1">
              {cropUi('locationHelp')}
            </p>
          </div>

          {!hasSyncedSoil && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs font-bold text-amber-800">Verified soil data required</p>
              <p className="text-[10px] text-amber-700 mt-1 leading-relaxed">
                Complete Soil Analysis and save an analyzed report to your account. Crop recommendations use that report; profile values and regional benchmarks are not substitutes.
              </p>
            </div>
          )}

          {/* Season & Land Area */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#37474F] mb-1">{t('crop.season')}</label>
              <select
                value={formData.season}
                onChange={(e) => handleInputChange('season', e.target.value as CropRecommendationInput['season'])}
                className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
              >
                <option value="">Select season</option>
                <option value="Rabi">{translateSeason('Rabi', language)}</option>
                <option value="Kharif">{translateSeason('Kharif', language)}</option>
                <option value="Zaid">{translateSeason('Zaid', language)}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#37474F] mb-1">{t('profile.farmArea')}</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="500"
                value={formData.farmArea || ''}
                onChange={(e) => handleInputChange('farmArea', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#37474F] mb-1">Irrigation availability</label>
              <select value={formData.irrigationAvailability || ''} onChange={(e) => handleInputChange('irrigationAvailability', e.target.value)} className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-bold text-[#37474F]">
                <option value="">Not provided</option><option value="rainfed">Rainfed</option><option value="irrigated">Irrigated</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#37474F] mb-1">Sowing month (optional)</label>
              <select value={formData.sowingMonth || ''} onChange={(e) => handleInputChange('sowingMonth', e.target.value ? Number(e.target.value) : '')} className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-bold text-[#37474F]">
                <option value="">Not provided</option>{['January','February','March','April','May','June','July','August','September','October','November','December'].map((month,index)=><option key={month} value={index+1}>{month}</option>)}
              </select>
            </div>
          </div>

          {/* Soil Type */}
          <div>
            <label className="block text-xs font-bold text-[#37474F] mb-1">{t('soil.soilType')}</label>
            <select
              value={formData.soilType}
              onChange={(e) => handleInputChange('soilType', e.target.value)}
              className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
            >
              <option value="">{cropUi('selectSoilType')}</option>
              <option value="Deep Black Cotton Soil (Regur)">{translateSoilType('Deep Black Cotton Soil (Regur)', language)}</option>
              <option value="Black Soil">{translateSoilType('Black Soil', language)}</option>
              <option value="Alluvial Loam">{translateSoilType('Alluvial Loam', language)}</option>
              <option value="Alluvial Loamy Sand">{translateSoilType('Alluvial Loamy Sand', language)}</option>
              <option value="Clay Loam">{translateSoilType('Clay Loam', language)}</option>
              <option value="Medium Deep Clay Loam">{translateSoilType('Medium Deep Clay Loam', language)}</option>
              <option value="Sandy Loam">{translateSoilType('Sandy Loam', language)}</option>
              <option value="Red Loam">{translateSoilType('Red Loam', language)}</option>
              {Boolean(formData.soilType) && ![
                'Deep Black Cotton Soil (Regur)',
                'Black Soil',
                'Alluvial Loam',
                'Alluvial Loamy Sand',
                'Clay Loam',
                'Medium Deep Clay Loam',
                'Sandy Loam',
                'Red Loam',
              ].includes(formData.soilType) && (
                <option value={formData.soilType}>{translateSoilType(formData.soilType, language)}</option>
              )}
            </select>
          </div>

          {/* Previous Crop */}
          <div>
            <label className="block text-xs font-bold text-[#37474F] mb-1">{cropUi('previousCrop')}</label>
            <input
              type="text"
              value={formData.previousCrop || ''}
              onChange={(e) => handleInputChange('previousCrop', e.target.value)}
              className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
            />
            <p className="text-[10px] text-gray-400 mt-1">{cropUi('previousCropHelp')}</p>
          </div>

          {/* N-P-K Grid */}
          <div className="pt-2 border-t border-gray-100">
            <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block mb-2">
              {cropUi('soilNutrientAssay')}
            </span>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-0.5">{t('soil.nitrogen')} (kg/ha)</label>
                <input
                  type="number"
                  disabled={!hasSyncedSoil}
                  readOnly={hasSyncedSoil}
                  value={formData.soilN || ''}
                  onChange={(e) => handleInputChange('soilN', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                  className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-0.5">{t('soil.phosphorus')} (kg/ha)</label>
                <input
                  type="number"
                  disabled={!hasSyncedSoil}
                  readOnly={hasSyncedSoil}
                  value={formData.soilP || ''}
                  onChange={(e) => handleInputChange('soilP', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                  className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-0.5">{t('soil.potassium')} (kg/ha)</label>
                <input
                  type="number"
                  disabled={!hasSyncedSoil}
                  readOnly={hasSyncedSoil}
                  value={formData.soilK || ''}
                  onChange={(e) => handleInputChange('soilK', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                  className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
                />
              </div>
            </div>
          </div>

          {/* pH & Organic Carbon */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-0.5">{t('soil.phLevel')}</label>
              <input
                type="number"
                disabled={!hasSyncedSoil}
                readOnly={hasSyncedSoil}
                step="0.1"
                min="4.0"
                max="9.5"
                value={formData.ph || ''}
                onChange={(e) => handleInputChange('ph', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-0.5">{t('soil.organicCarbon')} (%)</label>
              <input
                type="number"
                disabled={!hasSyncedSoil}
                readOnly={hasSyncedSoil}
                step="0.05"
                min="0.1"
                max="2.5"
                value={formData.organicCarbon || ''}
                onChange={(e) => handleInputChange('organicCarbon', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                className="w-full bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
              />
            </div>
          </div>

          {inputError && (
            <div className="p-3 bg-[#FFEBEE] border border-[#FFCDD2] rounded-xl flex items-start gap-2 text-xs text-[#C62828]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{inputError}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? cropUi('evaluating') : cropUi('generateRecommendation')}
          </button>
        </div>

        {/* Right Column: Ranked Recommendations Display (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          {!results && !loading && (
            <div className="bg-white border-2 border-dashed border-[#C8E6C9] rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-2xs">
              <div className="w-16 h-16 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] shadow-2xs">
                <FlaskConical className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1.5">
                <h3 className="text-lg font-extrabold text-[#37474F]">
                  Awaiting {cropUi('soilFarmParameters')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {cropUi('noRecommendationsYet')}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const soilTab = document.querySelector('[data-tab="soil"]') as HTMLButtonElement | null;
                    if (soilTab) {
                      soilTab.click();
                    } else {
                      window.location.hash = '#soil';
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
                >
                  <FileText className="w-4 h-4" />
                  {cropUi('uploadSoilCard')}
                </button>

              </div>
            </div>
          )}

          {loading && (
            <div className="bg-white border border-[#E0E0E0] rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-2xs">
              <RefreshCw className="w-8 h-8 text-[#2E7D32] animate-spin" />
              <p className="text-sm font-bold text-[#37474F]">{cropUi('evaluatingAgronomy')}</p>
              <p className="text-xs text-gray-400">{cropUi('comparingSoil')}</p>
            </div>
          )}

          {/* Summary Callout & Crop Filter Bar */}
          {results && (
            <div className="space-y-3">
              <div className="bg-[#E8F5E9] border border-[#C8E6C9] rounded-2xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#2E7D32] text-white shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-white" />
                      Compatibility ranking · not probability
                    </span>
                    <span className="text-[11px] text-[#2E7D32] font-semibold">
                      Based on the account soil report and available crop catalog.
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#2E7D32] font-semibold leading-relaxed">
                    {results.recommendations?.[0] ? `${localizedReason(results.recommendations[0])}` : ''}
                  </p>
                  <p className="text-[11px] text-[#2E7D32]/80 mt-1">
                    {t('crop.recommendation')}: <strong>{formData.farmArea} acres</strong> • <strong>{translateSeason(formData.season, language)}</strong>.
                  </p>
                </div>
              </div>

              {/* National vs {cropUi('international')} Scope & Category Filter Bar */}
              {(() => {
                const allRecs = results.recommendations || [];
                const nationalCount = allRecs.filter((c) => c.origin === 'National').length;
                const intlCount = allRecs.filter((c) => c.origin === 'International Export').length;
                const categories: string[] = Array.from(new Set<string>(allRecs.map((c) => c.category as string))).sort();

                return (
                  <div className="bg-white border border-[#E0E0E0] rounded-2xl p-4 shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Scope Tabs */}
                      <div className="flex items-center gap-1.5 p-1 bg-[#F1F8E9] rounded-xl border border-[#C8E6C9] self-start">
                        <button
                          type="button"
                          onClick={() => setScopeFilter('all')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            scopeFilter === 'all'
                              ? 'bg-[#2E7D32] text-white shadow-2xs'
                              : 'text-gray-600 hover:text-[#2E7D32]'
                          }`}
                        >
                          {cropUi('allSustainable')} ({allRecs.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setScopeFilter('national')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            scopeFilter === 'national'
                              ? 'bg-[#2E7D32] text-white shadow-2xs'
                              : 'text-gray-600 hover:text-[#2E7D32]'
                          }`}
                        >
                          <span>🇮🇳 {cropUi('nationalTab')} ({nationalCount})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setScopeFilter('international')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            scopeFilter === 'international'
                              ? 'bg-[#1565C0] text-white shadow-2xs'
                              : 'text-gray-600 hover:text-[#1565C0]'
                          }`}
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>{cropUi('international')} ({intlCount})</span>
                        </button>
                      </div>

                      {/* 70-100% Indicator & Search Input */}
                      <div className="flex items-center gap-2 flex-1 sm:max-w-md justify-end">
                        <div className="hidden lg:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200 shrink-0">
                          <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Compatibility score · not probability</span>
                        </div>
                        <div className="relative flex-1 sm:max-w-xs">
                          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={cropSearchQuery}
                            onChange={(e) => setCropSearchQuery(e.target.value)}
                            placeholder={cropUi('search')}
                            className="w-full pl-9 pr-3 py-1.5 bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl text-xs font-medium text-[#37474F] focus:outline-none focus:border-[#2E7D32]"
                          />
                          {cropSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setCropSearchQuery('')}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Category Filter Chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
                        {cropUi('category')}:
                      </span>
                      <button
                        type="button"
                        onClick={() => setCategoryFilter('all')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                          categoryFilter === 'all'
                            ? 'bg-[#37474F] text-white'
                            : 'bg-[#F7FBF7] text-gray-600 hover:bg-gray-200 border border-[#E0E0E0]'
                        }`}
                      >
                        {cropUi('all')} ({allRecs.length})
                      </button>
                      {categories.map((cat) => {
                        const count = allRecs.filter((c) => c.category === cat).length;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                              categoryFilter === cat
                                ? 'bg-[#2E7D32] text-white'
                                : 'bg-[#F7FBF7] text-gray-600 hover:bg-emerald-50 border border-[#E0E0E0]'
                            }`}
                          >
                            {translateCropCategory(cat, language)} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Ranked List */}
          <div className="space-y-4">
            {(() => {
              const allRecs = results?.recommendations || [];
              const filteredRecs = allRecs.filter((crop) => {
                if (scopeFilter === 'national' && crop.origin !== 'National') return false;
                if (scopeFilter === 'international' && crop.origin !== 'International Export') return false;
                if (categoryFilter !== 'all' && crop.category !== categoryFilter) return false;
                if (cropSearchQuery.trim()) {
                  const q = cropSearchQuery.toLowerCase();
                  const matchName = crop.cropName.toLowerCase().includes(q);
                  const matchSci = crop.scientificName?.toLowerCase().includes(q);
                  const matchCat = crop.category.toLowerCase().includes(q);
                  const matchTips = crop.soilFitReason?.toLowerCase().includes(q);
                  const matchVars = crop.details?.commonVarieties?.some((v) => v.toLowerCase().includes(q));
                  if (!matchName && !matchSci && !matchCat && !matchTips && !matchVars) return false;
                }
                return true;
              });

              if (results && allRecs.length === 0) return <div className="bg-white border border-[#E0E0E0] rounded-2xl p-8 text-center text-sm text-gray-600">No crops in the current catalog met the documented compatibility threshold for this season and soil report. No substitute recommendations were generated.</div>;

              if (results && filteredRecs.length === 0) {
                return (
                  <div className="bg-white border border-[#E0E0E0] rounded-2xl p-8 text-center space-y-3 shadow-2xs">
                    <p className="text-sm font-bold text-[#37474F]">
                      {cropUi('noCropsFound')}
                    </p>
                    <p className="text-xs text-gray-500">
                      Try clearing your search query or switching scope tabs (&quot;{cropUi('allSustainable')}&quot; / &quot;{cropUi('all')}&quot;).
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setScopeFilter('all');
                        setCategoryFilter('all');
                        setCropSearchQuery('');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#2E7D32] text-white text-xs font-bold hover:bg-[#1B5E20] transition-colors cursor-pointer shadow-2xs"
                    >
                      {cropUi('resetFilters')}
                    </button>
                  </div>
                );
              }

              return filteredRecs.map((crop) => (
                <div
                  key={crop.id}
                className="bg-white border border-[#DDEBDD] hover:border-[#A5D6A7] rounded-[24px] p-4 sm:p-5 shadow-[0_12px_35px_rgba(46,125,50,0.06)] transition-all space-y-4 relative overflow-hidden"
              >
                <div className="relative h-28 sm:h-32 overflow-hidden rounded-[18px] border border-[#E4EFE4]">
                  <img src={cropFieldImage} alt="Crop field" className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#173D1B]/70 via-[#2E7D32]/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 sm:p-4">
                    <div className="text-white">
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/75">Crop compatibility</p>
                      <p className="text-lg sm:text-xl font-black leading-tight">{translateCropName(crop.cropName, language)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/30 bg-white/15 px-3 py-2 text-right backdrop-blur-sm">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-white/75">{cropUi('soilMatch')}</p>
                      <p className="text-lg font-black text-white">{crop.suitability}%</p>
                    </div>
                  </div>
                </div>

                {/* Header Row: Rank Badge, Title, Category, Suitability */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#2E7D32] text-white text-xs font-black flex items-center justify-center shrink-0 shadow-2xs">
                      #{crop.rank}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base sm:text-lg font-extrabold text-[#37474F]">
                          {translateCropName(crop.cropName, language)}
                        </h3>
                        {crop.scientificName && (
                          <span className="text-xs text-gray-400 italic hidden sm:inline">
                            ({crop.scientificName})
                          </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F1F8E9] text-[#2E7D32] border border-[#C8E6C9]">
                          {translateCropCategory(crop.category, language)}
                        </span>
                        {crop.origin === 'International Export' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            <Globe className="w-3 h-3" />
                            {cropUi('international')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {cropUi('national')}
                          </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          {translateSeason(crop.season, language)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <Leaf className="w-3 h-3 text-emerald-700" />
                          Compatibility score · not probability
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {cropUi('duration')}: {crop.harvestDuration} • {cropUi('waterRequirement')}: {translateWaterNeed(crop.waterNeed, language)} • {cropUi('risk')}: {translateCropRisk(crop.riskFactor, language)}
                      </p>
                    </div>
                  </div>

                  {/* Suitability Score & Voice Audio */}
                  <div className="flex items-center gap-2.5 sm:text-right bg-[#F7FBF7] sm:bg-transparent p-2 sm:p-0 rounded-xl">
                    <VoiceListenButton
                      text={`${translateCropName(crop.cropName, language)}. ${translateCropCategory(crop.category, language)}. ${crop.suitability}% suitability. ${localizedReason(crop)}`}
                      size="sm"
                      variant="subtle"
                    />
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                        {cropUi('soilMatch')}
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-[#2E7D32]">
                        {crop.suitability}%
                      </span>
                      <span className="text-[9px] font-bold text-emerald-700 block">
                        Heuristic score
                      </span>
                    </div>
                    <div className="w-12 h-2 sm:hidden bg-gray-200 rounded-full overflow-hidden ml-auto">
                      <div
                        className="h-full bg-[#2E7D32] rounded-full"
                        style={{ width: `${crop.suitability}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-xs text-blue-900">
                  <strong>Compatibility score:</strong> {crop.scoreMeaning || 'Heuristic compatibility ranking based on the available soil report and catalog factors; not a probability or guarantee.'}
                  <div className="mt-2 grid sm:grid-cols-2 gap-3">
                    <div><strong>Why it may suit:</strong><ul className="list-disc ml-4 mt-1">{(crop.reasons || []).map((reason, i) => <li key={i}>{reason}</li>)}</ul></div>
                    <div><strong>Limiting factors:</strong>{crop.limitingFactors?.length ? <ul className="list-disc ml-4 mt-1">{crop.limitingFactors.map((reason, i) => <li key={i}>{reason}</li>)}</ul> : <p className="mt-1">No limiting factors were identified by the available catalog factors.</p>}</div>
                  </div>
                  {crop.missingInformation?.length ? <div className="mt-2"><strong>Missing information:</strong> {crop.missingInformation.join(' ')}</div> : null}
                  {Object.entries(crop.observedOptionalSoilMeasurements || {}).some(([, value]) => value != null) ? <div className="mt-2"><strong>Other measured soil values (reported only):</strong> {Object.entries(crop.observedOptionalSoilMeasurements || {}).filter(([, value]) => value != null).map(([name, value]) => `${name}: ${value}`).join(' · ')}</div> : null}
                </div>

                {/* Contextual Reason & Action Bar */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-gray-100">
                  <p className="text-gray-600 leading-snug">
                    <strong className="text-gray-700">{cropUi('agronomicFit')}:</strong> {localizedReason(crop)}
                  </p>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                    <button
                      onClick={() => {
                        localStorage.setItem(userScopedStorageKey('krishibhoomi_active_target_crop', user?.id), crop.cropName);
                        window.dispatchEvent(
                          new CustomEvent('krishi:crop-updated', {
                            detail: { crop: crop.cropName, location: formData.location },
                          })
                        );
                        if (onSelectCropForMarket) {
                          onSelectCropForMarket(crop.cropName, formData.location);
                        }
                      }}
                      title="View live APMC mandi prices and market forecast for this recommended crop"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F1F8E9] hover:bg-[#E8F5E9] text-xs font-bold text-[#2E7D32] transition-all cursor-pointer border border-[#C8E6C9]"
                    >
                      <Store className="w-3.5 h-3.5" />
                      {cropUi('mandiRates')}
                    </button>
                    <button
                      onClick={() => handleSelectCropForYieldAction(crop.cropName)}
                      title="Simulate harvest yield, total production, and gain over district average"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F5E9] hover:bg-[#C8E6C9] text-xs font-black text-[#2E7D32] transition-all cursor-pointer border border-[#C8E6C9]"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      {cropUi('predictYield')}
                    </button>
                    <button
                      onClick={() => handleSelectCropForAdvisory(crop.cropName)}
                      title="Set as active crop for Fertilizer and Pesticide & IPM recommendations"
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 text-xs font-bold text-[#37474F] transition-all cursor-pointer border border-[#E0E0E0]"
                    >
                      {cropUi('fertilizerPlan')}
                    </button>
                    <button
                      onClick={() => setSelectedDetailsCrop(crop)}
                      className="px-3 py-1.5 rounded-xl border border-[#E0E0E0] hover:bg-gray-50 text-xs font-bold text-[#37474F] transition-all cursor-pointer"
                    >
                      {cropUi('viewDetails')}
                    </button>
                    {onSelectCropForProfit && (
                      <button
                        onClick={() => onSelectCropForProfit(crop.cropName)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
                      >
                        {cropUi('calculateProfit')}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ));
          })()}
          </div>
        </div>
      </div>

      {/* {cropUi('viewDetails')} Modal */}
      {selectedDetailsCrop && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E0E0E0] shadow-xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-extrabold flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5 text-[#2E7D32]" />
                    Rank #{selectedDetailsCrop.rank} • {selectedDetailsCrop.suitability}% compatibility · heuristic
                  </span>
                  <span className="text-xs font-bold text-gray-500">{translateCropCategory(selectedDetailsCrop.category, language)}</span>
                  {selectedDetailsCrop.origin === 'International Export' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      <Globe className="w-3 h-3" />
                      {cropUi('international')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {cropUi('national')}
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    {translateSeason(selectedDetailsCrop.season, language)}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-[#37474F] mt-1">
                  {translateCropName(selectedDetailsCrop.cropName, language)}
                  {selectedDetailsCrop.scientificName && (
                    <span className="ml-2 text-sm text-gray-400 font-normal italic">
                      ({selectedDetailsCrop.scientificName})
                    </span>
                  )}
                </h3>
              </div>

              <button
                onClick={() => setSelectedDetailsCrop(null)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Key Field Requirements */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-[#F7FBF7] rounded-xl border border-[#E0E0E0]">
                <span className="text-[10px] font-bold text-gray-400 uppercase">{cropUi('idealSoilPh')}</span>
                <p className="font-extrabold text-[#37474F] mt-0.5">
                  {selectedDetailsCrop.details.idealSoilPh}
                </p>
              </div>
              <div className="p-3 bg-[#F7FBF7] rounded-xl border border-[#E0E0E0]">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Water need (catalog)</span>
                <p className="font-extrabold text-[#37474F] mt-0.5">{selectedDetailsCrop.waterNeed || 'Not available'}</p>
              </div>
              <div className="p-3 bg-[#F7FBF7] rounded-xl border border-[#E0E0E0]">
                <span className="text-[10px] font-bold text-gray-400 uppercase">{cropUi('sowingWindow')}</span>
                <p className="font-extrabold text-[#37474F] mt-0.5">
                  {formData.sowingMonth ? `Month ${formData.sowingMonth} (broad season check only)` : 'Not provided; local dates unavailable'}
                </p>
              </div>
              <div className="p-3 bg-[#F7FBF7] rounded-xl border border-[#E0E0E0]">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Compatibility method</span>
                <p className="font-extrabold text-[#2E7D32] mt-0.5">Documented factor score</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-900">
              <strong>Scored factors:</strong> {Object.entries(selectedDetailsCrop.scoreFactors || {}).map(([factor, value]) => `${factor} ${value}%`).join(' · ') || 'Unavailable'}
              <p className="mt-1">Scores are heuristic compatibility indices, not calibrated probabilities. Crop catalog does not provide verified yield, cost, or mandi price estimates.</p>
            </div>

            {/* Recommended High-Yield Varieties */}
            <div>
              <h4 className="text-xs font-extrabold text-[#37474F] mb-1.5">
                Crop varieties listed in catalog
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedDetailsCrop.details.commonVarieties.map((v, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white border border-[#C8E6C9] text-[#2E7D32] rounded-lg text-xs font-bold shadow-2xs"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Agronomic Best Practices */}
            <div>
              <h4 className="text-xs font-extrabold text-[#37474F] mb-2">
                {cropUi('managementTips')}
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-600">
                {(selectedDetailsCrop.details.agronomyTips || []).map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer Action */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3 flex-wrap">
              <button
                onClick={() => setSelectedDetailsCrop(null)}
                className="px-4 py-2 rounded-xl border border-[#E0E0E0] hover:bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const cropName = selectedDetailsCrop.cropName;
                  setSelectedDetailsCrop(null);
                  handleSelectCropForYieldAction(cropName);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E8F5E9] hover:bg-[#C8E6C9] text-xs font-black text-[#2E7D32] transition-all cursor-pointer border border-[#C8E6C9]"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                {cropUi('predictYield')}
              </button>
              {onSelectCropForProfit && (
                <button
                  onClick={() => {
                    const cropName = selectedDetailsCrop.cropName;
                    setSelectedDetailsCrop(null);
                    onSelectCropForProfit(cropName);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-extrabold shadow-2xs transition-all cursor-pointer"
                >
                  {cropUi('proceedProfit')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

