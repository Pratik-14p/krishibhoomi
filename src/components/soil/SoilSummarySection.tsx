import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Sprout,
  PackageCheck,
  Download,
  Share2,
  Info,
  Droplets,
  Layers,
  Sparkles,
  Printer,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { SoilAnalysisResult, SoilParameterDetail } from '../../types';
import { useI18n } from '../../context/I18nContext';
import { VoiceListenButton } from '../common/VoiceListenButton';
import { GeneratePdfReportModal } from '../reports/GeneratePdfReportModal';
import {
  translateSoilParameter,
  translateNutrientLevel,
} from '../../utils/agriI18n';
import { soilUi } from '../../utils/soilUiI18n';

interface SoilSummarySectionProps {
  analysisResult: SoilAnalysisResult;
}

export const SoilSummarySection: React.FC<SoilSummarySectionProps> = ({
  analysisResult,
}) => {
  const navigate = useNavigate();
  const { language, t } = useI18n();
  const [exportToast, setExportToast] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  const {
    healthScore,
    healthRating,
    conditionSummary,
    parameters,
    fieldMetadata,
    sampleName,
    analyzedAt,
  } = analysisResult;

  // Show only measurements from the selected report; no generic target values are implied.
  const nutrientChartData = [
    {
      nutrient: 'Nitrogen (N)',
      measured: parameters.nitrogen.value,
      unit: 'kg/ha',
      status: parameters.nitrogen.status,
    },
    {
      nutrient: 'Phosphorus (P)',
      measured: parameters.phosphorus.value,
      unit: 'kg/ha',
      status: parameters.phosphorus.status,
    },
    {
      nutrient: 'Potassium (K)',
      measured: parameters.potassium.value,
      unit: 'kg/ha',
      status: parameters.potassium.status,
    },
  ];

  const handleExportPDF = () => {
    setPdfModalOpen(true);
  };

  // pH scale calculation (range 4 to 10 for percentage positioning)
  const phValue = parameters.ph.value;
  const phClamped = phValue === null ? null : Math.max(4, Math.min(10, phValue));
  const phPercentage = phClamped === null ? null : ((phClamped - 4) / 6) * 100;

  // Organic Carbon tier
  const ocValue = parameters.organicCarbon.value;

  const displayLocation = fieldMetadata.location || 'Location not provided';

  const hasMeasuredCoreValues = [
    parameters.nitrogen.value,
    parameters.phosphorus.value,
    parameters.potassium.value,
    parameters.ph.value,
    parameters.organicCarbon.value,
  ].some((value) => value !== null && Number.isFinite(value));

  if (!hasMeasuredCoreValues && healthScore === null) {
    return (
      <div id="section-soil-summary" className="bg-white rounded-2xl border border-[#E0E0E0] p-6 sm:p-8 shadow-xs">
        <h3 className="text-xl font-extrabold text-[#37474F]">Soil test data unavailable</h3>
        <p className="text-sm text-gray-600 mt-2">{conditionSummary || 'Upload a soil health card or enter lab measurements to view an assessment.'}</p>
        <p className="text-xs text-gray-500 mt-2">Nutrients and soil health are not assessed until valid measurements are available.</p>
      </div>
    );
  }

  return (
    <div id="section-soil-summary" className="space-y-6">
      {/* Toast */}
      {exportToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1B5E20] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-[#81C784] animate-in fade-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#C8E6C9]" />
          <div>
            <p className="text-xs font-bold">Soil Health Summary Prepared</p>
            <p className="text-[11px] text-[#E8F5E9]">Opening system print dialog for PDF export...</p>
          </div>
        </div>
      )}

      {/* Top Summary Banner */}
      <div className="bg-white rounded-2xl border border-[#E0E0E0] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
            <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">
              {soilUi('section4', language)}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#37474F]">
            {soilUi('soilCondition', language)}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Sample: <span className="font-semibold text-gray-700">{sampleName}</span> • Analyzed on{' '}
            <span className="font-semibold text-gray-700">{analyzedAt}</span> • Location:{' '}
            <span className="font-semibold text-gray-700">{displayLocation}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportPDF}
            id="btn-export-soil-pdf"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E0E0E0] hover:bg-gray-50 text-[#37474F] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <Printer className="w-4 h-4 text-gray-500" />
            {soilUi('printPdf', language)}
          </button>
          <button
            onClick={() => navigate('/crop-recommendation')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
          >
            <Sprout className="w-4 h-4" />
            {soilUi('cropAdvisory', language)}
          </button>
        </div>
      </div>

      {/* Soil Condition Summary Callout Card */}
      <div className="bg-gradient-to-r from-[#F1F8E9] via-white to-[#F1F8E9] rounded-2xl border-2 border-[#C8E6C9] p-6 sm:p-7 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#2E7D32] text-white text-[10px] font-black uppercase tracking-wider">
                  {soilUi('agronomicDiagnosis', language)}
                </span>
                <span className="text-xs font-bold text-gray-400">Selected report values</span>
              </div>
            </div>
            <p className="text-sm font-bold text-[#37474F] leading-relaxed">
              Soil measurements saved for {sampleName}. No validated local interpretation or fertility score is configured, so this report is displayed without agronomic classification.
            </p>
          </div>
        </div>
      </div>

      {/* SOIL HEALTH SUMMARY: Fertility Status, Major Deficiencies, Excess Nutrients, Agronomic Advisory */}
      <div className="bg-white rounded-2xl border border-[#E0E0E0] p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-black">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black text-[#37474F]">
                {soilUi('healthSummary', language)}
              </h4>
              <p className="text-xs text-gray-500">
                Measurements are shown as reported. Agronomic classifications require validated, method-specific local reference ranges.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-extrabold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
            {analysisResult.healthSummary?.fertilityStatus || 'Assessment unavailable'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Soil Fertility Status */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <Sprout className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-black text-emerald-900 uppercase tracking-wider">
                {soilUi('soilHealthScore', language)}
              </span>
            </div>
            <p className="text-sm font-black text-emerald-900">
              {analysisResult.healthSummary?.fertilityStatus || 'Assessment unavailable'}
            </p>
            <p className="text-xs text-emerald-700 mt-1">
              {healthScore === null ? 'No validated soil health score is available for this report.' : `Soil health score: ${healthScore}/100.`}
            </p>
          </div>

          {/* Major Deficiencies */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-black text-amber-900 uppercase tracking-wider">
                {soilUi('majorDeficiencies', language)}
              </span>
            </div>
            {analysisResult.healthSummary?.majorDeficiencies && analysisResult.healthSummary.majorDeficiencies.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {analysisResult.healthSummary.majorDeficiencies.map((def, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-amber-200/80 text-amber-900"
                  >
                    {typeof def === 'string' ? def : `${def.nutrient} (${def.value} ${def.unit})`}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs font-bold text-gray-700 mt-1">
                Assessment unavailable; insufficient validated interpretation criteria.
              </p>
            )}
            <p className="text-[11px] text-amber-800 mt-2">
              No fertilizer recommendation is inferred from unclassified measurements.
            </p>
          </div>

          {/* Excess Nutrients */}
          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-4 h-4 text-purple-700" />
              <span className="text-xs font-black text-purple-900 uppercase tracking-wider">
                {soilUi('excessNutrients', language)}
              </span>
            </div>
            {analysisResult.healthSummary?.excessNutrients && analysisResult.healthSummary.excessNutrients.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {analysisResult.healthSummary.excessNutrients.map((ex, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-purple-200/80 text-purple-900"
                  >
                    {typeof ex === 'string' ? ex : `${ex.nutrient} (${ex.value} ${ex.unit})`}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs font-bold text-gray-700 mt-1">
                Assessment unavailable; concentrations have not been classified.
              </p>
            )}
            <p className="text-[11px] text-purple-800 mt-2">
              No toxicity assessment is available for this report.
            </p>
          </div>
        </div>

        {/* Limitations & Recommendations List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <h5 className="text-xs font-extrabold text-[#37474F] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#2E7D32]" />
              {soilUi('management', language)}
            </h5>
            <ul className="space-y-1.5 text-xs text-gray-600">
              {(analysisResult.healthSummary?.recommendations || []).slice(0, 5).map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] mt-1.5 shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-extrabold text-[#37474F] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              {soilUi('limitations', language)}
            </h5>
            <ul className="space-y-1.5 text-xs text-gray-600">
              {(analysisResult.healthSummary?.limitations || []).slice(0, 5).map((lim, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ALL 12 SOIL PARAMETERS 6-TIER CLASSIFICATION GRID */}
      <div className="bg-white rounded-2xl border border-[#E0E0E0] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h4 className="text-base sm:text-lg font-black text-[#37474F]">
              {soilUi('matrix', language)}
            </h4>
            <p className="text-xs text-gray-500">
              Measured fields are shown with their report values. Missing or unclassified measurements remain unavailable.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800">{soilUi('veryLow', language)}</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">{soilUi('low', language)}</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">{soilUi('medium', language)}</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">{soilUi('adequate', language)}</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">{soilUi('high', language)}</span>
            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">{soilUi('veryHigh', language)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.entries(parameters) as [string, SoilParameterDetail | undefined][]).map(([key, param]) => {
            if (!param) return null;
            const statusStyle = (() => {
              switch (param.status) {
                case 'Very Low':
                  return 'bg-red-50 text-red-700 border-red-200';
                case 'Low':
                  return 'bg-amber-50 text-amber-700 border-amber-200';
                case 'Medium':
                  return 'bg-blue-50 text-blue-700 border-blue-200';
                case 'Adequate':
                case 'Good':
                  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
                case 'High':
                  return 'bg-purple-50 text-purple-700 border-purple-200';
                case 'Very High':
                  return 'bg-rose-50 text-rose-700 border-rose-200';
                default:
                  return 'bg-gray-100 text-gray-700 border-gray-200';
              }
            })();

            return (
              <div
                key={key}
                className="p-4 rounded-xl border border-gray-200/90 bg-gray-50/50 hover:bg-white hover:border-[#2E7D32] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-[#37474F]">{translateSoilParameter(param.name, language)}</span>
                        {param.symbol && (
                          <span className="text-[10px] font-bold text-gray-400">({param.symbol})</span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{param.description}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider shrink-0 ${statusStyle}`}>
                      {translateNutrientLevel(param.status, language)}
                    </span>
                  </div>

                  <div className="my-2.5 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#37474F]">{param.value ?? 'Not available in report'}</span>
                    <span className="text-xs font-bold text-gray-500">{param.unit || ''}</span>
                    <span className="text-[10px] text-gray-400 ml-auto">Assessment: {param.idealRange}</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-gray-100 text-[11px] text-gray-600 leading-snug">
                  <span className="font-semibold text-[#2E7D32]">{t('pesticide.advisory') + ': '}</span>
                  {param.recommendation}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Health Score + Nutrient Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Soil Health Score Card */}
        <div
          id="soil-health-score-card"
          className="bg-white rounded-2xl border border-[#E0E0E0] p-6 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {soilUi('soilHealthScore', language)}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold border bg-gray-50 text-gray-600 border-gray-200">
                {healthScore === null ? 'Assessment unavailable' : healthRating}
              </span>
            </div>

            {/* Circular Metric Display */}
            {healthScore !== null ? <div className="my-4 text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="#E0E0E0"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="#2E7D32"
                    strokeWidth="10"
                    strokeDasharray={364}
                    strokeDashoffset={364 - (364 * healthScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-black text-[#37474F] tracking-tight">
                    {healthScore}
                  </span>
                  <span className="text-[11px] font-extrabold text-gray-400 uppercase">out of 100</span>
                </div>
              </div>
            </div> : <p className="my-10 text-center text-sm font-semibold text-gray-500">Assessment unavailable</p>}

            <p className="text-xs text-gray-500 text-center mb-4">
              A score is shown only when produced by a validated assessment method.
            </p>
          </div>

          <p className="pt-4 border-t border-gray-100 text-xs text-gray-500">Microbial capacity is not measured by standard chemical soil tests.</p>
        </div>

        {/* Nutrient Chart (Recharts) */}
        <div
          id="soil-nutrient-chart"
          className="lg:col-span-2 min-w-0 overflow-hidden bg-white rounded-2xl border border-[#E0E0E0] p-6 shadow-xs flex flex-col justify-between"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h4 className="text-base font-extrabold text-[#37474F]">
                {soilUi('nutrientChart', language)}
              </h4>
              <p className="text-xs text-gray-500">
                Measured N, P and K values from the selected report (kg/ha).
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#2E7D32]" />
                <span className="text-gray-600">{soilUi('measured', language)}</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full min-w-0 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={nutrientChartData}
                margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEEEEE" />
                <XAxis
                  dataKey="nutrient"
                  tick={{ fontSize: 12, fill: '#37474F', fontWeight: 600 }}
                  axisLine={{ stroke: '#E0E0E0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#78909C' }}
                  axisLine={{ stroke: '#E0E0E0' }}
                  tickLine={false}
                  unit=" kg"
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `${value} kg/ha`,
                    'Lab measured',
                  ]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#C8E6C9',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                />
                <Bar
                  dataKey="measured"
                  name="measured"
                  fill="#2E7D32"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={45}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>No fertilizer quantity is inferred from unclassified soil measurements.</span>
            <button
              onClick={() => navigate('/dashboard?tab=fertilizer')}
              className="text-[#2E7D32] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              View Fertilizer Plan
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid: pH Indicator + Organic Carbon Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* pH Indicator */}
        <div id="soil-ph-indicator" className="bg-white rounded-2xl border border-[#E0E0E0] p-6 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#2E7D32] flex items-center justify-center font-black text-xs">
                pH
              </div>
              <h4 className="text-base font-extrabold text-[#37474F]">{soilUi('phIndicator', language)}</h4>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-gray-50 text-gray-600 border border-gray-200">
              {phValue === null ? 'Not available in report' : 'Measured'}
            </span>
          </div>

          <div className="flex items-baseline gap-2 my-2">
            <span className="text-3xl font-black text-[#37474F]">{phValue ?? 'Unavailable'}</span>
            {phValue !== null && <span className="text-xs text-gray-400 font-semibold">pH</span>}
          </div>

          {/* Visual Chromatic Scale */}
          {phValue !== null && phPercentage !== null && <div className="relative my-5 pt-6">
            {/* Needle indicator */}
            <div
              className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center transition-all duration-700"
              style={{ left: `${Math.max(4, Math.min(96, phPercentage))}%` }}
            >
              <span className="px-2 py-0.5 bg-[#2E7D32] text-white text-[10px] font-black rounded-md shadow-sm whitespace-nowrap">
                {phValue}
              </span>
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-[#2E7D32]" />
            </div>

            {/* Gradient Bar */}
            <div className="h-3 rounded-full overflow-hidden bg-gradient-to-r from-red-500 via-amber-400 via-emerald-500 to-blue-600 shadow-inner" />

            {/* Labels */}
            <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2">
              <span>Acidic (&lt; 6.0)</span>
              <span className="text-[#2E7D32] font-black">Neutral (6.5 – 7.5)</span>
              <span>Alkaline (&gt; 7.5)</span>
            </div>
          </div>}

          <p className="text-xs text-gray-500 leading-relaxed">
            {phValue === null
              ? 'pH was not available in this report. No pH-based recommendation is provided.'
              : 'This is the value recorded in the selected report. Crop-specific interpretation requires validated local reference criteria.'}
          </p>
        </div>

        {/* Organic Carbon Indicator */}
        <div id="soil-oc-indicator" className="bg-white rounded-2xl border border-[#E0E0E0] p-6 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-xs">
                OC
              </div>
              <h4 className="text-base font-extrabold text-[#37474F]">{soilUi('organicCarbon', language)}</h4>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold border bg-gray-50 text-gray-600 border-gray-200">
              {ocValue === null ? 'Not available in report' : 'Measured; not classified'}
            </span>
          </div>

          <div className="flex items-baseline gap-2 my-2">
            <span className="text-3xl font-black text-[#37474F]">{ocValue === null ? 'Unavailable' : `${ocValue}%`}</span>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed">
            {ocValue === null ? 'Organic carbon was not available in this report.' : 'This is the value recorded in the selected report. Microbial capacity and crop-specific interpretation are not inferred from this value alone.'}
          </p>
        </div>
      </div>

      {/* Recommended Crop Rotations Card */}
      <div className="bg-white rounded-2xl border border-[#E0E0E0] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h4 className="text-base font-extrabold text-[#37474F]">
              {soilUi('agroMatrix', language)}
            </h4>
            <p className="text-xs text-gray-500">
              Soil measurements for this report: {fieldMetadata.soilType || 'soil type not provided'}, pH {phValue ?? 'not available'}, N {parameters.nitrogen.value ?? 'not available'} kg/ha.
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard?tab=crop-recommendation')}
            className="text-xs font-bold text-[#2E7D32] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            View Full Recommendations
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-sm text-gray-600">
          Crop-specific suitability rankings are unavailable because this project has no validated crop reference dataset or scoring method. No rankings or match scores are shown.
        </div>
      </div>

      <GeneratePdfReportModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
      />
    </div>
  );
};
