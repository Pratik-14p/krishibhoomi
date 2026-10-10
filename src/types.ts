export interface SoilMetrics {
  id: string;
  sampleName: string;
  testDate: string;
  soilType: string;
  ph: number | null;
  nitrogen: number | null;
  nitrogenStatus: SoilParameterStatus;
  phosphorus: number | null;
  phosphorusStatus: SoilParameterStatus;
  potassium: number | null;
  potassiumStatus: SoilParameterStatus;
  organicCarbon: number | null;
  electricalConductivity: number | null;
  sulphur?: number | null;
  zinc?: number | null;
  iron?: number | null;
  manganese?: number | null;
  copper?: number | null;
  boron?: number | null;
  micronutrients: {
    zinc: string;
    iron: string;
    copper: string;
    boron: string;
  };
  overallHealthScore: number | null;
  notes: string;
}

export interface CropRecommendation {
  id: string;
  cropName: string;
  category: 'Cereal' | 'Pulse' | 'Oilseed' | 'Cash Crop' | 'Vegetable' | 'Horticulture';
  suitabilityScore: number; // 0-100
  expectedYield: number; // quintals per acre
  marketPrice: number; // INR per quintal
  harvestDuration: string; // e.g. "120-130 days"
  season: 'Rabi' | 'Kharif' | 'Zaid' | '';
  riskFactor: 'Low' | 'Moderate' | 'High';
  soilFitReason: string;
  keyNutrientNeed: string;
}

export interface FertilizerPlan {
  id: string;
  nutrient: string;
  deficiencyStatus: 'Deficient' | 'Slightly Low' | 'Adequate' | 'Surplus';
  recommendedFertilizer: string;
  dosagePerAcre: string;
  timing: string;
  organicAlternative: string;
  environmentalImpact: 'Safe / Low Leaching' | 'Moderate' | 'Zero Residue';
}

export interface PesticideAdvisory {
  id: string;
  targetPestOrDisease: string;
  crop: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  earlyWarningSymptoms: string;
  bioFriendlyTreatment: string;
  approvedChemicalAlternative: string;
  waitingPeriodDays: number | null;
}

export interface YieldForecast {
  crop: string;
  baselineYield: number; // quintals/acre
  aiProjectedYield: number;
  confidence: number; // e.g. 92%
  primaryDriver: string;
}

export interface MarketPricePoint {
  commodity: string;
  currentPrice: number; // INR/quintal
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
  nearestMandi: string;
  bestSellingWindow: string;
  demandIndex: 'High' | 'Steady' | 'Volatile';
}

export interface CostProfitBreakdown {
  crop: string;
  landAreaAcres: number;
  seedsCost: number;
  fertilizerCost: number;
  laborOperationsCost: number;
  pestManagementCost: number;
  postHarvestCost: number;
  totalCost: number;
  grossRevenue: number;
  netProfit: number;
  returnOnInvestment: number;
}

export interface ScenarioModel {
  id: string;
  title: string;
  cropPattern: string;
  fertilizerStrategy: 'Standard Chemical' | 'Balanced Organic-Inorganic' | 'High-Organic Soil Building';
  projectedProfit: number;
  soilDepletionRisk: 'Minimal' | 'Moderate' | 'High';
  sustainabilityRating: number; // out of 100
}

export interface FarmActivity {
  id: string;
  taskName: string;
  assignedField: string;
  category: 'Soil Test' | 'Crop Advisory' | 'Fertilizer Plan' | 'Market Sync' | 'Pest Check';
  date: string;
  status: 'Completed' | 'Pending' | 'In Progress';
}

export interface FarmerProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  location: string;
  farmArea: number; // in acres
  soilType: string; // e.g. "Alluvial Loam", "Clay Loam", etc.
  preferredCrop: string; // e.g. "Wheat & Mustard"
  preferred_language?: string; // e.g. "en", "mr", "hi", "te", "ta", etc.
  avatarUrl?: string;
  memberSince?: string;
}

export interface User extends FarmerProfile {
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}

export type NutrientLevelStatus =
  | 'Very Low'
  | 'Low'
  | 'Medium'
  | 'Adequate'
  | 'High'
  | 'Very High'
  | 'Good'
  | 'Optimal'
  | 'Moderate';

/** Measurement and interpretation state, kept distinct from agronomic level. */
export type SoilParameterStatus = NutrientLevelStatus
  | 'Not tested'
  | 'Pending OCR review'
  | 'Needs review'
  | 'Not assessed';

