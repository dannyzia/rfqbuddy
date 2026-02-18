import { Request, Response, NextFunction } from 'express';
import { exportController } from '../export.controller';
import { exportService } from '../../services/export.service';
import { auditService } from '../../services/audit.service';
import { notificationService } from '../../services/notification.service';

jest.mock('../../services/export.service');
jest.mock('../../services/audit.service');
jest.mock('../../services/notification.service');
jest.mock('../../config/logger');

// Mock the schemas
jest.mock('../../schemas/export.schema');
import { requestExportSchema, exportFilterSchema } from '../../schemas/export.schema';

describe('ExportController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup schema mocks
    (requestExportSchema.parse as jest.Mock) = jest.fn((input) => input);
    (exportFilterSchema.parse as jest.Mock) = jest.fn((input) => input || {});
    
    mockReq = {
      body: {},
      params: {},
      query: {},
      user: {
        id: 'user-001',
        email: 'user@example.com',
        role: 'buyer',
        roles: ['buyer'],
        orgId: 'org-001',
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

  describe('requestExport', () => {
    it('should create export job for tender summary PDF', async () => {
      const mockJob = {
        id: 'export-001',
        userId: 'user-001',
        exportType: 'tender_summary',
        format: 'pdf',
        status: 'pending',
      };

      (exportService.createExportJob as jest.Mock).mockResolvedValue(mockJob);
      (auditService.log as jest.Mock).mockResolvedValue(undefined);
      (exportService.processExportJob as jest.Mock).mockResolvedValue(undefined);
      (notificationService.create as jest.Mock).mockResolvedValue(undefined);

      mockReq.body = {
        exportType: 'tender_summary',
        format: 'pdf',
        tenderId: 'tender-001',
      };

      await exportController.requestExport(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(202);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Export job created'),
          job: mockJob,
        })
      );

      expect(auditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'EXPORT_REQUESTED',
          entityType: 'export',
        })
      );
    });

    it('should reject full data dump for non-admin users', async () => {
      mockReq.user = {
        id: 'user-001',
        email: 'user@example.com',
        role: 'buyer',
        roles: ['buyer'],
        orgId: 'org-001',
      };

      mockReq.body = {
        exportType: 'full_data_dump',
        format: 'xlsx',
      };

      await exportController.requestExport(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: {
          code: 'FORBIDDEN',
          message: 'Only admins can request full data dumps',
        },
      });
    });

    it('should allow admin to request full data dump', async () => {
      const mockJob = {
        id: 'export-001',
        userId: 'admin-001',
        exportType: 'full_data_dump',
        format: 'xlsx',
        status: 'pending',
      };

      (exportService.createExportJob as jest.Mock).mockResolvedValue(mockJob);
      (auditService.log as jest.Mock).mockResolvedValue(undefined);

      mockReq.user = {
        id: 'admin-001',
        email: 'admin@example.com',
        role: 'admin',
        roles: ['admin'],
        orgId: 'org-001',
      };

      mockReq.body = {
        exportType: 'full_data_dump',
        format: 'xlsx',
      };

      await exportController.requestExport(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(202);
      expect(auditService.log).toHaveBeenCalled();
    });

    it('should handle export service errors', async () => {
      const error = new Error('Export creation failed');
      (exportService.createExportJob as jest.Mock).mockRejectedValue(error);

      mockReq.body = {
        exportType: 'bid_comparison',
        format: 'xlsx',
        tenderId: 'tender-001',
      };

      await exportController.requestExport(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should handle service errors when creating export job', async () => {
      const error = new Error('Service error creating export');
      (exportService.createExportJob as jest.Mock).mockRejectedValue(error);

      mockReq.body = {
        exportType: 'tender_summary',
        format: 'pdf',
        tenderId: 'tender-001',
      };

      await exportController.requestExport(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getExportJob', () => {
    it('should return export job for authorized user', async () => {
      const mockJob = {
        id: 'export-001',
        userId: 'user-001',
        exportType: 'tender_summary',
        status: 'completed',
        fileUrl: 'https://s3.example.com/export.pdf',
        createdAt: new Date(),
      };

      (exportService.getJobById as jest.Mock).mockResolvedValue(mockJob);

      mockReq.params = { jobId: 'export-001' };

      await exportController.getExportJob(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(mockJob);
    });

    it('should deny access to other users export jobs', async () => {
      const mockJob = {
        id: 'export-001',
        userId: 'user-002',
        exportType: 'tender_summary',
      };

      (exportService.getJobById as jest.Mock).mockResolvedValue(mockJob);

      mockReq.user = {
        id: 'user-001',
        email: 'user@example.com',
        role: 'buyer',
        roles: ['buyer'],
        orgId: 'org-001',
      };
      mockReq.params = { jobId: 'export-001' };

      await exportController.getExportJob(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: { code: 'FORBIDDEN', message: 'Access denied' },
      });
    });

    it('should allow admin to view any export job', async () => {
      const mockJob = {
        id: 'export-001',
        userId: 'user-002',
        exportType: 'tender_summary',
        status: 'completed',
      };

      (exportService.getJobById as jest.Mock).mockResolvedValue(mockJob);

      mockReq.user = {
        id: 'admin-001',
        email: 'admin@example.com',
        role: 'admin',
        roles: ['admin'],
        orgId: 'org-001',
      };
      mockReq.params = { jobId: 'export-001' };

      await exportController.getExportJob(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(mockJob);
    });

    it('should return 404 for non-existent job', async () => {
      (exportService.getJobById as jest.Mock).mockResolvedValue(null);

      mockReq.params = { jobId: 'export-999' };

      await exportController.getExportJob(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: { code: 'NOT_FOUND', message: 'Export job not found' },
      });
    });

    it('should handle service errors', async () => {
      const error = new Error('Database error');
      (exportService.getJobById as jest.Mock).mockRejectedValue(error);

      mockReq.params = { jobId: 'export-001' };

      await exportController.getExportJob(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('listMyExports', () => {
    it('should list user export jobs with pagination', async () => {
      const mockJobs = {
        jobs: [
          {
            id: 'export-001',
            exportType: 'tender_summary',
            status: 'completed',
          },
          {
            id: 'export-002',
            exportType: 'bid_comparison',
            status: 'pending',
          },
        ],
        total: 2,
      };

      (exportService.listUserJobs as jest.Mock).mockResolvedValue(mockJobs);

      mockReq.user = {
        id: 'user-001',
        email: 'user@example.com',
        role: 'buyer',
        roles: ['buyer'],
        orgId: 'org-001',
      };

      await exportController.listMyExports(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(mockJobs);
    });

    it('should apply filters to export list', async () => {
      const mockJobs = {
        jobs: [
          {
            id: 'export-001',
            status: 'completed',
          },
        ],
        total: 1,
      };

      (exportService.listUserJobs as jest.Mock).mockResolvedValue(mockJobs);

      mockReq.user = {
        id: 'user-001',
        email: 'user@example.com',
        role: 'buyer',
        roles: ['buyer'],
        orgId: 'org-001',
      };
      mockReq.query = { status: 'completed' };

      await exportController.listMyExports(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(mockJobs);
    });

    it('should handle empty list', async () => {
      const mockJobs = {
        jobs: [],
        total: 0,
      };

      (exportService.listUserJobs as jest.Mock).mockResolvedValue(mockJobs);

      mockReq.user = {
        id: 'user-001',
        email: 'user@example.com',
        role: 'buyer',
        roles: ['buyer'],
        orgId: 'org-001',
      };

      await exportController.listMyExports(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({
        jobs: [],
        total: 0,
      });
    });

    it('should handle service errors', async () => {
      const error = new Error('Database error');
      (exportService.listUserJobs as jest.Mock).mockRejectedValue(error);

      mockReq.user = {
        id: 'user-001',
        email: 'user@example.com',
        role: 'buyer',
        roles: ['buyer'],
        orgId: 'org-001',
      };

      await exportController.listMyExports(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('downloadExport', () => {
    it('should provide download link for completed export', async () => {
      const mockJob = {
        id: 'export-001',
        userId: 'user-001',
        status: 'completed',
        fileUrl: 'https://s3.example.com/export.pdf',
      };

      (exportService.getJobById as jest.Mock).mockResolvedValue(mockJob);

      mockReq.params = { jobId: 'export-001' };

      await exportController.downloadExport(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({
        downloadUrl: mockJob.fileUrl,
      });
    });

    it('should reject access to other users exports', async () => {
      const mockJob = {
        id: 'export-001',
        userId: 'user-002',
        status: 'completed',
        fileUrl: 'https://s3.example.com/export.pdf',
      };

      (exportService.getJobById as jest.Mock).mockResolvedValue(mockJob);

      mockReq.params = { jobId: 'export-001' };

      await exportController.downloadExport(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });

    it('should return error for not completed exports', async () => {
      const mockJob = {
        id: 'export-001',
        userId: 'user-001',
        status: 'pending',
        fileUrl: null,
      };

      (exportService.getJobById as jest.Mock).mockResolvedValue(mockJob);

      mockReq.params = { jobId: 'export-001' };

      await exportController.downloadExport(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: {
          code: 'BUSINESS_RULE_VIOLATION',
          message: 'Export is not ready for download',
        },
      });
    });

    it('should return error for failed exports', async () => {
      const mockJob = {
        id: 'export-001',
        userId: 'user-001',
        status: 'failed',
        errorMessage: 'PDF generation failed',
        fileUrl: null,
      };

      (exportService.getJobById as jest.Mock).mockResolvedValue(mockJob);

      mockReq.params = { jobId: 'export-001' };

      await exportController.downloadExport(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: {
          code: 'BUSINESS_RULE_VIOLATION',
          message: 'Export is not ready for download',
        },
      });
    });

    it('should return 404 for non-existent job', async () => {
      (exportService.getJobById as jest.Mock).mockResolvedValue(null);

      mockReq.params = { jobId: 'export-999' };

      await exportController.downloadExport(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });

  describe('retryExport', () => {
    it('should retry failed export job', async () => {
      (exportService.getJobById as jest.Mock).mockResolvedValue({
        id: 'export-001',
        userId: 'user-001',
        status: 'failed',
      });
      (exportService.updateJobStatus as jest.Mock).mockResolvedValue(undefined);
      (exportService.processExportJob as jest.Mock).mockResolvedValue(undefined);

      mockReq.params = { jobId: 'export-001' };

      await exportController.retryExport(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Export retry initiated',
      });
      expect(exportService.updateJobStatus).toHaveBeenCalledWith('export-001', 'pending');
    });

    it('should reject retry of non-failed exports', async () => {
      (exportService.getJobById as jest.Mock).mockResolvedValue({
        id: 'export-001',
        userId: 'user-001',
        status: 'completed',
      });

      mockReq.params = { jobId: 'export-001' };

      await exportController.retryExport(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: expect.stringContaining('Only failed exports'),
          }),
        })
      );
    });

    it('should reject access from other users', async () => {
      (exportService.getJobById as jest.Mock).mockResolvedValue({
        id: 'export-001',
        userId: 'user-002',
        status: 'failed',
      });

      mockReq.params = { jobId: 'export-001' };

      await exportController.retryExport(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });

    it('should allow admin to retry any export', async () => {
      (exportService.getJobById as jest.Mock).mockResolvedValue({
        id: 'export-001',
        userId: 'user-002',
        status: 'failed',
      });
      (exportService.updateJobStatus as jest.Mock).mockResolvedValue(undefined);
      (exportService.processExportJob as jest.Mock).mockResolvedValue(undefined);

      mockReq.user = {
        id: 'admin-001',
        email: 'admin@example.com',
        role: 'admin',
        roles: ['admin'],
        orgId: 'org-001',
      };
      mockReq.params = { jobId: 'export-001' };

      await exportController.retryExport(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Export retry initiated',
      });
    });

    it('should return 404 for non-existent job', async () => {
      (exportService.getJobById as jest.Mock).mockResolvedValue(null);

      mockReq.params = { jobId: 'export-999' };

      await exportController.retryExport(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: { code: 'NOT_FOUND', message: 'Export job not found' },
      });
    });
  });
});
