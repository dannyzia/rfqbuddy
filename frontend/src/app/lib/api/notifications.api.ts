import { api } from '../api-client';
import type { Notification } from '../api-types';

export const notificationsApi = {
  list(unreadOnly = false) {
    return api.get<Notification[]>('/api/notifications', { unread: unreadOnly ? 'true' : undefined });
  },

  getUnreadCount() {
    return api.get<{ count: number }>('/api/notifications/unread-count');
  },

  markAsRead(id: string) {
    return api.post<{ success: true }>(`/api/notifications/${id}/read`);
  },

  markAllRead() {
    return api.post<{ success: true }>('/api/notifications/read-all');
  },
};
