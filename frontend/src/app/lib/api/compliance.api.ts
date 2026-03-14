import { api } from '../api-client';
import type { KycCheck, SanctionsAlert, PaginatedResponse } from '../api-types';

export const complianceApi = {
  listKycChecks(params?: { page?: number; pageSize?: number; status?: string }) {
    return api.get<PaginatedResponse<KycCheck>>('/api/compliance/kyc', params);
  },

  getKycDetail(orgId: string) {
    return api.get<KycCheck>(`/api/compliance/kyc/${orgId}`);
  },

  createKycCheck(data: { vendor_org_id: string; check_type: 'initial' | 'periodic' | 'triggered' }) {
    return api.post<KycCheck>('/api/compliance/kyc', data);
  },

  updateKycStatus(orgId: string, status: string) {
    return api.patch<KycCheck>(`/api/compliance/kyc/${orgId}`, { status });
  },

  getSanctionsAlerts(params?: { page?: number; pageSize?: number; severity?: string }) {
    return api.get<PaginatedResponse<SanctionsAlert>>('/api/compliance/sanctions', params);
  },

  resolveSanctionsAlert(alertId: string, resolution: 'resolved_true_match' | 'resolved_false_positive', notes?: string) {
    return api.patch<SanctionsAlert>(`/api/compliance/sanctions/${alertId}`, { status: resolution, notes });
  },
};
