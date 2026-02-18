import { Request, Response, NextFunction } from 'express';
import { RoleAssignmentService } from '../services/roleAssignment.service';
import { RoleAssignmentInput } from '../types/workflow.types';

export const workflowController = {
  
  // Assign role to user for tender
  async assignRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as any;
      const { tenderId, roleType, assignedUserId, isSelf, notes } = req.body as RoleAssignmentInput;
      
      if (!tenderId || !roleType || !assignedUserId) {
        res.status(400).json({
          error: {
            code: 'INVALID_INPUT',
            message: 'Tender ID, role type, and assigned user ID are required',
          },
        });
        return;
      }
      
      const assignment = await RoleAssignmentService.assignRole(
        tenderId,
        roleType,
        assignedUserId,
        user.id,
        isSelf || false,
        notes
      );
      
      res.status(201).json({
        message: 'Role assigned successfully',
        data: assignment,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all role assignments for a tender
  async getTenderRoleAssignments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenderId } = req.params;
      
      if (!tenderId) {
        res.status(400).json({
          error: {
            code: 'INVALID_INPUT',
            message: 'Tender ID is required',
          },
        });
        return;
      }
      
      const assignments = await RoleAssignmentService.getTenderRoleAssignments(tenderId);
      
      res.status(200).json({
        data: assignments,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get role assignments for current user
  async getMyRoleAssignments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as any;
      
      const assignments = await RoleAssignmentService.getUserRoleAssignments(user.id);
      
      res.status(200).json({
        data: assignments,
      });
    } catch (error) {
      next(error);
    }
  },

  // Activate role assignment
  async activateRoleAssignment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as any;
      const { assignmentId } = req.params;
      
      if (!assignmentId) {
        res.status(400).json({
          error: {
            code: 'INVALID_INPUT',
            message: 'Assignment ID is required',
          },
        });
        return;
      }
      
      const assignment = await RoleAssignmentService.activateRoleAssignment(assignmentId, user.id);
      
      res.status(200).json({
        message: 'Role assignment activated successfully',
        data: assignment,
      });
    } catch (error) {
      next(error);
    }
  },

  // Complete role assignment
  async completeRoleAssignment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as any;
      const { assignmentId } = req.params;
      const { notes } = req.body;
      
      if (!assignmentId) {
        res.status(400).json({
          error: {
            code: 'INVALID_INPUT',
            message: 'Assignment ID is required',
          },
        });
        return;
      }
      
      const assignment = await RoleAssignmentService.completeRoleAssignment(assignmentId, user.id, notes);
      
      res.status(200).json({
        message: 'Role assignment completed successfully',
        data: assignment,
      });
    } catch (error) {
      next(error);
    }
  },

  // Forward assignment to next role
  async forwardAssignment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as any;
      const { assignmentId } = req.params;
      const { toRole, notes } = req.body;
      
      if (!assignmentId || !toRole) {
        res.status(400).json({
          error: {
            code: 'INVALID_INPUT',
            message: 'Assignment ID and target role are required',
          },
        });
        return;
      }
      
      const assignment = await RoleAssignmentService.forwardAssignment(assignmentId, user.id, toRole, notes);
      
      res.status(200).json({
        message: 'Assignment forwarded successfully',
        data: assignment,
      });
    } catch (error) {
      next(error);
    }
  },

  // Skip role assignment
  async skipRoleAssignment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as any;
      const { assignmentId } = req.params;
      const { notes } = req.body;
      
      if (!assignmentId) {
        res.status(400).json({
          error: {
            code: 'INVALID_INPUT',
            message: 'Assignment ID is required',
          },
        });
        return;
      }
      
      const assignment = await RoleAssignmentService.skipRoleAssignment(assignmentId, user.id, notes);
      
      res.status(200).json({
        message: 'Role assignment skipped successfully',
        data: assignment,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get workflow log for tender
  async getWorkflowLog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenderId } = req.params;
      
      if (!tenderId) {
        res.status(400).json({
          error: {
            code: 'INVALID_INPUT',
            message: 'Tender ID is required',
          },
        });
        return;
      }
      
      const workflowLog = await RoleAssignmentService.getWorkflowLog(tenderId);
      
      res.status(200).json({
        data: workflowLog,
      });
    } catch (error) {
      next(error);
    }
  },

  // Check if user can perform action on tender
  async checkActionPermission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as any;
      const { tenderId, action } = req.query;
      
      if (!tenderId || !action) {
        res.status(400).json({
          error: {
            code: 'INVALID_INPUT',
            message: 'Tender ID and action are required',
          },
        });
        return;
      }
      
      const canAct = await RoleAssignmentService.canUserActOnTender(
        tenderId as string,
        user.id,
        action as string
      );
      
      res.status(200).json({
        data: {
          canAct,
          tenderId,
          action,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Bulk assign roles for a tender
  async bulkAssignRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as any;
      const { tenderId, assignments } = req.body;
      
      if (!tenderId || !assignments || !Array.isArray(assignments)) {
        res.status(400).json({
          error: {
            code: 'INVALID_INPUT',
            message: 'Tender ID and assignments array are required',
          },
        });
        return;
      }
      
      const results = [];
      
      for (const assignment of assignments) {
        try {
          const result = await RoleAssignmentService.assignRole(
            tenderId,
            assignment.roleType,
            assignment.assignedUserId,
            user.id,
            assignment.isSelf || false,
            assignment.notes
          );
          results.push({ success: true, assignment: result });
        } catch (error) {
          results.push({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error',
            assignment: assignment 
          });
        }
      }
      
      res.status(201).json({
        message: 'Bulk role assignments completed',
        data: results,
      });
    } catch (error) {
      next(error);
    }
  },
};
