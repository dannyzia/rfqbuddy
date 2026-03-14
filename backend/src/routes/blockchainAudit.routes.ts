import { FastifyInstance } from 'fastify';
import { blockchainAuditController } from '../controllers/blockchainAudit.controller';
import { requireAuth } from '../middleware/requireAuth';

export async function blockchainAuditRoutes(app: FastifyInstance) {
  const auth = [requireAuth];

  app.post('/anchor', { preHandler: auth }, blockchainAuditController.anchor);
  app.get('/verify/:id', { preHandler: auth }, blockchainAuditController.verify);
  app.get('/anchors', { preHandler: auth }, blockchainAuditController.list);
}
