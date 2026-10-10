import React, { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Layers,
  Sparkles,
  TrendingUp,
  Plus,
  Trash2,
  Copy,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
  DollarSign,
  Trophy,
  ArrowDownCircle,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { FarmScenarioItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { userScopedStorageKey } from '../../services/userScopedStorage';
import {
  INITIAL_DEFAULT_SCENARIOS,
  createNewScenarioTemplate,
  simulateScenarios,
} from '../../services/scenarioSimulatorService';
import {
  compareScenarios,
  formatINR,
} from '../../utils/farmCalculations';

export const ScenarioSimulatorModule: React.FC = () => {
  const { user } = useAuth();
  const [scenarios, setScenarios] = useState<FarmScenarioItem[]>(INITIAL_DEFAULT_SCENARIOS);
  const [activeScenarioId, setActiveScenarioId] = useState<string>(INITIAL_DEFAULT_SCENARIOS[0].id);
  const [simulationResult, setSimulationResult] = useState<ReturnType<typeof compareScenarios> | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [cropContextNotice, setCropContextNotice] = useState('');
  const [scenarioCropTouched, setScenarioCropTouched] = useState(false);
  const [costsConfirmed, setCostsConfirmed] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    let chosenCrop = '';
    let isRankedSuggestion = false;
    try {
      const target = localStorage.getItem(userScopedStorageKey('krishibhoomi_active_target_crop', user.id))?.trim() || '';
      const raw = localStorage.getItem(userScopedStorageKey('krishibhoomi_latest_crop_recommendations', user.id));
      const parsed = raw ? JSON.parse(raw) : null;
      const ranked = Array.isArray(parsed?.recommendations) ? parsed.recommendations : Array.isArray(parsed) ? parsed : [];
      const rankedNames = ranked.map((item: any) => item?.cropName || item?.name).filter((name: unknown): name is string => typeof name === 'string' && Boolean(name.trim()));
      chosenCrop = target || rankedNames[0] || '';
      isRankedSuggestion = Boolean(chosenCrop && rankedNames.includes(chosenCrop));
      if (chosenCrop) {
        setCropContextNotice(isRankedSuggestion
          ? `Crop prefilled from your saved crop recommendation (${chosenCrop}); confirm or edit it before simulation.`
          : `Crop prefilled from your saved crop selection (${chosenCrop}); edit it for a different scenario.`);
      }
    } catch {
      setCropContextNotice('Saved crop recommendations could not be read. Enter the crop for each scenario.');
    }

    const suggestedCrop = chosenCrop;
    const profileAreaHectares = Number(user.farmArea) > 0 ? Number((Number(user.farmArea) * 0.4046856422).toFixed(4)) : 0;
    setScenarios((current) => current.map((scenario, index) => index === 0 ? {
      ...scenario,
      crop: scenario.crop || suggestedCrop,
      area: scenario.area > 0 ? scenario.area : profileAreaHectares,
    } : scenario));
  }, [user?.id, user?.farmArea]);

  useEffect(() => {
    const handleCropUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ targetCrop?: string; cropName?: string }>).detail;
      const crop = detail?.targetCrop || detail?.cropName;
      if (!crop?.trim() || scenarioCropTouched) return;
      setScenarios((current) => current.map((scenario, index) => index === 0 ? { ...scenario, crop: crop.trim() } : scenario));
      setCropContextNotice(`Crop prefilled from the current crop recommendation (${crop.trim()}); confirm or edit it before simulation.`);
      setSimulationResult(null);
    };
    window.addEventListener('krishibhoomi_crop_updated', handleCropUpdate);
    window.addEventListener('krishi:crop-updated', handleCropUpdate);
    return () => {
      window.removeEventListener('krishibhoomi_crop_updated', handleCropUpdate);
      window.removeEventListener('krishi:crop-updated', handleCropUpdate);
    };
  }, [scenarioCropTouched]);

  const emptyResult = useMemo(() => compareScenarios([]), []);
  const displayedResult = simulationResult || emptyResult;
  const handleSimulate = async () => {
    if (!costsConfirmed) { setRequestError('Confirm that every scenario cost has been explicitly entered and any zero is genuinely zero.'); return; }
    setLoading(true); setRequestError(null);
    try {
      const inputs = scenarios.map((scenario) => ({ ...scenario, costsConfirmed: true }));
      setSimulationResult(await simulateScenarios(inputs));
    }
    catch (error) { setSimulationResult(null); setRequestError(error instanceof Error ? error.message : 'Scenario simulation is unavailable. Please retry.'); }
    finally { setLoading(false); }
  };

  // Selected scenario for direct form editing
  const selectedScenario =
    scenarios.find((s) => s.id === activeScenarioId) || scenarios[0] || null;

  // Handle updates to scenario fields
  const handleUpdateScenario = (id: string, field: keyof FarmScenarioItem, value: any) => {
    setSimulationResult(null);
    setCostsConfirmed(false);
    if (field === 'crop') setScenarioCropTouched(true);
    setScenarios((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return {
          ...s,
          [field]: value,
        };
      })
    );
  };

  // Add new scenario
  const handleAddScenario = () => {
    setSimulationResult(null);
    const newScen = createNewScenarioTemplate(scenarios.length);
    setScenarios((prev) => [...prev, newScen]);
    setActiveScenarioId(newScen.id);
  };

  // Duplicate scenario
  const handleDuplicateScenario = (scen: FarmScenarioItem) => {
    setSimulationResult(null);
    const duplicated: FarmScenarioItem = {
      ...scen,
      id: `scen-${Date.now()}`,
      name: `${scen.name} (Copy)`,
    };
    setScenarios((prev) => [...prev, duplicated]);
    setActiveScenarioId(duplicated.id);
  };

  // Delete scenario
  const handleDeleteScenario = (id: string) => {
    setSimulationResult(null);
    if (scenarios.length <= 1) return;
    const remaining = scenarios.filter((s) => s.id !== id);
    setScenarios(remaining);
    if (activeScenarioId === id) {
      setActiveScenarioId(remaining[0].id);
    }
  };

  // Reset to default
  const handleResetDefaults = () => {
    setScenarios(INITIAL_DEFAULT_SCENARIOS);
    setSimulationResult(null); setRequestError(null);
    setActiveScenarioId(INITIAL_DEFAULT_SCENARIOS[0].id);
  };

  // Chart data formatting
  const chartData = useMemo(() => {
    return displayedResult.scenarios.map((s) => ({
      name: s.name,
      crop: s.crop,
      label: `${s.name}: ${s.crop}`,
      Revenue: s.expectedRevenue,
      Cost: s.totalCost,
      EstimatedProfit: s.estimatedProfit,
      ProfitPerHa: s.profitPerHectare,
      Roi: s.roiPercentage,
    }));
  }, [displayedResult]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#F3E5F5] text-[#7B1FA2]">
              Simulation Model
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
              User-entered
            </span>
            <span className="text-xs text-gray-400 font-medium">
              • Based only on values you enter
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#37474F] mt-1">
            Smart Farm Scenario Simulator
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Model alternative crop choices, acreage allocation, and input investments side-by-side to determine your most profitable farming strategy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddScenario}
            id="btn-add-scenario"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Scenario
          </button>
          <button onClick={handleSimulate} disabled={loading} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#2E7D32] text-white rounded-xl text-xs font-bold disabled:opacity-50">{loading ? 'Simulating…' : 'Run Simulation'}</button>
          <button
            onClick={handleResetDefaults}
            id="btn-reset-scenarios"
            className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-[#E0E0E0] hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            title="Reset to default A, B, C scenarios"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {requestError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">{requestError}</div>}
      <label className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        <input type="checkbox" checked={costsConfirmed} onChange={(event) => { setCostsConfirmed(event.target.checked); setSimulationResult(null); }} />
        <span>I entered each scenario cost; any zero is intentional. Yield and price are my assumptions unless separately verified.</span>
      </label>
      {!simulationResult && !requestError && <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">Enter scenario details and run the simulation to see results. No sample values are loaded.</div>}
      {cropContextNotice && <div role="note" className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{cropContextNotice} Farm area from your profile is converted from acres to hectares for this form; verify the area before running.</div>}
      {/* Mandatory Agricultural Disclaimer Label */}
      <div className="p-3.5 bg-[#FFF8E1] border border-[#FFE082] rounded-xl text-xs text-[#E65100] flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold">Simulation Disclaimer: </span>
          Simulated financial results are estimates based only on the values entered in each scenario. Actual harvest and market outcomes can vary.
        </div>
      </div>

      {/* Highlight Cards Row: Highest Profit, Lowest Cost, Highest Yield, Best Overall */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Highest Profit */}
        <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1 text-[#2E7D32]">
              <Trophy className="w-3.5 h-3.5" />
              Highest Profit
            </span>
            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              User-entered
            </span>
          </div>
          <p className="text-lg font-black text-[#37474F] mt-1">
            {simulationResult?.highestProfitScenario ? `${simulationResult.highestProfitScenario.name} (${simulationResult.highestProfitScenario.crop})` : 'Run a scenario to compare'}
          </p>
          <p className="text-2xl font-black text-[#2E7D32] mt-1">
            {simulationResult?.highestProfitScenario ? `₹${formatINR(simulationResult.highestProfitScenario.estimatedProfit)}` : '--'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {simulationResult?.highestProfitScenario ? `₹${formatINR(simulationResult.highestProfitScenario.profitPerHectare)} / hectare` : 'No result yet'}
          </p>
        </div>

        {/* Lowest Cost */}
        <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1 text-[#1565C0]">
              <ArrowDownCircle className="w-3.5 h-3.5" />
              Lowest Cost
            </span>
            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              User-entered
            </span>
          </div>
          <p className="text-lg font-black text-[#37474F] mt-1">
            {simulationResult?.lowestCostScenario ? `${simulationResult.lowestCostScenario.name} (${simulationResult.lowestCostScenario.crop})` : 'Run a scenario to compare'}
          </p>
          <p className="text-2xl font-black text-[#1565C0] mt-1">
            {simulationResult?.lowestCostScenario ? `₹${formatINR(simulationResult.lowestCostScenario.totalCost)}` : '--'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {simulationResult?.lowestCostScenario ? `₹${formatINR(simulationResult.lowestCostScenario.costPerHectare)} / hectare` : 'No result yet'}
          </p>
        </div>

        {/* Highest Yield */}
        <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1 text-[#E65100]">
              <TrendingUp className="w-3.5 h-3.5" />
              Highest Yield
            </span>
            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              User-entered
            </span>
          </div>
          <p className="text-lg font-black text-[#37474F] mt-1">
            {simulationResult?.highestYieldScenario ? `${simulationResult.highestYieldScenario.name} (${simulationResult.highestYieldScenario.crop})` : 'Run a scenario to compare'}
          </p>
          <p className="text-2xl font-black text-[#E65100] mt-1">
            {simulationResult?.highestYieldScenario ? `${simulationResult.highestYieldScenario.expectedYield} tons/ha` : '--'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {simulationResult?.highestYieldScenario ? `Total ${simulationResult.highestYieldScenario.totalProductionTons} tons production` : 'No result yet'}
          </p>
        </div>

        {/* Best Overall Option */}
        <div className="bg-gradient-to-br from-[#F1F8E9] to-[#E8F5E9] border border-[#C8E6C9] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-1 text-[#2E7D32]">
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              Best Overall Option
            </span>
            <span className="text-[10px] font-bold bg-white text-[#2E7D32] px-2 py-0.5 rounded-full border border-[#C8E6C9]">
              Simulation
            </span>
          </div>
          <p className="text-lg font-black text-[#37474F] mt-1">
            {simulationResult?.bestOverallScenario ? `${simulationResult.bestOverallScenario.name} (${simulationResult.bestOverallScenario.crop})` : 'Run a scenario to compare'}
          </p>
          <p className="text-2xl font-black text-[#2E7D32] mt-1">
            {simulationResult?.bestOverallScenario ? `${simulationResult.bestOverallScenario.roiPercentage}% ROI` : '--'}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Optimal balance of investment risk and profit
          </p>
        </div>
      </div>

      {/* Recommended Scenario Spotlight Banner */}
      {displayedResult.recommendedScenario && (
        <div className="bg-white border-2 border-[#2E7D32] rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#2E7D32] text-white shadow-2xs flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  Recommended Scenario
                </span>
                <span className="text-xs font-bold text-gray-500">
                  {displayedResult.recommendedScenario.name} • {displayedResult.recommendedScenario.crop}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-[#37474F] mt-2">
                Strategic Choice: {displayedResult.recommendedScenario.crop} on {displayedResult.recommendedScenario.area} Hectares
              </h3>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-gray-400 uppercase">Estimated Net Realization</span>
              <p className="text-2xl sm:text-3xl font-black text-[#2E7D32]">
                ₹{formatINR(displayedResult.recommendedScenario.estimatedProfit)}
              </p>
              <p className="text-xs text-gray-500">
                (₹{formatINR(displayedResult.recommendedScenario.profitPerHectare)}/ha • {displayedResult.recommendedScenario.roiPercentage}% ROI)
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 text-xs text-gray-600 leading-relaxed bg-[#F7FBF7] p-3.5 rounded-xl border border-[#E0E0E0]">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-800">Agronomic & Economic Reasoning: </strong>
              {displayedResult.recommendationReasoning}
            </div>
          </div>
        </div>
      )}

      {/* Scenario Selection Tabs & Parameter Editor */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-extrabold text-base text-[#37474F]">Scenario Parameter Editor</h3>
            <p className="text-xs text-gray-400">
              Select a scenario tab to adjust input costs, expected yield, and price assumptions
            </p>
          </div>

          {/* Scenario Tab Buttons */}
          <div className="flex flex-wrap gap-1.5 bg-gray-100 p-1.5 rounded-xl">
            {scenarios.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveScenarioId(s.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeScenarioId === s.id
                    ? 'bg-white text-[#2E7D32] shadow-2xs font-extrabold'
                    : 'text-gray-600 hover:text-[#2E7D32]'
                }`}
              >
                {s.name} ({s.crop})
              </button>
            ))}
          </div>
        </div>

        {/* Selected Scenario Form */}
        {selectedScenario && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#2E7D32] uppercase tracking-wider">
                Editing: {selectedScenario.name} ({selectedScenario.crop})
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDuplicateScenario(selectedScenario)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-[#2E7D32] px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-[#E8F5E9] transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Duplicate
                </button>
                {scenarios.length > 1 && (
                  <button
                    onClick={() => handleDeleteScenario(selectedScenario.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
              {/* Crop */}
              <div className="p-3 bg-gray-50 rounded-xl border border-[#E0E0E0]">
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Crop</label>
                <input
                  type="text"
                  value={selectedScenario.crop}
                  onChange={(e) => handleUpdateScenario(selectedScenario.id, 'crop', e.target.value)}
                  className="w-full font-bold text-[#37474F] bg-transparent outline-hidden"
                />
              </div>

              {/* Farm Area */}
              <div className="p-3 bg-gray-50 rounded-xl border border-[#E0E0E0]">
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Area (Hectares)</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={selectedScenario.area}
                  onChange={(e) => handleUpdateScenario(selectedScenario.id, 'area', Number(e.target.value))}
                  className="w-full font-bold text-[#37474F] bg-transparent outline-hidden"
                />
              </div>

              {/* Expected Yield */}
              <div className="p-3 bg-gray-50 rounded-xl border border-[#E0E0E0]">
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Expected Yield (tons/ha)</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={selectedScenario.expectedYield}
                  onChange={(e) => handleUpdateScenario(selectedScenario.id, 'expectedYield', parseFloat(e.target.value) || 0)}
                  className="w-full font-extrabold text-[#2E7D32] bg-transparent outline-hidden"
                />
              </div>

              {/* Selling Price */}
              <div className="p-3 bg-gray-50 rounded-xl border border-[#E0E0E0]">
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Selling Price (₹/ton)</label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={selectedScenario.sellingPrice}
                  onChange={(e) => handleUpdateScenario(selectedScenario.id, 'sellingPrice', parseFloat(e.target.value) || 0)}
                  className="w-full font-extrabold text-[#1565C0] bg-transparent outline-hidden"
                />
              </div>

              {/* Seed Cost */}
              <div className="p-3 bg-gray-50 rounded-xl border border-[#E0E0E0]">
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Seed Cost (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={selectedScenario.seedCost}
                  onChange={(e) => handleUpdateScenario(selectedScenario.id, 'seedCost', parseFloat(e.target.value) || 0)}
                  className="w-full font-bold text-[#37474F] bg-transparent outline-hidden"
                />
              </div>

              {/* Fertilizer Cost */}
              <div className="p-3 bg-gray-50 rounded-xl border border-[#E0E0E0]">
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Fertilizer Cost (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={selectedScenario.fertilizerCost}
                  onChange={(e) => handleUpdateScenario(selectedScenario.id, 'fertilizerCost', parseFloat(e.target.value) || 0)}
                  className="w-full font-bold text-[#37474F] bg-transparent outline-hidden"
                />
              </div>

              {/* Pesticide Cost */}
              <div className="p-3 bg-gray-50 rounded-xl border border-[#E0E0E0]">
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Pesticide Cost (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={selectedScenario.pesticideCost}
                  onChange={(e) => handleUpdateScenario(selectedScenario.id, 'pesticideCost', parseFloat(e.target.value) || 0)}
                  className="w-full font-bold text-[#37474F] bg-transparent outline-hidden"
                />
              </div>

              {/* Labour Cost */}
              <div className="p-3 bg-gray-50 rounded-xl border border-[#E0E0E0]">
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Labour Cost (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={selectedScenario.labourCost}
                  onChange={(e) => handleUpdateScenario(selectedScenario.id, 'labourCost', parseFloat(e.target.value) || 0)}
                  className="w-full font-bold text-[#37474F] bg-transparent outline-hidden"
                />
              </div>

              {/* Other Costs */}
              <div className="p-3 bg-gray-50 rounded-xl border border-[#E0E0E0]">
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Other Costs (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={selectedScenario.otherCosts}
                  onChange={(e) => handleUpdateScenario(selectedScenario.id, 'otherCosts', parseFloat(e.target.value) || 0)}
                  className="w-full font-bold text-[#37474F] bg-transparent outline-hidden"
                />
              </div>

              {/* Live Computed Profit Preview */}
              <div className="p-3 bg-[#E8F5E9] rounded-xl border border-[#C8E6C9] flex flex-col justify-center">
                <span className="text-[10px] font-bold text-[#2E7D32] uppercase">Live Calculated Profit</span>
                <span className="text-base font-black text-[#2E7D32] mt-0.5">
                  ₹{formatINR(
                    selectedScenario.area * selectedScenario.expectedYield * selectedScenario.sellingPrice -
                      (selectedScenario.seedCost +
                        selectedScenario.fertilizerCost +
                        selectedScenario.pesticideCost +
                        selectedScenario.labourCost +
                        selectedScenario.otherCosts)
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Table */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div>
            <h3 className="font-extrabold text-base text-[#37474F]">Scenario Comparison Table</h3>
            <p className="text-xs text-gray-400">
              Side-by-side financial and production metrics across all modeled scenarios (Estimated)
            </p>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
            {displayedResult.scenarios.length} Scenarios Modeled
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                <th className="pb-3">Scenario</th>
                <th className="pb-3">Crop</th>
                <th className="pb-3">Area</th>
                <th className="pb-3">Yield</th>
                <th className="pb-3">Selling Price</th>
                <th className="pb-3">Total Cost</th>
                <th className="pb-3">Expected Revenue</th>
                <th className="pb-3">Estimated Profit</th>
                <th className="pb-3">Profit / ha</th>
                <th className="pb-3">ROI</th>
                <th className="pb-3 text-right">Designation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedResult.scenarios.map((scen) => (
                <tr
                  key={scen.id}
                  className={`hover:bg-[#F7FBF7] transition-colors ${
                    scen.isRecommended ? 'bg-[#F1F8E9]/60 font-semibold' : ''
                  }`}
                >
                  <td className="py-3 text-[#37474F] font-bold">{scen.name}</td>
                  <td className="py-3 font-semibold text-[#37474F]">{scen.crop}</td>
                  <td className="py-3 text-gray-600">{scen.area} ha</td>
                  <td className="py-3 text-gray-700 font-bold">
                    {scen.expectedYield} t/ha{' '}
                    <span className="text-[10px] text-gray-400">({scen.totalProductionTons} t total)</span>
                  </td>
                  <td className="py-3 font-bold text-[#1565C0]">
                    ₹{formatINR(scen.sellingPrice)}/t
                  </td>
                  <td className="py-3 text-gray-700 font-medium">₹{formatINR(scen.totalCost)}</td>
                  <td className="py-3 text-[#1565C0] font-bold">₹{formatINR(scen.expectedRevenue)}</td>
                  <td className="py-3">
                    <span className="font-extrabold text-[#2E7D32]">
                      ₹{formatINR(scen.estimatedProfit)}
                    </span>
                  </td>
                  <td className="py-3 text-gray-700 font-bold">
                    ₹{formatINR(scen.profitPerHectare)} / ha
                  </td>
                  <td className="py-3 text-[#1565C0] font-bold">{scen.roiPercentage}%</td>
                  <td className="py-3 text-right">
                    {scen.isRecommended ? (
                      <span className="inline-flex items-center gap-1 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full bg-[#2E7D32] text-white shadow-2xs">
                        Recommended
                      </span>
                    ) : scen.isHighestProfit ? (
                      <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                        Highest Profit
                      </span>
                    ) : scen.isLowestCost ? (
                      <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-[#1565C0]">
                        Lowest Cost
                      </span>
                    ) : scen.isHighestYield ? (
                      <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-[#E65100]">
                        Highest Yield
                      </span>
                    ) : (
                      <span className="text-gray-400 text-[10px]">Alternative</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estimated Net Profit Chart */}
        <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-base text-[#37474F]">Estimated Net Profit by Scenario</h3>
              <p className="text-xs text-gray-400">Total farm profit realization (Simulation)</p>
            </div>
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
              ₹ Total
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 15, right: 15, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis dataKey="label" tick={{ fill: '#37474F', fontSize: 11, fontWeight: 600 }} />
                <YAxis
                  tick={{ fill: '#78909C', fontSize: 11 }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${formatINR(val)}`, 'Estimated Net Profit']}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E0E0E0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="EstimatedProfit" fill="#2E7D32" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue vs Cost vs Profit Grouped Chart */}
        <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-base text-[#37474F]">Revenue vs Cost vs Profit</h3>
              <p className="text-xs text-gray-400">Comparative economic structure per scenario</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 15, right: 15, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis dataKey="name" tick={{ fill: '#37474F', fontSize: 11, fontWeight: 600 }} />
                <YAxis
                  tick={{ fill: '#78909C', fontSize: 11 }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any, name: string) => [`₹${formatINR(val)}`, name]}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E0E0E0',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="Revenue" fill="#1565C0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Cost" fill="#B0BEC5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="EstimatedProfit" fill="#2E7D32" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
