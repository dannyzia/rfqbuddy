// Bid data hooks — list, detail, create, submit, withdraw

import { useCallback } from 'react';
import { useApiQuery, useApiMutation } from '../lib/use-api';
import { bidsApi } from '../lib/api/bids.api';
import { toast } from 'sonner';
import type { Bid, BidItem } from '../lib/api-types';

// ── My Bids (Vendor) ──────────────────────────────────────────

export function useMyBids() {
  return useApiQuery<Bid[]>(
    () => bidsApi.list(),
    [],
  );
}

// ── Bids for a Tender (Buyer) ──────────────────────────────────

export function useTenderBids(tenderId: string | undefined) {
  return useApiQuery<Bid[]>(
    () => bidsApi.listByTender(tenderId!),
    [tenderId],
    { enabled: !!tenderId },
  );
}

// ── Single Bid ────────────────────────────────────────────────

export function useBid(id: string | undefined) {
  return useApiQuery<Bid>(
    () => bidsApi.getById(id!),
    [id],
    { enabled: !!id },
  );
}

// ── Create Bid (start a draft) ────────────────────────────────

export function useCreateBid() {
  const mutation = useApiMutation<Bid, { tender_id: string }>(
    (data) => bidsApi.create(data),
  );

  const create = useCallback(async (tenderId: string) => {
    const result = await mutation.mutate({ tender_id: tenderId });
    toast.success(`Bid ${result.bid_number} draft created`);
    return result;
  }, [mutation]);

  return { ...mutation, create };
}

// ── Add Bid Items ─────────────────────────────────────────────

export function useAddBidItems(bidId: string) {
  return useApiMutation<BidItem[], Partial<BidItem>[]>(
    (items) => bidsApi.addItems(bidId, items),
  );
}

// ── Submit Bid (lock it) ──────────────────────────────────────

export function useSubmitBid() {
  return useApiMutation<Bid, string>(
    async (id) => {
      const result = await bidsApi.submit(id);
      toast.success(`Bid ${result.bid_number} submitted successfully`);
      return result;
    },
  );
}

// ── Withdraw Bid ──────────────────────────────────────────────

export function useWithdrawBid() {
  return useApiMutation<Bid, string>(
    async (id) => {
      const result = await bidsApi.withdraw(id);
      toast.info(`Bid ${result.bid_number} withdrawn`);
      return result;
    },
  );
}
