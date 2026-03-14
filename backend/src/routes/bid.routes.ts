import { FastifyInstance } from 'fastify';
import { bidController } from '../controllers/bid.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

export async function bidRoutes(app: FastifyInstance) {
  const vendor = [requireAuth, requireRole(['vendor_admin', 'sales_executive', 'sales_manager'])];
  const auth = [requireAuth];

  app.get('/', { preHandler: vendor }, bidController.list);
  app.get('/:id', { preHandler: auth }, bidController.getById);
  app.post('/', { preHandler: vendor }, bidController.create);
  app.patch('/:id', { preHandler: vendor }, bidController.update);
  app.get('/:id/items', { preHandler: auth }, bidController.getItems);
  app.post('/:id/items', { preHandler: vendor }, bidController.addItems);
  app.post('/:id/submit', { preHandler: vendor }, bidController.submit);
  app.post('/:id/withdraw', { preHandler: vendor }, bidController.withdraw);

  // Buyer view: bids for a specific tender
  app.get('/tender/:tenderId', { preHandler: auth }, bidController.listByTender);
}