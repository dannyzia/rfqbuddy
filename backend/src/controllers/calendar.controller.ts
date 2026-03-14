import { FastifyRequest, FastifyReply } from 'fastify';
import { calendarService } from '../services/calendar.service';

export const calendarController = {
  async getEvents(req: FastifyRequest, reply: FastifyReply) {
    const { start, end } = req.query as { start: string; end: string };
    const orgId = req.user.org_id!;

    const events = await calendarService.getEvents(orgId, start, end);
    return reply.send(events);
  },
};
