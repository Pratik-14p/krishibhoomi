import { ProfitCalculatorInput, ProfitCalculatorResult } from '../types';
import { calculateCostAndProfit } from '../utils/farmCalculations';
import { api } from './api';
import { mysqlService } from './mysqlService';

/**
 * Farm Cost & Profit Calculator Service
 * Connected to Flask API: POST /api/profit/calculate
 */
const API_ENDPOINT = '/profit/calculate';

export interface CropBudgetPreset {
  id: string;
  cropName: string;
  category: string;
  defaultAreaHa: number;
  seedCost: number;
  fertilizerCost: number;
  pesticideCost: number;
  labourCost: number;
  machineryCost: number;
  otherExpenses: number;
  expectedYield: number; // in tons or quintals
  yieldPerHectare: number;
  yieldUnit: 'tons' | 'quintals';
  sellingPrice: number; // ₹ per unit
  description: string;
}

export const CROP_BUDGET_PRESETS: CropBudgetPreset[] = [];

/**
 * Execute dynamic calculation
 */
export async function computeFarmProfit(input: ProfitCalculatorInput): Promise<ProfitCalculatorResult> {
  const res = await api.post<any>(API_ENDPOINT, {
    farmArea: input.farmArea,
    cropName: input.cropName,
    seedCost: input.seedCost,
    fertilizerCost: input.fertilizerCost,
    pesticideCost: input.pesticideCost,
    labourCost: input.labourCost,
    machineryCost: input.machineryCost,
    otherExpenses: input.otherExpenses,
    expectedYield: input.expectedYield,
    sellingPrice: input.sellingPrice,
    yieldUnit: input.yieldUnit || 'tons',
    costsConfirmed: true,
  });

  const payload = res.data?.data || res.data;
  const calc = payload?.calculation || payload;
  const requiredNumbers = ['totalCost', 'totalRevenue', 'netProfit', 'roiPercentage', 'profitMargin', 'costPerHectare', 'revenuePerHectare', 'profitPerHectare'];
  if (!calc || requiredNumbers.some((field) => !Number.isFinite(Number(calc[field])))) {
    throw new Error('The cost and profit service returned incomplete results. Please retry.');
  }

  // Compute standard structural elements (colors, breakdown list, break-even)
  const baseResult = calculateCostAndProfit(input);

  // Directly apply backend numbers if returned
  const finalResult: ProfitCalculatorResult = {
    ...baseResult,
    totalCost: Number(calc.totalCost),
    expectedRevenue: Number(calc.totalRevenue),
    expectedProfit: Number(calc.netProfit),
    roiPercentage: Number(calc.roiPercentage),
    profitMarginPercentage: Number(calc.profitMargin),
    costPerHectare: Number(calc.costPerHectare),
    revenuePerHectare: Number(calc.revenuePerHectare),
    profitPerHectare: Number(calc.profitPerHectare),
  };

  // Persist through the active API backend table
  mysqlService.saveProfitCalculation(input, finalResult).catch((err) => {
    console.warn('[profitCalculatorService] Aiven database sync notice:', err);
  });

  return finalResult;
}

/**
 * Legacy local calculation fallback
 */
export function calculateLocalProfit(input: ProfitCalculatorInput): ProfitCalculatorResult {
  return calculateCostAndProfit(input);
}
