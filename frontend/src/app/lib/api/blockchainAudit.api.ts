import { api } from '../api-client';
import type { BlockchainAnchor, PaginatedResponse } from '../api-types';

export const blockchainAuditApi = {
  anchor(data: { event_type: string; entity_type: string; entity_id: string; payload: Record<string, any> }) {
    return api.post<BlockchainAnchor>('/api/audit/anchor', data);
  },

  verify(anchorId: string) {
    return api.get<BlockchainAnchor & { verified_at: string }>(`/api/audit/verify/${anchorId}`);
  },

  listAnchors(params?: { entity_type?: string; page?: number; pageSize?: number }) {
    return api.get<PaginatedResponse<BlockchainAnchor>>('/api/audit/anchors', params);
  },
};