export interface SoilParameterDetail {
  name: string;
  symbol: string;
  value: number | null;
  unit: string;
  status: SoilParameterStatus;
  idealRange: string;
  percentage: number | null;
  description: string;
  recommendation: string;
  confidence?: number;
  rawSnippet?: string;
}

export type PipelineStageKey =
  | 'upload_report'
  | 'file_validation'
  | 'ocr_processing'
  | 'data_extraction'
  | 'data_validation'
  | 'structured_data'
  | 'ai_interpretation';

export interface PipelineStageInfo {
  id: PipelineStageKey;
  stepNumber: number;
  name: string;
  label: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
}

export interface ExtractedSoilParameter {
  key: string;
  name: string;
  symbol: string;
  value: number | null;
  reportedValue?: number | string | null;
  reportedUnit?: string | null;
  reportedLabel?: string | null;
  unit: string;
  idealRange: string;
  status: SoilParameterStatus;
  confidence: number | null;
  rawSnippet?: string;
  isEdited?: boolean;
}

export interface ExtractedOCRReport {
  reportId: string;
  uploadId?: string;
  extractionStatus?: 'complete' | 'partial' | 'needs_review';
  extractedCount?: number;
  missingFields?: string[];
  fileName: string;
  fileType: string;
  fileSize: string;
  filePreviewUrl?: string;
  sampleId?: string;
  labName?: string;
  farmerName?: string;
  district?: string;
  soilTexture?: string;
  metadata?: {
    farmerName?: string;
    sampleId?: string;
    labName?: string;
    district?: string;
    soilType?: string;
    testDate?: string;
    reportNumber?: string;
    manualCorrections?: string[];
  };
  parameters: {
    nitrogen: ExtractedSoilParameter;
    phosphorus: ExtractedSoilParameter;
    potassium: ExtractedSoilParameter;
    ph: ExtractedSoilParameter;
    organicCarbon: ExtractedSoilParameter;
    sulphur: ExtractedSoilParameter;
    zinc: ExtractedSoilParameter;
    iron: ExtractedSoilParameter;
    manganese: ExtractedSoilParameter;
    copper: ExtractedSoilParameter;
    boron: ExtractedSoilParameter;
    electricalConductivity: ExtractedSoilParameter;
    [key: string]: ExtractedSoilParameter | undefined;
  };
  averageConfidence: number | null;
  detectedAt?: string;
  extractedAt?: string;
}

export interface SoilHealthSummary {
  fertilityStatus: string;
  fertilityScore?: number | null;
  fertilityRating?: 'Very Low' | 'Low' | 'Medium' | 'Adequate' | 'High' | 'Very High';
  majorDeficiencies: Array<
    | string
    | {
        nutrient: string;
        symbol: string;
        value: number;
        unit: string;
        severity?: 'Severe' | 'Moderate' | 'Mild';
        correctiveAction?: string;
      }
  >;
  excessNutrients: Array<
    | string
    | {
        nutrient: string;
        symbol: string;
        value: number;
        unit: string;
        risk?: string;
        managementAction?: string;
      }
  >;
  phCondition?: {
    value: number;
    classification: string;
    interpretation: string;
    remedy: string;
  };
  organicCarbonStatus?: {
    value: number;
    classification: string;
    humusLevel: string;
    biologicalHealth: string;
    recommendation: string;
  };
  recommendations?: string[];
  limitations?: string[];
  possibleLimitations?: string[];
  improvementSuggestions?: string[];
}

export interface OCRStageInfo {
  stage: 'uploading' | 'reading' | 'extracting' | 'validating' | 'generating' | 'completed';
  label: string;
  progress: number;
  detail: string;
}

export interface ManualSoilInput {
  nitrogen?: number | null;
  phosphorus?: number | null;
  potassium?: number | null;
  ph?: number | null;
  organicCarbon?: number | null;
  sulphur?: number;
  zinc?: number;
  iron?: number;
  manganese?: number;
  copper?: number;
  boron?: number;
  electricalConductivity?: number;
  soilType: string;
  farmArea: number;
  previousCrop: string;
  season: string;
  location: string;
}

