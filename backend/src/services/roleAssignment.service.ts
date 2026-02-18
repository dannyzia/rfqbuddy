import pool from '../config/database';
import logger from '../config/logger';
import { TenderRoleAssignment, WorkflowLog } from '../types/workflow.types';

export class RoleAssignmentService {
  
  /**
   * Assign a role to a user for a specific tender
   */
  static async assignRole(
    tenderId: string,
    roleType: 'procurer' | 'prequal_evaluator' | 'tech_evaluator' | 'commercial_evaluator' | 'auditor' | 'procurement_head',
    assignedUserId: string,
    assignedBy: string,
    isSelf: boolean = false,
    notes?: string
  ): Promise<TenderRoleAssignment> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check if role is already assigned
      const existingResult = await client.query(`
        SELECT id FROM tender_role_assignments 
        WHERE tender_id = $1 AND role_type = $2
      `, [tenderId, roleType]);
      
      if (existingResult.rows.length > 0) {
        // Update existing assignment
        const updateResult = await client.query(`
          UPDATE tender_role_assignments 
          SET assigned_user_id = $3, assigned_by = $4, is_self = $5, notes = $6, 
              status = 'pending', assigned_at = NOW(), updated_at = NOW()
          WHERE tender_id = $1 AND role_type = $2
          RETURNING *
        `, [tenderId, roleType, assignedUserId, assignedBy, isSelf, notes]);
        
        const assignment = updateResult.rows[0];
        
        // Log the reassignment
        await this.logWorkflowAction(client, tenderId, null, roleType, assignedBy, 'reassigned', notes);
        
        await client.query('COMMIT');
        return assignment;
      } else {
        // Create new assignment
        const insertResult = await client.query(`
          INSERT INTO tender_role_assignments 
          (tender_id, role_type, assigned_user_id, assigned_by, is_self, notes)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `, [tenderId, roleType, assignedUserId, assignedBy, isSelf, notes]);
        
        const assignment = insertResult.rows[0];
        
        // Log the initial assignment
        await this.logWorkflowAction(client, tenderId, null, roleType, assignedBy, 'assigned', notes);
        
        await client.query('COMMIT');
        return assignment;
      }
      
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Failed to assign role', { error, tenderId, roleType, assignedUserId });
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get all role assignments for a tender
   */
  static async getTenderRoleAssignments(tenderId: string): Promise<TenderRoleAssignment[]> {
    try {
      const { rows } = await pool.query(`
        SELECT tra.*, u.name as assigned_user_name, u.email as assigned_user_email
        FROM tender_role_assignments tra
        JOIN users u ON tra.assigned_user_id = u.id
        WHERE tra.tender_id = $1
        ORDER BY tra.created_at
      `, [tenderId]);
      
      return rows;
    } catch (error) {
      logger.error('Failed to get tender role assignments', { error, tenderId });
      throw error;
    }
  }

  /**
   * Get role assignments for a user
   */
  static async getUserRoleAssignments(userId: string): Promise<TenderRoleAssignment[]> {
    try {
      const { rows } = await pool.query(`
        SELECT tra.*, t.title as tender_title, t.tender_number
        FROM tender_role_assignments tra
        JOIN tenders t ON tra.tender_id = t.id
        WHERE tra.assigned_user_id = $1
        ORDER BY tra.created_at DESC
      `, [userId]);
      
      return rows;
    } catch (error) {
      logger.error('Failed to get user role assignments', { error, userId });
      throw error;
    }
  }

  /**
   * Activate a role assignment
   */
  static async activateRoleAssignment(assignmentId: string, userId: string): Promise<TenderRoleAssignment> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get assignment details
      const { rows } = await client.query(`
        SELECT * FROM tender_role_assignments 
        WHERE id = $1 AND assigned_user_id = $2
      `, [assignmentId, userId]);
      
      if (rows.length === 0) {
        throw new Error('Assignment not found or unauthorized');
      }
      
      const assignment = rows[0];
      
      // Update assignment status
      const updateResult = await client.query(`
        UPDATE tender_role_assignments 
        SET status = 'active', activated_at = NOW()
        WHERE id = $1
        RETURNING *
      `, [assignmentId]);
      
      const updatedAssignment = updateResult.rows[0];
      
      // Update tender current workflow role
      await client.query(`
        UPDATE tenders 
        SET current_workflow_role = $1, workflow_status = 'active'
        WHERE id = $2
      `, [assignment.role_type, assignment.tender_id]);
      
      // Log the activation
      await this.logWorkflowAction(client, assignment.tender_id, null, assignment.role_type, userId, 'activated');
      
      await client.query('COMMIT');
      return updatedAssignment;
      
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Failed to activate role assignment', { error, assignmentId, userId });
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Complete a role assignment
   */
  static async completeRoleAssignment(assignmentId: string, userId: string, notes?: string): Promise<TenderRoleAssignment> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get assignment details
      const { rows } = await client.query(`
        SELECT * FROM tender_role_assignments 
        WHERE id = $1 AND assigned_user_id = $2
      `, [assignmentId, userId]);
      
      if (rows.length === 0) {
        throw new Error('Assignment not found or unauthorized');
      }
      
      const assignment = rows[0];
      
