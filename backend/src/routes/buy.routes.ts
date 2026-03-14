import { FastifyInstance } from 'fastify';
import { buyController } from '../controllers/buy.controller';
import { requireAuth } from '../middleware/requireAuth';

export async function buyRoutes(app: FastifyInstance) {
  const auth = [requireAuth];

  app.get('/items', { preHandler: auth }, buyController.browse);
  app.get('/cart', { preHandler: auth }, buyController.getCart);
  app.post('/cart', { preHandler: auth }, buyController.addToCart);
  app.delete('/cart/:itemId', { preHandler: auth }, buyController.removeFromCart);
  app.post('/checkout', { preHandler: auth }, buyController.checkout);
  app.get('/orders', { preHandler: auth }, buyController.listOrders);
  app.get('/orders/:id', { preHandler: auth }, buyController.getOrder);
}
