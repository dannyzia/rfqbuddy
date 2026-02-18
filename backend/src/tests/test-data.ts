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
 */
export async function clearTestData() {
  console.log('🧹 [DEBUG] Starting clearTestData()...');
  const tables = [
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

  console.log(`🧹 [DEBUG] Attempting to truncate ${tables.length} tables...`);

  for (const table of tables) {
    try {
      console.log(`🧹 [DEBUG] Truncating table: ${table}`);
      await pool.query(`TRUNCATE TABLE ${table} CASCADE`);
      console.log(`✅ [DEBUG] Successfully truncated: ${table}`);
    } catch (err: any) {
      // Table might not exist, skip
      if (!err.message.includes('does not exist')) {
        console.error(`❌ [DEBUG] Error truncating ${table}:`, err.message);
      } else {
        console.log(`⚠️  [DEBUG] Table does not exist (skipping): ${table}`);
      }
    }
  }

  console.log('✅ [DEBUG] clearTestData() completed');
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
