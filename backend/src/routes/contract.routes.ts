import { FastifyInstance } from 'fastify';
import { contractController } from '../controllers/contract.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

export async function contractRoutes(app: FastifyInstance) {
  const auth = [requireAuth];
  const pe = [requireAuth, requireRole(['pe_admin', 'procurer', 'procurement_head'])];
  const vendor = [requireAuth, requireRole(['vendor_admin', 'sales_executive', 'sales_manager'])];
  const peHead = [requireAuth, requireRole(['pe_admin', 'procurement_head'])];

  app.get('/', { preHandler: auth }, contractController.list);
  app.get('/:id', { preHandler: auth }, contractController.getById);
  app.post('/', { preHandler: pe }, contractController.generate);
  app.patch('/:id', { preHandler: peHead }, contractController.update);

  // Milestones
  app.get('/:id/milestones', { preHandler: auth }, contractController.getMilestones);
  app.post('/:id/milestones', { preHandler: pe }, contractController.createMilestone);
  app.patch('/:id/milestones/:mid', { preHandler: pe }, contractController.updateMilestoneStatus);

  // Variations
  app.post('/:id/variations', { preHandler: vendor }, contractController.submitVariation);
  app.patch('/:id/variations/:vid', { preHandler: peHead }, contractController.approveVariation);

  // Payments
  app.post('/:id/payments', { preHandler: vendor }, contractController.submitPayment);
}
