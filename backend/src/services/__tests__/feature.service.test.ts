import { featureService } from '../feature.service';
import type { CreateFeatureInput, CreateOptionInput, AttachFeatureInput } from '../../schemas/feature.schema';

// Mock the database
jest.mock('../../config/database');
jest.mock('../../config/logger');
jest.mock('uuid');

import { v4 as uuidv4 } from 'uuid';

describe('FeatureService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (uuidv4 as jest.Mock).mockReturnValue('feature-uuid-1234');
  });

  describe('createFeature', () => {
    it('should create a new feature', async () => {
      const mockDatabase = require('../../config/database');
      const mockFeature = {
        id: 'feature-uuid-1234',
        name: 'Material Type',
        feature_type: 'dropdown',
        scoring_type: 'points',
        evaluation_weight: 10,
        is_global: true,
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockFeature] });

      const input: CreateFeatureInput = {
        name: 'Material Type',
        featureType: 'single_select',
        scoringType: 'numeric',
        evaluationWeight: 10,
        isGlobal: true,
      };

      const result = await featureService.createFeature(input);

      expect(result).toEqual(mockFeature);
      expect(mockDatabase.pool.query).toHaveBeenCalled();
    });

    it('should create feature with null evaluation weight', async () => {
      const mockDatabase = require('../../config/database');
      const mockFeature = {
        id: 'feature-uuid-1234',
        name: 'Quality Grade',
        feature_type: 'text',
        scoring_type: 'binary',
        evaluation_weight: null,
        is_global: false,
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockFeature] });

      const input: CreateFeatureInput = {
        name: 'Quality Grade',
        featureType: 'text',
        scoringType: 'graded',
        isGlobal: false,
      };

      const result = await featureService.createFeature(input);

      expect(result.evaluation_weight).toBeNull();
    });

    it('should throw error if query fails', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockRejectedValueOnce(new Error('Database error'));

      const input: CreateFeatureInput = {
        name: 'Test Feature',
        featureType: 'text',
        scoringType: 'numeric',
        isGlobal: false,
      };

      await expect(featureService.createFeature(input)).rejects.toThrow();
    });
  });

  describe('findFeatureById', () => {
    it('should return feature by ID', async () => {
      const mockDatabase = require('../../config/database');
      const mockFeature = {
        id: 'feature-123',
        name: 'Delivery Time',
        feature_type: 'number',
        scoring_type: 'inversely',
        evaluation_weight: 15,
        is_global: true,
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockFeature] });

      const result = await featureService.findFeatureById('feature-123');

      expect(result).toEqual(mockFeature);
    });

    it('should return null if feature not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await featureService.findFeatureById('nonexistent');

      expect(result).toBeNull();
    });

    it('should throw error if query fails', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(featureService.findFeatureById('feature-123')).rejects.toThrow();
    });
  });

  describe('findAllGlobalFeatures', () => {
    it('should return all global features', async () => {
      const mockDatabase = require('../../config/database');
      const mockFeatures = [
        { id: 'f1', name: 'Feature A', is_global: true },
        { id: 'f2', name: 'Feature B', is_global: true },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: mockFeatures });

      const result = await featureService.findAllGlobalFeatures();

      expect(result).toEqual(mockFeatures);
      expect(result).toHaveLength(2);
    });

    it('should return empty array if no global features', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await featureService.findAllGlobalFeatures();

      expect(result).toEqual([]);
    });

    it('should throw error if query fails', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(featureService.findAllGlobalFeatures()).rejects.toThrow();
    });
  });

  describe('createOption', () => {
    it('should create feature option', async () => {
      const mockDatabase = require('../../config/database');
      const mockFeature = { id: 'feature-123', name: 'Test Feature' };
      const mockOption = {
        id: 'feature-uuid-1234',
        feature_id: 'feature-123',
        option_value: 'Option 1',
        option_score: 10,
        sort_order: 1,
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockFeature] })
        .mockResolvedValueOnce({ rows: [mockOption] });

      const input: CreateOptionInput = {
        optionValue: 'Option 1',
        optionScore: 10,
        sortOrder: 1,
      };

      const result = await featureService.createOption('feature-123', input);

      expect(result).toEqual(mockOption);
    });

    it('should throw error if feature not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const input: CreateOptionInput = {
        optionValue: 'Option',
        optionScore: 5,
        sortOrder: 1,
      };

      await expect(
        featureService.createOption('nonexistent', input)
      ).rejects.toThrow('Feature not found');
    });

    it('should throw error if database fails', async () => {
      const mockDatabase = require('../../config/database');
      const mockFeature = { id: 'feature-123' };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockFeature] })
        .mockRejectedValueOnce(new Error('Database error'));

      const input: CreateOptionInput = {
        optionValue: 'Option',
        optionScore: 5,
        sortOrder: 1,
      };

      await expect(
        featureService.createOption('feature-123', input)
      ).rejects.toThrow();
    });
  });

  describe('findOptionsByFeatureId', () => {
    it('should return options for a feature', async () => {
      const mockDatabase = require('../../config/database');
      const mockOptions = [
        { id: 'opt1', feature_id: 'f1', option_value: 'A', sort_order: 1 },
        { id: 'opt2', feature_id: 'f1', option_value: 'B', sort_order: 2 },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: mockOptions });

      const result = await featureService.findOptionsByFeatureId('f1');

      expect(result).toEqual(mockOptions);
      expect(result).toHaveLength(2);
    });

    it('should return empty array if no options', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await featureService.findOptionsByFeatureId('f1');

      expect(result).toEqual([]);
    });

    it('should throw error if query fails', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(featureService.findOptionsByFeatureId('f1')).rejects.toThrow();
    });
  });

  describe('attachToItem', () => {
    it('should attach feature to tender item', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { status: 'draft', buyer_org_id: 'org-001', id: 'tender-001' };
      const mockItem = { id: 'item-001', tender_id: 'tender-001' };
      const mockItemFeature = {
        tender_item_id: 'item-001',
        feature_id: 'feature-001',
        is_mandatory: true,
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockTender] }) // SELECT tender
        .mockResolvedValueOnce({ rows: [mockItem] }) // SELECT item
        .mockResolvedValueOnce({ rows: [mockItemFeature] }); // INSERT feature

      const input: AttachFeatureInput = {
        featureId: 'feature-001',
        isMandatory: true,
      };

      const result = await featureService.attachToItem('tender-001', 'item-001', input, 'org-001');

      expect(result).toEqual(mockItemFeature);
    });

    it('should throw error if tender not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const input: AttachFeatureInput = {
        featureId: 'feature-001',
        isMandatory: false,
      };

      await expect(
        featureService.attachToItem('nonexistent', 'item-001', input, 'org-001')
      ).rejects.toThrow('Tender not found');
    });

    it('should throw error if not authorized', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { status: 'draft', buyer_org_id: 'org-002' };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockTender] });

      const input: AttachFeatureInput = {
        featureId: 'feature-001',
        isMandatory: false,
      };

      await expect(
        featureService.attachToItem('tender-001', 'item-001', input, 'org-001')
      ).rejects.toThrow('Not authorized');
    });

    it('should throw error if tender in invalid status', async () => {
      const mockDatabase = require('../../config/database');
      const mockTender = { status: 'closed', buyer_org_id: 'org-001' };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockTender] });

      const input: AttachFeatureInput = {
        featureId: 'feature-001',
        isMandatory: false,
      };

      await expect(
        featureService.attachToItem('tender-001', 'item-001', input, 'org-001')
      ).rejects.toThrow();
    });
  });
});
