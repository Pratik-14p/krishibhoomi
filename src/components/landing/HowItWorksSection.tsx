import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileSearch,
  Sparkles,
  GitCompare,
  Award,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const navigate = useNavigate();

  const steps = [
    {
      step: 1,
      title: 'Upload Soil Report',
      icon: UploadCloud,
      shortDesc: 'Submit Soil Health Card or laboratory test values.',
      detailedDesc:
        'Upload your government Soil Health Card, private lab PDF, or enter your farm soil values directly (Nitrogen, Phosphorus, Potassium, pH, Electrical Conductivity, and Organic Carbon).',
      tag: 'Lab Data Input',
    },
    {
      step: 2,
      title: 'Analyze Farm Data',
      icon: FileSearch,
      shortDesc: 'Automated diagnostic parsing of soil chemistry.',
      detailedDesc:
        'Krishibhoomi instantly correlates your soil parameters against agro-climatic databases, identifying nutrient deficiencies, salinity stresses, and fertility benchmarks.',
      tag: 'Software Diagnostics',
    },
    {
      step: 3,
      title: 'Generate AI Recommendations',
      icon: Sparkles,
      shortDesc: 'Receive custom crop varieties and fertilizer plans.',
      detailedDesc:
        'The recommendation engine outputs ranked crop suitability scores, precise basal and top-dressing nutrient plans, and eco-friendly biological pest treatments.',
      tag: 'Machine Learning',
    },
    {
      step: 4,
      title: 'Compare Farming Scenarios',
      icon: GitCompare,
      shortDesc: 'Simulate financial return and soil sustainability.',
      detailedDesc:
        'Run "what-if" models side-by-side. Compare monoculture vs. mixed relay cropping, conventional chemical vs. organic regenerative fertilizers, and risk ratings.',
      tag: 'What-If Simulation',
    },
    {
      step: 5,
      title: 'Make Better Decisions',
      icon: Award,
      shortDesc: 'Execute confident, profitable, and eco-friendly farming.',
      detailedDesc:
        'Harvest higher yields, optimize expensive fertilizer expenditures, sync with peak Mandi market prices, and build lasting soil organic vitality.',
      tag: 'Empowered Farmer',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] border border-[#C8E6C9] rounded-full inline-block mb-3">
            Workflow Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#37474F] tracking-tight">
            How Krishibhoomi Works
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#37474F]/80">
            From raw soil test values to actionable crop plans in five seamless software steps.
          </p>
        </div>

        {/* 5-Step Process Horizontal on Desktop, Stack on Mobile */}
        <div className="relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-1 bg-[#E8F5E9] -translate-y-8 -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
            {steps.map((item) => {
              const Icon = item.icon;
              const isCurrent = activeStep === item.step;
              return (
                <div
                  key={item.step}
                  onClick={() => setActiveStep(item.step)}
                  className={`cursor-pointer rounded-2xl p-5 text-center transition-all duration-200 border ${
                    isCurrent
                      ? 'bg-[#F1F8E9] border-[#2E7D32] shadow-md -translate-y-1'
                      : 'bg-white border-[#E0E0E0] hover:border-[#C8E6C9] hover:bg-[#F7FBF7]'
                  }`}
                >
                  <div className="flex justify-center mb-3">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all relative ${
                        isCurrent
                          ? 'bg-[#2E7D32] text-white shadow-sm'
                          : 'bg-[#E8F5E9] text-[#2E7D32]'
                      }`}
                    >
                      <Icon className="w-7 h-7" />
                      <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-white border border-[#E0E0E0] text-[11px] font-black text-[#37474F] flex items-center justify-center shadow-2xs">
                        {item.step}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-[#37474F] mb-1.5">{item.title}</h3>
                  <p className="text-xs text-[#37474F]/70 leading-snug">{item.shortDesc}</p>

                  <div className="mt-4 pt-3 border-t border-[#E0E0E0]/60 flex justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                      {item.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Step Detail Card */}
        <div className="mt-12 bg-[#F7FBF7] border border-[#C8E6C9] rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0E0E0]">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-[#2E7D32] text-white font-extrabold flex items-center justify-center text-sm">
                0{activeStep}
              </span>
              <div>
                <h4 className="font-extrabold text-xl text-[#37474F]">{steps[activeStep - 1].title}</h4>
                <span className="text-xs font-semibold text-[#2E7D32]">{steps[activeStep - 1].tag}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white text-xs font-bold rounded-xl hover:bg-[#1B5E20] transition-colors self-start sm:self-auto"
            >
              Try This in Dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="mt-4 text-sm sm:text-base text-[#37474F]/85 leading-relaxed">
            {steps[activeStep - 1].detailedDesc}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-[#37474F]">Step benefits:</span>
            <div className="flex items-center gap-1.5 text-xs text-[#2E7D32] bg-white px-2.5 py-1 rounded-lg border border-[#C8E6C9]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Fast AI processing
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#2E7D32] bg-white px-2.5 py-1 rounded-lg border border-[#C8E6C9]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Scientifically verified
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#2E7D32] bg-white px-2.5 py-1 rounded-lg border border-[#C8E6C9]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Zero physical sensors required
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
