import {
  ProfitCalculatorInput,
  ProfitCalculatorResult,
  CostBreakdownItem,
  FarmScenarioItem,
  CalculatedScenario,
  ScenarioSimulationResult,
} from '../types';

/**
 * Reusable Farm Calculation Utilities
 * 
 * Provides pure mathematical & agronomic economic calculations for:
 * 1. Farm Cost & Profit Calculator
 * 2. Multi-Scenario Simulator
 * 3. Break-even & ROI modeling
 */

export const COST_COLORS = {
  seed: '#1565C0', // Blue
  fertilizer: '#2E7D32', // Forest Green
  pesticide: '#E65100', // Amber/Orange
  labour: '#7B1FA2', // Purple
  machinery: '#00838F', // Teal
  other: '#546E7A', // Slate
};

/**
 * Format Indian Rupee currency with standard commas
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

/**
 * Calculate dynamic cost, revenue, profit, per-hectare metrics and cost breakdown
 */
export function calculateCostAndProfit(input: ProfitCalculatorInput): ProfitCalculatorResult {
  const seed = Math.max(0, Number(input.seedCost) || 0);
  const fertilizer = Math.max(0, Number(input.fertilizerCost) || 0);
  const pesticide = Math.max(0, Number(input.pesticideCost) || 0);
  const labour = Math.max(0, Number(input.labourCost) || 0);
  const machinery = Math.max(0, Number(input.machineryCost) || 0);
  const other = Math.max(0, Number(input.otherExpenses) || 0);
  const area = Number(input.farmArea) > 0 ? Number(input.farmArea) : 0;

  // Total Cost Formula: Seed + Fertilizer + Pesticide + Labour + Machinery + Other
  const totalCost = seed + fertilizer + pesticide + labour + machinery + other;

  // Expected Revenue Formula: Expected Yield × Selling Price
  const expectedYield = Math.max(0, Number(input.expectedYield) || 0);
  const sellingPrice = Math.max(0, Number(input.sellingPrice) || 0);
  const expectedRevenue = expectedYield * sellingPrice;

  // Profit Formula: Revenue - Total Cost
  const expectedProfit = expectedRevenue - totalCost;

  // Profit per hectare: Profit / Farm Area
  const profitPerHectare = area > 0 ? Math.round(expectedProfit / area) : 0;
  const costPerHectare = area > 0 ? Math.round(totalCost / area) : 0;
  const revenuePerHectare = area > 0 ? Math.round(expectedRevenue / area) : 0;

  // ROI (%) and Margin (%)
  const roiPercentage = totalCost > 0 ? Number(((expectedProfit / totalCost) * 100).toFixed(1)) : 0;
  const profitMarginPercentage =
    expectedRevenue > 0 ? Number(((expectedProfit / expectedRevenue) * 100).toFixed(1)) : 0;

  // Cost breakdown list with percentage shares
  const breakdownList: CostBreakdownItem[] = [
    {
      name: 'Seed Cost',
      amount: seed,
      percentage: totalCost > 0 ? Number(((seed / totalCost) * 100).toFixed(1)) : 0,
      color: COST_COLORS.seed,
    },
    {
      name: 'Fertilizer Cost',
      amount: fertilizer,
      percentage: totalCost > 0 ? Number(((fertilizer / totalCost) * 100).toFixed(1)) : 0,
      color: COST_COLORS.fertilizer,
    },
    {
      name: 'Pesticide Cost',
      amount: pesticide,
      percentage: totalCost > 0 ? Number(((pesticide / totalCost) * 100).toFixed(1)) : 0,
      color: COST_COLORS.pesticide,
    },
    {
      name: 'Labour Cost',
      amount: labour,
      percentage: totalCost > 0 ? Number(((labour / totalCost) * 100).toFixed(1)) : 0,
      color: COST_COLORS.labour,
    },
    {
      name: 'Machinery Cost',
      amount: machinery,
      percentage: totalCost > 0 ? Number(((machinery / totalCost) * 100).toFixed(1)) : 0,
      color: COST_COLORS.machinery,
    },
    {
      name: 'Other Expenses',
      amount: other,
      percentage: totalCost > 0 ? Number(((other / totalCost) * 100).toFixed(1)) : 0,
      color: COST_COLORS.other,
    },
  ];

  // Break-even points
  const breakEvenYield = sellingPrice > 0 ? Number((totalCost / sellingPrice).toFixed(2)) : 0;
  const breakEvenPrice = expectedYield > 0 ? Math.round(totalCost / expectedYield) : 0;

  return {
    input,
    totalCost,
    expectedRevenue,
    expectedProfit,
    profitPerHectare,
    costPerHectare,
    revenuePerHectare,
    roiPercentage,
    profitMarginPercentage,
    breakdown: {
      seed,
      fertilizer,
      pesticide,
      labour,
      machinery,
      other,
    },
    breakdownList,
    breakEvenYield,
    breakEvenPrice,
  };
}

/**
 * Calculate dynamic financial & agronomic outcomes for a single farming scenario
 */
