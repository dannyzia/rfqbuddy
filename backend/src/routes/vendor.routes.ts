import { FastifyInstance } from 'fastify';
import { vendorController } from '../controllers/vendor.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

export async function vendorRoutes(app: FastifyInstance) {
  const auth = [requireAuth];
  const pe = [requireAuth, requireRole(['pe_admin', 'procurer', 'procurement_head'])];
  const vendor = [requireAuth, requireRole(['vendor_admin', 'sales_executive', 'sales_manager'])];

  app.get('/', { preHandler: pe }, vendorController.list);
  app.get('/:orgId', { preHandler: auth }, vendorController.getProfile);
  app.get('/:orgId/reviews', { preHandler: auth }, vendorController.getReviews);
  app.get('/:orgId/srm', { preHandler: auth }, vendorController.getSRM);

  // Enlistment
  app.post('/enlistment', { preHandler: vendor }, vendorController.submitEnlistment);
  app.patch('/enlistment/:id', { preHandler: pe }, vendorController.reviewEnlistment);

  // Performance reviews
  app.post('/:orgId/reviews', { preHandler: pe }, vendorController.submitReview);
}
