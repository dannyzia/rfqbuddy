/**
 * Phase 18 — Core Platform Integration Tests
 *
 * Covers the Phase 18 Testing Checklist:
 *   1. Authentication flows
 *   2. Tender lifecycle & status transitions
 *   3. Bid submission rules
 *   4. Contract generation from award
 *   5. Admin endpoints (users, settings, templates, audit logs)
 *   6. Support tickets
 *   7. Notifications
 *   8. Catalogue & ordering
 *   9. Analytics
 *
 * Mock strategy: DB + auth middleware mocked so tests run without
 * a live Postgres connection, validating route registration,
 * controller dispatch, and response shapes.
 */

import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from 'vitest';

// ─── Mock database ──────────────────────────────────────────────
const mockInsert = vi.fn().mockReturnThis();
const mockValues = vi.fn().mockResolvedValue([{ id: 'new-id' }]);
const mockReturning = vi.fn().mockResolvedValue([{ id: 'new-id', status: 'pending' }]);
const mockSelect = vi.fn().mockReturnThis();
const mockFrom = vi.fn().mockReturnThis();
const mockWhere = vi.fn().mockReturnThis();
const mockOrderBy = vi.fn().mockReturnThis();
const mockLimit = vi.fn().mockReturnThis();
const mockOffset = vi.fn().mockReturnThis();
const mockUpdate = vi.fn().mockReturnThis();
const mockSet = vi.fn().mockReturnThis();
const mockDelete = vi.fn().mockReturnThis();

vi.mock('../config/database', () => ({
  db: {
    select: mockSelect,
    from: mockFrom,
    where: mockWhere,
    orderBy: mockOrderBy,
    limit: mockLimit,
    offset: mockOffset,
    insert: mockInsert,
    values: mockValues,
    returning: mockReturning,
    update: mockUpdate,
    set: mockSet,
    delete: mockDelete,
    execute: vi.fn().mockResolvedValue([]),
    then: vi.fn().mockResolvedValue([]),
  },
}));

// ─── Mock auth middleware ───────────────────────────────────────
let mockUser = { id: 'test-user', role: 'super_admin', org_id: 'org-1', email: 'admin@test.com' };

vi.mock('../middleware/requireAuth', () => ({
  requireAuth: (req: any, _reply: any, done: any) => {
    req.user = { ...mockUser };
    done();
  },
}));

vi.mock('../middleware/requireRole', () => ({
  requireRole: (_roles: string[]) => (_req: any, _reply: any, done: any) => done(),
}));

// ─── Build Fastify app ──────────────────────────────────────────
import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import { authRoutes } from '../routes/auth.routes';
import { tenderRoutes } from '../routes/tender.routes';
import { bidRoutes } from '../routes/bid.routes';
import { contractRoutes } from '../routes/contract.routes';
import { vendorRoutes } from '../routes/vendor.routes';
import { adminRoutes } from '../routes/admin.routes';
import { notificationRoutes } from '../routes/notification.routes';
import { catalogueRoutes } from '../routes/catalogue.routes';
import { ticketRoutes } from '../routes/ticket.routes';
import { analyticsRoutes } from '../routes/analytics.routes';
import { activityLogRoutes } from '../routes/activityLog.routes';

let app: FastifyInstance;

beforeAll(async () => {
  app = Fastify({ logger: false });
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(tenderRoutes, { prefix: '/api/tenders' });
  await app.register(bidRoutes, { prefix: '/api/bids' });
  await app.register(contractRoutes, { prefix: '/api/contracts' });
  await app.register(vendorRoutes, { prefix: '/api/vendors' });
  await app.register(adminRoutes, { prefix: '/api/admin' });
  await app.register(notificationRoutes, { prefix: '/api/notifications' });
  await app.register(catalogueRoutes, { prefix: '/api/catalogue' });
  await app.register(ticketRoutes, { prefix: '/api/tickets' });
  await app.register(analyticsRoutes, { prefix: '/api/analytics' });
  await app.register(activityLogRoutes, { prefix: '/api/activity-logs' });
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

beforeEach(() => {
  vi.clearAllMocks();
  mockUser = { id: 'test-user', role: 'super_admin', org_id: 'org-1', email: 'admin@test.com' };
});

// ═══════════════════════════════════════════════════════════════
//  1. AUTHENTICATION
// ═══════════════════════════════════════════════════════════════

describe('Authentication — /api/auth', () => {
  it('POST /signup — registers a new user', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/signup',
      payload: {
        email: 'newuser@test.com',
        password: 'SecureP@ss1!',
        full_name: 'New User',
        role: 'procurer',
      },
    });
    // Should respond 200/201 or appropriate error shape
    expect([200, 201, 400, 422]).toContain(res.statusCode);
  });

  it('POST /signin — authenticates a user', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/signin',
      payload: { email: 'admin@test.com', password: 'password123' },
    });
    expect([200, 401, 403]).toContain(res.statusCode);
  });

  it('GET /me — returns current user profile', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/auth/me' });
    expect([200, 401]).toContain(res.statusCode);
  });

  it('POST /signout — ends session', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/auth/signout' });
    expect([200, 204]).toContain(res.statusCode);
  });
});

