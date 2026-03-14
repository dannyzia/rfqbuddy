/**
 * Phase 17 — Advanced Module Integration Tests
 *
 * Tests for all Phase 17 backend endpoints:
 *   - /api/compliance/* (KYC/AML)
 *   - /api/finance/*   (Three-Way Matching, FX)
 *   - /api/buy/*       (Guided Buying)
 *   - /api/risk/*      (Risk Assessment)
 *   - /api/ai/*        (Agentic AI)
 *   - /api/developers/*(API Keys, Webhooks)
 *   - /api/settings/*  (Accessibility)
 *   - /api/audit/*     (Blockchain Audit)
 *
 * These tests are designed to run against a test Fastify instance
 * with the full route tree registered. For CI, mock the DB layer
 * via `vi.mock('../config/database')`.
 */

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';

// ─── Mock database ──────────────────────────────────────────────
// In CI the real database is unavailable, so we mock drizzle results.
vi.mock('../config/database', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockResolvedValue([{ id: 'mock-id' }]),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue([]),
    then: vi.fn().mockResolvedValue([]),
  },
}));

// ─── Mock auth middleware ───────────────────────────────────────
vi.mock('../middleware/requireAuth', () => ({
  requireAuth: (_req: any, _reply: any, done: any) => {
    _req.user = { id: 'test-user-id', role: 'super_admin', org_id: 'test-org' };
    done();
  },
}));

vi.mock('../middleware/requireRole', () => ({
  requireRole: () => (_req: any, _reply: any, done: any) => done(),
}));

// ─── Build Fastify app ──────────────────────────────────────────
import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import { complianceRoutes } from '../routes/compliance.routes';
import { financeRoutes } from '../routes/finance.routes';
import { buyRoutes } from '../routes/buy.routes';
import { riskRoutes } from '../routes/risk.routes';
import { aiRoutes } from '../routes/ai.routes';
import { developersRoutes } from '../routes/developers.routes';
import { settingsRoutes } from '../routes/settings.routes';
import { blockchainAuditRoutes } from '../routes/blockchainAudit.routes';

let app: FastifyInstance;

beforeAll(async () => {
  app = Fastify({ logger: false });
  await app.register(complianceRoutes, { prefix: '/api/compliance' });
  await app.register(financeRoutes, { prefix: '/api/finance' });
  await app.register(buyRoutes, { prefix: '/api/buy' });
  await app.register(riskRoutes, { prefix: '/api/risk' });
  await app.register(aiRoutes, { prefix: '/api/ai' });
  await app.register(developersRoutes, { prefix: '/api/developers' });
  await app.register(settingsRoutes, { prefix: '/api/settings' });
  await app.register(blockchainAuditRoutes, { prefix: '/api/audit' });
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

// ─── Compliance Endpoints ───────────────────────────────────────

describe('Compliance Routes — /api/compliance', () => {
  it('GET /kyc — returns paginated KYC checks', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/compliance/kyc' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty('data');
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('GET /kyc/:id — returns a single KYC check', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/compliance/kyc/kyc-001' });
    expect([200, 404]).toContain(res.statusCode);
  });

  it('POST /kyc — creates a KYC check', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/compliance/kyc',
      payload: { vendor_org_id: 'v-1', check_type: 'initial' },
    });
    expect([200, 201]).toContain(res.statusCode);
  });

  it('GET /sanctions — returns sanctions alerts', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/compliance/sanctions' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty('data');
  });
});

// ─── Finance Endpoints ──────────────────────────────────────────

describe('Finance Routes — /api/finance', () => {
  it('GET /matching — returns matching overview', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/finance/matching' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /payments — returns paginated payments', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/finance/payments' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty('data');
  });

  it('GET /fx/rates — returns FX rates', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/finance/fx/rates' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty('base');
    expect(body).toHaveProperty('rates');
  });

  it('GET /fx/comparison/:tenderId — returns FX comparison', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/finance/fx/comparison/tnd-001' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty('tender_id');
    expect(body).toHaveProperty('comparisons');
  });
});

// ─── Buy Endpoints ──────────────────────────────────────────────

describe('Buy Routes — /api/buy', () => {
  it('GET /items — returns browseable items', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/buy/items' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty('data');
  });

  it('GET /cart — returns cart contents', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/buy/cart' });
    expect(res.statusCode).toBe(200);
  });

  it('POST /cart — adds item to cart', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/buy/cart',
      payload: { item_id: 'item-1', quantity: 3 },
    });
    expect([200, 201]).toContain(res.statusCode);
  });

  it('GET /orders — returns orders list', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/buy/orders' });
    expect(res.statusCode).toBe(200);
  });

  it('POST /checkout — submits checkout', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/buy/checkout',
      payload: { delivery_address: '42 Test Street', cost_center: 'CC-001' },
    });
    expect([200, 201]).toContain(res.statusCode);
  });
});

