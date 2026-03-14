// Lightweight data-fetching hooks — no external dependency required
// Provides useApiQuery (GET) and useApiMutation (POST/PATCH/DELETE)

import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiError } from './api-client';

// ── useApiQuery — for GET requests ─────────────────────────────

interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface QueryOptions {
  /** Skip the initial fetch (useful for conditional queries) */
  enabled?: boolean;
  /** Refetch interval in ms (polling) */
  refetchInterval?: number;
}

export function useApiQuery<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  options: QueryOptions = {},
): QueryState<T> {
  const { enabled = true, refetchInterval } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const execute = useCallback(async () => {
    if (!mountedRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      if (mountedRef.current) {
        setData(result);
      }
    } catch (err: any) {
      if (mountedRef.current) {
        setError(err instanceof ApiError ? err.message : err.message ?? 'Request failed');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true;
    if (enabled) {
      execute();
    }
    return () => { mountedRef.current = false; };
  }, [execute, enabled]);

  // Polling
  useEffect(() => {
    if (!refetchInterval || !enabled) return;
    const interval = setInterval(execute, refetchInterval);
    return () => clearInterval(interval);
  }, [execute, refetchInterval, enabled]);

  return { data, loading, error, refetch: execute };
}

// ── useApiMutation — for POST/PATCH/DELETE ─────────────────────

interface MutationState<T, V> {
  data: T | null;
  loading: boolean;
  error: string | null;
  mutate: (variables: V) => Promise<T>;
  reset: () => void;
}

export function useApiMutation<T, V = void>(
  mutationFn: (variables: V) => Promise<T>,
): MutationState<T, V> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mutationFnRef = useRef(mutationFn);
  mutationFnRef.current = mutationFn;

  const mutate = useCallback(async (variables: V): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutationFnRef.current(variables);
      setData(result);
      return result;
    } catch (err: any) {
      const message = err instanceof ApiError ? err.message : err.message ?? 'Request failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, mutate, reset };
}

// ── useOptimisticList — optimistic updates for lists ───────────

export function useOptimisticList<T extends { id: string }>(
  initial: T[] = [],
) {
  const [items, setItems] = useState<T[]>(initial);

  // Sync when initial data arrives
  useEffect(() => {
    if (initial.length > 0) setItems(initial);
  }, [initial]);

  const addOptimistic = useCallback((item: T) => {
    setItems(prev => [item, ...prev]);
  }, []);

  const updateOptimistic = useCallback((id: string, updates: Partial<T>) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const removeOptimistic = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const replaceAll = useCallback((newItems: T[]) => {
    setItems(newItems);
  }, []);

  return { items, addOptimistic, updateOptimistic, removeOptimistic, replaceAll };
}
