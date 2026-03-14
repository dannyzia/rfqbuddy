// Tender data hooks — list, detail, create, update, publish, forward

import { useCallback } from 'react';
import { useApiQuery, useApiMutation } from '../lib/use-api';
import { tendersApi } from '../lib/api/tenders.api';
import { toast } from 'sonner';
import type { Tender, PaginatedResponse } from '../lib/api-types';

// ── List Tenders ───────────────────────────────────────────────

export function useTenderList(params?: {
  status?: string; search?: string; page?: number; pageSize?: number;
}) {
  return useApiQuery<PaginatedResponse<Tender>>(
    () => tendersApi.list(params),
    [params?.status, params?.search, params?.page, params?.pageSize],
  );
}

// ── Single Tender ──────────────────────────────────────────────

export function useTender(id: string | undefined) {
  return useApiQuery<Tender>(
    () => tendersApi.getById(id!),
    [id],
    { enabled: !!id },
  );
}

// ── Create Tender ──────────────────────────────────────────────

export function useCreateTender() {
  const mutation = useApiMutation<Tender, Partial<Tender>>(
    (data) => tendersApi.create(data),
  );

  const create = useCallback(async (data: Partial<Tender>) => {
    const result = await mutation.mutate(data);
    toast.success(`Tender ${result.tender_number} created`);
    return result;
  }, [mutation]);

  return { ...mutation, create };
}

// ── Update Tender ──────────────────────────────────────────────

export function useUpdateTender(id: string) {
  const mutation = useApiMutation<Tender, Partial<Tender>>(
    (data) => tendersApi.update(id, data),
  );

  const update = useCallback(async (data: Partial<Tender>) => {
    const result = await mutation.mutate(data);
    toast.success('Tender updated');
    return result;
  }, [mutation]);

  return { ...mutation, update };
}

// ── Publish Tender ─────────────────────────────────────────────

export function usePublishTender() {
  return useApiMutation<Tender, string>(
    async (id) => {
      const result = await tendersApi.publish(id);
      toast.success(`Tender ${result.tender_number} published`);
      return result;
    },
  );
}

// ── Close Tender ───────────────────────────────────────────────

export function useCloseTender() {
  return useApiMutation<Tender, string>(
    async (id) => {
      const result = await tendersApi.close(id);
      toast.success(`Tender ${result.tender_number} closed`);
      return result;
    },
  );
}

// ── Forward Tender ─────────────────────────────────────────────

export function useForwardTender() {
  return useApiMutation<Tender, { id: string; to_stage: string; to_user_id: string; notes: string }>(
    async ({ id, ...data }) => {
      const result = await tendersApi.forward(id, data);
      toast.success(`Tender forwarded to ${data.to_stage}`);
      return result;
    },
  );
}

// ── Delete Tender ──────────────────────────────────────────────

export function useDeleteTender() {
  return useApiMutation<{ success: true }, string>(
    async (id) => {
      const result = await tendersApi.remove(id);
      toast.success('Tender deleted');
      return result;
    },
  );
}
