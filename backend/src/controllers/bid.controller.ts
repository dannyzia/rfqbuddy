import { FastifyRequest, FastifyReply } from 'fastify';
import { bidService } from '../services/bid.service';

export const bidController = {
  async list(req: FastifyRequest, reply: FastifyReply) {
    const bids = await bidService.listByVendor(req.user.org_id!);
    return reply.send(bids);
  },

  async listByTender(req: FastifyRequest, reply: FastifyReply) {
    const { tenderId } = req.params as { tenderId: string };
    const bids = await bidService.listByTender(tenderId);
    return reply.send(bids);
  },

  async getById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const bid = await bidService.getById(id);
    if (!bid) return reply.code(404).send({ error: 'Bid not found' });
    return reply.send(bid);
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const bid = await bidService.create(req.body as any, req.user);
      return reply.code(201).send(bid);
    } catch (err: any) {
      return reply.code(400).send({ error: err.message });
    }
  },

  async update(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    try {
      const bid = await bidService.update(id, req.body as any, req.user);
      return reply.send(bid);
    } catch (err: any) {
      return reply.code(400).send({ error: err.message });
    }
  },

  async getItems(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const items = await bidService.getItems(id);
    return reply.send(items);
  },

  async addItems(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const items = await bidService.addItems(id, req.body as any);
    return reply.send(items);
  },

  async submit(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    try {
      const bid = await bidService.submit(id, req.user);
      return reply.send(bid);
    } catch (err: any) {
      return reply.code(400).send({ error: err.message });
    }
  },

  async withdraw(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const bid = await bidService.withdraw(id, req.user);
    return reply.send(bid);
  },
};