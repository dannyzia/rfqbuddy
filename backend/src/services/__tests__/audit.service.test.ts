import { auditService } from '../audit.service';
import type { CreateAuditLogInput, AuditFilterInput } from '../../schemas/audit.schema';

// Mock the database
jest.mock('../../config/database');
jest.mock('../../config/logger');

describe('AuditService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('log', () => {
    it('should create an audit log entry', async () => {
      const mockDatabase = require('../../config/database');

      const input: CreateAuditLogInput = {
        actorId: 'user-admin-001',
        action: 'TENDER_CREATED',
        entityType: 'tender',
        entityId: 'tender-001',
        metadata: { title: 'Test Tender' },
      };

      const mockCreatedLog = {
        id: 'audit-001',
        actor_id: 'user-admin-001',
        action: 'TENDER_CREATED',
        entity_type: 'tender',
        entity_id: 'tender-001',
        metadata: { title: 'Test Tender' },
        created_at: new Date(),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockCreatedLog] });

      const result = await auditService.log(input);

      expect(result.id).toBe('audit-001');
      expect(result.action).toBe('TENDER_CREATED');
      expect(result.metadata).toEqual({ title: 'Test Tender' });
    });

    it('should create audit log without metadata', async () => {
      const mockDatabase = require('../../config/database');

      const input: CreateAuditLogInput = {
        actorId: 'user-001',
        action: 'TENDER_PUBLISHED',
        entityType: 'tender',
        entityId: 'tender-001',
      };

      const mockCreatedLog = {
        id: 'audit-002',
        actor_id: 'user-001',
        action: 'TENDER_PUBLISHED',
        entity_type: 'tender',
        entity_id: 'tender-001',
        metadata: null,
        created_at: new Date(),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockCreatedLog] });

      const result = await auditService.log(input);

      expect(result.metadata).toBeNull();
    });

    it('should create audit log without actor', async () => {
      const mockDatabase = require('../../config/database');

      const input: CreateAuditLogInput = {
        actorId: null,
        action: 'TENDER_CREATED',
        entityType: 'tender',
        entityId: 'tender-001',
      };

      const mockCreatedLog = {
        id: 'audit-003',
        actor_id: null,
        action: 'SYSTEM_GENERATED',
        entity_type: 'tender',
        entity_id: 'tender-001',
        metadata: null,
        created_at: new Date(),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockCreatedLog] });

      const result = await auditService.log(input);

      expect(result.actorId).toBeNull();
    });
  });

  describe('logTenderCreated', () => {
    it('should log tender creation', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [{ id: 'audit-log' }] });

      await auditService.logTenderCreated('user-001', 'tender-001', {
        title: 'New Tender',
      });

      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO audit_logs'),
        expect.arrayContaining(['user-001', 'TENDER_CREATED', 'tender', 'tender-001'])
      );
    });
  });

  describe('logTenderUpdated', () => {
    it('should log tender update', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [{ id: 'audit-log' }] });

      await auditService.logTenderUpdated('user-001', 'tender-001', {
        updatedField: 'title',
      });

      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO audit_logs'),
        expect.arrayContaining(['user-001', 'TENDER_UPDATED'])
      );
    });
  });

  describe('logTenderPublished', () => {
    it('should log tender publication', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [{ id: 'audit-log' }] });

      await auditService.logTenderPublished('user-001', 'tender-001');

      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO audit_logs'),
        expect.arrayContaining(['user-001', 'TENDER_PUBLISHED', 'tender', 'tender-001'])
      );
    });
  });

  describe('logTenderCancelled', () => {
    it('should log tender cancellation with reason', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [{ id: 'audit-log' }] });

      await auditService.logTenderCancelled('user-001', 'tender-001', 'Process stopped');

      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO audit_logs'),
        expect.arrayContaining(['user-001', 'TENDER_CANCELLED', 'tender', 'tender-001'])
      );
    });

    it('should log tender cancellation without reason', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [{ id: 'audit-log' }] });

      await auditService.logTenderCancelled('user-001', 'tender-001');

      expect(mockDatabase.pool.query).toHaveBeenCalled();
    });
  });

  describe('logBidSubmitted', () => {
    it('should log bid submission', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [{ id: 'audit-log' }] });

      await auditService.logBidSubmitted('vendor-001', 'bid-001', {
        amount: 50000,
      });

      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO audit_logs'),
        expect.arrayContaining(['vendor-001', 'BID_SUBMITTED', 'bid', 'bid-001'])
      );
    });
  });

  describe('logBidWithdrawn', () => {
    it('should log bid withdrawal', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [{ id: 'audit-log' }] });

      await auditService.logBidWithdrawn('vendor-001', 'bid-001');

      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO audit_logs'),
        expect.arrayContaining(['vendor-001', 'BID_WITHDRAWN', 'bid', 'bid-001'])
      );
    });
  });

  describe('logEnvelopeOpened', () => {
    it('should log technical envelope opening', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [{ id: 'audit-log' }] });

      await auditService.logEnvelopeOpened('user-buyer-001', 'bid-001', 'technical');

      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO audit_logs'),
        expect.arrayContaining(['user-buyer-001', 'ENVELOPE_OPENED', 'bid', 'bid-001'])
      );
    });

    it('should log commercial envelope opening', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [{ id: 'audit-log' }] });

      await auditService.logEnvelopeOpened('user-buyer-001', 'bid-001', 'commercial');

      expect(mockDatabase.pool.query).toHaveBeenCalled();
    });
  });

  describe('logEvaluationSubmitted', () => {
    it('should log evaluation submission', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [{ id: 'audit-log' }] });

      await auditService.logEvaluationSubmitted('evaluator-001', 'eval-001', 'bid-001');

      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO audit_logs'),
        expect.arrayContaining(['evaluator-001', 'EVALUATION_SUBMITTED', 'evaluation', 'eval-001'])
      );
    });
  });

  describe('logAwardIssued', () => {
    it('should log award issuance', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [{ id: 'audit-log' }] });

      await auditService.logAwardIssued('buyer-001', 'award-001', {
        vendorId: 'vendor-001',
        awardAmount: 100000,
      });

      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO audit_logs'),
        expect.arrayContaining(['buyer-001', 'AWARD_ISSUED', 'award', 'award-001'])
      );
    });
  });

  describe('logVendorStatusChange', () => {
    it('should log vendor approval', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [{ id: 'audit-log' }] });

      await auditService.logVendorStatusChange(
        'admin-001',
        'vendor-001',
        'pending',
        'approved'
      );

      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO audit_logs'),
        expect.arrayContaining(['admin-001', 'VENDOR_APPROVED', 'vendor', 'vendor-001'])
      );
    });

    it('should log vendor rejection', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [{ id: 'audit-log' }] });

      await auditService.logVendorStatusChange(
        'admin-001',
        'vendor-001',
        'pending',
        'rejected',
        'Does not meet criteria'
      );

      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO audit_logs'),
        expect.arrayContaining(['admin-001', 'VENDOR_REJECTED'])
      );
    });

    it('should log vendor suspension', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [{ id: 'audit-log' }] });

      await auditService.logVendorStatusChange(
        'admin-001',
        'vendor-001',
        'approved',
        'suspended',
        'Payment default'
      );

      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO audit_logs'),
        expect.arrayContaining(['admin-001', 'VENDOR_SUSPENDED'])
      );
    });
  });

  describe('logUserLogin', () => {
    it('should log user login without IP', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [{ id: 'audit-log' }] });

      await auditService.logUserLogin('user-001');

      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO audit_logs'),
        expect.arrayContaining(['user-001', 'USER_LOGIN', 'user', 'user-001'])
      );
    });

    it('should log user login with IP address', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [{ id: 'audit-log' }] });

      await auditService.logUserLogin('user-001', '192.168.1.1');

      expect(mockDatabase.pool.query).toHaveBeenCalled();
    });
  });

  describe('logUserLogout', () => {
    it('should log user logout', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [{ id: 'audit-log' }] });

      await auditService.logUserLogout('user-001');

      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO audit_logs'),
        expect.arrayContaining(['user-001', 'USER_LOGOUT', 'user', 'user-001'])
      );
    });
  });

  describe('getLogsForEntity', () => {
    it('should return logs for entity with actor info', async () => {
      const mockDatabase = require('../../config/database');

      const mockLogs = [
        {
          id: 'audit-001',
          actor_id: 'user-001',
          action: 'TENDER_CREATED',
          entity_type: 'tender',
          entity_id: 'tender-001',
          metadata: null,
          created_at: new Date(),
          actor_name: 'John Admin',
          actor_email: 'john@example.com',
        },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: mockLogs });

      const result = await auditService.getLogsForEntity('tender', 'tender-001');

      expect(result).toHaveLength(1);
      expect(result[0].actorName).toBe('John Admin');
      expect(result[0].action).toBe('TENDER_CREATED');
    });

    it('should return logs with null actor', async () => {
      const mockDatabase = require('../../config/database');

      const mockLogs = [
        {
          id: 'audit-002',
          actor_id: null,
          action: 'SYSTEM_GENERATED',
          entity_type: 'tender',
          entity_id: 'tender-002',
          metadata: null,
          created_at: new Date(),
          actor_name: null,
          actor_email: null,
        },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: mockLogs });

      const result = await auditService.getLogsForEntity('tender', 'tender-002');

      expect(result[0].actorName).toBeNull();
    });

    it('should return empty array if no logs found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await auditService.getLogsForEntity('bid', 'bid-999');

      expect(result).toEqual([]);
    });
  });

  describe('searchLogs', () => {
    it('should search logs by actor id', async () => {
      const mockDatabase = require('../../config/database');

      const filter: AuditFilterInput = {
        actorId: 'user-001',
        limit: 50,
        offset: 0,
      };

      const mockCountResult = { count: '5' };
      const mockLogs = [
        {
          id: 'audit-001',
          actor_id: 'user-001',
          action: 'TENDER_CREATED',
          entity_type: 'tender',
          entity_id: 'tender-001',
          metadata: null,
          created_at: new Date(),
          actor_name: 'John Admin',
          actor_email: 'john@example.com',
        },
      ];

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockCountResult] })
        .mockResolvedValueOnce({ rows: mockLogs });

      const result = await auditService.searchLogs(filter);

      expect(result.total).toBe(5);
      expect(result.logs).toHaveLength(1);
    });

    it('should search logs by action', async () => {
      const mockDatabase = require('../../config/database');

      const filter: AuditFilterInput = {
        action: 'BID_SUBMITTED',
        limit: 50,
        offset: 0,
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [{ count: '3' }] })
        .mockResolvedValueOnce({ rows: [] });

      const result = await auditService.searchLogs(filter);

      expect(result.total).toBe(3);
    });

    it('should search logs by date range', async () => {
      const mockDatabase = require('../../config/database');

      const startDate = new Date('2024-01-01').toISOString();
      const endDate = new Date('2024-12-31').toISOString();

      const filter: AuditFilterInput = {
        startDate,
        endDate,
        limit: 50,
        offset: 0,
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [{ count: '10' }] })
        .mockResolvedValueOnce({ rows: [] });

      const result = await auditService.searchLogs(filter);

      expect(result.total).toBe(10);
    });

    it('should search logs with multiple filters', async () => {
      const mockDatabase = require('../../config/database');

      const filter: AuditFilterInput = {
        actorId: 'user-001',
        entityType: 'tender',
        action: 'TENDER_CREATED',
        limit: 50,
        offset: 0,
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [{ count: '2' }] })
        .mockResolvedValueOnce({ rows: [] });

      await auditService.searchLogs(filter);

      expect(mockDatabase.pool.query).toHaveBeenCalled();
    });

    it('should support pagination', async () => {
      const mockDatabase = require('../../config/database');

      const filter: AuditFilterInput = {
        limit: 25,
        offset: 50,
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [{ count: '200' }] })
        .mockResolvedValueOnce({ rows: [] });

      const result = await auditService.searchLogs(filter);

      expect(result.total).toBe(200);
    });
  });
});
