import request from 'supertest';
import { Express } from 'express';
import express from 'express';

// Mock controllers and middleware BEFORE importing routes
jest.mock('../../controllers/export.controller', () => ({
  exportController: {
    requestExport: jest.fn(),
    getExportJob: jest.fn(),
    listMyExports: jest.fn(),
    downloadExport: jest.fn(),
    retryExport: jest.fn(),
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
import { exportRoutes } from '../export.routes';
import { exportController } from '../../controllers/export.controller';
import { validate } from '../../middleware/validate.middleware';
import { authenticate, authorize } from '../../middleware/auth.middleware';

describe('Export Routes', () => {
  let app: Express;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/', exportRoutes);

    // Mock validate middleware
    (validate as jest.Mock).mockImplementation((_schema: any) => (_req: any, _res: any, next: any) => {
      next();
    });

    // Mock auth middleware - default buyer role
    (authenticate as jest.Mock).mockImplementation((req: any, _res: any, next: any) => {
      req.user = {
        id: 'user-001',
        email: 'buyer@example.com',
        role: 'buyer',
        roles: ['buyer'],
        orgId: 'org-001',
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
    (exportController.requestExport as jest.Mock).mockImplementation((_req: any, res: any) => {
      res.status(201).json({ data: { id: 'export-001', status: 'pending' } });
    });

    (exportController.getExportJob as jest.Mock).mockImplementation((req: any, res: any) => {
      res.json({ data: { id: req.params.id, status: 'completed' } });
    });

    (exportController.listMyExports as jest.Mock).mockImplementation((_req: any, res: any) => {
      res.json({ data: [] });
    });

    (exportController.downloadExport as jest.Mock).mockImplementation((_req: any, res: any) => {
      res.status(200).send('export data');
    });
  });

  describe('Export Operations', () => {
    it('POST / should request export', async () => {
      const response = await request(app)
        .post('/exports')
        .send({ exportType: 'tender', format: 'xlsx' });

      expect(response.status).toBe(201);
      expect(exportController.requestExport).toHaveBeenCalled();
    });

    it('GET / should list exports', async () => {
      const response = await request(app).get('/exports');

      expect(response.status).toBe(200);
      expect(exportController.listMyExports).toHaveBeenCalled();
    });

    it('GET /:id should get export status', async () => {
      const response = await request(app).get('/exports/export-001');

      expect(response.status).toBe(200);
      expect(exportController.getExportJob).toHaveBeenCalled();
    });

    it('GET /:id/download should download export', async () => {
      const response = await request(app).get('/exports/export-001/download');

      expect(response.status).toBe(200);
      expect(exportController.downloadExport).toHaveBeenCalled();
    });
  });

  describe('Authentication', () => {
    it('should require authentication for all routes', async () => {
      (authenticate as jest.Mock).mockImplementationOnce((_req: any, res: any, _next: any) => {
        res.status(401).json({ error: 'Unauthorized' });
      });

      const response = await request(app).get('/exports');

      expect(response.status).toBe(401);
      expect(authenticate).toHaveBeenCalled();
    });
  });
});
