import React from 'react';
import { Leaf, ShieldCheck, HeartHandshake, Award, Cpu, TrendingUp } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-[#F7FBF7] to-white border-t border-[#E0E0E0]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] border border-[#C8E6C9] rounded-full inline-block">
              Our Agronomic Mission
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#37474F] tracking-tight leading-tight">
              Pioneering Sustainable Indian Agriculture Through Pure Software & Data Intelligence
            </h2>
            <p className="text-base sm:text-lg text-[#37474F]/85 leading-relaxed">
              Krishibhoomi was founded on a simple conviction: Farmers do not need costly, fragile hardware or complicated sensor installations in the mud to farm intelligently.
            </p>
            <p className="text-sm sm:text-base text-[#37474F]/75 leading-relaxed">
              By combining standardized laboratory soil testing data with state-of-the-art predictive algorithms, we bridge the gap between agricultural chemistry and real-world farm operations. We empower smallholders and commercial growers alike to make ecological, high-yield, and cost-effective decisions from any phone or computer.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-4 rounded-xl border border-[#E0E0E0] shadow-2xs flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#E8F5E9] text-[#2E7D32] shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#37474F]">Ecological Soil Stewardship</h4>
                  <p className="text-xs text-[#37474F]/70 mt-0.5">
                    Prevent fertilizer runoff, avoid groundwater nitrate pollution, and rebuild organic carbon matter.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E0E0E0] shadow-2xs flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#E3F2FD] text-[#1565C0] shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#37474F]">Maximum Farmer Net Margins</h4>
                  <p className="text-xs text-[#37474F]/70 mt-0.5">
                    Cut wasteful chemical input costs by up to 25% while timing crop sales to peak APMC Mandi price windows.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Highlights Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-8 border border-[#E0E0E0] shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8F5E9]/60 rounded-full blur-2xl -z-0" />

              <div className="relative z-10 space-y-6">
                <h3 className="font-extrabold text-xl text-[#37474F]">Why Krishibhoomi?</h3>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#37474F]">100% Software-Based</p>
                      <p className="text-xs text-[#37474F]/70">No battery replacements, no damaged field hardware, zero maintenance overhead.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#37474F]">Agronomic Knowledge Base</p>
                      <p className="text-xs text-[#37474F]/70">Calibrated with regional crop response curves and ICAR research soil standards.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#37474F]">Transparent AI Reasoning</p>
                      <p className="text-xs text-[#37474F]/70">Every recommendation is accompanied by the underlying NPK chemistry rationale.</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#F1F8E9] border border-[#C8E6C9] rounded-2xl flex items-center gap-3">
                  <Award className="w-8 h-8 text-[#2E7D32] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">Sustainable Development</p>
                    <p className="text-xs text-[#37474F]/80">Aligned with UN Sustainable Agriculture Goals for soil health & farmer equity.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
