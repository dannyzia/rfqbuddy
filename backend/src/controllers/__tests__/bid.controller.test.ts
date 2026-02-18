import { Request, Response, NextFunction } from 'express';
import { bidController } from '../bid.controller';
import { bidService } from '../../services/bid.service';

jest.mock('../../services/bid.service');
jest.mock('../../config/logger');

describe('BidController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      body: {},
      params: {},
      user: {
        id: 'user-001',
        email: 'user@example.com',
        role: 'vendor',
        roles: ['vendor'],
        orgId: 'org-vendor-001',
      },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new bid for a tender', async () => {
      const mockBid = {
        id: 'bid-001',
        tender_id: 'tender-001',
        vendor_org_id: 'org-vendor-001',
        status: 'draft',
      };

      (bidService.create as jest.Mock).mockResolvedValue(mockBid);

      mockReq.params = { tenderId: 'tender-001' };

      await bidController.create(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockBid });
      expect(bidService.create).toHaveBeenCalledWith('tender-001', 'org-vendor-001');
    });

    it('should handle duplicate bid error', async () => {
      const error = new Error('Bid already exists for this tender');
      (bidService.create as jest.Mock).mockRejectedValue(error);

      mockReq.params = { tenderId: 'tender-001' };

      await bidController.create(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should handle tender not found error', async () => {
      const error = new Error('Tender not found');
      (bidService.create as jest.Mock).mockRejectedValue(error);

      mockReq.params = { tenderId: 'tender-999' };

      await bidController.create(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getMyBid', () => {
    it('should retrieve active bid with items and envelopes', async () => {
      const mockBid = {
        id: 'bid-001',
        tender_id: 'tender-001',
        vendor_org_id: 'org-vendor-001',
        status: 'draft',
      };
      const mockItems = [
        { id: 'item-1', bid_id: 'bid-001', envelope_type: 'technical' },
      ];
      const mockEnvelopes = [
        { id: 'env-1', bid_id: 'bid-001', envelope_type: 'technical', is_open: false },
      ];

      (bidService.findActiveBid as jest.Mock).mockResolvedValue(mockBid);
      (bidService.findBidItems as jest.Mock).mockResolvedValue(mockItems);
      (bidService.findBidEnvelopes as jest.Mock).mockResolvedValue(mockEnvelopes);

      mockReq.params = { tenderId: 'tender-001' };

      await bidController.getMyBid(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          ...mockBid,
          items: mockItems,
          envelopes: mockEnvelopes,
        },
      });
    });

    it('should return 404 when no active bid found', async () => {
      (bidService.findActiveBid as jest.Mock).mockResolvedValue(null);

      mockReq.params = { tenderId: 'tender-001' };

      await bidController.getMyBid(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: { code: 'NOT_FOUND', message: 'No active bid found' },
      });
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      (bidService.findActiveBid as jest.Mock).mockRejectedValue(error);

      mockReq.params = { tenderId: 'tender-001' };

      await bidController.getMyBid(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('update', () => {
    it('should update bid with new data', async () => {
      const updatedBid = {
        id: 'bid-001',
        tender_id: 'tender-001',
        vendor_org_id: 'org-vendor-001',
        status: 'draft',
        updated_at: new Date(),
      };

      (bidService.update as jest.Mock).mockResolvedValue(updatedBid);

      mockReq.params = { bidId: 'bid-001' };
      mockReq.body = { status: 'draft' };

      await bidController.update(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ data: updatedBid });
    });

    it('should reject update for unauthorized vendor', async () => {
      const error = new Error('Not authorized to update this bid');
      (bidService.update as jest.Mock).mockRejectedValue(error);

      mockReq.params = { bidId: 'bid-001' };
      mockReq.body = { status: 'draft' };

      await bidController.update(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should prevent update of submitted bids', async () => {
      const error = new Error('Cannot update submitted bid');
      (bidService.update as jest.Mock).mockRejectedValue(error);

      mockReq.params = { bidId: 'bid-001' };
      mockReq.body = { status: 'submitted' };

      await bidController.update(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('submit', () => {
    it('should submit a draft bid', async () => {
      const submittedBid = {
        id: 'bid-001',
        tender_id: 'tender-001',
        vendor_org_id: 'org-vendor-001',
        status: 'submitted',
        submitted_at: new Date(),
      };

      (bidService.submit as jest.Mock).mockResolvedValue(submittedBid);

      mockReq.params = { bidId: 'bid-001' };

      await bidController.submit(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ data: submittedBid });
      expect(bidService.submit).toHaveBeenCalledWith('bid-001', 'org-vendor-001');
    });

    it('should prevent resubmission of already submitted bid', async () => {
      const error = new Error('Bid already submitted');
      (bidService.submit as jest.Mock).mockRejectedValue(error);

      mockReq.params = { bidId: 'bid-001' };

      await bidController.submit(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should verify bid has all required items before submit', async () => {
      const error = new Error('Bid is missing required items');
      (bidService.submit as jest.Mock).mockRejectedValue(error);

      mockReq.params = { bidId: 'bid-001' };

      await bidController.submit(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('withdraw', () => {
    it('should withdraw a submitted bid', async () => {
      const withdrawnBid = {
        id: 'bid-001',
        tender_id: 'tender-001',
        vendor_org_id: 'org-vendor-001',
        status: 'withdrawn',
        withdrawn_at: new Date(),
      };

      (bidService.withdraw as jest.Mock).mockResolvedValue(withdrawnBid);

      mockReq.params = { bidId: 'bid-001' };

      await bidController.withdraw(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ data: withdrawnBid });
    });

    it('should prevent withdrawal after evaluation started', async () => {
      const error = new Error('Cannot withdraw bid during evaluation');
      (bidService.withdraw as jest.Mock).mockRejectedValue(error);

      mockReq.params = { bidId: 'bid-001' };

      await bidController.withdraw(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should verify bid belongs to vendor', async () => {
      const error = new Error('Not authorized to withdraw this bid');
      (bidService.withdraw as jest.Mock).mockRejectedValue(error);

      mockReq.params = { bidId: 'bid-002' };

      await bidController.withdraw(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('findByTenderId', () => {
    it('should list all bids for a tender (buyer view)', async () => {
      const mockBids = [
        { id: 'bid-001', vendor_org_id: 'org-1', status: 'submitted' },
        { id: 'bid-002', vendor_org_id: 'org-2', status: 'submitted' },
      ];

      (bidService.findByTenderId as jest.Mock).mockResolvedValue(mockBids);

      mockReq.user = {
        id: 'buyer-001',
        email: 'buyer@example.com',
        role: 'buyer',
        roles: ['buyer'],
        orgId: 'org-buyer-001',
      };
      mockReq.params = { tenderId: 'tender-001' };

      await bidController.findByTenderId(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockBids });
    });

    it('should return empty list when no bids exist', async () => {
      (bidService.findByTenderId as jest.Mock).mockResolvedValue([]);

      mockReq.user = {
        id: 'buyer-001',
        email: 'buyer@example.com',
        role: 'buyer',
        roles: ['buyer'],
        orgId: 'org-buyer-001',
      };
      mockReq.params = { tenderId: 'tender-001' };

      await bidController.findByTenderId(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ data: [] });
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      (bidService.findByTenderId as jest.Mock).mockRejectedValue(error);

      mockReq.params = { tenderId: 'tender-001' };

      await bidController.findByTenderId(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('findById', () => {
    it('should return full bid data for bid owner (vendor)', async () => {
      const mockBid = {
        id: 'bid-001',
        tender_id: 'tender-001',
        vendor_org_id: 'org-vendor-001',
        status: 'submitted',
      };
      const mockItems = [
        { id: 'item-1', envelope_type: 'technical', bid_id: 'bid-001' },
        { id: 'item-2', envelope_type: 'commercial', bid_id: 'bid-001' },
      ];
      const mockEnvelopes = [
        { id: 'env-1', envelope_type: 'technical', is_open: true },
        { id: 'env-2', envelope_type: 'commercial', is_open: false },
      ];

      (bidService.findById as jest.Mock).mockResolvedValue(mockBid);
      (bidService.findBidItems as jest.Mock).mockResolvedValue(mockItems);
      (bidService.findBidEnvelopes as jest.Mock).mockResolvedValue(mockEnvelopes);

      mockReq.params = { bidId: 'bid-001' };

      await bidController.findById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          ...mockBid,
          items: mockItems,
          envelopes: mockEnvelopes,
        },
      });
    });

    it('should return filtered data for buyer (only opened envelopes)', async () => {
      const mockBid = {
        id: 'bid-001',
        tender_id: 'tender-001',
        vendor_org_id: 'org-vendor-001',
        status: 'submitted',
      };
      const mockItems = [
        { id: 'item-1', envelope_type: 'technical', bid_id: 'bid-001' },
        { id: 'item-2', envelope_type: 'commercial', bid_id: 'bid-001' },
      ];
      const mockEnvelopes = [
        { id: 'env-1', envelope_type: 'technical', is_open: true },
        { id: 'env-2', envelope_type: 'commercial', is_open: false },
      ];

      (bidService.findById as jest.Mock).mockResolvedValue(mockBid);
      (bidService.findBidItems as jest.Mock).mockResolvedValue(mockItems);
      (bidService.findBidEnvelopes as jest.Mock).mockResolvedValue(mockEnvelopes);

      mockReq.user = {
        id: 'buyer-001',
        email: 'buyer@example.com',
        role: 'buyer',
        roles: ['buyer'],
        orgId: 'org-buyer-001',
      };
      mockReq.params = { bidId: 'bid-001' };

      await bidController.findById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      const callArg = (mockRes.json as jest.Mock).mock.calls[0][0];
      expect(callArg.data.items).toHaveLength(1); // Only technical (open) item
      expect(callArg.data.items[0].envelope_type).toBe('technical');
    });

    it('should return 404 for non-existent bid', async () => {
      (bidService.findById as jest.Mock).mockResolvedValue(null);

      mockReq.params = { bidId: 'bid-999' };

      await bidController.findById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: { code: 'NOT_FOUND', message: 'Bid not found' },
      });
    });

    it('should deny access to unauthorized users', async () => {
      const mockBid = {
        id: 'bid-001',
        tender_id: 'tender-001',
        vendor_org_id: 'org-vendor-002', // Different vendor
        status: 'submitted',
      };

      (bidService.findById as jest.Mock).mockResolvedValue(mockBid);

      mockReq.params = { bidId: 'bid-001' };

      await bidController.findById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: { code: 'FORBIDDEN', message: 'Not authorized' },
      });
    });

    it('should allow admin to view any bid', async () => {
      const mockBid = {
        id: 'bid-001',
        tender_id: 'tender-001',
        vendor_org_id: 'org-vendor-001',
        status: 'submitted',
      };
      const mockItems: any[] = [];
      const mockEnvelopes: any[] = [];

      (bidService.findById as jest.Mock).mockResolvedValue(mockBid);
      (bidService.findBidItems as jest.Mock).mockResolvedValue(mockItems);
      (bidService.findBidEnvelopes as jest.Mock).mockResolvedValue(mockEnvelopes);

      mockReq.user = {
        id: 'admin-001',
        email: 'admin@example.com',
        role: 'admin',
        roles: ['admin'],
        orgId: 'org-admin-001',
      };
      mockReq.params = { bidId: 'bid-001' };

      await bidController.findById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      (bidService.findById as jest.Mock).mockRejectedValue(error);

      mockReq.params = { bidId: 'bid-001' };

      await bidController.findById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
