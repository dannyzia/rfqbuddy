import { FastifyRequest, FastifyReply } from 'fastify';
import { developersService } from '../services/developers.service';
import { auditService } from '../services/audit.service';

export const developersController = {
  // API Keys
  async listApiKeys(req: FastifyRequest, reply: FastifyReply) {
    const keys = developersService.listApiKeys(req.user.org_id);
    return reply.send(keys);
  },

  async createApiKey(req: FastifyRequest, reply: FastifyReply) {
    const { name, scopes } = req.body as { name: string; scopes?: string[] };
    const key = developersService.createApiKey(req.user.org_id, name, scopes);
    await auditService.adminLog(req.user.id, 'CREATE_API_KEY', 'api_key', key.id, { name });
    return reply.code(201).send(key);
  },

  async revokeApiKey(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const key = developersService.revokeApiKey(id);
    if (!key) return reply.code(404).send({ error: 'API key not found' });
    await auditService.adminLog(req.user.id, 'REVOKE_API_KEY', 'api_key', id);
    return reply.send(key);
  },

  // Webhooks
  async listWebhooks(req: FastifyRequest, reply: FastifyReply) {
    const hooks = developersService.listWebhooks(req.user.org_id);
    return reply.send(hooks);
  },

  async createWebhook(req: FastifyRequest, reply: FastifyReply) {
    const { url, events } = req.body as { url: string; events: string[] };
    const webhook = developersService.createWebhook(req.user.org_id, url, events);
    await auditService.adminLog(req.user.id, 'CREATE_WEBHOOK', 'webhook', webhook.id, { url });
    return reply.code(201).send(webhook);
  },

  async deleteWebhook(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const deleted = developersService.deleteWebhook(id);
    if (!deleted) return reply.code(404).send({ error: 'Webhook not found' });
    await auditService.adminLog(req.user.id, 'DELETE_WEBHOOK', 'webhook', id);
    return reply.send({ success: true });
  },

  async toggleWebhook(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const { is_active } = req.body as { is_active: boolean };
    const wh = developersService.toggleWebhook(id, is_active);
    if (!wh) return reply.code(404).send({ error: 'Webhook not found' });
    return reply.send(wh);
  },
};
