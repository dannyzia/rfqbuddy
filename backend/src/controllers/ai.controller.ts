import { FastifyRequest, FastifyReply } from 'fastify';
import { aiService } from '../services/ai.service';

export const aiController = {
  async listAgents(_req: FastifyRequest, reply: FastifyReply) {
    const configs = aiService.getAgentConfigs();
    return reply.send(configs);
  },

  async getAnalytics(_req: FastifyRequest, reply: FastifyReply) {
    const analytics = await aiService.getAgentAnalytics();
    return reply.send(analytics);
  },

  async updateAgentConfig(req: FastifyRequest, reply: FastifyReply) {
    const { agentId } = req.params as { agentId: string };
    const body = req.body as any;
    const result = aiService.updateAgentConfig(agentId, body);
    return reply.send(result);
  },
};
