// Vendor management hooks — list, profile, enlistment, reviews, SRM

import { useApiQuery, useApiMutation } from '../lib/use-api';
import { vendorsApi } from '../lib/api/vendors.api';
import { toast } from 'sonner';
import type { Organization } from '../lib/api-types';

// ── Vendor List (Buyer view) ──────────────────────────────────

export function useVendorList() {
  return useApiQuery<Organization[]>(() => vendorsApi.list(), []);
}

// ── Vendor Profile ─────────────────────────────────────────────

export function useVendorProfile(orgId: string | undefined) {
  return useApiQuery(
    () => vendorsApi.getProfile(orgId!),
    [orgId],
    { enabled: !!orgId },
  );
}

// ── Enlistment ─────────────────────────────────────────────────

export function useSubmitEnlistment() {
  return useApiMutation<unknown, { buyer_org_id: string; submitted_data: object }>(
    async (data) => {
      const result = await vendorsApi.submitEnlistment(data);
      toast.success('Enlistment application submitted');
      return result;
    },
  );
}

export function useReviewEnlistment() {
  return useApiMutation<unknown, { enlistmentId: string; approved: boolean }>(
    async ({ enlistmentId, approved }) => {
      const result = await vendorsApi.reviewEnlistment(enlistmentId, approved);
      toast.success(approved ? 'Enlistment approved' : 'Enlistment rejected');
      return result;
    },
  );
}

// ── Performance Reviews ────────────────────────────────────────

export function useVendorReviews(orgId: string | undefined) {
  return useApiQuery(
    () => vendorsApi.getReviews(orgId!),
    [orgId],
    { enabled: !!orgId },
  );
}

export function useSubmitVendorReview() {
  return useApiMutation<unknown, {
    vendor_org_id: string;
    contract_id?: string;
    quality_score: string;
    delivery_score: string;
    communication_score: string;
    comments?: string;
    review_period?: string;
  }>(
    async (data) => {
      const result = await vendorsApi.submitReview(data);
      toast.success('Performance review submitted');
      return result;
    },
  );
}

// ── SRM Score ──────────────────────────────────────────────────

export function useVendorSRM(orgId: string | undefined) {
  return useApiQuery(
    () => vendorsApi.getSRM(orgId!),
    [orgId],
    { enabled: !!orgId },
  );
}
