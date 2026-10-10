import {
  FarmScenarioItem,
  CalculatedScenario,
  ScenarioSimulationResult,
} from '../types';
import { api } from './api';
import { mysqlService } from './mysqlService';
import { soilAnalysisService } from './soilAnalysisService';
import { authService } from './authService';

/**
 * Smart Farm Scenario Simulator Service
 * Connected to Flask API: POST /api/scenario/simulate
 */
const API_ENDPOINT = '/scenario/simulate';

export const INITIAL_DEFAULT_SCENARIOS: FarmScenarioItem[] = [
  {
    id: 'scen-a',
    name: 'Scenario A',
    crop: '',
    area: 0,
    expectedYield: 0,
    yieldUnit: 'tons/ha',
    sellingPrice: 0,
    seedCost: 0,
    fertilizerCost: 0,
    pesticideCost: 0,
    labourCost: 0,
    otherCosts: 0,
    notes: 'Enter your actual scenario values. No sample prices or yields are preloaded.',
  },
]

/**
 * Execute simulation across multiple scenarios
 */
export async function simulateScenarios(scenarios: FarmScenarioItem[]): Promise<ScenarioSimulationResult> {
  if (!Array.isArray(scenarios) || scenarios.length === 0) throw new Error('Add a scenario before running the simulation.');
  for (const [index, scenario] of scenarios.entries()) {
    if (!scenario.crop.trim() || !Number.isFinite(scenario.area) || scenario.area <= 0 || !Number.isFinite(scenario.expectedYield) || scenario.expectedYield < 0 || !Number.isFinite(scenario.sellingPrice) || scenario.sellingPrice < 0) {
      throw new Error(`Scenario ${index + 1} requires a crop, positive area, and valid yield and selling price.`);
    }
  }
  const user = authService.getCurrentUser();
  const soil = soilAnalysisService.getActiveAnalysis(user);
  if (!user?.id || !soil?.isUserReport || !soil?.id) {
    throw new Error('Upload and save your actual soil report before comparing scenarios. No default soil profile is used.');
  }
  const response = await api.post<any>(API_ENDPOINT, { scenarios, soilReportId: soil.id });
  const payload = response.data?.data || response.data;
  if (!Array.isArray(payload?.scenarios) || payload.scenarios.length !== scenarios.length) throw new Error('The scenario service returned an incomplete response. Please retry.');
  const calculated: CalculatedScenario[] = payload.scenarios.map((row: any) => {
    const original = scenarios.find((item) => item.id === row.id);
    if (!original || ![row.totalCost, row.totalRevenue, row.netProfit, row.roiPercentage].every((value: unknown) => Number.isFinite(Number(value)))) throw new Error('The scenario service returned invalid calculation values. Please retry.');
    const area = original.area;
    return { ...original, totalCost: Number(row.totalCost), totalProductionTons: Number((area * original.expectedYield).toFixed(2)), expectedRevenue: Number(row.totalRevenue), estimatedProfit: Number(row.netProfit), roiPercentage: Number(row.roiPercentage), profitPerHectare: Math.round(Number(row.netProfit) / area), costPerHectare: Math.round(Number(row.totalCost) / area), revenuePerHectare: Math.round(Number(row.totalRevenue) / area) };
  });
  const highestProfit = calculated.reduce((best, item) => item.estimatedProfit > best.estimatedProfit ? item : best);
  const lowestCost = calculated.reduce((best, item) => item.totalCost < best.totalCost ? item : best);
  const highestYield = calculated.reduce((best, item) => item.expectedYield > best.expectedYield ? item : best);
  const bestOverall = highestProfit;
  const scenariosWithFlags = calculated.map((item) => ({ ...item, isHighestProfit: item.id === highestProfit.id, isLowestCost: item.id === lowestCost.id, isHighestYield: item.id === highestYield.id, isBestOverall: item.id === bestOverall.id, isRecommended: item.id === bestOverall.id }));
  const find = (item: CalculatedScenario) => scenariosWithFlags.find((candidate) => candidate.id === item.id) || null;
  return { scenarios: scenariosWithFlags, recommendedScenario: find(bestOverall), highestProfitScenario: find(highestProfit), lowestCostScenario: find(lowestCost), highestYieldScenario: find(highestYield), bestOverallScenario: find(bestOverall), recommendationReasoning: `Highest estimated net return from submitted values: ${highestProfit.name} (${highestProfit.crop}).`, simulationDisclaimer: 'Estimates use only your entered values and are not a guarantee of actual harvest or market outcomes.' };
}

/**
 * Generate a new blank or template scenario
 */
export function createNewScenarioTemplate(existingCount: number): FarmScenarioItem {
  const letters = ['D', 'E', 'F', 'G', 'H', 'I'];
  const suffix = letters[existingCount - 3] || `${existingCount + 1}`;
  return {
    id: `scen-${Date.now()}`,
    name: `Scenario ${suffix}`,
    crop: '',
    area: 0,
    expectedYield: 0,
    yieldUnit: 'tons/ha',
    sellingPrice: 0,
    seedCost: 0,
    fertilizerCost: 0,
    pesticideCost: 0,
    labourCost: 0,
    otherCosts: 0,
    notes: 'Enter actual user scenario values.',
  };
}
