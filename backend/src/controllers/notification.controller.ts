import { FastifyRequest, FastifyReply } from 'fastify';
import { notificationService } from '../services/notification.service';

export const notificationController = {
  async list(req: FastifyRequest, reply: FastifyReply) {
    const { unread } = req.query as { unread?: string };
    return reply.send(await notificationService.listForUser(req.user.id, unread === 'true'));
  },

  async markAsRead(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    await notificationService.markAsRead(id, req.user.id);
    return reply.send({ success: true });
  },

  async markAllRead(req: FastifyRequest, reply: FastifyReply) {
    await notificationService.markAllRead(req.user.id);
    return reply.send({ success: true });
  },

  async getUnreadCount(req: FastifyRequest, reply: FastifyReply) {
    const count = await notificationService.getUnreadCount(req.user.id);
    return reply.send({ count });
  },
};
