import { FastifyInstance } from 'fastify';
import { financeController } from '../controllers/finance.controller';
import { requireAuth } from '../middleware/requireAuth';

export async function financeRoutes(app: FastifyInstance) {
  const auth = [requireAuth];

  // Three-way matching
  app.get('/matching', { preHandler: auth }, financeController.getMatchingOverview);
  app.get('/payments', { preHandler: auth }, financeController.listPayments);
  app.post('/grn', { preHandler: auth }, financeController.createGRN);

  // FX
  app.get('/fx/rates', { preHandler: auth }, financeController.getFxRates);
  app.get('/fx/comparison/:tenderId', { preHandler: auth }, financeController.getFxComparison);
}
