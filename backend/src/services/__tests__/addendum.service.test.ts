import { addendumService } from '../addendum.service';

// Mock the database and uuid
jest.mock('../../config/database');
jest.mock('../../config/logger');
jest.mock('uuid');

import { v4 as uuidv4 } from 'uuid';

describe('AddendumService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (uuidv4 as jest.Mock).mockReturnValue('addendum-uuid-1234');
  });

  describe('create', () => {
    it('should create a new addendum with deadline extension', async () => {
      const mockDatabase = require('../../config/database');
      
      const tenderRow = {
        id: 'tender-001',
        status: 'published',
        buyer_org_id: 'org-buyer-001',
        submission_deadline: new Date('2024-02-20'),
      };

      const addendumRow = {
        id: 'addendum-uuid-1234',
        tender_id: 'tender-001',
        addendum_number: 1,
        title: 'Important Update',
        description: 'Budget revision',
        extends_deadline_days: 5,
        published_at: new Date(),
        published_by: 'user-001',
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [tenderRow] })
        .mockResolvedValueOnce({ rows: [{ max: 0 }] })
        .mockResolvedValueOnce({ rows: [addendumRow] })
        .mockResolvedValueOnce({ rows: [] }) // deadline update
        .mockResolvedValueOnce({ rows: [{ vendor_org_id: 'vendor-001' }] })
        .mockResolvedValueOnce({ rows: [] }); // acknowledgement insert

      const input = {
        title: 'Important Update',
        description: 'Budget revision',
        extendsDeadlineDays: 5,
      };

      const result = await addendumService.create('tender-001', input, 'user-001', 'org-buyer-001');

      expect(result.id).toBe('addendum-uuid-1234');
      expect(result.addendum_number).toBe(1);
      expect(result.title).toBe('Important Update');
    });

    it('should throw error if tender not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const input = {
        title: 'Update',
        description: 'Test',
        extendsDeadlineDays: 0,
      };

      await expect(
        addendumService.create('nonexistent', input, 'user-001', 'org-001')
      ).rejects.toThrow('Tender not found');
    });

    it('should throw error if not authorized (wrong buyer org)', async () => {
      const mockDatabase = require('../../config/database');
      
      const tenderRow = {
        id: 'tender-001',
        status: 'published',
        buyer_org_id: 'org-buyer-001',
        submission_deadline: new Date('2024-02-20'),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [tenderRow] });

      const input = {
        title: 'Update',
        description: 'Test',
        extendsDeadlineDays: 0,
      };

      await expect(
        addendumService.create('tender-001', input, 'user-001', 'org-different')
      ).rejects.toThrow('Not authorized');
    });

    it('should throw error if tender not in allowed status', async () => {
      const mockDatabase = require('../../config/database');
      
      const tenderRow = {
        id: 'tender-001',
        status: 'awarded',
        buyer_org_id: 'org-buyer-001',
        submission_deadline: new Date('2024-02-20'),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [tenderRow] });

      const input = {
        title: 'Update',
        description: 'Test',
        extendsDeadlineDays: 0,
      };

      await expect(
        addendumService.create('tender-001', input, 'user-001', 'org-buyer-001')
      ).rejects.toThrow('Addenda can only be added to published tenders');
    });
  });

  describe('findById', () => {
    it('should return addendum by ID', async () => {
      const mockDatabase = require('../../config/database');
      
      const addendumRow = {
        id: 'addendum-001',
        tender_id: 'tender-001',
        addendum_number: 1,
        title: 'Update',
        description: 'Description',
        extends_deadline_days: 0,
        published_at: new Date(),
        published_by: 'user-001',
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [addendumRow] });

      const result = await addendumService.findById('addendum-001');

      expect(result).toEqual(addendumRow);
    });

    it('should return null if addendum not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await addendumService.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findByTenderId', () => {
    it('should return all addenda for a tender', async () => {
      const mockDatabase = require('../../config/database');
      
      const addenda = [
        {
          id: 'addendum-001',
          tender_id: 'tender-001',
          addendum_number: 1,
          title: 'Update 1',
          extends_deadline_days: 0,
        },
        {
          id: 'addendum-002',
          tender_id: 'tender-001',
          addendum_number: 2,
          title: 'Update 2',
          extends_deadline_days: 5,
        },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: addenda });

      const result = await addendumService.findByTenderId('tender-001');

      expect(result).toHaveLength(2);
      expect(result[0].addendum_number).toBe(1);
      expect(result[1].addendum_number).toBe(2);
    });

    it('should return empty array if no addenda found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await addendumService.findByTenderId('tender-001');

      expect(result).toHaveLength(0);
    });
  });

  describe('acknowledge', () => {
    it('should acknowledge addendum for vendor', async () => {
      const mockDatabase = require('../../config/database');
      
      const addendumRow = {
        id: 'addendum-001',
        tender_id: 'tender-001',
        addendum_number: 1,
      };

      const acknowledgementRow = {
        addendum_id: 'addendum-001',
        vendor_org_id: 'vendor-001',
        acknowledged_at: new Date(),
        acknowledged_by: 'user-001',
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [addendumRow] })
        .mockResolvedValueOnce({ rows: [{ acknowledged_at: null }] })
        .mockResolvedValueOnce({ rows: [acknowledgementRow] });

      const result = await addendumService.acknowledge('addendum-001', 'vendor-001', 'user-001');

      expect(result.acknowledged_at).not.toBeNull();
      expect(result.acknowledged_by).toBe('user-001');
    });

    it('should return existing acknowledgement if already acknowledged', async () => {
      const mockDatabase = require('../../config/database');
      
      const addendumRow = {
        id: 'addendum-001',
        tender_id: 'tender-001',
        addendum_number: 1,
      };

      const existingAck = {
        addendum_id: 'addendum-001',
        vendor_org_id: 'vendor-001',
        acknowledged_at: new Date('2024-02-15'),
        acknowledged_by: 'user-002',
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [addendumRow] })
        .mockResolvedValueOnce({ rows: [existingAck] });

      const result = await addendumService.acknowledge('addendum-001', 'vendor-001', 'user-001');

      expect(result.acknowledged_at).toEqual(existingAck.acknowledged_at);
    });

    it('should throw error if addendum not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      await expect(
        addendumService.acknowledge('nonexistent', 'vendor-001', 'user-001')
      ).rejects.toThrow('Addendum not found');
    });

    it('should throw error if vendor not eligible', async () => {
      const mockDatabase = require('../../config/database');
      
      const addendumRow = {
        id: 'addendum-001',
        tender_id: 'tender-001',
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [addendumRow] })
        .mockResolvedValueOnce({ rows: [] });

      await expect(
        addendumService.acknowledge('addendum-001', 'vendor-001', 'user-001')
      ).rejects.toThrow('Vendor not eligible');
    });
  });

  describe('getAcknowledgementStatus', () => {
    it('should return acknowledgement status for all vendors', async () => {
      const mockDatabase = require('../../config/database');
      
      const statuses = [
        {
          addendum_id: 'addendum-001',
          vendor_org_id: 'vendor-001',
          acknowledged_at: new Date(),
          acknowledged_by: 'user-001',
          vendor_name: 'Vendor Inc',
        },
        {
          addendum_id: 'addendum-001',
          vendor_org_id: 'vendor-002',
          acknowledged_at: null,
          acknowledged_by: null,
          vendor_name: 'Another Vendor',
        },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: statuses });

      const result = await addendumService.getAcknowledgementStatus('addendum-001');

      expect(result).toHaveLength(2);
      expect(result[0].acknowledged_at).not.toBeNull();
      expect(result[1].acknowledged_at).toBeNull();
    });
  });

  describe('getUnacknowledgedByVendor', () => {
    it('should return unacknowledged addenda for vendor', async () => {
      const mockDatabase = require('../../config/database');
      
      const unacknowledged = [
        {
          id: 'addendum-001',
          tender_id: 'tender-001',
          addendum_number: 1,
          title: 'Update 1',
        },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: unacknowledged });

      const result = await addendumService.getUnacknowledgedByVendor('tender-001', 'vendor-001');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Update 1');
    });

    it('should return empty array if all acknowledged', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await addendumService.getUnacknowledgedByVendor('tender-001', 'vendor-001');

      expect(result).toHaveLength(0);
    });
  });

  describe('hasUnacknowledgedAddenda', () => {
    it('should return true if unacknowledged addenda exist', async () => {
      const mockDatabase = require('../../config/database');
      
      const unacknowledged = [
        {
          id: 'addendum-001',
          tender_id: 'tender-001',
          addendum_number: 1,
        },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: unacknowledged });

      const result = await addendumService.hasUnacknowledgedAddenda('tender-001', 'vendor-001');

      expect(result).toBe(true);
    });

    it('should return false if no unacknowledged addenda', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await addendumService.hasUnacknowledgedAddenda('tender-001', 'vendor-001');

      expect(result).toBe(false);
    });
  });
});
