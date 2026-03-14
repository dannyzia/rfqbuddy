// Centralized API client for all backend calls
// All fetch calls go through this — handles auth, errors, and base URL

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, params, headers: customHeaders, ...rest } = options;

  // Build URL with query params
  const url = new URL(`${API_BASE}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v));
    });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  const res = await fetch(url.toString(), {
    ...rest,
    headers,
    credentials: 'include', // Better Auth session cookie
    body: body ? JSON.stringify(body) : undefined,
  });

  // Handle non-JSON responses (PDF, etc.)
  const contentType = res.headers.get('Content-Type') ?? '';
  if (!contentType.includes('application/json')) {
    if (!res.ok) throw new ApiError(res.status, `Request failed: ${res.statusText}`);
    return res as unknown as T;
  }

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(res.status, data.error ?? 'Request failed', data.details);
  }

  return data as T;
}

// ── HTTP method helpers ────────────────────────────────────────

export const api = {
  get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>) {
    return request<T>(endpoint, { method: 'GET', params });
  },

  post<T>(endpoint: string, body?: unknown) {
    return request<T>(endpoint, { method: 'POST', body });
  },

  patch<T>(endpoint: string, body?: unknown) {
    return request<T>(endpoint, { method: 'PATCH', body });
  },

  put<T>(endpoint: string, body?: unknown) {
    return request<T>(endpoint, { method: 'PUT', body });
  },

  delete<T>(endpoint: string) {
    return request<T>(endpoint, { method: 'DELETE' });
  },
};

export { ApiError };
export type { RequestOptions };
