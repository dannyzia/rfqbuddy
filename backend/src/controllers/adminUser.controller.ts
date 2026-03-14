import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../config/database';
import { profiles } from '../schema';
import { eq, desc, sql } from 'drizzle-orm';
import { auditService } from '../services/audit.service';

export const adminUserController = {
  async list(req: FastifyRequest, reply: FastifyReply) {
    const query = req.query as any;
    const page = parseInt(query.page ?? '1');
    const pageSize = parseInt(query.pageSize ?? '20');
    const users = await db.select().from(profiles).orderBy(desc(profiles.created_at)).limit(pageSize).offset((page - 1) * pageSize);
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(profiles);
    return reply.send({ data: users, total: Number(count), page, pageSize });
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    const body = req.body as any;
    const [user] = await db.insert(profiles).values(body).returning();
    await auditService.adminLog(req.user.id, 'CREATE_USER', 'user', user.id, { email: body.email });
    return reply.code(201).send(user);
  },

  async update(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const [updated] = await db.update(profiles).set({ ...req.body as any, updated_at: new Date() }).where(eq(profiles.id, id)).returning();
    await auditService.adminLog(req.user.id, 'UPDATE_USER', 'user', id);
    return reply.send(updated);
  },

  async approve(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const [updated] = await db.update(profiles).set({ status: 'approved', updated_at: new Date() }).where(eq(profiles.id, id)).returning();
    await auditService.adminLog(req.user.id, 'APPROVE_USER', 'user', id);
    return reply.send(updated);
  },

  async reject(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const [updated] = await db.update(profiles).set({ status: 'rejected', updated_at: new Date() }).where(eq(profiles.id, id)).returning();
    await auditService.adminLog(req.user.id, 'REJECT_USER', 'user', id);
    return reply.send(updated);
  },

  async deactivate(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const [updated] = await db.update(profiles).set({ is_active: false, updated_at: new Date() }).where(eq(profiles.id, id)).returning();
    await auditService.adminLog(req.user.id, 'DEACTIVATE_USER', 'user', id);
    return reply.send(updated);
  },
};
