/**
 * Global Teardown for Jest - Section 2.1
 * MASTER_TESTING_PLAN_REVISED.md
 * 
 * Runs after all test suites:
 * - Close database pool
 * - Close Redis connection
 * - Clean up test files
 */

import { pool } from '../config/database';
import { redisClient } from '../config/redis';
import fs from 'fs';
import path from 'path';

export default async () => {
  console.log('\n🧹 Cleaning up test environment...');

  try {
    // 1. Close database connection pool
    console.log('🔌 Closing database connections...');
    try {
      await pool.end();
      console.log('✅ Database pool closed');
    } catch (err: any) {
      console.warn('⚠️  Database pool close failed:', err.message);
    }

    // 2. Close Redis connection
    console.log('🔌 Closing Redis connection...');
    try {
      await redisClient.quit();
      console.log('✅ Redis connection closed');
    } catch (err: any) {
      console.warn('⚠️  Redis close failed:', err.message);
    }

    // 3. Remove test uploads directory
    console.log('🗑️  Removing test uploads...');
    const uploadsDir = path.join(process.cwd(), process.env.UPLOAD_DIR || './uploads-test');
    if (fs.existsSync(uploadsDir)) {
      fs.rmSync(uploadsDir, { recursive: true, force: true });
      console.log('✅ Test uploads removed');
    }

    console.log('✅ Test environment cleaned up\n');
  } catch (error) {
    console.error('❌ Test teardown failed:', error);
    // Don't exit with error - just log it
  }
};