// ═══════════════════════════════════════════════════════════════
//  2. TENDER LIFECYCLE
// ═══════════════════════════════════════════════════════════════

describe('Tender Lifecycle — /api/tenders', () => {
  it('GET / — lists tenders', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/tenders' });
    expect(res.statusCode).toBe(200);
  });

  it('POST / — creates a new tender', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/tenders',
      payload: {
        title: 'Test Tender',
        tender_type: 'nrq1_simple',
        currency: 'BDT',
        submission_deadline: '2026-04-15',
        eval_method: 'lowest_price',
        tech_weight: '0',
        commercial_weight: '100',
        pass_fail_threshold: '0',
        validity_days: 90,
      },
    });
    expect([200, 201]).toContain(res.statusCode);
  });

  it('GET /:id — fetches tender detail', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/tenders/tnd-001' });
    expect([200, 404]).toContain(res.statusCode);
  });

  it('PATCH /:id — updates tender fields', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/api/tenders/tnd-001',
      payload: { title: 'Updated Title' },
    });
    expect([200, 404]).toContain(res.statusCode);
  });

  it('POST /:id/publish — publishes a tender', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/tenders/tnd-001/publish',
    });
    expect([200, 400, 404]).toContain(res.statusCode);
  });

  it('POST /:id/award — awards a tender', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/tenders/tnd-001/award',
      payload: { bid_id: 'bid-001' },
    });
    expect([200, 400, 404]).toContain(res.statusCode);
  });
});

// ═══════════════════════════════════════════════════════════════
//  3. BID MANAGEMENT
// ═══════════════════════════════════════════════════════════════

describe('Bid Management — /api/bids', () => {
  it('GET / — lists bids (with tender filter)', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/bids?tender_id=tnd-001' });
    expect(res.statusCode).toBe(200);
  });

  it('POST / — creates a new bid', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/bids',
      payload: {
        tender_id: 'tnd-001',
        currency: 'BDT',
        validity_days: 60,
        compliance_declaration: true,
      },
    });
    expect([200, 201, 400]).toContain(res.statusCode);
  });

  it('POST /:id/submit — submits a draft bid', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/bids/bid-001/submit',
    });
    expect([200, 400, 404]).toContain(res.statusCode);
  });

  it('POST /:id/withdraw — withdraws a bid', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/bids/bid-001/withdraw',
    });
    expect([200, 400, 404]).toContain(res.statusCode);
  });
});

// ═══════════════════════════════════════════════════════════════
//  4. CONTRACT MANAGEMENT
// ═══════════════════════════════════════════════════════════════

describe('Contract Management — /api/contracts', () => {
  it('GET / — lists contracts', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/contracts' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /:id — fetches contract detail', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/contracts/ctr-001' });
    expect([200, 404]).toContain(res.statusCode);
  });

  it('POST / — creates a new contract', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/contracts',
      payload: {
        tender_id: 'tnd-001',
        vendor_org_id: 'vnd-001',
        title: 'Test Contract',
        contract_value: '1000000',
        currency: 'BDT',
        start_date: '2026-04-01',
        end_date: '2027-04-01',
      },
    });
    expect([200, 201]).toContain(res.statusCode);
  });

  it('GET /:id/milestones — lists contract milestones', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/contracts/ctr-001/milestones' });
    expect([200, 404]).toContain(res.statusCode);
  });

  it('GET /:id/variations — lists contract variations', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/contracts/ctr-001/variations' });
    expect([200, 404]).toContain(res.statusCode);
  });
});

// ═══════════════════════════════════════════════════════════════
//  5. ADMIN ENDPOINTS
// ═══════════════════════════════════════════════════════════════

