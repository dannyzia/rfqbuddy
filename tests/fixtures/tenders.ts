/**
 * Test Tender Fixtures
 * Based on MASTER_TESTING_PLAN_REVISED.md Section 3.3
 */

export interface TestTender {
  id: string;
  organizationId: string;
  createdBy: string;
  tenderNumber?: string;
  tenderTypeCode: string;
  title: string;
  description: string;
  procurementType: 'goods' | 'works' | 'services';
  estimatedValue: number;
  currency: string;
  status: 'draft' | 'published' | 'closed' | 'evaluated' | 'awarded' | 'cancelled';
  publishedAt?: Date;
  submissionDeadline?: Date;
  openingDate?: Date;
  requiresTenderSecurity: boolean;
  items?: TestTenderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TestTenderItem {
  id: string;
  tenderId: string;
  itemNumber: number;
  description: string;
  quantity: number;
  unit: string;
  specifications?: string;
}

// Draft Tenders
export const draftTenderPG1: TestTender = {
  id: 'tender-draft-pg1-001',
  organizationId: 'org-gov-001',
  createdBy: 'user-gov-buyer-001',
  tenderTypeCode: 'PG1',
  title: 'Office Supplies Procurement',
  description: 'Procurement of office supplies including stationery and equipment',
  procurementType: 'goods',
  estimatedValue: 500000,
  currency: 'BDT',
  status: 'draft',
  requiresTenderSecurity: false,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01')
};

export const draftTenderPG2: TestTender = {
  id: 'tender-draft-pg2-001',
  organizationId: 'org-gov-001',
  createdBy: 'user-gov-buyer-001',
  tenderTypeCode: 'PG2',
  title: 'Computer Hardware Procurement',
  description: 'Procurement of desktop computers and peripherals',
  procurementType: 'goods',
  estimatedValue: 3000000,
  currency: 'BDT',
  status: 'draft',
  requiresTenderSecurity: true,
  createdAt: new Date('2026-01-05'),
  updatedAt: new Date('2026-01-05')
};

// Published Tenders
export const publishedTenderPG2: TestTender = {
  id: 'tender-published-pg2-001',
  organizationId: 'org-gov-001',
  createdBy: 'user-gov-buyer-001',
  tenderNumber: 'TDR-2026-0001',
  tenderTypeCode: 'PG2',
  title: 'Medical Equipment Procurement',
  description: 'Procurement of medical diagnostic equipment for government hospital',
  procurementType: 'goods',
  estimatedValue: 4000000,
  currency: 'BDT',
  status: 'published',
  publishedAt: new Date('2026-02-01'),
  submissionDeadline: new Date('2026-03-01'),
  openingDate: new Date('2026-03-02'),
  requiresTenderSecurity: true,
  items: [
    {
      id: 'item-001',
      tenderId: 'tender-published-pg2-001',
      itemNumber: 1,
      description: 'X-Ray Machine',
      quantity: 2,
      unit: 'pc',
      specifications: 'Digital X-Ray machine with minimum 500mA capacity'
    },
    {
      id: 'item-002',
      tenderId: 'tender-published-pg2-001',
      itemNumber: 2,
      description: 'Ultrasound Scanner',
      quantity: 3,
      unit: 'pc',
      specifications: '4D Color Doppler ultrasound scanner'
    },
    {
      id: 'item-003',
      tenderId: 'tender-published-pg2-001',
      itemNumber: 3,
      description: 'ECG Machine',
      quantity: 5,
      unit: 'pc',
      specifications: '12-channel ECG machine'
    }
  ],
  createdAt: new Date('2026-01-15'),
  updatedAt: new Date('2026-02-01')
};

export const publishedTenderPG3: TestTender = {
  id: 'tender-published-pg3-001',
  organizationId: 'org-gov-001',
  createdBy: 'user-gov-buyer-001',
  tenderNumber: 'TDR-2026-0002',
  tenderTypeCode: 'PG3',
  title: 'Vehicle Procurement for Government Fleet',
  description: 'Procurement of 20 sedans and 10 SUVs for government use',
  procurementType: 'goods',
  estimatedValue: 85000000,
  currency: 'BDT',
  status: 'published',
  publishedAt: new Date('2026-02-05'),
  submissionDeadline: new Date('2026-03-15'),
  openingDate: new Date('2026-03-16'),
  requiresTenderSecurity: true,
  items: [
    {
      id: 'item-004',
      tenderId: 'tender-published-pg3-001',
      itemNumber: 1,
      description: 'Mid-size Sedan',
      quantity: 20,
      unit: 'pc',
      specifications: '1500cc-2000cc engine, automatic transmission'
    },
    {
      id: 'item-005',
      tenderId: 'tender-published-pg3-001',
      itemNumber: 2,
      description: 'SUV',
      quantity: 10,
      unit: 'pc',
      specifications: '2500cc-3000cc engine, 4WD, 7-seater'
    }
  ],
  createdAt: new Date('2026-01-20'),
  updatedAt: new Date('2026-02-05')
};

// Closed Tender (with bids)
export const closedTenderPG2: TestTender = {
  id: 'tender-closed-pg2-001',
  organizationId: 'org-gov-001',
  createdBy: 'user-gov-buyer-001',
  tenderNumber: 'TDR-2026-0003',
  tenderTypeCode: 'PG2',
  title: 'Furniture Procurement',
  description: 'Office furniture for new government building',
  procurementType: 'goods',
  estimatedValue: 2500000,
  currency: 'BDT',
  status: 'closed',
  publishedAt: new Date('2026-01-10'),
  submissionDeadline: new Date('2026-02-10'),
  openingDate: new Date('2026-02-11'),
  requiresTenderSecurity: true,
  createdAt: new Date('2026-01-05'),
  updatedAt: new Date('2026-02-11')
};

// Awarded Tender
export const awardedTenderPG2: TestTender = {
  id: 'tender-awarded-pg2-001',
  organizationId: 'org-gov-001',
  createdBy: 'user-gov-buyer-001',
  tenderNumber: 'TDR-2025-0099',
  tenderTypeCode: 'PG2',
  title: 'Stationery Supplies Annual Contract',
  description: 'Annual contract for stationery supplies',
  procurementType: 'goods',
  estimatedValue: 1500000,
  currency: 'BDT',
  status: 'awarded',
  publishedAt: new Date('2025-11-01'),
  submissionDeadline: new Date('2025-12-01'),
  openingDate: new Date('2025-12-02'),
  requiresTenderSecurity: true,
  createdAt: new Date('2025-10-25'),
  updatedAt: new Date('2025-12-15')
};

// Cancelled Tender
export const cancelledTenderPG1: TestTender = {
  id: 'tender-cancelled-pg1-001',
  organizationId: 'org-gov-001',
  createdBy: 'user-gov-buyer-001',
  tenderNumber: 'TDR-2026-0004',
  tenderTypeCode: 'PG1',
  title: 'Software Licenses (Cancelled)',
  description: 'Software licenses - project cancelled',
  procurementType: 'goods',
  estimatedValue: 600000,
  currency: 'BDT',
  status: 'cancelled',
  publishedAt: new Date('2026-01-15'),
  submissionDeadline: new Date('2026-02-15'),
  requiresTenderSecurity: false,
  createdAt: new Date('2026-01-10'),
  updatedAt: new Date('2026-01-20')
};

// Limited Tender (NRQ)
export const limitedTenderNRQ1: TestTender = {
  id: 'tender-limited-nrq1-001',
  organizationId: 'org-nongov-001',
  createdBy: 'user-nongov-buyer-001',
  tenderNumber: 'NRQ-2026-0001',
  tenderTypeCode: 'NRQ1',
  title: 'Office Supplies - Private Company',
  description: 'Office supplies for private company',
  procurementType: 'goods',
  estimatedValue: 350000,
  currency: 'BDT',
  status: 'published',
  publishedAt: new Date('2026-02-10'),
  submissionDeadline: new Date('2026-02-25'),
  requiresTenderSecurity: false,
  createdAt: new Date('2026-02-08'),
  updatedAt: new Date('2026-02-10')
};

// Works Tender
export const worksTenderPW1: TestTender = {
  id: 'tender-works-pw1-001',
  organizationId: 'org-gov-001',
  createdBy: 'user-gov-buyer-001',
  tenderNumber: 'TDR-2026-0005',
  tenderTypeCode: 'PW1',
  title: 'Office Renovation Works',
  description: 'Renovation of government office building',
  procurementType: 'works',
  estimatedValue: 750000,
  currency: 'BDT',
  status: 'published',
  publishedAt: new Date('2026-02-12'),
  submissionDeadline: new Date('2026-03-12'),
  requiresTenderSecurity: false,
  createdAt: new Date('2026-02-10'),
  updatedAt: new Date('2026-02-12')
};

// Services Tender
export const servicesTenderPPS2: TestTender = {
  id: 'tender-services-pps2-001',
  organizationId: 'org-gov-001',
  createdBy: 'user-gov-buyer-001',
  tenderNumber: 'TDR-2026-0006',
  tenderTypeCode: 'PPS2',
  title: 'IT Support Services',
  description: 'Annual IT support and maintenance services',
  procurementType: 'services',
  estimatedValue: 1200000,
  currency: 'BDT',
  status: 'published',
  publishedAt: new Date('2026-02-14'),
  submissionDeadline: new Date('2026-03-14'),
  requiresTenderSecurity: true,
  createdAt: new Date('2026-02-12'),
  updatedAt: new Date('2026-02-14')
};

/**
 * All test tenders collection
 */
export const testTenders: Record<string, TestTender> = {
  draftPG1: draftTenderPG1,
  draftPG2: draftTenderPG2,
  publishedPG2: publishedTenderPG2,
  publishedPG3: publishedTenderPG3,
  closedPG2: closedTenderPG2,
  awardedPG2: awardedTenderPG2,
  cancelledPG1: cancelledTenderPG1,
  limitedNRQ1: limitedTenderNRQ1,
  worksPW1: worksTenderPW1,
  servicesPPS2: servicesTenderPPS2
};

/**
 * Factory function to create custom test tender
 */
export function createTestTender(overrides: Partial<TestTender> = {}): TestTender {
  const timestamp = Date.now();
  return {
    id: `tender-test-${timestamp}`,
    organizationId: 'org-gov-001',
    createdBy: 'user-gov-buyer-001',
    tenderTypeCode: 'PG1',
    title: `Test Tender ${timestamp}`,
    description: 'Test tender description',
    procurementType: 'goods',
    estimatedValue: 500000,
    currency: 'BDT',
    status: 'draft',
    requiresTenderSecurity: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
}

/**
 * Get tenders by status
 */
export function getTendersByStatus(
  status: TestTender['status']
): TestTender[] {
  return Object.values(testTenders).filter(tender => tender.status === status);
}

/**
 * Get tenders by procurement type
 */
export function getTendersByProcurementType(
  procurementType: 'goods' | 'works' | 'services'
): TestTender[] {
  return Object.values(testTenders).filter(
    tender => tender.procurementType === procurementType
  );
}
