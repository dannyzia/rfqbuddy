import { taxService } from '../tax.service';
import type { CreateTaxRuleInput, UpdateTaxRuleInput, TaxFilterInput } from '../../schemas/tax.schema';

jest.mock('../../config/database');
jest.mock('../../config/logger');
jest.mock('uuid');

import { v4 as uuidv4 } from 'uuid';

describe('TaxService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (uuidv4 as jest.Mock).mockReturnValue('tax-uuid-1234');
  });

  describe('createTaxRule', () => {
    it('should create tax rule for goods', async () => {
      const mockDatabase = require('../../config/database');

      const mockRule = {
        id: 'tax-uuid-1234',
        name: 'VAT Goods',
        rate_percent: '15',
        applies_to: 'goods',
        is_active: true,
        created_at: new Date(),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockRule] });

      const input: CreateTaxRuleInput = {
        name: 'VAT Goods',
        ratePercent: 15,
        appliesTo: 'goods',
        isActive: true,
      };

      const result = await taxService.createTaxRule(input);

      expect(result.name).toBe('VAT Goods');
      expect(result.ratePercent).toBe(15);
      expect(result.appliesTo).toBe('goods');
    });

    it('should create tax rule for works', async () => {
      const mockDatabase = require('../../config/database');

      const mockRule = {
        id: 'tax-uuid-1234',
        name: 'Tax Works',
        rate_percent: '8',
        applies_to: 'works',
        is_active: true,
        created_at: new Date(),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockRule] });

      const input: CreateTaxRuleInput = {
        name: 'Tax Works',
        ratePercent: 8,
        appliesTo: 'works',
        isActive: true,
      };

      const result = await taxService.createTaxRule(input);

      expect(result.appliesTo).toBe('works');
    });

    it('should create tax rule for services', async () => {
      const mockDatabase = require('../../config/database');

      const mockRule = {
        id: 'tax-uuid-1234',
        name: 'Tax Services',
        rate_percent: '12',
        applies_to: 'services',
        is_active: true,
        created_at: new Date(),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockRule] });

      const input: CreateTaxRuleInput = {
        name: 'Tax Services',
        ratePercent: 12,
        appliesTo: 'services',
        isActive: true,
      };

      const result = await taxService.createTaxRule(input);

      expect(result.appliesTo).toBe('services');
    });

    it('should create tax rule for all procurement types', async () => {
      const mockDatabase = require('../../config/database');

      const mockRule = {
        id: 'tax-uuid-1234',
        name: 'General Tax',
        rate_percent: '10',
        applies_to: 'all',
        is_active: true,
        created_at: new Date(),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockRule] });

      const input: CreateTaxRuleInput = {
        name: 'General Tax',
        ratePercent: 10,
        appliesTo: 'all',
        isActive: true,
      };

      const result = await taxService.createTaxRule(input);

      expect(result.appliesTo).toBe('all');
    });
  });

  describe('updateTaxRule', () => {
    it('should update tax rule rate', async () => {
      const mockDatabase = require('../../config/database');

      const updatedRule = {
        id: 'tax-001',
        name: 'VAT Goods',
        rate_percent: '20',
        applies_to: 'goods',
        is_active: true,
        created_at: new Date(),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [updatedRule] });

      const input: UpdateTaxRuleInput = {
        ratePercent: 20,
      };

      const result = await taxService.updateTaxRule('tax-001', input);

      expect(result.ratePercent).toBe(20);
    });

    it('should update tax rule name and appliesTo', async () => {
      const mockDatabase = require('../../config/database');

      const updatedRule = {
        id: 'tax-001',
        name: 'Updated Tax',
        rate_percent: '15',
        applies_to: 'services',
        is_active: true,
        created_at: new Date(),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [updatedRule] });

      const input: UpdateTaxRuleInput = {
        name: 'Updated Tax',
        appliesTo: 'services',
      };

      const result = await taxService.updateTaxRule('tax-001', input);

      expect(result.name).toBe('Updated Tax');
      expect(result.appliesTo).toBe('services');
    });

    it('should throw error if no fields to update', async () => {
      const input: UpdateTaxRuleInput = {};

      await expect(taxService.updateTaxRule('tax-001', input)).rejects.toThrow('No fields to update');
    });

    it('should throw error if tax rule not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const input: UpdateTaxRuleInput = {
        ratePercent: 20,
      };

      await expect(taxService.updateTaxRule('nonexistent', input)).rejects.toThrow('Tax rule not found');
    });

    it('should deactivate tax rule', async () => {
      const mockDatabase = require('../../config/database');

      const updatedRule = {
        id: 'tax-001',
        name: 'VAT Goods',
        rate_percent: '15',
        applies_to: 'goods',
        is_active: false,
        created_at: new Date(),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [updatedRule] });

      const input: UpdateTaxRuleInput = {
        isActive: false,
      };

      const result = await taxService.updateTaxRule('tax-001', input);

      expect(result.isActive).toBe(false);
    });
  });

  describe('getTaxRuleById', () => {
    it('should return tax rule by id', async () => {
      const mockDatabase = require('../../config/database');

      const rule = {
        id: 'tax-001',
        name: 'VAT Goods',
        rate_percent: '15',
        applies_to: 'goods',
        is_active: true,
        created_at: new Date(),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [rule] });

      const result = await taxService.getTaxRuleById('tax-001');

      expect(result).not.toBeNull();
      expect(result?.name).toBe('VAT Goods');
    });

    it('should return null if tax rule not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await taxService.getTaxRuleById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('listTaxRules', () => {
    it('should list all tax rules with no filter', async () => {
      const mockDatabase = require('../../config/database');

      const rules = [
        { id: 'tax-001', name: 'VAT 1', rate_percent: '15', applies_to: 'goods', is_active: true, created_at: new Date() },
        { id: 'tax-002', name: 'VAT 2', rate_percent: '8', applies_to: 'services', is_active: true, created_at: new Date() },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: rules });

      const filter: TaxFilterInput = {};
      const result = await taxService.listTaxRules(filter);

      expect(result).toHaveLength(2);
    });

    it('should filter tax rules by appliesTo', async () => {
      const mockDatabase = require('../../config/database');

      const rules = [
        { id: 'tax-001', name: 'VAT Goods', rate_percent: '15', applies_to: 'goods', is_active: true, created_at: new Date() },
        { id: 'tax-003', name: 'General', rate_percent: '10', applies_to: 'all', is_active: true, created_at: new Date() },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: rules });

      const filter: TaxFilterInput = { appliesTo: 'goods' };
      const result = await taxService.listTaxRules(filter);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter tax rules by isActive status', async () => {
      const mockDatabase = require('../../config/database');

      const rules = [
        { id: 'tax-001', name: 'Active Tax', rate_percent: '15', applies_to: 'goods', is_active: true, created_at: new Date() },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: rules });

      const filter: TaxFilterInput = { isActive: true };
      const result = await taxService.listTaxRules(filter);

      expect(result.every((r) => r.isActive === true)).toBe(true);
    });

    it('should filter by both appliesTo and isActive', async () => {
      const mockDatabase = require('../../config/database');

      const rules = [
        { id: 'tax-001', name: 'VAT Goods', rate_percent: '15', applies_to: 'goods', is_active: true, created_at: new Date() },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: rules });

      const filter: TaxFilterInput = { appliesTo: 'goods', isActive: true };
      const result = await taxService.listTaxRules(filter);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty array if no matching rules', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const filter: TaxFilterInput = { appliesTo: 'works', isActive: false };
      const result = await taxService.listTaxRules(filter);

      expect(result).toHaveLength(0);
    });
  });

  describe('getActiveTaxRulesForProcurementType', () => {
    it('should get active tax rules for goods procurement', async () => {
      const mockDatabase = require('../../config/database');

      const rules = [
        { id: 'tax-001', name: 'VAT Goods', rate_percent: '15', applies_to: 'goods', is_active: true, created_at: new Date() },
        { id: 'tax-003', name: 'General', rate_percent: '10', applies_to: 'all', is_active: true, created_at: new Date() },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: rules });

      const result = await taxService.getActiveTaxRulesForProcurementType('goods');

      expect(result.length).toBeGreaterThan(0);
      expect(result.every((r) => r.isActive === true)).toBe(true);
    });

    it('should get active tax rules for works procurement', async () => {
      const mockDatabase = require('../../config/database');

      const rules = [
        { id: 'tax-002', name: 'Tax Works', rate_percent: '8', applies_to: 'works', is_active: true, created_at: new Date() },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: rules });

      const result = await taxService.getActiveTaxRulesForProcurementType('works');

      expect(result.length).toBeGreaterThan(0);
    });

    it('should include all-type rules in results', async () => {
      const mockDatabase = require('../../config/database');

      const rules = [
        { id: 'tax-003', name: 'General', rate_percent: '10', applies_to: 'all', is_active: true, created_at: new Date() },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: rules });

      const result = await taxService.getActiveTaxRulesForProcurementType('services');

      expect(result.some((r) => r.appliesTo === 'all')).toBe(true);
    });

    it('should return empty if no active rules for type', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await taxService.getActiveTaxRulesForProcurementType('goods');

      expect(result).toHaveLength(0);
    });
  });

  describe('calculateBidItemTaxes', () => {
    it('should calculate taxes for bid items', async () => {
      const mockDatabase = require('../../config/database');

      const tender = { procurement_type: 'goods' };
      const taxRules = [
        { id: 'tax-001', name: 'VAT', rate_percent: 15, appliesTo: 'goods', isActive: true, created_at: new Date() },
      ];
      const bidItems = [
        { id: 'item-001', item_total_price: '1000' },
      ];

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [tender] })
        .mockResolvedValueOnce({ rows: taxRules })
        .mockResolvedValueOnce({ rows: bidItems })
        .mockResolvedValueOnce({ rows: [] });

      const result = await taxService.calculateBidItemTaxes('bid-001', 'tender-001');

      expect(result.taxes).toBeDefined();
      expect(result.totalTax).toBeDefined();
    });

    it('should return zero tax if no rules applicable', async () => {
      const mockDatabase = require('../../config/database');

      const tender = { procurement_type: 'goods' };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [tender] })
        .mockResolvedValueOnce({ rows: [] });

      const result = await taxService.calculateBidItemTaxes('bid-001', 'tender-001');

      expect(result.totalTax).toBe(0);
      expect(result.taxes).toHaveLength(0);
    });

    it('should throw error if tender not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      await expect(taxService.calculateBidItemTaxes('bid-001', 'nonexistent')).rejects.toThrow();
    });
  });

  describe('deleteTaxRule', () => {
    it('should deactivate tax rule', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rowCount: 1 });

      await taxService.deleteTaxRule('tax-001');

      expect(mockDatabase.pool.query).toHaveBeenCalled();
    });

    it('should throw error if tax rule not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rowCount: 0 });

      await expect(taxService.deleteTaxRule('nonexistent')).rejects.toThrow();
    });
  });
});
