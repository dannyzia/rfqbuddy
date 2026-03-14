import { FastifyInstance } from 'fastify';
import { notificationController } from '../controllers/notification.controller';
import { requireAuth } from '../middleware/requireAuth';

export async function notificationRoutes(app: FastifyInstance) {
  const auth = [requireAuth];

  app.get('/', { preHandler: auth }, notificationController.list);
  app.get('/unread-count', { preHandler: auth }, notificationController.getUnreadCount);
  app.post('/:id/read', { preHandler: auth }, notificationController.markAsRead);
  app.post('/read-all', { preHandler: auth }, notificationController.markAllRead);
}
