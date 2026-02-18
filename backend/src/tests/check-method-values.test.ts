/**
 * Check method values in tender_type_definitions table
 */

import { pool } from '../config/database';

describe('Check Method Values', () => {
  it('should display existing method values', async () => {
    const result = await pool.query(
      `SELECT DISTINCT method FROM tender_type_definitions ORDER BY method`
    );
    
    console.log('\n=== Existing Method Values ===');
    console.table(result.rows);
    console.log('\n');
    
    expect(result.rows.length).toBeGreaterThan(0);
  });
});
