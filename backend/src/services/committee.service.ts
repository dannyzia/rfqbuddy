import db from '../config/database';
import logger from '../config/logger';
import { CommitteeAssignment } from '../types/committee.types';

export class CommitteeService {
  // Add one or more evaluators to a tender tier
  static async assign(
    tenderId: string,
    userIds: string[],
    tier: 'pre_qualification' | 'technical' | 'commercial',
    assignedBy: string
  ): Promise<CommitteeAssignment[]> {
    const assignments = [];
    
    for (const userId of userIds) {
      try {
        const result = await db.query(
          `INSERT INTO tender_evaluation_committees 
           (tender_id, user_id, tier, assigned_by) 
           VALUES ($1, $2, $3, $4) 
           ON CONFLICT (tender_id, user_id, tier) 
           DO UPDATE SET status = 'pending', assigned_at = NOW()
           RETURNING *`,
          [tenderId, userId, tier, assignedBy]
        );
        
        assignments.push(result.rows[0]);
        logger.info('Evaluator assigned to committee', { tenderId, userId, tier, assignedBy });
      } catch (error) {
        logger.error('Failed to assign evaluator', { error, tenderId, userId, tier });
        throw error;
      }
    }
    
    return assignments;
  }

  // Remove evaluator from tender tier
  static async remove(tenderId: string, userId: string, tier: string): Promise<void> {
    try {
      await db.query(
        `DELETE FROM tender_evaluation_committees 
         WHERE tender_id = $1 AND user_id = $2 AND tier = $3`,
        [tenderId, userId, tier]
      );
      
      logger.info('Evaluator removed from committee', { tenderId, userId, tier });
    } catch (error) {
      logger.error('Failed to remove evaluator', { error, tenderId, userId, tier });
      throw error;
    }
  }

  // Get all committee assignments for a tender
  static async getByTender(tenderId: string): Promise<CommitteeAssignment[]> {
    try {
      const result = await db.query(
        `SELECT tec.*, u.name, u.email, u.roles
         FROM tender_evaluation_committees tec
         JOIN users u ON tec.user_id = u.id
         WHERE tec.tender_id = $1
         ORDER BY tec.tier, tec.assigned_at`,
        [tenderId]
      );
      
      return result.rows;
    } catch (error) {
      logger.error('Failed to get committee assignments', { error, tenderId });
      throw error;
    }
  }

  // Get committee assignments for a specific evaluator
  static async getByEvaluator(userId: string): Promise<CommitteeAssignment[]> {
    try {
      const result = await db.query(
        `SELECT tec.*, t.title as tender_title, t.tender_number
         FROM tender_evaluation_committees tec
         JOIN tenders t ON tec.tender_id = t.id
         WHERE tec.user_id = $1
         ORDER BY tec.assigned_at DESC`,
        [userId]
      );
      
      return result.rows;
    } catch (error) {
      logger.error('Failed to get evaluator assignments', { error, userId });
      throw error;
    }
  }

  // Update assignment status
  static async updateStatus(
    id: string,
    status: 'pending' | 'approved' | 'forwarded',
    userId: string
  ): Promise<CommitteeAssignment> {
    try {
      // Whitelist validation for status values
      const allowedStatuses = ['pending', 'approved', 'forwarded'];
      if (!allowedStatuses.includes(status)) {
        throw new Error('Invalid status value');
      }
      
      const result = await db.query(
        `UPDATE tender_evaluation_committees
         SET status = $2, updated_at = NOW(),
             completed_at = CASE WHEN $2 = 'approved' THEN NOW() ELSE completed_at END,
             forwarded_at = CASE WHEN $2 = 'forwarded' THEN NOW() ELSE forwarded_at END
         WHERE id = $1 AND user_id = $3
         RETURNING *`,
        [id, status, userId]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Assignment not found or unauthorized');
      }
      
      logger.info('Committee assignment status updated', { id, status, userId });
      return result.rows[0];
    } catch (error) {
      logger.error('Failed to update assignment status', { error, id, status, userId });
      throw error;
    }
  }

  // Check if user is assigned to tender tier
  static async isUserAssigned(
    tenderId: string,
    userId: string,
    tier: string
  ): Promise<boolean> {
    try {
      const result = await db.query(
        `SELECT id FROM tender_evaluation_committees 
         WHERE tender_id = $1 AND user_id = $2 AND tier = $3`,
        [tenderId, userId, tier]
      );
      
      return result.rows.length > 0;
    } catch (error) {
      logger.error('Failed to check assignment', { error, tenderId, userId, tier });
      throw error;
    }
  }

  // Get available evaluators (users with evaluator role)
  static async getAvailableEvaluators(): Promise<any[]> {
    try {
      const result = await db.query(
        `SELECT id, name, email, roles 
         FROM users 
         WHERE $1 = ANY(roles) AND is_active = true
         ORDER BY name`,
        ['evaluator']
      );
      
      return result.rows;
    } catch (error) {
      logger.error('Failed to get available evaluators', { error });
      throw error;
    }
  }

  // Get committee statistics for a tender
  static async getStats(tenderId: string): Promise<any> {
    try {
      const result = await db.query(
        `SELECT 
           tier,
           COUNT(*) as total,
           COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
           COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
           COUNT(CASE WHEN status = 'forwarded' THEN 1 END) as forwarded
         FROM tender_evaluation_committees 
         WHERE tender_id = $1
         GROUP BY tier
         ORDER BY tier`,
        [tenderId]
      );
      
      return result.rows;
    } catch (error) {
      logger.error('Failed to get committee stats', { error, tenderId });
      throw error;
    }
  }
}
