/**
 * Seed Missing Tender Types Test
 * 
 * This test file seeds missing tender types (PG1, PG2, PG3, PW1, PW3) into the test database.
 * It can be run independently to populate the database with required tender types.
 * 
 * Missing types: PG1, PG2, PG3, PW1, PW3
 */

import { pool } from '../config/database';
import { executeQuery } from './test-database';

const TENDER_TYPES_TO_SEED = [
  {
    code: 'PG1',
    name: 'Local Competitive Bidding (Goods)',
    description: 'Local competitive bidding for goods procurement with value up to 25 Lac BDT',
    procurement_type: 'goods',
    min_value_bdt: 0,
    max_value_bdt: 250000,
    requires_tender_security: false,
    tender_security_percent: null,
    tender_security_validity_days: null,
    requires_performance_security: false,
    performance_security_percent: null,
    requires_retention_money: false,
    retention_money_percent: null,
    requires_two_envelope: false,
    requires_newspaper_ad: false,
    requires_website_publication: false,
    requires_prequalification: false,
    requires_site_visit: false,
    min_submission_days: 7,
    max_submission_days: null,
    default_validity_days: 30,
    default_evaluation_days: null,
    is_international: false,
    is_direct_procurement: false,
    is_govt_type: true,
    is_active: true,
    method: 'open',
    form_segment_config: {},
  },
  {
    code: 'PG2',
    name: 'Local Competitive Bidding (Goods - Medium)',
    description: 'Local competitive bidding for goods procurement with value 25 Lac to 1 Crore BDT',
    procurement_type: 'goods',
    min_value_bdt: 250001,
    max_value_bdt: 10000000,
    requires_tender_security: true,
    tender_security_percent: 2,
    tender_security_validity_days: 90,
    requires_performance_security: true,
    performance_security_percent: 5,
    requires_retention_money: false,
    retention_money_percent: null,
    requires_two_envelope: false,
    requires_newspaper_ad: true,
    requires_website_publication: true,
    requires_prequalification: false,
    requires_site_visit: false,
    min_submission_days: 15,
    max_submission_days: null,
    default_validity_days: 60,
    default_evaluation_days: 30,
    is_international: false,
    is_direct_procurement: false,
    is_govt_type: true,
    is_active: true,
    method: 'open',
    form_segment_config: {},
  },
  {
    code: 'PG3',
    name: 'Local Competitive Bidding (Goods - Large)',
    description: 'Local competitive bidding for goods procurement with value 1 Crore to 10 Crore BDT',
    procurement_type: 'goods',
    min_value_bdt: 10000001,
    max_value_bdt: 100000000,
    requires_tender_security: true,
    tender_security_percent: 2,
    tender_security_validity_days: 90,
    requires_performance_security: true,
    performance_security_percent: 5,
    requires_retention_money: true,
    retention_money_percent: 10,
    requires_two_envelope: true,
    requires_newspaper_ad: true,
    requires_website_publication: true,
    requires_prequalification: false,
    requires_site_visit: true,
    min_submission_days: 21,
    max_submission_days: null,
    default_validity_days: 90,
    default_evaluation_days: 30,
    is_international: false,
    is_direct_procurement: false,
    is_govt_type: true,
    is_active: true,
    method: 'open',
    form_segment_config: {},
  },
  {
    code: 'PW1',
    name: 'Local Competitive Bidding (Works)',
    description: 'Local competitive bidding for works procurement with value up to 25 Lac BDT',
    procurement_type: 'works',
    min_value_bdt: 0,
    max_value_bdt: 250000,
    requires_tender_security: false,
    tender_security_percent: null,
    tender_security_validity_days: null,
    requires_performance_security: false,
    performance_security_percent: null,
    requires_retention_money: false,
    retention_money_percent: null,
    requires_two_envelope: false,
    requires_newspaper_ad: false,
    requires_website_publication: false,
    requires_prequalification: false,
    requires_site_visit: false,
    min_submission_days: 10,
    max_submission_days: null,
    default_validity_days: 30,
    default_evaluation_days: null,
    is_international: false,
    is_direct_procurement: false,
    is_govt_type: true,
    is_active: true,
    method: 'open',
    form_segment_config: {},
  },
  {
    code: 'PW3',
    name: 'Local Competitive Bidding (Works - Large)',
    description: 'Local competitive bidding for works procurement with value 1 Crore to 10 Crore BDT',
    procurement_type: 'works',
    min_value_bdt: 10000001,
    max_value_bdt: 100000000,
    requires_tender_security: true,
    tender_security_percent: 2.5,
    tender_security_validity_days: 90,
    requires_performance_security: true,
    performance_security_percent: 5,
    requires_retention_money: true,
    retention_money_percent: 10,
    requires_two_envelope: true,
    requires_newspaper_ad: true,
    requires_website_publication: true,
    requires_prequalification: false,
    requires_site_visit: true,
    min_submission_days: 30,
    max_submission_days: null,
    default_validity_days: 120,
    default_evaluation_days: 45,
    is_international: false,
    is_direct_procurement: false,
    is_govt_type: true,
    is_active: true,
    method: 'open',
    form_segment_config: {},
  },
];

