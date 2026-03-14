import { FastifyInstance } from 'fastify';
import { tenderController } from '../controllers/tender.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

export async function tenderRoutes(app: FastifyInstance) {
  const auth = [requireAuth];
  const peRoles = [requireAuth, requireRole(['pe_admin', 'procurer', 'procurement_head'])];
  const procurer = [requireAuth, requireRole(['pe_admin', 'procurer'])];
  const adminOnly = [requireAuth, requireRole(['pe_admin', 'super_admin'])];

  app.get('/', { preHandler: auth }, tenderController.list);
  app.get('/:id', { preHandler: auth }, tenderController.getById);
  app.post('/', { preHandler: procurer }, tenderController.create);
  app.patch('/:id', { preHandler: procurer }, tenderController.update);
  app.delete('/:id', { preHandler: adminOnly }, tenderController.remove);
  app.post('/:id/publish', { preHandler: procurer }, tenderController.publish);
  app.post('/:id/close', { preHandler: peRoles }, tenderController.close);
  app.post('/:id/withhold', { preHandler: [requireAuth, requireRole(['pe_admin', 'procurement_head'])] }, tenderController.withhold);
  app.post('/:id/award', { preHandler: [requireAuth, requireRole(['pe_admin', 'procurement_head'])] }, tenderController.award);
  app.post('/:id/forward', { preHandler: auth }, tenderController.forward);

  // Line items
  app.get('/:id/items', { preHandler: auth }, tenderController.getItems);
  app.post('/:id/items', { preHandler: procurer }, tenderController.addItems);

  // Invitations
  app.get('/:id/invitations', { preHandler: auth }, tenderController.getInvitations);
  app.post('/:id/invite', { preHandler: procurer }, tenderController.invite);
}