export interface SoilAnalysisResult {
  id: string;
  sampleName: string;
  source: 'ocr' | 'manual';
  analyzedAt: string;
  isUserReport?: boolean;
  userId?: string;
  userEmail?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: string;
  filePreviewUrl?: string;
  healthScore: number | null;
  healthRating: 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Not assessed';
  conditionSummary: string;
  healthSummary?: SoilHealthSummary;
  summary?: SoilHealthSummary;
  parameters: {
    nitrogen: SoilParameterDetail;
    phosphorus: SoilParameterDetail;
    potassium: SoilParameterDetail;
    ph: SoilParameterDetail;
    organicCarbon: SoilParameterDetail;
    sulphur?: SoilParameterDetail;
    zinc?: SoilParameterDetail;
    iron?: SoilParameterDetail;
    manganese?: SoilParameterDetail;
    copper?: SoilParameterDetail;
    boron?: SoilParameterDetail;
    electricalConductivity?: SoilParameterDetail;
    [key: string]: SoilParameterDetail | undefined;
  };
  fieldMetadata: {
    soilType: string;
    farmArea: number;
    previousCrop: string;
    season: string;
    location: string;
  };
  micronutrients?: {
    zinc: string;
    iron: string;
    copper: string;
    boron: string;
    manganese?: string;
    sulphur?: string;
  };
  soilMetrics: SoilMetrics;
}

// -------------------------------------------------------------
// 1. Crop Recommendation Types
// -------------------------------------------------------------
export interface CropRecommendationInput {
  userId?: string;
  soilReportId?: string;
  soilN: number;
  soilP: number;
  soilK: number;
  ph: number;
  organicCarbon: number;
  soilType: string;
  farmArea: number;
  season: 'Rabi' | 'Kharif' | 'Zaid' | '';
  previousCrop: string;
  location?: string;
  state?: string;
  district?: string;
  electricalConductivity?: number;
  sulphur?: number;
  zinc?: number;
  iron?: number;
  manganese?: number;
  copper?: number;
  boron?: number;
  irrigationAvailability?: 'rainfed' | 'irrigated' | '';
  sowingMonth?: number | '';
}

export interface RankedCropRecommendation {
  id: string;
  rank: number;
  cropName: string;
  category: 'Cereal' | 'Pulse' | 'Oilseed' | 'Cash Crop' | 'Vegetable' | 'Horticulture' | 'Exotic Superfood' | 'Plantation' | 'Spices';
  origin?: 'National' | 'International Export';
  scientificName?: string;
  suitability: number; // e.g. 94%
  expectedYieldPerAcre?: number;
  expectedTotalYield?: number;
  yieldUnit?: string;
  estimatedCostPerAcre?: number;
  estimatedTotalCost?: number;
  expectedRevenuePerAcre?: number;
  expectedTotalRevenue?: number;
  estimatedProfitPerAcre?: number;
  estimatedTotalProfit?: number;
  roiPercentage?: number;
  harvestDuration?: string;
  season: 'Rabi' | 'Kharif' | 'Zaid';
  riskFactor?: 'Low' | 'Moderate' | 'High';
  soilFitReason: string;
  keyNutrientNeed?: string;
  waterNeed?: 'Low' | 'Medium' | 'High';
  marketPricePerQuintal?: number;
  scoreMeaning?: string;
  scoreFactors?: Record<string, number>;
  reasons?: string[];
  limitingFactors?: string[];
  missingInformation?: string[];
  observedOptionalSoilMeasurements?: Record<string, number | null>;
  details: {
    idealSoilPh: string;
    temperatureRange?: string;
    sowingWindow?: string;
    commonVarieties: string[];
    agronomyTips?: string[];
    breakdownCosts?: {
      seeds: number;
      fertilizer: number;
      laborOperations: number;
      protectionAndOther: number;
    };
  };
}

export interface CropRecommendationResponse {
  input: CropRecommendationInput;
  timestamp: string;
  recommendations: RankedCropRecommendation[];
  summaryNote: string;
}

// -------------------------------------------------------------
// 2. Fertilizer Recommendation Types
// -------------------------------------------------------------
export interface FertilizerRecommendationInput {
  soilN: number | null;
  soilP: number | null;
  soilK: number | null;
  ph: number | null;
  organicCarbon?: number | null;
  targetCrop: string;
  soilReportId?: string;
  farmArea: number;
  season?: string;
  soilType?: string;
  targetYieldGoal?: 'Standard Target Yield' | 'High Yield Hybrid Target' | 'Intensive Maximum Production' | '';
  irrigationType?: 'Canal / Tubewell Irrigated' | 'Rainfed / Semi-Arid' | '';
  growthStage?: string;
  previouslyAppliedFertilizers?: string;
}