export function calculateScenario(scenario: FarmScenarioItem): CalculatedScenario {
  const seed = Math.max(0, Number(scenario.seedCost) || 0);
  const fertilizer = Math.max(0, Number(scenario.fertilizerCost) || 0);
  const pesticide = Math.max(0, Number(scenario.pesticideCost) || 0);
  const labour = Math.max(0, Number(scenario.labourCost) || 0);
  const other = Math.max(0, Number(scenario.otherCosts) || 0);
  const area = Number(scenario.area) > 0 ? Number(scenario.area) : 0;
  const yieldPerHa = Math.max(0, Number(scenario.expectedYield) || 0);
  const pricePerTon = Math.max(0, Number(scenario.sellingPrice) || 0);

  // Total Cost = Seed + Fertilizer + Pesticide + Labour + Other Costs
  const totalCost = seed + fertilizer + pesticide + labour + other;

  // Total Production = Area (ha) × Yield (tons/ha)
  const totalProductionTons = Number((area * yieldPerHa).toFixed(2));

  // Revenue = Total Production (tons) × Selling Price (₹/ton)
  const expectedRevenue = Math.round(totalProductionTons * pricePerTon);

  // Profit = Revenue - Total Cost
  const estimatedProfit = expectedRevenue - totalCost;

  // Profit per hectare = Profit / Area
  const profitPerHectare = area > 0 ? Math.round(estimatedProfit / area) : 0;
  const costPerHectare = area > 0 ? Math.round(totalCost / area) : 0;
  const revenuePerHectare = area > 0 ? Math.round(expectedRevenue / area) : 0;

  // ROI (%)
  const roiPercentage = totalCost > 0 ? Number(((estimatedProfit / totalCost) * 100).toFixed(1)) : 0;

  return {
    ...scenario,
    totalCost,
    totalProductionTons,
    expectedRevenue,
    estimatedProfit,
    profitPerHectare,
    costPerHectare,
    revenuePerHectare,
    roiPercentage,
  };
}

/**
 * Compare multiple farming scenarios and identify:
 * - Recommended Scenario
 * - Highest Profit
 * - Lowest Cost
 * - Highest Yield
 * - Best Overall Option
 */
export function compareScenarios(scenarios: FarmScenarioItem[]): ScenarioSimulationResult {
  if (!scenarios || scenarios.length === 0) {
    return {
      scenarios: [],
      recommendedScenario: null,
      highestProfitScenario: null,
      lowestCostScenario: null,
      highestYieldScenario: null,
      bestOverallScenario: null,
      recommendationReasoning: 'No scenarios created yet. Add at least one scenario to simulate outcomes.',
      simulationDisclaimer:
        'Enter your scenario values to receive an estimate. No sample data is used.',
    };
  }

  const calculated: CalculatedScenario[] = scenarios.map(calculateScenario);

  // Find extremes
  let highestProfitScen = calculated[0];
  let lowestCostScen = calculated[0];
  let highestYieldScen = calculated[0];
  let bestOverallScen = calculated[0];

  calculated.forEach((s) => {
    if (s.estimatedProfit > highestProfitScen.estimatedProfit) {
      highestProfitScen = s;
    }
    if (s.totalCost < lowestCostScen.totalCost) {
      lowestCostScen = s;
    }
    if (s.expectedYield > highestYieldScen.expectedYield) {
      highestYieldScen = s;
    }
  });

  // Best overall scores profit and ROI
  let maxScore = -Infinity;
  calculated.forEach((s) => {
    // Score weighted by profit and ROI
    const normalizedProfit = highestProfitScen.estimatedProfit > 0
      ? s.estimatedProfit / highestProfitScen.estimatedProfit
      : 0;
    const normalizedRoi = s.roiPercentage > 0 ? Math.min(2, s.roiPercentage / 100) : 0;
    const score = normalizedProfit * 0.7 + normalizedRoi * 0.3;
    if (score > maxScore) {
      maxScore = score;
      bestOverallScen = s;
    }
  });

  // Recommended Scenario is typically the highest profit scenario or best overall
  const recommendedScen = highestProfitScen.estimatedProfit > 0 ? highestProfitScen : bestOverallScen;

  // Mark badges on each scenario
  const markedScenarios = calculated.map((s) => ({
    ...s,
    isHighestProfit: s.id === highestProfitScen.id,
    isLowestCost: s.id === lowestCostScen.id,
    isHighestYield: s.id === highestYieldScen.id,
    isBestOverall: s.id === bestOverallScen.id,
    isRecommended: s.id === recommendedScen.id,
  }));

  // Generate dynamic recommendation reasoning
  let reasoning = '';
  if (recommendedScen) {
    reasoning = `${recommendedScen.name} (${recommendedScen.crop}) generates the highest estimated net return of ₹${formatINR(
      recommendedScen.estimatedProfit
    )} (₹${formatINR(recommendedScen.profitPerHectare)}/ha) with an ROI of ${
      recommendedScen.roiPercentage
    }%. It delivers the optimal trade-off between input investment and harvest revenue realization.`;
  } else {
    reasoning = 'Review individual scenario parameters to identify the optimal crop rotation.';
  }

  const simulationDisclaimer =
    'Simulation results are estimates based only on the parameters entered. Actual yields and market realizations may vary.';

  return {
    scenarios: markedScenarios,
    recommendedScenario: recommendedScen,
    highestProfitScenario: highestProfitScen,
    lowestCostScenario: lowestCostScen,
    highestYieldScenario: highestYieldScen,
    bestOverallScenario: bestOverallScen,
    recommendationReasoning: reasoning,
    simulationDisclaimer,
  };
}
