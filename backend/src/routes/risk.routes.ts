import { FastifyInstance } from 'fastify';
import { riskController } from '../controllers/risk.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

export async function riskRoutes(app: FastifyInstance) {
  const auth = [requireAuth];
  const admin = [requireAuth, requireRole(['super_admin', 'pe_admin', 'procurement_head'])];

  app.get('/dashboard', { preHandler: auth }, riskController.getDashboard);
  app.get('/assessments', { preHandler: auth }, riskController.listAssessments);
  app.get('/vendors/:id', { preHandler: auth }, riskController.getVendorRiskProfile);
  app.patch('/vendors/:id', { preHandler: admin }, riskController.updateRiskLevel);
}
