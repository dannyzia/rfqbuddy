import pool from '../config/database';
import logger from '../config/logger';
import { SubscriptionPackage, OrganizationSubscription } from '../types/subscription.types';

export class SubscriptionService {
  
  /**
   * Get all available subscription packages
   */
  static async getAvailablePackages(): Promise<SubscriptionPackage[]> {
    try {
      const { rows } = await pool.query(`
        SELECT * FROM subscription_packages 
        WHERE is_active = true 
        ORDER BY sort_order ASC
      `);
      return rows;
    } catch (error) {
      logger.error('Failed to get subscription packages', { error });
      throw error;
    }
  }

  /**
   * Get subscription details for an organization
   */
  static async getOrganizationSubscription(organizationId: string): Promise<OrganizationSubscription | null> {
    try {
      const { rows } = await pool.query(`
        SELECT os.*, sp.name as package_name, sp.code as package_code,
               sp.weekly_simple_rfq_limit, sp.weekly_detailed_tender_limit,
               sp.storage_limit_bytes, sp.live_tendering_enabled,
               CASE 
                 WHEN os.expires_at IS NULL THEN 'perpetual'
                 WHEN os.expires_at < NOW() THEN 'expired'
                 ELSE 'active'
               END as status
        FROM organization_subscriptions os
        JOIN subscription_packages sp ON os.package_id = sp.id
        WHERE os.organization_id = $1 AND os.status = 'active'
      `, [organizationId]);
      
      return rows[0] || null;
    } catch (error) {
      logger.error('Failed to get organization subscription', { error, organizationId });
      throw error;
    }
  }

  /**
   * Create or update organization subscription
   */
  static async createOrUpdateSubscription(
    organizationId: string,
    packageId: string,
    customStorageBytes?: number,
    expiresAt?: Date
  ): Promise<OrganizationSubscription> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check if subscription already exists
      const existingResult = await client.query(
        'SELECT id FROM organization_subscriptions WHERE organization_id = $1',
        [organizationId]
      );
      
      let subscription: OrganizationSubscription;
      
      if (existingResult.rows.length > 0) {
        // Update existing subscription
        const updateResult = await client.query(`
          UPDATE organization_subscriptions 
          SET package_id = $2, 
              custom_storage_bytes = COALESCE($3, custom_storage_bytes),
              expires_at = $4,
              updated_at = NOW()
          WHERE organization_id = $1
          RETURNING *
        `, [organizationId, packageId, customStorageBytes, expiresAt]);
        
        subscription = updateResult.rows[0];
      } else {
        // Create new subscription
        const insertResult = await client.query(`
          INSERT INTO organization_subscriptions 
          (organization_id, package_id, custom_storage_bytes, expires_at, created_by)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `, [organizationId, packageId, customStorageBytes, expiresAt, 'system']);
        
        subscription = insertResult.rows[0];
      }
      
      await client.query('COMMIT');
      return subscription;
      
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Failed to create/update subscription', { error, organizationId });
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Cancel organization subscription
   */
  static async cancelSubscription(organizationId: string): Promise<void> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      await client.query(`
        UPDATE organization_subscriptions 
        SET status = 'cancelled', updated_at = NOW()
        WHERE organization_id = $1
      `, [organizationId]);
      
      await client.query('COMMIT');
      logger.info('Subscription cancelled', { organizationId });
      
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Failed to cancel subscription', { error, organizationId });
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Check if organization can create a tender based on quota
   */
  static async checkTenderQuota(organizationId: string, tenderType: 'simple_rfq' | 'detailed_tender'): Promise<boolean> {
    try {
      const subscription = await SubscriptionService.getOrganizationSubscription(organizationId);
      
      if (!subscription) {
        return false; // No active subscription
      }
      
      const weekStart = SubscriptionService.getWeekStart();
      
      const { rows } = await pool.query(`
        SELECT simple_rfq_count, detailed_tender_count
        FROM tender_quota_usage
        WHERE organization_id = $1 AND week_start = $2
      `, [organizationId, weekStart]);
      
      const usage = rows[0] || { simple_rfq_count: 0, detailed_tender_count: 0 };
      const packageInfo = await SubscriptionService.getPackageInfo(subscription.package_id);
      
      if (tenderType === 'simple_rfq') {
        return packageInfo.weekly_simple_rfq_limit === null || 
               usage.simple_rfq_count < packageInfo.weekly_simple_rfq_limit;
      } else {
        return packageInfo.weekly_detailed_tender_limit === null || 
               usage.detailed_tender_count < packageInfo.weekly_detailed_tender_limit;
      }
      
    } catch (error) {
      logger.error('Failed to check tender quota', { error, organizationId, tenderType });
      throw error;
    }
  }

