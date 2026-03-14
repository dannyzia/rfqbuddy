import { FastifyInstance } from 'fastify';
import { adminStatsController } from '../controllers/adminStats.controller';
import { adminUserController } from '../controllers/adminUser.controller';
import { adminTenderController } from '../controllers/adminTender.controller';
import { adminSettingsController } from '../controllers/adminSettings.controller';
import { emailTemplateController } from '../controllers/emailTemplate.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireAdmin } from '../middleware/requireAdmin';

export async function adminRoutes(app: FastifyInstance) {
  const admin = [requireAuth, requireAdmin];

  // Dashboard stats
  app.get('/stats', { preHandler: admin }, adminStatsController.getDashboardStats);

  // User management
  app.get('/users', { preHandler: admin }, adminUserController.list);
  app.post('/users', { preHandler: admin }, adminUserController.create);
  app.patch('/users/:id', { preHandler: admin }, adminUserController.update);
  app.post('/users/:id/approve', { preHandler: admin }, adminUserController.approve);
  app.post('/users/:id/reject', { preHandler: admin }, adminUserController.reject);
  app.delete('/users/:id', { preHandler: admin }, adminUserController.deactivate);

  // Tender management
  app.get('/tenders', { preHandler: admin }, adminTenderController.list);
  app.delete('/tenders/:id', { preHandler: admin }, adminTenderController.remove);

  // Platform settings
  app.get('/settings', { preHandler: admin }, adminSettingsController.list);
  app.put('/settings/:key', { preHandler: admin }, adminSettingsController.update);

  // Email templates
  app.get('/email-templates', { preHandler: admin }, emailTemplateController.list);
  app.get('/email-templates/:key', { preHandler: admin }, emailTemplateController.getByKey);
  app.post('/email-templates', { preHandler: admin }, emailTemplateController.create);
  app.patch('/email-templates/:key', { preHandler: admin }, emailTemplateController.update);
  app.delete('/email-templates/:key', { preHandler: admin }, emailTemplateController.remove);
}