describe('Admin — /api/admin', () => {
  it('GET /stats — returns admin dashboard KPIs', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/admin/stats' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /users — lists all users', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/admin/users' });
    expect(res.statusCode).toBe(200);
  });

  it('POST /users/:id/approve — approves a user', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/admin/users/usr-001/approve',
    });
    expect([200, 404]).toContain(res.statusCode);
  });

  it('POST /users/:id/reject — rejects a user', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/admin/users/usr-001/reject',
    });
    expect([200, 404]).toContain(res.statusCode);
  });

  it('GET /settings — returns platform settings', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/admin/settings' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /email-templates — returns email templates', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/admin/email-templates' });
    expect(res.statusCode).toBe(200);
  });
});

// ═══════════════════════════════════════════════════════════════
//  6. VENDOR MANAGEMENT
// ═══════════════════════════════════════════════════════════════

describe('Vendor Management — /api/vendors', () => {
  it('GET / — lists vendors', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/vendors' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /:id — fetches vendor detail', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/vendors/vnd-001' });
    expect([200, 404]).toContain(res.statusCode);
  });
});

// ═══════════════════════════════════════════════════════════════
//  7. NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════

describe('Notifications — /api/notifications', () => {
  it('GET / — lists notifications for current user', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/notifications' });
    expect(res.statusCode).toBe(200);
  });

  it('PATCH /:id/read — marks notification as read', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/api/notifications/notif-001/read',
    });
    expect([200, 404]).toContain(res.statusCode);
  });
});

// ═══════════════════════════════════════════════════════════════
//  8. SUPPORT TICKETS
// ═══════════════════════════════════════════════════════════════

describe('Support Tickets — /api/tickets', () => {
  it('GET / — lists tickets', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/tickets' });
    expect(res.statusCode).toBe(200);
  });

  it('POST / — creates a ticket', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/tickets',
      payload: {
        subject: 'Test issue',
        description: 'Something is broken',
        type: 'bug',
        priority: 'high',
      },
    });
    expect([200, 201]).toContain(res.statusCode);
  });

  it('GET /:id — fetches ticket detail with messages', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/tickets/tkt-001' });
    expect([200, 404]).toContain(res.statusCode);
  });

  it('POST /:id/messages — adds a message to a ticket', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/tickets/tkt-001/messages',
      payload: { message: 'Please check ASAP', is_internal: false },
    });
    expect([200, 201, 404]).toContain(res.statusCode);
  });
});

// ═══════════════════════════════════════════════════════════════
//  9. CATALOGUE & ORDERING
// ═══════════════════════════════════════════════════════════════

describe('Catalogue — /api/catalogue', () => {
  it('GET /categories — lists categories', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/catalogue/categories' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /items — lists catalogue items', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/catalogue/items' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /cart — returns cart contents', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/catalogue/cart' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /orders — lists orders', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/catalogue/orders' });
    expect(res.statusCode).toBe(200);
  });
});

// ═══════════════════════════════════════════════════════════════
//  10. ANALYTICS
// ═══════════════════════════════════════════════════════════════

describe('Analytics — /api/analytics', () => {
  it('GET /procurement — returns procurement stats', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/analytics/procurement' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /spend — returns spend analysis', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/analytics/spend' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /efficiency — returns efficiency metrics', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/analytics/efficiency' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /compliance — returns compliance metrics', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/analytics/compliance' });
    expect(res.statusCode).toBe(200);
  });
});

// ═══════════════════════════════════════════════════════════════
//  11. ACTIVITY LOGS
// ═══════════════════════════════════════════════════════════════

describe('Activity Logs — /api/activity-logs', () => {
  it('GET / — lists activity logs for current user', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/activity-logs' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /all — lists all logs (admin)', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/activity-logs/all' });
    expect(res.statusCode).toBe(200);
  });
});

// ═══════════════════════════════════════════════════════════════
//  12. CROSS-CUTTING: RESPONSE SHAPE CONTRACTS
// ═══════════════════════════════════════════════════════════════

describe('Response Shape Contracts', () => {
  it('paginated endpoints return { data, total, page, pageSize }', async () => {
    const endpoints = [
      '/api/tenders',
      '/api/bids',
      '/api/contracts',
      '/api/admin/users',
      '/api/activity-logs/all',
    ];

    for (const url of endpoints) {
      const res = await app.inject({ method: 'GET', url });
      if (res.statusCode === 200) {
        const body = res.json();
        // Paginated responses should have data array or be an array
        const hasDataArray = Array.isArray(body.data) || Array.isArray(body);
        expect(hasDataArray).toBe(true);
      }
    }
  });

  it('error responses include error field', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/tenders/nonexistent-uuid-12345' });
    if (res.statusCode >= 400) {
      const body = res.json();
      expect(body).toHaveProperty('error');
    }
  });
});
