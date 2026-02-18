import { awardService } from '../award.service';
import type { CreateAwardInput } from '../../schemas/award.schema';

// Mock the database
jest.mock('../../config/database');
jest.mock('../../config/logger');

describe('AwardService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new award with valid inputs', async () => {
      const mockDatabase = require('../../config/database');
      const tenantId = 'tender-001';
      const userId = 'user-001';
      const orgId = 'org-001';

      const createInput: CreateAwardInput = {
        bidId: 'bid-001',
        tenderItemId: 'item-001',
        awardedQuantity: 100,
        awardedPrice: 5000,
      };

      const mockTender = { id: tenantId, status: 'comm_eval', buyer_org_id: orgId };
      const mockBid = { id: 'bid-001', tender_id: tenantId, is_technically_qualified: true };
      const mockTenderItem = { id: 'item-001', quantity: 200 };
      const mockAwardCount = { total: '0' };
      const mockCreatedAward = {
        id: 'award-001',
        tender_id: tenantId,
        tender_item_id: 'item-001',
        bid_id: 'bid-001',
        awarded_quantity: 100,
        awarded_price: 5000,
        awarded_by: userId,
        awarded_at: new Date().toISOString(),
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockTender] }) // SELECT tender
        .mockResolvedValueOnce({ rows: [mockBid] }) // SELECT bid + evaluation
        .mockResolvedValueOnce({ rows: [mockTenderItem] }) // SELECT tender_item
        .mockResolvedValueOnce({ rows: [mockAwardCount] }) // SELECT COALESCE(SUM)
        .mockResolvedValueOnce({ rows: [mockCreatedAward] }); // INSERT award

      const result = await awardService.create(tenantId, createInput, userId, orgId);

      expect(result).toEqual(mockCreatedAward);
      expect(mockDatabase.pool.query).toHaveBeenCalledTimes(5);
    });

    it('should throw error if tender not found', async () => {
      const mockDatabase = require('../../config/database');
      const createInput: CreateAwardInput = {
        bidId: 'bid-001',
        tenderItemId: 'item-001',
        awardedQuantity: 100,
        awardedPrice: 5000,
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] }); // tender not found

      await expect(awardService.create('tender-000', createInput, 'user-001', 'org-001')).rejects.toThrow(
        'Tender not found'
      );
    });

    it('should throw error if not authorized', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { id: 'tender-001', status: 'comm_eval', buyer_org_id: 'org-002' };
      const createInput: CreateAwardInput = {
        bidId: 'bid-001',
        tenderItemId: 'item-001',
        awardedQuantity: 100,
        awardedPrice: 5000,
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockTender] });

      await expect(awardService.create('tender-001', createInput, 'user-001', 'org-001')).rejects.toThrow(
        'Not authorized'
      );
    });

    it('should throw error if tender not in commercial evaluation', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { id: 'tender-001', status: 'bidding', buyer_org_id: 'org-001' };
      const createInput: CreateAwardInput = {
        bidId: 'bid-001',
        tenderItemId: 'item-001',
        awardedQuantity: 100,
        awardedPrice: 5000,
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockTender] });

      await expect(awardService.create('tender-001', createInput, 'user-001', 'org-001')).rejects.toThrow(
        'Tender must be in commercial evaluation to award'
      );
    });

    it('should throw error if bid not found', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { id: 'tender-001', status: 'comm_eval', buyer_org_id: 'org-001' };
      const createInput: CreateAwardInput = {
        bidId: 'bid-000',
        tenderItemId: 'item-001',
        awardedQuantity: 100,
        awardedPrice: 5000,
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockTender] })
        .mockResolvedValueOnce({ rows: [] }); // bid not found

      await expect(awardService.create('tender-001', createInput, 'user-001', 'org-001')).rejects.toThrow(
        'Bid not found for this tender'
      );
    });

    it('should throw error if bid not technically qualified', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { id: 'tender-001', status: 'comm_eval', buyer_org_id: 'org-001' };
      const mockBid = { id: 'bid-001', tender_id: 'tender-001', is_technically_qualified: false };
      const createInput: CreateAwardInput = {
        bidId: 'bid-001',
        tenderItemId: 'item-001',
        awardedQuantity: 100,
        awardedPrice: 5000,
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockTender] })
        .mockResolvedValueOnce({ rows: [mockBid] });

      await expect(awardService.create('tender-001', createInput, 'user-001', 'org-001')).rejects.toThrow(
        'Bid is not technically qualified'
      );
    });

    it('should throw error if tender item not found', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { id: 'tender-001', status: 'comm_eval', buyer_org_id: 'org-001' };
      const mockBid = { id: 'bid-001', tender_id: 'tender-001', is_technically_qualified: true };
      const createInput: CreateAwardInput = {
        bidId: 'bid-001',
        tenderItemId: 'item-000',
        awardedQuantity: 100,
        awardedPrice: 5000,
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockTender] })
        .mockResolvedValueOnce({ rows: [mockBid] })
        .mockResolvedValueOnce({ rows: [] }); // item not found

      await expect(awardService.create('tender-001', createInput, 'user-001', 'org-001')).rejects.toThrow(
        'Tender item not found'
      );
    });

    it('should throw error if award quantity exceeds available', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { id: 'tender-001', status: 'comm_eval', buyer_org_id: 'org-001' };
      const mockBid = { id: 'bid-001', tender_id: 'tender-001', is_technically_qualified: true };
      const mockTenderItem = { id: 'item-001', quantity: 100 };
      const mockAwardCount = { total: '80' }; // Already awarded 80
      const createInput: CreateAwardInput = {
        bidId: 'bid-001',
        tenderItemId: 'item-001',
        awardedQuantity: 50, // requesting 50 but only 20 available
        awardedPrice: 5000,
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockTender] })
        .mockResolvedValueOnce({ rows: [mockBid] })
        .mockResolvedValueOnce({ rows: [mockTenderItem] })
        .mockResolvedValueOnce({ rows: [mockAwardCount] });

      await expect(awardService.create('tender-001', createInput, 'user-001', 'org-001')).rejects.toThrow(
        /Award quantity exceeds available/
      );
    });
  });

  describe('createBulk', () => {
    it('should create multiple awards', async () => {
      const mockDatabase = require('../../config/database');
      const tenantId = 'tender-001';
      const userId = 'user-001';
      const orgId = 'org-001';

      const inputs: CreateAwardInput[] = [
        { bidId: 'bid-001', tenderItemId: 'item-001', awardedQuantity: 100, awardedPrice: 5000 },
        { bidId: 'bid-002', tenderItemId: 'item-002', awardedQuantity: 50, awardedPrice: 3000 },
      ];

      const mockTender = { id: tenantId, status: 'comm_eval', buyer_org_id: orgId };
      const mockBid1 = { id: 'bid-001', tender_id: tenantId, is_technically_qualified: true };
      const mockBid2 = { id: 'bid-002', tender_id: tenantId, is_technically_qualified: true };
      const mockItem1 = { id: 'item-001', quantity: 200 };
      const mockItem2 = { id: 'item-002', quantity: 100 };
      const mockCount1 = { total: '0' };
      const mockCount2 = { total: '0' };
      const mockAward1 = {
        id: 'award-001',
        tender_id: tenantId,
        tender_item_id: 'item-001',
        bid_id: 'bid-001',
        awarded_quantity: 100,
        awarded_price: 5000,
        awarded_by: userId,
      };
      const mockAward2 = {
        id: 'award-002',
        tender_id: tenantId,
        tender_item_id: 'item-002',
        bid_id: 'bid-002',
        awarded_quantity: 50,
        awarded_price: 3000,
        awarded_by: userId,
      };

      // 5 queries per create call × 2 awards = 10 queries
      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockTender] }) // tender check 1
        .mockResolvedValueOnce({ rows: [mockBid1] }) // bid check 1
        .mockResolvedValueOnce({ rows: [mockItem1] }) // item check 1
        .mockResolvedValueOnce({ rows: [mockCount1] }) // count check 1
        .mockResolvedValueOnce({ rows: [mockAward1] }) // insert 1
        .mockResolvedValueOnce({ rows: [mockTender] }) // tender check 2
        .mockResolvedValueOnce({ rows: [mockBid2] }) // bid check 2
        .mockResolvedValueOnce({ rows: [mockItem2] }) // item check 2
        .mockResolvedValueOnce({ rows: [mockCount2] }) // count check 2
        .mockResolvedValueOnce({ rows: [mockAward2] }); // insert 2

      const result = await awardService.createBulk(tenantId, inputs, userId, orgId);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockAward1);
      expect(result[1]).toEqual(mockAward2);
    });
  });

  describe('findByTenderId', () => {
    it('should return all awards for a tender', async () => {
      const mockDatabase = require('../../config/database');
      const tenantId = 'tender-001';

      const mockAwards = [
        {
          id: 'award-001',
          tender_id: tenantId,
          tender_item_id: 'item-001',
          bid_id: 'bid-001',
          awarded_quantity: 100,
          awarded_price: 5000,
          item_name: 'Office Supplies',
          vendor_name: 'Supplier A',
        },
        {
          id: 'award-002',
          tender_id: tenantId,
          tender_item_id: 'item-002',
          bid_id: 'bid-002',
          awarded_quantity: 50,
          awarded_price: 3000,
          item_name: 'IT Equipment',
          vendor_name: 'Supplier B',
        },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: mockAwards });

      const result = await awardService.findByTenderId(tenantId);

      expect(result).toEqual(mockAwards);
      expect(result).toHaveLength(2);
      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT a.*'),
        [tenantId]
      );
    });

    it('should return empty array if no awards found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await awardService.findByTenderId('tender-999');

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return an award by ID', async () => {
      const mockDatabase = require('../../config/database');
      const awardId = 'award-001';

      const mockAward = {
        id: awardId,
        tender_id: 'tender-001',
        tender_item_id: 'item-001',
        bid_id: 'bid-001',
        awarded_quantity: 100,
        awarded_price: 5000,
        item_name: 'Office Supplies',
        vendor_name: 'Supplier A',
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockAward] });

      const result = await awardService.findById(awardId);

      expect(result).toEqual(mockAward);
    });

    it('should return null if award not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await awardService.findById('award-999');

      expect(result).toBeNull();
    });
  });

  describe('finalizeTender', () => {
    it('should mark tender as awarded', async () => {
      const mockDatabase = require('../../config/database');
      const tenantId = 'tender-001';
      const orgId = 'org-001';

      const mockTender = { id: tenantId, status: 'comm_eval', buyer_org_id: orgId };
      const mockAwardCount = { count: '2' };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockTender] })
        .mockResolvedValueOnce({ rows: [mockAwardCount] })
        .mockResolvedValueOnce({ rows: [] }); // UPDATE return

      await awardService.finalizeTender(tenantId, orgId);

      expect(mockDatabase.pool.query).toHaveBeenCalledTimes(3);
      expect(mockDatabase.pool.query).toHaveBeenNthCalledWith(3, expect.stringContaining('UPDATE tenders'), [
        tenantId,
      ]);
    });

    it('should throw error if tender not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      await expect(awardService.finalizeTender('tender-999', 'org-001')).rejects.toThrow(
        'Tender not found'
      );
    });

    it('should throw error if not authorized', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { id: 'tender-001', status: 'comm_eval', buyer_org_id: 'org-002' };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockTender] });

      await expect(awardService.finalizeTender('tender-001', 'org-001')).rejects.toThrow(
        'Not authorized'
      );
    });

    it('should throw error if tender not in commerce eval', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { id: 'tender-001', status: 'awarded', buyer_org_id: 'org-001' };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockTender] });

      await expect(awardService.finalizeTender('tender-001', 'org-001')).rejects.toThrow(
        'Tender must be in commercial evaluation to finalize'
      );
    });

    it('should throw error if no awards exist', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { id: 'tender-001', status: 'comm_eval', buyer_org_id: 'org-001' };
      const mockAwardCount = { count: '0' };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockTender] })
        .mockResolvedValueOnce({ rows: [mockAwardCount] });

      await expect(awardService.finalizeTender('tender-001', 'org-001')).rejects.toThrow(
        'No awards have been created'
      );
    });
  });

  describe('getAwardSummary', () => {
    it('should return award summary grouped by vendor', async () => {
      const mockDatabase = require('../../config/database');
      const tenantId = 'tender-001';

      const mockAwards = [
        {
          id: 'award-001',
          tender_id: tenantId,
          tender_item_id: 'item-001',
          bid_id: 'bid-001',
          awarded_quantity: 100,
          awarded_price: 50,
          vendor_name: 'Supplier A',
          vendor_org_id: 'org-vendor-1',
        },
        {
          id: 'award-002',
          tender_id: tenantId,
          tender_item_id: 'item-002',
          bid_id: 'bid-001', // same vendor
          awarded_quantity: 200,
          awarded_price: 75,
          vendor_name: 'Supplier A',
          vendor_org_id: 'org-vendor-1',
        },
        {
          id: 'award-003',
          tender_id: tenantId,
          tender_item_id: 'item-003',
          bid_id: 'bid-002', // different vendor
          awarded_quantity: 50,
          awarded_price: 100,
          vendor_name: 'Supplier B',
          vendor_org_id: 'org-vendor-2',
        },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: mockAwards });

      const result = (await awardService.getAwardSummary(tenantId)) as any;

      expect(result.tenderId).toBe(tenantId);
      expect(result.totalAwards).toBe(3);
      expect(result.totalValue).toBe((100 * 50) + (200 * 75) + (50 * 100)); // 5000 + 15000 + 5000 = 25000
      expect(result.byVendor).toHaveLength(2);
    });

    it('should handle empty awards', async () => {
      const mockDatabase = require('../../config/database');
      const tenantId = 'tender-001';

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = (await awardService.getAwardSummary(tenantId)) as any;

      expect(result.tenderId).toBe(tenantId);
      expect(result.totalAwards).toBe(0);
      expect(result.totalValue).toBe(0);
      expect(result.byVendor).toEqual([]);
    });
  });
});