export interface NutrientConditionSummary {
  nitrogen: {
    value: number | null;
    status: 'Low' | 'Medium' | 'Good' | 'High' | 'Unknown';
    note: string;
  };
  phosphorus: {
    value: number | null;
    status: 'Low' | 'Medium' | 'Good' | 'High' | 'Unknown';
    note: string;
  };
  potassium: {
    value: number | null;
    status: 'Low' | 'Medium' | 'Good' | 'High' | 'Unknown';
    note: string;
  };
  ph: {
    value: number | null;
    status: 'Acidic' | 'Optimal / Neutral' | 'Slightly Alkaline' | 'Alkaline' | 'Unknown';
    note: string;
  };
  organicCarbon?: { value: number | null; status: 'Low' | 'Medium' | 'Good' | 'High' | 'Unknown'; note: string };
  otherMeasurements?: Record<string, number | null>;
}

export interface RecommendedFertilizerItem {
  id: string;
  category: 'Macronutrient' | 'Secondary & Micronutrient' | 'Bio-Fertilizer & Organic Conditioner';
  fertilizer: string;
  nutrientTargeted: string;
  purpose: string;
  estimatedQuantityPerAcre: string;
  estimatedTotalQuantity: string;
  applicationStage: string;
  applicationGuidance: string;
  organicAlternative?: string;
  environmentalImpact?: string;
  estimatedCostTotal?: number;
}

export interface CalibrationBreakdown {
  cropCategory: string;
  baseRDF: { n: number; p: number; k: number };
  yieldMultiplier: number;
  factors: { nFactor: number; pFactor: number; kFactor: number };
  netRequirementPerAcre: { n: number; p2o5: number; k2o: number };
}

export interface FertilizerRecommendationResponse {
  input: FertilizerRecommendationInput;
  timestamp: string;
  nutrientConditions: NutrientConditionSummary;
  fertilizers: RecommendedFertilizerItem[];
  soilHealthAdvisory: string;
  calibrationBreakdown?: CalibrationBreakdown;
}

// -------------------------------------------------------------
// 3. Pesticide Recommendation Types
// -------------------------------------------------------------
export interface PesticideRecommendationInput {
  soilReportId: string;
  crop: string;
  growthStage: string;
  observedProblem: string;
  farmArea?: number;
  soilN?: number | null;
  soilP?: number | null;
  soilK?: number | null;
  ph?: number | null;
  organicCarbon?: number | null;
  soilType?: string;
  location?: string;
}

export interface PesticideRecommendationResult {
  id: string;
  crop: string;
  growthStage: string;
  observedProblem: string;
  possibleProblem: string;
  scientificName?: string;
  problemCategory: 'Fungal Disease' | 'Insect Pest' | 'Bacterial Blight' | 'Viral / Vector' | 'Nutrient Stress' | 'IPM Advisory';
  severityLevel: 'Mild' | 'Moderate' | 'Severe' | 'Critical' | 'Not assessed';
  soilVulnerabilityFactor?: string;
  soilManagementIPM?: string;
  recommendedTreatment: {
    botanicalBio: string;
    approvedChemical: string;
  };
  applicationGuidance: {
    dosage: string;
    waterVolume: string;
    equipment: string;
    timingAndWeather: string;
    frequency: string;
  };
  safetyPrecautions: string[];
  waitingPeriodDays: number | null;
  mandatoryDisclaimer: string;
  fertilizerInteractionInsight?: string;
  areaScaledQuantities?: {
    chemicalTotal: string;
    waterTotal: string;
    knapsackRefills: number;
    estimatedCost: number;
  };
  allTreatmentOptions?: Array<{
    name: string;
    type: 'Biological' | 'Chemical' | 'Cultural';
    dosage: string;
    totalNeeded: string;
    method: string;
    cost?: number;
    source?: string;
  }>;
}

export interface PesticideRecommendationResponse {
  input: PesticideRecommendationInput;
  timestamp: string;
  diagnosis: PesticideRecommendationResult;
}

// -------------------------------------------------------------
// 4. Yield Prediction Types
// -------------------------------------------------------------
export interface YieldPredictionInput {
  soilReportId?: string;
  crop: string;
  farmArea: number;
  soilN: number;
  soilP: number;
  soilK: number;
  ph: number;
  organicCarbon?: number;
  previousYield: number;
  season: 'Rabi' | 'Kharif' | 'Zaid' | '';
  location?: string;
  state?: string;
  district?: string;
  soilType?: string;
  irrigationType?: string;
  fertilizerPlanApplied?: boolean;
  pesticideIpmManaged?: boolean;
  pestThreatMitigated?: string;
}

