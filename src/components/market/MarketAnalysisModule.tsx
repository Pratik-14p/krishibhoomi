import React, { useMemo, useState } from 'react';
import { Download, RefreshCw, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchMarketAnalysis, MarketFilters, MarketQueryResult, VerifiedMandiRecord } from '../../services/marketAnalysisService';

const STATE_UTS = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const EMPTY_FILTERS: MarketFilters = { state: '', district: '', market: '', commodity: '', variety: '', arrivalDate: '' };
const display = (value: string | number | null | undefined) => value === null || value === undefined || value === '' ? 'Not available' : String(value);
const escapeCsv = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

export const MarketAnalysisModule: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const initialState = useMemo(() => {
    const profileLocation = user?.location?.trim() || '';
    const possibleState = profileLocation.split(',').map((part) => part.trim()).at(-1) || '';
    return STATE_UTS.find((state) => state.toLowerCase() === possibleState.toLowerCase()) || '';
  }, [user?.location]);
  const [filters, setFilters] = useState<MarketFilters>({ ...EMPTY_FILTERS, state: initialState, commodity: user?.preferredCrop || '' });
  const [result, setResult] = useState<MarketQueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [profileNotice, setProfileNotice] = useState<string | null>(null);

  const updateFilter = (field: keyof MarketFilters, value: string) => {
    setFilters((current) => ({ ...current, [field]: value }));
    setResult(null);
    setError(null);
    setHasSearched(false);
  };

  const runSearch = async (event?: React.FormEvent) => {
    event?.preventDefault();
    if (!filters.state) { setError('Select a State or Union Territory.'); return; }
    if (!filters.commodity.trim()) { setError('Enter a commodity to search verified mandi records.'); return; }
    setLoading(true);
    setError(null);
    setResult(null);
    setHasSearched(true);
    try {
      const data = await fetchMarketAnalysis(filters);
      setResult(data);
    } catch (cause) {
      console.error('Verified market-data request failed:', cause instanceof Error ? cause.name : 'UnknownError');
      setError(cause instanceof Error ? cause.message : 'Market data is currently unavailable. Check the filters or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const exportCsv = () => {
    if (!result?.records.length) return;
    const columns: Array<[string, keyof VerifiedMandiRecord]> = [
      ['State/UT', 'state'], ['District', 'district'], ['Market', 'market'], ['Commodity', 'commodity'],
      ['Variety', 'variety'], ['Grade', 'grade'], ['Arrival date', 'arrivalDate'], ['Minimum price', 'minPrice'],
      ['Maximum price', 'maxPrice'], ['Modal price', 'modalPrice'], ['Arrivals', 'arrivals'],
    ];
    const csv = [columns.map(([label]) => escapeCsv(label)).join(','), ...result.records.map((record) => columns.map(([, key]) => escapeCsv(record[key])).join(','))].join('\r\n');
    const blobUrl = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'verified-mandi-records.csv';
    link.click();
    URL.revokeObjectURL(blobUrl);
  };

  const saveLocationToProfile = async () => {
    if (!filters.state) return;
    try {
      await updateProfile({ location: filters.district.trim() ? `${filters.district.trim()}, ${filters.state}` : filters.state });
      setProfileNotice('Selected location saved to your profile.');
    } catch (cause) {
      console.error('Could not save market location to profile:', cause instanceof Error ? cause.name : 'UnknownError');
      setProfileNotice('Could not save the location. Please retry.');
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#E0E0E0] bg-white p-5 shadow-2xs">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#2E7D32]"><Store className="h-4 w-4" /> Verified Mandi Records</div>
            <h1 className="text-xl font-extrabold text-[#37474F]">Market Analysis & Mandi Intelligence</h1>
            <p className="mt-1 text-sm text-gray-500">Search Government of India OGD / AGMARKNET observations. A selectable State/UT does not imply that records are available.</p>
          </div>
          {result?.records.length ? <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700"><Download className="h-4 w-4" /> Export returned records</button> : null}
          {user && filters.state && <button onClick={() => void saveLocationToProfile()} className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700">Save location to profile</button>}
        </div>
        {profileNotice && <p role="status" className="mt-2 text-xs text-gray-600">{profileNotice}</p>}

        <form onSubmit={runSearch} className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-xs font-bold text-gray-700">State / Union Territory
            <select value={filters.state} onChange={(event) => updateFilter('state', event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-normal">
              <option value="">Select State / UT</option>
              {STATE_UTS.map((state) => <option key={state} value={state}>{state}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-gray-700">District (optional)
            <input value={filters.district} onChange={(event) => updateFilter('district', event.target.value)} placeholder="Enter district" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal" />
          </label>
          <label className="text-xs font-bold text-gray-700">Market / Mandi (optional)
            <input value={filters.market} onChange={(event) => updateFilter('market', event.target.value)} placeholder="Enter market name" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal" />
          </label>
          <label className="text-xs font-bold text-gray-700">Commodity
            <input value={filters.commodity} onChange={(event) => updateFilter('commodity', event.target.value)} placeholder="Enter commodity as listed by AGMARKNET" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal" />
          </label>
          <label className="text-xs font-bold text-gray-700">Variety (optional)
            <input value={filters.variety} onChange={(event) => updateFilter('variety', event.target.value)} placeholder="Enter variety" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal" />
          </label>
          <label className="text-xs font-bold text-gray-700">Arrival date (optional)
            <input type="date" value={filters.arrivalDate} onChange={(event) => updateFilter('arrivalDate', event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal" />
          </label>
          <div className="flex items-end gap-2 lg:col-span-3">
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-[#2E7D32] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> {loading ? 'Searching verified source…' : 'Search market records'}
            </button>
          </div>
        </form>
      </section>

      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">{error} <button onClick={() => void runSearch()} disabled={loading} className="ml-2 underline">Retry</button></div>}
      {loading && <div role="status" className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">Requesting current records from the configured Government of India source…</div>}
      {hasSearched && !loading && !error && result && result.records.length === 0 && <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">No market data available for the selected filters.</div>}

      {result && result.records.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-[#E0E0E0] bg-white shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 p-4 text-xs text-gray-600">
            <span><strong>{result.resultCount}</strong> source record(s) • {result.source} • Resource {result.resourceId}</span>
            <span>{result.fetchedAt ? `Retrieved ${new Date(result.fetchedAt).toLocaleString()}` : 'Retrieval time not provided'}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-xs">
              <thead className="bg-gray-50 text-[10px] uppercase tracking-wide text-gray-500"><tr>{['State / UT','District','Market','Commodity','Variety','Grade','Arrival date','Min price (₹/qtl)','Max price (₹/qtl)','Modal price (₹/qtl)','Arrivals'].map((column) => <th key={column} className="px-3 py-3">{column}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-100">{result.records.map((record, index) => <tr key={`${record.state}-${record.district}-${record.market}-${record.arrivalDate}-${index}`} className="text-gray-700">{[record.state,record.district,record.market,record.commodity,record.variety,record.grade,record.arrivalDate,record.minPrice,record.maxPrice,record.modalPrice,record.arrivals].map((value, cell) => <td key={cell} className="px-3 py-3">{display(value)}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </section>
      )}
      {!hasSearched && <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">Select a State/UT and commodity, then search. Only records returned by the verified source will be shown.</div>}
    </div>
  );
};
