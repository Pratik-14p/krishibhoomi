import { api } from './api';

/** Persistence client for the Node.js/Express backend. */
const save = (type: string, payload: unknown) =>
  api.post('/records', { type, payload }).catch((error) => {
    console.warn(`[Data API] Could not save ${type}:`, error?.message || error);
    return { success: false, message: error?.message || 'Unable to save record.' };
  });

export const mysqlService = {
  saveSoilAnalysis: (result: unknown, input?: unknown) => save('soil_analysis', { result, input }),
  saveCropRecommendation: (input: unknown, result: unknown) => save('crop_recommendation', { input, result }),
  saveFertilizerRecommendation: (input: unknown, result: unknown) => save('fertilizer_recommendation', { input, result }),
  savePesticideRecommendation: (input: unknown, result: unknown) => save('pesticide_recommendation', { input, result }),
  saveYieldPrediction: (input: unknown, result: unknown) => save('yield_prediction', { input, result }),
  saveProfitCalculation: (input: unknown, result: unknown) => save('profit_calculation', { input, result }),
  saveScenario: (scenario: unknown) => save('scenario', scenario),
  saveUserProfile: (profile: unknown) => save('user_profile', profile),
  saveUserLanguagePreference: async (code: string) => {
    const res = await api.put('/auth/profile', { preferred_language: code });
    return res.data;
  },
  getUserLanguagePreference: async (): Promise<string | null> => {
    try {
      const res = await api.get<any>('/auth/profile');
      return res.data?.user?.preferred_language || null;
    } catch {
      return null;
    }
  },
  saveFarmingStrategy: (strategy: unknown) => save('farming_strategy', strategy),
  saveMarketAnalysis: (analysis: unknown) => save('market_analysis', analysis),
  testConnection: async () => {
    try {
      const res = await api.get<any>('/health');
      return { connected: Boolean(res.data?.database), message: res.message || 'Data service checked.' };
    } catch (error: any) {
      return { connected: false, message: error?.message || 'Data service is unavailable.' };
    }
  },
};
