import { db } from '../config/database';
import { activityLogs } from '../schema';
import { desc, sql } from 'drizzle-orm';

// AI Agent service — manages agent configuration, runs, and analytics.
// In production this would integrate with LLM providers; for now it provides
// config CRUD and aggregated analytics from activity logs.

export const aiService = {
  // Agent config is stored as platform settings or a dedicated table;
  // for MVP we return in-memory defaults that the frontend can override.
  getAgentConfigs() {
    return [
      { id: 'spend-analyzer', name: 'Spend Analyzer', enabled: true, model: 'gpt-4o', schedule: 'daily', lastRun: null },
      { id: 'risk-monitor', name: 'Risk Monitor', enabled: true, model: 'gpt-4o', schedule: 'hourly', lastRun: null },
      { id: 'contract-reviewer', name: 'Contract Reviewer', enabled: false, model: 'gpt-4o-mini', schedule: 'on_demand', lastRun: null },
      { id: 'market-intel', name: 'Market Intelligence', enabled: false, model: 'gpt-4o', schedule: 'weekly', lastRun: null },
      { id: 'anomaly-detector', name: 'Anomaly Detector', enabled: true, model: 'gpt-4o', schedule: 'realtime', lastRun: null },
    ];
  },

  async getAgentAnalytics() {
    // Aggregate recent activity logs as proxy for agent activity
    const [totalActions] = await db.select({ count: sql<number>`count(*)` }).from(activityLogs);
    const recentLogs = await db.select().from(activityLogs)
      .orderBy(desc(activityLogs.created_at))
      .limit(50);

    return {
      total_actions_processed: Number(totalActions.count),
      recent_logs: recentLogs,
      agents_active: 3,
      agents_total: 5,
      savings_identified: 145_000,
      risks_flagged: 12,
    };
  },

  updateAgentConfig(agentId: string, updates: { enabled?: boolean; model?: string; schedule?: string }) {
    // In production, persist to DB; for now return merged config
    return { id: agentId, ...updates, updated_at: new Date().toISOString() };
  },
};
