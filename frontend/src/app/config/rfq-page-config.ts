// ─── Mock GET /api/v1/config — RFQ List Page Slice ──────────────────────────
// In production, this entire object comes from a single API call.
// ZERO hardcoded values are allowed in the consuming component.

export interface StatusBadgeConfig {
  label: string;
  variant: "solid" | "secondary" | "outline";
  className: string; // Tailwind classes for the badge
}

export interface StageBadgeConfig {
  label: string;
  className: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface ColumnDef {
  id: string;
  header: string;
  align: "left" | "right" | "center";
  visibleMobile: boolean;
  minWidth?: string;
  sortable?: boolean;
  sortKey?: string; // maps to TenderItemConfig field — e.g. "id", "title", "bids"
}

export interface CreateMenuItem {
  id: string;
  group: string;
  groupColor: string;
  label: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  path: string;
  visible: boolean;
}

export interface MenuGroupConfig {
  key: string;
  label: string;
  labelColor: string;
}

export interface BulkActionConfig {
  id: string;
  label: string;
  icon: string;
  variant: "default" | "destructive" | "outline" | "ghost";
  className: string;
  confirmMessage: string;
  requiredPermission: string;
}

export interface PaginationConfig {
  enabled: boolean;
  defaultPageSize: number;
  pageSizeOptions: number[];
  labels: {
    showing: string;       // "Showing {{from}}-{{to}} of {{total}}"
    perPage: string;       // "per page"
    previous: string;
    next: string;
    page: string;
    of: string;
  };
}

export interface StatCardConfig {
  id: string;
  label: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  valueKey: string; // "total" | "pendingAction" | "completed"
}

export interface EmptyStateConfig {
  icon: string;
  title: string;
  description: string;
  evaluatorDescription: string;
  ctaLabel: string;
  ctaPath: string;
  ctaVisible: string; // permission key: "canCreateTender"
}

export interface ErrorStateConfig {
  icon: string;
  title: string;
  description: string;
  retryLabel: string;
}

export interface LoadingConfig {
  skeletonRows: number;
  text: string;
}

export interface VendorRedirectConfig {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string; // "As a {{roleLabel}}, you can..."
  ctaLabel: string;
  ctaPath: string;
}

export interface ApprovalBannerConfig {
  icon: string;
  iconBg: string;
  iconColor: string;
  bgClass: string;
  borderClass: string;
  titleTemplate: string;   // "{{count}} tender(s) pending your final approval"
  subtitle: string;
  ctaLabel: string;
  ctaFilterValue: string;
}

export interface RowActionConfig {
  id: string;
  label: string;
  icon: string;
  variant: "default" | "destructive" | "outline" | "ghost";
  className: string;
  condition: string; // "always" | "draft" | "active" | "withheld" | "pendingMyStage" | "pendingApproval"
  requiredPermission?: string;
  linkTemplate?: string; // "/tenders/{{id}}" or "/tenders/{{id}}/award"
  confirmTemplate?: string; // "Withhold tender {{id}}?"
  roles: string[]; // which roles see this action: ["all"] or ["procurer", "pe_admin"]
}

export interface RfqPageConfig {
  page: {
    titleTemplates: Record<string, string>;
    descriptionTemplates: Record<string, string>;
    defaultTitle: string;
    defaultDescription: string;
  };
  uiStrings: {
    searchPlaceholder: string;
    footerShowingTemplate: string;
    footerRoleTemplate: string;
    superAdminSuffix: string;
    peAdminSuffix: string;
    bulkSelectedTemplate: string;
    selectAll: string;
    deselectAll: string;
    mobileSortLabel: string;        // "Sort by"
    mobileSortNone: string;         // "Default order"
    mobileSortAscSuffix: string;    // " (A→Z / Low→High)"
    mobileSortDescSuffix: string;   // " (Z→A / High→Low)"
  };
  filters: {
    statusOptions: FilterOption[];
    typeOptions: FilterOption[];
  };
  columns: ColumnDef[];
  statusBadges: Record<string, StatusBadgeConfig>;
  stageBadges: Record<string, StageBadgeConfig>;
  createMenu: {
    groups: MenuGroupConfig[];
    items: CreateMenuItem[];
    presetsGroup: MenuGroupConfig;
    dropdownTitle: string;
  };
  bulkActions: BulkActionConfig[];
  pagination: PaginationConfig;
  statCards: StatCardConfig[];
  emptyState: EmptyStateConfig;
  errorState: ErrorStateConfig;
  loading: LoadingConfig;
  vendorRedirect: VendorRedirectConfig;
  approvalBanner: ApprovalBannerConfig;
  rowActions: RowActionConfig[];
  tenders: TenderItemConfig[];
}

export interface TenderItemConfig {
  id: string;
  title: string;
  type: string;
  tenderType: string;
  status: string;
  deadline: string;
  bids: number;
  estimatedValue: string;
  currentStage: string;
  recommendedVendor?: string;
  createdBy: string;
}

// ─── The actual mock config ─────────────────────────────────────────────────

export const RFQ_PAGE_CONFIG: RfqPageConfig = {
  page: {
    titleTemplates: {
      vendor_admin: "Available RFQs",
      sales_executive: "Available RFQs",
      sales_manager: "Available RFQs",
      prequal_evaluator: "My Evaluations \u2014 {{roleLabel}}",
      tech_evaluator: "My Evaluations \u2014 {{roleLabel}}",
      commercial_evaluator: "My Evaluations \u2014 {{roleLabel}}",
      auditor: "My Evaluations \u2014 {{roleLabel}}",
      procurement_head: "My Tenders \u2014 Procurement Head",
      pe_admin: "All Organisation Tenders",
      super_admin: "Platform Tender Oversight",
    },
    descriptionTemplates: {
      vendor_admin: "Please navigate to /rfqs to view available tenders",
      sales_executive: "Please navigate to /rfqs to view available tenders",
      sales_manager: "Please navigate to /rfqs to view available tenders",
      prequal_evaluator: "Showing {{count}} tender(s) you are tagged on as {{roleLabel}}.",
      tech_evaluator: "Showing {{count}} tender(s) you are tagged on as {{roleLabel}}.",
      commercial_evaluator: "Showing {{count}} tender(s) you are tagged on as {{roleLabel}}.",
      auditor: "Showing {{count}} tender(s) you are tagged on as {{roleLabel}}.",
      procurement_head: "Showing {{count}} tender(s) you are tagged on. Your decision is needed on pending approvals.",
      pe_admin: "All tenders within {{organisation}}. As Procuring Entity Admin you have full organisation visibility.",
      super_admin: "Platform-wide view of all tenders across all procuring entities.",
    },
    defaultTitle: "My Tenders & RFQs",
    defaultDescription: "Showing {{count}} tender(s) you are tagged on. You can only see tenders where you have been assigned.",
  },

  uiStrings: {
    searchPlaceholder: "Search tenders by ID, title, or type\u2026",
    footerShowingTemplate: "Showing {{count}} tender(s) tagged to you",
    footerRoleTemplate: "Role: {{roleLabel}}",
    superAdminSuffix: " (Super Admin: platform-wide)",
    peAdminSuffix: " (PE Admin: all organisation tenders)",
    bulkSelectedTemplate: "{{count}} selected",
    selectAll: "Select all",
    deselectAll: "Deselect all",
    mobileSortLabel: "Sort by",
    mobileSortNone: "Default order",
    mobileSortAscSuffix: " (A→Z / Low→High)",
    mobileSortDescSuffix: " (Z→A / High→Low)",
  },

  filters: {
    statusOptions: [
      { value: "all", label: "All Status" },
      { value: "Draft", label: "Draft" },
      { value: "Active", label: "Active" },
      { value: "Evaluation", label: "Evaluation" },
      { value: "Pending Audit", label: "Pending Audit" },
      { value: "Pending Final Approval", label: "Pending Approval" },
      { value: "Withheld", label: "Withheld" },
      { value: "Closed", label: "Closed" },
      { value: "Awarded", label: "Awarded" },
    ],
    typeOptions: [
      { value: "all", label: "All Types" },
      { value: "Goods", label: "Goods" },
      { value: "Works", label: "Works" },
      { value: "Services", label: "Services" },
    ],
  },

  columns: [
    { id: "select", header: "", align: "center", visibleMobile: false, minWidth: "40px" },
    { id: "reference", header: "Reference", align: "left", visibleMobile: true, sortable: true, sortKey: "id" },
    { id: "title", header: "Title", align: "left", visibleMobile: true, sortable: true, sortKey: "title" },
    { id: "type", header: "Type", align: "left", visibleMobile: true, sortable: true, sortKey: "type" },
    { id: "status", header: "Status", align: "left", visibleMobile: true, sortable: true, sortKey: "status" },
    { id: "stage", header: "Workflow Stage", align: "left", visibleMobile: true, sortable: false },
    { id: "deadline", header: "Deadline", align: "left", visibleMobile: true, sortable: true, sortKey: "deadline" },
    { id: "bids", header: "Bids", align: "center", visibleMobile: true, sortable: true, sortKey: "bids" },
    { id: "value", header: "Est. Value", align: "left", visibleMobile: true, sortable: true, sortKey: "estimatedValue" },
    { id: "recommendedVendor", header: "Recommended", align: "left", visibleMobile: false, sortable: false },
    { id: "actions", header: "Actions", align: "right", visibleMobile: true, sortable: false },
  ],

  statusBadges: {
    Active:                   { label: "Active", variant: "solid", className: "bg-green-600" },
    Draft:                    { label: "Draft", variant: "secondary", className: "" },
    Evaluation:               { label: "Evaluation", variant: "solid", className: "bg-blue-600" },
    Withheld:                 { label: "Withheld", variant: "solid", className: "bg-orange-600" },
    Closed:                   { label: "Closed", variant: "solid", className: "bg-muted-foreground" },
    "Pending Audit":          { label: "Pending Audit", variant: "solid", className: "bg-red-500" },
    "Pending Final Approval": { label: "Pending Approval", variant: "solid", className: "bg-indigo-600" },
    Awarded:                  { label: "Awarded", variant: "solid", className: "bg-emerald-600" },
    Cancelled:                { label: "Cancelled", variant: "solid", className: "bg-red-700" },
  },

  stageBadges: {
    draft:                    { label: "Drafting", className: "bg-muted text-muted-foreground" },
    active:                   { label: "Accepting Bids", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    pending_prequal:          { label: "PreQual Review", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
    pending_tech_eval:        { label: "Tech Evaluation", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    pending_commercial_eval:  { label: "Commercial Eval", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
    pending_audit:            { label: "Audit Review", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    pending_recommendation:   { label: "Recommendation", className: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
    pending_approval:         { label: "Pending Approval", className: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
    completed:                { label: "Completed", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    withheld:                 { label: "Withheld", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
    closed:                   { label: "Closed", className: "bg-muted text-muted-foreground" },
  },

  createMenu: {
    groups: [
      { key: "govt", label: "Government", labelColor: "text-red-600 dark:text-red-400" },
      { key: "non_govt", label: "Non-Government", labelColor: "text-teal-600 dark:text-teal-400" },
    ],
    items: [
      {
        id: "govt_tender", group: "govt", groupColor: "text-red-600 dark:text-red-400",
        label: "Government Tender", description: "PG, PW, PPS types \u2014 Full 14-segment form",
        icon: "building-2", iconBg: "bg-red-100 dark:bg-red-900/30", iconColor: "text-red-600 dark:text-red-400",
        path: "/tenders/new", visible: true,
      },
      {
        id: "simple_rfq", group: "non_govt", groupColor: "text-teal-600 dark:text-teal-400",
        label: "Simple RFQ", description: "Quick 8-segment form \u2014 up to BDT 20 Lac",
        icon: "file-text", iconBg: "bg-teal-100 dark:bg-teal-900/30", iconColor: "text-teal-600 dark:text-teal-400",
        path: "/tenders/new/simple", visible: true,
      },
      {
        id: "detailed_rfq", group: "non_govt", groupColor: "text-blue-600 dark:text-blue-400",
        label: "Detailed RFQ / Tender", description: "11-segment form \u2014 up to BDT 30 Lac",
        icon: "clipboard-check", iconBg: "bg-blue-100 dark:bg-blue-900/30", iconColor: "text-blue-600 dark:text-blue-400",
        path: "/tenders/new/detailed", visible: true,
      },
      {
        id: "rfp", group: "non_govt", groupColor: "text-purple-600 dark:text-purple-400",
        label: "Request for Proposal (RFP)", description: "Full 14-segment RFP with QCBS evaluation",
        icon: "lightbulb", iconBg: "bg-purple-100 dark:bg-purple-900/30", iconColor: "text-purple-600 dark:text-purple-400",
        path: "/tenders/new/rfp", visible: true,
      },
    ],
    presetsGroup: { key: "presets", label: "My Saved Presets", labelColor: "text-amber-600 dark:text-amber-400" },
    dropdownTitle: "Select Tender Type",
  },

  bulkActions: [
    {
      id: "bulk_close", label: "Close Selected", icon: "x-circle",
      variant: "destructive", className: "",
      confirmMessage: "Close {{count}} selected tender(s)?",
      requiredPermission: "canDeleteTender",
    },
    {
      id: "bulk_withhold", label: "Withhold Selected", icon: "shield",
      variant: "outline", className: "text-yellow-600 border-yellow-600",
      confirmMessage: "Withhold {{count}} selected tender(s)?",
      requiredPermission: "canWithholdTender",
    },
    {
      id: "bulk_export", label: "Export CSV", icon: "download",
      variant: "outline", className: "",
      confirmMessage: "",
      requiredPermission: "canViewAllOrgTenders",
    },
  ],

  pagination: {
    enabled: true,
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
    labels: {
      showing: "Showing",
      perPage: "per page",
      previous: "Previous",
      next: "Next",
      page: "Page",
      of: "of",
    },
  },

  statCards: [
    {
      id: "tagged_total", label: "Tagged to You", icon: "file-text",
      iconBg: "bg-blue-100 dark:bg-blue-900/30", iconColor: "text-blue-600 dark:text-blue-400",
      valueKey: "total",
    },
    {
      id: "pending_action", label: "Pending Your Action", icon: "alert-triangle",
      iconBg: "bg-orange-100 dark:bg-orange-900/30", iconColor: "text-orange-600 dark:text-orange-400",
      valueKey: "pendingAction",
    },
    {
      id: "completed", label: "Completed", icon: "check-circle-2",
      iconBg: "bg-green-100 dark:bg-green-900/30", iconColor: "text-green-600 dark:text-green-400",
      valueKey: "completed",
    },
  ],

  emptyState: {
    icon: "filter",
    title: "No tenders found",
    description: "No tenders match your filters. You can only see tenders where you are tagged on.",
    evaluatorDescription: "No tenders are currently tagged to you for evaluation.",
    ctaLabel: "Create New Tender",
    ctaPath: "/tenders/new",
    ctaVisible: "canCreateTender",
  },

  errorState: {
    icon: "alert-circle",
    title: "Failed to load tenders",
    description: "Something went wrong while fetching your tenders. Please check your connection and try again.",
    retryLabel: "Retry",
  },

  loading: {
    skeletonRows: 5,
    text: "Loading tenders\u2026",
  },

  vendorRedirect: {
    icon: "building-2",
    iconBg: "bg-teal-100 dark:bg-teal-900/30",
    iconColor: "text-teal-600 dark:text-teal-400",
    title: "Vendor Portal",
    description: "As a {{roleLabel}}, you can browse and bid on available tenders through the Vendor Portal.",
    ctaLabel: "Go to Available RFQs",
    ctaPath: "/rfqs",
  },

  approvalBanner: {
    icon: "check-circle-2",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    bgClass: "bg-indigo-50 dark:bg-indigo-900/20",
    borderClass: "border-indigo-200 dark:border-indigo-800",
    titleTemplate: "{{count}} tender(s) pending your final approval",
    subtitle: "All evaluation stages complete. Your decision is needed.",
    ctaLabel: "Show Pending",
    ctaFilterValue: "Pending Final Approval",
  },

  rowActions: [
    {
      id: "view", label: "View", icon: "eye", variant: "ghost", className: "",
      condition: "always", roles: ["all"],
      linkTemplate: "/tenders/{{id}}",
    },
    {
      id: "edit", label: "Edit", icon: "pencil", variant: "outline", className: "",
      condition: "draft", roles: ["procurer"],
      linkTemplate: "/tenders/new",
    },
    {
      id: "withhold", label: "Withhold", icon: "shield", variant: "outline",
      className: "text-yellow-600 border-yellow-600",
      condition: "active", requiredPermission: "canWithholdTender",
      roles: ["procurer", "pe_admin", "procurement_head"],
      confirmTemplate: "Withhold tender {{id}}?",
    },
    {
      id: "close", label: "Close", icon: "x-circle", variant: "outline",
      className: "text-red-600 border-red-600",
      condition: "active", requiredPermission: "canWithholdTender",
      roles: ["procurer"],
      confirmTemplate: "Close tender {{id}}?",
    },
    {
      id: "reactivate", label: "Reactivate", icon: "refresh-cw", variant: "outline",
      className: "text-green-600 border-green-600",
      condition: "withheld", roles: ["procurer"],
    },
    {
      id: "start_eval", label: "Start Evaluation", icon: "play", variant: "default",
      className: "bg-green-600 hover:bg-green-700 text-white",
      condition: "pendingMyStage", roles: ["prequal_evaluator", "tech_evaluator", "commercial_evaluator", "auditor"],
    },
    {
      id: "approve", label: "Approve", icon: "check-circle-2", variant: "default",
      className: "bg-indigo-600 hover:bg-indigo-700 text-white",
      condition: "pendingApproval", roles: ["procurement_head"],
      linkTemplate: "/tenders/{{id}}/award",
    },
  ],

  tenders: [
    {
      id: "PG-2026-001", title: "Office Supplies Procurement", type: "Goods", tenderType: "govt",
      status: "Active", deadline: "Mar 20, 2026", bids: 8, estimatedValue: "BDT 45,00,000",
      currentStage: "active", createdBy: "u-proc-01",
    },
    {
      id: "PW-2026-015", title: "Road Construction Project", type: "Works", tenderType: "govt",
      status: "Active", deadline: "Mar 25, 2026", bids: 12, estimatedValue: "BDT 2,50,00,000",
      currentStage: "active", createdBy: "u-proc-01",
    },
    {
      id: "PPS-2026-008", title: "IT Consulting Services", type: "Services", tenderType: "rfp",
      status: "Draft", deadline: "Apr 1, 2026", bids: 0, estimatedValue: "BDT 1,20,00,000",
      currentStage: "draft", createdBy: "u-proc-01",
    },
    {
      id: "PG-2026-003", title: "Medical Equipment", type: "Goods", tenderType: "govt",
      status: "Evaluation", deadline: "Mar 10, 2026", bids: 15, estimatedValue: "BDT 8,50,00,000",
      currentStage: "pending_tech_eval", createdBy: "u-proc-01",
    },
    {
      id: "PG-2026-004", title: "Laboratory Equipment", type: "Goods", tenderType: "nrq2",
      status: "Withheld", deadline: "Mar 15, 2026", bids: 5, estimatedValue: "BDT 28,00,000",
      currentStage: "withheld", createdBy: "u-proc-01",
    },
    {
      id: "PW-2026-012", title: "Building Renovation", type: "Works", tenderType: "govt",
      status: "Pending Audit", deadline: "Mar 5, 2026", bids: 9, estimatedValue: "BDT 3,75,00,000",
      currentStage: "pending_audit", recommendedVendor: "Global Traders Inc.", createdBy: "u-proc-01",
    },
    {
      id: "NRQ1-2026-022", title: "Stationery Supplies Q1", type: "Goods", tenderType: "nrq1",
      status: "Pending Final Approval", deadline: "Mar 8, 2026", bids: 4, estimatedValue: "BDT 5,50,000",
      currentStage: "pending_approval", recommendedVendor: "ABC Suppliers Ltd.", createdBy: "u-proc-01",
    },
    {
      id: "RFP-2026-005", title: "ERP System Implementation", type: "Services", tenderType: "rfp",
      status: "Evaluation", deadline: "Feb 28, 2026", bids: 6, estimatedValue: "BDT 5,00,00,000",
      currentStage: "pending_commercial_eval", createdBy: "u-proc-01",
    },
    {
      id: "PG-2026-009", title: "Printing Paper Supply", type: "Goods", tenderType: "nrq1",
      status: "Active", deadline: "Apr 10, 2026", bids: 3, estimatedValue: "BDT 8,50,000",
      currentStage: "active", createdBy: "u-proc-01",
    },
    {
      id: "PW-2026-020", title: "Bridge Repair Works", type: "Works", tenderType: "govt",
      status: "Closed", deadline: "Jan 15, 2026", bids: 18, estimatedValue: "BDT 12,00,00,000",
      currentStage: "closed", recommendedVendor: "Mega Constructions", createdBy: "u-proc-01",
    },
    {
      id: "PPS-2026-014", title: "Security Guard Services", type: "Services", tenderType: "rfp",
      status: "Awarded", deadline: "Feb 10, 2026", bids: 7, estimatedValue: "BDT 35,00,000",
      currentStage: "completed", recommendedVendor: "SecureGuard BD", createdBy: "u-proc-01",
    },
    {
      id: "PG-2026-018", title: "Furniture Procurement", type: "Goods", tenderType: "nrq2",
      status: "Active", deadline: "Apr 5, 2026", bids: 6, estimatedValue: "BDT 18,50,000",
      currentStage: "active", createdBy: "u-proc-01",
    },
  ],
};

// ─── Template interpolation helper ──────────────────────────────────────────
// Replaces {{key}} placeholders with values from a context object

export function interpolate(template: string, context: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const val = context[key];
    return val !== undefined ? String(val) : `{{${key}}}`;
  });
}