import { bidService } from '../bid.service';

// Mock dependencies
jest.mock('../../config/database');
jest.mock('uuid');

import { v4 as uuidv4 } from 'uuid';

describe('BidService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (uuidv4 as jest.Mock).mockReturnValue('test-uuid-1234');
  });

  describe('create', () => {
    it('should create a new bid for a tender', async () => {
      const mockDatabase = require('../../config/database');
      const mockBid = {
        id: 'bid-001',
        tender_id: 'tender-001',
        vendor_org_id: 'vendor-001',
        version: 1,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [{ id: 'tender-001', status: 'published', submission_deadline: new Date().toISOString() }] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ max_version: 0 }] })
        .mockResolvedValueOnce({ rows: [mockBid] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      const result = await bidService.create('tender-001', 'vendor-001');

      expect(result).toBeDefined();
      expect(result.status).toBe('draft');
      expect(result.vendor_org_id).toBe('vendor-001');
    });

    it('should throw error if tender not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      await expect(bidService.create('nonexistent', 'vendor-001'))
        .rejects.toThrow('Tender not found');
    });

    it('should throw error if tender is not open for bidding', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({
        rows: [{ id: 'tender-001', status: 'draft', submission_deadline: new Date().toISOString() }]
      });

      await expect(bidService.create('tender-001', 'vendor-001'))
        .rejects.toThrow('Tender is not open for bidding');
    });

    it('should return existing draft bid if it exists', async () => {
      const mockDatabase = require('../../config/database');
      const existingBid = {
        id: 'bid-existing',
        tender_id: 'tender-001',
        vendor_org_id: 'vendor-001',
        version: 1,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [{ id: 'tender-001', status: 'published', submission_deadline: new Date().toISOString() }] })
        .mockResolvedValueOnce({ rows: [existingBid] });

      const result = await bidService.create('tender-001', 'vendor-001');

      expect(result.id).toBe('bid-existing');
      expect(result.status).toBe('draft');
    });

    it('should create new version if submitted bid exists', async () => {
      const mockDatabase = require('../../config/database');
      const mockBid = {
        id: 'bid-002',
        tender_id: 'tender-001',
        vendor_org_id: 'vendor-001',
        version: 2,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [{ id: 'tender-001', status: 'published', submission_deadline: new Date().toISOString() }] })
        .mockResolvedValueOnce({ rows: [{ status: 'submitted' }] })
        .mockResolvedValueOnce({ rows: [{ max_version: 1 }] })
        .mockResolvedValueOnce({ rows: [mockBid] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      const result = await bidService.create('tender-001', 'vendor-001');

      expect(result.version).toBe(2);
    });
  });

  describe('findById', () => {
    it('should retrieve specific bid', async () => {
      const mockDatabase = require('../../config/database');
      const mockBid = {
        id: 'bid-001',
        tender_id: 'tender-001',
        vendor_org_id: 'vendor-001',
        version: 1,
        status: 'draft',
        total_amount: 100000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockBid] });

      const result = await bidService.findById('bid-001');

      expect(result).toEqual(mockBid);
      expect(result?.status).toBe('draft');
    });

    it('should return null if bid not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await bidService.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findActiveBid', () => {
    it('should find active draft bid for tender and vendor', async () => {
      const mockDatabase = require('../../config/database');
      const mockBid = {
        id: 'bid-001',
        tender_id: 'tender-001',
        vendor_org_id: 'vendor-001',
        version: 1,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockBid] });

      const result = await bidService.findActiveBid('tender-001', 'vendor-001');

      expect(result).toEqual(mockBid);
      expect(result?.status).toBe('draft');
    });

    it('should return null if no active bid exists', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await bidService.findActiveBid('tender-001', 'vendor-001');

      expect(result).toBeNull();
    });
  });

  describe('findByTenderId', () => {
    it('should retrieve all submitted bids for tender', async () => {
      const mockDatabase = require('../../config/database');
      const mockBids = [
        {
          id: 'bid-001',
          tender_id: 'tender-001',
          vendor_org_id: 'vendor-001',
          version: 1,
          status: 'submitted',
          total_amount: 100000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'bid-002',
          tender_id: 'tender-001',
          vendor_org_id: 'vendor-002',
          version: 1,
          status: 'submitted',
          total_amount: 120000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: mockBids });

      const result = await bidService.findByTenderId('tender-001');

      expect(result).toHaveLength(2);
      expect(result[0].tender_id).toBe('tender-001');
      expect(result[1].total_amount).toBe(120000);
    });

    it('should return empty array if no bids found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await bidService.findByTenderId('tender-001');

      expect(result).toEqual([]);
    });
  });

  describe('submit', () => {
    it('should submit a draft bid', async () => {
      const mockDatabase = require('../../config/database');
      const mockBid = {
        id: 'bid-001',
        tender_id: 'tender-001',
        vendor_org_id: 'vendor-001',
        version: 1,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const resultBid = {
        ...mockBid,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        total_amount: 50000,
        digital_hash: 'test-hash',
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockBid] }) // findById
        .mockResolvedValueOnce({ rows: [{ submission_deadline: new Date(Date.now() + 86400000).toISOString() }] }) // submission deadline
        .mockResolvedValueOnce({ rows: [{ count: '0' }] }) // unacknowledged addenda
        .mockResolvedValueOnce({ rows: [{ tender_type: 'goods' }] }) // tender type
        .mockResolvedValueOnce({ rows: [] }) // no required docs
        .mockResolvedValueOnce({ rows: [{ total: '50000' }] }) // total amount calculation
        .mockResolvedValueOnce({ rows: [] }) // bid items with features
        .mockResolvedValueOnce({ rows: [resultBid] }); // bid update

      const result = await bidService.submit('bid-001', 'vendor-001');

      expect(result).toBeDefined();
      expect(result.status).toBe('submitted');
    });

    it('should throw error if bid not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      await expect(bidService.submit('nonexistent', 'vendor-001'))
        .rejects.toThrow('Bid not found');
    });

    it('should throw error if unauthorized', async () => {
      const mockDatabase = require('../../config/database');
      const mockBid = {
        id: 'bid-001',
        tender_id: 'tender-001',
        vendor_org_id: 'vendor-001',
        version: 1,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockBid] });

      await expect(bidService.submit('bid-001', 'different-vendor'))
        .rejects.toThrow('Not authorized');
    });
  });

  describe('upsertFeatureValue', () => {
    it('should upsert feature value for bid item', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [{ id: 'bid-item-001' }] })
        .mockResolvedValueOnce({ rows: [] });

      const input = { 
        featureId: 'feature-001', 
        optionId: 'option-001',
        textValue: undefined,
        numericValue: undefined
      };
      
      await bidService.upsertFeatureValue('bid-001', input);
      expect(mockDatabase.pool.query).toHaveBeenCalled();
    });

    it('should handle bid with no items', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const input = { 
        featureId: 'feature-001', 
        optionId: 'option-001',
        textValue: undefined,
        numericValue: undefined
      };
      
      await bidService.upsertFeatureValue('bid-001', input);
      expect(mockDatabase.pool.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('findBidEnvelopes', () => {
    it('should find bid envelopes (technical and commercial)', async () => {
      const mockDatabase = require('../../config/database');
      const mockEnvelopes = [
        {
          id: 'envelope-001',
          bid_id: 'bid-001',
          envelope_type: 'technical',
          is_open: false,
          created_at: new Date().toISOString(),
        },
        {
          id: 'envelope-002',
          bid_id: 'bid-001',
          envelope_type: 'commercial',
          is_open: false,
          created_at: new Date().toISOString(),
        }
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: mockEnvelopes });

      const result = await bidService.findBidEnvelopes('bid-001');

      expect(result).toHaveLength(2);
      expect(result[0].envelope_type).toBe('technical');
      expect(result[1].envelope_type).toBe('commercial');
    });

    it('should return empty array if envelopes not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await bidService.findBidEnvelopes('bid-001');

      expect(result).toEqual([]);
    });
  });
});
