import { api } from '../api-client';
import type { Contract, ContractMilestone, ContractVariation, ContractPerformanceRating, ContractAuditEvent } from '../api-types';

export const contractsApi = {
  list() {
    return api.get<Contract[]>('/api/contracts');
  },

  getById(id: string) {
    return api.get<Contract>(`/api/contracts/${id}`);
  },

  generate(data: { tender_id: string; bid_id: string }) {
    return api.post<Contract>('/api/contracts', data);
  },

  update(id: string, data: Partial<Contract>) {
    return api.patch<Contract>(`/api/contracts/${id}`, data);
  },

  // Milestones
  getMilestones(contractId: string) {
    return api.get<ContractMilestone[]>(`/api/contracts/${contractId}/milestones`);
  },

  createMilestone(contractId: string, data: { title: string; due_date: string; amount?: string; description?: string }) {
    return api.post<ContractMilestone>(`/api/contracts/${contractId}/milestones`, data);
  },

  updateMilestoneStatus(contractId: string, milestoneId: string, status: string) {
    return api.patch<ContractMilestone>(`/api/contracts/${contractId}/milestones/${milestoneId}`, { status });
  },

  // Variations
  submitVariation(contractId: string, data: { reason: string; amount_change?: string; time_extension_days?: number }) {
    return api.post<ContractVariation>(`/api/contracts/${contractId}/variations`, data);
  },

  approveVariation(contractId: string, variationId: string, approved: boolean) {
    return api.patch(`/api/contracts/${contractId}/variations/${variationId}`, { approved });
  },

  // Payments
  submitPayment(contractId: string, data: { amount: string; milestone_id?: string }) {
    return api.post(`/api/contracts/${contractId}/payments`, data);
  },

  // Performance Ratings
  getPerformanceRating(contractId: string) {
    return api.get<ContractPerformanceRating>(`/api/contracts/${contractId}/performance`);
  },

  submitPerformanceRating(contractId: string, data: { ratings: Record<string, number>; strengths: string; improvements: string; status: 'draft' | 'submitted' }) {
    return api.post<ContractPerformanceRating>(`/api/contracts/${contractId}/performance`, data);
  },

  // Audit History
  getAuditHistory(contractId: string) {
    return api.get<ContractAuditEvent[]>(`/api/contracts/${contractId}/history`);
  },
};