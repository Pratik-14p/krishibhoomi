import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2, FileSpreadsheet, TrendingUp, Leaf, ScanLine, Sprout, BarChart3 } from 'lucide-react';
import cropFieldImg from '../../assets/images/krishibhoomi_crop_field_1788870107457.jpg';

interface HeroSectionProps {
  onExploreFeatures: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreFeatures }) => {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative overflow-hidden bg-[#fbfdf9] pt-8 pb-20 lg:pt-12 lg:pb-28">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-[8%] h-72 w-72 rounded-full bg-[#e6f5df] blur-3xl opacity-70" />
        <div className="absolute top-[35%] right-[-8%] h-96 w-96 rounded-full bg-[#e9f6f1] blur-3xl opacity-80" />
        <div className="absolute bottom-0 left-[35%] h-56 w-56 rounded-full bg-[#fff4cf] blur-3xl opacity-45" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d9ead1] bg-white/90 px-4 py-2 text-xs sm:text-sm font-semibold text-[#34743b] shadow-[0_8px_30px_rgba(62,110,63,0.08)]">
              <Sparkles className="w-4 h-4" />
              AI-powered crop intelligence
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#78947b]">Sustainable Agriculture Intelligence</p>
              <h1 className="text-4xl sm:text-5xl lg:text-[4.2rem] font-black tracking-[-0.045em] leading-[1.03] text-[#18341e]">
                Grow smarter with your <span className="text-[#3d8b48]">crop data.</span>
              </h1>
              <p className="max-w-xl text-base sm:text-lg lg:text-xl leading-relaxed text-[#536557]">
                Turn soil reports and farm information into clear crop, nutrient, yield and market decisions — without sensors or field hardware.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2f7d3b] px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-[0_12px_30px_rgba(47,125,59,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#286c33]"
              >
                Explore Crop Intelligence
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={onExploreFeatures}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#dbe6dc] bg-white px-6 py-3.5 text-sm sm:text-base font-bold text-[#29402d] shadow-[0_8px_24px_rgba(35,61,39,0.06)] transition-all hover:-translate-y-0.5 hover:border-[#bcd8c0] hover:bg-[#f7fbf6]"
              >
                See how it works
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              {[
                [CheckCircle2, 'No hardware'],
                [FileSpreadsheet, 'Lab soil data'],
                [TrendingUp, 'Market insights'],
              ].map(([Icon, label]) => (
                <div key={label as string} className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2.5 border border-[#e6eee5] text-xs font-semibold text-[#536557]">
                  <Icon className="w-4 h-4 text-[#3d8b48] shrink-0" />
                  {label as string}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 relative z-10">
            <div className="relative mx-auto max-w-2xl">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#e6f4df] via-white to-[#e6f2ed] blur-xl opacity-80" />
              <div className="relative rounded-[2rem] border border-white/80 bg-white/80 p-2 shadow-[0_30px_80px_rgba(50,88,57,0.16)] backdrop-blur-sm">
                <div className="relative aspect-[1.05/1] overflow-hidden rounded-[1.55rem] bg-[#dcebd8] group">
                  <img
                    src={cropFieldImg}
                    alt="Growing crops in a green agricultural field"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#18341e]/55 via-transparent to-white/10" />

                  <div className="absolute left-4 top-4 right-4 flex items-center justify-between">
                    <div className="rounded-full border border-white/70 bg-white/90 px-3 py-2 text-xs font-bold text-[#2f6f38] shadow-lg backdrop-blur-md">
                      Live crop view
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-2 text-xs font-bold text-[#29402d] shadow-lg backdrop-blur-md">
                      <span className="h-2 w-2 rounded-full bg-[#52a85c] animate-pulse" />
                      AI ready
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/60 bg-white/90 p-3 shadow-lg backdrop-blur-md">
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#758277]"><Sprout className="w-3.5 h-3.5 text-[#3d8b48]" /> Crop fit</div>
                      <div className="mt-1 text-lg font-black text-[#234b2a]">94%</div>
                    </div>
                    <div className="rounded-2xl border border-white/60 bg-white/90 p-3 shadow-lg backdrop-blur-md">
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#758277]"><ScanLine className="w-3.5 h-3.5 text-[#3d8b48]" /> Soil</div>
                      <div className="mt-1 text-lg font-black text-[#234b2a]">Balanced</div>
                    </div>
                    <div className="hidden sm:block rounded-2xl border border-white/60 bg-white/90 p-3 shadow-lg backdrop-blur-md">
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#758277]"><BarChart3 className="w-3.5 h-3.5 text-[#3d8b48]" /> Yield</div>
                      <div className="mt-1 text-lg font-black text-[#234b2a]">+22.4%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -left-5 top-[30%] hidden sm:block rounded-2xl border border-[#dfeade] bg-white/95 px-4 py-3 shadow-[0_16px_40px_rgba(47,77,51,0.12)] backdrop-blur-md animate-[floatCard_5s_ease-in-out_infinite]">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#edf7ea] text-[#3d8b48]"><Leaf className="w-4 h-4" /></div>
                  <div><p className="text-[10px] font-bold uppercase tracking-wider text-[#849187]">Recommendation</p><p className="text-xs font-extrabold text-[#29402d]">Crop rotation ready</p></div>
                </div>
              </div>

              <div className="absolute -right-5 bottom-[25%] hidden sm:block rounded-2xl border border-[#e8e4ce] bg-[#fffdf3]/95 px-4 py-3 shadow-[0_16px_40px_rgba(96,82,40,0.10)] backdrop-blur-md animate-[floatCard_6s_ease-in-out_infinite_reverse]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#91865f]">Next action</p>
                <p className="text-xs font-extrabold text-[#5d552f]">Review fertilizer plan →</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 lg:mt-20 rounded-[2rem] border border-[#e3ece2] bg-white/75 p-5 sm:p-7 shadow-[0_18px_50px_rgba(46,76,50,0.06)] backdrop-blur-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7c8e7e]">From field data to action</p>
              <p className="mt-1 text-lg font-extrabold text-[#213d27]">One calm workspace for your farming decisions.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#5b6e5e]">
              {['Soil', 'Crops', 'Fertilizer', 'Yield', 'Market'].map((item, index) => (
                <React.Fragment key={item}>
                  {index > 0 && <span className="text-[#b4c1b5]">→</span>}
                  <span className="rounded-full bg-[#f2f7f1] px-3 py-1.5">{item}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
