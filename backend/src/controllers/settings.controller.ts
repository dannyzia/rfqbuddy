import { FastifyRequest, FastifyReply } from 'fastify';
import { settingsService } from '../services/settings.service';

export const settingsController = {
  async getAccessibility(req: FastifyRequest, reply: FastifyReply) {
    const prefs = await settingsService.getAccessibilityPreferences(req.user.id);
    return reply.send(prefs);
  },

  async updateAccessibility(req: FastifyRequest, reply: FastifyReply) {
    const body = req.body as Record<string, any>;
    const updated = await settingsService.updateAccessibilityPreferences(req.user.id, body);
    return reply.send(updated);
  },
};
