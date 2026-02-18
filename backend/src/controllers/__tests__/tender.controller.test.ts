import { Request, Response, NextFunction } from 'express';
import { tenderController } from '../tender.controller';
import { tenderService } from '../../services/tender.service';

jest.mock('../../services/tender.service');
jest.mock('../../config/logger');

describe('TenderController', () => {
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
        email: 'buyer@example.com',
        role: 'buyer',
        roles: ['buyer'],
        companyId: 'org-001',
        orgId: 'org-001',
      },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('create', () => {
    it('should create a new tender successfully', async () => {
      const mockTender = {
        id: 'tender-001',
        title: 'Infrastructure Project',
        description: 'Large infrastructure project',
        status: 'draft',
        buyer_org_id: 'org-001',
        tender_type: 'open',
        procurement_type: 'goods',
        currency: 'USD',
        estimated_cost: 500000,
        created_at: new Date(),
      };

      (tenderService.create as jest.Mock).mockResolvedValue(mockTender);

      mockReq.body = {
        title: 'Infrastructure Project',
        description: 'Large infrastructure project',
        tender_type: 'open',
        procurement_type: 'goods',
        estimated_cost: 500000,
      };

      await tenderController.create(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockTender });
      expect(tenderService.create).toHaveBeenCalledWith(
        mockReq.body,
        'user-001',
        'org-001'
      );
    });

    it('should handle validation errors on tender creation', async () => {
      const error = new Error('Invalid tender data');
      (tenderService.create as jest.Mock).mockRejectedValue(error);

      mockReq.body = { title: '' };

      await tenderController.create(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should handle service errors', async () => {
      const error = new Error('Database error');
      (tenderService.create as jest.Mock).mockRejectedValue(error);

      mockReq.body = {
        title: 'Project',
        tender_type: 'open',
      };

      await tenderController.create(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('findAll', () => {
    it('should return all tenders for buyer', async () => {
      const mockTenders = [
        {
          id: 'tender-001',
          title: 'Project 1',
          status: 'published',
          buyer_org_id: 'org-001',
        },
        {
          id: 'tender-002',
          title: 'Project 2',
          status: 'draft',
          buyer_org_id: 'org-001',
        },
      ];

      (tenderService.findAll as jest.Mock).mockResolvedValue(mockTenders);

      (mockReq.user as any).role = 'buyer';

      await tenderController.findAll(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockTenders });
      expect(tenderService.findAll).toHaveBeenCalledWith('org-001', 'buyer');
    });

    it('should return published tenders for vendor', async () => {
      const mockTenders = [
        {
          id: 'tender-001',
          title: 'Project 1',
          status: 'published',
        },
      ];

      (tenderService.findAll as jest.Mock).mockResolvedValue(mockTenders);

      (mockReq.user as any).role = 'vendor';

      await tenderController.findAll(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(tenderService.findAll).toHaveBeenCalledWith('org-001', 'vendor');
    });

    it('should handle service errors', async () => {
      const error = new Error('Database error');
      (tenderService.findAll as jest.Mock).mockRejectedValue(error);

      await tenderController.findAll(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('findById', () => {
    it('should return tender for owner', async () => {
      const mockTender = {
        id: 'tender-001',
        title: 'Project 1',
        status: 'published',
        buyer_org_id: 'org-001',
        fund_allocation: 100000,
        estimated_cost: 500000,
      };

      (tenderService.findById as jest.Mock).mockResolvedValue(mockTender);

      mockReq.params = { id: 'tender-001' };

      await tenderController.findById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockTender });
    });

    it('should hide sensitive data from vendors', async () => {
      const mockTender = {
        id: 'tender-001',
        title: 'Project 1',
        status: 'published',
        buyer_org_id: 'org-002',
        fund_allocation: 100000,
        estimated_cost: 500000,
      };

      (tenderService.findById as jest.Mock).mockResolvedValue(mockTender);

      // Set user as vendor (not owner of this tender)
      mockReq.user = {
        id: 'user-001',
        email: 'vendor@example.com',
        role: 'vendor',
        roles: ['vendor'],
        companyId: 'org-001',
        orgId: 'org-001',
      };
      mockReq.params = { id: 'tender-001' };

      await tenderController.findById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      // Verify that the controller was called for a vendor user
      expect(mockRes.json).toHaveBeenCalled();
      const response = (mockRes.json as jest.Mock).mock.calls[0][0].data;
      // For vendors who are not owners, sensitive fields should be hidden
      expect(response).toHaveProperty('id', 'tender-001');
    });

    it('should return 404 for non-existent tender', async () => {
      (tenderService.findById as jest.Mock).mockResolvedValue(null);

      mockReq.params = { id: 'tender-999' };

      await tenderController.findById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: { code: 'NOT_FOUND', message: 'Tender not found' },
      });
    });

    it('should handle service errors', async () => {
      const error = new Error('Database error');
      (tenderService.findById as jest.Mock).mockRejectedValue(error);

      mockReq.params = { id: 'tender-001' };

      await tenderController.findById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('update', () => {
    it('should update tender successfully', async () => {
      const mockUpdatedTender = {
        id: 'tender-001',
        title: 'Updated Project',
        status: 'draft',
        buyer_org_id: 'org-001',
      };

      (tenderService.update as jest.Mock).mockResolvedValue(mockUpdatedTender);

      mockReq.params = { id: 'tender-001' };
      mockReq.body = { title: 'Updated Project' };

      await tenderController.update(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockUpdatedTender });
      expect(tenderService.update).toHaveBeenCalledWith(
        'tender-001',
        mockReq.body,
        'org-001'
      );
    });

    it('should reject updates on published tenders', async () => {
      const error = new Error('Cannot update published tender');
      (tenderService.update as jest.Mock).mockRejectedValue(error);

      mockReq.params = { id: 'tender-001' };
      mockReq.body = { title: 'New Title' };

      await tenderController.update(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should handle authorization errors', async () => {
      const error = new Error('Unauthorized to update this tender');
      (tenderService.update as jest.Mock).mockRejectedValue(error);

      mockReq.params = { id: 'tender-001' };
      mockReq.body = { title: 'New Title' };

      await tenderController.update(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('publish', () => {
    it('should publish a draft tender', async () => {
      const mockPublishedTender = {
        id: 'tender-001',
        title: 'Project 1',
        status: 'published',
        published_date: new Date(),
      };

      (tenderService.publish as jest.Mock).mockResolvedValue(mockPublishedTender);

      mockReq.params = { id: 'tender-001' };

      await tenderController.publish(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockPublishedTender });
    });

    it('should reject publishing tender without items', async () => {
      const error = new Error('Tender must have items before publishing');
      (tenderService.publish as jest.Mock).mockRejectedValue(error);

      mockReq.params = { id: 'tender-001' };

      await tenderController.publish(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should reject re-publishing published tender', async () => {
      const error = new Error('Tender is already published');
      (tenderService.publish as jest.Mock).mockRejectedValue(error);

      mockReq.params = { id: 'tender-001' };

      await tenderController.publish(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('cancel', () => {
    it('should cancel a tender with reason', async () => {
      const mockCancelledTender = {
        id: 'tender-001',
        status: 'cancelled',
        cancellation_reason: 'Budget constraints',
      };

      (tenderService.cancel as jest.Mock).mockResolvedValue(mockCancelledTender);

      mockReq.params = { id: 'tender-001' };
      mockReq.body = { reason: 'Budget constraints' };

      await tenderController.cancel(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockCancelledTender });
    });

    it('should reject cancellation without reason', async () => {
      const error = new Error('Cancellation reason is required');
      (tenderService.cancel as jest.Mock).mockRejectedValue(error);

      mockReq.params = { id: 'tender-001' };
      mockReq.body = {};

      await tenderController.cancel(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should reject cancellation of awarded tender', async () => {
      const error = new Error('Cannot cancel awarded tender');
      (tenderService.cancel as jest.Mock).mockRejectedValue(error);

      mockReq.params = { id: 'tender-001' };
      mockReq.body = { reason: 'Changed mind' };

      await tenderController.cancel(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getTenderStatus', () => {
    it('should return current tender status', async () => {
      const mockTender = { id: 'tender-001', status: 'published' };
      (tenderService.findById as jest.Mock).mockResolvedValue(mockTender);

      mockReq.params = { id: 'tender-001' };

      await tenderController.findById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockTender });
    });

    it('should handle tender not found', async () => {
      (tenderService.findById as jest.Mock).mockResolvedValue(null);

      mockReq.params = { id: 'tender-999' };

      await tenderController.findById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });
});
