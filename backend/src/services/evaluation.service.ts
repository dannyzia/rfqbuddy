import { db } from '../config/database';
import { evaluationCriteria, evaluationScores, evaluationResults, workflowTransitions, tenders, bids } from '../schema';
import { eq, and, sql } from 'drizzle-orm';
import { auditService } from './audit.service';
import type { RequestUser, EVAL_STAGE_ORDER } from '../types';

export const evaluationService = {
  async getCriteria(tenderId: string) {
    return db.select().from(evaluationCriteria)
      .where(eq(evaluationCriteria.tender_id, tenderId))
      .orderBy(evaluationCriteria.sort_order);
  },

  async setCriteria(tenderId: string, criteria: {
    stage: string;
    criterion_name: string;
    max_score: string;
    weight?: string;
    description?: string;
    is_pass_fail?: boolean;
  }[], user: RequestUser) {
    // Delete existing criteria for this tender, then insert fresh
    await db.delete(evaluationCriteria).where(eq(evaluationCriteria.tender_id, tenderId));

    const rows = criteria.map((c, i) => ({
      tender_id: tenderId,
      stage: c.stage as any,
      criterion_name: c.criterion_name,
      max_score: c.max_score,
      weight: c.weight ?? '1.0',
      description: c.description ?? null,
      is_pass_fail: c.is_pass_fail ?? false,
      sort_order: i,
    }));

    return db.insert(evaluationCriteria).values(rows).returning();
  },

  async submitScores(tenderId: string, scores: {
    bid_id: string;
    criterion_id: string;
    score: string;
    remarks?: string;
  }[], user: RequestUser) {
    const results = [];

    for (const s of scores) {
      const [row] = await db.insert(evaluationScores).values({
        tender_id: tenderId,
        bid_id: s.bid_id,
        criterion_id: s.criterion_id,
        evaluator_id: user.id,
        score: s.score,
        remarks: s.remarks ?? null,
      }).onConflictDoUpdate({
        target: [evaluationScores.bid_id, evaluationScores.criterion_id, evaluationScores.evaluator_id],
        set: {
          score: s.score,
          remarks: s.remarks ?? null,
          scored_at: new Date(),
        },
      }).returning();
      results.push(row);
    }

    await auditService.log(
      user.id, user.org_id, 'EVALUATE_BID', 'tender', tenderId,
      `Submitted ${scores.length} scores`, { score_count: scores.length },
    );

    return results;
  },

  async getResults(tenderId: string) {
    return db.select().from(evaluationResults)
      .where(eq(evaluationResults.tender_id, tenderId));
  },

  async computeStageResults(tenderId: string, stage: string, user: RequestUser) {
    // Get all criteria for this stage
    const criteria = await db.select().from(evaluationCriteria)
      .where(and(
        eq(evaluationCriteria.tender_id, tenderId),
        eq(evaluationCriteria.stage, stage as any),
      ));

    // Get all bids for this tender
    const tenderBids = await db.select().from(bids)
      .where(eq(bids.tender_id, tenderId));

    const results = [];
    for (const bid of tenderBids) {
      const scores = await db.select().from(evaluationScores)
        .where(and(
          eq(evaluationScores.tender_id, tenderId),
          eq(evaluationScores.bid_id, bid.id),
        ));

      const totalScore = scores.reduce((sum, s) => sum + Number(s.score ?? 0), 0);
      const maxPossible = criteria.reduce((sum, c) => sum + Number(c.max_score), 0);
      const percentage = maxPossible > 0 ? (totalScore / maxPossible) * 100 : 0;

      // Get threshold from tender
      const [tender] = await db.select().from(tenders)
        .where(eq(tenders.id, tenderId)).limit(1);
      const threshold = Number(tender?.pass_fail_threshold ?? 70);

      const [result] = await db.insert(evaluationResults).values({
        tender_id: tenderId,
        bid_id: bid.id,
        stage,
        total_score: totalScore.toFixed(2),
        max_possible: maxPossible.toFixed(2),
        percentage: percentage.toFixed(2),
        passed: percentage >= threshold,
        evaluated_by: user.id,
      }).onConflictDoUpdate({
        target: [evaluationResults.tender_id, evaluationResults.bid_id, evaluationResults.stage],
        set: {
          total_score: totalScore.toFixed(2),
          percentage: percentage.toFixed(2),
          passed: percentage >= threshold,
          evaluated_at: new Date(),
        },
      }).returning();

      results.push(result);
    }

    return results;
  },

  async forward(tenderId: string, toStage: string, toUserId: string | null, notes: string, user: RequestUser) {
    // Log transition
    const [tender] = await db.select().from(tenders)
      .where(eq(tenders.id, tenderId)).limit(1);

    await db.insert(workflowTransitions).values({
      tender_id: tenderId,
      from_stage: tender.current_stage ?? tender.status,
      to_stage: toStage,
      from_user: user.id,
      to_user: toUserId,
      notes,
    });

    // Update tender status
    await db.update(tenders).set({
      status: toStage as any,
      current_stage: toStage,
      forwarded_to: toUserId,
      forwarded_at: new Date(),
      updated_at: new Date(),
    }).where(eq(tenders.id, tenderId));

    await auditService.log(
      user.id, user.org_id, 'FORWARD_TENDER', 'tender', tenderId,
      `Forwarded from ${tender.current_stage} to ${toStage}`,
      { notes, to_user: toUserId },
    );
  },

  async getComparison(tenderId: string) {
    // All bids with their scores, grouped for comparison matrix
    const tenderBids = await db.select().from(bids)
      .where(eq(bids.tender_id, tenderId));

    const comparison = [];
    for (const bid of tenderBids) {
      const results = await db.select().from(evaluationResults)
        .where(eq(evaluationResults.bid_id, bid.id));
      comparison.push({ bid, results });
    }

    return comparison;
  },

  async getRanking(tenderId: string) {
    return db.select().from(evaluationResults)
      .where(eq(evaluationResults.tender_id, tenderId))
      .orderBy(sql`${evaluationResults.percentage} DESC NULLS LAST`);
  },
};
