import React from 'react';
import {
  CheckCircle2,
  Clock,
  Loader2,
  Sparkles,
  Layers,
  FlaskConical,
  TestTube,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { SoilAnalysisResult, OCRStageInfo, SoilParameterStatus, PipelineStageInfo } from '../../types';
import { SOIL_PIPELINE_STAGES } from '../../services/soilAnalysisService';

interface OCRAnalysisStagesProps {
  isAnalyzing: boolean;
  currentStage?: OCRStageInfo | null;
  currentPipelineStage?: PipelineStageInfo | null;
  analysisResult: SoilAnalysisResult | null;
}

export const OCRAnalysisStages: React.FC<OCRAnalysisStagesProps> = ({
  isAnalyzing,
  currentStage,
  currentPipelineStage,
  analysisResult,
}) => {
  // Helper to resolve status colors
  const getStatusBadgeStyle = (status: SoilParameterStatus) => {
    switch (status) {
      case 'Very Low':
        return {
          badge: 'bg-red-50 text-red-700 border-red-200',
          bar: 'bg-red-500',
          indicator: 'bg-red-500',
          label: 'Very Low',
        };
      case 'Low':
        return {
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          bar: 'bg-amber-500',
          indicator: 'bg-amber-500',
          label: 'Low',
        };
      case 'Medium':
        return {
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          bar: 'bg-blue-500',
          indicator: 'bg-blue-500',
          label: 'Medium',
        };
      case 'Adequate':
      case 'Good':
        return {
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          bar: 'bg-emerald-600',
          indicator: 'bg-emerald-600',
          label: 'Adequate',
        };
      case 'High':
        return {
          badge: 'bg-purple-50 text-purple-700 border-purple-200',
          bar: 'bg-purple-600',
          indicator: 'bg-purple-600',
          label: 'High',
        };
      case 'Very High':
        return {
          badge: 'bg-rose-50 text-rose-700 border-rose-300',
          bar: 'bg-rose-600',
          indicator: 'bg-rose-600',
          label: 'Very High',
        };
      default:
        return {
          badge: 'bg-gray-100 text-gray-700 border-gray-200',
          bar: 'bg-gray-400',
          indicator: 'bg-gray-400',
          label: status,
        };
    }
  };

  // If analyzing, render the animated 7-stage loading indicator
  if (isAnalyzing) {
    const currentProgress = currentPipelineStage?.progress ?? currentStage?.progress ?? 20;
    const activeStageId = currentPipelineStage?.id || currentStage?.stage || 'upload_report';

    const stageIndex = SOIL_PIPELINE_STAGES.findIndex(
      (s) => s.id === activeStageId || s.name.toLowerCase().includes(activeStageId)
    );
    const resolvedIndex = stageIndex >= 0 ? stageIndex : 0;

    return (
      <div
        id="ocr-stages-loading"
        className="bg-white rounded-2xl border border-[#C8E6C9] p-6 sm:p-8 shadow-xs relative overflow-hidden"
      >
        {/* Subtle background pulse accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8F5E9]/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex items-center justify-between gap-4 mb-6 relative">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#2E7D32] animate-spin" />
              <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">
                Soil Report Pipeline • OCR, Review and Persistence
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#37474F]">
              Executing Soil Report Analysis...
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Values are extracted for farmer review. Agronomic interpretation is shown only when validated criteria are available.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-2xl font-black text-[#2E7D32]">{currentProgress}%</span>
            <p className="text-[11px] font-semibold text-gray-400">Step {resolvedIndex + 1} of 7</p>
          </div>
        </div>

        {/* Global Progress Line */}
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-8">
          <div
            className="bg-gradient-to-r from-[#2E7D32] to-[#43A047] h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${currentProgress}%` }}
          />
        </div>

        {/* 7-Stage Stepper View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SOIL_PIPELINE_STAGES.map((step, idx) => {
            const isDone = resolvedIndex > idx;
            const isCurrent = resolvedIndex === idx;

            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  isCurrent
                    ? 'bg-[#F1F8E9] border-[#2E7D32] shadow-2xs md:col-span-2'
                    : isDone
                    ? 'bg-white border-[#E0E0E0] opacity-90'
                    : 'bg-gray-50/60 border-gray-200/60 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Step Icon */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                      isDone
                        ? 'bg-[#2E7D32] text-white'
                        : isCurrent
                        ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>

                  {/* Stage Label & Details */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-xs sm:text-sm font-extrabold ${
                          isCurrent ? 'text-[#2E7D32]' : isDone ? 'text-[#37474F]' : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#2E7D32] text-white animate-pulse">
                          Running
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{step.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[11px] font-bold ${
                      isDone ? 'text-[#2E7D32]' : isCurrent ? 'text-[#2E7D32]' : 'text-gray-400'
                    }`}
                  >
                    {isDone ? 'Completed' : isCurrent ? 'In Progress' : 'Queued'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // If no analysis result yet, show placeholder state
  if (!analysisResult) {
    return (
      <div className="bg-white rounded-2xl border border-[#E0E0E0] p-8 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
          <TestTube className="w-6 h-6" />
        </div>
        <h4 className="text-base font-extrabold text-[#37474F]">Awaiting Soil Report</h4>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
          Upload a soil card above or enter test parameters manually to generate OCR extraction cards and agronomic diagnostics.
        </p>
      </div>
    );
  }

  const { parameters } = analysisResult;
  const paramList = [
    parameters.nitrogen,
    parameters.phosphorus,
    parameters.potassium,
    parameters.ph,
    parameters.organicCarbon,
  ];

  return (
    <div id="section-ocr-results" className="space-y-4">
      {/* Header Info Banner */}
      <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
            <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">
              Section 2 • Extracted Soil Parameters
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-[#37474F]">
            Lab Test Measurements (OCR Parsed)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Verified across 5 essential macronutrient and electrochemical indicators.
          </p>
        </div>

        {/* Legend for Low, Medium, Good, High */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] font-bold">
          <span className="text-gray-400 text-[10px] uppercase mr-1">Status Legend:</span>
          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
            Low
          </span>
          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            Medium
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            Good
          </span>
          <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
            High
          </span>
        </div>
      </div>

      {/* 5 Parameter Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {paramList.map((param) => {
          const style = getStatusBadgeStyle(param.status);

          return (
            <div
              key={param.symbol}
              id={`soil-param-card-${param.symbol.toLowerCase()}`}
              className="bg-white rounded-2xl border border-[#E0E0E0] p-5 shadow-xs hover:border-[#2E7D32]/60 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Chemical Symbol + Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] font-black text-xs flex items-center justify-center">
                    {param.symbol}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${style.badge}`}
                  >
                    {style.label}
                  </span>
                </div>

                {/* Parameter Title */}
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  {param.name}
                </span>

                {/* Big Measured Value */}
                <div className="flex items-baseline gap-1 mt-1 mb-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#37474F] tracking-tight">
                    {param.value ?? param.status}
                  </span>
                  {param.unit && (
                    <span className="text-xs font-bold text-gray-400">{param.unit}</span>
                  )}
                </div>

                {/* Progress Bar */}
                {param.percentage !== null && (
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
                      <span>Relative Index</span>
                      <span>{param.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
                        style={{ width: `${Math.min(100, Math.max(8, param.percentage))}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Ideal Benchmark */}
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Ideal Range
                  </span>
                  <span className="text-xs font-extrabold text-[#37474F] mt-0.5 block">
                    {param.idealRange}
                  </span>
                </div>
              </div>

              {/* Agronomic recommendation snippet */}
              <p className="text-[11px] text-gray-500 line-clamp-3 leading-relaxed pt-2 border-t border-gray-100">
                {param.recommendation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
