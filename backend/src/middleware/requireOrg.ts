import { FastifyRequest, FastifyReply } from 'fastify';

// Verifies the requesting user belongs to the org specified in the route param
// Typically used as: { preHandler: [requireAuth, requireOrg] }
export async function requireOrg(req: FastifyRequest, reply: FastifyReply) {
  const params = req.params as { orgId?: string };
  const targetOrgId = params.orgId;

  if (!targetOrgId) return; // No org param — skip

  // Super admins can access any org
  if (req.user.role === 'super_admin') return;

  if (req.user.org_id !== targetOrgId) {
    return reply.code(403).send({
      error: 'Access denied. You do not belong to this organisation.',
    });
  }
}
