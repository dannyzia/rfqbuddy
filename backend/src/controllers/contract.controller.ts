import { FastifyRequest, FastifyReply } from 'fastify';
import { contractService } from '../services/contract.service';

export const contractController = {
  async list(req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await contractService.list(req.user.org_id!));
  },

  async getById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const contract = await contractService.getById(id);
    if (!contract) return reply.code(404).send({ error: 'Contract not found' });
    return reply.send(contract);
  },

  async generate(req: FastifyRequest, reply: FastifyReply) {
    const { tender_id, bid_id } = req.body as any;
    const contract = await contractService.generate(tender_id, bid_id, req.user);
    return reply.code(201).send(contract);
  },

  async update(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    return reply.send(await contractService.update(id, req.body as any, req.user));
  },

  async getMilestones(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    return reply.send(await contractService.getMilestones(id));
  },

  async createMilestone(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    return reply.code(201).send(await contractService.createMilestone(id, req.body as any));
  },

  async updateMilestoneStatus(req: FastifyRequest, reply: FastifyReply) {
    const { mid } = req.params as { mid: string };
    const { status } = req.body as any;
    return reply.send(await contractService.updateMilestoneStatus(mid, status));
  },

  async submitVariation(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    return reply.code(201).send(await contractService.submitVariation(id, req.body as any, req.user));
  },

  async approveVariation(req: FastifyRequest, reply: FastifyReply) {
    const { vid } = req.params as { vid: string };
    const { approved } = req.body as any;
    return reply.send(await contractService.approveVariation(vid, approved, req.user));
  },

  async submitPayment(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    return reply.code(201).send(await contractService.submitPayment(id, req.body as any, req.user));
  },
};
