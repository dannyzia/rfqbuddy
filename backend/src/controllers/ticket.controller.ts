import { FastifyRequest, FastifyReply } from 'fastify';
import { ticketService } from '../services/ticket.service';

export const ticketController = {
  async list(req: FastifyRequest, reply: FastifyReply) {
    const isAdmin = req.user.role === 'super_admin';
    const tickets = isAdmin
      ? await ticketService.listAll()
      : await ticketService.listByUser(req.user.id);
    return reply.send(tickets);
  },

  async getById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const result = await ticketService.getById(id);
    if (!result) return reply.code(404).send({ error: 'Ticket not found' });
    return reply.send(result);
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    const body = req.body as any;
    const ticket = await ticketService.create({
      subject: body.subject,
      description: body.description,
      type: body.type,
      priority: body.priority,
      submitted_by: req.user.id,
      org_id: req.user.org_id,
    });
    return reply.code(201).send(ticket);
  },

  async addMessage(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const { message, is_internal } = req.body as any;
    const msg = await ticketService.addMessage(id, req.user.id, message, is_internal ?? false);
    return reply.send(msg);
  },

  async update(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const body = req.body as any;
    const updated = await ticketService.update(id, body);
    return reply.send(updated);
  },
};
