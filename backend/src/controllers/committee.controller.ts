import { Request, Response, NextFunction } from 'express';
import { CommitteeService } from '../services/committee.service';
import { CommitteeAssignment, CommitteeUpdateInput } from '../types/committee.types';

export const committeeController = {
  // Assign evaluators to a tender tier
  async assign(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { tenderId } = req.params;
      const { userIds, tier } = req.body as { userIds: string[]; tier: 'pre_qualification' | 'technical' | 'commercial' };
      const user = req.user as { id: string; roles: string[] };

      // Validate that user has permission (admin or buyer)
      if (!user.roles.includes('admin') && !user.roles.includes('buyer')) {
        return res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: 'Only admins and buyers can assign evaluators',
          },
        });
      }

      const assignments = await CommitteeService.assign(
        tenderId,
        userIds,
        tier,
        user.id
      );

      res.status(201).json({
        message: 'Evaluators assigned successfully',
        data: assignments,
      });
    } catch (error) {
      next(error);
    }
  },

  // Remove evaluator from tender tier
  async remove(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { tenderId } = req.params;
      const { userId, tier } = req.body;
      const user = req.user as { id: string; roles: string[] };

      // Validate that user has permission (admin or buyer)
      if (!user.roles.includes('admin') && !user.roles.includes('buyer')) {
        return res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: 'Only admins and buyers can remove evaluators',
          },
        });
      }

      await CommitteeService.remove(tenderId, userId, tier);

      res.status(200).json({
        message: 'Evaluator removed successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all committee assignments for a tender
  async getByTender(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { tenderId } = req.params;
      const user = req.user as { id: string; roles: string[] };

      // Validate that user has permission to view this tender's committee
      // Admins, buyers, and assigned evaluators can view
      const isAssigned = await CommitteeService.isUserAssigned(tenderId, user.id, 'pre_qualification') ||
                         await CommitteeService.isUserAssigned(tenderId, user.id, 'technical') ||
                         await CommitteeService.isUserAssigned(tenderId, user.id, 'commercial');

      if (
        !user.roles.includes('admin') &&
        !user.roles.includes('buyer') &&
        !isAssigned
      ) {
        return res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: 'You are not authorized to view this committee',
          },
        });
      }

      const assignments = await CommitteeService.getByTender(tenderId);

      res.status(200).json({
        data: assignments,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get committee assignments for current evaluator
  async getMyAssignments(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const user = req.user as { id: string; roles: string[] };

      // Validate that user is an evaluator
      if (!user.roles.includes('evaluator')) {
        return res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: 'Only evaluators can view their assignments',
          },
        });
      }

      const assignments = await CommitteeService.getByEvaluator(user.id);

      res.status(200).json({
        data: assignments,
      });
    } catch (error) {
      next(error);
    }
  },

  // Update assignment status (approve/forward)
  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;
      const { status } = req.body as CommitteeUpdateInput;
      const user = req.user as { id: string; };

      // Validate that user is the assigned evaluator
      const assignments = await CommitteeService.getByEvaluator(user.id);
      const assignment = assignments.find((a: CommitteeAssignment) => a.id === id);

      if (!assignment) {
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: 'Assignment not found',
          },
        });
      }

      const updatedAssignment = await CommitteeService.updateStatus(
        id,
        status,
        user.id
      );

      res.status(200).json({
        message: 'Assignment status updated successfully',
        data: updatedAssignment,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get available evaluators
  async getAvailableEvaluators(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const user = req.user as { id: string; roles: string[] };

      // Validate that user has permission (admin or buyer)
      if (!user.roles.includes('admin') && !user.roles.includes('buyer')) {
        return res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: 'Only admins and buyers can view available evaluators',
          },
        });
      }

      const evaluators = await CommitteeService.getAvailableEvaluators();

      res.status(200).json({
        data: evaluators,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get committee statistics for a tender
  async getStats(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { tenderId } = req.params;
      const user = req.user as { id: string; roles: string[] };

      // Validate that user has permission to view this tender's stats
      const isAssigned = await CommitteeService.isUserAssigned(tenderId, user.id, 'pre_qualification') ||
                         await CommitteeService.isUserAssigned(tenderId, user.id, 'technical') ||
                         await CommitteeService.isUserAssigned(tenderId, user.id, 'commercial');

      if (
        !user.roles.includes('admin') &&
        !user.roles.includes('buyer') &&
        !isAssigned
      ) {
        return res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: 'You are not authorized to view this committee stats',
          },
        });
      }

      const stats = await CommitteeService.getStats(tenderId);

      res.status(200).json({
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  },
};
