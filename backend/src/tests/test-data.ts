/**
 * Test Data Utilities - Section 3: Test Data Management
 * MASTER_TESTING_PLAN_REVISED.md
 * 
 * Provides utilities for creating and managing test data:
 * - Test user accounts
 * - Test organizations
 * - Sample tenders
 * - Sample bids
 * - Master data
 */

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/database';

/**
 * Test user credentials - Section 3.1
 * Maps to MASTER_TESTING_PLAN_REVISED.md Table
 */
export const TEST_USERS = {
  ADMIN: {
    id: 'user-admin-001',
    email: 'admin@test.com',
    password: 'Admin@123456',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
  },
  GOVT_BUYER_1: {
    id: 'user-buyer-001',
    email: 'govt.buyer1@test.com',
    password: 'Buyer@123456',
    role: 'buyer',
    firstName: 'Govt',
    lastName: 'Buyer One',
  },
  GOVT_BUYER_2: {
    id: 'user-buyer-002',
    email: 'govt.buyer2@test.com',
    password: 'Buyer@123456',
    role: 'buyer',
    firstName: 'Govt',
    lastName: 'Buyer Two',
  },
  NON_GOVT_BUYER: {
    id: 'user-buyer-003',
    email: 'nongov.buyer1@test.com',
    password: 'Buyer@123456',
    role: 'buyer',
    firstName: 'Non Govt',
    lastName: 'Buyer',
  },
  VENDOR_1: {
    id: 'user-vendor-001',
    email: 'vendor1@test.com',
    password: 'Vendor@123456',
    role: 'vendor',
    firstName: 'Vendor',
    lastName: 'One',
  },
  VENDOR_2: {
    id: 'user-vendor-002',
    email: 'vendor2@test.com',
    password: 'Vendor@123456',
    role: 'vendor',
    firstName: 'Vendor',
    lastName: 'Two',
  },
  EVALUATOR_1: {
    id: 'user-evaluator-001',
    email: 'evaluator1@test.com',
    password: 'Eval@123456',
    role: 'evaluator',
    firstName: 'Evaluator',
    lastName: 'One',
  },
};

/**
 * Test organization accounts - Section 3.2
 */
export const TEST_ORGS = {
  GOVT_AGENCY: {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Government Procurement Agency',
    type: 'buyer',
    subscription: 'platinum',
  },
  PRIVATE_COMPANY: {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Private Company Ltd',
    type: 'buyer',
    subscription: 'gold',
  },
  VENDOR_CORP: {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Vendor Corp Inc',
    type: 'vendor',
    subscription: 'silver',
  },
};

/**
 * Create a test user in the database
 */
export async function createTestUser(userSpec?: Partial<typeof TEST_USERS[keyof typeof TEST_USERS]>) {
  // Use defaults for missing properties
  const spec = {
    id: uuidv4(),
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123@',
    role: 'buyer',
    firstName: 'Test',
    lastName: 'User',
    ...userSpec,
  };

  const hashedPassword = await bcrypt.hash(spec.password, 12);

      try {
        const result = await pool.query(
          `INSERT INTO users (id, email, password_hash, roles, is_active, organization_id)
           VALUES ($1, $2, $3, $4, true, $5)
           RETURNING id, email, roles`,
          [
            spec.id,
            spec.email,
            hashedPassword,
            JSON.stringify([spec.role]),
            TEST_ORGS.GOVT_AGENCY.id,
          ]
        );
        return result.rows[0];
      } catch (err: any) {
    throw err;
  }
}

/**
 * Create a test organization in the database
 */
export async function createTestOrg(orgSpec: { id: string; name: string; type: string; subscription?: string }) {
  console.log('🏢 [DEBUG] Starting createTestOrg() with spec:', orgSpec);

  try {
    const result = await pool.query(
      `INSERT INTO organizations (id, name, type)
       VALUES ($1, $2, $3)
       RETURNING id, name, type`,
      [
        orgSpec.id,
        orgSpec.name,
        orgSpec.type,
      ]
    );

    console.log('🏢 [DEBUG] Query result rows:', result.rows.length);
    console.log('🏢 [DEBUG] Created/found organization:', result.rows[0]);

    return result.rows[0];
  } catch (err: any) {
    console.error('❌ [DEBUG] Error in createTestOrg():', err.message);
    console.error('❌ [DEBUG] Error details:', err.detail || 'No details');
    throw err;
  }
}

/**
 * Create multiple test users efficiently
 */
