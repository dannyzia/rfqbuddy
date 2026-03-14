import { FastifyInstance } from 'fastify';
import { ticketController } from '../controllers/ticket.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

export async function ticketRoutes(app: FastifyInstance) {
  const auth = [requireAuth];
  const admin = [requireAuth, requireRole(['super_admin'])];

  app.get('/', { preHandler: auth }, ticketController.list);
  app.get('/:id', { preHandler: auth }, ticketController.getById);
  app.post('/', { preHandler: auth }, ticketController.create);
  app.post('/:id/messages', { preHandler: auth }, ticketController.addMessage);
  app.patch('/:id', { preHandler: admin }, ticketController.update);
}
