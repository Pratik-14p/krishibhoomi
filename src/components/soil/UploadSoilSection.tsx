import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  FileText,
  ImageIcon,
} from 'lucide-react';
import { soilAnalysisService, formatFileSize } from '../../services/soilAnalysisService';

interface UploadSoilSectionProps {
  onAnalyzeReport: (file: File) => void;
  isAnalyzing: boolean;
}

export const UploadSoilSection: React.FC<UploadSoilSectionProps> = ({
  onAnalyzeReport,
  isAnalyzing,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear preview URL on unmount/change
  const clearSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setValidationError(null);
    setUploadProgress(0);
    setIsSimulatingUpload(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processFileSelection = (file: File) => {
    setValidationError(null);
    const validation = soilAnalysisService.validateFile(file);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid file uploaded');
      return;
    }

    setSelectedFile(file);
    setIsSimulatingUpload(true);
    setUploadProgress(15);

    // Image preview creation
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png)$/i.test(file.name);
    if (isImage) {
      try {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } catch {
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
    }

    // Simulate snappy upload progress
    const timer1 = setTimeout(() => setUploadProgress(65), 180);
    const timer2 = setTimeout(() => {
      setUploadProgress(100);
      setIsSimulatingUpload(false);
    }, 450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFileSelection(e.target.files[0]);
    }
  };

  const handleAnalyzeClick = () => {
    if (!selectedFile) {
      setValidationError('Please select or upload a soil report first.');
      return;
    }
    onAnalyzeReport(selectedFile);
  };

  const isPdf = selectedFile?.type === 'application/pdf' || selectedFile?.name.endsWith('.pdf');

  return (
    <div id="section-upload-soil" className="bg-white rounded-2xl border border-[#E0E0E0] p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
            <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">
              Section 1 • Report Ingestion
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#37474F]">
            Upload Soil Health Card
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Upload your laboratory Soil Health Card or test report for instant OCR parameter extraction.
          </p>
        </div>

        {/* Supported Format Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-red-50 text-red-700 border border-red-200">
            PDF
          </span>
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            JPG
          </span>
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
            JPEG
          </span>
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            PNG
          </span>
          <span className="text-[11px] text-gray-400 font-medium ml-1">Up to 10MB</span>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <div className="flex-1">{validationError}</div>
          <button
            onClick={() => setValidationError(null)}
            className="text-xs text-red-600 underline hover:text-red-900 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Drop Zone */}
      {!selectedFile ? (
        <div
          id="soil-dropzone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
            isDragOver
              ? 'border-[#2E7D32] bg-[#F1F8E9]'
              : 'border-gray-300 hover:border-[#2E7D32] hover:bg-[#F9FBF9]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            onChange={handleFileInputChange}
            className="hidden"
            id="soil-file-input"
          />

          <div className="w-16 h-16 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] flex items-center justify-center mb-4 shadow-xs group-hover:scale-105 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h4 className="text-base sm:text-lg font-extrabold text-[#37474F] mb-1">
            Drag & Drop your Soil Report here
          </h4>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-4">
            Supports official Indian Soil Health Cards (Kisan Soil Cards), laboratory PDF test results, or smartphone photos of printed certificates.
          </p>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E7D32] text-white text-xs sm:text-sm font-bold shadow-xs hover:bg-[#1B5E20] transition-colors cursor-pointer"
          >
            Browse Files from Device
          </button>

        </div>
      ) : (
        /* Selected File Preview & Staging Card */
        <div className="border border-[#C8E6C9] bg-[#F9FBF9] rounded-2xl p-5 sm:p-6 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              {/* Preview Box */}
              {isPdf ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-red-50 border border-red-200 text-red-600 flex flex-col items-center justify-center shrink-0 shadow-2xs">
                  <FileText className="w-8 h-8" />
                  <span className="text-[10px] font-black uppercase mt-1 tracking-wider">PDF</span>
                </div>
              ) : previewUrl ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 relative group">
                  <img
                    src={previewUrl}
                    alt={selectedFile.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                    Preview
                  </div>
                </div>
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex flex-col items-center justify-center shrink-0 shadow-2xs">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-[10px] font-black uppercase mt-1 tracking-wider">IMG</span>
                </div>
              )}

              {/* File Metadata */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Validated File
                  </span>
                  <span className="text-[11px] font-semibold text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-[#37474F] truncate max-w-sm sm:max-w-md">
                  {selectedFile.name}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Ready for AI Optical Character Recognition & parameter extraction.
                </p>
              </div>
            </div>

            {/* Actions: Remove or Re-select */}
            <div className="flex items-center gap-2 sm:self-center">
              <button
                type="button"
                id="btn-remove-file"
                onClick={clearSelection}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>

          {/* Upload Progress Bar */}
          <div className="mt-4 pt-4 border-t border-gray-200/80">
            <div className="flex items-center justify-between text-xs font-bold text-gray-600 mb-1.5">
              <span>{uploadProgress < 100 ? 'Uploading file...' : 'Document uploaded & verified'}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#2E7D32] h-full rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>

          {/* Analyze Report CTA Button */}
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
              <span>Uploaded report values are extracted for your review; no unverified calibration values are substituted.</span>
            </div>

            <button
              type="button"
              id="btn-analyze-report"
              onClick={handleAnalyzeClick}
              disabled={isAnalyzing || uploadProgress < 100}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-sm font-extrabold shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
