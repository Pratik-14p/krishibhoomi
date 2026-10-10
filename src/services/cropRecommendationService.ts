import {
  CropRecommendationInput,
  CropRecommendationResponse,
  RankedCropRecommendation,
} from '../types';
import { api } from './api';
import { userScopedStorageKey } from './userScopedStorage';

/**
 * Crop Recommendation Service
 * Uses the Express API and a farmer-selected saved soil report.
 * There is no client-side sample/demo/benchmark fallback.
 */
const API_ENDPOINT = '/crop/recommend';

export async function getCropRecommendations(
  input: CropRecommendationInput
): Promise<CropRecommendationResponse> {
  const required = [input.soilN, input.soilP, input.soilK, input.ph, input.organicCarbon];
  if (required.some((v) => !Number.isFinite(Number(v))) || input.ph <= 0 || [input.soilN, input.soilP, input.soilK, input.organicCarbon].some((v) => v < 0)) {
    throw new Error('Verified soil N, P, K, pH and Organic Carbon values are required before crop recommendation.');
  }
  if (!input.soilReportId?.trim()) throw new Error('Select a saved soil report before requesting crop recommendations.');
  if (!input.season || !input.soilType) {
    throw new Error('Select the soil type and growing season before requesting crop recommendations.');
  }

  const res = await api.post<any>(API_ENDPOINT, {
    soilReportId: input.soilReportId,
    nitrogen: input.soilN,
    phosphorus: input.soilP,
    potassium: input.soilK,
    ph: input.ph,
    organicCarbon: input.organicCarbon,
    farmArea: input.farmArea,
    season: input.season,
    soilType: input.soilType,
    previousCrop: input.previousCrop,
    location: input.location || '',
    electricalConductivity: input.electricalConductivity,
    sulphur: input.sulphur,
    zinc: input.zinc,
    iron: input.iron,
    manganese: input.manganese,
    copper: input.copper,
    boron: input.boron,
    irrigationAvailability: input.irrigationAvailability || '',
    sowingMonth: input.sowingMonth || undefined,
  });

  const payloadData = res.data?.data || res.data;
  const rawRecs: any[] = Array.isArray(payloadData)
    ? payloadData
    : Array.isArray(payloadData?.recommendations)
      ? payloadData.recommendations
      : [];

  
const validCategories = new Set([
  'Cereal',
  'Pulse',
  'Oilseed',
  'Cash Crop',
  'Vegetable',
  'Horticulture',
  'Exotic Superfood',
  'Plantation',
  'Spices',
  'Other',
]);
  const mappedRecommendations: RankedCropRecommendation[] = rawRecs.map((r: any, idx: number) => {
    if (!r || typeof r.cropName !== 'string' || !validCategories.has(r.category) || !Number.isFinite(Number(r.suitability)) || Number(r.suitability) < 0 || Number(r.suitability) > 100 || !Array.isArray(r.reasons) || !Array.isArray(r.limitingFactors) || !Array.isArray(r.missingInformation)) {
      throw new Error('Crop recommendation service returned an invalid response. Please retry later.');
    }

    return {
      id: r.id || `CROP-REC-${idx + 1}`,
      rank: Number(r.rank || idx + 1),
      cropName: r.cropName,
      category: r.category as RankedCropRecommendation['category'],
      origin: r.origin,
      scientificName: r.scientificName,
      suitability: Number(r.suitability),
      harvestDuration: r.harvestDuration,
      season: r.season,
      waterNeed: r.waterNeed,
      soilFitReason: Array.isArray(r.reasons) ? r.reasons.join(' ') : '',
      scoreMeaning: r.scoreMeaning,
      scoreFactors: r.scoreFactors,
      reasons: r.reasons,
      limitingFactors: r.limitingFactors,
      missingInformation: r.missingInformation,
      observedOptionalSoilMeasurements: r.observedOptionalSoilMeasurements,
      details: { idealSoilPh: String(r.details?.idealSoilPh || ''), commonVarieties: Array.isArray(r.details?.commonVarieties) ? r.details.commonVarieties : [], ...(Array.isArray(r.details?.agronomyTips) ? { agronomyTips: r.details.agronomyTips } : {}) },
    };
  });
  mappedRecommendations.sort((a, b) => b.suitability - a.suitability || a.cropName.localeCompare(b.cropName));
  mappedRecommendations.forEach((recommendation, idx) => { recommendation.rank = idx + 1; });

  const response: CropRecommendationResponse = {
    input,
    timestamp: new Date().toISOString(),
    recommendations: mappedRecommendations,
    summaryNote: payloadData.summaryNote || '',
  };

  try {
    if (input.userId) localStorage.setItem(userScopedStorageKey('krishibhoomi_latest_crop_recommendations', input.userId), JSON.stringify(response));
  } catch {}

  return response;
}
