import { FastifyRequest, FastifyReply } from 'fastify';
import { blockchainAuditService } from '../services/blockchainAudit.service';

export const blockchainAuditController = {
  async anchor(req: FastifyRequest, reply: FastifyReply) {
    const body = req.body as any;
    const record = await blockchainAuditService.anchor({
      event_type: body.event_type,
      entity_type: body.entity_type,
      entity_id: body.entity_id,
      payload: body.payload,
      user_id: req.user.id,
    });
    return reply.code(201).send(record);
  },

  async verify(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const result = await blockchainAuditService.verify(id);
    if (!result) return reply.code(404).send({ error: 'Anchor not found' });
    return reply.send(result);
  },

  async list(req: FastifyRequest, reply: FastifyReply) {
    const query = req.query as any;
    const result = blockchainAuditService.listAnchors({
      entity_type: query.entity_type,
      page: query.page ? parseInt(query.page) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize) : undefined,
    });
    return reply.send(result);
  },
};
