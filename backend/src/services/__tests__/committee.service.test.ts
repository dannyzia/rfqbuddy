import { CommitteeService } from '../committee.service';

// Mock the database properly - needs to be an object with query method
jest.mock('../../config/database', () => ({
  query: jest.fn(),
}));
jest.mock('../../config/logger');

describe('CommitteeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('assign', () => {
    it('should assign single evaluator to tender tier', async () => {
      const mockDatabase = require('../../config/database');
      const tenderId = 'tender-001';
      const userId = 'user-evaluator-001';
      const tier = 'technical';
      const assignedBy = 'user-admin-001';

      const mockAssignment = {
        id: 'assignment-001',
        tender_id: tenderId,
        user_id: userId,
        tier,
        assigned_by: assignedBy,
        status: 'pending',
        assigned_at: new Date().toISOString(),
      };

      mockDatabase.query.mockResolvedValueOnce({ rows: [mockAssignment] });

      const result = await CommitteeService.assign(tenderId, [userId], tier as any, assignedBy);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockAssignment);
      expect(mockDatabase.query).toHaveBeenCalled();
    });

    it('should assign multiple evaluators to same tier', async () => {
      const mockDatabase = require('../../config/database');
      const tenderId = 'tender-001';
      const userIds = ['user-eval-1', 'user-eval-2', 'user-eval-3'];
      const tier = 'commercial';
      const assignedBy = 'admin-001';

      const mockAssignments = userIds.map((userId, idx) => ({
        id: `assignment-${idx + 1}`,
        tender_id: tenderId,
        user_id: userId,
        tier,
        assigned_by: assignedBy,
        status: 'pending',
        assigned_at: new Date().toISOString(),
      }));

      mockDatabase.query
        .mockResolvedValueOnce({ rows: [mockAssignments[0]] })
        .mockResolvedValueOnce({ rows: [mockAssignments[1]] })
        .mockResolvedValueOnce({ rows: [mockAssignments[2]] });

      const result = await CommitteeService.assign(tenderId, userIds, tier as any, assignedBy);

      expect(result).toHaveLength(3);
      expect(mockDatabase.query).toHaveBeenCalledTimes(3);
    });

    it('should handle conflict when assigning duplicate evaluator', async () => {
      const mockDatabase = require('../../config/database');
      const tenderId = 'tender-001';
      const userId = 'user-eval-1';

      const mockAssignment = {
        id: 'assignment-001',
        status: 'pending',
      };

      mockDatabase.query.mockResolvedValueOnce({ rows: [mockAssignment] });

      const result = await CommitteeService.assign(tenderId, [userId], 'technical' as any, 'admin');

      expect(result).toHaveLength(1);
      // Should use ON CONFLICT DO UPDATE
      expect(mockDatabase.query).toHaveBeenCalledWith(
        expect.stringContaining('ON CONFLICT'),
        expect.any(Array)
      );
    });

    it('should throw error if assignment fails', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(
        CommitteeService.assign('tender-001', ['user-001'], 'technical' as any, 'admin')
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove evaluator from tender tier', async () => {
      const mockDatabase = require('../../config/database');
      const tenderId = 'tender-001';
      const userId = 'user-eval-001';
      const tier = 'technical';

      mockDatabase.query.mockResolvedValueOnce({ rows: [] });

      await CommitteeService.remove(tenderId, userId, tier);

      expect(mockDatabase.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE'),
        [tenderId, userId, tier]
      );
    });

    it('should throw error if remove fails', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(
        CommitteeService.remove('tender-001', 'user-001', 'technical')
      ).rejects.toThrow();
    });
  });

  describe('getByTender', () => {
    it('should return all committee members for a tender', async () => {
      const mockDatabase = require('../../config/database');
      const tenderId = 'tender-001';

      const mockMembers = [
        {
          id: 'assignment-001',
          tender_id: tenderId,
          user_id: 'user-eval-1',
          tier: 'technical',
          name: 'John Evaluator',
          email: 'john@example.com',
          roles: ['evaluator'],
          status: 'pending',
          assigned_at: new Date().toISOString(),
        },
        {
          id: 'assignment-002',
          tender_id: tenderId,
          user_id: 'user-eval-2',
          tier: 'commercial',
          name: 'Jane Evaluator',
          email: 'jane@example.com',
          roles: ['evaluator'],
          status: 'approved',
          assigned_at: new Date().toISOString(),
        },
      ];

      mockDatabase.query.mockResolvedValueOnce({ rows: mockMembers });

      const result = await CommitteeService.getByTender(tenderId);

      expect(result).toEqual(mockMembers);
      expect(result).toHaveLength(2);
    });

    it('should return empty array if no committee members', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.query.mockResolvedValueOnce({ rows: [] });

      const result = await CommitteeService.getByTender('tender-999');

      expect(result).toEqual([]);
    });

    it('should throw error if query fails', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(CommitteeService.getByTender('tender-001')).rejects.toThrow();
    });
  });

  describe('getByEvaluator', () => {
    it('should return all assignments for an evaluator', async () => {
      const mockDatabase = require('../../config/database');
      const userId = 'user-eval-001';

      const mockAssignments = [
        {
          id: 'assignment-001',
          tender_id: 'tender-001',
          user_id: userId,
          tier: 'technical',
          tender_title: 'IT Supply',
          tender_number: 'TEND-2024-001',
          status: 'approved',
          assigned_at: new Date().toISOString(),
        },
        {
          id: 'assignment-002',
          tender_id: 'tender-002',
          user_id: userId,
          tier: 'commercial',
          tender_title: 'Services Contract',
          tender_number: 'TEND-2024-002',
          status: 'pending',
          assigned_at: new Date().toISOString(),
        },
      ];

      mockDatabase.query.mockResolvedValueOnce({ rows: mockAssignments });

      const result = await CommitteeService.getByEvaluator(userId);

      expect(result).toEqual(mockAssignments);
      expect(result).toHaveLength(2);
    });

    it('should throw error if query fails', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(CommitteeService.getByEvaluator('user-001')).rejects.toThrow();
    });
  });

  describe('updateStatus', () => {
    it('should update assignment status to approved', async () => {
      const mockDatabase = require('../../config/database');
      const assignmentId = 'assignment-001';
      const userId = 'user-eval-001';
      const status = 'approved';

      const mockUpdatedAssignment = {
        id: assignmentId,
        status,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockDatabase.query.mockResolvedValueOnce({ rows: [mockUpdatedAssignment] });

      const result = await CommitteeService.updateStatus(assignmentId, status as any, userId);

      expect(result).toEqual(mockUpdatedAssignment);
      expect(mockDatabase.query).toHaveBeenCalledWith(
        expect.stringContaining('CASE WHEN $2 = \'approved\' THEN NOW() ELSE completed_at END'),
        expect.any(Array)
      );
    });

    it('should update assignment status to forwarded', async () => {
      const mockDatabase = require('../../config/database');
      const assignmentId = 'assignment-001';

      const mockUpdatedAssignment = {
        id: assignmentId,
        status: 'forwarded',
        forwarded_at: new Date().toISOString(),
      };

      mockDatabase.query.mockResolvedValueOnce({ rows: [mockUpdatedAssignment] });

      await CommitteeService.updateStatus(assignmentId, 'forwarded' as any, 'user-001');

      expect(mockDatabase.query).toHaveBeenCalledWith(
        expect.stringContaining('CASE WHEN $2 = \'forwarded\' THEN NOW() ELSE forwarded_at END'),
        expect.any(Array)
      );
    });

    it('should throw error if assignment not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.query.mockResolvedValueOnce({ rows: [] });

      await expect(
        CommitteeService.updateStatus('assignment-999', 'approved' as any, 'user-001')
      ).rejects.toThrow('Assignment not found or unauthorized');
    });

    it('should throw error if not authorized', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.query.mockResolvedValueOnce({ rows: [] });

      await expect(
        CommitteeService.updateStatus('assignment-001', 'approved' as any, 'wrong-user')
      ).rejects.toThrow();
    });
  });

  describe('isUserAssigned', () => {
    it('should return true if user is assigned to tier', async () => {
      const mockDatabase = require('../../config/database');
      const tenderId = 'tender-001';
      const userId = 'user-eval-001';
      const tier = 'technical';

      mockDatabase.query.mockResolvedValueOnce({ rows: [{ id: 'assignment-001' }] });

      const result = await CommitteeService.isUserAssigned(tenderId, userId, tier);

      expect(result).toBe(true);
    });

    it('should return false if user is not assigned to tier', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.query.mockResolvedValueOnce({ rows: [] });

      const result = await CommitteeService.isUserAssigned('tender-001', 'user-001', 'technical');

      expect(result).toBe(false);
    });

    it('should throw error if query fails', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(
        CommitteeService.isUserAssigned('tender-001', 'user-001', 'technical')
      ).rejects.toThrow();
    });
  });

  describe('getAvailableEvaluators', () => {
    it('should return list of active evaluators', async () => {
      const mockDatabase = require('../../config/database');

      const mockEvaluators = [
        {
          id: 'user-eval-1',
          name: 'John Evaluator',
          email: 'john@example.com',
          roles: ['evaluator'],
        },
        {
          id: 'user-eval-2',
          name: 'Jane Evaluator',
          email: 'jane@example.com',
          roles: ['evaluator', 'buyer'],
        },
      ];

      mockDatabase.query.mockResolvedValueOnce({ rows: mockEvaluators });

      const result = await CommitteeService.getAvailableEvaluators();

      expect(result).toEqual(mockEvaluators);
      expect(result).toHaveLength(2);
    });

    it('should return empty array if no evaluators available', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.query.mockResolvedValueOnce({ rows: [] });

      const result = await CommitteeService.getAvailableEvaluators();

      expect(result).toEqual([]);
    });

    it('should throw error if query fails', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(CommitteeService.getAvailableEvaluators()).rejects.toThrow();
    });
  });

  describe('getStats', () => {
    it('should return committee statistics by tier', async () => {
      const mockDatabase = require('../../config/database');
      const tenderId = 'tender-001';

      const mockStats = [
        {
          tier: 'technical',
          total: 3,
          pending: 1,
          approved: 2,
          forwarded: 0,
        },
        {
          tier: 'commercial',
          total: 2,
          pending: 0,
          approved: 1,
          forwarded: 1,
        },
      ];

      mockDatabase.query.mockResolvedValueOnce({ rows: mockStats });

      const result = await CommitteeService.getStats(tenderId);

      expect(result).toEqual(mockStats);
      expect(result).toHaveLength(2);
      expect(result[0].tier).toBe('technical');
      expect(result[0].total).toBe(3);
      expect(result[0].approved).toBe(2);
    });

    it('should return empty array if no committee for tender', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.query.mockResolvedValueOnce({ rows: [] });

      const result = await CommitteeService.getStats('tender-999');

      expect(result).toEqual([]);
    });

    it('should throw error if query fails', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(CommitteeService.getStats('tender-001')).rejects.toThrow();
    });
  });
});
