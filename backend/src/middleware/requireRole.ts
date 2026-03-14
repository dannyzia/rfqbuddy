import { FastifyRequest, FastifyReply } from 'fastify';
import type { Role } from '../types';

export function requireRole(allowedRoles: Role[]) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return reply.code(403).send({
        error: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
      });
    }
  };
}
