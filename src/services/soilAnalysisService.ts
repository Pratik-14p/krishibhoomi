import {
  SoilAnalysisResult,
  OCRStageInfo,
  ManualSoilInput,
  SoilMetrics,
  PipelineStageInfo,
  ExtractedOCRReport,
  SoilHealthSummary,
  SoilParameterDetail,
  SoilParameterStatus,
  User,
} from '../types';
import { api } from './api';
import { mysqlService } from './mysqlService';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const STORAGE_KEY_ANALYSIS = 'krishibhoomi_active_soil_analysis';
const STORAGE_KEY_HISTORY = 'krishibhoomi_soil_analysis_history';
const STORAGE_KEY_SELECTED_REPORT = 'krishibhoomi_selected_soil_report_v1';

function isExtractedOCRReport(value: unknown): value is ExtractedOCRReport {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const report = value as Record<string, unknown>;
  if (typeof report.reportId !== 'string' || typeof report.fileName !== 'string' || typeof report.fileType !== 'string' || typeof report.fileSize !== 'string') return false;
  if (typeof report.uploadId !== 'string' || !report.parameters || typeof report.parameters !== 'object' || Array.isArray(report.parameters)) return false;
  const parameters = report.parameters as Record<string, unknown>;
  const keys = ['nitrogen', 'phosphorus', 'potassium', 'ph', 'organicCarbon', 'sulphur', 'zinc', 'iron', 'manganese', 'copper', 'boron', 'electricalConductivity'];
  if (!keys.every((key) => {
    const parameter = parameters[key];
    if (!parameter || typeof parameter !== 'object' || Array.isArray(parameter)) return false;
    const entry = parameter as Record<string, unknown>;
    return typeof entry.name === 'string' && typeof entry.symbol === 'string' && typeof entry.unit === 'string'
      && (entry.value === null || (typeof entry.value === 'number' && Number.isFinite(entry.value) && entry.value >= 0))
      && (typeof entry.status === 'string')
      && (entry.reportedUnit === undefined || entry.reportedUnit === null || typeof entry.reportedUnit === 'string');
  })) return false;
  return report.averageConfidence === null
    || (typeof report.averageConfidence === 'number' && Number.isFinite(report.averageConfidence) && report.averageConfidence >= 0 && report.averageConfidence <= 100);
}

/**
 * 7-stage soil report pipeline. OCR values require farmer review; interpretation
 * remains unavailable until a validated local agronomic method is configured.
 */
export const SOIL_PIPELINE_STAGES: PipelineStageInfo[] = [
  {
    id: 'upload_report',
    stepNumber: 1,
    name: 'Upload Soil Report',
    label: 'Upload Soil Report',
    description: 'Receiving laboratory Soil Health Card document (PDF, JPG, JPEG, PNG)...',
    status: 'pending',
    progress: 15,
  },
  {
    id: 'file_validation',
    stepNumber: 2,
    name: 'File Validation',
    label: 'File Validation',
    description: 'Verifying document integrity, MIME type, and raster resolution...',
    status: 'pending',
    progress: 30,
  },
  {
    id: 'ocr_processing',
    stepNumber: 3,
    name: 'OCR',
    label: 'Optical Character Recognition (OCR)',
    description: 'Scanning textual glyphs, lab tables, stamps, and testing methodology units...',
    status: 'pending',
    progress: 50,
  },
  {
    id: 'data_extraction',
    stepNumber: 4,
    name: 'Data Extraction',
    label: 'Data Extraction',
    description: 'Extracting N, P, K, pH, OC, Sulphur, Zinc, Iron, Mn, Cu, Boron & EC...',
    status: 'pending',
    progress: 75,
  },
  {
    id: 'data_validation',
    stepNumber: 5,
    name: 'Data Validation',
    label: 'Data Validation',
    description: 'Validating agronomic bounds, confidence scores, and preparing review preview...',
    status: 'pending',
    progress: 90,
  },
  {
    id: 'structured_data',
    stepNumber: 6,
    name: 'Structured Soil Data',
    label: 'Structured Soil Data',
    description: 'Standardizing accepted values into structured agricultural schemas...',
    status: 'pending',
    progress: 95,
  },
  {
    id: 'ai_interpretation',
    stepNumber: 7,
    name: 'Save Reviewed Values',
    label: 'Save Reviewed Values',
    description: 'Persisting confirmed measurements and displaying assessment availability...',
    status: 'pending',
    progress: 100,
  },
];

