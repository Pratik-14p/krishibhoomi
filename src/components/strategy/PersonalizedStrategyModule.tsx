import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Circle,
  AlertTriangle,
  TrendingUp,
  Coins,
  Sprout,
  ShieldAlert,
  Send,
  Download,
  RefreshCw,
  Clock,
  ArrowRight,
  Info,
  CheckSquare,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  PersonalizedFarmingStrategy,
  FarmingStrategyPhase,
  StrategyTaskItem,
  User,
} from '../../types';
import { personalizedStrategyService } from '../../services/personalizedStrategyService';
import { useI18n } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';
import { userScopedStorageKey } from '../../services/userScopedStorage';
import { soilAnalysisService } from '../../services/soilAnalysisService';
import {
  translateStrategyPhase,
  translateCropName,
  translateSeason,
  getStrategyAiGreeting,
} from '../../utils/agriI18n';

function getSavedCrop(userId?: string): string {
  if (!userId) return '';
  try {
    const target = localStorage.getItem(userScopedStorageKey('krishibhoomi_active_target_crop', userId))?.trim();
    if (target) return target;
    const raw = localStorage.getItem(userScopedStorageKey('krishibhoomi_latest_crop_recommendations', userId));
    const parsed = raw ? JSON.parse(raw) : null;
    const recommendations = Array.isArray(parsed?.recommendations) ? parsed.recommendations : Array.isArray(parsed) ? parsed : [];
    const top = recommendations[0];
    return typeof (top?.cropName || top?.name) === 'string' ? (top.cropName || top.name) : '';
  } catch {
    return '';
  }
}

function getSavedSeason(user?: User | null): string {
  if (!user?.id) return '';
  try {
    const analysis = soilAnalysisService.getActiveAnalysis(user);
    const season = analysis?.isUserReport ? analysis.fieldMetadata?.season : '';
    return ['Rabi', 'Kharif', 'Zaid'].includes(season || '') ? season || '' : '';
  } catch {
    return '';
  }
}

interface PersonalizedStrategyModuleProps {
  onNavigateTab?: (tabKey: string) => void;
}

