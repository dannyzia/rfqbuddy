// Notification context — provides realtime notification state to the entire app
// Wraps useNotifications hook into a React context for sidebar badge, header bell, etc.

import { createContext, useContext, ReactNode } from 'react';
import { useNotifications } from '../hooks/use-notifications';
import { useAuth } from './auth-context';
import type { Notification } from '../lib/api-types';

interface RealtimeNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  payload?: object;
}

interface NotificationContextType {
  notifications: Notification[];
  realtimeNotifications: RealtimeNotification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  refetch: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  realtimeNotifications: [],
  unreadCount: 0,
  loading: false,
  markAsRead: async () => {},
  markAllRead: async () => {},
  refetch: () => {},
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const notificationState = useNotifications(user?.id);

  return (
    <NotificationContext.Provider value={notificationState}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  return useContext(NotificationContext);
}