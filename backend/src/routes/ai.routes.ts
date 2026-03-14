import { FastifyInstance } from 'fastify';
import { aiController } from '../controllers/ai.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

export async function aiRoutes(app: FastifyInstance) {
  const admin = [requireAuth, requireRole(['super_admin', 'pe_admin'])];

  app.get('/agents', { preHandler: admin }, aiController.listAgents);
  app.get('/analytics', { preHandler: admin }, aiController.getAnalytics);
  app.patch('/agents/:agentId', { preHandler: admin }, aiController.updateAgentConfig);
}
