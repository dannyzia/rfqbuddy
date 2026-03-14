import { api } from '../api-client';
import type { Bid, BidItem } from '../api-types';

export const bidsApi = {
  list() {
    return api.get<Bid[]>('/api/bids');
  },

  listByTender(tenderId: string) {
    return api.get<Bid[]>(`/api/bids/tender/${tenderId}`);
  },

  getById(id: string) {
    return api.get<Bid>(`/api/bids/${id}`);
  },

  create(data: { tender_id: string; [k: string]: unknown }) {
    return api.post<Bid>('/api/bids', data);
  },

  addItems(bidId: string, items: Partial<BidItem>[]) {
    return api.post<BidItem[]>(`/api/bids/${bidId}/items`, items);
  },

  submit(id: string) {
    return api.post<Bid>(`/api/bids/${id}/submit`);
  },

  withdraw(id: string) {
    return api.post<Bid>(`/api/bids/${id}/withdraw`);
  },
};
