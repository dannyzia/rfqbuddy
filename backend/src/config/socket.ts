// Socket.io realtime server
// Org-scoped rooms, role-filtered events, auth-gated connections

import { Server, Socket } from 'socket.io';
import { FastifyInstance } from 'fastify';
import { auth } from './auth';
import { db } from './database';
import { profiles } from '../schema';
import { eq } from 'drizzle-orm';
import { env } from './env';

let io: Server;

export function setupSocket(app: FastifyInstance): Server {
  io = new Server(app.server, {
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Auth middleware — verify Better Auth session before allowing WebSocket connection
  io.use(async (socket: Socket, next) => {
    try {
      const session = await auth.api.getSession({
        headers: socket.handshake.headers as Record<string, string>,
      });

      if (!session?.user) {
        return next(new Error('Unauthorized — no valid session'));
      }

      // Fetch profile (role, org_id)
      const [profile] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, session.user.id))
        .limit(1);

      if (!profile || !profile.is_active) {
        return next(new Error('Unauthorized — account inactive'));
      }

      socket.data.user = {
        id: profile.id,
        role: profile.role,
        org_id: profile.org_id,
        full_name: profile.full_name,
      };

      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const { org_id, role, id } = socket.data.user;

    // Join org-scoped room (tenant isolation)
    if (org_id) {
      socket.join(`org:${org_id}`);
    }

    // Join role-scoped room (for role-targeted broadcasts)
    socket.join(`role:${role}`);

    // Join personal room (for direct notifications)
    socket.join(`user:${id}`);

    console.log(`[Socket] ${socket.data.user.full_name} connected (org:${org_id}, role:${role})`);

    socket.on('disconnect', () => {
      console.log(`[Socket] ${socket.data.user.full_name} disconnected`);
    });
  });

  return io;
}

// Helper: emit to specific user
export function emitToUser(userId: string, event: string, data: unknown): void {
  io?.to(`user:${userId}`).emit(event, data);
}

// Helper: emit to all members of an org
export function emitToOrg(orgId: string, event: string, data: unknown): void {
  io?.to(`org:${orgId}`).emit(event, data);
}

// Helper: emit to all users with a specific role
export function emitToRole(role: string, event: string, data: unknown): void {
  io?.to(`role:${role}`).emit(event, data);
}

export function getIO(): Server {
  if (!io) throw new Error('Socket.io not initialized — call setupSocket() first');
  return io;
}
