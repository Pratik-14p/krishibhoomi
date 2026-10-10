import React, { useState } from 'react';
import {
  GitCommit,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Layers,
  MapPin,
  FileText,
  ScanLine,
  Activity,
  Cpu,
  TrendingUp,
  Coins,
  Store,
  FlaskConical,
  Compass,
  LayoutDashboard,
  History,
  X,
  ArrowDown,
  Info,
} from 'lucide-react';

interface DecisionPipelineBannerProps {
  activeTab: string;
  onSelectTab: (tabKey: string) => void;
}

export const PIPELINE_NODES = [
  {
    id: 'farmer_auth',
    stepNumber: 1,
    title: 'Farmer Registration',
    shortTitle: 'Farmer',
    subtitle: 'Login & Verification',
    tabKey: 'profile',
    icon: CheckCircle2,
    status: 'completed' as const,
  },
  {
    id: 'farmer_profile',
    stepNumber: 2,
    title: 'Farmer Profile',
    shortTitle: 'Profile',
    subtitle: 'Location, Farm Area & Soil Preference',
    tabKey: 'profile',
    icon: MapPin,
    status: 'completed' as const,
  },
  {
    id: 'input_data',
    stepNumber: 3,
    title: 'Input Data',
    shortTitle: 'Input Data',
    subtitle: 'Soil Report PDF/Image & Manual Soil Data',
    tabKey: 'soil',
    icon: FileText,
    status: 'completed' as const,
  },
  {
    id: 'soil_analysis',
    stepNumber: 4,
    title: 'Soil Report Analysis',
    shortTitle: 'Soil Analysis',
    subtitle: 'OCR Extraction (N, P, K, pH, OC & Micros)',
    tabKey: 'soil',
    icon: ScanLine,
    status: 'completed' as const,
  },
  {
    id: 'soil_health',
    stepNumber: 5,
    title: 'Soil Health Status',
    shortTitle: 'Soil Health',
    subtitle: 'Deficiency Detection & Fertility Index',
    tabKey: 'soil',
    icon: Activity,
    status: 'completed' as const,
  },
  {
    id: 'ai_recommendation',
    stepNumber: 6,
    title: 'AI Recommendation Engine',
    shortTitle: 'AI Engine',
    subtitle: 'Crop, Fertilizer & Pesticide Advisory',
    tabKey: 'crop',
    icon: Cpu,
    status: 'completed' as const,
  },
  {
    id: 'yield_prediction',
    stepNumber: 7,
    title: 'Yield Prediction',
    shortTitle: 'Yield Predict',
    subtitle: 'Harvest Forecast & Biomass Potential',
    tabKey: 'yield',
    icon: TrendingUp,
    status: 'completed' as const,
  },
  {
    id: 'cost_profit',
    stepNumber: 8,
    title: 'Cost & Profit Estimation',
    shortTitle: 'Cost & Profit',
    subtitle: 'Cultivation Cost → Gross Revenue → Net Margin',
    tabKey: 'profit',
    icon: Coins,
    status: 'completed' as const,
  },
  {
    id: 'market_analysis',
    stepNumber: 9,
    title: 'Market Analysis',
    shortTitle: 'Market Intel',
    subtitle: 'Real-time Mandi Rates & Price Outlook',
    tabKey: 'market',
    icon: Store,
    status: 'completed' as const,
  },
  {
    id: 'scenario_simulator',
    stepNumber: 10,
    title: 'Scenario Simulator',
    shortTitle: 'Simulator',
    subtitle: 'Multi-crop "What-If" Comparative Simulation',
    tabKey: 'simulator',
    icon: FlaskConical,
    status: 'completed' as const,
  },
  {
    id: 'personalized_strategy',
    stepNumber: 11,
    title: 'Personalized Strategy',
    shortTitle: 'Action Strategy',
    subtitle: 'AI Combines All Analysis → Action Plan',
    tabKey: 'strategy',
    icon: Compass,
    status: 'active' as const,
  },
  {
    id: 'farmer_dashboard',
    stepNumber: 12,
    title: 'Farmer Dashboard',
    shortTitle: 'Dashboard',
    subtitle: 'Unified Command Center across all modules',
    tabKey: 'dashboard',
    icon: LayoutDashboard,
    status: 'completed' as const,
  },
  {
    id: 'reports_history',
    stepNumber: 13,
    title: 'Reports & History',
    shortTitle: 'Reports',
    subtitle: 'Soil Tests, Yield Records & Audited History',
    tabKey: 'reports',
    icon: History,
    status: 'completed' as const,
  },
];

