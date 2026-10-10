import React, { useEffect, useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  Calendar,
  FileSpreadsheet,
  Eye,
  Layers,
  Sprout,
  Activity,
  Coins,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Printer,
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { VoiceListenButton } from '../common/VoiceListenButton';
import { GeneratePdfReportModal } from '../reports/GeneratePdfReportModal';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

type ReportCategory =
  | 'all'
  | 'soil-reports'
  | 'recommendations'
  | 'crop-history'
  | 'yield-income'
  | 'previous-analyses';

interface ReportItem {
  id: string;
  category: 'soil-reports' | 'recommendations' | 'crop-history' | 'yield-income' | 'previous-analyses';
  title: string;
  field: string;
  date: string;
  size: string;
  type: string;
  metricsBadge: string;
  summary: string;
}

export const ReportsHistoryView: React.FC = () => {
  const { language, t } = useI18n();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<ReportCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [allRecords, setAllRecords] = useState<ReportItem[]>([]);
  const [recordsOwnerId, setRecordsOwnerId] = useState<string | undefined>(user?.id);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadRecords = async () => {
    setAllRecords([]);
    setRecordsOwnerId(user?.id);
    setLoading(true); setLoadError(null);
    try {
      const response = await api.get<any>('/reports');
      const rows = response.data?.reports;
      if (!Array.isArray(rows)) throw new Error('The reports service returned an invalid response.');
      const typeMap: Record<string, ReportItem['category']> = { soil_analysis: 'soil-reports', crop_recommendation: 'recommendations', fertilizer_assessment: 'recommendations', ipm_advisory_request: 'recommendations', personalized_strategy: 'recommendations', yield_prediction: 'yield-income', market_analysis: 'recommendations' };
      setAllRecords(rows.filter((r: any) => r && typeof r.id === 'string').map((r: any) => {
        const payload = r.payload && typeof r.payload === 'object' ? r.payload : {};
        const kind = String(r.report_type || r.title || 'record').toLowerCase().replace(/[^a-z_]/g, '_');
        const date = r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Date unavailable';
        return { id: r.id, category: typeMap[kind] || 'previous-analyses', title: String(r.title || kind.replace(/_/g, ' ')), field: String(payload.location || payload.farmLocation || payload.crop || payload.cropName || 'Farm details not recorded'), date, size: 'Not available', type: String(r.report_type || 'Stored record'), metricsBadge: 'Stored account record', summary: 'This record was returned by the authenticated reports service. Open the original feature for its available data.' };
      }));
    } catch { setLoadError('common.dataUnavailable'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void loadRecords(); }, [user?.id]);

  const categories = [
    { id: 'all', label: language === 'mr' ? 'सर्व नोंदी' : language === 'hi' ? 'सभी रिकॉर्ड' : 'All Records' },
    { id: 'soil-reports', label: language === 'mr' ? '१. माती तपासणी अहवाल' : language === 'hi' ? '१. मृदा रिपोर्ट' : '1. Soil Reports' },
    { id: 'recommendations', label: language === 'mr' ? '२. एआय शिफारसी' : language === 'hi' ? '२. सिफारिशें' : '2. Recommendations' },
    { id: 'crop-history', label: language === 'mr' ? '३. पीक इतिहास' : language === 'hi' ? '३. फसल इतिहास' : '3. Crop History' },
    { id: 'yield-income', label: language === 'mr' ? '४. उत्पादन व नफा नोंदी' : language === 'hi' ? '४. उपज व आय' : '4. Yield & Income Records' },
    { id: 'previous-analyses', label: language === 'mr' ? '५. मागील विश्लेषणे' : language === 'hi' ? '५. पिछले विश्लेषण' : '5. Previous Analyses' },
  ];

  const filteredRecords = (recordsOwnerId === user?.id ? allRecords : []).filter((rec) => {
    const matchesCategory = activeCategory === 'all' || rec.category === activeCategory;
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (rec: ReportItem) => {
    const content = `KRISHIBHOOMI SMART AGRI AI REPORT
=====================================================
Title: ${rec.title}
Report ID: ${rec.id}
Category: ${rec.category}
Field Block: ${rec.field}
Date: ${rec.date}
Key Metrics: ${rec.metricsBadge}

Summary:
${rec.summary}

Verification: No independent verification claim is made by this export.
Issued from records returned by your authenticated account.
=====================================================`;

    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${rec.id.toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Flowchart Node 13 • Central Audit & Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37474F] tracking-tight">
            Reports & Historical Archive
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
            Consolidated repository storing your Soil Health Cards, AI Recommendations, Crop Rotation History, Yield & Income Records, and Previous Scenario Analyses.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0 self-start lg:self-auto">
          <button
            onClick={() => setPdfModalOpen(true)}
            id="btn-generate-pdf-reports"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>
              {language === 'mr'
                ? 'पीडीएफ अहवाल तयार करा'
                : language === 'hi'
                ? 'पीडीएफ रिपोर्ट बनाएं'
                : 'Generate Formal PDF'}
            </span>
          </button>

          <button
            onClick={() => {
              const allTxt = allRecords.map((r) => `[${r.id}] ${r.title} - ${r.date}`).join('\n');
              const file = new Blob([allTxt], { type: 'text/plain' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(file);
              a.download = 'krishibhoomi_full_farm_archive.txt';
              a.click();
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E0E0E0] hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>
              {language === 'mr'
                ? 'सर्व अहवाल संग्रहण'
                : language === 'hi'
                ? 'सभी संग्रह डाउनलोड'
                : 'Export Archive'}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Sub-Category Tabs Matching Flowchart Node 13 */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-4 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as ReportCategory)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#2E7D32] text-white shadow-2xs'
                    : 'bg-[#F7FBF7] hover:bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search records or IDs..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl text-xs focus:outline-none focus:border-[#2E7D32]"
            />
          </div>
        </div>

        {/* Records Table */}
        <div className="overflow-x-auto border border-[#E0E0E0] rounded-xl">
          <table className="w-full text-left text-xs text-[#37474F]">
            <thead className="bg-[#F7FBF7] text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-[#E0E0E0]">
              <tr>
                <th className="py-3.5 px-4">Record Title & Identifier</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Field Block</th>
                <th className="py-3.5 px-4">Key Metrics / Diagnostics</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading && <tr><td colSpan={6} className="p-6 text-center text-sm text-gray-500">{t('common.loading')}</td></tr>}
              {!loading && loadError && <tr><td colSpan={6} className="p-6 text-center text-sm text-red-700">{t(loadError)} <button onClick={() => void loadRecords()} className="ml-2 underline">{t('common.retry')}</button></td></tr>}
              {!loading && !loadError && filteredRecords.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-sm text-gray-500">{t('common.noDataAvailable')}</td></tr>}
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#F1F8E9]/30 transition-colors">
                  <td className="py-4 px-4 font-bold text-[#37474F]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="hover:text-[#2E7D32] cursor-pointer" onClick={() => setSelectedReport(rec)}>
                          {rec.title}
                        </p>
                        <p className="text-[10px] font-normal text-gray-400">ID: {rec.id} • {rec.size}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold">
                      {rec.type}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-gray-600">{rec.field}</td>

                  <td className="py-4 px-4">
                    <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                      {rec.metricsBadge}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-gray-500">{rec.date}</td>

                  <td className="py-4 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => setSelectedReport(rec)}
                        title="View Summary"
                        className="p-1.5 text-gray-500 hover:text-[#2E7D32] hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(rec)}
                        title="Download Certificate"
                        className="p-1.5 text-[#2E7D32] hover:bg-[#E8F5E9] rounded-lg cursor-pointer transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32]">
                  {selectedReport.type}
                </span>
                <h3 className="text-base font-extrabold text-[#37474F]">{selectedReport.title}</h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-600">
              <div className="p-3 bg-[#F7FBF7] rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-gray-700">Diagnostic Summary:</span>
                  <VoiceListenButton text={selectedReport.summary} size="xs" variant="subtle" />
                </div>
                <p className="leading-relaxed">{selectedReport.summary}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-400">Field / Holding:</span>
                  <p className="font-bold text-gray-700">{selectedReport.field}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-400">Date Logged:</span>
                  <p className="font-bold text-gray-700">{selectedReport.date}</p>
                </div>
              </div>

              <div className="p-2 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-100 font-medium">
                Metrics: {selectedReport.metricsBadge}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownload(selectedReport);
                  setSelectedReport(null);
                }}
                className="px-4 py-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <GeneratePdfReportModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
      />
    </div>
  );
};

