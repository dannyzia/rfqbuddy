import { FastifyInstance } from 'fastify';
import { developersController } from '../controllers/developers.controller';
import { requireAuth } from '../middleware/requireAuth';

export async function developersRoutes(app: FastifyInstance) {
  const auth = [requireAuth];

  // API Keys
  app.get('/api-keys', { preHandler: auth }, developersController.listApiKeys);
  app.post('/api-keys', { preHandler: auth }, developersController.createApiKey);
  app.delete('/api-keys/:id', { preHandler: auth }, developersController.revokeApiKey);

  // Webhooks
  app.get('/webhooks', { preHandler: auth }, developersController.listWebhooks);
  app.post('/webhooks', { preHandler: auth }, developersController.createWebhook);
  app.delete('/webhooks/:id', { preHandler: auth }, developersController.deleteWebhook);
  app.patch('/webhooks/:id', { preHandler: auth }, developersController.toggleWebhook);
}
