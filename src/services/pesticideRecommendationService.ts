import { PesticideRecommendationInput, PesticideRecommendationResponse } from '../types';
import { api } from './api';

export const MANDATORY_PESTICIDE_DISCLAIMER = 'This is an IPM checklist, not a pest diagnosis or pesticide prescription. Confirm the cause with your local KVK/agricultural extension expert before treatment.';

export async function getPesticideRecommendation(input: PesticideRecommendationInput): Promise<PesticideRecommendationResponse> {
  if (!input.soilReportId?.trim()) {
    throw new Error('Select a saved soil report before requesting field guidance.');
  }
  if (!input.crop.trim() || !input.growthStage.trim() || !input.observedProblem.trim()) {
    throw new Error('Select the actual crop and growth stage, then describe the observed pest, disease or symptoms.');
  }
  const response = await api.post<any>('/pesticide/recommend', {
    soilReportId: input.soilReportId,
    crop: input.crop,
    growthStage: input.growthStage,
    observedProblem: input.observedProblem,
    farmArea: input.farmArea,
    location: input.location || '',
  });
  const data = response.data?.data || response.data;
  if (!data || data.soilReportId !== input.soilReportId) throw new Error('The IPM response did not match the selected soil report.');
  const advisory = data?.recommendations?.[0];
  if (!advisory || typeof advisory.recommendation !== 'string' || !Array.isArray(advisory.ipmSteps)) {
    throw new Error('The IPM service returned an invalid response. Please retry.');
  }
  return {
    input,
    timestamp: new Date().toISOString(),
    diagnosis: {
      id: String(data.id || `ipm-${Date.now()}`),
      crop: input.crop,
      growthStage: input.growthStage,
      observedProblem: input.observedProblem,
      possibleProblem: 'Not diagnosed; user-reported observation only',
      problemCategory: 'IPM Advisory',
      severityLevel: 'Not assessed',
      recommendedTreatment: { botanicalBio: advisory.recommendation, approvedChemical: '' },
      applicationGuidance: { dosage: '', waterVolume: '', equipment: '', timingAndWeather: advisory.when || 'Begin with field inspection and confirm identification.', frequency: 'No treatment interval prescribed.' },
      safetyPrecautions: Array.isArray(advisory.safetyPrecautions) ? advisory.safetyPrecautions : [],
      waitingPeriodDays: null,
      mandatoryDisclaimer: MANDATORY_PESTICIDE_DISCLAIMER,
      allTreatmentOptions: advisory.ipmSteps.map((step: any) => ({ name: String(step.action), type: 'Cultural' as const, dosage: '', totalNeeded: '', method: `${step.when}: ${step.why}`, source: String(step.source || 'General IPM process; not crop-specific treatment guidance.') })),
    },
  };
}
