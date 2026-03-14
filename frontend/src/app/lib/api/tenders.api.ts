import { api } from '../api-client';
import type { Tender, TenderItem, PaginatedResponse } from '../api-types';

export const tendersApi = {
  list(params?: { status?: string; search?: string; page?: number; pageSize?: number }) {
    return api.get<PaginatedResponse<Tender>>('/api/tenders', params);
  },

  getById(id: string) {
    return api.get<Tender>(`/api/tenders/${id}`);
  },

  create(data: Partial<Tender>) {
    return api.post<Tender>('/api/tenders', data);
  },

  update(id: string, data: Partial<Tender>) {
    return api.patch<Tender>(`/api/tenders/${id}`, data);
  },

  remove(id: string) {
    return api.delete<{ success: true }>(`/api/tenders/${id}`);
  },

  publish(id: string) {
    return api.post<Tender>(`/api/tenders/${id}/publish`);
  },

  close(id: string) {
    return api.post<Tender>(`/api/tenders/${id}/close`);
  },

  forward(id: string, data: { to_stage: string; to_user_id: string; notes: string }) {
    return api.post<Tender>(`/api/tenders/${id}/forward`, data);
  },
};
