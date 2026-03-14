import { db } from '../config/database';
import { tenders, bids, contracts, organizations, vendorProfiles, evaluationResults } from '../schema';
import { eq, and, sql, gte, lte, desc, count } from 'drizzle-orm';

export const analyticsService = {
  // ── Procurement Stats (Buyer Dashboard) ──────────────────────

  async getProcurementStats(orgId: string) {
    const [tenderStats] = await db.select({
      total: sql<number>`count(*)`,
      active: sql<number>`count(*) filter (where ${tenders.status} in ('published', 'open', 'under_evaluation'))`,
      awarded: sql<number>`count(*) filter (where ${tenders.status} = 'awarded')`,
      closed: sql<number>`count(*) filter (where ${tenders.status} in ('closed', 'cancelled'))`,
    }).from(tenders).where(eq(tenders.buyer_org_id, orgId));

    const [bidStats] = await db.select({
      total: sql<number>`count(*)`,
      avg_per_tender: sql<number>`count(*)::float / nullif(count(distinct ${bids.tender_id}), 0)`,
      avg_value: sql<number>`avg(${bids.total_amount}::numeric)`,
    }).from(bids)
      .innerJoin(tenders, eq(tenders.id, bids.tender_id))
      .where(eq(tenders.buyer_org_id, orgId));

    const [contractStats] = await db.select({
      total: sql<number>`count(*)`,
      active: sql<number>`count(*) filter (where ${contracts.status} = 'active')`,
      total_value: sql<number>`sum(${contracts.contract_value}::numeric)`,
    }).from(contracts).where(eq(contracts.buyer_org_id, orgId));

    return { tenders: tenderStats, bids: bidStats, contracts: contractStats };
  },

  // ── Spend by Category ────────────────────────────────────────

  async getSpendByCategory(orgId: string) {
    return db.execute(sql`
      SELECT
        unnest(t.categories) AS category,
        SUM(c.contract_value::numeric) AS total_spend,
        COUNT(DISTINCT c.id) AS contract_count
      FROM contracts c
      JOIN tenders t ON t.id = c.tender_id
      WHERE c.buyer_org_id = ${orgId}
      GROUP BY category
      ORDER BY total_spend DESC
      LIMIT 20
    `);
  },

  // ── Vendor Performance Ranking ───────────────────────────────

  async getVendorRanking(orgId: string) {
    return db.execute(sql`
      SELECT
        o.id AS vendor_org_id,
        o.name AS vendor_name,
        vp.srm_score,
        vp.risk_level,
        COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'awarded') AS bids_won,
        COUNT(DISTINCT b.id) AS total_bids,
        SUM(c.contract_value::numeric) AS total_contract_value
      FROM organizations o
      JOIN vendor_profiles vp ON vp.org_id = o.id
      LEFT JOIN bids b ON b.vendor_org_id = o.id
      LEFT JOIN contracts c ON c.vendor_org_id = o.id AND c.buyer_org_id = ${orgId}
      WHERE o.type = 'vendor'
      GROUP BY o.id, o.name, vp.srm_score, vp.risk_level
      ORDER BY vp.srm_score DESC NULLS LAST
    `);
  },

  // ── Tender Pipeline (by status) ──────────────────────────────

  async getTenderPipeline(orgId: string) {
    return db.select({
      status: tenders.status,
      count: sql<number>`count(*)`,
      total_value: sql<number>`sum(${tenders.estimated_value}::numeric)`,
    })
      .from(tenders)
      .where(eq(tenders.buyer_org_id, orgId))
      .groupBy(tenders.status);
  },

  // ── Monthly Spend Trend ──────────────────────────────────────

  async getMonthlySpend(orgId: string, months = 12) {
    return db.execute(sql`
      SELECT
        DATE_TRUNC('month', c.created_at) AS month,
        SUM(c.contract_value::numeric) AS spend,
        COUNT(*) AS contract_count
      FROM contracts c
      WHERE c.buyer_org_id = ${orgId}
        AND c.created_at >= NOW() - (${months} || ' months')::INTERVAL
      GROUP BY month
      ORDER BY month
    `);
  },

  // ── Vendor Concentration Risk ────────────────────────────────

  async getVendorConcentration(orgId: string) {
    return db.execute(sql`
      SELECT
        o.name AS vendor_name,
        SUM(c.contract_value::numeric) AS total_value,
        COUNT(*) AS contract_count,
        ROUND(
          SUM(c.contract_value::numeric) * 100.0 /
          NULLIF((SELECT SUM(contract_value::numeric) FROM contracts WHERE buyer_org_id = ${orgId}), 0),
          2
        ) AS percentage
      FROM contracts c
      JOIN organizations o ON o.id = c.vendor_org_id
      WHERE c.buyer_org_id = ${orgId}
      GROUP BY o.id, o.name
      ORDER BY total_value DESC
      LIMIT 10
    `);
  },

  // ── Savings Analysis ─────────────────────────────────────────

  async getSavingsAnalysis(orgId: string) {
    return db.execute(sql`
      SELECT
        t.id AS tender_id,
        t.tender_number,
        t.title,
        t.estimated_value::numeric AS estimated,
        MIN(b.total_amount::numeric) AS lowest_bid,
        (t.estimated_value::numeric - MIN(b.total_amount::numeric)) AS saving,
        ROUND(
          (t.estimated_value::numeric - MIN(b.total_amount::numeric)) * 100.0 /
          NULLIF(t.estimated_value::numeric, 0),
          2
        ) AS saving_pct
      FROM tenders t
      JOIN bids b ON b.tender_id = t.id AND b.status NOT IN ('draft', 'withdrawn')
      WHERE t.buyer_org_id = ${orgId}
        AND t.estimated_value IS NOT NULL
      GROUP BY t.id, t.tender_number, t.title, t.estimated_value
      HAVING t.estimated_value::numeric > 0
      ORDER BY saving DESC
      LIMIT 20
    `);
  },

  // ── Vendor Dashboard Stats ───────────────────────────────────

  async getVendorDashboardStats(orgId: string) {
    const [bidStats] = await db.select({
      total: sql<number>`count(*)`,
      submitted: sql<number>`count(*) filter (where ${bids.status} = 'submitted')`,
      awarded: sql<number>`count(*) filter (where ${bids.status} = 'awarded')`,
      rejected: sql<number>`count(*) filter (where ${bids.status} = 'rejected')`,
    }).from(bids).where(eq(bids.vendor_org_id, orgId));

    const [contractStats] = await db.select({
      active: sql<number>`count(*) filter (where ${contracts.status} = 'active')`,
      total_value: sql<number>`sum(${contracts.contract_value}::numeric)`,
    }).from(contracts).where(eq(contracts.vendor_org_id, orgId));

    const [profile] = await db.select().from(vendorProfiles)
      .where(eq(vendorProfiles.org_id, orgId)).limit(1);

    return {
      bids: bidStats,
      contracts: contractStats,
      srm_score: profile?.srm_score ?? '0.0',
      risk_level: profile?.risk_level ?? 'medium',
    };
  },

  // ── Process Efficiency Metrics ───────────────────────────────

  async getEfficiencyMetrics(orgId: string) {
    // Average cycle time: draft → awarded
    const cycleTime = await db.execute(sql`
      SELECT
        AVG(EXTRACT(EPOCH FROM (
          COALESCE(
            (SELECT MIN(wt.transitioned_at) FROM workflow_transitions wt
             WHERE wt.tender_id = t.id AND wt.to_stage = 'awarded'),
            t.updated_at
          ) - t.created_at
        )) / 86400)::numeric(10,1) AS avg_cycle_days,
        AVG(EXTRACT(EPOCH FROM (t.submission_deadline - t.created_at)) / 86400)::numeric(10,1) AS avg_submission_window_days,
        COUNT(*) FILTER (WHERE t.status = 'awarded') AS awarded_count,
        COUNT(*) FILTER (WHERE t.status = 'cancelled') AS cancelled_count,
        COUNT(*) AS total_tenders
      FROM tenders t
      WHERE t.buyer_org_id = ${orgId}
    `);

    // Avg bids per tender
    const bidEfficiency = await db.execute(sql`
      SELECT
        AVG(bid_count)::numeric(10,1) AS avg_bids_per_tender,
        AVG(CASE WHEN bid_count > 0 THEN 1.0 ELSE 0.0 END * 100)::numeric(5,1) AS participation_rate
      FROM (
        SELECT t.id, COUNT(b.id) AS bid_count
        FROM tenders t
        LEFT JOIN bids b ON b.tender_id = t.id AND b.status NOT IN ('draft', 'withdrawn')
        WHERE t.buyer_org_id = ${orgId}
          AND t.status NOT IN ('draft')
        GROUP BY t.id
      ) sub
    `);

    // Evaluation turnaround
    const evalTurnaround = await db.execute(sql`
      SELECT
        stage,
        AVG(EXTRACT(EPOCH FROM (evaluated_at -
          (SELECT t.opening_date FROM tenders t WHERE t.id = er.tender_id)
        )) / 86400)::numeric(10,1) AS avg_days
      FROM evaluation_results er
      JOIN tenders t2 ON t2.id = er.tender_id AND t2.buyer_org_id = ${orgId}
      GROUP BY stage
    `);

    // Monthly throughput (tenders completed per month, last 12 months)
    const throughput = await db.execute(sql`
      SELECT
        DATE_TRUNC('month', t.updated_at) AS month,
        COUNT(*) FILTER (WHERE t.status IN ('awarded', 'closed')) AS completed,
        COUNT(*) FILTER (WHERE t.status = 'cancelled') AS cancelled
      FROM tenders t
      WHERE t.buyer_org_id = ${orgId}
        AND t.updated_at >= NOW() - INTERVAL '12 months'
      GROUP BY month
      ORDER BY month
    `);

    return {
      cycle_time: (cycleTime.rows as any[])[0] ?? null,
      bid_efficiency: (bidEfficiency.rows as any[])[0] ?? null,
      eval_turnaround: (evalTurnaround.rows as any[]),
      monthly_throughput: (throughput.rows as any[]),
    };
  },

  // ── Compliance Metrics ───────────────────────────────────────

  async getComplianceMetrics(orgId: string) {
    // Vendor KYC status breakdown
    const kycBreakdown = await db.execute(sql`
      SELECT
        vp.kyc_status AS status,
        COUNT(*) AS count
      FROM vendor_profiles vp
      JOIN organizations o ON o.id = vp.org_id
      WHERE o.type = 'vendor'
      GROUP BY vp.kyc_status
    `);

    // Tender compliance: % with documents, terms, proper deadlines
    const tenderCompliance = await db.execute(sql`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE t.terms_conditions IS NOT NULL AND t.terms_conditions != '') AS has_terms,
        COUNT(*) FILTER (WHERE t.submission_deadline > t.created_at + INTERVAL '3 days') AS adequate_deadline,
        COUNT(*) FILTER (WHERE EXISTS (
          SELECT 1 FROM tender_documents td WHERE td.tender_id = t.id
        )) AS has_documents,
        COUNT(*) FILTER (WHERE t.eval_method IS NOT NULL) AS has_eval_method
      FROM tenders t
      WHERE t.buyer_org_id = ${orgId}
        AND t.status NOT IN ('draft')
    `);

    // Bid compliance: % with all required docs, declarations
    const bidCompliance = await db.execute(sql`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE b.compliance_declaration = true) AS declared_compliant,
        COUNT(*) FILTER (WHERE EXISTS (
          SELECT 1 FROM bid_documents bd WHERE bd.bid_id = b.id
        )) AS has_documents
      FROM bids b
      JOIN tenders t ON t.id = b.tender_id
      WHERE t.buyer_org_id = ${orgId}
        AND b.status NOT IN ('draft', 'withdrawn')
    `);

    // Overdue contracts
    const contractCompliance = await db.execute(sql`
      SELECT
        COUNT(*) AS total_active,
        COUNT(*) FILTER (WHERE c.end_date::date < CURRENT_DATE AND c.status = 'active') AS overdue,
        COUNT(*) FILTER (WHERE c.end_date::date BETWEEN CURRENT_DATE AND CURRENT_DATE + 30 AND c.status = 'active') AS expiring_soon
      FROM contracts c
      WHERE c.buyer_org_id = ${orgId}
    `);

    // Audit trail completeness
    const auditCoverage = await db.execute(sql`
      SELECT
        COUNT(DISTINCT t.id) AS total_tenders,
        COUNT(DISTINCT t.id) FILTER (WHERE EXISTS (
          SELECT 1 FROM activity_logs al
          WHERE al.entity_type = 'tender' AND al.entity_id = t.id
        )) AS with_audit_trail
      FROM tenders t
      WHERE t.buyer_org_id = ${orgId}
        AND t.status NOT IN ('draft')
    `);

    return {
      kyc_breakdown: (kycBreakdown.rows as any[]),
      tender_compliance: (tenderCompliance.rows as any[])[0] ?? null,
      bid_compliance: (bidCompliance.rows as any[])[0] ?? null,
      contract_compliance: (contractCompliance.rows as any[])[0] ?? null,
      audit_coverage: (auditCoverage.rows as any[])[0] ?? null,
    };
  },
};