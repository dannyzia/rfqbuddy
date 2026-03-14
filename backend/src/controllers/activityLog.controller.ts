import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../config/database';
import { activityLogs, adminAuditLog, profiles } from '../schema';
import { eq, and, desc, sql, gte, lte } from 'drizzle-orm';

export const activityLogController = {
  // User's own activity log
  async getMyLogs(req: FastifyRequest, reply: FastifyReply) {
    const query = req.query as any;
    const page = parseInt(query.page ?? '1');
    const pageSize = parseInt(query.pageSize ?? '50');

    const logs = await db.select().from(activityLogs)
      .where(eq(activityLogs.user_id, req.user.id))
      .orderBy(desc(activityLogs.created_at))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return reply.send(logs);
  },

  // Org activity log (PE Admin / Procurement Head)
  async getOrgLogs(req: FastifyRequest, reply: FastifyReply) {
    const query = req.query as any;
    const page = parseInt(query.page ?? '1');
    const pageSize = parseInt(query.pageSize ?? '50');

    const logs = await db.select().from(activityLogs)
      .where(eq(activityLogs.org_id, req.user.org_id!))
      .orderBy(desc(activityLogs.created_at))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return reply.send(logs);
  },

  // Entity-specific audit trail (e.g., all logs for a tender)
  async getEntityLogs(req: FastifyRequest, reply: FastifyReply) {
    const { entityType, entityId } = req.params as { entityType: string; entityId: string };

    const logs = await db.select().from(activityLogs)
      .where(and(
        eq(activityLogs.entity_type, entityType),
        eq(activityLogs.entity_id, entityId),
      ))
      .orderBy(desc(activityLogs.created_at))
      .limit(200);

    return reply.send(logs);
  },

  // Admin: all logs (super_admin only)
  async getAllLogs(req: FastifyRequest, reply: FastifyReply) {
    const query = req.query as any;
    const page = parseInt(query.page ?? '1');
    const pageSize = parseInt(query.pageSize ?? '50');

    let dbQuery = db.select({
      id: activityLogs.id,
      user_id: activityLogs.user_id,
      org_id: activityLogs.org_id,
      action: activityLogs.action,
      entity_type: activityLogs.entity_type,
      entity_id: activityLogs.entity_id,
      description: activityLogs.description,
      ip_address: activityLogs.ip_address,
      created_at: activityLogs.created_at,
      user_name: profiles.full_name,
      user_email: profiles.email,
    })
      .from(activityLogs)
      .leftJoin(profiles, eq(profiles.id, activityLogs.user_id))
      .orderBy(desc(activityLogs.created_at))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const logs = await dbQuery;
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(activityLogs);

    return reply.send({ data: logs, total: Number(count), page, pageSize });
  },

  // Admin audit log (admin actions only)
  async getAdminAuditLogs(req: FastifyRequest, reply: FastifyReply) {
    const query = req.query as any;
    const page = parseInt(query.page ?? '1');
    const pageSize = parseInt(query.pageSize ?? '50');

    const logs = await db.select({
      id: adminAuditLog.id,
      admin_id: adminAuditLog.admin_id,
      action: adminAuditLog.action,
      target_type: adminAuditLog.target_type,
      target_id: adminAuditLog.target_id,
      payload: adminAuditLog.payload,
      created_at: adminAuditLog.created_at,
      admin_name: profiles.full_name,
    })
      .from(adminAuditLog)
      .leftJoin(profiles, eq(profiles.id, adminAuditLog.admin_id))
      .orderBy(desc(adminAuditLog.created_at))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return reply.send(logs);
  },
};
