import { FastifyRequest, FastifyReply } from 'fastify';
import { vendorService } from '../services/vendor.service';

export const vendorController = {
  async list(_req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await vendorService.list());
  },

  async getProfile(req: FastifyRequest, reply: FastifyReply) {
    const { orgId } = req.params as { orgId: string };
    return reply.send(await vendorService.getProfile(orgId));
  },

  async submitEnlistment(req: FastifyRequest, reply: FastifyReply) {
    return reply.code(201).send(await vendorService.submitEnlistment(req.body as any, req.user));
  },

  async reviewEnlistment(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const { approved } = req.body as any;
    return reply.send(await vendorService.reviewEnlistment(id, approved, req.user));
  },

  async submitReview(req: FastifyRequest, reply: FastifyReply) {
    return reply.code(201).send(await vendorService.submitReview(req.body as any, req.user));
  },

  async getReviews(req: FastifyRequest, reply: FastifyReply) {
    const { orgId } = req.params as { orgId: string };
    return reply.send(await vendorService.getReviews(orgId));
  },

  async getSRM(req: FastifyRequest, reply: FastifyReply) {
    const { orgId } = req.params as { orgId: string };
    const profile = await vendorService.getProfile(orgId);
    return reply.send({ srm_score: profile.vendorProfile?.srm_score ?? 0 });
  },
};
