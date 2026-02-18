/**
 * Test Database Utilities - Section 2: Test Infrastructure
 * MASTER_TESTING_PLAN_REVISED.md
 * 
 * Database utilities for integration tests including
 * query execution, data truncation, and connection management
 */

import { PoolClient } from 'pg';
import { pool } from '../config/database';

/**
 * Execute a single query on the test database
 */
export async function executeQuery(
  query: string,
  values?: any[]
): Promise<any> {
  let client: PoolClient | undefined;
  try {
    client = await pool.connect();
    const result = await client.query(query, values);
    return result;
  } finally {
    if (client) {
      client.release();
    }
  }
}

/**
 * Execute multiple queries in a transaction
 */
export async function executeTransaction(
  queries: Array<{ query: string; values?: any[] }>
): Promise<any[]> {
  let client: PoolClient | undefined;
  try {
    client = await pool.connect();
    await client.query('BEGIN TRANSACTION');
    
    const results = [];
    
    for (const { query, values } of queries) {
      const result = await client.query(query, values);
      results.push(result);
    }
    
    await client.query('COMMIT');
    return results;
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
    }
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

/**
 * Fetch one row from database
 */
export async function fetchOne(
  query: string,
  values?: any[]
): Promise<any | null> {
  const result = await executeQuery(query, values);
  return result.rows[0] || null;
}

/**
 * Fetch all rows from database
 */
export async function fetchAll(
  query: string,
  values?: any[]
): Promise<any[]> {
  const result = await executeQuery(query, values);
  return result.rows;
}

/**
 * Truncate a single table
 */
export async function truncateTable(tableName: string): Promise<void> {
  await executeQuery(`TRUNCATE TABLE "${tableName}" CASCADE`);
}

/**
 * Truncate multiple tables
 */
export async function truncateTables(tableNames: string[]): Promise<void> {
  for (const tableName of tableNames) {
    await truncateTable(tableName);
  }
}

/**
 * Reset all tables to initial state
 */
export async function resetAllTables(): Promise<void> {
  const tablesToReset = [
    'audit_logs',
    'notification_preferences',
    'notifications',
    'award_items',
    'awards',
    'evaluation_scores',
    'evaluation_members',
    'evaluations',
    'bid_items',
    'bids',
    'live_tender_sessions',
    'tender_documents',
    'tender_items',
    'tender_types',
    'tenders',
    'tender_subscriptions',
    'tender_publications',
    'vendor_meta',
    'vendor_services',
    'vendors',
    'organization_settings',
    'organization_subscriptions',
    'organization_invitations',
    'organization_members',
    'organizations',
    'user_profiles',
    'users',
  ];

  for (const table of tablesToReset) {
    try {
      await truncateTable(table);
    } catch (error: any) {
      // Table might not exist yet, continue
      if (!error.message.includes('does not exist')) {
        throw error;
      }
    }
  }
}

/**
 * Get count of rows in table
 */
export async function getTableCount(tableName: string): Promise<number> {
  const result = await fetchOne(`SELECT COUNT(*) as count FROM "${tableName}"`);
  return parseInt(result?.count || '0', 10);
}

/**
 * Check if record exists by ID
 */
export async function recordExists(
  tableName: string,
  id: string | number
): Promise<boolean> {
  const result = await fetchOne(
    `SELECT id FROM "${tableName}" WHERE id = $1 LIMIT 1`,
    [id]
  );
  return !!result;
}

/**
 * Get record by ID
 */
export async function getRecordById(
  tableName: string,
  id: string | number
): Promise<any | null> {
  return fetchOne(
    `SELECT * FROM "${tableName}" WHERE id = $1 LIMIT 1`,
    [id]
  );
}

/**
 * Get all records from table
 */
export async function getAllRecords(tableName: string): Promise<any[]> {
  return fetchAll(`SELECT * FROM "${tableName}"`);
}

/**
 * Delete record by ID
 */
export async function deleteRecordById(
  tableName: string,
  id: string | number
): Promise<void> {
  await executeQuery(
    `DELETE FROM "${tableName}" WHERE id = $1`,
    [id]
  );
}

/**
 * Update record by ID
 */
export async function updateRecordById(
  tableName: string,
  id: string | number,
  updates: Record<string, any>
): Promise<any> {
  const keys = Object.keys(updates);
  const values = Object.values(updates);
  
  const setClause = keys.map((key, index) => `"${key}" = $${index + 1}`).join(', ');
  const query = `UPDATE "${tableName}" SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
  
  return fetchOne(query, [...values, id]);
}

/**
 * Insert record into table
 */
export async function insertRecord(
  tableName: string,
  data: Record<string, any>
): Promise<any> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
  const columns = keys.map(k => `"${k}"`).join(', ');
  
  const query = `INSERT INTO "${tableName}" (${columns}) VALUES (${placeholders}) RETURNING *`;
  return fetchOne(query, values);
}

/**
 * Batch insert records
 */
export async function insertRecords(
  tableName: string,
  records: Array<Record<string, any>>
): Promise<any[]> {
  if (records.length === 0) {
    return [];
  }

  const keys = Object.keys(records[0]);
  const columns = keys.map(k => `"${k}"`).join(', ');
  
  let placeholderIndex = 1;
  const placeholders = records
    .map(() => {
      const row = keys.map(() => `$${placeholderIndex++}`).join(', ');
      return `(${row})`;
    })
    .join(', ');

  const values = records.flatMap(record => keys.map(key => record[key]));
  const query = `INSERT INTO "${tableName}" (${columns}) VALUES ${placeholders} RETURNING *`;
  
  const result = await executeQuery(query, values);
  return result.rows;
}

/**
 * Check if database connection is healthy
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const result = await executeQuery('SELECT 1');
    return !!result;
  } catch (error) {
    return false;
  }
}

/**
 * Get database statistics
 */
export async function getDatabaseStats(): Promise<Record<string, number>> {
  const tablesToCheck = [
    'users',
    'organizations',
    'tenders',
    'bids',
    'evaluations',
    'awards',
    'vendors',
  ];

  const stats: Record<string, number> = {};

  for (const table of tablesToCheck) {
    try {
      stats[table] = await getTableCount(table);
    } catch (error) {
      stats[table] = 0;
    }
  }

  return stats;
}

export default {
  executeQuery,
  executeTransaction,
  fetchOne,
  fetchAll,
  truncateTable,
  truncateTables,
  resetAllTables,
  getTableCount,
  recordExists,
  getRecordById,
  getAllRecords,
  deleteRecordById,
  updateRecordById,
  insertRecord,
  insertRecords,
  healthCheck,
  getDatabaseStats,
};
