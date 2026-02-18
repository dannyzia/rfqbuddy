/**
 * Verify tender types have been seeded successfully
 */

import { pool } from '../config/database';

describe('Verify Tender Types Seeded', () => {
  it('should verify all required tender types exist in database', async () => {
    const result = await pool.query(
      `SELECT code, name, procurement_type, min_value_bdt, max_value_bdt, is_active FROM tender_type_definitions WHERE code IN ('PG1', 'PG2', 'PG3', 'PW1', 'PW3') ORDER BY code`
    );
    
    console.log('\n=== Seeded Tender Types ===');
    console.table(result.rows);
    console.log('\n');
    
    // Verify all 5 tender types exist
    expect(result.rows.length).toBe(5);
    
    // Verify each specific tender type
    const tenderTypeCodes = result.rows.map((row: any) => row.code);
    expect(tenderTypeCodes).toContain('PG1');
    expect(tenderTypeCodes).toContain('PG2');
    expect(tenderTypeCodes).toContain('PG3');
    expect(tenderTypeCodes).toContain('PW1');
    expect(tenderTypeCodes).toContain('PW3');
    
    // Verify they are all active
    result.rows.forEach((row: any) => {
      expect(row.is_active).toBe(true);
    });
    
    console.log('✅ All 5 required tender types verified in database!');
  });
});
