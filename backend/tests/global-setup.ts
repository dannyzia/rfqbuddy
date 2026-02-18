import { pool } from '../src/config/database';
import { redisClient } from '../src/config/redis';

export default async () => {
  try {
    // Create test database schema if it doesn't exist
    await pool.query('CREATE SCHEMA IF NOT EXISTS test_schema');
    
    // Flush test Redis to ensure clean state
    if (redisClient) {
      try {
        await redisClient.flushdb();
      } catch (redisError: any) {
        console.warn('⚠️ Redis flush failed (Redis may not be available):', redisError.message);
      }
    }
    
    console.log('✅ Test environment initialized');
  } catch (error) {
    console.error('❌ Failed to initialize test environment:', error);
    throw error;
  }
};