// ─── Risk Endpoints ─────────────────────────────────────────────

describe('Risk Routes — /api/risk', () => {
  it('GET /dashboard — returns risk dashboard', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/risk/dashboard' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty('total_vendors');
  });

  it('GET /assessments — returns assessments list', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/risk/assessments' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty('data');
  });

  it('GET /vendor/:id — returns vendor risk profile', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/risk/vendor/vnd-001' });
    expect([200, 404]).toContain(res.statusCode);
  });
});

// ─── AI Endpoints ───────────────────────────────────────────────

describe('AI Routes — /api/ai', () => {
  it('GET /agents — returns agent list', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/ai/agents' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  it('GET /analytics — returns AI analytics', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/ai/analytics' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty('total_actions_processed');
  });

  it('PATCH /agents/:id — updates agent config', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/api/ai/agents/sourcing',
      payload: { enabled: false },
    });
    expect([200, 404]).toContain(res.statusCode);
  });
});

// ─── Developers Endpoints ───────────────────────────────────────

describe('Developers Routes — /api/developers', () => {
  it('GET /api-keys — returns API keys', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/developers/api-keys' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  it('POST /api-keys — generates a new API key', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/developers/api-keys',
      payload: { name: 'Test Key', env: 'test' },
    });
    expect([200, 201]).toContain(res.statusCode);
  });

  it('GET /webhooks — returns webhook configs', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/developers/webhooks' });
    expect(res.statusCode).toBe(200);
  });

  it('POST /webhooks — creates a webhook', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/developers/webhooks',
      payload: { url: 'https://example.com/hook', events: ['tender.published'] },
    });
    expect([200, 201]).toContain(res.statusCode);
  });
});

// ─── Settings Endpoints ─────────────────────────────────────────

describe('Settings Routes — /api/settings', () => {
  it('GET /accessibility — returns accessibility preferences', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/settings/accessibility' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty('high_contrast');
  });

  it('PUT /accessibility — updates accessibility preferences', async () => {
    const res = await app.inject({
      method: 'PUT',
      url: '/api/settings/accessibility',
      payload: { high_contrast: true, large_text: false, reduce_motion: true },
    });
    expect(res.statusCode).toBe(200);
  });
});

// ─── Blockchain Audit Endpoints ─────────────────────────────────

describe('Blockchain Audit Routes — /api/audit', () => {
  let anchorId: string;

  it('POST /anchor — creates a blockchain anchor', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/audit/anchor',
      payload: {
        event_type: 'contract.signed',
        entity_type: 'contract',
        entity_id: 'c-001',
        payload: { contract_value: 500000, vendor: 'Test Vendor' },
      },
    });
    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('payload_hash');
    expect(body).toHaveProperty('tx_hash');
    expect(body).toHaveProperty('block_number');
    expect(body.verified).toBe(true);
    anchorId = body.id;
  });

  it('GET /verify/:id — verifies a blockchain anchor', async () => {
    // First create one to ensure it exists
    const createRes = await app.inject({
      method: 'POST',
      url: '/api/audit/anchor',
      payload: {
        event_type: 'bid.submitted',
        entity_type: 'bid',
        entity_id: 'b-001',
        payload: { amount: 100000 },
      },
    });
    const created = createRes.json();

    const res = await app.inject({ method: 'GET', url: `/api/audit/verify/${created.id}` });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.verified).toBe(true);
    expect(body).toHaveProperty('verified_at');
  });

  it('GET /verify/:id — returns 404 for non-existent anchor', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/audit/verify/non-existent-id' });
    expect(res.statusCode).toBe(404);
  });

  it('GET /anchors — returns paginated anchor list', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/audit/anchors' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('page');
  });

  it('POST /anchor — produces deterministic hash for same payload', async () => {
    const payload = { event_type: 'test', entity_type: 'test', entity_id: 't1', payload: { key: 'value' } };

    const res1 = await app.inject({ method: 'POST', url: '/api/audit/anchor', payload });
    const res2 = await app.inject({ method: 'POST', url: '/api/audit/anchor', payload });

    expect(res1.json().payload_hash).toBe(res2.json().payload_hash);
  });
});