export const DecisionPipelineBanner: React.FC<DecisionPipelineBannerProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const [showFullModal, setShowFullModal] = useState(false);

  // Map activeTab to closest node
  const currentNode =
    PIPELINE_NODES.find((node) => node.tabKey === activeTab) || PIPELINE_NODES[10];

  return (
    <>
      {/* Top Interactive Flow Bar */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-4 shadow-2xs mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[#2E7D32] uppercase tracking-wider">
                  Krishibhoomi Decision Architecture
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                  Step {currentNode.stepNumber} of 13
                </span>
              </div>
              <p className="text-xs text-[#37474F] font-semibold mt-0.5">
                Current Pipeline Stage: <span className="text-[#2E7D32] font-bold">{currentNode.title}</span> — {currentNode.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              id="openArchitectureModalBtn"
              onClick={() => setShowFullModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F7FBF7] hover:bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>View Full 13-Node Flowchart</span>
            </button>
          </div>
        </div>

        {/* Scrollable Quick Stage Stepper */}
        <div className="mt-3.5 pt-3 border-t border-gray-100 overflow-x-auto scrollbar-thin">
          <div className="flex items-center gap-1.5 min-w-max pb-1">
            {PIPELINE_NODES.map((node, i) => {
              const isActive = node.tabKey === activeTab;
              const Icon = node.icon;

              return (
                <React.Fragment key={node.id}>
                  <button
                    onClick={() => onSelectTab(node.tabKey)}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#2E7D32] text-white font-bold shadow-2xs'
                        : 'bg-[#F7FBF7] hover:bg-gray-100 text-gray-600 border border-gray-100'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                        isActive ? 'bg-white text-[#2E7D32]' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {node.stepNumber}
                    </span>
                    <span className="whitespace-nowrap">{node.shortTitle}</span>
                  </button>
                  {i < PIPELINE_NODES.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full 13-Node Architecture Flowchart Modal */}
      {showFullModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-200 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#37474F]">
                    Krishibhoomi End-to-End Decision Architecture
                  </h3>
                  <p className="text-xs text-gray-500">
                    Comprehensive 13-node autonomous agronomy flow from Farmer Login to Strategy & Reports
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFullModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visual Flow Representation */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PIPELINE_NODES.map((node) => {
                  const isActive = node.tabKey === activeTab;
                  const Icon = node.icon;

                  return (
                    <div
                      key={node.id}
                      onClick={() => {
                        onSelectTab(node.tabKey);
                        setShowFullModal(false);
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                        isActive
                          ? 'bg-[#E8F5E9] border-[#2E7D32] ring-2 ring-[#2E7D32]/20 shadow-2xs'
                          : 'bg-[#F7FBF7] border-gray-200 hover:border-gray-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-6 h-6 rounded-full bg-white border border-gray-200 text-[#2E7D32] text-xs font-extrabold flex items-center justify-center">
                          {node.stepNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-[#2E7D32] text-white'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isActive ? 'Current Active View' : 'Verified Module'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#2E7D32]" />
                        <h4 className="text-sm font-bold text-[#37474F]">{node.title}</h4>
                      </div>

                      <p className="text-xs text-gray-500 leading-relaxed">{node.subtitle}</p>

                      <div className="pt-2 flex items-center justify-between text-[11px] text-[#2E7D32] font-semibold">
                        <span>Launch View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-[#F7FBF7] rounded-xl border border-gray-200 text-xs text-gray-600 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
              <p>
                Each node is continuously synchronized with your Soil Health Card, dynamic weather telemetry, and APMC Mandi prices. Clicking any card switches the dashboard directly to that operational module.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowFullModal(false)}
                className="px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close Flowchart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
