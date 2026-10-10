import { api } from './api';

export interface MarketFilters {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrivalDate: string;
}

export interface VerifiedMandiRecord {
  state: string | null;
  district: string | null;
  market: string | null;
  commodity: string | null;
  variety: string | null;
  grade: string | null;
  arrivalDate: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  modalPrice: number | null;
  arrivals: string | number | null;
}

export interface MarketQueryResult {
  source: string;
  resourceId: string;
  fetchedAt: string | null;
  resultCount: number;
  records: VerifiedMandiRecord[];
}

const optionalText = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

const optionalNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(String(value).replace(/,/g, '').trim());
  return Number.isFinite(parsed) ? parsed : null;
};

export async function fetchMarketAnalysis(filters: MarketFilters): Promise<MarketQueryResult> {
  const query: Record<string, string> = {
    state: filters.state.trim(),
    district: filters.district.trim(),
    market: filters.market.trim(),
    crop: filters.commodity.trim(),
    variety: filters.variety.trim(),
    arrival_date: filters.arrivalDate.trim(),
  };
  const response = await api.get<any>('/market/prices', query);
  const payload = response.data?.data ?? response.data;
  if (!payload || typeof payload !== 'object' || Array.isArray(payload) || !Array.isArray(payload.records)) {
    throw new Error('The verified mandi service returned an invalid response. Please retry.');
  }

  const records: VerifiedMandiRecord[] = payload.records.map((row: any) => {
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      throw new Error('The verified mandi service returned an invalid record. Please retry.');
    }
    return {
      state: optionalText(row.state),
      district: optionalText(row.district),
      market: optionalText(row.market),
      commodity: optionalText(row.commodity),
      variety: optionalText(row.variety),
      grade: optionalText(row.grade),
      arrivalDate: optionalText(row.arrivalDate),
      minPrice: optionalNumber(row.minPrice),
      maxPrice: optionalNumber(row.maxPrice),
      modalPrice: optionalNumber(row.modalPrice),
      arrivals: row.arrivals === null || row.arrivals === undefined || row.arrivals === ''
        ? null
        : (typeof row.arrivals === 'string' || typeof row.arrivals === 'number' ? row.arrivals : null),
    };
  });

  if (payload.resultCount !== records.length || typeof payload.source !== 'string' || typeof payload.resourceId !== 'string') {
    throw new Error('The verified mandi service returned incomplete source metadata. Please retry.');
  }
  return {
    source: payload.source,
    resourceId: payload.resourceId,
    fetchedAt: optionalText(payload.fetchedAt),
    resultCount: records.length,
    records,
  };
}
