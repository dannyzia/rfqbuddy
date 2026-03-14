import { FastifyRequest, FastifyReply } from 'fastify';
import { evaluationService } from '../services/evaluation.service';

export const evaluationController = {
  async getCriteria(req: FastifyRequest, reply: FastifyReply) {
    const { tenderId } = req.params as { tenderId: string };
    return reply.send(await evaluationService.getCriteria(tenderId));
  },

  async setCriteria(req: FastifyRequest, reply: FastifyReply) {
    const { tenderId } = req.params as { tenderId: string };
    const result = await evaluationService.setCriteria(tenderId, req.body as any, req.user);
    return reply.send(result);
  },

  async submitScores(req: FastifyRequest, reply: FastifyReply) {
    const { tenderId } = req.params as { tenderId: string };
    const result = await evaluationService.submitScores(tenderId, req.body as any, req.user);
    return reply.send(result);
  },

  async getResults(req: FastifyRequest, reply: FastifyReply) {
    const { tenderId } = req.params as { tenderId: string };
    return reply.send(await evaluationService.getResults(tenderId));
  },

  async forward(req: FastifyRequest, reply: FastifyReply) {
    const { tenderId } = req.params as { tenderId: string };
    const { to_stage, to_user_id, notes } = req.body as any;
    await evaluationService.forward(tenderId, to_stage, to_user_id, notes, req.user);
    return reply.send({ success: true });
  },

  async getComparison(req: FastifyRequest, reply: FastifyReply) {
    const { tenderId } = req.params as { tenderId: string };
    return reply.send(await evaluationService.getComparison(tenderId));
  },

  async getRanking(req: FastifyRequest, reply: FastifyReply) {
    const { tenderId } = req.params as { tenderId: string };
    return reply.send(await evaluationService.getRanking(tenderId));
  },
};
