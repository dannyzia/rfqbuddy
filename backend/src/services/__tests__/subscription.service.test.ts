import { SubscriptionService } from '../subscription.service';
import type { SubscriptionPackage, OrganizationSubscription } from '../../types/subscription.types';

// Mock database before importing service
jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
    connect: jest.fn(),
  },
}));
jest.mock('../../config/logger');

describe('SubscriptionService', () => {
  let mockDatabase: any;
  let mockClient: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDatabase = require('../../config/database').default;
    
    // Setup mock client for transaction handling
    mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };
    
    mockDatabase.connect = jest.fn().mockResolvedValue(mockClient);
  });

  describe('getAvailablePackages', () => {
    it('should return all active subscription packages', async () => {
      const packages: SubscriptionPackage[] = [
        {
          id: 'pkg-001',
          name: 'Basic',
          code: 'basic',
          weekly_simple_rfq_limit: 10,
          weekly_detailed_tender_limit: 5,
          storage_limit_bytes: 1073741824, // 1GB
          live_tendering_enabled: false,
          is_active: true,
          sort_order: 1,
          created_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'pkg-002',
          name: 'Premium',
          code: 'premium',
          weekly_simple_rfq_limit: 100,
          weekly_detailed_tender_limit: 50,
          storage_limit_bytes: 10737418240, // 10GB
          live_tendering_enabled: true,
          is_active: true,
          sort_order: 2,
          created_at: '2024-01-02T00:00:00Z',
        },
      ];

      mockDatabase.query = jest.fn().mockResolvedValueOnce({ rows: packages });

      const result = await SubscriptionService.getAvailablePackages();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Basic');
    });

    it('should return empty array if no active packages', async () => {
      mockDatabase.query = jest.fn().mockResolvedValueOnce({ rows: [] });

      const result = await SubscriptionService.getAvailablePackages();

      expect(result).toHaveLength(0);
    });
  });

  describe('getOrganizationSubscription', () => {
    it('should return active organization subscription', async () => {
      const subscription: OrganizationSubscription = {
        id: 'sub-001',
        organization_id: 'org-001',
        package_id: 'pkg-001',
        package_name: 'Basic',
        package_code: 'basic',
        weekly_simple_rfq_limit: 10,
        weekly_detailed_tender_limit: 5,
        storage_limit_bytes: 1073741824,
        live_tendering_enabled: false,
        expires_at: '2025-12-31T00:00:00Z',
        status: 'active',
        custom_storage_bytes: null,
        created_by: 'system',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        starts_at: '2024-01-01T00:00:00Z',
      };

      mockDatabase.query = jest.fn().mockResolvedValueOnce({ rows: [subscription] });

      const result = await SubscriptionService.getOrganizationSubscription('org-001');

      expect(result).not.toBeNull();
      expect(result?.organization_id).toBe('org-001');
      expect(result?.package_name).toBe('Basic');
    });

    it('should return null if no active subscription', async () => {
      mockDatabase.query = jest.fn().mockResolvedValueOnce({ rows: [] });

      const result = await SubscriptionService.getOrganizationSubscription('org-001');

      expect(result).toBeNull();
    });
  });

  describe('createOrUpdateSubscription', () => {
    it('should create new subscription', async () => {
      const newSubscription: OrganizationSubscription = {
        id: 'sub-001',
        organization_id: 'org-001',
        package_id: 'pkg-001',
        custom_storage_bytes: null,
        expires_at: '2025-12-31T00:00:00Z',
        status: 'active',
        created_by: 'system',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        starts_at: new Date().toISOString(),
      };

      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({ rows: [] }) // Check existing
        .mockResolvedValueOnce({ rows: [newSubscription] }) // Insert new
        .mockResolvedValueOnce(undefined); // COMMIT

      const result = await SubscriptionService.createOrUpdateSubscription('org-001', 'pkg-001', undefined, new Date('2025-12-31'));

      expect(result.organization_id).toBe('org-001');
      expect(result.package_id).toBe('pkg-001');
    });

    it('should update existing subscription', async () => {
      const existingId = { id: 'sub-001' };
      const updatedSubscription: OrganizationSubscription = {
        id: 'sub-001',
        organization_id: 'org-001',
        package_id: 'pkg-002',
        custom_storage_bytes: 5368709120,
        expires_at: '2026-12-31T00:00:00Z',
        status: 'active',
        created_by: 'system',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        starts_at: new Date().toISOString(),
      };

      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({ rows: [existingId] }) // Check existing returns subscription ID
        .mockResolvedValueOnce({ rows: [updatedSubscription] }) // Update
        .mockResolvedValueOnce(undefined); // COMMIT

      const result = await SubscriptionService.createOrUpdateSubscription('org-001', 'pkg-002', 5368709120, new Date('2026-12-31'));

      expect(result.organization_id).toBe('org-001');
      expect(result.package_id).toBe('pkg-002');
      expect(result.custom_storage_bytes).toBe(5368709120);
    });

    it('should rollback on error', async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [] }) // Check existing
        .mockRejectedValueOnce(new Error('Database error')); // Insert fails

      await expect(
        SubscriptionService.createOrUpdateSubscription('org-001', 'pkg-001')
      ).rejects.toThrow('Database error');

      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    });

    it('should release client connection after completion', async () => {
      const newSubscription: any = { id: 'sub-001' };

      mockClient.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [newSubscription] })
        .mockResolvedValueOnce({ rows: [] });

      await SubscriptionService.createOrUpdateSubscription('org-001', 'pkg-001');

      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel organization subscription', async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [] }) // UPDATE
        .mockResolvedValueOnce({ rows: [] }); // COMMIT

      await SubscriptionService.cancelSubscription('org-001');

      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should rollback if cancel fails', async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockRejectedValueOnce(new Error('Update failed')); // UPDATE fails

      await expect(
        SubscriptionService.cancelSubscription('org-001')
      ).rejects.toThrow('Update failed');

      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    });
  });

  describe('checkTenderQuota', () => {
    it('should return false if no subscription exists', async () => {
      mockDatabase.query = jest.fn()
        .mockResolvedValueOnce({ rows: [] }); // getOrganizationSubscription returns null

      const result = await SubscriptionService.checkTenderQuota('org-001', 'simple_rfq');

      expect(result).toBe(false);
    });

    it('should return true if simple_rfq quota available', async () => {
      const subscription: OrganizationSubscription = {
        id: 'sub-001',
        organization_id: 'org-001',
        package_id: 'pkg-001',
        weekly_simple_rfq_limit: 10,
        status: 'active',
        custom_storage_bytes: null,
        created_by: 'system',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        starts_at: '2024-01-01T00:00:00Z',
        expires_at: '2025-12-31T00:00:00Z',
      };

      const usage = { simple_rfq_count: 5, detailed_tender_count: 0 };
      const packageInfo: SubscriptionPackage = {
        id: 'pkg-001',
        code: 'basic',
        name: 'Basic',
        weekly_simple_rfq_limit: 10,
        weekly_detailed_tender_limit: 5,
        storage_limit_bytes: 1073741824,
        live_tendering_enabled: false,
        is_active: true,
        sort_order: 1,
        created_at: '2024-01-01T00:00:00Z',
      };

      mockDatabase.query = jest.fn()
        .mockResolvedValueOnce({ rows: [subscription] })
        .mockResolvedValueOnce({ rows: [usage] })
        .mockResolvedValueOnce({ rows: [packageInfo] });

      const result = await SubscriptionService.checkTenderQuota('org-001', 'simple_rfq');

      expect(result).toBe(true);
    });

    it('should return false if simple_rfq quota exceeded', async () => {
      const subscription: OrganizationSubscription = {
        id: 'sub-001',
        organization_id: 'org-001',
        package_id: 'pkg-001',
        weekly_simple_rfq_limit: 10,
        status: 'active',
        custom_storage_bytes: null,
        created_by: 'system',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        starts_at: '2024-01-01T00:00:00Z',
        expires_at: '2025-12-31T00:00:00Z',
      };

      const usage = { simple_rfq_count: 10, detailed_tender_count: 0 };
      const packageInfo: SubscriptionPackage = {
        id: 'pkg-001',
        code: 'basic',
        name: 'Basic',
        weekly_simple_rfq_limit: 10,
        weekly_detailed_tender_limit: 5,
        storage_limit_bytes: 1073741824,
        live_tendering_enabled: false,
        is_active: true,
        sort_order: 1,
        created_at: '2024-01-01T00:00:00Z',
      };

      mockDatabase.query = jest.fn()
        .mockResolvedValueOnce({ rows: [subscription] })
        .mockResolvedValueOnce({ rows: [usage] })
        .mockResolvedValueOnce({ rows: [packageInfo] });

      const result = await SubscriptionService.checkTenderQuota('org-001', 'simple_rfq');

      expect(result).toBe(false);
    });

    it('should return true if no limit (unlimited quota)', async () => {
      const subscription: OrganizationSubscription = {
        id: 'sub-001',
        organization_id: 'org-001',
        package_id: 'pkg-001',
        status: 'active',
        custom_storage_bytes: null,
        created_by: 'system',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        starts_at: '2024-01-01T00:00:00Z',
        expires_at: null,
      };

      const usage = { simple_rfq_count: 1000, detailed_tender_count: 0 };
      const packageInfo: SubscriptionPackage = {
        id: 'pkg-001',
        code: 'enterprise',
        name: 'Enterprise',
        weekly_simple_rfq_limit: null, // No limit
        weekly_detailed_tender_limit: null,
        storage_limit_bytes: null,
        live_tendering_enabled: true,
        is_active: true,
        sort_order: 3,
        created_at: '2024-01-01T00:00:00Z',
      };

      mockDatabase.query = jest.fn()
        .mockResolvedValueOnce({ rows: [subscription] })
        .mockResolvedValueOnce({ rows: [usage] })
        .mockResolvedValueOnce({ rows: [packageInfo] });

      const result = await SubscriptionService.checkTenderQuota('org-001', 'simple_rfq');

      expect(result).toBe(true);
    });

    it('should check detailed_tender quota', async () => {
      const subscription: OrganizationSubscription = {
        id: 'sub-001',
        organization_id: 'org-001',
        package_id: 'pkg-001',
        weekly_detailed_tender_limit: 5,
        status: 'active',
        custom_storage_bytes: null,
        created_by: 'system',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        starts_at: '2024-01-01T00:00:00Z',
        expires_at: '2025-12-31T00:00:00Z',
      };

      const usage = { simple_rfq_count: 0, detailed_tender_count: 3 };
      const packageInfo: SubscriptionPackage = {
        id: 'pkg-001',
        code: 'premium',
        name: 'Premium',
        weekly_simple_rfq_limit: 50,
        weekly_detailed_tender_limit: 5,
        storage_limit_bytes: 10737418240,
        live_tendering_enabled: true,
        is_active: true,
        sort_order: 2,
        created_at: '2024-01-01T00:00:00Z',
      };

      mockDatabase.query = jest.fn()
        .mockResolvedValueOnce({ rows: [subscription] })
        .mockResolvedValueOnce({ rows: [usage] })
        .mockResolvedValueOnce({ rows: [packageInfo] });

      const result = await SubscriptionService.checkTenderQuota('org-001', 'detailed_tender');

      expect(result).toBe(true);
    });
  });

  describe('incrementTenderUsage', () => {
    it('should increment simple_rfq usage count', async () => {
      mockDatabase.query = jest.fn().mockResolvedValueOnce({ rows: [] });

      await SubscriptionService.incrementTenderUsage('org-001', 'simple_rfq');

      expect(mockDatabase.query).toHaveBeenCalled();
      const callArgs = (mockDatabase.query as jest.Mock).mock.calls[0];
      expect(callArgs[1][2]).toBe('simple_rfq');
    });

    it('should increment detailed_tender usage count', async () => {
      mockDatabase.query = jest.fn().mockResolvedValueOnce({ rows: [] });

      await SubscriptionService.incrementTenderUsage('org-001', 'detailed_tender');

      expect(mockDatabase.query).toHaveBeenCalled();
      const callArgs = (mockDatabase.query as jest.Mock).mock.calls[0];
      expect(callArgs[1][2]).toBe('detailed_tender');
    });
  });
});
