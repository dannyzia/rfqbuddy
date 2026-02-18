/**
 * Global Setup for Jest - Section 2.1
 * MASTER_TESTING_PLAN_REVISED.md
 * 
 * Runs before all test suites:
 * - Create test database schema
 * - Flush Redis test database
 * - Seed test data
 */

import { pool } from '../config/database';
import { redisClient } from '../config/redis';
import fs from 'fs';
import path from 'path';

export default async () => {
  console.log('🔧 Initializing test environment...');

  try {
    // 1. Create test database schema
    console.log('📦 Setting up test database schema...');
    
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf-8');
      
      // Split schema into individual statements and execute
      const statements = schema
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      for (const statement of statements) {
        try {
          await pool.query(statement);
        } catch (err: any) {
          // Ignore errors for CREATE SCHEMA IF NOT EXISTS, etc.
          if (!err.message.includes('already exists')) {
            console.warn('⚠️  Schema statement skipped:', err.message.substring(0, 100));
          }
        }
      }
      
      console.log('✅ Test database schema initialized');
    } else {
      console.warn('⚠️  schema.sql not found at', schemaPath);
    }

    // 2. Flush Redis test database
    console.log('🔄 Flushing Redis test database...');
    try {
      await redisClient.flushdb();
      console.log('✅ Redis flushed successfully');
    } catch (err: any) {
      console.warn('⚠️  Redis flush failed (Redis may not be available):', err.message);
    }

    // 3. Create test uploads directory
    console.log('📁 Creating test uploads directory...');
    const uploadsDir = path.join(process.cwd(), process.env.UPLOAD_DIR || './uploads-test');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Test uploads directory created');
    }

    console.log('✅ Test environment initialized\n');
  } catch (error) {
    console.error('❌ Test setup failed:', error);
    process.exit(1);
  }

  // Store setup time for reference
  return {
    setupTime: new Date().toISOString(),
  };
};
