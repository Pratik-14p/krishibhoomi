import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Coins,
  TrendingUp,
  TrendingDown,
  Calculator,
  RotateCcw,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  PieChart as PieIcon,
  BarChart3,
  Layers,
  Leaf,
} from 'lucide-react';
import { ProfitCalculatorInput, ProfitCalculatorResult } from '../../types';
import { computeFarmProfit } from '../../services/profitCalculatorService';
import {
  calculateCostAndProfit,
  formatINR,
  COST_COLORS,
} from '../../utils/farmCalculations';

interface CostProfitCalculatorModuleProps {
  initialCrop?: string;
}

export const CostProfitCalculatorModule: React.FC<CostProfitCalculatorModuleProps> = ({
  initialCrop,
}) => {
  const emptyInput: ProfitCalculatorInput = {
    cropName: initialCrop || '',
    farmArea: 0,
    seedCost: 0,
    fertilizerCost: 0,
    pesticideCost: 0,
    labourCost: 0,
    machineryCost: 0,
    otherExpenses: 0,
    expectedYield: 0,
    yieldPerHectare: 0,
    yieldUnit: 'tons',
    sellingPrice: 0,
  };

  const [inputs, setInputs] = useState<ProfitCalculatorInput>(emptyInput);
  const [activePresetId, setActivePresetId] = useState<string>('custom');
  const [serverResult, setServerResult] = useState<ProfitCalculatorResult | null>(null);
  const [costsConfirmed, setCostsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);


  // Apply a preset
  const handleResetInputs = () => {
    setInputs({ ...emptyInput });
    setCostsConfirmed(false);
    setActivePresetId('custom');
    setServerResult(null); setRequestError(null);
  };

  // Field change handler
  const handleInputChange = (field: keyof ProfitCalculatorInput, value: any) => {
    setCostsConfirmed(false);
    setServerResult(null);
    setInputs((prev) => {
      const updated = { ...prev, [field]: value };
      // If farm area or yield per ha changed, update expected total yield automatically
      if (field === 'farmArea' || field === 'yieldPerHectare') {
        const area = field === 'farmArea' ? Number(value) : prev.farmArea;
        const perHa = field === 'yieldPerHectare' ? Number(value) || 0 : prev.yieldPerHectare;
        updated.expectedYield = Number((area * perHa).toFixed(2));
      } else if (field === 'expectedYield') {
        const total = Number(value) || 0;
        const area = prev.farmArea;
        updated.yieldPerHectare = area > 0 ? Number((total / area).toFixed(2)) : 0;
      }
      return updated;
    });
    setActivePresetId('custom');
  };

  // Dynamic calculations via pure utility
  const localResult = useMemo(() => calculateCostAndProfit(inputs), [inputs]);
  const result = serverResult || localResult;
  const handleCalculate = async () => {
    if (!costsConfirmed) { setRequestError('Confirm that every cost field is entered and any zero reflects a genuinely zero cost.'); return; }
    if (!inputs.cropName.trim() || inputs.farmArea <= 0 || inputs.expectedYield < 0 || inputs.sellingPrice < 0) { setRequestError('Enter your crop, positive farm area, expected yield and selling price before calculating.'); return; }
    setLoading(true); setRequestError(null);
    try { setServerResult(await computeFarmProfit(inputs)); }
    catch (error) { setRequestError(error instanceof Error ? error.message : 'Cost and profit data is unavailable. Please retry.'); }
    finally { setLoading(false); }
  };

  // Comparison Bar Chart Data
  const financialBarData = useMemo(() => {
    return [
      {
        category: 'Farm Total (₹)',
        Revenue: result.expectedRevenue,
        Cost: result.totalCost,
        Profit: result.expectedProfit,
      },
      {
        category: 'Per Hectare (₹/ha)',
        Revenue: result.revenuePerHectare,
        Cost: result.costPerHectare,
        Profit: result.profitPerHectare,
      },
    ];
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#E8F5E9] text-[#2E7D32]">
              Financial Economics
            </span>
            <span className="text-xs text-gray-400 font-medium">• Dynamic Budgeting Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#37474F] mt-1">
            Farm Cost & Profit Calculator
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Model input investments against expected harvest yields and mandi realizations to determine net farm margin and ROI.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F1F8E9] text-[#2E7D32] rounded-xl text-xs font-bold border border-[#C8E6C9]">
          <Calculator className="w-4 h-4" />
          Interactive Financial Engine
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800">
        Enter your actual farm costs, expected yield and verified selling price. No sample budget or mandi price is preloaded.
      </div>

      {/* Inputs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Controls Form */}
        <div className="lg:col-span-7 bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-base text-[#37474F]">Input Cost & Yield Parameters</h3>
              <p className="text-xs text-gray-400">Enter your actual costs, yield and selling price, then calculate.</p>
            </div>
            <button onClick={handleCalculate} disabled={loading} className="rounded-lg bg-[#2E7D32] px-3 py-2 text-xs font-bold text-white disabled:opacity-50">{loading ? 'Calculating…' : 'Calculate'}</button>
            <button
              onClick={handleResetInputs}
              className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-[#2E7D32] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
          </div>

          {/* Farm Area & Crop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#37474F] mb-1">
                Crop Name / Variety
              </label>
              <input
                type="text"
                value={inputs.cropName}
                onChange={(e) => handleInputChange('cropName', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-[#E0E0E0] rounded-xl text-xs font-bold text-[#37474F] focus:border-[#2E7D32] focus:bg-white outline-hidden"
                placeholder="e.g. Wheat (HD-2967)"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-[#37474F]">Farm Area (Hectares)</label>
                <span className="text-xs font-black text-[#2E7D32]">{inputs.farmArea} ha</span>
              </div>
              <input
                type="number"
                min="0.5"
                max="100"
                step="0.5"
                value={inputs.farmArea}
                onChange={(e) => handleInputChange('farmArea', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-[#E0E0E0] rounded-xl text-xs font-bold text-[#37474F] focus:border-[#2E7D32] focus:bg-white outline-hidden"
              />
            </div>
          </div>

          {/* Input Costs Matrix */}
          <label className="mb-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <input type="checkbox" checked={costsConfirmed} onChange={(event) => { setCostsConfirmed(event.target.checked); setServerResult(null); }} />
            <span>I entered each cost explicitly. Any zero cost is genuinely zero; yield and selling price are farmer-entered assumptions unless separately verified.</span>
          </label>
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">
              Cost Components (₹ Total for Farm)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Seed Cost */}
              <div className="p-3 bg-gray-50 rounded-xl border border-[#E0E0E0] focus-within:border-[#2E7D32] focus-within:bg-white transition-all">
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  1. Seed Cost (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={inputs.seedCost}
                  onChange={(e) => handleInputChange('seedCost', parseFloat(e.target.value) || 0)}
                  className="w-full font-extrabold text-[#37474F] bg-transparent outline-hidden text-sm"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  ₹{Math.round(inputs.seedCost / (inputs.farmArea || 1))}/ha
                </span>
              </div>

              {/* Fertilizer Cost */}
              <div className="p-3 bg-gray-50 rounded-xl border border-[#E0E0E0] focus-within:border-[#2E7D32] focus-within:bg-white transition-all">
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  2. Fertilizer Cost (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={inputs.fertilizerCost}
                  onChange={(e) => handleInputChange('fertilizerCost', parseFloat(e.target.value) || 0)}
                  className="w-full font-extrabold text-[#37474F] bg-transparent outline-hidden text-sm"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  ₹{Math.round(inputs.fertilizerCost / (inputs.farmArea || 1))}/ha
                </span>
              </div>

              {/* Pesticide Cost */}
              <div className="p-3 bg-gray-50 rounded-xl border border-[#E0E0E0] focus-within:border-[#2E7D32] focus-within:bg-white transition-all">
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  3. Pesticide Cost (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={inputs.pesticideCost}
                  onChange={(e) => handleInputChange('pesticideCost', parseFloat(e.target.value) || 0)}
                  className="w-full font-extrabold text-[#37474F] bg-transparent outline-hidden text-sm"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  ₹{Math.round(inputs.pesticideCost / (inputs.farmArea || 1))}/ha
                </span>
              </div>

              {/* Labour Cost */}
              <div className="p-3 bg-gray-50 rounded-xl border border-[#E0E0E0] focus-within:border-[#2E7D32] focus-within:bg-white transition-all">
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  4. Labour Cost (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={inputs.labourCost}
                  onChange={(e) => handleInputChange('labourCost', parseFloat(e.target.value) || 0)}
                  className="w-full font-extrabold text-[#37474F] bg-transparent outline-hidden text-sm"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  ₹{Math.round(inputs.labourCost / (inputs.farmArea || 1))}/ha
                </span>
              </div>

              {/* Machinery Cost */}
              <div className="p-3 bg-gray-50 rounded-xl border border-[#E0E0E0] focus-within:border-[#2E7D32] focus-within:bg-white transition-all">
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  5. Machinery Cost (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={inputs.machineryCost}
                  onChange={(e) => handleInputChange('machineryCost', parseFloat(e.target.value) || 0)}
                  className="w-full font-extrabold text-[#37474F] bg-transparent outline-hidden text-sm"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Tractor / harvester hire
                </span>
              </div>

              {/* Other Expenses */}
              <div className="p-3 bg-gray-50 rounded-xl border border-[#E0E0E0] focus-within:border-[#2E7D32] focus-within:bg-white transition-all">
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  6. Other Expenses (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={inputs.otherExpenses}
                  onChange={(e) => handleInputChange('otherExpenses', parseFloat(e.target.value) || 0)}
                  className="w-full font-extrabold text-[#37474F] bg-transparent outline-hidden text-sm"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Irrigation, bagging, transport
                </span>
              </div>
            </div>
          </div>

          {/* Production & Selling Inputs */}
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">
              Production & Market Realization
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#F7FBF7] rounded-xl border border-[#C8E6C9]">
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Yield per Hectare (tons/ha)
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={inputs.yieldPerHectare}
                  onChange={(e) => handleInputChange('yieldPerHectare', parseFloat(e.target.value) || 0)}
                  className="w-full font-extrabold text-[#2E7D32] bg-transparent outline-hidden text-sm"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  ({(inputs.yieldPerHectare * 10).toFixed(1)} Quintals/ha)
                </span>
              </div>

              <div className="p-3 bg-[#F7FBF7] rounded-xl border border-[#C8E6C9]">
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Expected Total Yield (tons)
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={inputs.expectedYield}
                  onChange={(e) => handleInputChange('expectedYield', parseFloat(e.target.value) || 0)}
                  className="w-full font-extrabold text-[#2E7D32] bg-transparent outline-hidden text-sm"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  For {inputs.farmArea} hectares parcel
                </span>
              </div>

              <div className="p-3 bg-[#F7FBF7] rounded-xl border border-[#C8E6C9]">
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Selling Price (₹/ton)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={inputs.sellingPrice}
                  onChange={(e) => handleInputChange('sellingPrice', parseFloat(e.target.value) || 0)}
                  className="w-full font-extrabold text-[#1565C0] bg-transparent outline-hidden text-sm"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  ₹{Math.round(inputs.sellingPrice / 10)} / Quintal
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`lg:col-span-5 space-y-4 ${serverResult ? '' : 'hidden'}`}>
          {/* Revenue Card */}
          <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              <span>Expected Revenue</span>
              <span className="text-xs font-bold text-[#1565C0] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                Yield × Price
              </span>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-[#1565C0]">
              ₹{formatINR(result.expectedRevenue)}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Revenue per Hectare:</span>
              <span className="font-extrabold text-[#37474F]">
                ₹{formatINR(result.revenuePerHectare)} / ha
              </span>
            </div>
          </div>

          {/* Total Cost Card */}
          <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              <span>Total Farm Cost</span>
              <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
                Sum of 6 Inputs
              </span>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-[#37474F]">
              ₹{formatINR(result.totalCost)}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Cost per Hectare:</span>
              <span className="font-extrabold text-[#37474F]">
                ₹{formatINR(result.costPerHectare)} / ha
              </span>
            </div>
          </div>

          {/* Profit Card */}
          <div className={`rounded-2xl p-6 shadow-2xs border ${
            result.expectedProfit >= 0
              ? 'bg-gradient-to-br from-[#F1F8E9] via-white to-[#E8F5E9] border-[#C8E6C9]'
              : 'bg-[#FFEBEE] border-red-200'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2">
              <span className={result.expectedProfit >= 0 ? 'text-[#2E7D32]' : 'text-red-700'}>
                Expected Net Profit
              </span>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                result.expectedProfit >= 0
                  ? 'bg-[#2E7D32] text-white shadow-2xs'
                  : 'bg-red-600 text-white'
              }`}>
                {result.expectedProfit >= 0 ? 'Surplus' : 'Deficit'}
              </span>
            </div>
            <p className={`text-3xl sm:text-4xl font-black ${
              result.expectedProfit >= 0 ? 'text-[#2E7D32]' : 'text-[#C62828]'
            }`}>
              {result.expectedProfit < 0 ? '-' : ''}₹{formatINR(Math.abs(result.expectedProfit))}
            </p>

            {/* Profit per Hectare & ROI Badges */}
            <div className="mt-4 pt-4 border-t border-[#C8E6C9]/60 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/80 p-2.5 rounded-xl border border-[#C8E6C9]">
                <span className="text-[10px] font-bold text-gray-500 block uppercase">
                  Profit per Hectare
                </span>
                <span className="text-base font-black text-[#2E7D32] mt-0.5 block">
                  ₹{formatINR(result.profitPerHectare)}/ha
                </span>
              </div>

              <div className="bg-white/80 p-2.5 rounded-xl border border-[#C8E6C9]">
                <span className="text-[10px] font-bold text-gray-500 block uppercase">
                  Return on Investment
                </span>
                <span className="text-base font-black text-[#1565C0] mt-0.5 block">
                  {result.roiPercentage}% ROI
                </span>
              </div>
            </div>

            {/* Break-Even Insight */}
            <div className="mt-4 p-3 bg-white/90 rounded-xl border border-[#C8E6C9] text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Break-Even Yield Needed:</span>
                <strong className="text-[#37474F]">{result.breakEvenYield} tons ({(result.breakEvenYield / (inputs.farmArea || 1)).toFixed(2)} t/ha)</strong>
              </div>
              <div className="flex justify-between">
                <span>Break-Even Price Needed:</span>
                <strong className="text-[#37474F]">₹{formatINR(result.breakEvenPrice)} / ton</strong>
              </div>
            </div>
          </div>
          </div>
        </div>

      {/* Visual Analytics Row: Cost Breakdown Chart + Revenue vs Cost vs Profit Chart */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${serverResult ? '' : 'hidden'}`}>
        {/* Cost Breakdown Donut Chart */}
        <div className="lg:col-span-6 bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-base text-[#37474F]">Input Cost Breakdown</h3>
              <p className="text-xs text-gray-400">Proportional expenditure allocation across farm operations</p>
            </div>
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
              Total: ₹{formatINR(result.totalCost)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={result.breakdownList}
                    dataKey="amount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {result.breakdownList.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(val: any, name: string) => [
                      `₹${formatINR(val)} (${((val / (result.totalCost || 1)) * 100).toFixed(1)}%)`,
                      name,
                    ]}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #E0E0E0',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Breakdown List */}
            <div className="space-y-2 text-xs">
              {result.breakdownList.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-600 font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#37474F]">₹{formatINR(item.amount)}</span>
                    <span className="text-[10px] text-gray-400 ml-1">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
        </div>
    </div>

        {/* Revenue vs Cost vs Profit Chart */}
        <div className="lg:col-span-6 bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-base text-[#37474F]">
                Revenue vs Cost vs Profit Comparison
              </h3>
              <p className="text-xs text-gray-400">Total farm outcome vs per-hectare economic realization</p>
            </div>
            <span className="text-xs font-bold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-lg">
              {result.roiPercentage}% ROI
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialBarData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis
                  dataKey="category"
                  tick={{ fill: '#37474F', fontSize: 11, fontWeight: 600 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#78909C', fontSize: 11 }}
                  tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                  tickLine={false}
                />
                <RechartsTooltip
                  formatter={(val: any, name: string) => [`₹${formatINR(val)}`, name]}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E0E0E0',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Bar dataKey="Revenue" fill="#1565C0" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Cost" fill="#B0BEC5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Profit" fill="#2E7D32" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        </div>
        </div>
      {!serverResult && <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">Enter all costs, your yield assumption and selling-price assumption, confirm the inputs, then calculate to see results.</div>}
    </div>
  );
};
