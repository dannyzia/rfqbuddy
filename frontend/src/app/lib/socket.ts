// Socket.io client — realtime notifications, bid updates, workflow transitions
// Connects to the backend Socket.io server with session cookie auth

import { io, Socket } from 'socket.io-client';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

// Singleton socket instance — lazy-connected
let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_BASE, {
      withCredentials: true,       // Send session cookie
      autoConnect: false,          // Manual connect after auth
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message);
    });
  }

  return socket;
}

export function connectSocket(): void {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}

// ── Type-safe event listeners ──────────────────────────────────

export interface SocketEvents {
  notification: { id: string; type: string; title: string; body: string; payload?: object };
  bid_update: { tender_id: string; bid_id: string; status: string; vendor_name: string };
  tender_update: { tender_id: string; status: string; stage?: string };
  workflow_transition: { tender_id: string; from_stage: string; to_stage: string; from_user: string; to_user?: string };
  eval_complete: { tender_id: string; stage: string; results_count: number };
  typing: { room: string; user_id: string; user_name: string };
}

export type SocketEventName = keyof SocketEvents;
