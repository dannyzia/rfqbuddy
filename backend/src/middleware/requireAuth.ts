import { FastifyRequest, FastifyReply } from 'fastify';
import { auth } from '../config/auth';
import { db } from '../config/database';
import { profiles } from '../schema';
import { eq } from 'drizzle-orm';

export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  const session = await auth.api.getSession({
    headers: req.headers as Record<string, string>,
  });

  if (!session?.user) {
    return reply.code(401).send({ error: 'No valid session. Please sign in.' });
  }

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);

  if (!profile || !profile.is_active) {
    return reply.code(403).send({ error: 'Account is deactivated.' });
  }
  if (profile.status === 'pending') {
    return reply.code(403).send({ error: 'Account is pending admin approval.' });
  }
  if (profile.status === 'rejected') {
    return reply.code(403).send({ error: 'Account registration was not approved.' });
  }

  req.user = profile as any;
}
