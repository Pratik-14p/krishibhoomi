import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { soilAnalysisService } from '../../services/soilAnalysisService';
import { TrendingUp, BarChart3, Compass, Coins, UploadCloud, Sprout, ArrowRight } from 'lucide-react';

interface ChartProps {
  onNavigateTab?: (tabKey: string) => void;
  onOpenUploadModal?: () => void;
}

// Custom Tooltip for Monthly Yield Analysis matching Figma
const CustomYieldTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#2E7D32] text-white px-3 py-2 rounded-xl shadow-lg text-xs font-bold flex flex-col items-center">
        <span className="text-[10px] text-emerald-100 font-medium">{label} Harvest</span>
        <span>Yield: {payload[0].value} T</span>
      </div>
    );
  }
  return null;
};

// Crop-specific monthly yield profiles (in Metric Tonnes) for baseline 12.5 Acres
const BASE_CROP_MONTHLY_PROFILES: Record<string, { yields: number[]; peakMonth: string; maxVal: number }> = {
  Soybean: {
    yields: [80, 70, 65, 85, 110, 160, 240, 310, 390, 420, 220, 110],
    peakMonth: 'Oct',
    maxVal: 420,
  },
  Cotton: {
    yields: [50, 40, 45, 60, 90, 140, 190, 240, 290, 330, 340, 260],
    peakMonth: 'Nov',
    maxVal: 340,
  },
  'Nagpur Orange': {
    yields: [180, 290, 380, 190, 140, 120, 160, 250, 380, 460, 440, 280],
    peakMonth: 'Oct',
    maxVal: 460,
  },
  Gram: {
    yields: [190, 280, 310, 180, 90, 60, 50, 65, 80, 120, 190, 240],
    peakMonth: 'Mar',
    maxVal: 310,
  },
  Wheat: {
    yields: [160, 240, 350, 310, 120, 70, 55, 60, 75, 95, 130, 180],
    peakMonth: 'Mar',
    maxVal: 350,
  },
  Mustard: {
    yields: [110, 180, 260, 190, 80, 40, 35, 45, 60, 85, 140, 180],
    peakMonth: 'Mar',
    maxVal: 260,
  },
  Groundnut: {
    yields: [60, 50, 55, 75, 120, 180, 250, 320, 360, 300, 180, 90],
    peakMonth: 'Sep',
    maxVal: 360,
  },
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const MonthlyYieldChart: React.FC<ChartProps> = ({ onNavigateTab, onOpenUploadModal }) => {
  const { user } = useAuth();
  const farmArea = user?.farmArea ?? 0;
  const hasSoilData = soilAnalysisService.hasUserUploadedSoil(user);
  const hasData = false; // Dashboard projections require a real saved record; never show demo projections.

  const defaultCrop = useMemo(() => {
    if (user?.preferredCrop) {
      const p = user.preferredCrop.toLowerCase();
      if (p.includes('wheat')) return 'Wheat';
      if (p.includes('mustard')) return 'Mustard';
      if (p.includes('cotton')) return 'Cotton';
      if (p.includes('orange')) return 'Nagpur Orange';
      if (p.includes('groundnut')) return 'Groundnut';
      if (p.includes('chana') || p.includes('gram')) return 'Gram';
    }
    return 'Soybean';
  }, [user]);

  const [selectedCrop, setSelectedCrop] = useState(defaultCrop);
  const [selectedYear, setSelectedYear] = useState('2026');

  // Scale data dynamically by farmer's acreage
  const areaRatio = Math.max(0.2, (farmArea || 12.5) / 12.5);
  const profile = BASE_CROP_MONTHLY_PROFILES[selectedCrop] || BASE_CROP_MONTHLY_PROFILES['Soybean'];
  const multiplier = (selectedYear === '2026-Target' ? 1.18 : 1.0) * areaRatio;

  const chartData = MONTH_LABELS.map((month, idx) => {
    const baseVal = profile.yields[idx];
    return {
      month,
      yield: Math.max(1, Math.round(baseVal * multiplier)),
    };
  });

  const peakYield = Math.max(1, Math.round(profile.maxVal * multiplier));
  const totalAnnualYield = chartData.reduce((acc, curr) => acc + curr.yield, 0);

  if (!hasData) {
    return (
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-full min-h-[340px]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-base text-[#37474F]">Monthly Yield Analysis</h3>
            <p className="text-xs text-gray-400">
              Output projections for {farmArea > 0 ? `${farmArea} Acres` : 'Farm Parcel'}
            </p>
          </div>
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
            Pending Soil Baseline
          </span>
        </div>

        <div className="bg-gray-50/70 border border-dashed border-gray-200 rounded-xl p-6 text-center my-auto flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#2E7D32] flex items-center justify-center mb-3">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-[#37474F]">No Yield Projections Generated</h4>
          <p className="text-xs text-gray-500 mt-1 mb-4 max-w-md leading-relaxed">
            Monthly harvest projections and peak yield windows are calculated dynamically using your soil's actual N-P-K nutrient reserves and regional agro-climatic calendars.
          </p>

          <button
            onClick={onOpenUploadModal || (() => onNavigateTab && onNavigateTab('soil-analysis'))}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Upload Soil Health Card
          </button>
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <span>Requires verified Soil Health Card or manual test entry</span>
          <span>Krishibhoomi AI Yield Engine</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-[#37474F]">Monthly Yield Analysis</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E8F5E9] text-[#2E7D32]">
              {selectedCrop}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Output in Tonnes for {farmArea} Acres (Total: {totalAnnualYield.toLocaleString()} T/year)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="text-xs font-semibold text-gray-700 bg-gray-50 border border-[#E0E0E0] rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-[#2E7D32] cursor-pointer"
          >
            <option value="Soybean">Soybean (JS-335)</option>
            <option value="Cotton">Cotton (Bt BG-II)</option>
            <option value="Nagpur Orange">Nagpur Orange (Santra)</option>
            <option value="Wheat">Wheat (GW-496)</option>
            <option value="Mustard">Mustard (Pusa Bold)</option>
            <option value="Groundnut">Groundnut (TG-37A)</option>
            <option value="Gram">Gram (Desi Chana)</option>
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="text-xs font-semibold text-gray-700 bg-gray-50 border border-[#E0E0E0] rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-[#2E7D32] cursor-pointer"
          >
            <option value="2026">2026 (Active Calendar)</option>
            <option value="2026-Target">2026 Target (+18%)</option>
          </select>
        </div>
      </div>

      <div className="relative h-64 w-full">
        {/* Dynamic Peak indicator badge */}
        <div className="absolute top-2 right-4 z-10 hidden sm:flex items-center gap-2 bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-xs">
          <span>Peak: {profile.peakMonth} ({peakYield} T)</span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="yieldGreenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2E7D32" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#78909C', fontSize: 12, fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#78909C', fontSize: 11 }}
              domain={[0, Math.ceil((peakYield * 1.15) / 10) * 10 || 50]}
            />
            <Tooltip content={<CustomYieldTooltip />} />
            <Area
              type="monotone"
              dataKey="yield"
              stroke="#2E7D32"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#yieldGreenGradient)"
              dot={{ stroke: '#2E7D32', strokeWidth: 2, r: 3.5, fill: '#FFFFFF' }}
              activeDot={{ r: 6, fill: '#2E7D32', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const CropSuitabilityChart: React.FC<ChartProps> = ({ onNavigateTab, onOpenUploadModal }) => {
  const { user } = useAuth();
  const hasSoilData = soilAnalysisService.hasUserUploadedSoil(user);
  const hasData = false; // Dashboard projections require a real saved record; never show demo projections.

  const suitabilityData = useMemo(() => {
    if (!hasData) return [];

    const crops = [
      { crop: 'Soybean', score: 96 },
      { crop: 'Nagpur Orange', score: 92 },
      { crop: 'Bt Cotton', score: 88 },
      { crop: 'Chickpea / Gram', score: 85 },
      { crop: 'Wheat (Rabi)', score: 78 },
      { crop: 'Mustard', score: 72 },
    ];

    if (user?.preferredCrop) {
      const parts = user.preferredCrop.split('&').map((s) => s.trim());
      if (parts[0]) {
        const found = crops.find((c) => c.crop.toLowerCase().includes(parts[0].toLowerCase()));
        if (found) {
          found.score = 98;
        } else {
          crops.unshift({ crop: parts[0], score: 98 });
        }
      }
    }

    return crops.sort((a, b) => b.score - a.score).slice(0, 6);
  }, [user, hasData]);

  if (!hasData) {
    return (
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-full min-h-[340px]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-base text-[#37474F]">Crop Suitability Index</h3>
            <p className="text-xs text-gray-400">Match score for {user?.soilType || 'Soil Type'}</p>
          </div>
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
            Pending Soil Test
          </span>
        </div>

        <div className="bg-gray-50/70 border border-dashed border-gray-200 rounded-xl p-6 text-center my-auto flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#2E7D32] flex items-center justify-center mb-3">
            <Compass className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-[#37474F]">Awaiting Soil Health Diagnostics</h4>
          <p className="text-xs text-gray-500 mt-1 mb-4 max-w-md leading-relaxed">
            Krishibhoomi AI ranks crop suitability percentages by cross-matching your exact soil chemistry (pH, Nitrogen, Phosphorus, Potassium, Zinc) against ICAR crop requirements.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={onOpenUploadModal || (() => onNavigateTab && onNavigateTab('soil-analysis'))}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Upload Soil Card
            </button>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('crop-recommendation')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Sprout className="w-3.5 h-3.5 text-[#2E7D32]" />
                Browse Crop Guide
              </button>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <span>AI multi-criteria agronomic decision matrix</span>
          <span>Zero-data state</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-extrabold text-base text-[#37474F]">Crop Suitability Index</h3>
          <p className="text-xs text-gray-400">Match score for {user?.soilType || 'Soil Type'}</p>
        </div>
        <span className="text-[11px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-full">
          AI Evaluated
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={suitabilityData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F0F0F0" />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: '#78909C', fontSize: 11 }} unit="%" />
            <YAxis
              type="category"
              dataKey="crop"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#37474F', fontSize: 11, fontWeight: 600 }}
            />
            <Tooltip
              formatter={(val: any) => [`${val}% Suitability Score`, 'Score']}
              contentStyle={{ borderRadius: '12px', border: '1px solid #E0E0E0', fontSize: '12px', fontWeight: 600 }}
            />
            <Bar dataKey="score" fill="#2E7D32" radius={[0, 8, 8, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const CostRevenueChart: React.FC<ChartProps> = ({ onNavigateTab, onOpenUploadModal }) => {
  const { user } = useAuth();
  const farmArea = user?.farmArea ?? 0;
  const hasSoilData = soilAnalysisService.hasUserUploadedSoil(user);
  const hasData = false; // Dashboard projections require a real saved record; never show demo projections.

  const costRevenueData = useMemo(() => {
    if (!hasData) return [];

    const scale = (farmArea || 12.5) / 12.5;
    return [
      { crop: 'Soybean', inputCost: Math.max(8, Math.round(75 * scale)), revenue: Math.max(18, Math.round(180 * scale)) },
      { crop: 'Bt Cotton', inputCost: Math.max(12, Math.round(110 * scale)), revenue: Math.max(25, Math.round(240 * scale)) },
      { crop: 'Orange', inputCost: Math.max(16, Math.round(140 * scale)), revenue: Math.max(35, Math.round(360 * scale)) },
      { crop: 'Chana', inputCost: Math.max(6, Math.round(45 * scale)), revenue: Math.max(14, Math.round(115 * scale)) },
      { crop: 'Wheat', inputCost: Math.max(7, Math.round(55 * scale)), revenue: Math.max(15, Math.round(135 * scale)) },
    ];
  }, [farmArea, hasData]);

  if (!hasData) {
    return (
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-full min-h-[300px]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-base text-[#37474F]">Cost vs. Revenue Analysis</h3>
            <p className="text-xs text-gray-400">
              Economics for {farmArea > 0 ? `${farmArea} Acres` : 'Farm Holding'}
            </p>
          </div>
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
            Pending Farm Plan
          </span>
        </div>

        <div className="bg-gray-50/70 border border-dashed border-gray-200 rounded-xl p-6 text-center my-auto flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1565C0] flex items-center justify-center mb-3">
            <Coins className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-[#37474F]">No Financial Records Logged</h4>
          <p className="text-xs text-gray-500 mt-1 mb-4 max-w-md leading-relaxed">
            Input cost breakdowns (fertilizer, seeds, irrigation, labor) and gross revenue margins are computed once you select your target crop varieties and calculate fertilizer requirements.
          </p>

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('profit')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <Coins className="w-3.5 h-3.5" />
              Open Cost & Profit Calculator
            </button>
          )}
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <span>Cost items: Seed, NPK fertilizer, crop protection, harvest</span>
          <span>Zero-data state</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-extrabold text-base text-[#37474F]">Cost vs. Revenue Analysis</h3>
          <p className="text-xs text-gray-400">Projected for {farmArea} Acres (₹ in Thousands)</p>
        </div>
        <span className="text-[11px] font-bold text-[#1565C0] bg-[#E3F2FD] px-2.5 py-1 rounded-full">
          High ROI Margins
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={costRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
            <XAxis dataKey="crop" axisLine={false} tickLine={false} tick={{ fill: '#37474F', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#78909C', fontSize: 11 }} unit="k" />
            <Tooltip
              formatter={(val: any, name: any) => [`₹${val * 1000}`, name === 'inputCost' ? 'Input Cost' : 'Gross Revenue']}
              contentStyle={{ borderRadius: '12px', border: '1px solid #E0E0E0', fontSize: '12px' }}
            />
            <Legend
              formatter={(value) => (value === 'inputCost' ? 'Input Expenses' : 'Expected Revenue')}
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            />
            <Bar dataKey="inputCost" fill="#CFD8DC" name="inputCost" radius={[6, 6, 0, 0]} />
            <Bar dataKey="revenue" fill="#2E7D32" name="revenue" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
