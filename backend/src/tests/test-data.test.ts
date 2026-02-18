/**
 * Diagnostic test for createTestUser function
 */
import { pool } from '../config/database';
import bcrypt from 'bcryptjs';

describe('createTestUser Diagnostic', () => {
  const orgId = '00000000-0000-0000-0000-000000000001';

  it('should create a test user successfully', async () => {
    console.log('🧪 Starting createTestUser diagnostic...');

    try {
      // First, ensure organization exists
      console.log('📋 Creating test organization...');
      const orgResult = await pool.query(
        `INSERT INTO organizations (id, name, type)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
         RETURNING id, name, type`,
        [orgId, 'Test Organization', 'buyer']
      );
      console.log('✅ Organization created:', orgResult.rows[0]);

      // Now try to create a user
      console.log('👤 Creating test user...');
      const userId = `user-test-${Date.now()}`;
      const email = `test-${Date.now()}@example.com`;
      const password = 'TestPassword123@';
      const role = 'admin';

      console.log('🔐 Hashing password...');
      const hashedPassword = await bcrypt.hash(password, 12);
      console.log('✅ Password hashed');

      console.log('💾 Inserting user into database...');
      console.log('User ID:', userId);
      console.log('Email:', email);
      console.log('Organization ID:', orgId);
      console.log('Role:', role);

      const userResult = await pool.query(
        `INSERT INTO users (id, email, password_hash, roles, is_active, organization_id)
         VALUES ($1, $2, $3, $4, true, $5)
         RETURNING id, email, roles, organization_id`,
        [userId, email, hashedPassword, JSON.stringify([role]), orgId]
      );

      console.log('✅ User created successfully:', userResult.rows[0]);

      // Clean up
      await pool.query('DELETE FROM users WHERE id = $1', [userId]);
      console.log('🧹 Test user cleaned up');

      expect(userResult.rows[0]).toBeDefined();
      expect(userResult.rows[0].id).toBe(userId);
    } catch (err: any) {
      console.error('❌ Diagnostic test FAILED');
      console.error('Error:', err.message);
      console.error('Code:', err.code);
      console.error('Detail:', err.detail);
      throw err;
    }
  }, 30000);
});