      // Update assignment status
      const updateResult = await client.query(`
        UPDATE tender_role_assignments 
        SET status = 'completed', completed_at = NOW(), notes = COALESCE($3, notes)
        WHERE id = $1
        RETURNING *
      `, [assignmentId, notes]);
      
      const updatedAssignment = updateResult.rows[0];
      
      // Log the completion
      await this.logWorkflowAction(client, assignment.tender_id, assignment.role_type, null, userId, 'completed', notes);
      
      await client.query('COMMIT');
      return updatedAssignment;
      
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Failed to complete role assignment', { error, assignmentId, userId });
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Forward assignment to next role
   */
  static async forwardAssignment(
    assignmentId: string, 
    userId: string, 
    toRole: string,
    notes?: string
  ): Promise<TenderRoleAssignment> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get current assignment
      const { rows } = await client.query(`
        SELECT * FROM tender_role_assignments 
        WHERE id = $1 AND assigned_user_id = $2
      `, [assignmentId, userId]);
      
      if (rows.length === 0) {
        throw new Error('Assignment not found or unauthorized');
      }
      
      const currentAssignment = rows[0];
      
      // Update current assignment status
      await client.query(`
        UPDATE tender_role_assignments 
        SET status = 'forwarded', forwarded_at = NOW()
        WHERE id = $1
      `, [assignmentId]);
      
      // Update tender current workflow role
      await client.query(`
        UPDATE tenders 
        SET current_workflow_role = $1
        WHERE id = $2
      `, [toRole, currentAssignment.tender_id]);
      
      // Log the forward action
      await this.logWorkflowAction(client, currentAssignment.tender_id, currentAssignment.role_type, toRole, userId, 'forwarded', notes);
      
      await client.query('COMMIT');
      
      // Return the updated assignment
      const { rows: updatedRows } = await client.query(`
        SELECT * FROM tender_role_assignments WHERE id = $1
      `, [assignmentId]);
      
      return updatedRows[0];
      
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Failed to forward assignment', { error, assignmentId, userId });
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Skip a role assignment
   */
  static async skipRoleAssignment(assignmentId: string, userId: string, notes?: string): Promise<TenderRoleAssignment> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get assignment details
      const { rows } = await client.query(`
        SELECT * FROM tender_role_assignments 
        WHERE id = $1 AND assigned_user_id = $2
      `, [assignmentId, userId]);
      
      if (rows.length === 0) {
        throw new Error('Assignment not found or unauthorized');
      }
      
      const assignment = rows[0];
      
      // Update assignment status
      const updateResult = await client.query(`
        UPDATE tender_role_assignments 
        SET status = 'skipped', notes = COALESCE($3, notes)
        WHERE id = $1
        RETURNING *
      `, [assignmentId, notes]);
      
      const updatedAssignment = updateResult.rows[0];
      
      // Log the skip action
      await this.logWorkflowAction(client, assignment.tender_id, assignment.role_type, null, userId, 'skipped', notes);
      
      await client.query('COMMIT');
      return updatedAssignment;
      
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Failed to skip role assignment', { error, assignmentId, userId });
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get workflow log for a tender
   */
  static async getWorkflowLog(tenderId: string): Promise<WorkflowLog[]> {
    try {
      const { rows } = await pool.query(`
        SELECT twl.*, u.name as actor_name, u.email as actor_email
        FROM tender_workflow_log twl
        JOIN users u ON twl.actor_id = u.id
        WHERE twl.tender_id = $1
        ORDER BY twl.created_at DESC
      `, [tenderId]);
      
      return rows;
    } catch (error) {
      logger.error('Failed to get workflow log', { error, tenderId });
      throw error;
    }
  }

  /**
   * Log workflow action
   */
  private static async logWorkflowAction(
    client: any,
    tenderId: string,
    fromRole: string | null,
    toRole: string | null,
    actorId: string,
    action: string,
    notes?: string
  ): Promise<void> {
    try {
      await client.query(`
        INSERT INTO tender_workflow_log 
        (tender_id, from_role, to_role, actor_id, action, notes)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [tenderId, fromRole, toRole, actorId, action, notes]);
    } catch (error) {
      logger.error('Failed to log workflow action', { error, tenderId, action });
      throw error;
    }
  }

  /**
   * Check if user can perform action on tender
   */
  static async canUserActOnTender(tenderId: string, userId: string, action: string): Promise<boolean> {
    try {
      const { rows } = await pool.query(`
        SELECT tra.*, t.current_workflow_role
        FROM tender_role_assignments tra
        JOIN tenders t ON tra.tender_id = t.id
        WHERE tra.tender_id = $1 AND tra.assigned_user_id = $2
      `, [tenderId, userId]);
      
      if (rows.length === 0) {
        return false;
      }
      
      const assignment = rows[0];
      
      switch (action) {
        case 'activate':
          return assignment.status === 'pending';
        case 'complete':
          return assignment.status === 'active';
        case 'forward':
          return assignment.status === 'active' || assignment.status === 'completed';
        case 'skip':
          return assignment.status === 'pending' || assignment.status === 'active';
        default:
          return false;
      }
      
    } catch (error) {
      logger.error('Failed to check user action permission', { error, tenderId, userId, action });
      throw error;
    }
  }
}
