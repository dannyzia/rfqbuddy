import { api } from '../api-client';
import type { MatchingOverview, InvoiceMatchRecord, FxRatesResponse, FxComparison, PaginatedResponse } from '../api-types';

export const financeApi = {
  getMatchingOverview() {
    return api.get<MatchingOverview>('/api/finance/matching');
  },

  listPayments(params?: { page?: number; pageSize?: number; status?: string }) {
    return api.get<PaginatedResponse<InvoiceMatchRecord>>('/api/finance/payments', params);
  },

  createGRN(data: { contract_id: string; certificate_no: string; milestone_id?: string; amount: string }) {
    return api.post<{ id: string; grn_number: string }>('/api/finance/grn', data);
  },

  getFxRates(base?: string) {
    return api.get<FxRatesResponse>('/api/finance/fx/rates', base ? { base } : undefined);
  },

  getFxComparison(tenderId: string) {
    return api.get<FxComparison>(`/api/finance/fx/comparison/${tenderId}`);
  },
};
