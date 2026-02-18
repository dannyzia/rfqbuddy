/**
 * Database Connection Verification Test
 * Verifies PostgreSQL and Redis connectivity for test environment
 */

import { pool } from '../config/database';
import { redisClient } from '../config/redis';

describe('Database Connectivity Verification', () => {
  describe('PostgreSQL Connection', () => {
    it('should connect to PostgreSQL and execute a simple query', async () => {
      const result = await pool.query('SELECT 1 as test');
      expect(result.rows[0].test).toBe(1);
      console.log('✅ PostgreSQL: CONNECTED - Query test passed: SELECT 1 returned 1');
    });

    it('should get current database time', async () => {
      const result = await pool.query('SELECT NOW() as current_time');
      expect(result.rows[0].current_time).toBeDefined();
      console.log(`✅ PostgreSQL: Current time retrieved - ${result.rows[0].current_time}`);
    });
  });

  describe('Redis Connection', () => {
    it('should connect to Redis and respond to PING', async () => {
      const result = await redisClient.ping();
      expect(result).toBe('PONG');
      console.log('✅ Redis: CONNECTED - Ping test passed: PONG received');
    });

    it('should be able to set and get a value', async () => {
      const testKey = 'test:connection:verify';
      const testValue = 'test-value';

      await redisClient.set(testKey, testValue);
      const result = await redisClient.get(testKey);
      expect(result).toBe(testValue);

      // Cleanup
      await redisClient.del(testKey);
      console.log('✅ Redis: Set/Get test passed - Values stored and retrieved correctly');
    });
  });
});
