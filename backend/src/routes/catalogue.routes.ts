import { FastifyInstance } from 'fastify';
import { catalogueController } from '../controllers/catalogue.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

export async function catalogueRoutes(app: FastifyInstance) {
  const auth = [requireAuth];
  const vendor = [requireAuth, requireRole(['vendor_admin', 'sales_executive', 'sales_manager'])];

  // Categories
  app.get('/categories', { preHandler: auth }, catalogueController.getCategories);

  // Items — browse (any auth), CRUD (vendor only)
  app.get('/items', { preHandler: auth }, catalogueController.listItems);
  app.post('/items', { preHandler: vendor }, catalogueController.createItem);
  app.patch('/items/:id', { preHandler: vendor }, catalogueController.updateItem);
  app.delete('/items/:id', { preHandler: vendor }, catalogueController.deleteItem);

  // Cart — per-user cart operations
  app.get('/cart', { preHandler: auth }, catalogueController.getCart);
  app.post('/cart', { preHandler: auth }, catalogueController.addToCart);
  app.patch('/cart/:item_id', { preHandler: auth }, catalogueController.updateCartItem);
  app.delete('/cart', { preHandler: auth }, catalogueController.clearCart);

  // Checkout — create order from cart
  app.post('/checkout', { preHandler: auth }, catalogueController.checkout);

  // Orders — history
  app.get('/orders', { preHandler: auth }, catalogueController.listOrders);
  app.get('/orders/:id', { preHandler: auth }, catalogueController.getOrderById);
}