export const PersonalizedStrategyModule: React.FC<PersonalizedStrategyModuleProps> = ({
  onNavigateTab,
}) => {
  const { language, t } = useI18n();
  const { user } = useAuth();
  const [strategy, setStrategy] = useState<PersonalizedFarmingStrategy>(() =>
    personalizedStrategyService.getActiveStrategy(user?.id)
  );
  const [strategyOwnerId, setStrategyOwnerId] = useState<string | undefined>(user?.id);
  const [selectedCrop, setSelectedCrop] = useState(strategy.targetCrop || getSavedCrop(user?.id));
  const [selectedSeason, setSelectedSeason] = useState(strategy.season || getSavedSeason(user));
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(Boolean(user?.id));
  const [strategyError, setStrategyError] = useState<string | null>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatLog, setChatLog] = useState<Array<{ sender: 'farmer' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: getStrategyAiGreeting(
        strategy.targetCrop,
        strategy.soilHealthSummary.n,
        strategy.soilHealthSummary.ph,
        language
      ),
      time: 'Just now',
    },
  ]);
  const [isAiReplying, setIsAiReplying] = useState(false);
  const [printSuccessToast, setPrintSuccessToast] = useState(false);

  useEffect(() => {
    if (strategyOwnerId !== user?.id) {
      setStrategy(personalizedStrategyService.getActiveStrategy(user?.id));
      setStrategyOwnerId(user?.id);
      setSelectedCrop(getSavedCrop(user?.id));
      setSelectedSeason(getSavedSeason(user));
      setChatLog([]);
      setStrategyError(null);
    }
  }, [user?.id, strategyOwnerId]);

  useEffect(() => {
    if (!user?.id) { setIsLoadingSaved(false); return; }
    let cancelled = false;
    setIsLoadingSaved(true);
    const selectedSoilReport = soilAnalysisService.getActiveAnalysis(user);
    if (!selectedSoilReport.isUserReport) {
      setIsLoadingSaved(false);
      return () => { cancelled = true; };
    }
    personalizedStrategyService.loadLatestStrategy(user.id, selectedSoilReport.id).then((saved) => {
      if (cancelled || !saved) return;
      setStrategy(saved);
      setStrategyOwnerId(user.id);
      setSelectedCrop(saved.targetCrop || getSavedCrop(user.id));
      setSelectedSeason(saved.season || getSavedSeason(user));
    }).catch((error) => {
      if (!cancelled) setStrategyError(error instanceof Error ? error.message : 'The saved strategy could not be loaded.');
    }).finally(() => {
      if (!cancelled) setIsLoadingSaved(false);
    });
    return () => { cancelled = true; };
  }, [user?.id]);

  useEffect(() => {
    setChatLog((prev) => {
      if (prev.length === 1 && prev[0].sender === 'ai') {
        return [
          {
            sender: 'ai',
            text: getStrategyAiGreeting(
              strategy.targetCrop,
              strategy.soilHealthSummary.n,
              strategy.soilHealthSummary.ph,
              language
            ),
            time: 'Just now',
          },
        ];
      }
      return prev;
    });
  }, [language, strategy.targetCrop, strategy.soilHealthSummary.n, strategy.soilHealthSummary.ph]);

  // Re-generate or adapt strategy when crop changes
  const handleRegenerate = async (newCrop?: string) => {
    const crop = newCrop || selectedCrop;
    if (!crop.trim()) { setStrategyError('Select your crop before generating a strategy.'); return; }
    const selectedSoilReport = soilAnalysisService.getActiveAnalysis(user);
    if (!selectedSoilReport.isUserReport) { setStrategyError('Select a verified soil report before generating a strategy.'); return; }
    setIsGenerating(true);
    setStrategyError(null);
    try {
      const updated = await personalizedStrategyService.generateStrategy({
        ownerId: user?.id,
        soilReportId: selectedSoilReport.id,
        cropName: crop,
        season: selectedSeason || undefined,
      });
      setStrategy(updated);
      setStrategyOwnerId(user?.id);
      setSelectedCrop(updated.targetCrop);
      setSelectedSeason(updated.season);
    } catch (error) {
      setStrategyError(error instanceof Error ? error.message : 'Strategy generation failed. Please retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleTask = (phaseId: string, taskId: string) => {
    const updated = personalizedStrategyService.toggleTaskCompletion(phaseId, taskId, user?.id);
    setStrategy(updated);
  };

  const handleAskAi = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = chatQuestion.trim();
    if (!q || isAiReplying) return;

    const userMsg = { sender: 'farmer' as const, text: q, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatLog((prev) => [...prev, userMsg]);
    setChatQuestion('');
    setIsAiReplying(true);

    try {
      const replyText = await personalizedStrategyService.askAIAgronomist(q, strategy);
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'ai' as const,
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (error) {
      setStrategyError(error instanceof Error ? error.message : 'AI agronomist is unavailable. Please retry.');
    } finally {
      setIsAiReplying(false);
    }
  };

  const handleExportStrategy = () => {
    if (selectedCrop.trim() !== strategy.targetCrop || selectedSeason !== strategy.season) {
      setStrategyError('Regenerate the strategy for the current crop and season before exporting.');
      return;
    }
    window.print();
    setPrintSuccessToast(true);
    setTimeout(() => setPrintSuccessToast(false), 3500);
  };

  const totalTasks = strategy.phases.flatMap((p) => p.tasks).length;
  const completedTasks = strategy.phases.flatMap((p) => p.tasks).filter((t) => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (isLoadingSaved || strategyOwnerId !== user?.id || !strategy.targetCrop) return <section className="space-y-4 rounded-2xl border border-[#E0E0E0] bg-white p-6">
    <h1 className="text-2xl font-bold text-[#37474F]">Personalized Farming Strategy</h1>
    <p className="text-sm text-gray-600">Generate a plan from your authenticated soil report and selected crop. Missing information will be identified; unsupported costs, rates, yields, or prices will not be estimated.</p>
    <label htmlFor="strategy-crop" className="block text-sm font-semibold">Selected crop</label>
    <input id="strategy-crop" value={selectedCrop} onChange={e => setSelectedCrop(e.target.value)} className="w-full max-w-md rounded-lg border p-2" placeholder="Enter your crop" />
    {selectedCrop && <p className="text-xs text-gray-500">Prefilled from your saved crop selection or highest-ranked crop recommendation; generating confirms it as this plan's target crop.</p>}
    <label htmlFor="strategy-season" className="block text-sm font-semibold">Season</label>
    <select id="strategy-season" value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)} className="w-full max-w-md rounded-lg border p-2">
      <option value="">Select season</option><option value="Kharif">Kharif</option><option value="Rabi">Rabi</option><option value="Zaid">Zaid</option>
    </select>
    {isLoadingSaved && <p role="status" className="text-sm text-gray-600">Loading your saved strategy…</p>}
    {strategyError && <p role="alert" className="text-sm text-red-700">{strategyError}</p>}
    <button onClick={() => handleRegenerate()} disabled={isGenerating} className="rounded-lg bg-[#2E7D32] px-4 py-2 text-white disabled:opacity-60">{isGenerating ? 'Generating…' : 'Generate strategy'}</button>
  </section>;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Flowchart Node 11 • AI Strategy Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37474F] tracking-tight">
              Personalized Farming Strategy & Action Plan
            </h1>
            <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
              Uses your authenticated soil report, target crop, selected season, and saved advisory records. Unavailable validated costs, rates, yields, or market data are identified rather than estimated.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl px-3 py-2 text-xs">
              <label htmlFor="cropSelect" className="font-semibold text-gray-600">
                Target Crop:
              </label>
              <input
                id="cropSelect"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                aria-label="Target crop"
                className="w-36 bg-transparent font-bold text-[#2E7D32] focus:outline-none"
              />
            </div>
            <label className="flex items-center gap-2 rounded-xl border border-[#E0E0E0] px-3 py-2 text-xs font-semibold text-gray-600">
              Season
              <select value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)} className="bg-transparent font-bold text-[#2E7D32]">
                <option value="">Not selected</option><option value="Kharif">Kharif</option><option value="Rabi">Rabi</option><option value="Zaid">Zaid</option>
              </select>
            </label>

            <button
              id="refreshStrategyBtn"
              onClick={() => handleRegenerate()}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F7FBF7] hover:bg-gray-100 border border-[#E0E0E0] rounded-xl text-xs font-bold text-[#37474F] transition-all cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-[#2E7D32]' : ''}`} />
              <span>{isGenerating ? 'Synthesizing...' : 'Regenerate Strategy'}</span>
            </button>

            <button
              id="exportStrategyBtn"
              onClick={handleExportStrategy}
              disabled={selectedCrop.trim() !== strategy.targetCrop || selectedSeason !== strategy.season}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Action Plan (PDF)</span>
            </button>
          </div>
        </div>

        {/* Executive Verdict Callout */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-[#F1F8E9] to-[#E8F5E9]/60 border border-[#C8E6C9] flex items-start gap-3.5">
          <div className="p-2 bg-[#2E7D32] text-white rounded-lg shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#2E7D32]">
              AI Agronomist Executive Verdict
            </h2>
            <p className="text-xs sm:text-sm text-[#263238] font-medium leading-relaxed">
              {strategy.executiveVerdict}
            </p>
          </div>
        </div>

        <p className="mt-4 border-t border-[#E0E0E0] pt-3 text-xs text-gray-500">Cost, yield, profit, and market estimates are not shown because no verified values are available for this plan.</p>
      </div>

      {/* 2. Strategy Progress & Phase Selector */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#37474F] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2E7D32]" />
              Seasonal Execution Timeline & Checklist
            </h2>
            <p className="text-xs text-gray-500">
              Track pending field operations from pre-sowing soil conditioning to harvest Mandi sale.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-extrabold text-[#2E7D32]">{progressPercent}% Completed</span>
              <p className="text-[10px] text-gray-400">{completedTasks} of {totalTasks} operations</p>
            </div>
            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2E7D32] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Horizontal Phase Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 border-b border-[#E0E0E0] pb-4">
          {strategy.phases.map((phase, idx) => {
            const isActive = activePhaseIndex === idx;
            const phaseTasks = phase.tasks;
            const phaseDone = phaseTasks.filter((t) => t.completed).length;
            const isAllDone = phaseTasks.length > 0 && phaseDone === phaseTasks.length;

            return (
              <button
                key={phase.id}
                onClick={() => setActivePhaseIndex(idx)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#E8F5E9] border-[#2E7D32] shadow-2xs text-[#1B5E20]'
                    : isAllDone
                    ? 'bg-emerald-50/40 border-emerald-200 text-gray-700 hover:bg-gray-50'
                    : 'bg-white border-[#E0E0E0] text-gray-600 hover:bg-[#F7FBF7]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                      Step {phase.phaseNumber}
                    </span>
                    {isAllDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="text-[10px] font-bold text-gray-500">
                        {phaseDone}/{phaseTasks.length}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold mt-1 line-clamp-1">{translateStrategyPhase(phase.phaseName.replace(/^Phase \d+: /, ''), language)}</p>
                </div>
                <span className="text-[10px] text-gray-400 mt-2 block">{phase.timing.split('(')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Phase Detail Content */}
        {strategy.phases[activePhaseIndex] && (
          <div className="mt-5 space-y-5">
            {/* Phase Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#F7FBF7] p-4 rounded-xl border border-[#E0E0E0]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E7D32]">
                  {strategy.phases[activePhaseIndex].timing}
                </span>
                <h3 className="text-base font-extrabold text-[#37474F]">
                  {translateStrategyPhase(strategy.phases[activePhaseIndex].phaseName, language)}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  {strategy.phases[activePhaseIndex].objective}
                </p>
              </div>
            </div>

            {/* 4 Pillars Grid for this Phase */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 bg-white border border-[#E0E0E0] rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-700" />
                  Soil Tilth & Prep
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {strategy.phases[activePhaseIndex].soilConditioning}
                </p>
              </div>

              <div className="p-3.5 bg-white border border-[#E0E0E0] rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-[#2E7D32] uppercase tracking-wider flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-[#2E7D32]" />
                  Fertilizer Split
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {strategy.phases[activePhaseIndex].fertilizerAction}
                </p>
              </div>

              <div className="p-3.5 bg-white border border-[#E0E0E0] rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Water & Irrigation
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {strategy.phases[activePhaseIndex].irrigationSchedule}
                </p>
              </div>

              <div className="p-3.5 bg-white border border-[#E0E0E0] rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  Pest & Shield
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {strategy.phases[activePhaseIndex].pestProtection}
                </p>
              </div>
            </div>

            {/* Actionable Field Tasks for this Phase */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Actionable Field Operations ({strategy.phases[activePhaseIndex].tasks.length} tasks)
              </h4>

              <div className="divide-y divide-gray-100 border border-[#E0E0E0] rounded-xl overflow-hidden bg-white">
                {strategy.phases[activePhaseIndex].tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(strategy.phases[activePhaseIndex].id, task.id)}
                    className={`p-3.5 flex items-start justify-between gap-3 cursor-pointer transition-colors ${
                      task.completed ? 'bg-emerald-50/30' : 'hover:bg-[#F7FBF7]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p
                          className={`text-xs sm:text-sm font-semibold ${
                            task.completed ? 'line-through text-gray-400' : 'text-[#37474F]'
                          }`}
                        >
                          {task.description}
                        </p>
                        {task.recommendedProduct && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-medium">
                            Product: {task.recommendedProduct}
                          </span>
                        )}
                        {task.notes && <p className="text-[11px] text-gray-500">{task.notes}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          task.priority === 'Critical'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : task.priority === 'High'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {task.priority}
                      </span>
                      {task.daysFromSowing !== undefined && <span className="text-[10px] text-gray-400">
                        {task.daysFromSowing < 0
                          ? `${Math.abs(task.daysFromSowing)}d Pre`
                          : task.daysFromSowing === 0
                          ? 'Day of Sowing'
                          : `DAS ${task.daysFromSowing}`}
                      </span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Lower Two-Column Grid: AI Agronomist Copilot & Risk Mitigation Contingencies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive AI Agronomist Copilot */}
        <div className="lg:col-span-7 bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#37474F]">AI Agronomist Strategy Copilot</h3>
                <p className="text-[11px] text-gray-500">
                  Real-time questions grounded in your soil test and weather conditions
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-[#E8F5E9] text-[#2E7D32] rounded-full text-[10px] font-bold">
              Gemini 3.8 Powered
            </span>
          </div>

          {/* Chat Messages Log */}
          <div className="h-64 overflow-y-auto space-y-3 p-3 bg-[#F7FBF7] rounded-xl border border-[#E0E0E0]">
            {chatLog.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === 'farmer' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'farmer'
                      ? 'bg-[#2E7D32] text-white rounded-br-none'
                      : 'bg-white border border-[#E0E0E0] text-[#37474F] rounded-bl-none shadow-2xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[9px] text-gray-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
            {isAiReplying && (
              <div className="flex items-center gap-2 text-xs text-gray-500 italic p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2E7D32]" />
                <span>Consulting ICAR soil & crop agronomic database...</span>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap gap-1.5">
            {[
              'How to reduce urea expenditure?',
              'What if heavy rains occur next week?',
              'Bio-pesticide for early aphid attack',
              'Optimal sowing seed rate per acre',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setChatQuestion(chip);
                }}
                className="text-[11px] px-2.5 py-1 bg-gray-50 hover:bg-[#E8F5E9] text-gray-600 hover:text-[#2E7D32] rounded-lg border border-gray-200 transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleAskAi} className="flex gap-2">
            <input
              id="aiQuestionInput"
              type="text"
              value={chatQuestion}
              onChange={(e) => setChatQuestion(e.target.value)}
              placeholder={`Ask about ${strategy.targetCrop} nutrition, pest control, or irrigation...`}
              className="flex-1 bg-[#F7FBF7] border border-[#E0E0E0] focus:border-[#2E7D32] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#37474F] focus:outline-none transition-all"
            />
            <button
              id="sendAiQuestionBtn"
              type="submit"
              disabled={!chatQuestion.trim() || isAiReplying}
              className="px-4 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>

        {/* Right Column: Risk Mitigation Protocols & Agronomist Notes */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-[#37474F]">Risk Mitigation Protocols</h3>
            </div>
            <p className="text-[11px] text-gray-500">
              Pre-computed emergency protocols for weather shifts and price volatility.
            </p>

            <div className="space-y-2.5 mt-2">
              {strategy.riskMitigation.map((risk, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-amber-50/40 border border-amber-200 rounded-xl space-y-1 text-xs"
                >
                  <p className="font-bold text-amber-900">{risk.risk}</p>
                  <p className="text-gray-700 leading-relaxed">{risk.mitigationPlan}</p>
                  <div className="pt-1 text-[10px] text-amber-700 font-medium">
                    Trigger: {risk.triggerCondition}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agronomist Field Notes */}
          <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#2E7D32]" />
              <h3 className="text-sm font-bold text-[#37474F]">Scientific Agronomist Notes</h3>
            </div>
            <ul className="space-y-2 text-xs text-gray-600">
              {strategy.aiAgronomistNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
