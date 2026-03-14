import { FastifyInstance } from 'fastify';
import { analyticsController } from '../controllers/analytics.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

export async function analyticsRoutes(app: FastifyInstance) {
  const pe = [requireAuth, requireRole(['pe_admin', 'procurer', 'procurement_head', 'super_admin'])];
  const vendor = [requireAuth, requireRole(['vendor_admin', 'sales_executive', 'sales_manager'])];

  // Buyer analytics
  app.get('/stats', { preHandler: pe }, analyticsController.getProcurementStats);
  app.get('/spend', { preHandler: pe }, analyticsController.getSpendByCategory);
  app.get('/vendors', { preHandler: pe }, analyticsController.getVendorRanking);
  app.get('/pipeline', { preHandler: pe }, analyticsController.getTenderPipeline);
  app.get('/monthly-spend', { preHandler: pe }, analyticsController.getMonthlySpend);
  app.get('/concentration', { preHandler: pe }, analyticsController.getVendorConcentration);
  app.get('/savings', { preHandler: pe }, analyticsController.getSavingsAnalysis);
  app.get('/efficiency', { preHandler: pe }, analyticsController.getEfficiencyMetrics);
  app.get('/compliance', { preHandler: pe }, analyticsController.getComplianceMetrics);

  // Vendor analytics
  app.get('/vendor-stats', { preHandler: vendor }, analyticsController.getVendorDashboardStats);

  // PDF export
  app.get('/export/procurement-report', { preHandler: pe }, analyticsController.exportProcurementReport);
}