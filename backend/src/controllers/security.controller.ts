import { FastifyRequest, FastifyReply } from 'fastify';
import { securityService } from '../services/security.service';

export const securityController = {
  async getDashboard(_req: FastifyRequest, reply: FastifyReply) {
    const data = await securityService.getDashboard();
    return reply.send(data);
  },
};
