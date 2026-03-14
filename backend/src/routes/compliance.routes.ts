import { FastifyInstance } from 'fastify';
import { complianceController } from '../controllers/compliance.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

export async function complianceRoutes(app: FastifyInstance) {
  const admin = [requireAuth, requireRole(['super_admin', 'pe_admin', 'procurement_head'])];

  app.get('/kyc', { preHandler: admin }, complianceController.listKycChecks);
  app.get('/kyc/:id', { preHandler: admin }, complianceController.getKycDetail);
  app.patch('/kyc/:id', { preHandler: admin }, complianceController.updateKycStatus);
  app.get('/sanctions', { preHandler: admin }, complianceController.getSanctionsAlerts);
}
