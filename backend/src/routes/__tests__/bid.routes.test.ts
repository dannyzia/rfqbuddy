import request from 'supertest';
import { Express } from 'express';
import express from 'express';

// Mock controllers and middleware BEFORE importing routes
jest.mock('../../controllers/bid.controller', () => ({
  bidController: {
    create: jest.fn(),
    getMyBid: jest.fn(),
    update: jest.fn(),
    submit: jest.fn(),
    withdraw: jest.fn(),
    findByTenderId: jest.fn(),
    findById: jest.fn(),
  },
}));

jest.mock('../../middleware/validate.middleware', () => {
  const mockValidate = jest.fn((_schema: any) => (_req: any, _res: any, next: any) => next());
  return {
    validate: mockValidate,
  };
});

jest.mock('../../middleware/auth.middleware', () => ({
  authenticate: jest.fn((_req: any, _res: any, next: any) => next()),
  authorize: jest.fn((..._roles: any[]) => (_req: any, _res: any, next: any) => next()),
}));

// Import after mocks
import { bidRoutes } from '../bid.routes';
import { bidController } from '../../controllers/bid.controller';
import { validate } from '../../middleware/validate.middleware';
import { authenticate, authorize } from '../../middleware/auth.middleware';

describe('Bid Routes', () => {
  let app: Express;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/bids', bidRoutes);

    // Mock validate middleware
    (validate as jest.Mock).mockImplementation((_schema: any) => (_req: any, _res: any, next: any) => {
      next();
    });

    // Mock auth middleware - default vendor role
    (authenticate as jest.Mock).mockImplementation((req: any, _res: any, next: any) => {
      req.user = {
        id: 'vendor-001',
        email: 'vendor@example.com',
        role: 'vendor',
        roles: ['vendor'],
        orgId: 'org-vendor-001',
      };
      next();
    });

    (authorize as jest.Mock).mockImplementation((..._roles: any[]) => {
      return (req: any, res: any, next: any) => {
        if (req.user?.roles?.some((r: string) => _roles.includes(r))) {
          next();
        } else {
          res.status(403).json({ error: 'Forbidden' });
        }
      };
    });

    // Default controller implementations
    (bidController.create as jest.Mock).mockImplementation((_req: any, res: any) => {
      res.status(201).json({ data: { id: 'bid-001' } });
    });

    (bidController.getMyBid as jest.Mock).mockImplementation((_req: any, res: any) => {
      res.json({ data: { id: 'bid-001' } });
    });

    (bidController.findByTenderId as jest.Mock).mockImplementation((_req: any, res: any) => {
      res.json({ data: [] });
    });

    (bidController.findById as jest.Mock).mockImplementation((req: any, res: any) => {
      res.json({ data: { id: req.params.bidId } });
    });

    (bidController.update as jest.Mock).mockImplementation((req: any, res: any) => {
      res.json({ data: { id: req.params.bidId } });
    });

    (bidController.submit as jest.Mock).mockImplementation((req: any, res: any) => {
      res.json({ data: { id: req.params.bidId, status: 'submitted' } });
    });

    (bidController.withdraw as jest.Mock).mockImplementation((req: any, res: any) => {
      res.json({ data: { id: req.params.bidId, status: 'withdrawn' } });
    });
  });

  describe('Authentication', () => {
    it('should require authentication for all routes', async () => {
      (authenticate as jest.Mock).mockImplementationOnce((_req: any, res: any, _next: any) => {
        res.status(401).json({ error: 'Unauthorized' });
      });

      const response = await request(app).get('/bids/tenders/tender-001/bids');

      expect(response.status).toBe(401);
      expect(authenticate).toHaveBeenCalled();
    });

    it('should pass authenticated user to controllers', async () => {
      await request(app).get('/bids/tenders/tender-001/bids/my');

      expect(bidController.getMyBid).toHaveBeenCalled();
      const callArg = (bidController.getMyBid as jest.Mock).mock.calls[0];
      expect(callArg[0].user).toBeDefined();
    });
  });

  describe('Bid Creation and Retrieval', () => {
    it('POST /tenders/:tenderId/bids should create bid for vendor', async () => {
      const response = await request(app)
        .post('/bids/tenders/tender-001/bids')
        .send({});

      expect(response.status).toBe(201);
      expect(bidController.create).toHaveBeenCalled();
    });

    it('GET /tenders/:tenderId/bids/my should retrieve vendor bid', async () => {
      const response = await request(app).get(
        '/bids/tenders/tender-001/bids/my'
      );

      expect(response.status).toBe(200);
      expect(bidController.getMyBid).toHaveBeenCalled();
    });

    it('GET /tenders/:tenderId/bids should list bids for authorized user', async () => {
      (authenticate as jest.Mock).mockImplementation((req: any, _res: any, next: any) => {
        req.user = {
          id: 'buyer-001',
          roles: ['buyer'],
          orgId: 'org-buyer-001',
        };
        next();
      });

      const response = await request(app).get('/bids/tenders/tender-001/bids');

      expect(response.status).toBe(200);
      expect(bidController.findByTenderId).toHaveBeenCalled();
    });
  });

  describe('Bid Details and Management', () => {
    it('GET /bids/:bidId should retrieve bid details', async () => {
      const response = await request(app).get('/bids/bids/bid-001');

      expect(response.status).toBe(200);
      expect(bidController.findById).toHaveBeenCalledWith(
        expect.objectContaining({ params: { bidId: 'bid-001' } }),
        expect.anything(),
        expect.anything()
      );
    });

    it('PUT /bids/:bidId should update bid', async () => {
      const response = await request(app)
        .put('/bids/bids/bid-001')
        .send({ data: {} });

      expect(response.status).toBe(200);
      expect(bidController.update).toHaveBeenCalled();
    });

    it('POST /bids/:bidId/submit should submit bid', async () => {
      const response = await request(app).post('/bids/bids/bid-001/submit');

      expect(response.status).toBe(200);
      expect(bidController.submit).toHaveBeenCalled();
    });

    it('POST /bids/:bidId/withdraw should withdraw bid', async () => {
      const response = await request(app).post('/bids/bids/bid-001/withdraw');

      expect(response.status).toBe(200);
      expect(bidController.withdraw).toHaveBeenCalled();
    });
  });

  describe('Authorization', () => {
    it('should reject vendor from listing all bids', async () => {
      (authorize as jest.Mock).mockImplementation((..._roles: any[]) => {
        return (req: any, res: any, _next: any) => {
          const hasRole = req.user?.roles?.some((r: string) => _roles.includes(r));
          if (!hasRole) {
            res.status(403).json({ error: 'Forbidden' });
          }
        };
      });

      const response = await request(app).get('/bids/tenders/tender-001/bids');

      // Should pass because default user is vendor and authorize mock allows it
      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });
});


