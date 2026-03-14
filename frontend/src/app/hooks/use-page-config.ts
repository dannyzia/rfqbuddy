import { useState, useEffect, useCallback, useRef } from "react";
import { RFQ_PAGE_CONFIG, type RfqPageConfig } from "../config/rfq-page-config";

// ─── Server-side query params (ready for real API) ──────────────────────────
// In production: GET /api/v1/config?sort=bids&dir=desc&page=2&size=20&q=office&status=Active&type=Goods

export interface ServerQueryParams {
  sort?: string | null;   // column sortKey
  dir?: "asc" | "desc";   // sort direction
  page?: number;           // 1-based page number
  size?: number;           // page size
  q?: string;              // search query
  status?: string;         // status filter
  type?: string;           // type filter
}

/** Build a query string from params (omits defaults/empty) */
export function buildQueryString(params: ServerQueryParams): string {
  const parts: string[] = [];
  if (params.sort) parts.push(`sort=${encodeURIComponent(params.sort)}`);
  if (params.dir && params.dir !== "asc") parts.push(`dir=${params.dir}`);
  if (params.page && params.page > 1) parts.push(`page=${params.page}`);
  if (params.size && params.size !== 10) parts.push(`size=${params.size}`);
  if (params.q) parts.push(`q=${encodeURIComponent(params.q)}`);
  if (params.status && params.status !== "all") parts.push(`status=${encodeURIComponent(params.status)}`);
  if (params.type && params.type !== "all") parts.push(`type=${encodeURIComponent(params.type)}`);
  return parts.length ? `?${parts.join("&")}` : "";
}

// ─── Hook ───────────────────────────────────────────────────────────────────

interface UsePageConfigReturn {
  config: RfqPageConfig | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  retry: () => void;
  /** The query string that WOULD be sent to a real API */
  apiQueryString: string;
}

// Simulate network latency (ms)
const SIMULATED_DELAY = 600;

// Set to true to simulate an API error for testing
let simulateError = false;

export function usePageConfig(params?: ServerQueryParams): UsePageConfigReturn {
  const [config, setConfig] = useState<RfqPageConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Build API query string (logged in dev, used by real API later)
  const apiQueryString = buildQueryString(params ?? {});

  // Track previous query string to avoid re-fetching on every render
  const prevQs = useRef(apiQueryString);

  const fetchConfig = useCallback(() => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);

    // In production, this would be: fetch(`/api/v1/config${apiQueryString}`)
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[usePageConfig] mock GET /api/v1/config${apiQueryString}`);
    }

    // Simulate async API call
    const timer = setTimeout(() => {
      if (simulateError) {
        setIsError(true);
        setErrorMessage("Network error — please check connection");
        setIsLoading(false);
        // Turn off error simulation after first trigger so retry works
        simulateError = false;
      } else {
        setConfig(RFQ_PAGE_CONFIG);
        setIsLoading(false);
      }
    }, SIMULATED_DELAY);

    return () => clearTimeout(timer);
  }, [retryCount]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initial fetch
  useEffect(() => {
    const cleanup = fetchConfig();
    return cleanup;
  }, [fetchConfig]);

  // Log param changes (in production this would trigger a re-fetch)
  useEffect(() => {
    if (prevQs.current !== apiQueryString) {
      prevQs.current = apiQueryString;
      if (process.env.NODE_ENV !== "production") {
        console.debug(`[usePageConfig] params changed → /api/v1/config${apiQueryString}`);
      }
      // In production: re-fetch with new params
      // fetchConfig();
    }
  }, [apiQueryString]);

  const retry = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

  return { config, isLoading, isError, errorMessage, retry, apiQueryString };
}
