/**
 * Tender Type Definitions Fixtures
 * Based on PPR 2008 Rules and MASTER_TESTING_PLAN_REVISED.md Section 3.3
 */

export interface TenderTypeDefinition {
  code: string;
  name: string;
  procurementType: 'goods' | 'works' | 'services';
  method: 'rfq' | 'open' | 'limited' | 'direct' | 'turnkey';
  minValueBdt: number;
  maxValueBdt: number | null;
  requiresTenderSecurity: boolean;
  isGovtType: boolean;
  isDirectProcurement: boolean;
  requiresPrequalification: boolean;
  description?: string;
  securityPercentage?: {
    bid: number;
    performance: number;
  };
}

export const tenderTypeDefinitions: Record<string, TenderTypeDefinition> = {
  // Government Goods Types
  PG1: {
    code: 'PG1',
    name: 'RFQ - Goods (Up to 8 Lac)',
    procurementType: 'goods',
    method: 'rfq',
    minValueBdt: 0,
    maxValueBdt: 800000,
    requiresTenderSecurity: false,
    isGovtType: true,
    isDirectProcurement: false,
    requiresPrequalification: false,
    description: 'Request for Quotation for goods up to 8 Lac BDT'
  },

  PG2: {
    code: 'PG2',
    name: 'Open Tendering - Goods (8-50 Lac)',
    procurementType: 'goods',
    method: 'open',
    minValueBdt: 800000,
    maxValueBdt: 5000000,
    requiresTenderSecurity: true,
    isGovtType: true,
    isDirectProcurement: false,
    requiresPrequalification: false,
    description: 'Open tendering for goods between 8-50 Lac BDT',
    securityPercentage: {
      bid: 2,
      performance: 5
    }
  },

  PG3: {
    code: 'PG3',
    name: 'Open Tendering - Goods (Above 50 Lac)',
    procurementType: 'goods',
    method: 'open',
    minValueBdt: 5000000,
    maxValueBdt: null,
    requiresTenderSecurity: true,
    isGovtType: true,
    isDirectProcurement: false,
    requiresPrequalification: false,
    description: 'Open tendering for goods above 50 Lac BDT',
    securityPercentage: {
      bid: 2,
      performance: 5
    }
  },

  PG4: {
    code: 'PG4',
    name: 'International Open Tendering - Goods',
    procurementType: 'goods',
    method: 'open',
    minValueBdt: 10000000,
    maxValueBdt: null,
    requiresTenderSecurity: true,
    isGovtType: true,
    isDirectProcurement: false,
    requiresPrequalification: true,
    description: 'International competitive bidding for goods',
    securityPercentage: {
      bid: 2,
      performance: 5
    }
  },

  PG5A: {
    code: 'PG5A',
    name: 'Turnkey Procurement - Goods',
    procurementType: 'goods',
    method: 'turnkey',
    minValueBdt: 5000000,
    maxValueBdt: null,
    requiresTenderSecurity: true,
    isGovtType: true,
    isDirectProcurement: false,
    requiresPrequalification: true,
    description: 'Turnkey procurement for integrated projects',
    securityPercentage: {
      bid: 2,
      performance: 10
    }
  },

  PG9A: {
    code: 'PG9A',
    name: 'Emergency/Single Source - Goods',
    procurementType: 'goods',
    method: 'direct',
    minValueBdt: 0,
    maxValueBdt: null,
    requiresTenderSecurity: false,
    isGovtType: true,
    isDirectProcurement: true,
    requiresPrequalification: false,
    description: 'Emergency or single source procurement'
  },

  // Government Works Types
  PW1: {
    code: 'PW1',
    name: 'RFQ - Works (Up to 8 Lac)',
    procurementType: 'works',
    method: 'rfq',
    minValueBdt: 0,
    maxValueBdt: 800000,
    requiresTenderSecurity: false,
    isGovtType: true,
    isDirectProcurement: false,
    requiresPrequalification: false,
    description: 'Request for Quotation for works up to 8 Lac BDT'
  },

  PW3: {
    code: 'PW3',
    name: 'Open Tendering - Works (Above 50 Lac)',
    procurementType: 'works',
    method: 'open',
    minValueBdt: 5000000,
    maxValueBdt: null,
    requiresTenderSecurity: true,
    isGovtType: true,
    isDirectProcurement: false,
    requiresPrequalification: true,
    description: 'Open tendering for works above 50 Lac BDT',
    securityPercentage: {
      bid: 2,
      performance: 10
    }
  },

  // Government Services Types
  PPS2: {
    code: 'PPS2',
    name: 'Open Tendering - Services (8-50 Lac)',
    procurementType: 'services',
    method: 'open',
    minValueBdt: 800000,
    maxValueBdt: 5000000,
    requiresTenderSecurity: true,
    isGovtType: true,
    isDirectProcurement: false,
    requiresPrequalification: false,
    description: 'Open tendering for services',
    securityPercentage: {
      bid: 2,
      performance: 5
    }
  },

  PPS3: {
    code: 'PPS3',
    name: 'Open Tendering - Services (Above 50 Lac)',
    procurementType: 'services',
    method: 'open',
    minValueBdt: 5000000,
    maxValueBdt: null,
    requiresTenderSecurity: true,
    isGovtType: true,
    isDirectProcurement: false,
    requiresPrequalification: false,
    description: 'Open tendering for services above 50 Lac BDT',
    securityPercentage: {
      bid: 2,
      performance: 5
    }
  },

  PPS6: {
    code: 'PPS6',
    name: 'Outsourcing Services',
    procurementType: 'services',
    method: 'open',
    minValueBdt: 0,
    maxValueBdt: null,
    requiresTenderSecurity: true,
    isGovtType: true,
    isDirectProcurement: false,
    requiresPrequalification: false,
    description: 'Outsourcing of services',
    securityPercentage: {
      bid: 2,
      performance: 5
    }
  },

  // Non-Government Types (NRQ)
  NRQ1: {
    code: 'NRQ1',
    name: 'Limited RFQ - Non-Govt (Up to 5 Lac)',
    procurementType: 'goods',
    method: 'limited',
    minValueBdt: 0,
    maxValueBdt: 500000,
    requiresTenderSecurity: false,
    isGovtType: false,
    isDirectProcurement: false,
    requiresPrequalification: false,
    description: 'Limited RFQ for non-government entities'
  },

  NRQ2: {
    code: 'NRQ2',
    name: 'Limited Tender - Non-Govt (5-25 Lac)',
    procurementType: 'goods',
    method: 'limited',
    minValueBdt: 500000,
    maxValueBdt: 2500000,
    requiresTenderSecurity: true,
    isGovtType: false,
    isDirectProcurement: false,
    requiresPrequalification: false,
    description: 'Limited tendering for non-government entities',
    securityPercentage: {
      bid: 1,
      performance: 3
    }
  },

  NRQ3: {
    code: 'NRQ3',
    name: 'Open Tender - Non-Govt (Above 25 Lac)',
    procurementType: 'goods',
    method: 'open',
    minValueBdt: 2500000,
    maxValueBdt: null,
    requiresTenderSecurity: true,
    isGovtType: false,
    isDirectProcurement: false,
    requiresPrequalification: false,
    description: 'Open tendering for non-government entities',
    securityPercentage: {
      bid: 2,
      performance: 5
    }
  }
};

