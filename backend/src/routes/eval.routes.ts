import { FastifyInstance } from 'fastify';
import { evaluationController } from '../controllers/evaluation.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

export async function evalRoutes(app: FastifyInstance) {
  const auth = [requireAuth];
  const evaluators = [requireAuth, requireRole([
    'prequal_evaluator', 'tech_evaluator', 'commercial_evaluator', 'auditor',
    'procurement_head', 'pe_admin',
  ])];
  const procurer = [requireAuth, requireRole(['pe_admin', 'procurer'])];

  app.get('/:tenderId/criteria', { preHandler: auth }, evaluationController.getCriteria);
  app.post('/:tenderId/criteria', { preHandler: procurer }, evaluationController.setCriteria);
  app.post('/:tenderId/scores', { preHandler: evaluators }, evaluationController.submitScores);
  app.get('/:tenderId/results', { preHandler: auth }, evaluationController.getResults);
  app.post('/:tenderId/forward', { preHandler: evaluators }, evaluationController.forward);
  app.get('/:tenderId/comparison', { preHandler: auth }, evaluationController.getComparison);
  app.get('/:tenderId/ranking', { preHandler: auth }, evaluationController.getRanking);
}
