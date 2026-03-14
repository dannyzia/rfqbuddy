// Organisation management hooks — list, detail, members, CRUD

import { useApiQuery, useApiMutation } from '../lib/use-api';
import { orgsApi } from '../lib/api/orgs.api';
import { toast } from 'sonner';
import type { Organization, OrgMember, PaginatedResponse } from '../lib/api-types';

// ── List ────────────────────────────────────────────────────────

export function useOrgList(params?: { type?: string; status?: string; page?: number; pageSize?: number }) {
  return useApiQuery<PaginatedResponse<Organization>>(
    () => orgsApi.list(params),
    [params?.type, params?.status, params?.page, params?.pageSize],
  );
}

// ── Detail ──────────────────────────────────────────────────────

export function useOrg(id: string | undefined) {
  return useApiQuery(
    () => orgsApi.getById(id!),
    [id],
    { enabled: !!id },
  );
}

// ── Create ──────────────────────────────────────────────────────

export function useCreateOrg() {
  return useApiMutation<Organization, { name: string; type: 'procuring_entity' | 'vendor'; [k: string]: unknown }>(
    async (data) => {
      const result = await orgsApi.create(data);
      toast.success(`Organisation "${result.name}" created`);
      return result;
    },
  );
}

// ── Update ──────────────────────────────────────────────────────

export function useUpdateOrg(id: string) {
  return useApiMutation<Organization, Partial<Organization>>(
    async (data) => {
      const result = await orgsApi.update(id, data);
      toast.success('Organisation updated');
      return result;
    },
  );
}

// ── Approval ────────────────────────────────────────────────────

export function useApproveOrg() {
  return useApiMutation<Organization, string>(
    async (id) => {
      const result = await orgsApi.approve(id);
      toast.success(`Organisation "${result.name}" approved`);
      return result;
    },
  );
}

export function useRejectOrg() {
  return useApiMutation<Organization, string>(
    async (id) => {
      const result = await orgsApi.reject(id);
      toast.info('Organisation rejected');
      return result;
    },
  );
}

export function useSuspendOrg() {
  return useApiMutation<Organization, string>(
    async (id) => {
      const result = await orgsApi.suspend(id);
      toast.warning('Organisation suspended');
      return result;
    },
  );
}

// ── Members ─────────────────────────────────────────────────────

export function useOrgMembers(orgId: string | undefined) {
  return useApiQuery<OrgMember[]>(
    () => orgsApi.getMembers(orgId!),
    [orgId],
    { enabled: !!orgId },
  );
}

export function useAddOrgMember(orgId: string) {
  return useApiMutation<unknown, { userId: string; role: string }>(
    async ({ userId, role }) => {
      const result = await orgsApi.addMember(orgId, userId, role);
      toast.success('Member added');
      return result;
    },
  );
}

export function useRemoveOrgMember(orgId: string) {
  return useApiMutation<unknown, string>(
    async (userId) => {
      await orgsApi.removeMember(orgId, userId);
      toast.success('Member removed');
    },
  );
}

export function useUpdateMemberRole(orgId: string) {
  return useApiMutation<unknown, { userId: string; role: string }>(
    async ({ userId, role }) => {
      await orgsApi.updateMemberRole(orgId, userId, role);
      toast.success('Role updated');
    },
  );
}
