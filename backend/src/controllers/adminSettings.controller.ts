import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../config/database';
import { platformSettings } from '../schema';
import { eq } from 'drizzle-orm';
import { auditService } from '../services/audit.service';

export const adminSettingsController = {
  async list(_req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await db.select().from(platformSettings));
  },

  async update(req: FastifyRequest, reply: FastifyReply) {
    const { key } = req.params as { key: string };
    const { value } = req.body as { value: string };
    const [updated] = await db.update(platformSettings)
      .set({ value, updated_at: new Date(), updated_by: req.user.id })
      .where(eq(platformSettings.key, key))
      .returning();
    await auditService.adminLog(req.user.id, 'UPDATE_SETTING', 'setting', key, { value });
    return reply.send(updated);
  },
};
