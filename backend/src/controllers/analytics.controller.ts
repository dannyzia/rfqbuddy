import { FastifyRequest, FastifyReply } from 'fastify';
import { analyticsService } from '../services/analytics.service';
import { pdfService } from '../services/pdf.service';

export const analyticsController = {
  async getProcurementStats(req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await analyticsService.getProcurementStats(req.user.org_id!));
  },

  async getSpendByCategory(req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await analyticsService.getSpendByCategory(req.user.org_id!));
  },

  async getVendorRanking(req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await analyticsService.getVendorRanking(req.user.org_id!));
  },

  async getTenderPipeline(req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await analyticsService.getTenderPipeline(req.user.org_id!));
  },

  async getMonthlySpend(req: FastifyRequest, reply: FastifyReply) {
    const { months } = req.query as { months?: string };
    return reply.send(await analyticsService.getMonthlySpend(req.user.org_id!, parseInt(months ?? '12')));
  },

  async getVendorConcentration(req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await analyticsService.getVendorConcentration(req.user.org_id!));
  },

  async getSavingsAnalysis(req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await analyticsService.getSavingsAnalysis(req.user.org_id!));
  },

  async getVendorDashboardStats(req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await analyticsService.getVendorDashboardStats(req.user.org_id!));
  },

  async exportProcurementReport(req: FastifyRequest, reply: FastifyReply) {
    const orgId = req.user.org_id!;
    const stats = await analyticsService.getProcurementStats(orgId);
    const spend = await analyticsService.getSpendByCategory(orgId);

    const pdfBuffer = await pdfService.generateProcurementReport({
      title: 'Procurement Summary Report',
      org_name: req.user.full_name, // TODO: use org name
      period: { start: '2026-01-01', end: '2026-03-13' },
      tenders: [], // TODO: populate from stats
      spend_by_category: (spend.rows as any[]).map((r: any) => ({
        category: r.category,
        amount: r.total_spend,
        count: r.contract_count,
      })),
    });

    return reply
      .header('Content-Type', 'application/pdf')
      .header('Content-Disposition', 'attachment; filename="procurement-report.pdf"')
      .send(pdfBuffer);
  },

  async getEfficiencyMetrics(req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await analyticsService.getEfficiencyMetrics(req.user.org_id!));
  },

  async getComplianceMetrics(req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await analyticsService.getComplianceMetrics(req.user.org_id!));
  },
};