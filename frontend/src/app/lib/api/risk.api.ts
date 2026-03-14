import { api } from '../api-client';
import type { RiskDashboardResponse, VendorRiskProfileResponse, RiskAssessment, PaginatedResponse } from '../api-types';

export const riskApi = {
  getDashboard() {
    return api.get<RiskDashboardResponse>('/api/risk/dashboard');
  },

  listAssessments(params?: { page?: number; pageSize?: number; tier?: string }) {
    return api.get<PaginatedResponse<RiskAssessment>>('/api/risk/assessments', params);
  },

  getVendorRiskProfile(orgId: string) {
    return api.get<VendorRiskProfileResponse>(`/api/risk/vendors/${orgId}`);
  },

  updateRiskLevel(orgId: string, riskLevel: string) {
    return api.patch<VendorRiskProfileResponse>(`/api/risk/vendors/${orgId}`, { risk_level: riskLevel });
  },

  createAssessment(data: { vendor_org_id: string; dimension_scores: Record<string, number> }) {
    return api.post<RiskAssessment>('/api/risk/assessments', data);
  },
};
