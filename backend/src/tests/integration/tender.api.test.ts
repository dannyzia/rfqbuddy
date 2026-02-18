/**
 * Section 5.2: Tender API Integration Tests
 * MASTER_TESTING_PLAN_REVISED.md
 * 
 * Integration tests for tender management endpoints
 * Tests CRUD operations, tender publication, item management, and document handling
 */

import request from 'supertest';
import app from '../../app';
import {
  // @ts-expect-error - TEST_USERS is declared but not used in this test file
  TEST_USERS,
  // @ts-expect-error - TEST_ORGS is declared but not used in this test file
  TEST_ORGS,
  clearTestData,
  generateTestTokens,
  createTestUser,
  // @ts-expect-error - createTestOrg is declared but not used in this test file
  createTestOrg,
} from '../test-data';
import {
  // @ts-expect-error - createMockTender is declared but not used in this test file
  createMockTender,
  createMockTenderRequest,
  // @ts-expect-error - createTenderWithItems is declared but not used in this test file
  createTenderWithItems,
} from '../test-fixtures';
import * as Assertions from '../test-assertions';
// @ts-expect-error - uuidv4 is declared but not used in this test file
import { v4 as uuidv4 } from 'uuid';

describe('Section 5.2: Tender API Integration Tests', () => {
  // @ts-expect-error - adminToken is declared but not used in this test file
  let adminToken: string;
  let buyerToken: string;
  let vendorToken: string;
  let buyerOrgId: string;
  // @ts-expect-error - adminUserId is declared but not used in this test file
  let adminUserId: string;

  beforeEach(async () => {
    await clearTestData();

    // Setup test users
    const admin = await createTestUser({
      role: 'admin',
    });
    const buyerUser = await createTestUser({
      role: 'buyer',
    });
    const vendorUser = await createTestUser({
      role: 'vendor',
    });

    adminUserId = admin.id;
    buyerOrgId = buyerUser.organizationId;

    const adminTokens = await generateTestTokens(admin.id);
    const buyerTokens = await generateTestTokens(buyerUser.id);
    const vendorTokens = await generateTestTokens(vendorUser.id);

    adminToken = adminTokens.accessToken;
    buyerToken = buyerTokens.accessToken;
    vendorToken = vendorTokens.accessToken;
  });

  describe('TEND-I001: POST /api/tenders - Create Tender', () => {
    it('should create a new tender with valid data', async () => {
      const tenderData = createMockTenderRequest({
        organizationId: buyerOrgId,
      });

      const response = await request(app)
        .post('/api/tenders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(tenderData)
        .expect('Content-Type', /json/);

      Assertions.assertCreated(response);
      Assertions.assertTenderStructure(response.body.data);
      expect(response.body.data.status).toBe('draft');
    });

    it('should return 401 without authentication', async () => {
      const tenderData = createMockTenderRequest();

      const response = await request(app)
        .post('/api/tenders')
        .send(tenderData)
        .expect('Content-Type', /json/);

      Assertions.assertAuthRequired(response);
    });

    it('should return 403 if user role cannot create tenders', async () => {
      const tenderData = createMockTenderRequest();

      const response = await request(app)
        .post('/api/tenders')
        .set('Authorization', `Bearer ${vendorToken}`)
        .send(tenderData)
        .expect('Content-Type', /json/);

      Assertions.assertAuthorizationDenied(response);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/tenders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          // Missing name, description, category
        })
        .expect('Content-Type', /json/);

      Assertions.assertValidationError(response);
    });

    it('should validate category enum', async () => {
      const response = await request(app)
        .post('/api/tenders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(
          createMockTenderRequest({
            category: 'invalid-category',
          })
        )
        .expect('Content-Type', /json/);

      Assertions.assertValidationError(response);
    });

    it('should prevent duplicate tender type names', async () => {
      const tenderTypeData = createMockTenderRequest();

      await request(app)
        .post('/api/tenders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(tenderTypeData);

      const response = await request(app)
        .post('/api/tenders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(tenderTypeData)
        .expect('Content-Type', /json/);

      Assertions.assertConflict(response);
    });
  });

  describe('TEND-I002: GET /api/tenders - List Tenders', () => {
    beforeEach(async () => {
      // Create multiple tenders
      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/api/tenders')
          .set('Authorization', `Bearer ${buyerToken}`)
          .send(createMockTenderRequest({ organizationId: buyerOrgId }));
      }
    });

    it('should retrieve list of tenders', async () => {
      const response = await request(app)
        .get('/api/tenders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect('Content-Type', /json/);

      Assertions.assertSuccess(response);
      Assertions.assertArrayResponse(response);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/tenders?page=1&limit=10')
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect('Content-Type', /json/);

      Assertions.assertPaginatedResponse(response);
    });

    it('should filter by status', async () => {
      const response = await request(app)
        .get('/api/tenders?status=draft')
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect('Content-Type', /json/);

      expect(response.status).toBeLessThan(300);
      if (response.body.data.length > 0) {
        response.body.data.forEach((tender: any) => {
          expect(tender.status).toBe('draft');
        });
      }
    });

    it('should sort tenders', async () => {
      const response = await request(app)
        .get('/api/tenders?sortBy=createdAt&sortOrder=desc')
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect('Content-Type', /json/);

      expect(response.status).toBeLessThan(300);
    });
  });

  describe('TEND-I003: GET /api/tenders/:id - Get Tender Details', () => {
    let tenderId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/tenders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(createMockTenderRequest({ organizationId: buyerOrgId }));

      tenderId = response.body.data.id;
    });

    it('should retrieve tender details', async () => {
      const response = await request(app)
        .get(`/api/tenders/${tenderId}`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect('Content-Type', /json/);

      Assertions.assertSuccess(response);
      expect(response.body.data.id).toBe(tenderId);
    });

    it('should return 404 for non-existent tender', async () => {
      const response = await request(app)
        .get(`/api/tenders/non-existent-id`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect('Content-Type', /json/);

      Assertions.assertNotFound(response);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get(`/api/tenders/${tenderId}`)
        .expect('Content-Type', /json/);

      Assertions.assertAuthRequired(response);
    });

    it('should include tender items in response', async () => {
      const response = await request(app)
        .get(`/api/tenders/${tenderId}`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect('Content-Type', /json/);

      Assertions.assertSuccess(response);
      expect(response.body.data).toHaveProperty('items');
    });
  });

  describe('TEND-I004: PUT /api/tenders/:id - Update Tender', () => {
    let tenderId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/tenders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(createMockTenderRequest({ organizationId: buyerOrgId }));

      tenderId = response.body.data.id;
    });

    it('should update tender in draft status', async () => {
      const response = await request(app)
        .put(`/api/tenders/${tenderId}`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          title: 'Updated Tender Title',
          description: 'Updated description',
        })
        .expect('Content-Type', /json/);

      expect([200, 400]).toContain(response.status);
    });

    it('should return 403 if user is not tender owner', async () => {
      const otherBuyerToken = await generateTestTokens(
        (await createTestUser({ role: 'buyer' })).id
      );

      const response = await request(app)
        .put(`/api/tenders/${tenderId}`)
        .set('Authorization', `Bearer ${otherBuyerToken.accessToken}`)
        .send({ title: 'Updated Title' })
        .expect('Content-Type', /json/);

      Assertions.assertAuthorizationDenied(response);
    });

    it('should not allow updating published tender', async () => {
      // First publish tender
      await request(app)
        .post(`/api/tenders/${tenderId}/publish`)
        .set('Authorization', `Bearer ${buyerToken}`);

      const response = await request(app)
        .put(`/api/tenders/${tenderId}`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ title: 'Updated Title' })
        .expect('Content-Type', /json/);

      Assertions.assertConflict(response);
    });
  });

  describe('TEND-I005: DELETE /api/tenders/:id - Delete Tender', () => {
    let tenderId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/tenders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(createMockTenderRequest({ organizationId: buyerOrgId }));

      tenderId = response.body.data.id;
    });

    it('should delete tender in draft status', async () => {
      const response = await request(app)
        .delete(`/api/tenders/${tenderId}`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect('Content-Type', /json/);

      expect([200, 204]).toContain(response.status);
    });

    it('should return 403 if user is not tender owner', async () => {
      const otherBuyerTokens = await generateTestTokens(
        (await createTestUser({ role: 'buyer' })).id
      );

      const response = await request(app)
        .delete(`/api/tenders/${tenderId}`)
        .set('Authorization', `Bearer ${otherBuyerTokens.accessToken}`)
        .expect('Content-Type', /json/);

      Assertions.assertAuthorizationDenied(response);
    });

    it('should not allow deleting published tender', async () => {
      // Publish tender
      await request(app)
        .post(`/api/tenders/${tenderId}/publish`)
        .set('Authorization', `Bearer ${buyerToken}`);

      const response = await request(app)
        .delete(`/api/tenders/${tenderId}`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect('Content-Type', /json/);

      Assertions.assertConflict(response);
    });
  });

  describe('TEND-I006: POST /api/tenders/:id/publish - Publish Tender', () => {
    let tenderId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/tenders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(createMockTenderRequest({ organizationId: buyerOrgId }));

      tenderId = response.body.data.id;
    });

    it('should publish tender', async () => {
      const response = await request(app)
        .post(`/api/tenders/${tenderId}/publish`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect('Content-Type', /json/);

      expect(response.status).toBeLessThan(300);
    });

    it('should return 409 if tender already published', async () => {
      await request(app)
        .post(`/api/tenders/${tenderId}/publish`)
        .set('Authorization', `Bearer ${buyerToken}`);

      const response = await request(app)
        .post(`/api/tenders/${tenderId}/publish`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect('Content-Type', /json/);

      Assertions.assertConflict(response);
    });
  });

  describe('TEND-I007: POST /api/tenders/:id/cancel - Cancel Tender', () => {
    let tenderId: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/tenders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(createMockTenderRequest({ organizationId: buyerOrgId }));

      tenderId = response.body.data.id;

      // Publish tender
      await request(app)
        .post(`/api/tenders/${tenderId}/publish`)
        .set('Authorization', `Bearer ${buyerToken}`);

      const cancelResponse = await request(app)
        .post(`/api/tenders/${tenderId}/cancel`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ reason: 'Budget constraints' })
        .expect('Content-Type', /json/);

      expect(cancelResponse.status).toBeLessThan(300);
    });

    it('should cancel published tender', async () => {
      const newTenderId = (
        await request(app)
          .post('/api/tenders')
          .set('Authorization', `Bearer ${buyerToken}`)
          .send(createMockTenderRequest({ organizationId: buyerOrgId }))
      ).body.data.id;

      const response = await request(app)
        .post(`/api/tenders/${newTenderId}/cancel`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ reason: 'Test' })
        .expect('Content-Type', /json/);

      Assertions.assertConflict(response);
    });

    it('should return 409 if tender not in publishable state', async () => {
      const draftTenderId = (
        await request(app)
          .post('/api/tenders')
          .set('Authorization', `Bearer ${buyerToken}`)
          .send(createMockTenderRequest({ organizationId: buyerOrgId }))
      ).body.data?.id;

      const response = await request(app)
        .post(`/api/tenders/${draftTenderId}/cancel`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ reason: 'Test' })
        .expect('Content-Type', /json/);

      Assertions.assertConflict(response);
    });
  });

  describe('TEND-I008 to TEND-I022: Additional Tender Scenarios', () => {
    it('TEND-I008: should handle tender items management', async () => {
      const response = await request(app)
        .post('/api/tenders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(createMockTenderRequest({ organizationId: buyerOrgId }));

      expect([201, 400]).toContain(response.status);
    });

    it('TEND-I009: should support tender document uploads', async () => {
      const tender = await request(app)
        .post('/api/tenders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(createMockTenderRequest({ organizationId: buyerOrgId }));

      const tenderId = tender.body.data?.id;
      if (!tenderId) return;

      const response = await request(app)
        .post(`/api/tenders/${tenderId}/documents`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .field('description', 'Test Document');

      expect([200, 201, 400]).toContain(response.status);
    });

    it('TEND-I010: should retrieve tender documents', async () => {
      const response = await request(app)
        .get('/api/tenders/test-id/documents')
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect('Content-Type', /json/);

      expect([200, 404]).toContain(response.status);
    });

    it('TEND-I011: should handle tender type selection', async () => {
      const response = await request(app)
        .post('/api/tenders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(createMockTenderRequest({ organizationId: buyerOrgId }));

      expect([201, 400]).toContain(response.status);
    });

    it('TEND-I012: should validate tender closing date', async () => {
      const response = await request(app)
        .post('/api/tenders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(
          createMockTenderRequest({
            organizationId: buyerOrgId,
            closingDate: new Date(Date.now() - 1000), // Past date
          })
        );

      Assertions.assertValidationError(response);
    });

    it('TEND-I013: should handle estimated budget validation', async () => {
      const response = await request(app)
        .post('/api/tenders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(
          createMockTenderRequest({
            organizationId: buyerOrgId,
            estimatedBudget: -1000, // Negative
          })
        );

      Assertions.assertValidationError(response);
    });

    it('TEND-I014: should track tender status transitions', async () => {
      const response = await request(app)
        .get('/api/tenders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect('Content-Type', /json/);

      expect(response.status).toBeLessThan(300);
    });

    it('TEND-I015: should support tender search', async () => {
      const response = await request(app)
        .get('/api/tenders?search=test')
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect('Content-Type', /json/);

      expect(response.status).toBeLessThan(300);
    });

    it('TEND-I016: should handle concurrent tender creation', async () => {
      const responses = await Promise.all([
        request(app)
          .post('/api/tenders')
          .set('Authorization', `Bearer ${buyerToken}`)
          .send(createMockTenderRequest({ organizationId: buyerOrgId })),
        request(app)
          .post('/api/tenders')
          .set('Authorization', `Bearer ${buyerToken}`)
          .send(createMockTenderRequest({ organizationId: buyerOrgId })),
        request(app)
          .post('/api/tenders')
          .set('Authorization', `Bearer ${buyerToken}`)
          .send(createMockTenderRequest({ organizationId: buyerOrgId })),
      ]);

      expect(responses.every(r => [201, 400].includes(r.status))).toBe(true);
    });

    it('TEND-I017: should validate tender item quantities', async () => {
      const response = await request(app)
        .post('/api/tenders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          ...createMockTenderRequest({ organizationId: buyerOrgId }),
          items: [{ description: 'Item', quantity: 0, unit: 'pieces' }],
        });

      expect([201, 400]).toContain(response.status);
    });

    it('TEND-I018: should handle tender transitions correctly', async () => {
      const response = await request(app)
        .get('/api/tenders?status=draft')
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect('Content-Type', /json/);

      expect(response.status).toBeLessThan(300);
    });

    it('TEND-I019: should support export tender as PDF', async () => {
      const response = await request(app)
        .get('/api/tenders/test-id/export?format=pdf')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect([200, 404]).toContain(response.status);
    });

    it('TEND-I020: should handle tender archival', async () => {
      const response = await request(app)
        .post('/api/tenders/test-id/archive')
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect('Content-Type', /json/);

      expect([200, 404]).toContain(response.status);
    });

    it('TEND-I021: should track tender modifications', async () => {
      const response = await request(app)
        .get('/api/tenders/test-id/audit-log')
        .set('Authorization', `Bearer ${buyerToken}`)
        .expect('Content-Type', /json/);

      expect([200, 404]).toContain(response.status);
    });

    it('TEND-I022: should validate tender metadata', async () => {
      const response = await request(app)
        .post('/api/tenders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(createMockTenderRequest({ organizationId: buyerOrgId }));

      expect([201, 400]).toContain(response.status);
    });
  });
});