/**
 * Main seeding function - can be called independently
 */
export async function seedMissingTenderTypes() {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      console.log('🔍 Checking existing tender types...');
      const existingResult = await client.query(
        'SELECT code, name FROM tender_type_definitions ORDER BY code'
      );
      const existingCodes = new Set(existingResult.rows.map((row: any) => row.code));
      
      console.log(`✅ Found ${existingCodes.size} existing tender types:`);
      existingResult.rows.forEach((row: any) => {
        console.log(`   - ${row.code}: ${row.name}`);
      });
      
      const missingTypes = TENDER_TYPES_TO_SEED.filter(type => !existingCodes.has(type.code));
      
      if (missingTypes.length === 0) {
        console.log('✅ All required tender types already exist in database.');
        await client.query('ROLLBACK');
        return { seeded: 0, alreadyExists: TENDER_TYPES_TO_SEED.length };
      }
      
      console.log(`\n📝 Seeding ${missingTypes.length} missing tender types...`);
      
      for (const type of missingTypes) {
        const columns = Object.keys(type).join(', ');
        const placeholders = Object.keys(type).map((_, i) => `$${i + 1}`).join(', ');
        const values = Object.values(type);
        
        await client.query(
          `INSERT INTO tender_type_definitions (${columns}) VALUES (${placeholders})`,
          values
        );
        
        console.log(`   ✅ Inserted ${type.code}: ${type.name}`);
      }
      
      await client.query('COMMIT');
      
      console.log('\n✅ Successfully seeded missing tender types!');
      
      // Verify insertions
      const verifyResult = await client.query(
        'SELECT code, name FROM tender_type_definitions WHERE code = ANY($1) ORDER BY code',
        [missingTypes.map(t => t.code)]
      );
      
      console.log('\n📊 Verification - Tender types now in database:');
      verifyResult.rows.forEach((row: any) => {
        console.log(`   - ${row.code}: ${row.name}`);
      });
      
    return { seeded: missingTypes.length, alreadyExists: TENDER_TYPES_TO_SEED.length - missingTypes.length };
      
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding tender types:', error);
    throw error;
  } finally {
    client.release();
  }
}

describe('Seed Missing Tender Types', () => {
  
  /**
   * Test to verify seeding works correctly
   */
  it('should seed missing tender types (PG1, PG2, PG3, PW1, PW3) into database', async () => {
    const result = await seedMissingTenderTypes();
    
    // Verify all required tender types exist in database
    const requiredCodes = ['PG1', 'PG2', 'PG3', 'PW1', 'PW3'];
    
    for (const code of requiredCodes) {
      const tenderType = await executeQuery(
        'SELECT * FROM tender_type_definitions WHERE code = $1',
        [code]
      );
      
      expect(tenderType.rows.length).toBeGreaterThan(0);
      expect(tenderType.rows[0].code).toBe(code);
      expect(tenderType.rows[0].is_active).toBe(true);
    }
    
    console.log(`\n✅ Seeding test passed: ${result.seeded} seeded, ${result.alreadyExists} already existed`);
  });

  /**
   * Test to verify idempotency - can be run multiple times without duplicates
   */
  it('should be idempotent - running multiple times does not create duplicates', async () => {
    // Run seeding twice
    await seedMissingTenderTypes();
    const result2 = await seedMissingTenderTypes();
    
    // Second run should report 0 new seedings
    expect(result2.seeded).toBe(0);
    
    // Verify no duplicates exist
    const duplicateCheck = await executeQuery(`
      SELECT code, COUNT(*) as count 
      FROM tender_type_definitions 
      WHERE code = ANY($1)
      GROUP BY code
      HAVING COUNT(*) > 1
    `, [['PG1', 'PG2', 'PG3', 'PW1', 'PW3']]);
    
    expect(duplicateCheck.rows.length).toBe(0);
    
    console.log('✅ Idempotency test passed - no duplicates created');
  });
});
