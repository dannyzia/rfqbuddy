// Analytics hooks — procurement stats, spend, rankings, pipeline

import { useApiQuery } from '../lib/use-api';
import { analyticsApi } from '../lib/api/analytics.api';
import type { ProcurementStats, SpendByCategory, VendorRanking, AdminDashboardStats, EfficiencyMetrics, ComplianceMetrics } from '../lib/api-types';

export function useProcurementStats() {
  return useApiQuery<ProcurementStats>(() => analyticsApi.getProcurementStats(), []);
}

export function useSpendByCategory() {
  return useApiQuery<SpendByCategory[]>(() => analyticsApi.getSpendByCategory(), []);
}

export function useVendorRanking() {
  return useApiQuery<VendorRanking[]>(() => analyticsApi.getVendorRanking(), []);
}

export function useTenderPipeline() {
  return useApiQuery(
    () => analyticsApi.getTenderPipeline(),
    [],
  );
}

export function useMonthlySpend(months = 12) {
  return useApiQuery(
    () => analyticsApi.getMonthlySpend(months),
    [months],
  );
}

export function useVendorConcentration() {
  return useApiQuery(
    () => analyticsApi.getVendorConcentration(),
    [],
  );
}

export function useSavingsAnalysis() {
  return useApiQuery(
    () => analyticsApi.getSavingsAnalysis(),
    [],
  );
}

export function useVendorDashboardStats() {
  return useApiQuery(
    () => analyticsApi.getVendorDashboardStats(),
    [],
  );
}

export function useAdminDashboardStats() {
  return useApiQuery<AdminDashboardStats>(
    () => analyticsApi.getAdminStats(),
    [],
  );
}

export function useEfficiencyMetrics() {
  return useApiQuery<EfficiencyMetrics>(
    () => analyticsApi.getEfficiencyMetrics(),
    [],
  );
}

export function useComplianceMetrics() {
  return useApiQuery<ComplianceMetrics>(
    () => analyticsApi.getComplianceMetrics(),
    [],
  );
}