/**
 * Get tender types by procurement type
 */
export function getTenderTypesByProcurementType(
  procurementType: 'goods' | 'works' | 'services'
): TenderTypeDefinition[] {
  return Object.values(tenderTypeDefinitions).filter(
    type => type.procurementType === procurementType
  );
}

/**
 * Get government tender types
 */
export function getGovernmentTenderTypes(): TenderTypeDefinition[] {
  return Object.values(tenderTypeDefinitions).filter(type => type.isGovtType);
}

/**
 * Get non-government tender types
 */
export function getNonGovernmentTenderTypes(): TenderTypeDefinition[] {
  return Object.values(tenderTypeDefinitions).filter(type => !type.isGovtType);
}

/**
 * Suggest tender type based on value and procurement type
 */
export function suggestTenderType(
  value: number,
  procurementType: 'goods' | 'works' | 'services',
  isGovernment: boolean
): TenderTypeDefinition | null {
  const applicableTypes = Object.values(tenderTypeDefinitions).filter(type => {
    return (
      type.procurementType === procurementType &&
      type.isGovtType === isGovernment &&
      value >= type.minValueBdt &&
      (type.maxValueBdt === null || value <= type.maxValueBdt)
    );
  });

  return applicableTypes.length > 0 ? applicableTypes[0] : null;
}
