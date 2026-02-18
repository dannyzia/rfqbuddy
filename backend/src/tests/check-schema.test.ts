/**
 * Check tender_type_definitions table schema
 */

import { pool } from '../config/database';

describe('Check Schema', () => {
  it('should display tender_type_definitions table schema', async () => {
    const result = await pool.query(
      `SELECT column_name, data_type, is_nullable 
       FROM information_schema.columns 
       WHERE table_name = 'tender_type_definitions' 
       ORDER BY ordinal_position`
    );
    
    console.log('\n=== tender_type_definitions Table Schema ===');
    console.table(result.rows);
    console.log('\n');
    
    expect(result.rows.length).toBeGreaterThan(0);
  });
});