export interface YieldPredictionResult {
  id: string;
  crop: string;
  farmArea: number;
  season: string;
  location?: string;
  soilType?: string;
  expectedYield: number; // Quintals / acre
  expectedTotalProduction: number; // Total quintals
  previousYield: number; // Quintals / acre
  previousTotalProduction: number; // Total quintals
  averageYield: number; // District average Quintals / acre
  averageTotalProduction: number; // Total benchmark quintals
  percentageGainOverPrevious: number; // %
  percentageGainOverAverage: number; // %
  confidenceScore: number; // e.g. 93.4%
  primaryDrivers: string[];
  riskMitigations: string[];
  fertilizerImpact?: {
    upliftQuintals: number;
    description: string;
  };
  pesticideIpmImpact?: {
    lossAvertedQuintals: number;
    description: string;
  };
  locationBenchmarkContext?: {
    district: string;
    state: string;
    agroClimaticZone: string;
    soilSuitability: string;
  };
  comparisonChartData: {
    category: string;
    yieldPerAcre: number;
    totalYield: number;
    description: string;
  }[];
  monthlyGrowthProjection: {
    month: string;
    expectedBiomassPercentage: number;
    keyMilestone: string;
  }[];
}

export interface YieldPredictionResponse {
  input: YieldPredictionInput;
  timestamp: string;
  prediction: YieldPredictionResult;
}

// -------------------------------------------------------------
// 5. Market Analysis Types
// -------------------------------------------------------------
export type MarketDateRange = '7d' | '30d' | '3m' | '6m' | '1y';

export interface MarketHistoricalDataPoint {
  date: string;
  displayDate?: string;
  price?: number | null; // In ₹/quintal
  historicalPrice: number | null; // In ₹/quintal
  currentPriceMarker?: number | null; // Marker at latest actual date
  predictedPrice: number | null; // In ₹/quintal for forecast dates
  confidenceLower?: number | null;
  confidenceUpper?: number | null;
  volumeQuintals?: number; // In Quintals
  arrivalVolume?: number; // In Quintals
}

export interface MarketAnalysisFilter {
  crop: string;
  market: string;
  dateRange: MarketDateRange;
  location?: string;
}

export interface NearbyMandiPrice {
  mandiName: string;
  distanceKm: number;
  currentPrice: number;
  priceTrend: 'up' | 'down' | 'stable';
  dailyVolumeQuintals: number;
}

export interface MarketAnalysisData {
  filter: MarketAnalysisFilter;
  crop: string;
  market: string;
  location?: string;
  primaryMandi?: string;
  clusterState?: string;
  currentPrice: number; // ₹/Quintal
  previousPrice: number; // ₹/Quintal
  priceChange: number; // ₹
  priceChangePercent: number; // %
  averagePrice: number; // ₹/Quintal
  predictedPrice: number | null; // ₹/Quintal
  predictedChangePercent: number | null; // %
  predictedHorizon: string; // e.g. "Next 15-30 Days"
  priceTrend: 'Bullish' | 'Bearish' | 'Stable';
  trendConfidence: number | null; // % e.g. 91%
  mspPrice: number | null; // Govt Minimum Support Price (₹/Quintal)
  mspSpreadPercent: number | null; // % premium over MSP
  highestPrice: number; // In selected range
  lowestPrice: number; // In selected range
  arrivalVolumeQuintals: number | null; // Daily mandi arrivals
  arrivalTrend: 'Increasing' | 'Decreasing' | 'Normal';
  demandIndex: 'High' | 'Steady' | 'Volatile';
  volatilityIndex: 'Low' | 'Moderate' | 'High';
  periodLabel?: string;
  periodPriceChange?: number;
  periodPriceChangePercent?: number;
  rangeLow?: number;
  rangeHigh?: number;
  bestSellingWindow: string;
  advisoryNote: string;
  chartData: MarketHistoricalDataPoint[];
  nearbyMandis: NearbyMandiPrice[];
}

// -------------------------------------------------------------
// 6. Cost & Profit Calculator Types
// -------------------------------------------------------------
export interface ProfitCalculatorInput {
  cropName: string;
  farmArea: number; // in Hectares
  seedCost: number; // in ₹
  fertilizerCost: number; // in ₹
  pesticideCost: number; // in ₹
  labourCost: number; // in ₹
  machineryCost: number; // in ₹
  otherExpenses: number; // in ₹
  expectedYield: number; // total expected yield (e.g. quintals or tons)
  yieldPerHectare: number; // calculated or entered per ha
  yieldUnit: 'tons' | 'quintals';
  sellingPrice: number; // ₹ per unit (e.g. ₹/ton or ₹/quintal)
}

