import React, { useEffect, useState } from 'react';
import { X, UploadCloud, FileText, Edit3, AlertCircle, CheckCircle2, Save, Loader2 } from 'lucide-react';
import { SoilMetrics, ExtractedOCRReport } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { soilAnalysisService } from '../../services/soilAnalysisService';

interface UploadSoilModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSoilReportUploaded: (soil: SoilMetrics) => void;
  initialTab?: 'ocr' | 'manual';
}

const PARAMS = [
  ['nitrogen','Nitrogen','kg/ha'],
  ['phosphorus','Phosphorus','kg/ha'],
  ['potassium','Potassium','kg/ha'],
  ['ph','pH',''],
  ['organicCarbon','Organic Carbon','%'],
  ['sulphur','Sulphur','ppm'],
  ['zinc','Zinc','ppm'],
  ['iron','Iron','ppm'],
  ['manganese','Manganese','ppm'],
  ['copper','Copper','ppm'],
  ['boron','Boron','ppm'],
  ['electricalConductivity','Electrical Conductivity','dS/m'],
] as const;

export const UploadSoilModal: React.FC<UploadSoilModalProps> = ({
  isOpen,
  onClose,
  onSoilReportUploaded,
  initialTab = 'ocr',
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'ocr' | 'manual'>(initialTab);
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<ExtractedOCRReport | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [farmArea, setFarmArea] = useState('');
  const [soilType, setSoilType] = useState('');
  const [location, setLocation] = useState('');
  const [crop, setCrop] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setActiveTab(initialTab);
    setFile(null);
    setReport(null);
    setValues({});
    setFarmArea(user?.farmArea ? String(user.farmArea) : '');
    setSoilType(user?.soilType || '');
    setLocation(user?.location || '');
    setCrop(user?.preferredCrop || '');
    setError('');
    setMessage('');
  }, [isOpen, initialTab, user]);

  if (!isOpen) return null;

  const setValue = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleOCR = async () => {
    if (!file) {
      setError('Select your actual Soil Health Card or laboratory report first.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const extracted = await soilAnalysisService.extractReportOCR(file);
      setReport(extracted);
      const next: Record<string, string> = {};
      for (const [key] of PARAMS) {
        const value = extracted.parameters?.[key]?.value;
        if (value != null) next[key] = String(value);
      }
      setValues(next);
      setSoilType(extracted.soilTexture || extracted.metadata?.soilType || soilType);
      setLocation(extracted.district || location);
      setMessage('Gemini extracted the values. Review them before saving.');
    } catch (e: any) {
      setError(e?.message || 'Gemini could not reliably read the uploaded soil report.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const required = ['nitrogen','phosphorus','potassium','ph','organicCarbon'];
    const parsed: Record<string, number> = {};
    for (const [key] of PARAMS) {
      const raw = values[key];
      if (raw !== undefined && raw !== '') {
        const n = Number(raw);
        if (!Number.isFinite(n) || n < 0) {
          setError(`Enter a valid value for ${key}.`);
          return;
        }
        parsed[key] = n;
      }
    }
    const missing = required.filter((key) => parsed[key] === undefined || parsed[key] <= 0);
    if (missing.length) {
      setError(`Required verified soil values are missing: ${missing.join(', ')}. Do not save until the report/manual lab values are complete.`);
      return;
    }
    const area = Number(farmArea);
    if (!Number.isFinite(area) || area <= 0) {
      setError('Enter the actual farm area before saving the soil analysis.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await soilAnalysisService.finalizeStructuredAnalysis(
        parsed,
        {
          fileName: file?.name,
          fileType: file?.type,
          fileSize: file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : undefined,
          sampleId: report?.sampleId,
          labName: report?.labName,
          farmerName: report?.farmerName || user?.name,
          district: report?.district || location,
          soilTexture: soilType,
          location,
          farmArea: area,
          preferredCrop: crop,
          previousCrop: crop,
          season: '',
        },
        undefined,
        user
      );
      if (!result.soilMetrics) throw new Error('Soil analysis was saved but no verified soil metrics were returned.');
      onSoilReportUploaded(result.soilMetrics);
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Unable to save the verified soil analysis.');
    } finally {
      setLoading(false);
    }
  };

  const acceptFile = (selected: File) => {
    const validation = soilAnalysisService.validateFile(selected);
    if (!validation.valid) {
      setError(validation.error || 'Unsupported soil report.');
      return;
    }
    setFile(selected);
    setReport(null);
    setError('');
    setMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-hidden shadow-2xl">
        <div className="px-5 py-4 bg-[#E8F5E9] border-b border-[#C8E6C9] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-[#1B5E20]">Add Verified Soil Data</h2>
            <p className="text-xs text-gray-600 mt-1">Gemini OCR reads your actual report. No sample or regional values are substituted.</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-gray-200 px-4 pt-2 gap-2">
          <button type="button" onClick={() => setActiveTab('ocr')} className={`px-4 py-2 text-xs font-bold rounded-t-xl ${activeTab === 'ocr' ? 'bg-white text-[#2E7D32] border-b-2 border-[#2E7D32]' : 'text-gray-500'}`}>
            <UploadCloud className="inline w-4 h-4 mr-1" /> Upload Report
          </button>
          <button type="button" onClick={() => setActiveTab('manual')} className={`px-4 py-2 text-xs font-bold rounded-t-xl ${activeTab === 'manual' ? 'bg-white text-[#2E7D32] border-b-2 border-[#2E7D32]' : 'text-gray-500'}`}>
            <Edit3 className="inline w-4 h-4 mr-1" /> Manual Lab Entry
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto max-h-[72vh] space-y-5">
          {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold"><AlertCircle className="inline w-4 h-4 mr-2" />{error}</div>}
          {message && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold"><CheckCircle2 className="inline w-4 h-4 mr-2" />{message}</div>}

          {activeTab === 'ocr' && (
            <div className="space-y-4">
              <label className="block border-2 border-dashed border-gray-300 hover:border-[#2E7D32] rounded-2xl p-8 text-center cursor-pointer">
                <input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" className="hidden" onChange={(e) => e.target.files?.[0] && acceptFile(e.target.files[0])} />
                <UploadCloud className="w-9 h-9 mx-auto text-[#2E7D32] mb-2" />
                <span className="text-sm font-bold text-[#37474F]">{file ? file.name : 'Choose your Soil Health Card / lab report'}</span>
                <p className="text-xs text-gray-500 mt-1">PDF, JPG, JPEG or PNG • maximum 10 MB</p>
              </label>
              <button type="button" disabled={!file || loading} onClick={handleOCR} className="w-full py-3 rounded-xl bg-[#2E7D32] text-white font-bold text-sm disabled:opacity-50">
                {loading ? <><Loader2 className="inline w-4 h-4 mr-2 animate-spin" />Reading with Gemini…</> : <><FileText className="inline w-4 h-4 mr-2" />Analyze with Gemini</>}
              </button>
            </div>
          )}

          {report && (
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <p className="text-xs font-bold text-gray-600 mb-3">Gemini extraction review</p>
              <p className="text-[11px] text-gray-500 mb-3">Only values detected in the uploaded report are shown. Missing values remain blank.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PARAMS.map(([key, label, unit]) => (
              <label key={key} className="block">
                <span className="block text-[11px] font-bold text-gray-600 mb-1">{label}{unit ? ` (${unit})` : ''}</span>
                <input
                  type="number"
                  step="any"
                  value={values[key] ?? ''}
                  onChange={(e) => setValue(key, e.target.value)}
                  placeholder={activeTab === 'ocr' ? 'Detected value' : 'Enter actual lab value'}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2E7D32]"
                />
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label><span className="block text-[11px] font-bold text-gray-600 mb-1">Farm Area (acres)</span><input type="number" min="0.01" step="any" value={farmArea} onChange={(e) => setFarmArea(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200" /></label>
            <label><span className="block text-[11px] font-bold text-gray-600 mb-1">Soil Type</span><input value={soilType} onChange={(e) => setSoilType(e.target.value)} placeholder="From your report or actual lab information" className="w-full px-3 py-2.5 rounded-xl border border-gray-200" /></label>
            <label><span className="block text-[11px] font-bold text-gray-600 mb-1">Location</span><input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Your farm location" className="w-full px-3 py-2.5 rounded-xl border border-gray-200" /></label>
            <label><span className="block text-[11px] font-bold text-gray-600 mb-1">Target Crop (optional)</span><input value={crop} onChange={(e) => setCrop(e.target.value)} placeholder="Actual selected crop" className="w-full px-3 py-2.5 rounded-xl border border-gray-200" /></label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100">Cancel</button>
            <button type="button" disabled={loading} onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-[#2E7D32] text-white text-sm font-bold disabled:opacity-50">
              {loading ? <><Loader2 className="inline w-4 h-4 mr-2 animate-spin" />Saving…</> : <><Save className="inline w-4 h-4 mr-2" />Save Verified Soil Data</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