export async function createMultipleTestUsers(
  userSpecs: Array<typeof TEST_USERS[keyof typeof TEST_USERS]>
) {
  const results = [];
  
  for (const spec of userSpecs) {
    const user = await createTestUser(spec);
    results.push(user);
  }
  
  return results;
}

/**
 * Clear test data (truncate all tables)
 * OPTIMIZED: Uses batch TRUNCATE for better performance
 */
export async function clearTestData() {
  const startTime = Date.now();
  console.log(`🧹 [DEBUG] Starting clearTestData() at ${new Date().toISOString()}`);
  
  const allTables = [
    'audit_logs',
    'activity_logs',
    'evaluations',
    'evaluation_line_scores',
    'bids',
    'bid_items',
    'bid_feature_values',
    'bid_envelopes',
    'awards',
    'tender_workflow_states',
    'tender_committee_members',
    'tender_features',
    'tender_items',
    'tender_documents',
    'tenders',
    'tender_type_definitions',
    'notifications',
    'vendor_documents',
    'vendor_categories',
    'vendor_profiles',
    'user_tokens',
    'user_profiles',
    'users',
    'organizations',
    'subscriptions',
    'subscription_usage',
  ];

  console.log(`🧹 [DEBUG] Checking ${allTables.length} tables for existence...`);

  // First, filter out tables that don't exist to avoid batch TRUNCATE failures
  const existingTables: string[] = [];
  for (const table of allTables) {
    try {
      // Check if table exists by querying information_schema
      const result = await pool.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = $1
        )`,
        [table]
      );
      const exists = result.rows[0].exists;
      if (exists) {
        existingTables.push(table);
        console.log(`✅ [DEBUG] Table exists: ${table}`);
      } else {
        console.log(`⚠️  [DEBUG] Table does not exist (will skip): ${table}`);
      }
    } catch (err: any) {
      // If we can't check, assume it doesn't exist and skip
      console.log(`⚠️  [DEBUG] Could not check table ${table}, assuming it doesn't exist`);
    }
  }

  console.log(`🧹 [DEBUG] Found ${existingTables.length} existing tables out of ${allTables.length} total`);

  if (existingTables.length === 0) {
    console.log(`✅ [DEBUG] No tables to truncate, completed in ${Date.now() - startTime}ms`);
    return;
  }

  try {
    // Use a single transaction with batch TRUNCATE for better performance
    // This is much faster than individual TRUNCATE statements
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Build a single TRUNCATE statement for all existing tables
      // This is significantly faster than individual TRUNCATEs
      const truncateStatement = `TRUNCATE TABLE ${existingTables.join(', ')} CASCADE`;
      console.log(`🧹 [DEBUG] Executing batch TRUNCATE for ${existingTables.length} tables`);
      
      await client.query(truncateStatement);
      console.log(`✅ [DEBUG] Batch TRUNCATE completed successfully`);
      
      await client.query('COMMIT');
    } catch (err: any) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err: any) {
    // If batch TRUNCATE fails, fall back to individual truncation with error handling
    console.warn(`⚠️  [DEBUG] Batch TRUNCATE failed, falling back to individual truncation:`, err.message);
    
    for (const table of existingTables) {
      try {
        await pool.query(`TRUNCATE TABLE ${table} CASCADE`);
      } catch (tableErr: any) {
        // Table might not exist, skip
        if (!tableErr.message.includes('does not exist')) {
          console.error(`❌ [DEBUG] Error truncating ${table}:`, tableErr.message);
        }
      }
    }
  }

  const totalElapsed = Date.now() - startTime;
  console.log(`✅ [DEBUG] clearTestData() completed in ${totalElapsed}ms at ${new Date().toISOString()}`);
}

/**
 * Generate test authentication tokens
 */
export function generateTestTokens(userId: string) {
  const accessToken = `test-access-token-${userId}-${Date.now()}`;
  const refreshToken = `test-refresh-token-${userId}-${uuidv4()}`;
  
  return {
    accessToken,
    refreshToken,
    expiresIn: 900, // 15 minutes
  };
}

/**
 * Wait for async operations
 */
export async function waitFor(condition: () => boolean, timeout = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (condition()) return true;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('Timeout waiting for condition');
}

export default {
  TEST_USERS,
  TEST_ORGS,
  createTestUser,
  createTestOrg,
  createMultipleTestUsers,
  clearTestData,
  generateTestTokens,
  waitFor,
};
