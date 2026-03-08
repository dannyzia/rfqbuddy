#!/usr/bin/env node

/**
 * Backend script to seed test users
 * This ensures passwords are properly hashed using the same bcrypt config as the app
 * Usage: node backend/scripts/seed-test-users.js
 *        ENV_FILE=backend/.env.test node backend/scripts/seed-test-users.js  (seed to .env.test DB)
 */

const path = require('path');
const envFile = process.env.ENV_FILE || path.join(process.cwd(), '.env');
require('dotenv').config({ path: envFile });

const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const poolConfig = {
    connectionString: process.env.DATABASE_URL
};
if (process.env.DB_SSL === 'true') {
    poolConfig.ssl = { rejectUnauthorized: false };
}
const pool = new Pool(poolConfig);

const testUsers = [
    {
        id: '10000000-0000-0000-0000-000000000001',
        org_id: '00000000-0000-0000-0000-000000000001',
        name: 'Admin User',
        email: 'admin@rfqbuddy.com',
        password: '@DELL123dell#',
        roles: ['admin', 'buyer']
    },
    {
        id: '10000000-0000-0000-0000-000000000002',
        org_id: '00000000-0000-0000-0000-000000000002',
        name: 'Buyer User',
        email: 'buyer@rfqbuddy.com',
        password: 'buyer123',
        roles: ['buyer']
    },
    {
        id: '10000000-0000-0000-0000-000000000003',
        org_id: '00000000-0000-0000-0000-000000000003',
        name: 'Vendor User',
        email: 'vendor@rfqbuddy.com',
        password: 'vendor123',
        roles: ['vendor']
    },
    {
        id: '10000000-0000-0000-0000-000000000004',
        org_id: '00000000-0000-0000-0000-000000000002',
        name: 'Callzr User',
        email: 'callzr@gmail.com',
        password: 'password123',
        roles: ['buyer']
    },
    {
        id: '10000000-0000-0000-0000-000000000005',
        org_id: '00000000-0000-0000-0000-000000000003',
        name: 'Vendor ABD',
        email: 'vendorabd@gmail.com',
        password: 'password123',
        roles: ['vendor']
    }
];

const testOrgs = [
    { id: '00000000-0000-0000-0000-000000000001', name: 'RFQ Buddy Admin', type: 'buyer' },
    { id: '00000000-0000-0000-0000-000000000002', name: 'ABC Procurement Ltd', type: 'buyer' },
    { id: '00000000-0000-0000-0000-000000000003', name: 'XYZ Suppliers Inc', type: 'vendor' }
];

async function seedUsers() {
    const client = await pool.connect();
    
    try {
        console.log('🌱 Seeding test users...\n');
        
        // Ensure organizations exist (required by users FK)
        for (const org of testOrgs) {
            await client.query(
                `INSERT INTO organizations (id, name, type) VALUES ($1, $2, $3)
                 ON CONFLICT (id) DO NOTHING`,
                [org.id, org.name, org.type]
            );
        }
        console.log('✅ Organizations ready.\n');
        
        // First check if users already exist
        const result = await client.query(
            'SELECT COUNT(*) as count FROM users WHERE email = ANY($1)',
            [testUsers.map(u => u.email)]
        );
        
        if (result.rows[0].count > 0) {
            console.log('⚠️  Some test users already exist. Checking which ones...\n');
        }
        
        for (const user of testUsers) {
            // Check if user exists
            const existing = await client.query(
                'SELECT id FROM users WHERE email = $1',
                [user.email]
            );
            
            const hash = await bcrypt.hash(user.password, 12);
            
            if (existing.rows.length > 0) {
                // Update password for admin@rfqbuddy.com so credential changes take effect
                if (user.email === 'admin@rfqbuddy.com') {
                    await client.query(
                        'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE email = $2',
                        [hash, user.email]
                    );
                    console.log(`🔄 Updated password for ${user.email}`);
                } else {
                    console.log(`⏭️  ${user.email} already exists, skipping...`);
                }
                continue;
            }
            
            // Insert user
            await client.query(
                `INSERT INTO users (
                    id, organization_id, name, email, password_hash, roles, is_active, created_at, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())`,
                [user.id, user.org_id, user.name, user.email, hash, user.roles]
            );
            
            console.log(`✅ Created ${user.email} (password: ${user.password})`);
        }
        
        console.log('\n🎉 Test users seeded successfully!\n');
        console.log('Test Credentials:');
        testUsers.forEach(u => {
            console.log(`  ${u.email} / ${u.password}`);
        });
        
    } catch (error) {
        console.error('❌ Error seeding users:', error.message);
        if (error.detail) console.error('Details:', error.detail);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

seedUsers();
