// Support ticket hooks — list, detail, create, reply, update

import { useApiQuery, useApiMutation } from '../lib/use-api';
import { ticketsApi } from '../lib/api/tickets.api';
import { toast } from 'sonner';
import type { SupportTicket, TicketMessage } from '../lib/api-types';

export function useTicketList() {
  return useApiQuery<SupportTicket[]>(() => ticketsApi.list(), []);
}

export function useTicket(id: string | undefined) {
  return useApiQuery(
    () => ticketsApi.getById(id!),
    [id],
    { enabled: !!id },
  );
}

export function useCreateTicket() {
  return useApiMutation<SupportTicket, { subject: string; description: string; type?: string; priority?: string }>(
    async (data) => {
      const result = await ticketsApi.create(data);
      toast.success(`Ticket ${result.ticket_number} submitted`);
      return result;
    },
  );
}

export function useAddTicketMessage(ticketId: string) {
  return useApiMutation<TicketMessage, { message: string; isInternal?: boolean }>(
    async ({ message, isInternal }) => {
      const result = await ticketsApi.addMessage(ticketId, message, isInternal);
      toast.success('Reply sent');
      return result;
    },
  );
}

export function useUpdateTicket() {
  return useApiMutation<SupportTicket, { ticketId: string; data: Partial<SupportTicket> }>(
    async ({ ticketId, data }) => {
      const result = await ticketsApi.update(ticketId, data);
      toast.success('Ticket updated');
      return result;
    },
  );
}
