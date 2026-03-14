import { db } from '../config/database';
import { activityLogs, profiles } from '../schema';
import { desc, sql, eq, and, gte } from 'drizzle-orm';

export const securityService = {
  async getDashboard() {
    const oneDayAgo = new Date(Date.now() - 86_400_000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 86_400_000);

    const [totalEvents24h] = await db.select({ count: sql<number>`count(*)` })
      .from(activityLogs)
      .where(gte(activityLogs.created_at, oneDayAgo));

    const [totalEvents7d] = await db.select({ count: sql<number>`count(*)` })
      .from(activityLogs)
      .where(gte(activityLogs.created_at, sevenDaysAgo));

    const [failedLogins] = await db.select({ count: sql<number>`count(*)` })
      .from(activityLogs)
      .where(and(
        eq(activityLogs.action, 'LOGIN_FAILED'),
        gte(activityLogs.created_at, oneDayAgo),
      ));

    const [activeUsers] = await db.select({ count: sql<number>`count(*)` })
      .from(profiles)
      .where(eq(profiles.is_active, true));

    const recentSecurityEvents = await db.select()
      .from(activityLogs)
      .where(gte(activityLogs.created_at, oneDayAgo))
      .orderBy(desc(activityLogs.created_at))
      .limit(20);

    return {
      events_24h: Number(totalEvents24h.count),
      events_7d: Number(totalEvents7d.count),
      failed_logins_24h: Number(failedLogins.count),
      active_users: Number(activeUsers.count),
      recent_events: recentSecurityEvents,
      // NIST compliance scores (would come from a scanning service)
      nist_scores: {
        identify: 85,
        protect: 78,
        detect: 92,
        respond: 70,
        recover: 65,
      },
    };
  },
};