  /**
   * Increment tender quota usage
   */
  static async incrementTenderUsage(organizationId: string, tenderType: 'simple_rfq' | 'detailed_tender'): Promise<void> {
    const weekStart = SubscriptionService.getWeekStart();
    
    try {
      await pool.query(`
        INSERT INTO tender_quota_usage (organization_id, week_start, simple_rfq_count, detailed_tender_count, updated_at)
        VALUES ($1, $2,
          CASE WHEN $3 = 'simple_rfq' THEN 1 ELSE 0 END,
          CASE WHEN $3 = 'detailed_tender' THEN 1 ELSE 0 END,
          NOW())
        ON CONFLICT (organization_id, week_start)
        DO UPDATE SET
          simple_rfq_count = CASE WHEN $3 = 'simple_rfq' THEN tender_quota_usage.simple_rfq_count + 1 ELSE tender_quota_usage.simple_rfq_count END,
          detailed_tender_count = CASE WHEN $3 = 'detailed_tender' THEN tender_quota_usage.detailed_tender_count + 1 ELSE tender_quota_usage.detailed_tender_count END,
          updated_at = NOW()
      `, [organizationId, weekStart, tenderType]);
      
      logger.info('Tender quota incremented', { organizationId, tenderType });
      
    } catch (error) {
      logger.error('Failed to increment tender quota', { error, organizationId, tenderType });
      throw error;
    }
  }

  /**
   * Check and increment tender quota in a single atomic operation
   * This prevents race conditions by using row locking within a transaction
   */
  static async checkAndIncrementQuota(
    organizationId: string,
    tenderType: 'simple_rfq' | 'detailed_tender'
  ): Promise<{ allowed: boolean; newCount: number }> {
    const client = await pool.connect();
    let transactionStarted = false;
    let result: { allowed: boolean; newCount: number };
    
    try {
      await client.query('BEGIN');
      transactionStarted = true;
      
      const weekStart = SubscriptionService.getWeekStart();
      
      // Lock the quota row for this organization/week using FOR UPDATE
      // This prevents other transactions from reading or modifying the same row
      const { rows } = await client.query(`
        SELECT simple_rfq_count, detailed_tender_count
        FROM tender_quota_usage
        WHERE organization_id = $1 AND week_start = $2
        FOR UPDATE
      `, [organizationId, weekStart]);
      
      const usage = rows[0] || { simple_rfq_count: 0, detailed_tender_count: 0 };
      
      // Get subscription info within the transaction with row locking
      // This prevents race conditions if subscription changes during quota check
      const { rows: subRows } = await client.query(`
        SELECT os.*, sp.weekly_simple_rfq_limit, sp.weekly_detailed_tender_limit,
               sp.storage_limit_bytes, sp.live_tendering_enabled
        FROM organization_subscriptions os
        JOIN subscription_packages sp ON os.package_id = sp.id
        WHERE os.organization_id = $1 AND os.status = 'active'
        FOR UPDATE
      `, [organizationId]);
      
      const subscription = subRows[0] || null;
      
      if (!subscription) {
        await client.query('ROLLBACK');
        result = { allowed: false, newCount: usage[tenderType + '_count'] };
      } else {
        // Package info is now included in the subscription query
        let allowed = false;
        if (tenderType === 'simple_rfq') {
          allowed = subscription.weekly_simple_rfq_limit === null ||
                    usage.simple_rfq_count < subscription.weekly_simple_rfq_limit;
        } else {
          allowed = subscription.weekly_detailed_tender_limit === null ||
                    usage.detailed_tender_count < subscription.weekly_detailed_tender_limit;
        }
        
        if (allowed) {
          // Increment within the same transaction while holding the lock
          await client.query(`
            INSERT INTO tender_quota_usage (organization_id, week_start, simple_rfq_count, detailed_tender_count, updated_at)
            VALUES ($1, $2,
              CASE WHEN $3 = 'simple_rfq' THEN 1 ELSE 0 END,
              CASE WHEN $3 = 'detailed_tender' THEN 1 ELSE 0 END,
              NOW())
            ON CONFLICT (organization_id, week_start)
            DO UPDATE SET
              simple_rfq_count = CASE WHEN $3 = 'simple_rfq' THEN tender_quota_usage.simple_rfq_count + 1 ELSE tender_quota_usage.simple_rfq_count END,
              detailed_tender_count = CASE WHEN $3 = 'detailed_tender' THEN tender_quota_usage.detailed_tender_count + 1 ELSE tender_quota_usage.detailed_tender_count END,
              updated_at = NOW()
          `, [organizationId, weekStart, tenderType]);
        }
        
        await client.query('COMMIT');
        
        const newCount = usage[tenderType + '_count'] + (allowed ? 1 : 0);
        logger.info('Quota checked and incremented', { organizationId, tenderType, allowed, newCount });
        
        result = { allowed, newCount };
      }
      
      return result;
      
    } catch (error) {
      if (transactionStarted) {
        await client.query('ROLLBACK');
      }
      logger.error('Failed to check and increment quota', { error, organizationId, tenderType });
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get package information
   */
  private static async getPackageInfo(packageId: string): Promise<SubscriptionPackage> {
    const { rows } = await pool.query(
      'SELECT * FROM subscription_packages WHERE id = $1',
      [packageId]
    );
    return rows[0];
  }

  /**
   * Get week start date (Monday 00:00 UTC)
   */
  private static getWeekStart(): string {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? 6 : -1));
    monday.setUTCHours(0, 0, 0, 0);
    return monday.toISOString().split('T')[0];
  }
}
