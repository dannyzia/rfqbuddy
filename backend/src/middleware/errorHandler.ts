import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

export function errorHandler(
  error: FastifyError,
  _req: FastifyRequest,
  reply: FastifyReply,
) {
  const statusCode = error.statusCode ?? 500;

  // Log 5xx errors with full stack, 4xx with just message
  if (statusCode >= 500) {
    console.error('[ERROR]', error);
  } else {
    console.warn(`[WARN] ${statusCode}: ${error.message}`);
  }

  // Rate limit exceeded
  if (statusCode === 429) {
    return reply.code(429).send({
      error: 'Too many requests. Please slow down.',
    });
  }

  // Validation errors (from Fastify JSON Schema)
  if (error.validation) {
    return reply.code(400).send({
      error: 'Validation failed',
      details: error.validation,
    });
  }

  // Generic error response (never leak internals in production)
  return reply.code(statusCode).send({
    error: statusCode >= 500
      ? 'Internal server error'
      : error.message,
  });
}
