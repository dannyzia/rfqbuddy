// Evaluation workflow hooks — criteria, scores, results, comparison, ranking

import { useCallback } from 'react';
import { useApiQuery, useApiMutation } from '../lib/use-api';
import { evalApi } from '../lib/api/eval.api';
import { toast } from 'sonner';
import type { EvaluationCriterion, EvaluationScore, EvaluationResult } from '../lib/api-types';

// ── Criteria ──────────────────────────────────────────────────

export function useEvalCriteria(tenderId: string | undefined) {
  return useApiQuery<EvaluationCriterion[]>(
    () => evalApi.getCriteria(tenderId!),
    [tenderId],
    { enabled: !!tenderId },
  );
}

export function useSetEvalCriteria(tenderId: string) {
  return useApiMutation<EvaluationCriterion[], Partial<EvaluationCriterion>[]>(
    async (criteria) => {
      const result = await evalApi.setCriteria(tenderId, criteria);
      toast.success('Evaluation criteria saved');
      return result;
    },
  );
}

// ── Scores ────────────────────────────────────────────────────

export function useSubmitEvalScores(tenderId: string) {
  return useApiMutation<EvaluationScore[], {
    bid_id: string; criterion_id: string; score: string; remarks?: string;
  }[]>(
    async (scores) => {
      const result = await evalApi.submitScores(tenderId, scores);
      toast.success(`Submitted ${scores.length} evaluation scores`);
      return result;
    },
  );
}

// ── Results ───────────────────────────────────────────────────

export function useEvalResults(tenderId: string | undefined) {
  return useApiQuery<EvaluationResult[]>(
    () => evalApi.getResults(tenderId!),
    [tenderId],
    { enabled: !!tenderId },
  );
}

// ── Forward ───────────────────────────────────────────────────

export function useForwardEvaluation(tenderId: string) {
  return useApiMutation<{ success: true }, { to_stage: string; to_user_id?: string; notes: string }>(
    async (data) => {
      const result = await evalApi.forward(tenderId, data);
      toast.success(`Evaluation forwarded to ${data.to_stage}`);
      return result;
    },
  );
}

// ── Comparison ────────────────────────────────────────────────

export function useEvalComparison(tenderId: string | undefined) {
  return useApiQuery(
    () => evalApi.getComparison(tenderId!),
    [tenderId],
    { enabled: !!tenderId },
  );
}

// ── Ranking ───────────────────────────────────────────────────

export function useEvalRanking(tenderId: string | undefined) {
  return useApiQuery<EvaluationResult[]>(
    () => evalApi.getRanking(tenderId!),
    [tenderId],
    { enabled: !!tenderId },
  );
}
