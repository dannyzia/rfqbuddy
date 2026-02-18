import { itemService } from '../item.service';
import type { CreateItemInput, UpdateItemInput } from '../../schemas/item.schema';

// Mock the database
jest.mock('../../config/database');
jest.mock('../../config/logger');

describe('ItemService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new item in a draft tender', async () => {
      const mockDatabase = require('../../config/database');
      const tenderId = 'tender-001';
      const orgId = 'org-001';

      const createInput: CreateItemInput = {
        itemType: 'item',
        slNo: 1,
        itemName: 'Office Supplies',
        quantity: 100,
        uom: 'pack',
        estimatedCost: 5000,
      };

      const mockTender = { id: tenderId, status: 'draft', buyer_org_id: orgId };
      const mockCreatedItem = {
        id: 'item-001',
        tender_id: tenderId,
        parent_item_id: null,
        item_type: 'item',
        sl_no: 1,
        item_code: null,
        item_name: 'Office Supplies',
        specification: null,
        quantity: 100,
        uom: 'pack',
        estimated_cost: 5000,
        created_at: new Date().toISOString(),
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockTender] })
        .mockResolvedValueOnce({ rows: [mockCreatedItem] });

      const result = await itemService.create(tenderId, createInput, orgId);

      expect(result).toEqual(mockCreatedItem);
      expect(mockDatabase.pool.query).toHaveBeenCalledTimes(2);
    });

    it('should create a group item with zero quantity', async () => {
      const mockDatabase = require('../../config/database');
      const tenderId = 'tender-001';
      const orgId = 'org-001';

      const createInput: CreateItemInput = {
        itemType: 'group',
        slNo: 1,
        itemName: 'Category A',
        quantity: 0,
      };

      const mockTender = { id: tenderId, status: 'draft', buyer_org_id: orgId };
      const mockCreatedItem = {
        id: 'item-002',
        tender_id: tenderId,
        parent_item_id: null,
        item_type: 'group',
        sl_no: 1,
        item_code: null,
        item_name: 'Category A',
        specification: null,
        quantity: 0,
        uom: null,
        estimated_cost: null,
        created_at: new Date().toISOString(),
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockTender] })
        .mockResolvedValueOnce({ rows: [mockCreatedItem] });

      const result = await itemService.create(tenderId, createInput, orgId);

      expect(result.item_type).toBe('group');
      expect(result.quantity).toBe(0);
    });

    it('should throw error if tender not found', async () => {
      const mockDatabase = require('../../config/database');

      const createInput: CreateItemInput = {
        itemType: 'item',
        slNo: 1,
        itemName: 'Test Item',
        quantity: 100,
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      await expect(itemService.create('tender-000', createInput, 'org-001')).rejects.toThrow(
        'Tender not found'
      );
    });

    it('should throw error if not authorized', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { id: 'tender-001', status: 'draft', buyer_org_id: 'org-002' };

      const createInput: CreateItemInput = {
        itemType: 'item',
        slNo: 1,
        itemName: 'Test Item',
        quantity: 100,
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockTender] });

      await expect(itemService.create('tender-001', createInput, 'org-001')).rejects.toThrow(
        'Not authorized'
      );
    });

    it('should throw error if tender not in draft status', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { id: 'tender-001', status: 'published', buyer_org_id: 'org-001' };

      const createInput: CreateItemInput = {
        itemType: 'item',
        slNo: 1,
        itemName: 'Test Item',
        quantity: 100,
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockTender] });

      await expect(itemService.create('tender-001', createInput, 'org-001')).rejects.toThrow(
        'Can only add items to draft tenders'
      );
    });

    it('should throw error if group item has non-zero quantity', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { id: 'tender-001', status: 'draft', buyer_org_id: 'org-001' };

      const createInput: CreateItemInput = {
        itemType: 'group',
        slNo: 1,
        itemName: 'Category',
        quantity: 100, // Invalid for group
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockTender] });

      await expect(itemService.create('tender-001', createInput, 'org-001')).rejects.toThrow(
        'Group items must have quantity 0'
      );
    });

    it('should throw error if item quantity not greater than zero', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { id: 'tender-001', status: 'draft', buyer_org_id: 'org-001' };

      const createInput: CreateItemInput = {
        itemType: 'item',
        slNo: 1,
        itemName: 'Test Item',
        quantity: 0, // Invalid for item
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockTender] });

      await expect(itemService.create('tender-001', createInput, 'org-001')).rejects.toThrow(
        'Item quantity must be greater than 0'
      );
    });
  });

  describe('findByTenderId', () => {
    it('should return all items for a tender', async () => {
      const mockDatabase = require('../../config/database');
      const tenderId = 'tender-001';

      const mockItems = [
        {
          id: 'item-001',
          tender_id: tenderId,
          parent_item_id: null,
          item_type: 'item',
          sl_no: 1,
          item_code: 'IT001',
          item_name: 'Office Supplies',
          specification: 'Premium quality',
          quantity: 100,
          uom: 'pack',
          estimated_cost: 5000,
          created_at: new Date().toISOString(),
        },
        {
          id: 'item-002',
          tender_id: tenderId,
          parent_item_id: null,
          item_type: 'item',
          sl_no: 2,
          item_code: 'IT002',
          item_name: 'IT Equipment',
          specification: null,
          quantity: 50,
          uom: 'piece',
          estimated_cost: 25000,
          created_at: new Date().toISOString(),
        },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: mockItems });

      const result = await itemService.findByTenderId(tenderId);

      expect(result).toEqual(mockItems);
      expect(result).toHaveLength(2);
    });

    it('should return empty array if no items found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await itemService.findByTenderId('tender-999');

      expect(result).toEqual([]);
    });
  });

  describe('findByTenderIdAsTree', () => {
    it('should return items organized as tree structure', async () => {
      const mockDatabase = require('../../config/database');
      const tenderId = 'tender-001';

      const mockItems = [
        {
          id: 'group-001',
          tender_id: tenderId,
          parent_item_id: null,
          item_type: 'group',
          sl_no: 1,
          item_code: null,
          item_name: 'Category A',
          specification: null,
          quantity: 0,
          uom: null,
          estimated_cost: null,
          created_at: new Date().toISOString(),
        },
        {
          id: 'item-001',
          tender_id: tenderId,
          parent_item_id: 'group-001',
          item_type: 'item',
          sl_no: 1,
          item_code: 'IT001',
          item_name: 'Item 1',
          specification: null,
          quantity: 100,
          uom: 'pack',
          estimated_cost: 5000,
          created_at: new Date().toISOString(),
        },
        {
          id: 'item-002',
          tender_id: tenderId,
          parent_item_id: 'group-001',
          item_type: 'item',
          sl_no: 2,
          item_code: 'IT002',
          item_name: 'Item 2',
          specification: null,
          quantity: 50,
          uom: 'piece',
          estimated_cost: 3000,
          created_at: new Date().toISOString(),
        },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: mockItems });

      const result = await itemService.findByTenderIdAsTree(tenderId);

      expect(result).toHaveLength(1); // One root (the group)
      expect(result[0].id).toBe('group-001');
      expect((result[0] as any).children).toHaveLength(2);
      expect((result[0] as any).children[0].id).toBe('item-001');
      expect((result[0] as any).children[1].id).toBe('item-002');
    });

    it('should handle flat structure (all items at root level)', async () => {
      const mockDatabase = require('../../config/database');
      const mockItems = [
        {
          id: 'item-001',
          tender_id: 'tender-001',
          parent_item_id: null,
          item_type: 'item',
          sl_no: 1,
          item_code: 'IT001',
          item_name: 'Item 1',
          specification: null,
          quantity: 100,
          uom: 'pack',
          estimated_cost: 5000,
          created_at: new Date().toISOString(),
        },
        {
          id: 'item-002',
          tender_id: 'tender-001',
          parent_item_id: null,
          item_type: 'item',
          sl_no: 2,
          item_code: 'IT002',
          item_name: 'Item 2',
          specification: null,
          quantity: 50,
          uom: 'piece',
          estimated_cost: 3000,
          created_at: new Date().toISOString(),
        },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: mockItems });

      const result = await itemService.findByTenderIdAsTree('tender-001');

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('item-001');
      expect(result[1].id).toBe('item-002');
      expect((result[0] as any).children).toEqual([]);
      expect((result[1] as any).children).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return an item by ID', async () => {
      const mockDatabase = require('../../config/database');
      const tenantId = 'tender-001';
      const itemId = 'item-001';

      const mockItem = {
        id: itemId,
        tender_id: tenantId,
        parent_item_id: null,
        item_type: 'item',
        sl_no: 1,
        item_code: 'IT001',
        item_name: 'Office Supplies',
        specification: null,
        quantity: 100,
        uom: 'pack',
        estimated_cost: 5000,
        created_at: new Date().toISOString(),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockItem] });

      const result = await itemService.findById(tenantId, itemId);

      expect(result).toEqual(mockItem);
    });

    it('should return null if item not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await itemService.findById('tender-001', 'item-999');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update item name', async () => {
      const mockDatabase = require('../../config/database');
      const tenderId = 'tender-001';
      const itemId = 'item-001';
      const orgId = 'org-001';

      const updateInput: UpdateItemInput = {
        itemName: 'Updated Item Name',
      };

      const mockTender = { id: tenderId, status: 'draft', buyer_org_id: orgId };
      const mockExistingItem = {
        id: itemId,
        tender_id: tenderId,
        parent_item_id: null,
        item_type: 'item',
        sl_no: 1,
        item_code: 'IT001',
        item_name: 'Original Name',
        specification: null,
        quantity: 100,
        uom: 'pack',
        estimated_cost: 5000,
        created_at: new Date().toISOString(),
      };

      const mockUpdatedItem = { ...mockExistingItem, item_name: 'Updated Item Name' };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockTender] })
        .mockResolvedValueOnce({ rows: [mockExistingItem] })
        .mockResolvedValueOnce({ rows: [mockUpdatedItem] });

      const result = await itemService.update(tenderId, itemId, updateInput, orgId);

      expect(result.item_name).toBe('Updated Item Name');
    });

    it('should throw error if tender not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const updateInput: UpdateItemInput = {
        itemName: 'Updated',
      };

      await expect(
        itemService.update('tender-999', 'item-001', updateInput, 'org-001')
      ).rejects.toThrow('Tender not found');
    });

    it('should throw error if not authorized', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { id: 'tender-001', status: 'draft', buyer_org_id: 'org-002' };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockTender] });

      const updateInput: UpdateItemInput = { itemName: 'Updated' };

      await expect(
        itemService.update('tender-001', 'item-001', updateInput, 'org-001')
      ).rejects.toThrow('Not authorized');
    });

    it('should throw error if tender not in draft status', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { id: 'tender-001', status: 'published', buyer_org_id: 'org-001' };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockTender] });

      const updateInput: UpdateItemInput = { itemName: 'Updated' };

      await expect(
        itemService.update('tender-001', 'item-001', updateInput, 'org-001')
      ).rejects.toThrow('Can only edit items in draft tenders');
    });

    it('should throw error if item not found', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { id: 'tender-001', status: 'draft', buyer_org_id: 'org-001' };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockTender] })
        .mockResolvedValueOnce({ rows: [] }); // findById returns nothing

      const updateInput: UpdateItemInput = { itemName: 'Updated' };

      await expect(
        itemService.update('tender-001', 'item-999', updateInput, 'org-001')
      ).rejects.toThrow('Item not found');
    });

    it('should update multiple fields', async () => {
      const mockDatabase = require('../../config/database');
      const tenderId = 'tender-001';
      const itemId = 'item-001';
      const orgId = 'org-001';

      const updateInput: UpdateItemInput = {
        itemName: 'Updated Name',
        quantity: 200,
        estimatedCost: 10000,
      };

      const mockTender = { id: tenderId, status: 'draft', buyer_org_id: orgId };
      const mockExistingItem = {
        id: itemId,
        tender_id: tenderId,
        parent_item_id: null,
        item_type: 'item',
        sl_no: 1,
        item_code: 'IT001',
        item_name: 'Original Name',
        specification: null,
        quantity: 100,
        uom: 'pack',
        estimated_cost: 5000,
        created_at: new Date().toISOString(),
      };

      const mockUpdatedItem = {
        ...mockExistingItem,
        item_name: 'Updated Name',
        quantity: 200,
        estimated_cost: 10000,
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockTender] })
        .mockResolvedValueOnce({ rows: [mockExistingItem] })
        .mockResolvedValueOnce({ rows: [mockUpdatedItem] });

      const result = await itemService.update(tenderId, itemId, updateInput, orgId);

      expect(result.item_name).toBe('Updated Name');
      expect(result.quantity).toBe(200);
      expect(result.estimated_cost).toBe(10000);
    });

    it('should return existing item if no updates provided', async () => {
      const mockDatabase = require('../../config/database');
      const tenderId = 'tender-001';
      const itemId = 'item-001';
      const orgId = 'org-001';

      const updateInput: UpdateItemInput = {}; // empty update

      const mockTender = { id: tenderId, status: 'draft', buyer_org_id: orgId };
      const mockExistingItem = {
        id: itemId,
        tender_id: tenderId,
        parent_item_id: null,
        item_type: 'item',
        sl_no: 1,
        item_code: 'IT001',
        item_name: 'Original Name',
        specification: null,
        quantity: 100,
        uom: 'pack',
        estimated_cost: 5000,
        created_at: new Date().toISOString(),
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockTender] })
        .mockResolvedValueOnce({ rows: [mockExistingItem] });

      const result = await itemService.update(tenderId, itemId, updateInput, orgId);

      expect(result).toEqual(mockExistingItem);
      // Should only query tender and existing item, not UPDATE
      expect(mockDatabase.pool.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('delete', () => {
    it('should delete an item from draft tender', async () => {
      const mockDatabase = require('../../config/database');
      const tenderId = 'tender-001';
      const itemId = 'item-001';
      const orgId = 'org-001';

      const mockTender = { id: tenderId, status: 'draft', buyer_org_id: orgId };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockTender] })
        .mockResolvedValueOnce({ rows: [] }); // DELETE returns empty

      await itemService.delete(tenderId, itemId, orgId);

      expect(mockDatabase.pool.query).toHaveBeenCalledTimes(2);
      expect(mockDatabase.pool.query).toHaveBeenNthCalledWith(2, expect.stringContaining('DELETE'), [
        itemId,
        tenderId,
      ]);
    });

    it('should throw error if tender not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      await expect(itemService.delete('tender-999', 'item-001', 'org-001')).rejects.toThrow(
        'Tender not found'
      );
    });

    it('should throw error if not authorized', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { id: 'tender-001', status: 'draft', buyer_org_id: 'org-002' };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockTender] });

      await expect(itemService.delete('tender-001', 'item-001', 'org-001')).rejects.toThrow(
        'Not authorized'
      );
    });

    it('should throw error if tender not in draft status', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { id: 'tender-001', status: 'published', buyer_org_id: 'org-001' };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockTender] });

      await expect(itemService.delete('tender-001', 'item-001', 'org-001')).rejects.toThrow(
        'Can only delete items from draft tenders'
      );
    });
  });
});
