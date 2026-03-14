// Realtime notification hook — Socket.io + REST API
// Provides unread count, notification list, and toast on new notifications

import { useEffect, useState, useCallback } from 'react';
import { notificationsApi } from '../lib/api/notifications.api';
import { useApiQuery } from '../lib/use-api';
import { toast } from 'sonner';
import { env } from '../lib/env';
import type { Notification } from '../lib/api-types';

// Lazy-load socket to avoid crashing environments where socket.io can't connect
let socketModule: typeof import('../lib/socket') | null = null;
async function loadSocket() {
  if (!socketModule) {
    socketModule = await import('../lib/socket');
  }
  return socketModule;
}

interface SocketNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  payload?: object;
}

// ─── Mock notifications for prototype mode ──────────────────────

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'New bid submitted', body: 'ABC Corp submitted a bid on PG-2026-001', type: 'bid', read_at: null, created_at: new Date(Date.now() - 5 * 60000).toISOString() } as any,
  { id: 'n2', title: 'Deadline reminder', body: 'PW-2026-015 closes in 2 days', type: 'deadline', read_at: null, created_at: new Date(Date.now() - 60 * 60000).toISOString() } as any,
  { id: 'n3', title: 'Vendor approved', body: 'XYZ Construction Ltd has been approved', type: 'vendor', read_at: new Date().toISOString(), created_at: new Date(Date.now() - 3 * 3600000).toISOString() } as any,
  { id: 'n4', title: 'Role assignment', body: "You've been assigned as Technical Evaluator for PG-2026-002", type: 'role', read_at: new Date().toISOString(), created_at: new Date(Date.now() - 86400000).toISOString() } as any,
];

export function useNotifications(userId: string | undefined) {
  const [unreadCount, setUnreadCount] = useState(env.USE_MOCK ? 2 : 0);
  const [realtimeNotifications, setRealtimeNotifications] = useState<SocketNotification[]>([]);
  const [mockNotifs] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  // ─── Mock mode: skip all API/socket calls ────────────────────
  const isMock = env.USE_MOCK;

  // Fetch unread count from REST API (skipped in mock mode)
  const { data: countData, refetch: refetchCount } = useApiQuery(
    () => notificationsApi.getUnreadCount(),
    [userId],
    { enabled: !!userId && !isMock, refetchInterval: 60_000 },
  );

  // Fetch notification list (skipped in mock mode)
  const { data: notifications, loading, refetch: refetchList } = useApiQuery(
    () => notificationsApi.list(),
    [userId],
    { enabled: !!userId && !isMock },
  );

  // Update unread count from REST
  useEffect(() => {
    if (countData && !isMock) setUnreadCount(countData.count);
  }, [countData, isMock]);

  // Socket.io realtime — only connect when NOT in mock mode
  useEffect(() => {
    if (!userId || isMock) return;

    let cleanup = () => {};

    loadSocket().then((mod) => {
      mod.connectSocket();
      const socket = mod.getSocket();

      const handleNotification = (payload: SocketNotification) => {
        setUnreadCount(n => n + 1);
        setRealtimeNotifications(prev => [payload, ...prev.slice(0, 49)]);
        toast.info(payload.title, {
          description: payload.body,
          duration: 5000,
        });
      };

      socket.on('notification', handleNotification);

      cleanup = () => {
        socket.off('notification', handleNotification);
      };
    }).catch((err) => {
      console.warn('[useNotifications] Socket.io unavailable:', err.message);
    });

    return () => cleanup();
  }, [userId, isMock]);

  // Mark as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (isMock) {
      setUnreadCount(n => Math.max(0, n - 1));
      return;
    }
    await notificationsApi.markAsRead(notificationId);
    setUnreadCount(n => Math.max(0, n - 1));
    refetchList();
  }, [refetchList, isMock]);

  // Mark all as read
  const markAllRead = useCallback(async () => {
    if (isMock) {
      setUnreadCount(0);
      return;
    }
    await notificationsApi.markAllRead();
    setUnreadCount(0);
    refetchList();
  }, [refetchList, isMock]);

  // Disconnect on unmount (only if we connected)
  useEffect(() => {
    if (isMock) return;
    return () => {
      loadSocket().then((mod) => mod.disconnectSocket()).catch(() => {});
    };
  }, [isMock]);

  return {
    notifications: isMock ? mockNotifs : (notifications ?? []),
    realtimeNotifications,
    unreadCount,
    loading: isMock ? false : loading,
    markAsRead,
    markAllRead,
    refetch: () => { if (!isMock) { refetchCount(); refetchList(); } },
  };
}