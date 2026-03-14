// Environment variable validation — fail fast on missing config
// Loaded at startup, before anything else

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env = {
  // Server
  NODE_ENV: optional('NODE_ENV', 'development'),
  PORT: parseInt(optional('PORT', '3001'), 10),

  // Database (Neon / Railway PostgreSQL)
  DATABASE_URL: required('DATABASE_URL'),

  // Redis (Upstash / Railway)
  REDIS_URL: required('REDIS_URL'),

  // Better Auth
  AUTH_SECRET: required('AUTH_SECRET'),
  BETTER_AUTH_URL: optional('BETTER_AUTH_URL', 'http://localhost:3001'),

  // Cloudflare R2 (S3-compatible)
  R2_ENDPOINT: required('R2_ENDPOINT'),
  R2_ACCESS_KEY_ID: required('R2_ACCESS_KEY_ID'),
  R2_SECRET_ACCESS_KEY: required('R2_SECRET_ACCESS_KEY'),
  R2_BUCKET_NAME: optional('R2_BUCKET_NAME', 'rfq-hub-files'),

  // Resend (email)
  RESEND_API_KEY: required('RESEND_API_KEY'),

  // Frontend
  FRONTEND_URL: optional('FRONTEND_URL', 'http://localhost:3000'),

  // Computed
  get isProd() {
    return this.NODE_ENV === 'production';
  },
  get isDev() {
    return this.NODE_ENV === 'development';
  },
} as const;
