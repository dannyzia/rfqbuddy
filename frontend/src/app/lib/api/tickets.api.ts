import { api } from '../api-client';
import type { SupportTicket, TicketMessage } from '../api-types';

export const ticketsApi = {
  list() {
    return api.get<SupportTicket[]>('/api/tickets');
  },

  getById(id: string) {
    return api.get<{ ticket: SupportTicket; messages: TicketMessage[] }>(`/api/tickets/${id}`);
  },

  create(data: { subject: string; description: string; type?: string; priority?: string }) {
    return api.post<SupportTicket>('/api/tickets', data);
  },

  addMessage(ticketId: string, message: string, isInternal = false) {
    return api.post<TicketMessage>(`/api/tickets/${ticketId}/messages`, { message, is_internal: isInternal });
  },

  update(ticketId: string, data: Partial<SupportTicket>) {
    return api.patch<SupportTicket>(`/api/tickets/${ticketId}`, data);
  },
};
