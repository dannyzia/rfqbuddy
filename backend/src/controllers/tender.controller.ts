import { FastifyRequest, FastifyReply } from 'fastify';
import { tenderService } from '../services/tender.service';

export const tenderController = {
  async list(req: FastifyRequest, reply: FastifyReply) {
    const query = req.query as any;
    const result = await tenderService.list(req.user, {
      status: query.status, search: query.search,
      page: parseInt(query.page ?? '1'), pageSize: parseInt(query.pageSize ?? '20'),
    });
    return reply.send(result);
  },

  async getById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const tender = await tenderService.getById(id);
    if (!tender) return reply.code(404).send({ error: 'Tender not found' });
    return reply.send(tender);
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    const tender = await tenderService.create(req.body as any, req.user);
    return reply.code(201).send(tender);
  },

  async update(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const updated = await tenderService.update(id, req.body as any, req.user);
    return reply.send(updated);
  },

  async publish(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const updated = await tenderService.publish(id, req.user);
    return reply.send(updated);
  },

  async close(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const updated = await tenderService.close(id, req.user);
    return reply.send(updated);
  },

  async forward(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const { to_stage, to_user_id, notes } = req.body as any;
    const updated = await tenderService.forward(id, to_stage, to_user_id, notes, req.user);
    return reply.send(updated);
  },

  async remove(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    await tenderService.delete(id, req.user);
    return reply.send({ success: true });
  },

  // Withhold
  async withhold(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const { reason } = req.body as { reason: string };
    const updated = await tenderService.withhold(id, reason, req.user);
    return reply.send(updated);
  },

  // Line items
  async getItems(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const items = await tenderService.getItems(id);
    return reply.send(items);
  },

  async addItems(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const { items } = req.body as { items: any[] };
    const created = await tenderService.addItems(id, items, req.user);
    return reply.code(201).send(created);
  },

  // Invitations
  async getInvitations(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const invitations = await tenderService.getInvitations(id);
    return reply.send(invitations);
  },

  async invite(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const { vendor_org_ids } = req.body as { vendor_org_ids: string[] };
    const invitations = await tenderService.invite(id, vendor_org_ids, req.user);
    return reply.code(201).send(invitations);
  },

  async award(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const { bid_id, notes } = req.body as { bid_id: string; notes?: string };
    const updated = await tenderService.award(id, { bid_id, notes }, req.user);
    return reply.send(updated);
  },
};