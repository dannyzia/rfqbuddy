/**
 * Check check constraints on tender_type_definitions table
 */

import { pool } from '../config/database';

describe('Check Constraints', () => {
  it('should display check constraints on method column', async () => {
    const result = await pool.query(
      `SELECT conname, pg_get_constraintdef(oid) as definition 
       FROM pg_constraint 
       WHERE conrelid = 'tender_type_definitions'::regclass 
       AND conname LIKE '%method%'`
    );
    
    console.log('\n=== Method Check Constraints ===');
    console.table(result.rows);
    console.log('\n');
    
    expect(result.rows.length).toBeGreaterThan(0);
  });
  
  it('should display all existing tender types', async () => {
    const result = await pool.query(
      `SELECT code, name, method FROM tender_type_definitions ORDER BY code`
    );
    
    console.log('\n=== All Existing Tender Types ===');
    console.table(result.rows);
    console.log('\n');
    
    console.log(`Total count: ${result.rows.length}`);
  });
});
