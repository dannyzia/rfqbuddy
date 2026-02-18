/**
 * Test Organization Fixtures
 * Based on MASTER_TESTING_PLAN_REVISED.md Section 3.2
 */

export interface TestOrganization {
  id: string;
  name: string;
  type: 'government' | 'non-government' | 'vendor' | 'system';
  subscriptionPackage?: 'free_try' | 'silver' | 'gold' | 'platinum' | 'custom';
  isActive: boolean;
  address?: string;
  phone?: string;
  email?: string;
}

export const testOrganizations: Record<string, TestOrganization> = {
  // ORG001 - Primary Government Organization
  govOrg1: {
    id: 'org-gov-001',
    name: 'Government Procurement Agency',
    type: 'government',
    subscriptionPackage: 'platinum',
    isActive: true,
    address: 'Dhaka, Bangladesh',
    phone: '+880123456789',
    email: 'procurement@gov.bd'
  },

  // ORG002 - Non-government Organization
  nonGovOrg1: {
    id: 'org-nongov-001',
    name: 'Private Company Ltd',
    type: 'non-government',
    subscriptionPackage: 'gold',
    isActive: true,
    address: 'Dhaka, Bangladesh',
    phone: '+880987654321',
    email: 'info@privatecompany.com'
  },

  // ORG003 - Primary Vendor Organization
  vendorOrg1: {
    id: 'org-vendor-001',
    name: 'Vendor Corp Inc',
    type: 'vendor',
    subscriptionPackage: 'silver',
    isActive: true,
    address: 'Chittagong, Bangladesh',
    phone: '+880111222333',
    email: 'contact@vendorcorp.com'
  },

  // ORG004 - Vendor with Free Tier
  vendorOrg2: {
    id: 'org-vendor-002',
    name: 'Supplier Solutions',
    type: 'vendor',
    subscriptionPackage: 'free_try',
    isActive: true,
    address: 'Sylhet, Bangladesh',
    phone: '+880444555666',
    email: 'info@suppliersolutions.com'
  },

  // ORG005 - Single-user Organization
  soloOrg: {
    id: 'org-solo-001',
    name: 'Solo Buyer Org',
    type: 'government',
    subscriptionPackage: 'free_try',
    isActive: true,
    address: 'Rajshahi, Bangladesh',
    phone: '+880777888999',
    email: 'solo@gov.bd'
  },

  // ORG006 - Third Vendor
  vendorOrg3: {
    id: 'org-vendor-003',
    name: 'Quality Suppliers Ltd',
    type: 'vendor',
    subscriptionPackage: 'gold',
    isActive: true,
    address: 'Khulna, Bangladesh',
    phone: '+880222333444',
    email: 'info@qualitysuppliers.com'
  },

  // System Organization
  systemOrg: {
    id: 'org-system-001',
    name: 'RFQ Buddy System',
    type: 'system',
    isActive: true,
    email: 'admin@rfqbuddy.com'
  }
};

/**
 * Factory function to create custom test organization
 */
export function createTestOrganization(
  overrides: Partial<TestOrganization> = {}
): TestOrganization {
  const timestamp = Date.now();
  return {
    id: `org-test-${timestamp}`,
    name: `Test Organization ${timestamp}`,
    type: 'government',
    subscriptionPackage: 'free_try',
    isActive: true,
    ...overrides
  };
}

/**
 * Get all organizations by type
 */
export function getOrganizationsByType(
  type: TestOrganization['type']
): TestOrganization[] {
  return Object.values(testOrganizations).filter(org => org.type === type);
}

/**
 * Get all organizations by subscription package
 */
export function getOrganizationsByPackage(
  packageName: TestOrganization['subscriptionPackage']
): TestOrganization[] {
  return Object.values(testOrganizations).filter(
    org => org.subscriptionPackage === packageName
  );
}
