import React, { useState, useMemo } from 'react';
import { ChevronDown, ArrowRight, CheckCircle2, Layers, UploadCloud, Sprout, MapPin } from 'lucide-react';
import cropFieldImg from '../../assets/images/krishibhoomi_crop_field_1788870107457.jpg';
import { useAuth } from '../../context/AuthContext';
import { soilAnalysisService } from '../../services/soilAnalysisService';

interface CropFieldCardProps {
  onMoreDetails: () => void;
  onOpenUploadModal?: () => void;
}

export const CropFieldCard: React.FC<CropFieldCardProps> = ({ onMoreDetails, onOpenUploadModal }) => {
  const { user } = useAuth();
  const farmArea = user?.farmArea ?? 0;
  const hasSoilData = soilAnalysisService.hasUserUploadedSoil(user);
  const hasData = false; // Dashboard projections require a real saved record; never show demo projections.

  const plots = useMemo(() => {
    if (!hasData) return [];

    let cropA = 'Soybean';
    let cropB = 'Nagpur Orange';
    if (user?.preferredCrop) {
      const parts = user.preferredCrop.split('&').map((s) => s.trim());
      if (parts[0]) cropA = parts[0];
      if (parts[1]) cropB = parts[1];
    } else if (user?.soilType?.includes('Red')) {
      cropA = 'Groundnut';
      cropB = 'Red Gram';
    }

    return [
      {
        id: 'plot-1',
        name: `North ${cropA} Plot (${(farmArea * 0.55).toFixed(1)} Ac)`,
        health: 'Optimal',
        plantingDate: '16 March, 2026',
        harvestTime: '110-125 Days',
      },
      {
        id: 'plot-2',
        name: `East ${cropB} Block (${(farmArea * 0.3).toFixed(1)} Ac)`,
        health: 'Good',
        plantingDate: '02 March, 2026',
        harvestTime: '135-150 Days',
      },
      {
        id: 'plot-3',
        name: `South Pulse Holding (${(farmArea * 0.15).toFixed(1)} Ac)`,
        health: 'Good',
        plantingDate: '24 Feb, 2026',
        harvestTime: '90-105 Days',
      },
    ];
  }, [user, farmArea, hasData]);

  const [selectedField, setSelectedField] = useState(plots[0]?.name || '');
  const activePlot = plots.find((p) => p.name === selectedField) || plots[0];

  if (!hasData) {
    return (
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-full min-h-[340px]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-[#37474F]">Crop Parcel Monitoring</h3>
          </div>
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
            No Plots Added
          </span>
        </div>

        <div className="bg-gray-50/70 border border-dashed border-gray-200 rounded-xl p-5 text-center my-auto flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#2E7D32] flex items-center justify-center mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-[#37474F]">Registered Holding: {farmArea > 0 ? `${farmArea} Acres` : 'Farm Parcel'}</h4>
          <p className="text-xs text-gray-500 mt-1 mb-3 max-w-sm">
            {user?.location ? `Located in ${user.location} (${user.soilType || 'Soil Recorded'}).` : ''} No active crop plots or sowing dates are logged yet for this account.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
            <button
              onClick={onMoreDetails}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <Sprout className="w-3.5 h-3.5" />
              Match Suitable Crops
            </button>
            {onOpenUploadModal && (
              <button
                onClick={onOpenUploadModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5 text-[#2E7D32]" />
                Upload Soil Card
              </button>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-gray-400" />
            {user?.location || 'Farm Location Registered'}
          </span>
          <span>Growth stages sync with soil card</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E0E0E0] rounded-2xl overflow-hidden shadow-2xs flex flex-col justify-between">
      {/* Field Image with top gradient & field badge */}
      <div className="relative h-44 sm:h-48 overflow-hidden group">
        <img
          src={cropFieldImg}
          alt="Lush green agricultural crop field"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Top Dropdown Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/80 shadow-xs flex items-center gap-2 max-w-[70%]">
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="text-xs font-bold text-[#37474F] bg-transparent focus:outline-hidden cursor-pointer truncate"
          >
            {plots.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-500 pointer-events-none shrink-0" />
        </div>

        {/* Action Link Top Right */}
        <button
          onClick={onMoreDetails}
          className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/80 shadow-xs text-xs font-bold text-[#2E7D32] hover:bg-white flex items-center gap-1 transition-all cursor-pointer"
        >
          More Details
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Live Status on Image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white text-xs font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Optimal Photosynthesis & Soil Moisture Index</span>
        </div>
      </div>

      {/* Stats Bottom Bar */}
      <div className="p-4 grid grid-cols-3 gap-2 divide-x divide-gray-100 text-center">
        <div>
          <p className="text-[11px] font-semibold text-gray-500">Crop Health</p>
          <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold">
            <CheckCircle2 className="w-3 h-3" />
            {activePlot?.health || 'Good'}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold text-gray-500">Planting Date</p>
          <p className="mt-1 text-xs font-bold text-[#37474F]">{activePlot?.plantingDate || '16 March, 2026'}</p>
        </div>

        <div>
          <p className="text-[11px] font-semibold text-gray-500">Harvest Time</p>
          <p className="mt-1 text-xs font-bold text-[#37474F]">{activePlot?.harvestTime || '110-125 Days'}</p>
        </div>
      </div>
    </div>
  );
};
