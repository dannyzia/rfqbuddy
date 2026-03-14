import { FastifyRequest, FastifyReply } from 'fastify';
import { riskService } from '../services/risk.service';
import { auditService } from '../services/audit.service';

export const riskController = {
  async getDashboard(_req: FastifyRequest, reply: FastifyReply) {
    const data = await riskService.getDashboard();
    return reply.send(data);
  },

  async listAssessments(req: FastifyRequest, reply: FastifyReply) {
    const query = req.query as any;
    const result = await riskService.listAssessments({
      page: query.page ? parseInt(query.page) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize) : undefined,
    });
    return reply.send(result);
  },

  async getVendorRiskProfile(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const profile = await riskService.getVendorRiskProfile(id);
    if (!profile) return reply.code(404).send({ error: 'Vendor not found' });
    return reply.send(profile);
  },

  async updateRiskLevel(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const { risk_level } = req.body as { risk_level: string };
    const updated = await riskService.updateRiskLevel(id, risk_level);
    await auditService.adminLog(req.user.id, 'UPDATE_RISK_LEVEL', 'vendor', id, { risk_level });
    return reply.send(updated);
  },
};
