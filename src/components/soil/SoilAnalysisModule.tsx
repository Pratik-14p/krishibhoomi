import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Edit3,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileCheck,
  Calendar,
  Layers,
  MapPin,
  TestTube,
} from 'lucide-react';
import {
  SoilAnalysisResult,
  OCRStageInfo,
  ManualSoilInput,
  SoilMetrics,
  ExtractedOCRReport,
  PipelineStageInfo,
} from '../../types';
import { soilAnalysisService } from '../../services/soilAnalysisService';
import { UploadSoilSection } from './UploadSoilSection';
import { OCRAnalysisStages } from './OCRAnalysisStages';
import { OCRReviewSection } from './OCRReviewSection';
import { ManualEntrySection } from './ManualEntrySection';
import { SoilSummarySection } from './SoilSummarySection';
import { useAuth } from '../../context/AuthContext';

interface SoilAnalysisModuleProps {
  onSoilMetricsUpdated?: (metrics: SoilMetrics) => void;
}

export const SoilAnalysisModule: React.FC<SoilAnalysisModuleProps> = ({
  onSoilMetricsUpdated,
}) => {
  const { user } = useAuth();
  // Mode: 'ocr' (Section 1) or 'manual' (Section 3)
  const [activeInputMode, setActiveInputMode] = useState<'ocr' | 'manual'>('ocr');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isFinalizing, setIsFinalizing] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<OCRStageInfo | null>(null);
  const [currentPipelineStage, setCurrentPipelineStage] = useState<PipelineStageInfo | null>(null);
  const [extractedReport, setExtractedReport] = useState<ExtractedOCRReport | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SoilAnalysisResult>(() =>
    soilAnalysisService.createEmptyAnalysisResult(user)
  );
  const [savedReports, setSavedReports] = useState<SoilAnalysisResult[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const reviewRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const cached = soilAnalysisService.getActiveAnalysis(user);
    setAnalysisResult(soilAnalysisService.createEmptyAnalysisResult(user));
    setSavedReports([]);
    soilAnalysisService.fetchHistory(user).then((reports) => {
      if (cancelled) return;
      setSavedReports(reports);
      const selectedId = soilAnalysisService.getSelectedReportId(user);
      const selected = reports.find((report) => report.id === selectedId)
        || reports.find((report) => report.id === cached.id)
        || reports[0];
      if (selected) {
        soilAnalysisService.selectAnalysis(selected, user);
        setAnalysisResult(selected);
        onSoilMetricsUpdated?.(selected.soilMetrics);
      } else {
        const empty = soilAnalysisService.createEmptyAnalysisResult(user);
        setAnalysisResult(empty);
        onSoilMetricsUpdated?.(empty.soilMetrics);
      }
    }).catch((error) => {
      if (!cancelled) {
        setAnalysisResult(soilAnalysisService.createEmptyAnalysisResult(user));
        setErrorToast(error instanceof Error ? error.message : 'Saved soil reports are unavailable.');
      }
    });
    return () => { cancelled = true; };
  }, [user?.id]);

  const handleSelectSavedReport = (reportId: string) => {
    const selected = savedReports.find((report) => report.id === reportId);
    if (!selected) return;
    try {
      soilAnalysisService.selectAnalysis(selected, user);
      setAnalysisResult(selected);
      onSoilMetricsUpdated?.(selected.soilMetrics);
      setErrorToast(null);
      setSuccessToast(`Selected soil report: ${selected.sampleName}`);
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (error) {
      setErrorToast(error instanceof Error ? error.message : 'Unable to select this soil report.');
    }
  };

  // Trigger OCR extraction pipeline on uploaded file
  const handleAnalyzeFile = async (file: File) => {
    setIsAnalyzing(true);
    setExtractedReport(null);
    setCurrentStage(null);
    setCurrentPipelineStage(null);
    setErrorToast(null);

    try {
      const extracted = await soilAnalysisService.extractReportOCR(file, (stageInfo) => {
        setCurrentPipelineStage(stageInfo);
        const stageByPipelineId: Record<PipelineStageInfo['id'], OCRStageInfo['stage']> = {
          upload_report: 'uploading',
          file_validation: 'validating',
          ocr_processing: 'reading',
          data_extraction: 'extracting',
          data_validation: 'validating',
          structured_data: 'generating',
          ai_interpretation: 'completed',
        };
        setCurrentStage({
          stage: stageByPipelineId[stageInfo.id],
          label: stageInfo.name,
          progress: stageInfo.progress,
          detail: stageInfo.description,
        });
      });

      setExtractedReport(extracted);
      setSuccessToast(extracted.extractedCount
        ? `Found ${extracted.extractedCount} normalized value(s) in "${file.name}". Review each value before saving.`
        : `No values could be safely normalized from "${file.name}". Review the report and enter verified values manually.`);
      setTimeout(() => setSuccessToast(null), 4500);

      // Scroll smoothly to the OCR Review Section
      setTimeout(() => {
        reviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 250);
    } catch (err: any) {
      setErrorToast(err.message || 'Failed to analyze soil report');
    } finally {
      setIsAnalyzing(false);
      setCurrentStage(null);
      setCurrentPipelineStage(null);
    }
  };

  // Farmer accepts and finalizes the reviewed OCR parameters
  const handleAcceptOCR = async (
    confirmedParams: Record<string, number>,
    metadata?: Partial<ExtractedOCRReport['metadata']>
  ) => {
    if (!extractedReport) return;
    setIsFinalizing(true);
    setErrorToast(null);

    try {
      const result = await soilAnalysisService.finalizeStructuredAnalysis(
        confirmedParams,
        {
          ...extractedReport,
          metadata: {
            ...extractedReport.metadata,
            ...(metadata || {}),
          },
        },
        (stageInfo) => {
          setCurrentPipelineStage(stageInfo);
        },
        user
      );

      setAnalysisResult(result);
      setSavedReports((previous) => [result, ...previous.filter((report) => report.id !== result.id)]);
      setExtractedReport(null);
      if (onSoilMetricsUpdated) {
        onSoilMetricsUpdated(result.soilMetrics);
      }

      setSuccessToast('Soil analysis generated with verified report parameters!');
      setTimeout(() => setSuccessToast(null), 4000);

      // Scroll to complete diagnosis
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 250);
    } catch (err: any) {
      setErrorToast(err.message || 'Failed to finalize soil analysis');
    } finally {
      setIsFinalizing(false);
      setCurrentPipelineStage(null);
    }
  };

  // Trigger manual data analysis
  const handleAnalyzeManual = async (input: ManualSoilInput) => {
    setIsAnalyzing(true);
    setExtractedReport(null);
    setErrorToast(null);
    try {
      const result = await soilAnalysisService.analyzeManualData(input, user);
      setAnalysisResult(result);
      setSavedReports((previous) => [result, ...previous.filter((report) => report.id !== result.id)]);
      if (onSoilMetricsUpdated) {
        onSoilMetricsUpdated(result.soilMetrics);
      }

      setSuccessToast('Manual measurements saved. Soil interpretation remains unavailable without validated local criteria.');
      setTimeout(() => setSuccessToast(null), 4000);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } catch (err: any) {
      setErrorToast(err.message || 'Failed to analyze manual input');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#2E7D32] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-[#81C784] animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#C8E6C9]" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}
      {errorToast && (
        <div role="alert" className="fixed top-20 right-6 z-50 bg-[#C62828] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-[#EF5350] animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle className="w-5 h-5 text-[#FFCDD2]" />
          <span className="text-xs font-bold">{errorToast}</span>
        </div>
      )}

      {/* Main Module Header Banner */}
      <div className="bg-white rounded-2xl border border-[#E0E0E0] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
              <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">
                Krishibhoomi Soil Intelligence & OCR Lab
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#37474F] tracking-tight">
              Soil Health Card & Optical Report Extraction
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
              Upload a laboratory report for OCR extraction and review, or manually enter measurements. Missing values remain unavailable and are not classified without validated local criteria.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1.5 bg-gray-100 rounded-2xl border border-gray-200/80 shrink-0 self-start lg:self-center">
            <button
              onClick={() => {
                setActiveInputMode('ocr');
                setExtractedReport(null);
              }}
              id="tab-mode-ocr"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeInputMode === 'ocr'
                  ? 'bg-white text-[#2E7D32] shadow-xs'
                  : 'text-gray-500 hover:text-[#37474F]'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Soil Report (OCR)</span>
            </button>
            <button
              onClick={() => {
                setActiveInputMode('manual');
                setExtractedReport(null);
              }}
              id="tab-mode-manual"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeInputMode === 'manual'
                  ? 'bg-white text-[#2E7D32] shadow-xs'
                  : 'text-gray-500 hover:text-[#37474F]'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Enter Soil Data Manually</span>
            </button>
          </div>
        </div>
      </div>

      {savedReports.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-4 shadow-2xs">
          <label htmlFor="selected-soil-report" className="block text-xs font-bold text-[#37474F] mb-2">Selected verified soil report</label>
          <select
            id="selected-soil-report"
            value={analysisResult.id}
            onChange={(event) => handleSelectSavedReport(event.target.value)}
            className="w-full max-w-xl bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            {savedReports.map((report) => (
              <option key={report.id} value={report.id}>{report.sampleName} · {report.analyzedAt || 'Date unavailable'} · {report.id}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">Crop and fertilizer requests use this report ID; switching reports refreshes dependent module inputs.</p>
        </div>
      )}

      {/* SECTION 1 or SECTION 3 based on active input mode */}
      {activeInputMode === 'ocr' ? (
        <UploadSoilSection
          onAnalyzeReport={handleAnalyzeFile}
          isAnalyzing={isAnalyzing || isFinalizing}
        />
      ) : (
        <ManualEntrySection
          onAnalyzeManual={handleAnalyzeManual}
          isAnalyzing={isAnalyzing}
        />
      )}

      {/* SECTION 2A: Pipeline Stages Indicator while OCR or finalization runs */}
      {(isAnalyzing || isFinalizing) && (
        <div ref={resultsRef}>
          <OCRAnalysisStages
            isAnalyzing={true}
            currentStage={currentStage}
            currentPipelineStage={currentPipelineStage}
            analysisResult={analysisResult}
          />
        </div>
      )}

      {/* SECTION 2B: OCR RESULT PREVIEW & MANUAL CORRECTION STEP */}
      {extractedReport && !isAnalyzing && (
        <div ref={reviewRef}>
          <OCRReviewSection
            extractedReport={extractedReport}
            onAccept={handleAcceptOCR}
            onCancel={() => setExtractedReport(null)}
            isSubmitting={isFinalizing}
          />
        </div>
      )}

      {/* SECTION 4: Final Soil Health Summary (Score, 6-tier classification, limitations, recommendations) */}
      {analysisResult && analysisResult.isUserReport && !isAnalyzing && !extractedReport && (
        <div ref={resultsRef}>
          <SoilSummarySection analysisResult={analysisResult} />
        </div>
      )}

      {analysisResult && !analysisResult.isUserReport && !isAnalyzing && !extractedReport && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center mt-6">
          <div className="w-14 h-14 bg-emerald-50 text-[#2E7D32] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#37474F]">No Soil Health Report Uploaded Yet</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mt-1 mb-2">
              Upload your soil report or enter measured values manually. Reports are saved with untested fields marked unavailable.
          </p>
          <p className="text-xs text-emerald-700 font-semibold">
            No fertility score or crop-specific classification is generated until a validated local assessment method is available.
          </p>
        </div>
      )}
    </div>
  );
};
