import React from 'react';
import { Globe2, FileText, Sprout, TrendingUp, Coins, ArrowUpRight, CheckCircle2, UploadCloud, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { SoilMetrics } from '../../types';

interface StatCardsProps {
  onQuickNavigate: (tabKey: string) => void;
  activeSoil?: SoilMetrics | null;
}

export const StatCards: React.FC<StatCardsProps> = ({ onQuickNavigate, activeSoil }) => {
  const { user } = useAuth();
  const { t } = useI18n();

  const farmArea = user?.farmArea ?? 0;
  const locationLabel = user?.location ? user.location.split(',')[0].trim() : '';
  
  // Real soil test check: verified only if test exists with real score, date, and valid pH/nutrients
  const hasSoilTest = Boolean(
    activeSoil &&
    activeSoil.overallHealthScore &&
    activeSoil.overallHealthScore > 0 &&
    activeSoil.testDate &&
    activeSoil.testDate !== 'Not Tested' &&
    activeSoil.testDate !== '' &&
    activeSoil.ph &&
    activeSoil.ph > 0
  );

  const phValue = activeSoil?.ph ?? 0;
  const soilDate = activeSoil?.testDate || '';
  const healthScore = activeSoil?.overallHealthScore || 0;

  const cleanUserCrop = user?.preferredCrop?.trim() || '';
  const hasUserCrop = Boolean(cleanUserCrop.length > 0);

  // Recommended Crop logic:
  // - Real user with soil test: recommends based on verified soil diagnostics
  // - Real user without soil test who picked a crop: shows their selected crop
  // - Real user without soil test and no crop: shows honest "Awaiting Test" / "Upload soil to match crops"
  const recommendedCrop = hasSoilTest
    ? (hasUserCrop
        ? cleanUserCrop
        : user?.soilType?.includes('Red')
        ? 'Groundnut & Pulses'
        : user?.soilType?.includes('Black')
        ? 'Soybean & Cotton'
        : 'Chickpea & Mustard')
    : (hasUserCrop ? cleanUserCrop : null);

  // Yield & Profit: CRITICAL: Never show artificial yield or profit projections without real soil data!
  // In True Zero-Data State, a new user who has not entered data MUST see '--'
  // Do not fabricate yield/profit numbers on the dashboard. These cards remain
  // empty until a real prediction/calculation has been saved for this user.
  const yieldPerAcre: number | null = null;
  const totalYield: number | null = null;
  const profitPerAcre: number | null = null;
  const totalProfit: number | null = null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Farm Area */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#37474F]/70 tracking-wide">{t('profile.farmArea')}</span>
          <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
            <Globe2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-extrabold text-[#37474F]">
            {farmArea > 0 ? farmArea : '--'} <span className="text-sm font-semibold text-gray-500">Acres</span>
          </p>
          <div className="mt-1 flex items-center gap-1 text-xs font-bold text-[#2E7D32] truncate">
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{locationLabel ? `Land in ${locationLabel}` : 'Registered Holding'}</span>
          </div>
        </div>
      </div>

      {/* 2. Last Soil Analysis */}
      <div 
        onClick={() => onQuickNavigate('soil-analysis')}
        className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-[#C8E6C9] transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#37474F]/70 tracking-wide">{t('soil.analysis')}</span>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform ${
            hasSoilTest ? 'bg-[#E3F2FD] text-[#1565C0]' : 'bg-amber-50 text-amber-700'
          }`}>
            {hasSoilTest ? <FileText className="w-4 h-4" /> : <UploadCloud className="w-4 h-4" />}
          </div>
        </div>
        <div className="mt-2">
          {hasSoilTest ? (
            <>
              <p className="text-2xl font-extrabold text-[#37474F]">pH {phValue.toFixed(1)}</p>
              <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#1565C0] truncate">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Tested: {soilDate} ({healthScore}/100)</span>
              </div>
            </>
          ) : (
            <>
              <p className="text-xl font-extrabold text-gray-400">No Report</p>
              <div className="mt-1 flex items-center gap-1 text-xs font-bold text-[#1565C0] truncate">
                <UploadCloud className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{t('soil.uploadReport')}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3. Recommended Crop */}
      <div 
        onClick={() => onQuickNavigate('crop-recommendation')}
        className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-[#C8E6C9] transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#37474F]/70 tracking-wide">{t('crop.recommendation')}</span>
          <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Sprout className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          {recommendedCrop ? (
            <>
              <p className="text-xl font-extrabold text-[#37474F] truncate">{recommendedCrop}</p>
              <div className="mt-1 flex items-center gap-1 text-xs font-bold text-[#2E7D32]">
                {hasSoilTest ? (
                  <>
                    <span className="px-1.5 py-0.5 bg-[#E8F5E9] rounded-sm text-[11px]">Saved Preference</span>
                    <span className="text-gray-400">• Test Soil to Verify</span>
                  </>
                ) : (
                  <>
                    <span className="px-1.5 py-0.5 bg-blue-50 text-[#1565C0] rounded-sm text-[11px]">Preferred</span>
                    <span className="text-gray-400">• Test Soil to Optimize</span>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="text-xl font-extrabold text-gray-400 truncate">Awaiting Test</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-gray-400 truncate">
                <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Upload soil to match crops</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 4. Expected Yield */}
      <div 
        onClick={() => onQuickNavigate('yield')}
        className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-[#C8E6C9] transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#37474F]/70 tracking-wide">{t('crop.expectedYield')}</span>
          <div className="w-8 h-8 rounded-full bg-[#FFF8E1] text-[#E65100] flex items-center justify-center group-hover:scale-105 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          {totalYield !== null ? (
            <>
              <p className="text-2xl font-extrabold text-[#37474F]">
                {yieldPerAcre} <span className="text-sm font-semibold text-gray-500">Qtl/Acre</span>
              </p>
              <div className="mt-1 flex items-center gap-1 text-xs font-bold text-[#2E7D32] truncate">
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">~{totalYield.toLocaleString()} Qtl total</span>
              </div>
            </>
          ) : (
            <>
              <p className="text-2xl font-extrabold text-gray-300">
                -- <span className="text-sm font-semibold text-gray-400">Qtl/Acre</span>
              </p>
              <div className="mt-1 text-xs text-gray-400 truncate">
                Requires soil test & crop
              </div>
            </>
          )}
        </div>
      </div>

      {/* 5. Estimated Profit */}
      <div 
        onClick={() => onQuickNavigate('profit')}
        className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-[#C8E6C9] transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#37474F]/70 tracking-wide">{t('dashboard.estimatedProfit')}</span>
          <div className="w-8 h-8 rounded-full bg-[#F3E5F5] text-[#7B1FA2] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          {totalProfit !== null ? (
            <>
              <p className="text-2xl font-extrabold text-[#37474F]">₹{totalProfit.toLocaleString('en-IN')}</p>
              <div className="mt-1 flex items-center gap-1 text-xs font-bold text-[#2E7D32] truncate">
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">~₹{((profitPerAcre || 0) / 1000).toFixed(1)}k / Acre margin</span>
              </div>
            </>
          ) : (
            <>
              <p className="text-2xl font-extrabold text-gray-300">--</p>
              <div className="mt-1 text-xs text-gray-400 truncate">
                Calculated after soil test
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
