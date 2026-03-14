import { db } from '../config/database';
import { activityLogs, adminAuditLog } from '../schema';

export const auditService = {
  async log(
    userId: string,
    orgId: string | null,
    action: string,
    entityType: string,
    entityId: string | null,
    description: string,
    metadata?: object,
    ipAddress?: string,
    userAgent?: string,
  ) {
    await db.insert(activityLogs).values({
      user_id: userId,
      org_id: orgId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      description,
      metadata: metadata ?? null,
      ip_address: ipAddress ?? null,
      user_agent: userAgent ?? null,
    });
  },

  async adminLog(
    adminId: string,
    action: string,
    targetType: string,
    targetId: string | null,
    payload?: object,
  ) {
    await db.insert(adminAuditLog).values({
      admin_id: adminId,
      action,
      target_type: targetType,
      target_id: targetId,
      payload: payload ?? null,
    });
  },
};
