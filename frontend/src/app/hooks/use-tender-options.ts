import tenderOptions from "../config/tender-options.json";

export function useTenderOptions() {
  return {
    tenderTypes: tenderOptions.tenderTypes,
    getTenderSubtypes: (type: string) => tenderOptions.tenderSubtypes[type as keyof typeof tenderOptions.tenderSubtypes] || [],
    procurementMethods: tenderOptions.procurementMethods,
    categories: tenderOptions.categories,
    departments: tenderOptions.departments,
    currencies: tenderOptions.currencies,
    budgetRanges: tenderOptions.budgetRanges,
    evaluationCriteria: tenderOptions.evaluationCriteria,
    paymentTerms: tenderOptions.paymentTerms,
    deliveryTerms: tenderOptions.deliveryTerms,
    contractTypes: tenderOptions.contractTypes,
    contractDurations: tenderOptions.contractDurations,
    documentTypes: tenderOptions.documentTypes,
    qualificationRequirements: tenderOptions.qualificationRequirements,
    ticketCategories: tenderOptions.ticketCategories,
    getTicketCategories: (type: string) => tenderOptions.ticketCategories[type as keyof typeof tenderOptions.ticketCategories] || [],
    ticketPriorities: tenderOptions.ticketPriorities,
    ticketStatuses: tenderOptions.ticketStatuses,
    assigneeTeams: tenderOptions.assigneeTeams,
    userRoles: tenderOptions.userRoles,
    vendorCategories: tenderOptions.vendorCategories,
    companySize: tenderOptions.companySize,
    countries: tenderOptions.countries,
  };
}
