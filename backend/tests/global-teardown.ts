import { pool } from '../src/config/database';
import { redisClient } from '../src/config/redis';

export default async () => {
  try {
    // Close database connections
    if (pool) {
      await pool.end();
    }
    
    // Close Redis connections
    if (redisClient) {
      try {
        await redisClient.disconnect();
      } catch (redisError: unknown) {
        console.warn('⚠️ Redis disconnect failed:', redisError instanceof Error ? redisError.message : String(redisError));
      }
    }
    
    console.log('✅ Test environment cleaned up');
  } catch (error) {
    console.error('❌ Failed to cleanup test environment:', error);
  }
};
