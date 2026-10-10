import React, { useState, useEffect } from 'react';
import {
  Edit3,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MapPin,
  Layers,
  Sprout,
  Calendar,
  Compass,
} from 'lucide-react';
import { ManualSoilInput } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface ManualEntrySectionProps {
  onAnalyzeManual: (data: ManualSoilInput) => void;
  isAnalyzing: boolean;
}

export const ManualEntrySection: React.FC<ManualEntrySectionProps> = ({
  onAnalyzeManual,
  isAnalyzing,
}) => {
  const { user } = useAuth();

  const [nitrogen, setNitrogen] = useState<number | string>('');
  const [phosphorus, setPhosphorus] = useState<number | string>('');
  const [potassium, setPotassium] = useState<number | string>('');
  const [ph, setPh] = useState<number | string>('');
  const [organicCarbon, setOrganicCarbon] = useState<number | string>('');
  const [soilType, setSoilType] = useState<string>('');
  const [farmArea, setFarmArea] = useState<number | string>(user?.farmArea ?? '');
  const [previousCrop, setPreviousCrop] = useState<string>('');
  const [season, setSeason] = useState<string>('');
  const [location, setLocation] = useState<string>(user?.location || '');

  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync with user profile if available
  useEffect(() => {
    if (user?.farmArea) setFarmArea(user.farmArea);
    if (user?.location) setLocation(user.location);
    if (user?.soilType) setSoilType(user.soilType);
  }, [user]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const parseOptional = (value: number | string): number | null => {
      if (String(value).trim() === '') return null;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : Number.NaN;
    };
    const n = parseOptional(nitrogen);
    const p = parseOptional(phosphorus);
    const k = parseOptional(potassium);
    const phVal = parseOptional(ph);
    const oc = parseOptional(organicCarbon);
    const area = Number(farmArea);

    if ([n, p, k, phVal, oc].every((value) => value === null)) {
      setValidationError('Enter at least one measured soil value from your laboratory report.');
      return;
    }
    if ([n, p, k, oc].some((value) => value !== null && (!Number.isFinite(value) || value < 0)) || (phVal !== null && (!Number.isFinite(phVal) || phVal < 0 || phVal > 14))) {
      setValidationError('Enter non-negative finite measurements; pH must be between 0 and 14.');
      return;
    }
    if (isNaN(area) || area <= 0) {
      setValidationError('Farm area must be greater than 0 acres.');
      return;
    }
    if (!location.trim()) {
      setValidationError('Please specify your farm district or location.');
      return;
    }

    onAnalyzeManual({
      nitrogen: n,
      phosphorus: p,
      potassium: k,
      ph: phVal,
      organicCarbon: oc,
      soilType,
      farmArea: area,
      previousCrop,
      season,
      location: location.trim(),
    });
  };

  return (
    <div id="section-manual-entry" className="bg-white rounded-2xl border border-[#E0E0E0] p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
              <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">
              Section 3 • Direct Laboratory Entry
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#37474F]">
            Enter Soil Data Manually
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Input soil test parameters directly from your government or private laboratory certificate.
          </p>
        </div>

      </div>

      {validationError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core 5 Soil Chemistry Parameters */}
        <div>
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">
            Soil test measurements (leave fields blank when not reported)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Nitrogen */}
            <div>
              <label className="block text-xs font-extrabold text-[#37474F] mb-1.5">
                Nitrogen (N) <span className="text-gray-400 font-normal">kg/ha</span>
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={nitrogen}
                onChange={(e) => setNitrogen(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] outline-hidden text-sm font-bold text-[#37474F]"
              />
            </div>

            {/* Phosphorus */}
            <div>
              <label className="block text-xs font-extrabold text-[#37474F] mb-1.5">
                Phosphorus (P) <span className="text-gray-400 font-normal">kg/ha</span>
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={phosphorus}
                onChange={(e) => setPhosphorus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] outline-hidden text-sm font-bold text-[#37474F]"
              />
            </div>

            {/* Potassium */}
            <div>
              <label className="block text-xs font-extrabold text-[#37474F] mb-1.5">
                Potassium (K) <span className="text-gray-400 font-normal">kg/ha</span>
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={potassium}
                onChange={(e) => setPotassium(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] outline-hidden text-sm font-bold text-[#37474F]"
              />
            </div>

            {/* pH */}
            <div>
              <label className="block text-xs font-extrabold text-[#37474F] mb-1.5">
                Soil pH <span className="text-gray-400 font-normal">index</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="14"
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] outline-hidden text-sm font-bold text-[#37474F]"
              />
            </div>

            {/* Organic Carbon */}
            <div>
              <label className="block text-xs font-extrabold text-[#37474F] mb-1.5">
                Organic Carbon <span className="text-gray-400 font-normal">%</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={organicCarbon}
                onChange={(e) => setOrganicCarbon(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] outline-hidden text-sm font-bold text-[#37474F]"
              />
            </div>
          </div>
        </div>

        {/* Field & Agronomic Metadata */}
        <div className="pt-2">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">
            Field, Crop & Geographic Context
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Soil Type */}
            <div>
              <label className="block text-xs font-extrabold text-[#37474F] mb-1.5">Soil Type</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] outline-hidden text-xs sm:text-sm font-medium text-[#37474F] bg-white cursor-pointer"
              >
                <option value="Alluvial Sandy Loam">Alluvial Sandy Loam</option>
                <option value="Medium Deep Clay Loam">Medium Deep Clay Loam</option>
                <option value="Black Cotton Soil">Black Cotton Soil (Regur)</option>
                <option value="Red Loamy Soil">Red Loamy Soil</option>
                <option value="Silt Loam">Silt Loam</option>
                <option value="Sandy Soil">Sandy Soil</option>
              </select>
            </div>

            {/* Farm Area */}
            <div>
              <label className="block text-xs font-extrabold text-[#37474F] mb-1.5">
                Farm Area <span className="text-gray-400 font-normal">Acres</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0.1"
                max="500"
                value={farmArea}
                onChange={(e) => setFarmArea(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] outline-hidden text-sm font-medium text-[#37474F]"
                placeholder="12.5"
              />
            </div>

            {/* Previous Crop */}
            <div>
              <label className="block text-xs font-extrabold text-[#37474F] mb-1.5">
                Previous Crop
              </label>
              <select
                value={previousCrop}
                onChange={(e) => setPreviousCrop(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] outline-hidden text-xs sm:text-sm font-medium text-[#37474F] bg-white cursor-pointer"
              >
                <option value="Paddy / Basmati Rice">Paddy / Basmati Rice</option>
                <option value="Cotton">Cotton</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Maize / Corn">Maize / Corn</option>
                <option value="Moong / Green Gram (Pulse)">Moong / Green Gram (Pulse)</option>
                <option value="Mustard">Mustard</option>
                <option value="Wheat">Wheat</option>
                <option value="Fallow / Green Manure">Fallow / Green Manure</option>
              </select>
            </div>

            {/* Season */}
            <div>
              <label className="block text-xs font-extrabold text-[#37474F] mb-1.5">Season</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] outline-hidden text-xs sm:text-sm font-medium text-[#37474F] bg-white cursor-pointer"
              >
                <option value="Rabi Season 2026">Rabi Season 2026 (Winter)</option>
                <option value="Kharif Season 2026">Kharif Season 2026 (Monsoon)</option>
                <option value="Zaid Season 2026">Zaid Season 2026 (Summer)</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-extrabold text-[#37474F] mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] outline-hidden text-sm font-medium text-[#37474F]"
                placeholder="Your farm district and state"
              />
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#E0E0E0]">
          <span className="text-xs text-gray-500">
            * Enter values and units exactly as shown on the laboratory report. No unsupported classification is applied.
          </span>

          <button
            type="submit"
            id="btn-analyze-soil-manual"
            disabled={isAnalyzing}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-sm font-extrabold shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-60"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze Soil</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
