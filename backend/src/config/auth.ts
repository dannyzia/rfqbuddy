// Better Auth configuration
// Single service replacing GoTrue + Kong + Supavisor (3 containers -> 1 library)

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { twoFactor } from 'better-auth/plugins';
import { db } from './database.js';
import { env } from './env.js';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  secret: env.AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: env.isProd,  // Skip in dev for convenience
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,  // 7 days
    updateAge: 24 * 60 * 60,    // Refresh token daily
  },

  socialProviders: {
    // Uncomment when OAuth credentials are configured:
    // google: {
    //   clientId: env.GOOGLE_CLIENT_ID,
    //   clientSecret: env.GOOGLE_CLIENT_SECRET,
    // },
    // github: {
    //   clientId: env.GITHUB_CLIENT_ID,
    //   clientSecret: env.GITHUB_CLIENT_SECRET,
    // },
  },

  plugins: [
    twoFactor({
      issuer: 'RFQ Hub',
    }),
  ],

  advanced: {
    cookiePrefix: 'rfq-hub',
    crossSubDomainCookies: {
      enabled: env.isProd,
      domain: env.isProd ? '.rfqhub.com' : undefined,
    },
  },
});

export type Auth = typeof auth;
