/**
 * Test User Fixtures
 * Based on MASTER_TESTING_PLAN_REVISED.md Section 3.1
 */

export interface TestUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId: string;
  organizationType: 'government' | 'non-government' | 'vendor' | 'system';
  isActive: boolean;
}

export const testUsers: Record<string, TestUser> = {
  // TU001 - Platform Admin
  admin: {
    id: 'user-admin-001',
    email: 'admin@test.com',
    password: 'Admin@123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    organizationId: 'org-system-001',
    organizationType: 'system',
    isActive: true
  },

  // TU002 - Primary Government Buyer
  govBuyer1: {
    id: 'user-gov-buyer-001',
    email: 'govt.buyer1@test.com',
    password: 'Buyer@123',
    firstName: 'Government',
    lastName: 'Buyer One',
    role: 'buyer',
    organizationId: 'org-gov-001',
    organizationType: 'government',
    isActive: true
  },

  // TU003 - Secondary Government Buyer (for role assignment)
  govBuyer2: {
    id: 'user-gov-buyer-002',
    email: 'govt.buyer2@test.com',
    password: 'Buyer@123',
    firstName: 'Government',
    lastName: 'Buyer Two',
    role: 'buyer',
    organizationId: 'org-gov-001',
    organizationType: 'government',
    isActive: true
  },

  // TU004 - Government Buyer Multi-role
  govBuyer3: {
    id: 'user-gov-buyer-003',
    email: 'govt.buyer3@test.com',
    password: 'Buyer@123',
    firstName: 'Government',
    lastName: 'Buyer Three',
    role: 'buyer',
    organizationId: 'org-gov-001',
    organizationType: 'government',
    isActive: true
  },

  // TU005 - Non-government Buyer
  nonGovBuyer1: {
    id: 'user-nongov-buyer-001',
    email: 'nongov.buyer1@test.com',
    password: 'Buyer@123',
    firstName: 'NonGov',
    lastName: 'Buyer One',
    role: 'buyer',
    organizationId: 'org-nongov-001',
    organizationType: 'non-government',
    isActive: true
  },

  // TU006 - Non-government Buyer 2
  nonGovBuyer2: {
    id: 'user-nongov-buyer-002',
    email: 'nongov.buyer2@test.com',
    password: 'Buyer@123',
    firstName: 'NonGov',
    lastName: 'Buyer Two',
    role: 'buyer',
    organizationId: 'org-nongov-001',
    organizationType: 'non-government',
    isActive: true
  },

  // TU007 - Primary Vendor
  vendor1: {
    id: 'user-vendor-001',
    email: 'vendor1@test.com',
    password: 'Vendor@123',
    firstName: 'Vendor',
    lastName: 'One',
    role: 'vendor',
    organizationId: 'org-vendor-001',
    organizationType: 'vendor',
    isActive: true
  },

  // TU008 - Second Vendor (competing)
  vendor2: {
    id: 'user-vendor-002',
    email: 'vendor2@test.com',
    password: 'Vendor@123',
    firstName: 'Vendor',
    lastName: 'Two',
    role: 'vendor',
    organizationId: 'org-vendor-002',
    organizationType: 'vendor',
    isActive: true
  },

  // TU009 - Third Vendor
  vendor3: {
    id: 'user-vendor-003',
    email: 'vendor3@test.com',
    password: 'Vendor@123',
    firstName: 'Vendor',
    lastName: 'Three',
    role: 'vendor',
    organizationId: 'org-vendor-003',
    organizationType: 'vendor',
    isActive: true
  },

  // TU010 - Pre-qualification Evaluator
  evaluator1: {
    id: 'user-evaluator-001',
    email: 'evaluator1@test.com',
    password: 'Eval@123',
    firstName: 'Evaluator',
    lastName: 'Pre-Qual',
    role: 'evaluator',
    organizationId: 'org-gov-001',
    organizationType: 'government',
    isActive: true
  },

  // TU011 - Technical Evaluator
  evaluator2: {
    id: 'user-evaluator-002',
    email: 'evaluator2@test.com',
    password: 'Eval@123',
    firstName: 'Evaluator',
    lastName: 'Technical',
    role: 'evaluator',
    organizationId: 'org-gov-001',
    organizationType: 'government',
    isActive: true
  },

  // TU012 - Financial Evaluator
  evaluator3: {
    id: 'user-evaluator-003',
    email: 'evaluator3@test.com',
    password: 'Eval@123',
    firstName: 'Evaluator',
    lastName: 'Financial',
    role: 'evaluator',
    organizationId: 'org-gov-001',
    organizationType: 'government',
    isActive: true
  },

  // TU013 - Solo Buyer (single-user org)
  soloBuyer: {
    id: 'user-solo-buyer-001',
    email: 'solo.buyer@test.com',
    password: 'Buyer@123',
    firstName: 'Solo',
    lastName: 'Buyer',
    role: 'buyer',
    organizationId: 'org-solo-001',
    organizationType: 'government',
    isActive: true
  },

  // TU014 - Inactive User
  inactiveUser: {
    id: 'user-inactive-001',
    email: 'inactive@test.com',
    password: 'Inactive@123',
    firstName: 'Inactive',
    lastName: 'User',
    role: 'buyer',
    organizationId: 'org-gov-001',
    organizationType: 'government',
    isActive: false
  },

  // TU015 - Locked Account
  lockedUser: {
    id: 'user-locked-001',
    email: 'locked@test.com',
    password: 'Locked@123',
    firstName: 'Locked',
    lastName: 'User',
    role: 'buyer',
    organizationId: 'org-gov-001',
    organizationType: 'government',
    isActive: false
  }
};

/**
 * Factory function to create custom test user
 */
export function createTestUser(overrides: Partial<TestUser> = {}): TestUser {
  const timestamp = Date.now();
  return {
    id: `user-test-${timestamp}`,
    email: `test${timestamp}@test.com`,
    password: 'Test@123456',
    firstName: 'Test',
    lastName: 'User',
    role: 'buyer',
    organizationId: 'org-test-001',
    organizationType: 'government',
    isActive: true,
    ...overrides
  };
}

/**
 * Get test user credentials for authentication
 */
export function getUserCredentials(userKey: keyof typeof testUsers) {
  const user = testUsers[userKey];
  return {
    email: user.email,
    password: user.password
  };
}

/**
 * Get all users by role
 */
export function getUsersByRole(role: string): TestUser[] {
  return Object.values(testUsers).filter(user => user.role === role);
}

/**
 * Get all users by organization type
 */
export function getUsersByOrgType(orgType: TestUser['organizationType']): TestUser[] {
  return Object.values(testUsers).filter(user => user.organizationType === orgType);
}
