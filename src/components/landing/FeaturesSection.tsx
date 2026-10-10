import React from 'react';
import cropFieldImg from '../../assets/images/krishibhoomi_crop_field_1788870107457.jpg';
import { useNavigate } from 'react-router-dom';
import {
  TestTube,
  Sprout,
  PackageCheck,
  ShieldAlert,
  BarChart3,
  TrendingUp,
  Coins,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 'soil-analysis',
      tabKey: 'soil-analysis',
      title: 'Soil Analysis',
      icon: TestTube,
      badge: 'Core Diagnostic',
      color: '#2E7D32',
      bgLight: '#E8F5E9',
      description:
        'Digitize lab soil reports. Analyze primary N-P-K concentrations, soil pH balance, organic carbon percentage, and vital micronutrient deficiencies.',
      highlight: 'NPK + pH + Micronutrients',
    },
    {
      id: 'crop-recommendation',
      tabKey: 'crop-recommendation',
      title: 'Crop Recommendation',
      icon: Sprout,
      badge: 'Machine Learning',
      color: '#2E7D32',
      bgLight: '#F1F8E9',
      description:
        'AI algorithm matches your soil chemistry, seasonality, and regional agro-ecological zone with top performing crop varieties and seeds.',
      highlight: 'Suitability Score 0-100%',
    },
    {
      id: 'fertilizer-recommendation',
      tabKey: 'fertilizer',
      title: 'Fertilizer Recommendation',
      icon: PackageCheck,
      badge: 'Nutrient Balance',
      color: '#1565C0',
      bgLight: '#E3F2FD',
      description:
        'Targeted nitrogen, phosphorus, potassium, and zinc dosage schedules with bio-organic alternatives to prevent soil acidification and reduce expenses.',
      highlight: 'Custom Dosage & Split Basal',
    },
    {
      id: 'pesticide-recommendation',
      tabKey: 'pesticides',
      title: 'Pesticide Recommendation',
      icon: ShieldAlert,
      badge: 'Bio-Protection',
      color: '#C62828',
      bgLight: '#FFF8E1',
      description:
        'Integrated pest management (IPM) guidelines, botanical bio-pesticides (Neem, Trichoderma), and minimum waiting safety periods to preserve ecology.',
      highlight: 'Eco-Friendly Bio Controls',
    },
    {
      id: 'yield-prediction',
      tabKey: 'yield',
      title: 'Yield Prediction',
      icon: BarChart3,
      badge: 'Forecast Engine',
      color: '#2E7D32',
      bgLight: '#E8F5E9',
      description:
        'Estimate total harvest tonnage per acre using statistical crop growth curves, soil quality index, and historical agronomic yield data.',
      highlight: 'Quintals/Acre Output Forecast',
    },
    {
      id: 'market-analysis',
      tabKey: 'market',
      title: 'Market Analysis',
      icon: TrendingUp,
      badge: 'Economic Intelligence',
      color: '#E65100',
      bgLight: '#FFF8E1',
      description:
        'Track nearby APMC Mandi market prices, 7-day commodity trends, peak demand selling windows, and Minimum Support Price (MSP) benchmarks.',
      highlight: 'APMC Mandi Real Trends',
    },
    {
      id: 'cost-profit',
      tabKey: 'profit',
      title: 'Cost & Profit',
      icon: Coins,
      badge: 'Financial Planner',
      color: '#2E7D32',
      bgLight: '#F1F8E9',
      description:
        'Comprehensive farm budgeting: seed expenses, fertilizer inputs, labor costs, vs. projected harvest revenue and expected net profit margins.',
      highlight: 'Net Margins & ROI %',
    },
    {
      id: 'scenario-simulator',
      tabKey: 'scenarios',
      title: 'Scenario Simulator',
      icon: Layers,
      badge: 'What-If Engine',
      color: '#6A1B9A',
      bgLight: '#F3E5F5',
      description:
        'Simulate multi-crop rotations, inter-cropping strategies, and organic vs. conventional fertilizer regimens before committing financial resources.',
      highlight: 'Compare Farming Scenarios',
    },
  ];

  return (
    <section id="features" className="relative overflow-hidden py-20 bg-[#F7FBF7] border-t border-b border-[#E0E0E0]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-10">
        <div className="crop-feature-visual relative overflow-hidden rounded-[2rem] border border-[#e2ebe1] bg-white shadow-[0_18px_50px_rgba(46,76,50,0.07)]">
          <img src={cropFieldImg} alt="Healthy crops growing in an agricultural field" className="h-44 sm:h-56 lg:h-64 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#16351d]/70 via-[#16351d]/25 to-transparent" />
          <div className="absolute inset-y-0 left-0 flex max-w-xl flex-col justify-center px-6 sm:px-10 text-white">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.24em] text-white/75">Crop intelligence</p>
            <h3 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">See the crop story, not just the numbers.</h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/85">Explore crop suitability, nutrient needs, yield potential and market signals in one visual workflow.</p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] border border-[#C8E6C9] rounded-full inline-block mb-3">
            Intelligent Software Modules
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#37474F] tracking-tight">
            Comprehensive AI Agriculture Suite
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#37474F]/80">
            Engineered exclusively with machine learning and data science. No physical devices, sensors, or hardware installations required.
          </p>
        </div>

        {/* 8 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                id={`feature-card-${item.id}`}
                className="group relative bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-[#A5D6A7] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{ backgroundColor: item.bgLight, color: item.color }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F7FBF7] text-[#37474F]/70 border border-[#E0E0E0]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#37474F] group-hover:text-[#2E7D32] transition-colors mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#37474F]/75 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#2E7D32]">
                    {item.highlight}
                  </span>
                  <button
                    onClick={() => navigate(`/dashboard?tab=${item.tabKey}`)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#37474F] group-hover:text-[#2E7D32] group-hover:translate-x-0.5 transition-all cursor-pointer"
                  >
                    Launch
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
