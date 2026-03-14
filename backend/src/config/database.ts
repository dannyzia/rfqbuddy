// Drizzle ORM + PostgreSQL connection pool
// Uses node-postgres (pg) driver with Drizzle's type-safe query builder

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from './env';
import * as schema from '../schema';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,                    // Max pool connections
  idleTimeoutMillis: 30000,   // Close idle connections after 30s
  connectionTimeoutMillis: 5000,
  ssl: env.isProd ? { rejectUnauthorized: false } : undefined,
});

// Log pool errors (don't crash — let the pool retry)
pool.on('error', (err) => {
  console.error('[DB] Pool error:', err.message);
});

export const db = drizzle(pool, { schema });

// Health check helper
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch {
    return false;
  }
}

// Graceful shutdown
export async function closeDatabasePool(): Promise<void> {
  await pool.end();
}
