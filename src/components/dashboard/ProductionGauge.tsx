import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { soilAnalysisService } from '../../services/soilAnalysisService';
import { UploadCloud, Sprout, ArrowRight } from 'lucide-react';

interface SeasonProduction {
  total: string;
  subtitle: string;
  shares: Array<{ name: string; share: number; color: string }>;
}

interface ProductionGaugeProps {
  onNavigateTab?: (tab: string) => void;
  onOpenUploadModal?: () => void;
}

export const ProductionGauge: React.FC<ProductionGaugeProps> = ({
  onNavigateTab,
  onOpenUploadModal,
}) => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('Yearly');

  const farmArea = user?.farmArea ?? 0;
  const hasSoilData = soilAnalysisService.hasUserUploadedSoil(user);
  const hasData = false; // Dashboard projections require a real saved record; never show demo projections.

  const seasonalData: Record<string, SeasonProduction> = useMemo(() => {
    if (!hasData) {
      return {
        'Yearly': { total: '0%', subtitle: 'No Crop Data Logged', shares: [] },
      };
    }

    // Determine crops based on farmer preferences
    let primaryCrop = 'Soybean';
    let secondaryCrop = 'Nagpur Orange';
    let tertiaryCrop = 'Bt Cotton';
    let pulseCrop = 'Desi Chana';

    if (user?.preferredCrop) {
      const parts = user.preferredCrop.split('&').map((s) => s.trim());
      if (parts[0]) primaryCrop = parts[0];
      if (parts[1]) secondaryCrop = parts[1];
    } else if (user?.soilType?.includes('Red')) {
      primaryCrop = 'Groundnut';
      secondaryCrop = 'Red Gram (Pigeon Pea)';
      tertiaryCrop = 'Maize';
      pulseCrop = 'Black Gram';
    }

    // Scale tonnages realistically with farmer's actual holding acreage
    const kharifTons = Math.max(12, Math.round(farmArea * 52));
    const rabiTons = Math.max(8, Math.round(farmArea * 22.4));
    const zaidTons = Math.max(4, Math.round(farmArea * 9.6));

    return {
      'Yearly': {
        total: '100%',
        subtitle: 'of Total Production (2026)',
        shares: [
          { name: primaryCrop, share: 44, color: '#2E7D32' },
          { name: secondaryCrop, share: 28, color: '#1E88E5' },
          { name: tertiaryCrop, share: 18, color: '#8E24AA' },
          { name: pulseCrop, share: 10, color: '#00897B' },
        ],
      },
      'Kharif': {
        total: `${kharifTons} tons`,
        subtitle: `Kharif Harvest (${farmArea} Acres)`,
        shares: [
          { name: `${primaryCrop} (Main)`, share: 55, color: '#2E7D32' },
          { name: tertiaryCrop, share: 25, color: '#8E24AA' },
          { name: secondaryCrop, share: 20, color: '#1E88E5' },
        ],
      },
      'Rabi': {
        total: `${rabiTons} tons`,
        subtitle: `Rabi Harvest (${farmArea} Acres)`,
        shares: [
          { name: `${secondaryCrop} (Rabi)`, share: 50, color: '#00897B' },
          { name: pulseCrop, share: 30, color: '#1E88E5' },
          { name: 'Rotational Wheat', share: 20, color: '#F57C00' },
        ],
      },
      'Zaid': {
        total: `${zaidTons} tons`,
        subtitle: `Zaid Harvest (${farmArea} Acres)`,
        shares: [
          { name: 'Summer Moong', share: 50, color: '#2E7D32' },
          { name: `${primaryCrop} Fodder`, share: 50, color: '#1E88E5' },
        ],
      },
    };
  }, [user, farmArea, hasData]);

  // If user is brand new with no soil report uploaded
  if (!hasData) {
    return (
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-full min-h-[310px]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-extrabold text-base text-[#37474F]">Production Overview</h3>
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
            Pending Data
          </span>
        </div>

        <div className="flex flex-col items-center justify-center py-6 text-center my-auto">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 mb-3">
            <Sprout className="w-7 h-7" />
          </div>
          <p className="text-sm font-bold text-[#37474F]">No Production Targets Yet</p>
          <p className="text-xs text-gray-500 max-w-xs mt-1 leading-relaxed">
            Upload your Soil Health Card or select your planted crops to calculate seasonal harvest targets for your {farmArea > 0 ? `${farmArea} Acre` : ''} holding.
          </p>

          <button
            onClick={onOpenUploadModal || (() => onNavigateTab && onNavigateTab('soil-analysis'))}
            className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Upload Soil Card
          </button>
        </div>

        <div className="pt-3 border-t border-gray-100 text-center">
          <span className="text-[11px] text-gray-400 font-medium">
            Production shares compute automatically from soil & crop data
          </span>
        </div>
      </div>
    );
  }

  const currentData = seasonalData[timeRange] || seasonalData['Yearly'];

  // Segments for the fan gauge
  const totalBars = 36;
  
  // Calculate color along gradient matching crops breakdown
  const getBarColor = (index: number) => {
    const ratio = index / totalBars;
    if (ratio < 0.28) {
      return '#8E24AA';
    } else if (ratio < 0.52) {
      return '#1E88E5';
    } else if (ratio < 0.72) {
      return '#00897B';
    } else {
      return '#2E7D32';
    }
  };

  return (
    <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-extrabold text-base text-[#37474F]">Production Overview</h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="text-xs font-semibold text-gray-600 bg-gray-50 border border-[#E0E0E0] rounded-lg px-2.5 py-1 focus:outline-hidden focus:border-[#2E7D32] cursor-pointer"
        >
          <option value="Yearly">Yearly (2026)</option>
          <option value="Kharif">Kharif 2026</option>
          <option value="Rabi">Rabi 2026</option>
          <option value="Zaid">Zaid 2026</option>
        </select>
      </div>

      {/* Semi-circular radial gauge */}
      <div className="relative flex flex-col items-center justify-center py-2">
        <svg viewBox="0 0 240 135" className="w-56 sm:w-64 max-w-full">
          {Array.from({ length: totalBars }).map((_, i) => {
            // Angle from 180 (left) to 0 (right)
            const angleDeg = 180 - (i / (totalBars - 1)) * 180;
            const angleRad = (angleDeg * Math.PI) / 180;
            
            // Radii for tick marks
            const rInner = 78;
            const rOuter = 104;
            
            const cx = 120;
            const cy = 120;

            const x1 = cx + rInner * Math.cos(angleRad);
            const y1 = cy - rInner * Math.sin(angleRad);
            const x2 = cx + rOuter * Math.cos(angleRad);
            const y2 = cy - rOuter * Math.sin(angleRad);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={getBarColor(i)}
                strokeWidth="3.2"
                strokeLinecap="round"
                className="transition-all duration-300 hover:opacity-80"
              />
            );
          })}
        </svg>

        {/* Center Text inside the arc */}
        <div className="absolute top-[68px] text-center">
          <p className="text-xl sm:text-2xl font-black text-[#37474F] tracking-tight">{currentData.total}</p>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{currentData.subtitle}</p>
        </div>
      </div>

      {/* Legend below matching updated crop shares */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-center flex-wrap gap-3 sm:gap-4 text-xs font-semibold text-[#37474F]">
        {currentData.shares.map((crop) => (
          <div key={crop.name} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: crop.color }} />
            <span>
              {crop.name}: {crop.share}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
