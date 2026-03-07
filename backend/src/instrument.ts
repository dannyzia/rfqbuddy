import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import dotenv from 'dotenv';

// Load env vars independently here — this file is imported before app setup
dotenv.config();

/**
 * Whether Sentry was successfully initialised.
 * Consumers (e.g. app.ts) should guard `Sentry.setupExpressErrorHandler`
 * behind this flag so that a missing / invalid DSN never crashes the app.
 */
export let sentryEnabled = false;

const dsn = process.env.SENTRY_DSN;

/**
 * Validate a Sentry DSN format before passing to Sentry.init().
 * Sentry.init() does NOT throw on invalid DSNs — it only logs a console.error
 * internally, which means sentryEnabled would incorrectly become true.
 * This regex matches the format Sentry's own DSN parser accepts:
 *   https://<public-key>@<host>/<project-id>
 * where <public-key> must be alphanumeric (no hyphens).
 */
function isValidSentryDsn(value: string): boolean {
  return /^(?:https?):\/\/(?:\w+)(?::(?:\w+))?@[\w.-]+(?::\d+)?\/\w+/.test(value);
}

if (dsn) {
  if (!isValidSentryDsn(dsn)) {
    console.warn('[Sentry] SENTRY_DSN format is invalid — error monitoring disabled. Ensure it matches: https://<key>@<host>/<project-id>');
  } else {
    try {
      Sentry.init({
        dsn,
        integrations: [nodeProfilingIntegration()],
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,
        environment: process.env.NODE_ENV || 'development',
      });
      sentryEnabled = true;
      console.info('[Sentry] Initialised successfully.');
    } catch (err) {
      console.error('[Sentry] Initialisation failed — error monitoring disabled:', err);
    }
  }
} else {
  console.warn('[Sentry] SENTRY_DSN is not set — error monitoring disabled.');
}
