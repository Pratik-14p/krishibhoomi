import { YieldPredictionInput, YieldPredictionResponse } from '../types';
import { api } from './api';

export async function predictCropYield(
  input: YieldPredictionInput
): Promise<YieldPredictionResponse> {
  if (
    !input.crop?.trim() ||
    !input.state?.trim() ||
    !input.season ||
    !Number.isFinite(input.farmArea) ||
    input.farmArea <= 0
  ) {
    throw new Error(
      'Select a crop, State/UT, season and enter the actual cultivated area.'
    );
  }

  if (
    !input.soilReportId ||
    ![
      input.soilN,
      input.soilP,
      input.soilK,
      input.ph,
      input.organicCarbon,
    ].every((value) => Number.isFinite(value))
  ) {
    throw new Error('A verified analyzed soil report is required.');
  }

  const response = await api.post<any>('/api/yield/predict', {
    soilReportId: input.soilReportId,
    crop: input.crop,
    farmArea: input.farmArea,
    farmAreaUnit: 'acres',
    soilN: input.soilN,
    soilP: input.soilP,
    soilK: input.soilK,
    ph: input.ph,
    organicCarbon: input.organicCarbon,
    season: input.season,
    state: input.state,
    district: input.district || undefined,
    location: input.location || undefined,
    soilType: input.soilType || undefined,
    irrigationType: input.irrigationType || undefined,
  });

  const data = response.data;

  if (!data?.result || typeof data.result !== 'object') {
    throw new Error(
      response.message ||
        'Personalized yield estimation is currently unavailable.'
    );
  }

  return {
    input,
    timestamp: new Date().toISOString(),
    prediction: data.result,
  };
}

