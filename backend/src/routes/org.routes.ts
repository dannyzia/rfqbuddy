import { FastifyInstance } from 'fastify';
import { orgController } from '../controllers/org.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireOrg } from '../middleware/requireOrg';
import { requireRole } from '../middleware/requireRole';

export async function orgRoutes(app: FastifyInstance) {
  const auth = [requireAuth];
  const admin = [requireAuth, requireRole(['super_admin'])];
  const orgAdmin = [requireAuth, requireRole(['pe_admin', 'vendor_admin', 'super_admin'])];

  // Org CRUD
  app.get('/', { preHandler: auth }, orgController.list);
  app.get('/:id', { preHandler: auth }, orgController.getById);
  app.post('/', { preHandler: admin }, orgController.create);
  app.patch('/:id', { preHandler: [requireAuth, requireOrg] }, orgController.update);

  // Org approval (admin)
  app.post('/:id/approve', { preHandler: admin }, orgController.approve);
  app.post('/:id/reject', { preHandler: admin }, orgController.reject);
  app.post('/:id/suspend', { preHandler: admin }, orgController.suspend);

  // Member management
  app.get('/:id/members', { preHandler: [requireAuth, requireOrg] }, orgController.getMembers);
  app.post('/:id/members', { preHandler: orgAdmin }, orgController.addMember);
  app.delete('/:id/members/:uid', { preHandler: orgAdmin }, orgController.removeMember);
  app.patch('/:id/members/:uid/role', { preHandler: orgAdmin }, orgController.updateMemberRole);
}
