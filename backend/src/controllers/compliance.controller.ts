import { FastifyRequest, FastifyReply } from 'fastify';
import { complianceService } from '../services/compliance.service';
import { auditService } from '../services/audit.service';

export const complianceController = {
  async listKycChecks(req: FastifyRequest, reply: FastifyReply) {
    const query = req.query as any;
    const result = await complianceService.listKycChecks({
      page: query.page ? parseInt(query.page) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize) : undefined,
      status: query.status,
    });
    return reply.send(result);
  },

  async getKycDetail(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const detail = await complianceService.getKycDetail(id);
    if (!detail) return reply.code(404).send({ error: 'Vendor not found' });
    return reply.send(detail);
  },

  async updateKycStatus(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const { status } = req.body as { status: string };
    const updated = await complianceService.updateKycStatus(id, status);
    await auditService.adminLog(req.user.id, 'UPDATE_KYC_STATUS', 'vendor', id, { status });
    return reply.send(updated);
  },

  async getSanctionsAlerts(_req: FastifyRequest, reply: FastifyReply) {
    const alerts = await complianceService.getSanctionsAlerts();
    return reply.send(alerts);
  },
};
