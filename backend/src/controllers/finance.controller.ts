import { FastifyRequest, FastifyReply } from 'fastify';
import { financeService } from '../services/finance.service';
import { auditService } from '../services/audit.service';

export const financeController = {
  async getMatchingOverview(req: FastifyRequest, reply: FastifyReply) {
    const result = await financeService.getMatchingOverview(req.user.org_id);
    return reply.send(result);
  },

  async listPayments(req: FastifyRequest, reply: FastifyReply) {
    const query = req.query as any;
    const result = await financeService.listPayments({
      page: query.page ? parseInt(query.page) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize) : undefined,
      status: query.status,
    });
    return reply.send(result);
  },

  async createGRN(req: FastifyRequest, reply: FastifyReply) {
    const body = req.body as any;
    const grn = await financeService.createGRN({
      contract_id: body.contract_id,
      certificate_no: body.certificate_no,
      milestone_id: body.milestone_id,
      amount: body.amount,
      submitted_by: req.user.id,
    });
    await auditService.adminLog(req.user.id, 'CREATE_GRN', 'grn', grn.id);
    return reply.code(201).send(grn);
  },

  async getFxRates(req: FastifyRequest, reply: FastifyReply) {
    const { base } = req.query as { base?: string };
    const rates = await financeService.getFxRates(base);
    return reply.send(rates);
  },

  async getFxComparison(req: FastifyRequest, reply: FastifyReply) {
    const { tenderId } = req.params as { tenderId: string };
    const comparison = await financeService.getFxComparison(tenderId);
    return reply.send(comparison);
  },
};
