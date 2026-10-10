import React from 'react';
import {
  FileText,
  UploadCloud,
  Edit3,
  MapPin,
  Sparkles,
  Info,
  CheckCircle2,
  ArrowRight,
  FlaskConical,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { soilAnalysisService } from '../../services/soilAnalysisService';

interface NewFarmerOnboardingBannerProps {
  onOpenUploadModal: (defaultTab?: 'ocr' | 'manual') => void;
  onQuickNavigate: (tabKey: string) => void;
}

export const NewFarmerOnboardingBanner: React.FC<NewFarmerOnboardingBannerProps> = ({
  onOpenUploadModal,
  onQuickNavigate,
}) => {
  const { user } = useAuth();
  const [dismissed, setDismissed] = React.useState(false);

  const hasSoilData = soilAnalysisService.hasUserUploadedSoil(user);

  // Do not show banner if user already has verified soil test
  if (hasSoilData || dismissed) {
    return null;
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-emerald-700/40 mb-6">
      {/* Decorative ambient elements */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-1/3 -bottom-12 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

      <button
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 text-emerald-300/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        title="Dismiss notice"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Farm Awaiting Soil Test Calibration</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-white mb-2">
            Welcome, {user?.name || 'Farmer'}! Let's personalize your farm advisory.
          </h2>
          <p className="text-sm text-emerald-100/90 leading-relaxed">
            Your Krishibhoomi digital farm is created for{' '}
            <strong className="text-white font-medium">
              {user?.farmArea ? `${user.farmArea} Acres` : 'your field'}
            </strong>{' '}
            in <strong className="text-white font-medium">{user?.location || 'your region'}</strong>. AI crop recommendations, NPK fertilizer dosing, pest scouting, and yield forecasts are calibrated to your exact soil test numbers.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-emerald-200/90">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              Upload Govt Soil Health Card (OCR)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              Manual N-P-K & pH Lab Entry
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              Regional ICAR District Benchmarks
            </span>
          </div>
        </div>

        {/* Action button cluster */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
          <button
            onClick={() => onOpenUploadModal('ocr')}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-400 text-gray-950 font-bold text-sm shadow-md hover:bg-amber-300 transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Soil Health Card</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenUploadModal('manual')}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/15 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Enter Lab Values</span>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};