/** No locally validated interpretation thresholds are configured. */
export function evaluateNutrientStatus6Tier(_nutrient: string, value: number | null): SoilParameterStatus {
  return value === null || !Number.isFinite(value) ? 'Not tested' : 'Not assessed';
}

/**
 * Converts a browser File into base64 string
 */
function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve((reader.result as string) || '');
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Formats a file size in human-readable units
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

class SoilAnalysisService {
  /**
   * Validates file format and size
   */
  public validateFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'Please select a soil health card file to upload.' };
    }

    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    const isExtensionValid =
      fileName.endsWith('.pdf') ||
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png');

    const isMimeValid = ALLOWED_MIME_TYPES.includes(fileType);

    if (!isMimeValid && !isExtensionValid) {
      return {
        valid: false,
        error:
          'Unsupported file format. Please upload a PDF, JPG, JPEG, or PNG soil health card.',
      };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: `File size (${formatFileSize(file.size)}) exceeds the maximum 10MB limit.`,
      };
    }

    return { valid: true };
  }

  /**
   * Pipeline Step 1-5:
   * Upload -> File Validation -> OCR -> Data Extraction -> Data Validation
   * Returns ExtractedOCRReport for interactive farmer review.
   */
  public async extractReportOCR(
    file: File,
    onStageUpdate?: (info: PipelineStageInfo) => void
  ): Promise<ExtractedOCRReport> {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid file uploaded');
    }

    const stages = [...SOIL_PIPELINE_STAGES];

    // Stage 1: Upload Soil Report
    if (onStageUpdate) {
      onStageUpdate({ ...stages[0], status: 'processing' });
    }
    const fileBase64 = await readFileAsBase64(file);
    if (onStageUpdate) {
      onStageUpdate({ ...stages[0], status: 'completed' });
    }

    // Stage 2: File Validation
    if (onStageUpdate) {
      onStageUpdate({ ...stages[1], status: 'processing' });
    }
    await new Promise((r) => setTimeout(r, 220));
    if (onStageUpdate) {
      onStageUpdate({ ...stages[1], status: 'completed' });
    }

    // Stage 3: OCR
    if (onStageUpdate) {
      onStageUpdate({ ...stages[2], status: 'processing' });
    }

    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png)$/i.test(file.name);
    let previewUrl: string | undefined = undefined;
    if (isImage) {
      try {
        previewUrl = URL.createObjectURL(file);
      } catch {
        previewUrl = undefined;
      }
    }

    // Call backend API /api/soil/upload with base64 payload
    let ocrResponse: any = null;
    try {
      ocrResponse = await api.post('/soil/upload', {
        fileName: file.name,
        fileType: file.type || (/\.pdf$/i.test(file.name) ? 'application/pdf' : /\.png$/i.test(file.name) ? 'image/png' : 'image/jpeg'),
        fileSize: formatFileSize(file.size),
        fileBase64,
      });
    } catch (err: any) {
      console.error('[soilAnalysisService] OCR backend error:', err);
      throw new Error(err?.message || 'Soil report OCR failed. No sample/demo values were used.');
    }

    if (onStageUpdate) {
      onStageUpdate({ ...stages[2], status: 'completed' });
    }

    // Stage 4: Data Extraction
    if (onStageUpdate) {
      onStageUpdate({ ...stages[3], status: 'processing' });
    }
    await new Promise((r) => setTimeout(r, 250));
    if (onStageUpdate) {
      onStageUpdate({ ...stages[3], status: 'completed' });
    }

    // Stage 5: Data Validation
    if (onStageUpdate) {
      onStageUpdate({ ...stages[4], status: 'processing' });
    }
    await new Promise((r) => setTimeout(r, 200));
    if (onStageUpdate) {
      onStageUpdate({ ...stages[4], status: 'completed' });
    }

    // If backend returned extracted report
    const extractedData: unknown = ocrResponse?.data?.extractedReport || (ocrResponse?.data?.parameters ? ocrResponse.data : null);
    if (isExtractedOCRReport(extractedData)) {
      const rep = extractedData;
      if (previewUrl && !rep.filePreviewUrl) {
        rep.filePreviewUrl = previewUrl;
      }
      return rep;
    }

    // Do not manufacture a local/sample soil profile when OCR fails.
    // The backend is the source of truth for uploaded report values.
    throw new Error('The uploaded soil report could not be extracted reliably. Please upload a clear PDF/image and try again.');
  }

  /**
   * Pipeline Step 6 & 7: save confirmed structured measurements and report status.
   * Finalizes the reviewed parameters and creates full SoilAnalysisResult
   */
  public async finalizeStructuredAnalysis(
    editedParams: Record<string, number | null | undefined>,
    metadata: any = {},
    onStageUpdate?: (info: PipelineStageInfo) => void,
    user?: User | null
  ): Promise<SoilAnalysisResult> {
    const stages = [...SOIL_PIPELINE_STAGES];
    if (onStageUpdate) onStageUpdate({ ...stages[5], status: 'completed' });
    if (onStageUpdate) onStageUpdate({ ...stages[6], status: 'processing' });
    const source: 'manual' | 'ocr' = metadata?.source === 'manual' ? 'manual' : 'ocr';
    const numeric = (key: string): number | null => {
      const raw: unknown = editedParams[key];
      if (raw === null || raw === undefined || raw === '') return null;
      const value = typeof raw === 'number' ? raw : Number(raw);
      return Number.isFinite(value) && value >= 0 ? value : null;
    };
    const values = {
      nitrogen: numeric('nitrogen'), phosphorus: numeric('phosphorus'), potassium: numeric('potassium'),
      ph: numeric('ph'), organicCarbon: numeric('organicCarbon'), sulphur: numeric('sulphur'),
      zinc: numeric('zinc'), iron: numeric('iron'), manganese: numeric('manganese'),
      copper: numeric('copper'), boron: numeric('boron'), electricalConductivity: numeric('electricalConductivity'),
    };
    let backendResult: any;
    try {
      backendResult = await api.post('/soil/analyze', {
        parameters: values,
        metadata: {
          ...metadata, userId: user?.id, userEmail: user?.email,
          farmArea: user?.farmArea, location: user?.location, soilType: user?.soilType,
          preferredCrop: user?.preferredCrop,
        },
        source,
        language: localStorage.getItem('krishibhoomi_language_v1') || 'en',
      });
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : 'Soil report could not be saved.');
    }
    const analysisId = backendResult?.data?.analysisId;
    if (typeof analysisId !== 'string' || !analysisId) {
      throw new Error('The soil service did not confirm that this report was saved.');
    }
    if (onStageUpdate) onStageUpdate({ ...stages[6], status: 'completed' });

    const detail = (name: string, symbol: string, unit: string, value: number | null): SoilParameterDetail => ({
      name, symbol, value, unit, status: value === null ? 'Not tested' : 'Not assessed',
      idealRange: 'Not assessed; no applicable local threshold configured', percentage: null,
      description: value === null ? 'Not available in report.' : 'Value confirmed from the selected soil report.',
      recommendation: '',
    });
    const missing = Object.entries({ N: values.nitrogen, P: values.phosphorus, K: values.potassium, pH: values.ph, OC: values.organicCarbon })
      .filter(([, value]) => value === null).map(([name]) => name);
    const healthSummary: SoilHealthSummary = {
      fertilityStatus: 'Assessment unavailable; no validated local interpretation method is configured.',
      fertilityScore: null, majorDeficiencies: [], excessNutrients: [],
      limitations: ['A validated, method-specific local reference is needed to classify measurements.'],
    };
    const sampleName = metadata?.sampleId ? `Soil Health Card #${metadata.sampleId}` : `Soil Health Card - ${metadata?.fileName || 'Report'}`;
    const result: SoilAnalysisResult = {
      id: analysisId, sampleName, source, isUserReport: true, userId: user?.id, userEmail: user?.email,
      fileName: metadata?.fileName, fileType: metadata?.fileType, fileSize: metadata?.fileSize,
      filePreviewUrl: metadata?.filePreviewUrl,
      analyzedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      healthScore: null, healthRating: 'Not assessed',
      conditionSummary: missing.length ? `Report saved. Not available: ${missing.join(', ')}. Soil interpretation is unavailable.` : 'Measurements saved; soil interpretation is unavailable without validated local criteria.',
      healthSummary,
      parameters: {
        nitrogen: detail('Nitrogen', 'N', 'kg/ha', values.nitrogen),
        phosphorus: detail('Phosphorus', 'P', 'kg/ha', values.phosphorus),
        potassium: detail('Potassium', 'K', 'kg/ha', values.potassium),
        ph: detail('Soil pH', 'pH', '', values.ph),
        organicCarbon: detail('Organic Carbon', 'OC', '%', values.organicCarbon),
        sulphur: detail('Sulphur', 'S', 'ppm', values.sulphur),
        zinc: detail('Zinc', 'Zn', 'ppm', values.zinc),
        iron: detail('Iron', 'Fe', 'ppm', values.iron),
        manganese: detail('Manganese', 'Mn', 'ppm', values.manganese),
        copper: detail('Copper', 'Cu', 'ppm', values.copper),
        boron: detail('Boron', 'B', 'ppm', values.boron),
        electricalConductivity: detail('Electrical Conductivity', 'EC', 'dS/m', values.electricalConductivity),
      },
      fieldMetadata: {
        soilType: metadata?.soilTexture || user?.soilType || '', farmArea: Number(user?.farmArea) || 0,
        previousCrop: user?.preferredCrop || metadata?.previousCrop || '', season: metadata?.season || '',
        location: metadata?.district || metadata?.location || user?.location || '',
      },
      micronutrients: {
        zinc: values.zinc === null ? 'Not available in report' : `${values.zinc} ppm`,
        iron: values.iron === null ? 'Not available in report' : `${values.iron} ppm`,
        copper: values.copper === null ? 'Not available in report' : `${values.copper} ppm`,
        boron: values.boron === null ? 'Not available in report' : `${values.boron} ppm`,
        manganese: values.manganese === null ? 'Not available in report' : `${values.manganese} ppm`,
        sulphur: values.sulphur === null ? 'Not available in report' : `${values.sulphur} ppm`,
      },
      soilMetrics: {
        id: analysisId, sampleName, testDate: new Date().toISOString(), soilType: metadata?.soilTexture || user?.soilType || '',
        ph: values.ph, nitrogen: values.nitrogen, nitrogenStatus: values.nitrogen === null ? 'Not tested' : 'Not assessed',
        phosphorus: values.phosphorus, phosphorusStatus: values.phosphorus === null ? 'Not tested' : 'Not assessed',
        potassium: values.potassium, potassiumStatus: values.potassium === null ? 'Not tested' : 'Not assessed',
        organicCarbon: values.organicCarbon, electricalConductivity: values.electricalConductivity,
        sulphur: values.sulphur, zinc: values.zinc, iron: values.iron, manganese: values.manganese, copper: values.copper, boron: values.boron,
        micronutrients: {
          zinc: values.zinc === null ? 'Not available in report' : `${values.zinc} ppm`,
          iron: values.iron === null ? 'Not available in report' : `${values.iron} ppm`,
          copper: values.copper === null ? 'Not available in report' : `${values.copper} ppm`,
          boron: values.boron === null ? 'Not available in report' : `${values.boron} ppm`,
        },
        overallHealthScore: null, notes: healthSummary.fertilityStatus,
      },
    };
    this.saveAnalysis(result, user?.id);
    return result;
  }

  /**
   * Direct full OCR Analysis (extracts and finalizes automatically)
   */
  public async analyzeReport(
    file: File,
    onStageUpdate?: (info: any) => void
  ): Promise<SoilAnalysisResult> {
    const extracted = await this.extractReportOCR(file, onStageUpdate);
    const paramValues: Record<string, number> = {};
    Object.entries(extracted.parameters).forEach(([k, p]) => {
      if (p) paramValues[k] = p.value;
    });
    return this.finalizeStructuredAnalysis(paramValues, extracted, onStageUpdate);
  }

  /**
   * Analyzes manual soil parameter entry via live backend API
   */
  public async analyzeManualData(input: ManualSoilInput, user?: User | null): Promise<SoilAnalysisResult> {
    return this.finalizeStructuredAnalysis({
      nitrogen: input.nitrogen, phosphorus: input.phosphorus, potassium: input.potassium,
      ph: input.ph, organicCarbon: input.organicCarbon, sulphur: input.sulphur,
      zinc: input.zinc, iron: input.iron, manganese: input.manganese, copper: input.copper,
      boron: input.boron, electricalConductivity: input.electricalConductivity,
    }, { source: 'manual', sampleId: `${input.location} (${input.soilType})`, soilTexture: input.soilType, season: input.season, location: input.location }, undefined, user);
  }

  /**
   * Persists analysis result into localStorage & active database backend, scoped to user
   */
  public saveAnalysis(result: SoilAnalysisResult, userId?: string): void {
    try {
      result.isUserReport = true;
      let effectiveUserId = userId;
      if (!effectiveUserId && typeof localStorage !== 'undefined') {
        try {
          const userRaw = localStorage.getItem('krishibhoomi_active_user');
          if (userRaw) {
            const u = JSON.parse(userRaw);
            effectiveUserId = u?.id;
          }
        } catch {}
      }

      localStorage.setItem(STORAGE_KEY_ANALYSIS, JSON.stringify(result));
      if (effectiveUserId) {
        localStorage.setItem(`${STORAGE_KEY_ANALYSIS}_${effectiveUserId}`, JSON.stringify(result));
        localStorage.setItem(`${STORAGE_KEY_SELECTED_REPORT}_${effectiveUserId}`, result.id);
      }
      const history = this.getHistory();
      const filtered = history.filter((h) => h.id !== result.id);
      const updated = [result, ...filtered].slice(0, 8);
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));

      // Broadcast update event for reactive cross-module synchronization
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('krishibhoomi_soil_updated', { detail: result }));
      }
    } catch {
      // Ignore storage errors in restricted iframes
    }

    // Save to active database backend table
    mysqlService.saveSoilAnalysis(result).catch((err) => {
      console.warn('[soilAnalysisService] Aiven database sync background notice:', err);
    });
  }

  /**
   * Checks if the active user has actually uploaded or entered a verified soil report.
   * For newly registered accounts without an upload, returns false.
   */
  public hasUserUploadedSoil(user?: User | null): boolean {
    if (!user) return false;

    try {
      // Check user-scoped key
      const userKey = `${STORAGE_KEY_ANALYSIS}_${user.id}`;
      const userStored = localStorage.getItem(userKey);
      if (userStored) {
        const parsed = JSON.parse(userStored);
        if (
          parsed &&
          parsed.isUserReport === true &&
          ([parsed.parameters?.nitrogen?.value, parsed.parameters?.ph?.value, parsed.soilMetrics?.nitrogen, parsed.soilMetrics?.ph]
            .some((value) => typeof value === 'number' && Number.isFinite(value)))
        ) {
          return true;
        }
      }

      // Check general active analysis storage key
      const generalStored = localStorage.getItem(STORAGE_KEY_ANALYSIS);
      if (generalStored) {
        const parsed = JSON.parse(generalStored);
        if (
          parsed &&
          parsed.isUserReport === true &&
          ((parsed.userId && parsed.userId === user.id) ||
            (parsed.userEmail && parsed.userEmail.toLowerCase() === user.email?.toLowerCase()))
        ) {
          return true;
        }
      }
    } catch {
      // fallback
    }

    return false;
  }

  /**
   * Generates a neutral empty analysis result for new accounts without uploaded soil cards
   */
  public createEmptyAnalysisResult(user?: User | null): SoilAnalysisResult {
    const emptyParam = (name: string, symbol: string, unit: string): SoilParameterDetail => ({
      name,
      symbol,
      value: null,
      unit,
      status: 'Not tested',
      idealRange: 'Not available until tested',
      percentage: null,
      description: 'No verified soil test recorded yet for this parameter.',
      recommendation: 'Upload Soil Health Card or enter lab values manually to generate advisory.',
    });

    return {
      id: `profile-pending-${user?.id || 'new'}`,
      sampleName: user?.name ? `${user.name}'s Farm (Awaiting Test)` : 'New Farm (Awaiting Test)',
      source: 'manual',
      analyzedAt: '',
      isUserReport: false,
      userId: user?.id,
      userEmail: user?.email,
      healthScore: null,
      healthRating: 'Not assessed',
      conditionSummary: 'No soil health report registered yet. Upload your Soil Health Card or enter your N-P-K & pH lab values to generate personalized recommendations.',
      fieldMetadata: {
        soilType: user?.soilType || 'Pending Selection',
        farmArea: user?.farmArea || 0,
        previousCrop: user?.preferredCrop || '',
        season: 'Active Season',
        location: user?.location || '',
      },
      parameters: {
        nitrogen: emptyParam('Nitrogen', 'N', 'kg/ha'),
        phosphorus: emptyParam('Phosphorus', 'P', 'kg/ha'),
        potassium: emptyParam('Potassium', 'K', 'kg/ha'),
        ph: emptyParam('Soil pH', 'pH', 'pH Units'),
        organicCarbon: emptyParam('Organic Carbon', 'OC', '%'),
        sulphur: emptyParam('Sulphur', 'S', 'ppm'),
        zinc: emptyParam('Zinc', 'Zn', 'ppm'),
        iron: emptyParam('Iron', 'Fe', 'ppm'),
        manganese: emptyParam('Manganese', 'Mn', 'ppm'),
        copper: emptyParam('Copper', 'Cu', 'ppm'),
        boron: emptyParam('Boron', 'B', 'ppm'),
        electricalConductivity: emptyParam('Electrical Conductivity', 'EC', 'dS/m'),
      },
      soilMetrics: {
        id: `metrics-${user?.id || 'new'}`,
        sampleName: user?.name ? `${user.name}'s Farm (Awaiting Test)` : 'New Farm (Awaiting Test)',
        testDate: '',
        soilType: user?.soilType || 'Pending Selection',
        ph: null,
        nitrogen: null,
        nitrogenStatus: 'Not tested',
        phosphorus: null,
        phosphorusStatus: 'Not tested',
        potassium: null,
        potassiumStatus: 'Not tested',
        organicCarbon: null,
        electricalConductivity: null,
        micronutrients: {
          zinc: 'Not tested',
          iron: 'Not tested',
          copper: 'Not tested',
          boron: 'Not tested',
        },
        overallHealthScore: null,
        notes: 'Awaiting soil health card upload or manual lab entry.',
      },
    };
  }

  /**
   * Persists analysis directly from SoilMetrics object and links to active user
   */
  public saveAnalysisFromMetrics(metrics: SoilMetrics, user?: User | null): void {
    const analysis = this.getActiveAnalysis(user);
    const details = (name: string, symbol: string, unit: string, value: number | null | undefined): SoilParameterDetail => ({
      name, symbol, value: value != null && Number.isFinite(value) ? value : null, unit,
      status: value == null ? 'Not tested' : 'Not assessed',
      idealRange: 'Not assessed; no applicable local threshold configured', percentage: null,
      description: 'Value recorded in the selected soil report.', recommendation: '',
    });
    const updated: SoilAnalysisResult = {
      ...analysis,
      id: metrics.id || analysis.id,
      sampleName: metrics.sampleName || analysis.sampleName,
      isUserReport: true,
      soilMetrics: metrics,
      analyzedAt: metrics.testDate || analysis.analyzedAt,
      healthScore: null,
      healthRating: 'Not assessed',
      conditionSummary: 'Measurements are saved. Agronomic interpretation is unavailable without a validated local method.',
      healthSummary: {
        fertilityStatus: 'Assessment unavailable; no validated local method is configured.',
        fertilityScore: null, majorDeficiencies: [], excessNutrients: [],
        limitations: ['No validated local soil interpretation method is configured.'],
      },
      parameters: {
        ...analysis.parameters,
        nitrogen: details('Nitrogen', 'N', 'kg/ha', metrics.nitrogen),
        phosphorus: details('Phosphorus', 'P', 'kg/ha', metrics.phosphorus),
        potassium: details('Potassium', 'K', 'kg/ha', metrics.potassium),
        ph: details('Soil pH', 'pH', '', metrics.ph),
        organicCarbon: details('Organic Carbon', 'OC', '%', metrics.organicCarbon),
        sulphur: details('Sulphur', 'S', 'ppm', metrics.sulphur),
        zinc: details('Zinc', 'Zn', 'ppm', metrics.zinc),
        iron: details('Iron', 'Fe', 'ppm', metrics.iron),
        manganese: details('Manganese', 'Mn', 'ppm', metrics.manganese),
        copper: details('Copper', 'Cu', 'ppm', metrics.copper),
        boron: details('Boron', 'B', 'ppm', metrics.boron),
        electricalConductivity: details('Electrical Conductivity', 'EC', 'dS/m', metrics.electricalConductivity),
      },
      fieldMetadata: {
        ...analysis.fieldMetadata,
        soilType: metrics.soilType || analysis.fieldMetadata?.soilType || user?.soilType || '',
        farmArea: Number(user?.farmArea) || analysis.fieldMetadata?.farmArea || 0,
        location: analysis.fieldMetadata?.location || user?.location || '',
      },
    };
    this.saveAnalysis(updated, user?.id);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('krishibhoomi_soil_updated', { detail: updated }));
      window.dispatchEvent(new CustomEvent('krishi:soil-updated', { detail: updated }));
      window.dispatchEvent(new CustomEvent('krishi:fertilizer-sync-needed', { detail: updated }));
    }
  }

  /**
   * Retrieves active analysis result, scoped per user account
   */
  public getActiveAnalysis(user?: User | null): SoilAnalysisResult {
    try {
      // 1. Check user-specific storage key first
      const userKey = user?.id ? `${STORAGE_KEY_ANALYSIS}_${user.id}` : null;
      if (userKey) {
        const userStored = localStorage.getItem(userKey);
        if (userStored) {
          const parsed = JSON.parse(userStored) as SoilAnalysisResult;
          if (parsed && (parsed.isUserReport === true || [parsed.parameters?.nitrogen?.value, parsed.parameters?.ph?.value]
            .some((value) => typeof value === 'number' && Number.isFinite(value)))) {
            return parsed;
          }
        }
      }

      // 2. Check general active analysis storage key
      const stored = localStorage.getItem(STORAGE_KEY_ANALYSIS);
      if (stored) {
        const parsed = JSON.parse(stored) as SoilAnalysisResult;
        if (parsed && (parsed.isUserReport === true || [parsed.parameters?.nitrogen?.value, parsed.parameters?.ph?.value]
          .some((value) => typeof value === 'number' && Number.isFinite(value)))) {
          if (user?.id || user?.email) {
            const matchesUser =
              (parsed.userId && user?.id && parsed.userId === user.id) ||
              (parsed.userEmail && user?.email && parsed.userEmail.toLowerCase() === user.email.toLowerCase());
            if (matchesUser) {
              return parsed;
            }
          } else {
            return parsed;
          }
        }
      }

      // 3. For accounts without an uploaded soil report, return clean baseline
      return this.createEmptyAnalysisResult(user);
    } catch {
      // Fallback
    }
    return this.createEmptyAnalysisResult(user);
  }

  /**
   * Retrieves historical analyses from backend API with fallback
   */
  public async fetchHistory(user?: User | null): Promise<SoilAnalysisResult[]> {
    if (!user?.id) return [];
    try {
      const res = await api.get<{ history: any[] }>('/soil/history');
      const history = res.data?.history;
      if (!Array.isArray(history)) return [];
      const numeric = (value: unknown): number | null => {
        if (value === null || value === undefined || value === '') return null;
        const parsed = typeof value === 'number' ? value : Number(value);
        return Number.isFinite(parsed) ? parsed : null;
      };
      const metric = (value: unknown, name: string, symbol: string, unit: string, description: string, idealRange = 'Not assessed'): SoilAnalysisResult['parameters'][string] => ({
        name, symbol, value: numeric(value), unit,
        status: numeric(value) === null ? 'Not tested' : 'Not assessed',
        idealRange, percentage: null, description, recommendation: '',
      });
      const mapped: SoilAnalysisResult[] = history.map((h: any) => {
        const nitrogen = numeric(h.nitrogen);
        const phosphorus = numeric(h.phosphorus);
        const potassium = numeric(h.potassium);
        const ph = numeric(h.ph);
        const organicCarbon = numeric(h.organic_carbon);
        const sulphur = numeric(h.sulphur);
        const zinc = numeric(h.zinc);
        const iron = numeric(h.iron);
        const manganese = numeric(h.manganese);
        const copper = numeric(h.copper);
        const boron = numeric(h.boron);
        const electricalConductivity = numeric(h.electrical_conductivity);
        const notTestedOrNotAssessed = (value: number | null) => value === null ? 'Not tested' : 'Not assessed';
        const metrics: SoilMetrics = {
        id: String(h.id), sampleName: h.sampleName || 'Soil Health Card',
          testDate: h.created_at ? String(h.created_at) : '', soilType: '',
          ph, nitrogen, nitrogenStatus: notTestedOrNotAssessed(nitrogen),
          phosphorus, phosphorusStatus: notTestedOrNotAssessed(phosphorus),
          potassium, potassiumStatus: notTestedOrNotAssessed(potassium),
          organicCarbon, electricalConductivity,
          micronutrients: {
            zinc: zinc === null ? 'Not tested' : `${zinc} ppm (Not assessed)`,
            iron: iron === null ? 'Not tested' : `${iron} ppm (Not assessed)`,
            copper: copper === null ? 'Not tested' : `${copper} ppm (Not assessed)`,
            boron: boron === null ? 'Not tested' : `${boron} ppm (Not assessed)`,
          },
          overallHealthScore: null, notes: 'No validated local fertility score or interpretation is configured.',
        };
        return {
          id: String(h.id), sampleName: h.sampleName || 'Soil Health Card',
          source: h.source === 'manual' ? 'manual' : 'ocr',
          analyzedAt: h.created_at ? String(h.created_at) : '', isUserReport: true,
          userId: user.id, userEmail: user.email,
          healthScore: null,
          healthRating: 'Not assessed',
          conditionSummary: 'Verified soil measurements retrieved from your account history. Soil interpretation is unavailable without validated local criteria.',
          parameters: {
            nitrogen: metric(nitrogen, 'Nitrogen', 'N', 'kg/ha', 'Available Nitrogen.'),
            phosphorus: metric(phosphorus, 'Phosphorus', 'P', 'kg/ha', 'Available Phosphorus.'),
            potassium: metric(potassium, 'Potassium', 'K', 'kg/ha', 'Available Potassium.'),
            ph: metric(ph, 'Soil pH', 'pH', '', 'Soil acidity/alkalinity.'),
            organicCarbon: metric(organicCarbon, 'Organic Carbon', 'OC', '%', 'Organic carbon.'),
            sulphur: metric(sulphur, 'Sulphur', 'S', 'ppm', 'Sulphur.'),
            zinc: metric(zinc, 'Zinc', 'Zn', 'ppm', 'Zinc.'),
            iron: metric(iron, 'Iron', 'Fe', 'ppm', 'Iron.'),
            manganese: metric(manganese, 'Manganese', 'Mn', 'ppm', 'Manganese.'),
            copper: metric(copper, 'Copper', 'Cu', 'ppm', 'Copper.'),
            boron: metric(boron, 'Boron', 'B', 'ppm', 'Boron.'),
            electricalConductivity: metric(electricalConductivity, 'Electrical Conductivity', 'EC', 'dS/m', 'Electrical conductivity.'),
          },
          fieldMetadata: {
            soilType: typeof h.soilType === 'string' ? h.soilType : '',
            farmArea: numeric(h.farmArea) ?? 0,
            previousCrop: typeof h.previousCrop === 'string' ? h.previousCrop : '',
            season: typeof h.season === 'string' ? h.season : '',
            location: typeof h.location === 'string' ? h.location : '',
          },
          micronutrients: {
            zinc: zinc === null ? 'Not tested' : `${zinc} ppm`,
            iron: iron === null ? 'Not tested' : `${iron} ppm`,
            copper: copper === null ? 'Not tested' : `${copper} ppm`,
            boron: boron === null ? 'Not tested' : `${boron} ppm`,
          },
          soilMetrics: metrics,
        };
      });
      if (mapped.length) localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(mapped));
      return mapped;
    } catch (e: any) {
      console.warn('[soilAnalysisService] Failed to load history from backend API:', e.message);
      return [];
    }
  }

  /**
   * Retrieves historical analyses
   */
  public getHistory(): SoilAnalysisResult[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (stored) {
        const list = JSON.parse(stored) as SoilAnalysisResult[];
        if (Array.isArray(list)) {
          return list;
        }
      }
    } catch {
      // Fallback
    }
    return [];
  }

  public getSelectedReportId(user?: User | null): string | null {
    if (!user?.id || typeof localStorage === 'undefined') return null;
    try {
      return localStorage.getItem(`${STORAGE_KEY_SELECTED_REPORT}_${user.id}`);
    } catch {
      return null;
    }
  }

  public selectAnalysis(result: SoilAnalysisResult, user?: User | null): void {
    if (!user?.id || (result.userId && result.userId !== user.id)) {
      throw new Error('Sign in to select a soil report belonging to your account.');
    }
    result.userId = user.id;
    result.userEmail = user.email;
    result.isUserReport = true;
    localStorage.setItem(`${STORAGE_KEY_ANALYSIS}_${user.id}`, JSON.stringify(result));
    localStorage.setItem(STORAGE_KEY_ANALYSIS, JSON.stringify(result));
    localStorage.setItem(`${STORAGE_KEY_SELECTED_REPORT}_${user.id}`, result.id);
    window.dispatchEvent(new CustomEvent('krishibhoomi_soil_updated', { detail: result }));
    window.dispatchEvent(new CustomEvent('krishi:soil-updated', { detail: result }));
  }
}

export const soilAnalysisService = new SoilAnalysisService();
