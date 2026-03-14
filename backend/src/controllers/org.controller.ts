import { FastifyRequest, FastifyReply } from 'fastify';
import { orgService } from '../services/org.service';

export const orgController = {
  async list(req: FastifyRequest, reply: FastifyReply) {
    const query = req.query as any;
    const result = await orgService.list(req.user, {
      type: query.type, status: query.status,
      page: parseInt(query.page ?? '1'), pageSize: parseInt(query.pageSize ?? '20'),
    });
    return reply.send(result);
  },

  async getById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const org = await orgService.getById(id);
    if (!org) return reply.code(404).send({ error: 'Organisation not found' });
    return reply.send(org);
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    const org = await orgService.create(req.body as any, req.user);
    return reply.code(201).send(org);
  },

  async update(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const updated = await orgService.update(id, req.body as any, req.user);
    return reply.send(updated);
  },

  async approve(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const updated = await orgService.approve(id, req.user);
    return reply.send(updated);
  },

  async reject(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const updated = await orgService.reject(id, req.user);
    return reply.send(updated);
  },

  async suspend(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const updated = await orgService.suspend(id, req.user);
    return reply.send(updated);
  },

  // Members
  async getMembers(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    return reply.send(await orgService.getMembers(id));
  },

  async addMember(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const { user_id, role } = req.body as any;
    const member = await orgService.addMember(id, user_id, role, req.user.id);
    return reply.code(201).send(member);
  },

  async removeMember(req: FastifyRequest, reply: FastifyReply) {
    const { id, uid } = req.params as { id: string; uid: string };
    try {
      await orgService.removeMember(id, uid, req.user);
      return reply.send({ success: true });
    } catch (err: any) {
      return reply.code(400).send({ error: err.message });
    }
  },

  async updateMemberRole(req: FastifyRequest, reply: FastifyReply) {
    const { id, uid } = req.params as { id: string; uid: string };
    const { role } = req.body as any;
    await orgService.updateMemberRole(id, uid, role, req.user);
    return reply.send({ success: true });
  },
};
