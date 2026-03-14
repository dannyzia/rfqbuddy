import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../config/database';
import { tenders } from '../schema';
import { desc, sql, eq } from 'drizzle-orm';
import { auditService } from '../services/audit.service';

export const adminTenderController = {
  async list(req: FastifyRequest, reply: FastifyReply) {
    const query = req.query as any;
    const page = parseInt(query.page ?? '1');
    const pageSize = parseInt(query.pageSize ?? '20');
    const data = await db.select().from(tenders).orderBy(desc(tenders.created_at)).limit(pageSize).offset((page - 1) * pageSize);
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(tenders);
    return reply.send({ data, total: Number(count), page, pageSize });
  },

  async remove(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    await db.delete(tenders).where(eq(tenders.id, id));
    await auditService.adminLog(req.user.id, 'DELETE_TENDER', 'tender', id);
    return reply.send({ success: true });
  },
};
