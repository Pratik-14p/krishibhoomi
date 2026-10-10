import { FertilizerRecommendationInput, FertilizerRecommendationResponse, RecommendedFertilizerItem } from '../types';
import { api } from './api';

const API_ENDPOINT = '/fertilizer/recommend';

export async function getFertilizerRecommendations(input: FertilizerRecommendationInput): Promise<FertilizerRecommendationResponse> {
  if (!input.soilReportId?.trim()) throw new Error('Select a verified soil report before requesting fertilizer guidance.');
  if (!input.targetCrop?.trim()) throw new Error('Select a crop before requesting a fertilizer assessment.');
  if (!Number.isFinite(input.farmArea) || input.farmArea <= 0) throw new Error('Enter the actual cultivated area.');
  const response = await api.post<any>(API_ENDPOINT, {
    soilReportId: input.soilReportId,
    targetCrop: input.targetCrop,
    farmArea: input.farmArea,
    growthStage: input.growthStage,
    previouslyAppliedFertilizers: input.previouslyAppliedFertilizers,
  });
  const data = response.data?.data || response.data;
  const validCondition = (condition: any) => condition && (condition.value === null || Number.isFinite(condition.value))
    && ['Low', 'Medium', 'Good', 'High', 'Unknown'].includes(condition.status)
    && typeof condition.note === 'string';
  if (!data || data.soilReportId !== input.soilReportId || !Array.isArray(data.recommendations) || !data.nutrientConditions
    || !['nitrogen','phosphorus','potassium','ph'].every((key) => validCondition(data.nutrientConditions[key]))) {
    throw new Error('Fertilizer service returned an invalid response. Please retry.');
  }
  const fertilizers: RecommendedFertilizerItem[] = data.recommendations.map((item: any, index: number) => {
    if (!item || typeof item.fertilizer !== 'string' || typeof item.purpose !== 'string') throw new Error('Fertilizer service returned an invalid product record.');
    return { ...item, id: String(item.id || `fert-${index + 1}`) };
  });
  return {
    input,
    timestamp: new Date().toISOString(),
    nutrientConditions: data.nutrientConditions,
    fertilizers,
    soilHealthAdvisory: String(data.soilHealthAdvisory || ''),
  };
}
