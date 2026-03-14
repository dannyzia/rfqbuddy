import { api } from '../api-client';
import type { EvaluationCriterion, EvaluationScore, EvaluationResult } from '../api-types';

export const evalApi = {
  getCriteria(tenderId: string) {
    return api.get<EvaluationCriterion[]>(`/api/eval/${tenderId}/criteria`);
  },

  setCriteria(tenderId: string, criteria: Partial<EvaluationCriterion>[]) {
    return api.post<EvaluationCriterion[]>(`/api/eval/${tenderId}/criteria`, criteria);
  },

  submitScores(tenderId: string, scores: {
    bid_id: string; criterion_id: string; score: string; remarks?: string;
  }[]) {
    return api.post<EvaluationScore[]>(`/api/eval/${tenderId}/scores`, scores);
  },

  getResults(tenderId: string) {
    return api.get<EvaluationResult[]>(`/api/eval/${tenderId}/results`);
  },

  forward(tenderId: string, data: { to_stage: string; to_user_id?: string; notes: string }) {
    return api.post<{ success: true }>(`/api/eval/${tenderId}/forward`, data);
  },

  getComparison(tenderId: string) {
    return api.get<{ bid: any; results: EvaluationResult[] }[]>(`/api/eval/${tenderId}/comparison`);
  },

  getRanking(tenderId: string) {
    return api.get<EvaluationResult[]>(`/api/eval/${tenderId}/ranking`);
  },
};
