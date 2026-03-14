// useApiOrMock — graceful fallback to mock data when backend is unavailable
// When VITE_USE_MOCK=true or when the API call fails, returns the mock data.
// This allows all prototype pages to work in both modes seamlessly.

import { useState, useEffect, useRef, useCallback } from 'react';
import { env } from './env';
import { ApiError } from './api-client';

interface ApiOrMockState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  isUsingMock: boolean;
  refetch: () => void;
}

/**
 * Fetches from the real API, falling back to `mockData` if:
 *   - VITE_USE_MOCK=true (prototype mode)
 *   - The API call throws (backend not running)
 *
 * @param fetcher  — async function calling the real API
 * @param mockData — static fallback data (always returned in prototype mode)
 * @param deps     — dependency array to re-fetch on change
 */
export function useApiOrMock<T>(
  fetcher: () => Promise<T>,
  mockData: T,
  deps: unknown[] = [],
): ApiOrMockState<T> {
  const [data, setData] = useState<T>(mockData);
  const [loading, setLoading] = useState(!env.USE_MOCK);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMock, setIsUsingMock] = useState(env.USE_MOCK);
  const mountedRef = useRef(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const execute = useCallback(async () => {
    // Short-circuit in mock mode
    if (env.USE_MOCK) {
      setData(mockData);
      setIsUsingMock(true);
      setLoading(false);
      return;
    }

    if (!mountedRef.current) return;
    setLoading(true);
    setError(null);

    try {
      const result = await fetcherRef.current();
      if (mountedRef.current) {
        setData(result);
        setIsUsingMock(false);
      }
    } catch (err: any) {
      if (mountedRef.current) {
        // Fall back to mock data on error
        const msg = err instanceof ApiError ? err.message : err.message ?? 'API unavailable';
        console.warn(`[useApiOrMock] Falling back to mock data: ${msg}`);
        setData(mockData);
        setIsUsingMock(true);
        setError(msg);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true;
    execute();
    return () => { mountedRef.current = false; };
  }, [execute]);

  return { data, loading, error, isUsingMock, refetch: execute };
}

/**
 * Same as useApiOrMock but for paginated list responses.
 * Wraps mockData into { items, total, page, pageSize } shape.
 */
export function useApiOrMockList<T>(
  fetcher: () => Promise<{ items: T[]; total: number; page: number; pageSize: number }>,
  mockItems: T[],
  deps: unknown[] = [],
) {
  const mockPaginated = {
    items: mockItems,
    total: mockItems.length,
    page: 1,
    pageSize: mockItems.length,
  };
  return useApiOrMock(fetcher, mockPaginated, deps);
}
