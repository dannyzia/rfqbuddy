import { FastifyInstance } from 'fastify';
import { activityLogController } from '../controllers/activityLog.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

export async function activityLogRoutes(app: FastifyInstance) {
  const auth = [requireAuth];
  const orgAdmin = [requireAuth, requireRole(['pe_admin', 'procurement_head', 'vendor_admin', 'super_admin'])];
  const admin = [requireAuth, requireRole(['super_admin'])];

  // User's own logs
  app.get('/me', { preHandler: auth }, activityLogController.getMyLogs);

  // Org-wide logs (PE Admin / Procurement Head)
  app.get('/org', { preHandler: orgAdmin }, activityLogController.getOrgLogs);

  // Entity-specific audit trail
  app.get('/entity/:entityType/:entityId', { preHandler: auth }, activityLogController.getEntityLogs);

  // Admin: all logs
  app.get('/all', { preHandler: admin }, activityLogController.getAllLogs);

  // Admin audit log
  app.get('/admin-audit', { preHandler: admin }, activityLogController.getAdminAuditLogs);
}
