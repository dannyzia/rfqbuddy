import { api } from '../api-client';
import type { ApiKey, WebhookConfig } from '../api-types';

export const developersApi = {
  // API Keys
  listApiKeys() {
    return api.get<ApiKey[]>('/api/developers/api-keys');
  },

  createApiKey(data: { name: string; env?: 'live' | 'test'; scopes?: string[] }) {
    return api.post<ApiKey & { secret: string }>('/api/developers/api-keys', data);
  },

  revokeApiKey(id: string) {
    return api.delete<{ success: true }>(`/api/developers/api-keys/${id}`);
  },

  // Webhooks
  listWebhooks() {
    return api.get<WebhookConfig[]>('/api/developers/webhooks');
  },

  createWebhook(data: { url: string; events: string[] }) {
    return api.post<WebhookConfig>('/api/developers/webhooks', data);
  },

  updateWebhook(id: string, data: Partial<Pick<WebhookConfig, 'url' | 'events' | 'is_active'>>) {
    return api.patch<WebhookConfig>(`/api/developers/webhooks/${id}`, data);
  },

  deleteWebhook(id: string) {
    return api.delete<{ success: true }>(`/api/developers/webhooks/${id}`);
  },

  toggleWebhook(id: string, isActive: boolean) {
    return api.patch<WebhookConfig>(`/api/developers/webhooks/${id}`, { is_active: isActive });
  },
};
