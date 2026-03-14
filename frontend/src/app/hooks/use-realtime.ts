// Realtime event hooks — bid updates, tender transitions, typing indicators
// These hooks subscribe to Socket.io events scoped to specific tenders/rooms

import { useEffect, useState, useCallback } from 'react';
import { getSocket, connectSocket } from '../lib/socket';
import type { SocketEvents, SocketEventName } from '../lib/socket';

// ── Generic event listener hook ────────────────────────────────

export function useSocketEvent<K extends SocketEventName>(
  event: K,
  handler: (data: SocketEvents[K]) => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;
    connectSocket();
    const socket = getSocket();
    socket.on(event, handler as any);
    return () => { socket.off(event, handler as any); };
  }, [event, handler, enabled]);
}

// ── Bid Updates (for RFQ Monitoring pages) ─────────────────────

export function useBidUpdates(tenderId: string | undefined) {
  const [updates, setUpdates] = useState<SocketEvents['bid_update'][]>([]);

  useSocketEvent('bid_update', useCallback((data) => {
    if (data.tender_id === tenderId) {
      setUpdates(prev => [data, ...prev.slice(0, 99)]);
    }
  }, [tenderId]), !!tenderId);

  return updates;
}

// ── Tender Status Updates ──────────────────────────────────────

export function useTenderUpdates(tenderId: string | undefined) {
  const [latestUpdate, setLatestUpdate] = useState<SocketEvents['tender_update'] | null>(null);

  useSocketEvent('tender_update', useCallback((data) => {
    if (data.tender_id === tenderId) {
      setLatestUpdate(data);
    }
  }, [tenderId]), !!tenderId);

  return latestUpdate;
}

// ── Workflow Transitions ───────────────────────────────────────

export function useWorkflowTransitions(tenderId: string | undefined) {
  const [transitions, setTransitions] = useState<SocketEvents['workflow_transition'][]>([]);

  useSocketEvent('workflow_transition', useCallback((data) => {
    if (data.tender_id === tenderId) {
      setTransitions(prev => [data, ...prev.slice(0, 49)]);
    }
  }, [tenderId]), !!tenderId);

  return transitions;
}

// ── Evaluation Complete Events ─────────────────────────────────

export function useEvalCompleteEvents(tenderId: string | undefined) {
  const [events, setEvents] = useState<SocketEvents['eval_complete'][]>([]);

  useSocketEvent('eval_complete', useCallback((data) => {
    if (data.tender_id === tenderId) {
      setEvents(prev => [data, ...prev]);
    }
  }, [tenderId]), !!tenderId);

  return events;
}

// ── Global Notification Count Badge ────────────────────────────

export function useNotificationBadge() {
  const [count, setCount] = useState(0);

  useSocketEvent('notification', useCallback(() => {
    setCount(n => n + 1);
  }, []), true);

  const resetCount = useCallback(() => setCount(0), []);

  return { count, resetCount };
}
