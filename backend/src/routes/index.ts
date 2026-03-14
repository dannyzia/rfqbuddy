// Route registration — all API prefixes in one place

import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.routes';
import { tenderRoutes } from './tender.routes';
import { bidRoutes } from './bid.routes';
import { evalRoutes } from './eval.routes';
import { contractRoutes } from './contract.routes';
import { vendorRoutes } from './vendor.routes';
import { notificationRoutes } from './notification.routes';
import { storageRoutes } from './storage.routes';
import { catalogueRoutes } from './catalogue.routes';
import { ticketRoutes } from './ticket.routes';
import { adminRoutes } from './admin.routes';
import { orgRoutes } from './org.routes';
import { analyticsRoutes } from './analytics.routes';
import { activityLogRoutes } from './activityLog.routes';
import { complianceRoutes } from './compliance.routes';
import { financeRoutes } from './finance.routes';
import { buyRoutes } from './buy.routes';
import { riskRoutes } from './risk.routes';
import { aiRoutes } from './ai.routes';
import { developersRoutes } from './developers.routes';
import { settingsRoutes } from './settings.routes';
import { blockchainAuditRoutes } from './blockchainAudit.routes';
import { securityController } from '../controllers/security.controller';
import { calendarController } from '../controllers/calendar.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

export async function registerRoutes(app: FastifyInstance) {
  // Auth (separate rate limit applied in app.ts)
  app.register(authRoutes, { prefix: '/api/auth' });

  // Core domain routes
  app.register(orgRoutes, { prefix: '/api/orgs' });
  app.register(tenderRoutes, { prefix: '/api/tenders' });
  app.register(bidRoutes, { prefix: '/api/bids' });
  app.register(evalRoutes, { prefix: '/api/eval' });
  app.register(contractRoutes, { prefix: '/api/contracts' });
  app.register(vendorRoutes, { prefix: '/api/vendors' });

  // Supporting routes
  app.register(notificationRoutes, { prefix: '/api/notifications' });
  app.register(storageRoutes, { prefix: '/api/storage' });
  app.register(catalogueRoutes, { prefix: '/api/catalogue' });
  app.register(ticketRoutes, { prefix: '/api/tickets' });
  app.register(analyticsRoutes, { prefix: '/api/analytics' });
  app.register(activityLogRoutes, { prefix: '/api/activity-logs' });

  // Admin routes
  app.register(adminRoutes, { prefix: '/api/admin' });

  // Phase 17 — Advanced Modules
  app.register(complianceRoutes, { prefix: '/api/compliance' });
  app.register(financeRoutes, { prefix: '/api/finance' });
  app.register(buyRoutes, { prefix: '/api/buy' });
  app.register(riskRoutes, { prefix: '/api/risk' });
  app.register(aiRoutes, { prefix: '/api/ai' });
  app.register(developersRoutes, { prefix: '/api/developers' });
  app.register(settingsRoutes, { prefix: '/api/settings' });
  app.register(blockchainAuditRoutes, { prefix: '/api/audit' });

  // Security dashboard (admin-only standalone)
  app.get('/api/admin/security', { preHandler: [requireAuth, requireRole(['super_admin'])] }, securityController.getDashboard);

  // Calendar (standalone endpoint)
  app.get('/api/calendar', { preHandler: [requireAuth] }, calendarController.getEvents);

  // Health check
  app.get('/api/health', async (_req, reply) => {
    return reply.send({ status: 'ok', timestamp: new Date().toISOString() });
  });
}