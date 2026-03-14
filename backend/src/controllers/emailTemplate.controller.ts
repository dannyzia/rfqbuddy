import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../config/database';
import { emailTemplates } from '../schema';
import { eq } from 'drizzle-orm';
import { auditService } from '../services/audit.service';

export const emailTemplateController = {
  async list(_req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await db.select().from(emailTemplates));
  },

  async getByKey(req: FastifyRequest, reply: FastifyReply) {
    const { key } = req.params as { key: string };
    const [template] = await db.select().from(emailTemplates)
      .where(eq(emailTemplates.key, key)).limit(1);
    if (!template) return reply.code(404).send({ error: 'Template not found' });
    return reply.send(template);
  },

  async update(req: FastifyRequest, reply: FastifyReply) {
    const { key } = req.params as { key: string };
    const body = req.body as { subject?: string; html_body?: string; variables?: string[] };

    const [updated] = await db.update(emailTemplates).set({
      ...body,
      updated_at: new Date(),
      updated_by: req.user.id,
    }).where(eq(emailTemplates.key, key)).returning();

    await auditService.adminLog(req.user.id, 'UPDATE_EMAIL_TEMPLATE', 'email_template', key);
    return reply.send(updated);
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    const body = req.body as any;
    const [template] = await db.insert(emailTemplates).values({
      key: body.key,
      subject: body.subject,
      html_body: body.html_body,
      variables: body.variables ?? [],
      description: body.description ?? null,
      updated_by: req.user.id,
    }).returning();

    await auditService.adminLog(req.user.id, 'CREATE_EMAIL_TEMPLATE', 'email_template', body.key);
    return reply.code(201).send(template);
  },

  async remove(req: FastifyRequest, reply: FastifyReply) {
    const { key } = req.params as { key: string };
    await db.delete(emailTemplates).where(eq(emailTemplates.key, key));
    await auditService.adminLog(req.user.id, 'DELETE_EMAIL_TEMPLATE', 'email_template', key);
    return reply.send({ success: true });
  },
};
