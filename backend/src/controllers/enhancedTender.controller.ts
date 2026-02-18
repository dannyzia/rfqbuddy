import { Request, Response, NextFunction } from 'express';
import { TenderCreationService } from '../services/tenderCreation.service';

export const enhancedTenderController = {
  
  // Create tender with workflow and quota validation
  async createTenderWithWorkflow(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as any;
      const tenderData = req.body;
      
      // Validate required fields
      if (!tenderData.title || !tenderData.tender_type || !tenderData.procurement_type) {
        res.status(400).json({
          error: {
            code: 'INVALID_INPUT',
            message: 'Title, tender type, and procurement type are required',
          },
        });
        return;
      }
      
      // Generate tender number if not provided
      if (!tenderData.tender_number) {
        // For now, use a simple format. This should be enhanced later
        tenderData.tender_number = `TRF-${Date.now()}`;
      }
      
      // Create tender with workflow
      const tender = await TenderCreationService.createTenderWithWorkflow(
        tenderData,
        user.id,
        user.organizationId
      );
      
      res.status(201).json({
        message: 'Tender created successfully with workflow',
        data: tender,
      });
    } catch (error) {
      next(error);
    }
  },

  // Validate tender creation before actual creation
  async validateTenderCreation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as any;
      const { tenderType, isLiveTendering } = req.query;
      
      if (!tenderType) {
        res.status(400).json({
          error: {
            code: 'INVALID_INPUT',
            message: 'Tender type is required',
          },
        });
        return;
      }
      
      const validation = await TenderCreationService.validateTenderCreation(
        user.organizationId,
        tenderType as 'simple_rfq' | 'detailed_tender',
        isLiveTendering === 'true'
      );
      
      res.status(200).json({
        data: validation,
      });
    } catch (error) {
      next(error);
    }
  },

  // Publish tender with workflow validation
  async publishTender(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Note: user is not used in this implementation yet
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
      
      // Check if tender can be published
      const publishCheck = await TenderCreationService.canPublishTender(tenderId);
      
      if (!publishCheck.canPublish) {
        res.status(400).json({
          error: {
            code: 'CANNOT_PUBLISH',
            message: publishCheck.reason,
          },
        });
        return;
      }
      
      // Update tender status to published and workflow to active
      await TenderCreationService.updateWorkflowStatus(tenderId, 'active', 'procurer');
      
      // Update tender published_at
      // For now, just update workflow status. This should be enhanced later
      // await TenderService.updateTenderStatus(tenderId, 'published');
      
      res.status(200).json({
        message: 'Tender published successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  // Get tender workflow status
  async getWorkflowStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
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
      
      const workflowStatus = await TenderCreationService.getWorkflowStatus(tenderId);
      
      if (!workflowStatus) {
        res.status(404).json({
          error: {
            code: 'TENDER_NOT_FOUND',
            message: 'Tender not found',
          },
        });
        return;
      }
      
      res.status(200).json({
        data: workflowStatus,
      });
    } catch (error) {
      next(error);
    }
  },

  // Update tender workflow status
  async updateWorkflowStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Note: user is not used in this implementation yet
      const { tenderId } = req.params;
      const { status, currentRole } = req.body;
      
      if (!tenderId || !status) {
        res.status(400).json({
          error: {
            code: 'INVALID_INPUT',
            message: 'Tender ID and status are required',
          },
        });
        return;
      }
      
      // Validate status
      const validStatuses = ['draft', 'active', 'completed', 'cancelled', 'awarded'];
      if (!validStatuses.includes(status)) {
        res.status(400).json({
          error: {
            code: 'INVALID_STATUS',
            message: 'Invalid workflow status',
          },
        });
        return;
      }
      
      await TenderCreationService.updateWorkflowStatus(
        tenderId,
        status,
        currentRole
      );
      
      res.status(200).json({
        message: 'Workflow status updated successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  // Create live tendering session
  async createLiveSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as any;
      const { tenderId } = req.params;
      const { scheduledAt: _scheduledAt, duration: _duration } = req.body;
      // Note: scheduledAt and duration are not used in this implementation yet
      
      if (!tenderId) {
        res.status(400).json({
          error: {
            code: 'INVALID_INPUT',
            message: 'Tender ID is required',
          },
        });
        return;
      }
      
      // Check if live tendering is enabled for organization
      const validation = await TenderCreationService.validateTenderCreation(
        user.organizationId,
        'detailed_tender',
        true
      );
      
      if (!validation.canCreate) {
        res.status(403).json({
          error: {
            code: 'LIVE_TENDERING_DISABLED',
            message: validation.reason,
          },
        });
        return;
      }
      
      // Create live session
      await TenderCreationService.createLiveSession(tenderId, user.id);
      
      res.status(201).json({
        message: 'Live session created successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  // Get tender creation statistics for organization
  async getCreationStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Note: user is not used in this implementation yet
      const { period = 'month' } = req.query;
      
      // This would integrate with existing tender service to get statistics
      // For now, return basic info
      const stats = {
        period,
        totalCreated: 0,
        simpleRfqCreated: 0,
        detailedTenderCreated: 0,
        liveTenderingCreated: 0,
        quotaUsed: 0,
        quotaRemaining: 0,
      };
      
      res.status(200).json({
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get tender type definitions with workflow configuration
  async getTenderTypeDefinitions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Note: user is not used in this implementation yet
      const { includeInactive = false } = req.query;
      
      // Get tender type definitions
      const { rows } = await (await import('../config/database')).pool.query(`
        SELECT * FROM tender_type_definitions 
        WHERE is_active = $1 OR $2 = true
        ORDER BY sort_order ASC
      `, [true, includeInactive === 'true']);
      
      res.status(200).json({
        data: rows,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get available workflow roles for organization
  async getAvailableWorkflowRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as any;
      
      // Get available users with workflow roles
      const { rows } = await (await import('../config/database')).pool.query(`
        SELECT id, name, email, roles 
        FROM users 
        WHERE organization_id = $1 
        AND ($2 = ANY(roles) OR $3 = ANY(roles) OR $4 = ANY(roles) OR $5 = ANY(roles) OR $6 = ANY(roles))
        AND is_active = true
        ORDER BY name
      `, [
        user.organizationId, 
        'prequal_evaluator', 
        'tech_evaluator', 
        'commercial_evaluator', 
        'auditor', 
        'procurement_head'
      ]);
      
      // Group by role type
      const rolesByType = {
        prequal_evaluator: rows.filter(u => u.roles.includes('prequal_evaluator')),
        tech_evaluator: rows.filter(u => u.roles.includes('tech_evaluator')),
        commercial_evaluator: rows.filter(u => u.roles.includes('commercial_evaluator')),
        auditor: rows.filter(u => u.roles.includes('auditor')),
        procurement_head: rows.filter(u => u.roles.includes('procurement_head')),
      };
      
      res.status(200).json({
        data: rolesByType,
      });
    } catch (error) {
      next(error);
    }
  },
};