export interface CostBreakdownItem {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface ProfitCalculatorResult {
  input: ProfitCalculatorInput;
  totalCost: number;
  expectedRevenue: number;
  expectedProfit: number;
  profitPerHectare: number;
  costPerHectare: number;
  revenuePerHectare: number;
  roiPercentage: number;
  profitMarginPercentage: number;
  breakdown: {
    seed: number;
    fertilizer: number;
    pesticide: number;
    labour: number;
    machinery: number;
    other: number;
  };
  breakdownList: CostBreakdownItem[];
  breakEvenYield: number; // yield required to cover total costs
  breakEvenPrice: number; // price required to cover total costs
}

// -------------------------------------------------------------
// 7. Smart Farm Scenario Simulator Types
// -------------------------------------------------------------
export interface FarmScenarioItem {
  id: string;
  name: string; // e.g. "Scenario A", "Scenario B", "Scenario C"
  crop: string; // e.g. "Wheat", "Chickpea", "Mustard"
  area: number; // in Hectares
  expectedYield: number; // tons/ha
  yieldUnit: 'tons/ha';
  sellingPrice: number; // ₹/ton
  seedCost: number; // ₹
  fertilizerCost: number; // ₹
  pesticideCost: number; // ₹
  labourCost: number; // ₹
  otherCosts: number; // ₹
  costsConfirmed?: boolean;
  notes?: string;
}

export interface CalculatedScenario extends FarmScenarioItem {
  totalCost: number;
  totalProductionTons: number;
  expectedRevenue: number;
  estimatedProfit: number;
  profitPerHectare: number;
  costPerHectare: number;
  revenuePerHectare: number;
  roiPercentage: number;
  isHighestProfit?: boolean;
  isLowestCost?: boolean;
  isHighestYield?: boolean;
  isBestOverall?: boolean;
  isRecommended?: boolean;
}

export interface ScenarioSimulationResult {
  scenarios: CalculatedScenario[];
  recommendedScenario: CalculatedScenario | null;
  highestProfitScenario: CalculatedScenario | null;
  lowestCostScenario: CalculatedScenario | null;
  highestYieldScenario: CalculatedScenario | null;
  bestOverallScenario: CalculatedScenario | null;
  recommendationReasoning: string;
  simulationDisclaimer: string;
}

// -------------------------------------------------------------
// 8. Personalized Farming Strategy Types (AI combines all analysis)
// -------------------------------------------------------------
export interface StrategyTaskItem {
  id: string;
  description: string;
  completed: boolean;
  priority: 'Critical' | 'High' | 'Routine';
  daysFromSowing?: number;
  recommendedProduct?: string;
  notes?: string;
}

export interface FarmingStrategyPhase {
  id: string;
  phaseNumber: number;
  phaseName: string;
  timing: string;
  objective: string;
  soilConditioning: string;
  fertilizerAction: string;
  irrigationSchedule: string;
  pestProtection: string;
  tasks: StrategyTaskItem[];
}

export interface PersonalizedFarmingStrategy {
  id: string;
  soilReportId: string | null;
  generatedAt: string;
  farmerName: string;
  farmLocation: string;
  farmAreaAcres: number | null;
  season: string;
  targetCrop: string;
  soilHealthSummary: {
    healthScore: number | null;
    ph: number | null;
    n: number | null;
    p: number | null;
    k: number | null;
    organicCarbon: number | null;
    keyDeficiency: string;
    soilType: string;
  };
  executiveVerdict: string;
  phases: FarmingStrategyPhase[];
  economicForecast: {
    estimatedCost: number | null;
    estimatedRevenue: number | null;
    estimatedProfit: number | null;
    projectedYield: number | null;
    roi: number | null;
  };
  riskMitigation: Array<{
    risk: string;
    mitigationPlan: string;
    triggerCondition: string;
  }>;
  aiAgronomistNotes: string[];
}

// -------------------------------------------------------------
// 9. End-to-End Decision Flowchart Types
// -------------------------------------------------------------
export interface DecisionFlowNode {
  id: string;
  stageNumber: number;
  title: string;
  subtitle: string;
  tabKey: string;
  status: 'completed' | 'active' | 'ready';
  summaryBadge?: string;
  details?: string;
}


