import { api } from '../api-client';
import type { ProcurementStats, SpendByCategory, VendorRanking, AdminDashboardStats, EfficiencyMetrics, ComplianceMetrics } from '../api-types';

export const analyticsApi = {
  // Buyer analytics
  getProcurementStats() {
    return api.get<ProcurementStats>('/api/analytics/stats');
  },

  getSpendByCategory() {
    return api.get<SpendByCategory[]>('/api/analytics/spend');
  },

  getVendorRanking() {
    return api.get<VendorRanking[]>('/api/analytics/vendors');
  },

  getTenderPipeline() {
    return api.get<{ status: string; count: number; total_value: number }[]>('/api/analytics/pipeline');
  },

  getMonthlySpend(months = 12) {
    return api.get<{ month: string; spend: number; contract_count: number }[]>('/api/analytics/monthly-spend', { months });
  },

  getVendorConcentration() {
    return api.get<{ vendor_name: string; total_value: number; percentage: number }[]>('/api/analytics/concentration');
  },

  getSavingsAnalysis() {
    return api.get<{ tender_number: string; title: string; estimated: number; lowest_bid: number; saving: number; saving_pct: number }[]>('/api/analytics/savings');
  },

  // Vendor analytics
  getVendorDashboardStats() {
    return api.get<any>('/api/analytics/vendor-stats');
  },

  // PDF export
  exportProcurementReport() {
    return api.get<Response>('/api/analytics/export/procurement-report');
  },

  // Efficiency & compliance
  getEfficiencyMetrics() {
    return api.get<EfficiencyMetrics>('/api/analytics/efficiency');
  },

  getComplianceMetrics() {
    return api.get<ComplianceMetrics>('/api/analytics/compliance');
  },

  // Admin stats
  getAdminStats() {
    return api.get<AdminDashboardStats>('/api/admin/stats');
  },
};