import { FastifyInstance } from 'fastify';
import { settingsController } from '../controllers/settings.controller';
import { requireAuth } from '../middleware/requireAuth';

export async function settingsRoutes(app: FastifyInstance) {
  const auth = [requireAuth];

  app.get('/accessibility', { preHandler: auth }, settingsController.getAccessibility);
  app.put('/accessibility', { preHandler: auth }, settingsController.updateAccessibility);
}
