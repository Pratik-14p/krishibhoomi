import { api } from './api';
import { PersonalizedFarmingStrategy } from '../types';

export interface GenerateStrategyPayload {
  ownerId?: string;
  soilReportId: string;
  cropName?: string;
  farmAreaAcres?: number;
  season?: string;
  location?: string;
}

const blankStrategy = (): PersonalizedFarmingStrategy => ({
  id: '', soilReportId: null, generatedAt: '', farmerName: '', farmLocation: '', farmAreaAcres: null, season: '', targetCrop: '',
  soilHealthSummary: { healthScore: null, ph: null, n: null, p: null, k: null, organicCarbon: null, keyDeficiency: '', soilType: '' },
  executiveVerdict: '', phases: [], economicForecast: { estimatedCost: null, estimatedRevenue: null, estimatedProfit: null, projectedYield: null, roi: null },
  riskMitigation: [], aiAgronomistNotes: [],
});

class PersonalizedStrategyService {
  private active = blankStrategy();
  private activeOwnerId: string | null = null;
  getActiveStrategy(ownerId?: string): PersonalizedFarmingStrategy {
    if (!ownerId || ownerId !== this.activeOwnerId) { this.active = blankStrategy(); this.activeOwnerId = ownerId || null; }
    return this.active;
  }

  private hydrateStrategy(raw: any, ownerId: string, fallbackCrop = ''): PersonalizedFarmingStrategy {
    if (!raw || typeof raw.executiveVerdict !== 'string' || !Array.isArray(raw.actions)) {
      throw new Error('The saved strategy has an invalid response format.');
    }
    const groups = new Map<string, any[]>();
    raw.actions.forEach((action: any, index: number) => {
      if (!action || typeof action.action !== 'string' || typeof action.why !== 'string') return;
      const phaseName = String(action.phase || 'Available guidance');
      const task = {
        id: String(action.id || `action-${index + 1}`),
        description: action.action,
        completed: false,
        priority: 'Routine',
        notes: `When: ${action.when || 'Timing not specified'}. Why: ${action.why}. Sources: ${(Array.isArray(action.sources) ? action.sources : []).join(', ') || 'Not available'}`,
      };
      groups.set(phaseName, [...(groups.get(phaseName) || []), task]);
    });
    if (!groups.size) throw new Error('No grounded strategy actions are available from the saved data.');

    const soil = raw.soilReport || {};
    this.active = {
      ...blankStrategy(),
      id: String(raw.id || `strategy-${Date.now()}`),
      soilReportId: typeof raw.soilReportId === 'string' ? raw.soilReportId : null,
      generatedAt: String(raw.generatedAt || new Date().toISOString()),
      farmLocation: raw.location || '',
      farmAreaAcres: raw.areaAcres == null || !Number.isFinite(Number(raw.areaAcres)) ? null : Number(raw.areaAcres),
      season: raw.season || '',
      targetCrop: String(raw.crop || fallbackCrop),
      soilHealthSummary: {
        ...blankStrategy().soilHealthSummary,
        n: soil.nitrogen == null || !Number.isFinite(Number(soil.nitrogen)) ? null : Number(soil.nitrogen),
        p: soil.phosphorus == null || !Number.isFinite(Number(soil.phosphorus)) ? null : Number(soil.phosphorus),
        k: soil.potassium == null || !Number.isFinite(Number(soil.potassium)) ? null : Number(soil.potassium),
        ph: soil.ph == null || !Number.isFinite(Number(soil.ph)) ? null : Number(soil.ph),
        organicCarbon: soil.organic_carbon == null || !Number.isFinite(Number(soil.organic_carbon)) ? null : Number(soil.organic_carbon),
      },
      executiveVerdict: raw.executiveVerdict,
      phases: [...groups.entries()].map(([phaseName, tasks], index) => ({
        id: `phase-${index}`,
        phaseNumber: index + 1,
        phaseName,
        timing: tasks[0]?.notes?.split('. Why:')[0]?.replace('When: ', '') || 'Timing unavailable',
        objective: phaseName,
        soilConditioning: '',
        fertilizerAction: '',
        irrigationSchedule: '',
        pestProtection: '',
        tasks,
      })),
      aiAgronomistNotes: Array.isArray(raw.missingInformation) ? raw.missingInformation : [],
    };
    this.activeOwnerId = ownerId;
    return this.active;
  }

  async loadLatestStrategy(ownerId: string, soilReportId: string): Promise<PersonalizedFarmingStrategy | null> {
    const response = await api.get<any>('/reports');
    const reports = response.data?.reports;
    if (!Array.isArray(reports)) throw new Error('Saved reports returned an invalid response.');
    const latest = reports.find((item: any) => item?.report_type === 'personalized_strategy' && item?.payload?.strategy?.soilReportId === soilReportId);
    const raw = latest?.payload?.strategy;
    if (!raw) return null;
    return this.hydrateStrategy(raw, ownerId);
  }

  async generateStrategy(payload: GenerateStrategyPayload): Promise<PersonalizedFarmingStrategy> {
    if (!payload.cropName?.trim()) throw new Error('Select the crop for this strategy.');
    if (!payload.soilReportId?.trim()) throw new Error('Select a verified soil report before generating a personalized strategy.');
    const res = await api.post<any>('/strategy/generate', {
      soilReportId: payload.soilReportId,
      cropName: payload.cropName.trim(), season: payload.season || undefined,
      farmAreaAcres: payload.farmAreaAcres || undefined, location: payload.location || undefined,
      language: localStorage.getItem('krishibhoomi_language_v1') || 'en',
    });
    return this.hydrateStrategy(res.data?.strategy, payload.ownerId || '', payload.cropName || '');
  }

  toggleTaskCompletion(phaseId: string, taskId: string, ownerId?: string): PersonalizedFarmingStrategy {
    if (!ownerId || ownerId !== this.activeOwnerId) return blankStrategy();
    this.active = { ...this.active, phases: this.active.phases.map(p => p.id === phaseId ? { ...p, tasks: p.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) } : p) };
    return this.active;
  }

  async askAIAgronomist(question: string, context?: Partial<PersonalizedFarmingStrategy>): Promise<string> {
    const res = await api.post<any>('/strategy/ask-ai', { question, strategyContext: { crop: context?.targetCrop } });
    const reply = res.data?.reply;
    if (typeof reply !== 'string' || !reply.trim()) throw new Error('The AI service returned an invalid response.');
    return reply;
  }
}

export const personalizedStrategyService = new PersonalizedStrategyService();
