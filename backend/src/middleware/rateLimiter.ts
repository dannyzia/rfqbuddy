// Re-export Fastify rate limit config for different endpoint categories
// Applied at the route plugin level (see app.ts)

export const globalRateLimit = {
  max: 100,
  timeWindow: '15 minutes',
};

export const authRateLimit = {
  max: 10,
  timeWindow: '15 minutes',
};

export const uploadRateLimit = {
  max: 20,
  timeWindow: '15 minutes',
};
