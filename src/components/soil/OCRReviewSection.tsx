import React, { useState } from 'react';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Edit3,
  Eye,
  Info,
} from 'lucide-react';
import {
  ExtractedOCRReport,
  ExtractedSoilParameter,
  SoilParameterStatus,
} from '../../types';

interface OCRReviewSectionProps {
  extractedReport: ExtractedOCRReport;
  onAccept: (
    editedParams: Record<string, number>,
    metadata: any
  ) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isFinalizing?: boolean;
}

export const OCRReviewSection: React.FC<OCRReviewSectionProps> = ({
  extractedReport,
  onAccept,
  onCancel,
  isSubmitting = false,
  isFinalizing = false,
}) => {
  const isPending = isSubmitting || isFinalizing;

  const parameters = (extractedReport?.parameters ?? {}) as Record<
  string,
  ExtractedSoilParameter | undefined
>;

  const getInitialValues = (): Record<string, number> => {
    const initial: Record<string, number> = {};

    Object.entries(parameters).forEach(([key, param]) => {
      if (
        param &&
        typeof param.value === 'number' &&
        Number.isFinite(param.value)
      ) {
        initial[key] = param.value;
      }
    });

    return initial;
  };

  const [paramValues, setParamValues] =
    useState<Record<string, number>>(getInitialValues);

  const [editedFields, setEditedFields] = useState<
    Record<string, boolean>
  >({});

  const [previewSnippet, setPreviewSnippet] = useState<string | null>(
    null
  );

  const [metadataState, setMetadataState] = useState({
    farmerName: extractedReport?.farmerName ?? '',
    sampleId: extractedReport?.sampleId ?? '',
    labName: extractedReport?.labName ?? '',
    district: extractedReport?.district ?? '',
  });

  const [showMetadataEdit, setShowMetadataEdit] = useState(false);

  // Safely handle undefined, null, and malformed ideal ranges.
  const getRangeText = (
    range: unknown,
    firstPartOnly = false
  ): string => {
    if (typeof range !== 'string' || !range.trim()) {
      return 'Range unavailable';
    }

    const normalizedRange = range.trim();

    return firstPartOnly
      ? normalizedRange.split(/\s+/)[0]
      : normalizedRange;
  };

  const getParameterStatus = (
    param: ExtractedSoilParameter,
    key: string
  ): SoilParameterStatus | 'Not tested' => {
    const hasCurrentValue =
      Object.prototype.hasOwnProperty.call(paramValues, key) &&
      Number.isFinite(paramValues[key]);

    if (!hasCurrentValue) {
      return param.value == null ? 'Not tested' : 'Needs review';
    }

    return editedFields[key] ? 'Needs review' : param.status;
  };

  const handleValueChange = (key: string, rawValue: string) => {
    const trimmed = rawValue.trim();
    const numberValue = trimmed === '' ? null : Number(trimmed);

    setParamValues((previous) => {
      const next = { ...previous };

      if (
        numberValue !== null &&
        Number.isFinite(numberValue)
      ) {
        next[key] = numberValue;
      } else {
        delete next[key];
      }

      return next;
    });

    setEditedFields((previous) => ({
      ...previous,
      [key]: true,
    }));
  };

  const handleReset = () => {
    setParamValues(getInitialValues());
    setEditedFields({});
  };

  const handleRevert = (
    key: string,
    param: ExtractedSoilParameter
  ) => {
    setParamValues((previous) => {
      const next = { ...previous };

      if (
        typeof param.value === 'number' &&
        Number.isFinite(param.value)
      ) {
        next[key] = param.value;
      } else {
        delete next[key];
      }

      return next;
    });

    setEditedFields((previous) => ({
      ...previous,
      [key]: false,
    }));
  };

  const handleConfirm = () => {
    // Do not save if a field has been cleared or is invalid.
    const hasInvalidEditedValue = Object.entries(editedFields).some(
      ([key, edited]) =>
        edited &&
        (
          !Object.prototype.hasOwnProperty.call(paramValues, key) ||
          !Number.isFinite(paramValues[key])
        )
    );

    if (hasInvalidEditedValue) {
      window.alert(
        'Please enter a valid number for each corrected field, or revert that field before saving.'
      );
      return;
    }

    onAccept(paramValues, {
      labName: metadataState.labName,
      sampleId: metadataState.sampleId,
      farmerName: metadataState.farmerName,
      district: metadataState.district,
      soilTexture: extractedReport.soilTexture,
      fileName: extractedReport.fileName,
      fileSize: extractedReport.fileSize,
      fileType: extractedReport.fileType,
      filePreviewUrl: extractedReport.filePreviewUrl,
      manualCorrections: Object.keys(editedFields).filter(
        (key) => editedFields[key]
      ),
    });
  };

  const getStatusBadge = (
    status: SoilParameterStatus | 'Not tested'
  ): string => {
    switch (status) {
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
        return 'bg-rose-50 text-rose-800 border-rose-300';
      case 'Needs review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Not tested':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const primaryKeys = [
    'nitrogen',
    'phosphorus',
    'potassium',
    'ph',
    'organicCarbon',
  ];

  const secondaryKeys = [
    'sulphur',
    'zinc',
    'iron',
    'manganese',
    'copper',
    'boron',
    'electricalConductivity',
  ];

  const editedCount = Object.values(editedFields).filter(
    Boolean
  ).length;

  const renderParameterCard = (
    key: string,
    compact: boolean
  ) => {
    const param = parameters[key];

    if (!param) {
      return null;
    }

    const currentVal = Object.prototype.hasOwnProperty.call(
      paramValues,
      key
    )
      ? paramValues[key]
      : param.value ?? '';

    const currentStatus = getParameterStatus(param, key);
    const isFieldEdited = Boolean(editedFields[key]);

    const safeName =
      typeof param.name === 'string' && param.name.trim()
        ? param.name
        : key;

    const safeSymbol =
      typeof param.symbol === 'string' ? param.symbol : '';

    const safeUnit =
      typeof param.unit === 'string' ? param.unit : '';

    const safeRawSnippet =
      typeof param.rawSnippet === 'string'
        ? param.rawSnippet
        : '';

    const cardClassName = [
      'rounded-xl',
      'border',
      'transition-all',
      compact ? 'p-3' : 'p-4 relative',
      isFieldEdited
        ? 'bg-amber-50/40 border-amber-300'
        : 'bg-gray-50/70 border-gray-200 hover:border-gray-300',
    ].join(' ');

    const headerClassName = [
      'flex',
      compact ? 'items-center' : 'items-start',
      'justify-between gap-2 mb-2',
    ].join(' ');

    const inputClassName = [
      'w-full bg-white border border-gray-300',
      'focus:border-[#2E7D32] focus:ring-2',
      'focus:ring-[#2E7D32]/20 rounded-lg',
      compact
        ? 'px-2 py-1.5 text-xs pr-9'
        : 'px-3 py-2 text-sm pr-12',
      'font-bold text-gray-800 transition-all outline-none',
    ].join(' ');

    return (
      <div key={key} className={cardClassName}>
        <div className={headerClassName}>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
              {safeSymbol}
            </span>

            {compact ? (
              <p
                className="text-[11px] font-bold text-gray-700 truncate mb-1.5"
                title={safeName}
              >
                {safeName.replace('Available ', '')}
              </p>
            ) : (
              <h4 className="text-xs font-extrabold text-[#37474F] leading-tight">
                {safeName}
              </h4>
            )}
          </div>

          <span
            className={[
              'shrink-0 text-[9px] font-black px-1.5 py-0.5',
              'rounded-full border',
              getStatusBadge(currentStatus),
            ].join(' ')}
          >
            {currentStatus}
          </span>
        </div>

        <div className="relative mt-2">
          <input
            type="number"
            step={
              [
                'ph',
                'organicCarbon',
                'electricalConductivity',
                'boron',
                'copper',
              ].includes(key)
                ? '0.01'
                : '0.1'
            }
            value={currentVal}
            onChange={(event) =>
              handleValueChange(key, event.target.value)
            }
            aria-label={`${safeName} value`}
            className={inputClassName}
          />

          {safeUnit && (
            <span
              className={[
                'absolute',
                compact
                  ? 'right-1.5 text-[10px]'
                  : 'right-2.5 text-[11px]',
                'top-1/2 -translate-y-1/2',
                'font-semibold text-gray-400 pointer-events-none',
              ].join(' ')}
            >
              {safeUnit}
            </span>
          )}
        </div>

        {param.status === 'Needs review' &&
          param.reportedValue != null && (
            <p className="mt-1 text-[10px] text-amber-800">
              Report value: {String(param.reportedValue)}{' '}
              {param.reportedUnit || '(unit not detected)'}. Confirm
              the unit before entering a normalized value.
            </p>
          )}

        {isFieldEdited && (
          <div className="flex items-center justify-between text-[10px] text-amber-700 bg-amber-100/70 rounded px-1.5 py-1 mt-1.5 font-medium">
            <span>
              Scanned:{' '}
              {param.value == null ? 'Not available' : param.value}{' '}
              {safeUnit}
            </span>

            <button
              type="button"
              onClick={() => handleRevert(key, param)}
              className="font-bold hover:underline cursor-pointer"
              title="Revert to original OCR value"
            >
              Revert
            </button>
          </div>
        )}

        <div
          className={[
            'mt-2.5 pt-2 border-t border-gray-200/70',
            'flex items-center justify-between',
            compact ? 'text-[9px]' : 'text-[10px]',
            'text-gray-500 gap-2',
          ].join(' ')}
        >
          <span className="min-w-0">
            {compact ? 'Range: ' : 'Ideal: '}
            {getRangeText(param.idealRange, compact)}
          </span>

          {safeRawSnippet ? (
            <button
              type="button"
              onClick={() =>
                setPreviewSnippet(
                  `${safeName}${
                    safeSymbol ? ` (${safeSymbol})` : ''
                  }: "${safeRawSnippet}"`
                )
              }
              title="Inspect detected OCR snippet"
              className="shrink-0 text-gray-400 hover:text-[#2E7D32] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Eye
                className={compact ? 'w-2.5 h-2.5' : 'w-3 h-3'}
              />
              <span>Source snippet</span>
            </button>
          ) : (
            compact && (
              <span>
                {param.status === 'Not tested'
                  ? 'Not in report'
                  : 'Review'}
              </span>
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      id="ocr-result-preview-section"
      className="bg-white rounded-2xl border-2 border-[#2E7D32] p-6 sm:p-8 shadow-md space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#E8F5E9]/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-extrabold uppercase tracking-wider border border-[#C8E6C9] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              OCR Result Preview &amp; Correction
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200">
              {extractedReport.averageConfidence == null
                ? 'Confidence unavailable'
                : `Confidence: ${extractedReport.averageConfidence}%`}
            </span>

            {editedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-extrabold border border-amber-200">
                {editedCount} manual correction
                {editedCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#37474F]">
            Verify Extracted Soil Values
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            OCR results from{' '}
            <span className="font-bold text-gray-800">
              {extractedReport.fileName || 'Uploaded soil report'}
            </span>
            . Review each extracted parameter and correct values if
            needed before saving your soil interpretation.
          </p>

          <p className="text-xs text-gray-600 mt-2">
            {extractedReport.extractedCount ?? 0} values could be
            normalized.{' '}
            {extractedReport.extractionStatus === 'complete'
              ? 'Core fields were found; verify every value before saving.'
              : `Extraction is ${
                  extractedReport.extractionStatus || 'partial'
                }. Missing or unrecognized core fields: ${
                  Array.isArray(extractedReport.missingFields)
                    ? extractedReport.missingFields.join(', ') ||
                      'none listed'
                    : 'not provided'
                }.`}{' '}
            Confirm the extracted values against the uploaded report.
          </p>
        </div>

        {/* Report metadata */}
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200/80 text-xs text-gray-600 shrink-0 self-start md:self-center flex flex-col gap-1 min-w-[220px]">
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-400">Sample ID:</span>
            <span className="font-mono font-bold text-gray-800">
              {metadataState.sampleId || 'Not provided'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-400">Farmer:</span>
            <span className="font-semibold text-gray-800 truncate max-w-[140px]">
              {metadataState.farmerName || 'Not provided'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-400">Lab:</span>
            <span
              className="font-semibold text-gray-800 truncate max-w-[140px]"
              title={metadataState.labName}
            >
              {metadataState.labName || 'Not provided'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowMetadataEdit((previous) => !previous)}
            className="mt-1 text-[11px] font-bold text-[#2E7D32] hover:underline flex items-center gap-1 self-end cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            {showMetadataEdit ? 'Hide Details' : 'Edit Sample Details'}
          </button>
        </div>
      </div>

      {/* Editable metadata */}
      {showMetadataEdit && (
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in duration-150 text-xs">
          {(
            [
              ['farmerName', 'Farmer Name'],
              ['sampleId', 'Sample / Card ID'],
              ['district', 'District / Location'],
              ['labName', 'Testing Laboratory'],
            ] as const
          ).map(([field, label]) => (
            <div key={field}>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">
                {label}
              </label>
              <input
                type="text"
                value={metadataState[field]}
                onChange={(event) =>
                  setMetadataState((previous) => ({
                    ...previous,
                    [field]: event.target.value,
                  }))
                }
                className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 font-medium text-gray-800 text-xs"
              />
            </div>
          ))}
        </div>
      )}

      {/* Primary parameters */}
      <div>
        <div className="flex items-center justify-between mb-3 gap-3">
          <h3 className="text-sm font-black text-[#37474F] uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
            Primary Macronutrients &amp; Vital Parameters
          </h3>
          <span className="text-[11px] text-gray-400 font-medium">
            Values are editable
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {primaryKeys.map((key) => renderParameterCard(key, false))}
        </div>
      </div>

      {/* Secondary and micronutrients */}
      <div>
        <div className="flex items-center justify-between mb-3 gap-3">
          <h3 className="text-sm font-black text-[#37474F] uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1E88E5]" />
            Micronutrients &amp; Secondary Indices (S, Zn, Fe, Mn, Cu, B, EC)
          </h3>
          <span className="text-[11px] text-gray-400 font-medium">
            Standard units depend on the report
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {secondaryKeys.map((key) => renderParameterCard(key, true))}
        </div>
      </div>

      {/* OCR source snippet */}
      {previewSnippet && (
        <div className="bg-[#E8F5E9]/80 border border-[#A5D6A7] rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-[#1B5E20] animate-in fade-in duration-150">
          <div className="flex items-center gap-2 min-w-0">
            <Info className="w-4 h-4 text-[#2E7D32] shrink-0" />
            <span className="font-mono text-[11px] break-words">
              {previewSnippet}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setPreviewSnippet(null)}
            className="shrink-0 text-[11px] font-bold underline hover:text-[#0D5302] cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {editedCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset to Original OCR
            </button>
          )}

          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="text-xs font-bold text-gray-500 hover:text-gray-800 px-3 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel / Upload Different File
          </button>
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isPending}
          id="btn-accept-ocr-values"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving reviewed measurements...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Save reviewed measurements</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};