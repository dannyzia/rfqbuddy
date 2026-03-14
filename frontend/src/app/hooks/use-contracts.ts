// Contract management hooks — list, detail, milestones, variations, payments

import { useApiQuery, useApiMutation } from '../lib/use-api';
import { contractsApi } from '../lib/api/contracts.api';
import { toast } from 'sonner';
import type { Contract, ContractMilestone, ContractVariation, ContractPerformanceRating, ContractAuditEvent } from '../lib/api-types';

// ── List & Detail ──────────────────────────────────────────────

export function useContractList() {
  return useApiQuery<Contract[]>(() => contractsApi.list(), []);
}

export function useContract(id: string | undefined) {
  return useApiQuery<Contract>(
    () => contractsApi.getById(id!),
    [id],
    { enabled: !!id },
  );
}

// ── Generate Contract ──────────────────────────────────────────

export function useGenerateContract() {
  return useApiMutation<Contract, { tender_id: string; bid_id: string }>(
    async (data) => {
      const result = await contractsApi.generate(data);
      toast.success(`Contract ${result.contract_number} generated`);
      return result;
    },
  );
}

// ── Update Contract ────────────────────────────────────────────

export function useUpdateContract(id: string) {
  return useApiMutation<Contract, Partial<Contract>>(
    async (data) => {
      const result = await contractsApi.update(id, data);
      toast.success('Contract updated');
      return result;
    },
  );
}

// ── Milestones ─────────────────────────────────────────────────

export function useContractMilestones(contractId: string | undefined) {
  return useApiQuery<ContractMilestone[]>(
    () => contractsApi.getMilestones(contractId!),
    [contractId],
    { enabled: !!contractId },
  );
}

export function useCreateMilestone(contractId: string) {
  return useApiMutation<ContractMilestone, { title: string; due_date: string; amount?: string; description?: string }>(
    async (data) => {
      const result = await contractsApi.createMilestone(contractId, data);
      toast.success(`Milestone "${result.title}" created`);
      return result;
    },
  );
}

export function useUpdateMilestoneStatus(contractId: string) {
  return useApiMutation<ContractMilestone, { milestoneId: string; status: string }>(
    async ({ milestoneId, status }) => {
      const result = await contractsApi.updateMilestoneStatus(contractId, milestoneId, status);
      toast.success(`Milestone status updated to ${status}`);
      return result;
    },
  );
}

// ── Variations ─────────────────────────────────────────────────

export function useSubmitVariation(contractId: string) {
  return useApiMutation<ContractVariation, { reason: string; amount_change?: string; time_extension_days?: number }>(
    async (data) => {
      const result = await contractsApi.submitVariation(contractId, data);
      toast.success('Variation request submitted');
      return result;
    },
  );
}

export function useApproveVariation(contractId: string) {
  return useApiMutation<unknown, { variationId: string; approved: boolean }>(
    async ({ variationId, approved }) => {
      const result = await contractsApi.approveVariation(contractId, variationId, approved);
      toast.success(approved ? 'Variation approved' : 'Variation rejected');
      return result;
    },
  );
}

// ── Payments ───────────────────────────────────────────────────

export function useSubmitPayment(contractId: string) {
  return useApiMutation<unknown, { amount: string; milestone_id?: string }>(
    async (data) => {
      const result = await contractsApi.submitPayment(contractId, data);
      toast.success('Payment certificate submitted');
      return result;
    },
  );
}

// ── Performance Rating ─────────────────────────────────────────

export function useContractPerformance(contractId: string | undefined) {
  return useApiQuery<ContractPerformanceRating>(
    () => contractsApi.getPerformanceRating(contractId!),
    [contractId],
    { enabled: !!contractId },
  );
}

export function useSubmitPerformanceRating(contractId: string) {
  return useApiMutation<ContractPerformanceRating, { ratings: Record<string, number>; strengths: string; improvements: string; status: 'draft' | 'submitted' }>(
    async (data) => {
      const result = await contractsApi.submitPerformanceRating(contractId, data);
      toast.success(data.status === 'submitted' ? 'Performance rating submitted' : 'Rating draft saved');
      return result;
    },
  );
}

// ── Audit History ──────────────────────────────────────────────

export function useContractHistory(contractId: string | undefined) {
  return useApiQuery<ContractAuditEvent[]>(
    () => contractsApi.getAuditHistory(contractId!),
    [contractId],
    { enabled: !!contractId },
  );
}