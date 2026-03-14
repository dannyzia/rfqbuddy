import { db } from '../config/database';
import { activityLogs } from '../schema';
import { eq, desc, sql } from 'drizzle-orm';
import crypto from 'crypto';

// Developer portal service — API key management & webhook configuration.
// In production these would have dedicated tables (api_keys, webhooks, webhook_logs).
// For MVP we use in-memory storage patterns with audit logging.

// In-memory stores (replaced by DB tables in production)
const apiKeys: Map<string, { id: string; org_id: string; name: string; key_prefix: string; scopes: string[]; created_at: string; last_used_at: string | null; is_active: boolean }> = new Map();
const webhooks: Map<string, { id: string; org_id: string; url: string; events: string[]; secret: string; is_active: boolean; created_at: string }> = new Map();

export const developersService = {
  listApiKeys(orgId: string) {
    return Array.from(apiKeys.values()).filter(k => k.org_id === orgId);
  },

  createApiKey(orgId: string, name: string, scopes: string[] = ['read']) {
    const id = crypto.randomUUID();
    const rawKey = `sk_live_${crypto.randomBytes(24).toString('hex')}`;
    const keyPrefix = rawKey.slice(0, 12) + '...';
    const entry = {
      id, org_id: orgId, name, key_prefix: keyPrefix,
      scopes, created_at: new Date().toISOString(), last_used_at: null, is_active: true,
    };
    apiKeys.set(id, entry);
    // Return full key only on creation
    return { ...entry, key: rawKey };
  },

  revokeApiKey(id: string) {
    const key = apiKeys.get(id);
    if (!key) return null;
    key.is_active = false;
    return key;
  },

  listWebhooks(orgId: string) {
    return Array.from(webhooks.values()).filter(w => w.org_id === orgId);
  },

  createWebhook(orgId: string, url: string, events: string[]) {
    const id = crypto.randomUUID();
    const secret = `whsec_${crypto.randomBytes(16).toString('hex')}`;
    const entry = {
      id, org_id: orgId, url, events, secret,
      is_active: true, created_at: new Date().toISOString(),
    };
    webhooks.set(id, entry);
    return entry;
  },

  deleteWebhook(id: string) {
    return webhooks.delete(id);
  },

  toggleWebhook(id: string, isActive: boolean) {
    const wh = webhooks.get(id);
    if (!wh) return null;
    wh.is_active = isActive;
    return wh;
  },
};
