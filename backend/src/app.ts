// Fastify entry point — RFQ Hub API server
import 'dotenv/config';

import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { env } from './config/env.js';
import { registerRoutes } from './routes/index.js';
import { setupSocket } from './config/socket.js';
import { setupScheduledJobs, closeQueues } from './config/queue.js';
import { closeDatabasePool, checkDatabaseHealth } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { globalRateLimit, authRateLimit } from './middleware/rateLimiter.js';

async function start() {
  const app = Fastify({
    logger: {
      level: env.isDev ? 'debug' : 'info',
      transport: env.isDev ? { target: 'pino-pretty' } : undefined,
    },
  });

  // ── Security ───────────────────────────────────────────────────

  await app.register(helmet, {
    contentSecurityPolicy: false,  // Handled by frontend
  });

  await app.register(cors, {
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });

  // Global rate limit: 100 req / 15 min per IP
  await app.register(rateLimit, globalRateLimit);

  // ── Error Handler ──────────────────────────────────────────────

  app.setErrorHandler(errorHandler);

  // ── Routes ─────────────────────────────────────────────────────

  await registerRoutes(app);

  // Stricter rate limit on auth endpoints (10 req / 15 min)
  // Applied via Fastify's encapsulated plugin system
  app.register(async function authLimiter(instance) {
    await instance.register(rateLimit, authRateLimit);
  });

  // ── Socket.io (realtime) ───────────────────────────────────────

  setupSocket(app);

  // ── Scheduled Jobs (BullMQ cron) ───────────────────────────────

  await setupScheduledJobs();

  // ── Start ──────────────────────────────────────────────────────

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });

    const dbOk = await checkDatabaseHealth();
    app.log.info(`Database: ${dbOk ? 'connected' : 'UNREACHABLE'}`);
    app.log.info(`Server listening on http://0.0.0.0:${env.PORT}`);
    app.log.info(`Environment: ${env.NODE_ENV}`);
    app.log.info(`CORS origin: ${env.FRONTEND_URL}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  // ── Graceful Shutdown ──────────────────────────────────────────

  const shutdown = async (signal: string) => {
    app.log.info(`${signal} received — shutting down gracefully`);

    await app.close();
    await closeQueues();
    await closeDatabasePool();

    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start();
