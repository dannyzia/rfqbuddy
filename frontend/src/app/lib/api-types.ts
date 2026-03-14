// Shared TypeScript types mirroring backend schema
// Keep in sync with /src/backend/src/types/index.ts

// ── Roles ──────────────────────────────────────────────────────

export type Role =
  | 'pe_admin' | 'procurer' | 'procurement_head'
  | 'prequal_evaluator' | 'tech_evaluator' | 'commercial_evaluator'
  | 'auditor' | 'vendor_admin' | 'sales_executive' | 'sales_manager'
  | 'super_admin';

export const PE_ROLES: Role[] = [
  'pe_admin', 'procurer', 'procurement_head',
  'prequal_evaluator', 'tech_evaluator', 'commercial_evaluator', 'auditor',
];
export const VENDOR_ROLES: Role[] = ['vendor_admin', 'sales_executive', 'sales_manager'];

// ── Core Entities ──────────────────────────────────────────────

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: Role;
  org_id: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'procuring_entity' | 'vendor';
  registration_no: string | null;
  tax_id: string | null;
  address: object | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  logo_url: string | null;
  is_active: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  subscription_tier: 'free' | 'starter' | 'professional' | 'enterprise' | null;
  created_at: string;
  updated_at: string;
}

export interface OrgMember {
  member_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  full_name: string;
  email: string;
  status: string;
  is_active: boolean;
}

export type TenderType = 'nrq1_simple' | 'nrq2_detailed' | 'nrq3_custom' | 'rfp' | 'framework_agreement' | 'catalogue_order';
export type TenderStatus = 'draft' | 'published' | 'open' | 'under_evaluation' |
  'pending_prequal' | 'pending_tech_eval' | 'pending_commercial_eval' |
  'pending_audit' | 'pending_approval' | 'awarded' | 'closed' | 'cancelled' | 'withheld';
export type EvalMethod = 'lowest_price' | 'qcbs' | 'technical_only' | 'custom_weighted';

export interface Tender {
  id: string;
  tender_number: string;
  title: string;
  description: string | null;
  tender_type: TenderType;
  status: TenderStatus;
  buyer_org_id: string;
  created_by: string;
  currency: string;
  estimated_value: string | null;
  submission_deadline: string;
  opening_date: string | null;
  validity_days: number;
  eval_method: EvalMethod;
  tech_weight: string;
  commercial_weight: string;
  pass_fail_threshold: string;
  current_stage: string | null;
  forwarded_to: string | null;
  categories: string[] | null;
  tags: string[] | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TenderItem {
  id: string;
  tender_id: string;
  item_number: number;
  description: string;
  specification: string | null;
  unit: string;
  quantity: string;
  estimated_price: string | null;
  category: string | null;
  is_mandatory: boolean;
}

export type BidStatus = 'draft' | 'submitted' | 'under_review' | 'shortlisted' |
  'technically_qualified' | 'technically_disqualified' |
  'commercially_evaluated' | 'awarded' | 'rejected' | 'withdrawn';

export interface Bid {
  id: string;
  bid_number: string;
  tender_id: string;
  vendor_org_id: string;
  submitted_by: string;
  status: BidStatus;
  total_amount: string | null;
  currency: string;
  validity_days: number;
  technical_notes: string | null;
  compliance_declaration: boolean;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BidItem {
  id: string;
  bid_id: string;
  tender_item_id: string;
  unit_price: string;
  quantity: string;
  brand: string | null;
  model: string | null;
  origin_country: string | null;
  delivery_days: number | null;
  notes: string | null;
}

export type ContractStatus = 'draft' | 'pending_signature' | 'active' | 'completed' |
  'terminated' | 'suspended' | 'expired';

export interface Contract {
  id: string;
  contract_number: string;
  tender_id: string;
  vendor_org_id: string;
  bid_id: string | null;
  buyer_org_id: string;
  title: string;
  status: ContractStatus;
  contract_value: string;
  currency: string;
  start_date: string;
  end_date: string;
  performance_score: string;
  signed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContractMilestone {
  id: string;
  contract_id: string;
  title: string;
  description: string | null;
  due_date: string;
  amount: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
  completed_at: string | null;
}

export interface ContractVariation {
  id: string;
  contract_id: string;
  variation_number: string;
  reason: string;
  amount_change: string | null;
  time_extension_days: number | null;
  status: 'pending' | 'approved' | 'rejected';
  requested_by: string | null;
  approved_by: string | null;
  created_at: string;
}

export interface ContractPerformanceRating {
  id: string;
  contract_id: string;
  ratings: Record<string, number>;
  strengths: string;
  improvements: string;
  overall_score: number;
  status: 'draft' | 'submitted';
  rated_by: string | null;
  created_at: string;
}

export interface ContractAuditEvent {
  id: string;
  contract_id: string;
  timestamp: string;
  action: string;
  description: string;
  user: string;
  role: string;
  type: 'contract' | 'milestone' | 'payment' | 'variation' | 'workflow' | 'performance';
  details: Record<string, string | number> | null;
}

export interface EvaluationCriterion {
  id: string;
  tender_id: string;
  stage: 'prequalification' | 'technical' | 'commercial';
  criterion_name: string;
  max_score: string;
  weight: string;
  description: string | null;
  is_pass_fail: boolean;
  sort_order: number;
}

export interface EvaluationScore {
  id: string;
  tender_id: string;
  bid_id: string;
  criterion_id: string;
  evaluator_id: string;
  score: string | null;
  remarks: string | null;
  scored_at: string;
}

export interface EvaluationResult {
  id: string;
  tender_id: string;
  bid_id: string;
  stage: string;
  total_score: string | null;
  max_possible: string | null;
  percentage: string | null;
  passed: boolean | null;
  evaluated_by: string | null;
  remarks: string | null;
}

export interface Notification {
  id: string;
  recipient_id: string;
  type: string;
  title: string;
  message: string | null;
  payload: object | null;
  channel: 'in_app' | 'email' | 'both';
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  org_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  description: string | null;
  metadata: object | null;
  ip_address: string | null;
  created_at: string;
  user_name?: string;
  user_email?: string;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  subject: string;
  description: string;
  type: 'bug' | 'feature' | 'general';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: string | null;
  submitted_by: string;
  assigned_to: string | null;
  org_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  is_internal: boolean;
  created_at: string;
}

export interface CatalogueCategory {
  id: string;
  name: string;
  parent_id: string | null;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  children?: CatalogueCategory[];
}

export interface CatalogueItem {
  id: string;
  vendor_org_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  sku: string | null;
  unit: string;
  unit_price: string;
  currency: string;
  min_order_qty: string;
  lead_time_days: number | null;
  image_url: string | null;
  specifications: object | null;
  is_active: boolean;
}

export type CatalogueOrderStatus = 'draft' | 'submitted' | 'approved' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface CartItem {
  cart_id: string;
  item_id: string;
  quantity: string;
  created_at: string;
  updated_at: string;
  item_name: string;
  item_sku: string | null;
  item_unit: string;
  item_unit_price: string;
  item_currency: string | null;
  item_image_url: string | null;
  vendor_org_id: string;
}

export interface CatalogueOrder {
  id: string;
  order_number: string;
  buyer_id: string;
  buyer_org_id: string | null;
  status: CatalogueOrderStatus;
  total_amount: string;
  currency: string;
  delivery_address: string | null;
  notes: string | null;
  submitted_at: string;
  approved_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CatalogueOrderItem {
  id: string;
  order_id: string;
  item_id: string;
  vendor_org_id: string;
  name: string;
  sku: string | null;
  unit: string;
  unit_price: string;
  quantity: string;
  total_price: string;
  currency: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'deadline' | 'opening' | 'milestone' | 'contract_end';
}

export interface EmailTemplate {
  key: string;
  subject: string;
  html_body: string;
  variables: string[] | null;
  description: string | null;
}

export interface PlatformSetting {
  key: string;
  value: string;
  description: string | null;
}

// ── Paginated Response ─────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages?: number;
}

// ── Analytics Types ────────────────────────────────────────────

export interface ProcurementStats {
  tenders: { total: number; active: number; awarded: number; closed: number };
  bids: { total: number; avg_per_tender: number; avg_value: number };
  contracts: { total: number; active: number; total_value: number };
}

export interface SpendByCategory {
  category: string;
  total_spend: number;
  contract_count: number;
}

export interface VendorRanking {
  vendor_org_id: string;
  vendor_name: string;
  srm_score: string;
  risk_level: string;
  bids_won: number;
  total_bids: number;
  total_contract_value: number;
}

export interface AdminDashboardStats {
  total_users: number;
  total_organizations: number;
  total_tenders: number;
  total_bids: number;
  total_contracts: number;
  open_tickets: number;
  pending_approvals: number;
}

// ── Efficiency Metrics ─────────────────────────────────────────

export interface EfficiencyMetrics {
  cycle_time: {
    avg_cycle_days: number | null;
    avg_submission_window_days: number | null;
    awarded_count: number;
    cancelled_count: number;
    total_tenders: number;
  } | null;
  bid_efficiency: {
    avg_bids_per_tender: number | null;
    participation_rate: number | null;
  } | null;
  eval_turnaround: { stage: string; avg_days: number | null }[];
  monthly_throughput: { month: string; completed: number; cancelled: number }[];
}

// ── Compliance Metrics ─────────────────────────────────────────

export interface ComplianceMetrics {
  kyc_breakdown: { status: string; count: number }[];
  tender_compliance: {
    total: number;
    has_terms: number;
    adequate_deadline: number;
    has_documents: number;
    has_eval_method: number;
  } | null;
  bid_compliance: {
    total: number;
    declared_compliant: number;
    has_documents: number;
  } | null;
  contract_compliance: {
    total_active: number;
    overdue: number;
    expiring_soon: number;
  } | null;
  audit_coverage: {
    total_tenders: number;
    with_audit_trail: number;
  } | null;
}

// ── Phase 17 — Advanced Module Types ───────────────────────────

// KYC/AML Compliance
export type KycStatus = 'pending' | 'in_progress' | 'approved' | 'rejected' | 'expired';

export interface KycCheck {
  id: string;
  vendor_org_id: string;
  vendor_name?: string;
  status: KycStatus;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  check_type: 'initial' | 'periodic' | 'triggered';
  documents_verified: boolean;
  ubo_verified: boolean;
  sanctions_clear: boolean;
  pep_clear: boolean;
  assigned_to: string | null;
  notes: string | null;
  expires_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SanctionsAlert {
  id: string;
  vendor_org_id: string;
  vendor_name?: string;
  alert_type: 'sanctions_match' | 'pep_match' | 'adverse_media' | 'watchlist';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  matched_entity: string;
  match_score: number;
  status: 'open' | 'investigating' | 'resolved_true_match' | 'resolved_false_positive';
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
}

// Finance — Three-Way Matching & FX
export type MatchStatus = 'full_match' | 'partial_match' | 'no_match' | 'pending_grn';

export interface InvoiceMatchRecord {
  id: string;
  vendor: string;
  po_number: string;
  grn_number: string | null;
  invoice_amount: number;
  po_amount: number;
  grn_amount: number | null;
  variance: number | null;
  match_status: MatchStatus;
  auto_approved: boolean;
  currency: string;
  submitted_at: string;
}

export interface MatchingOverview {
  total_contracts: number;
  total_payments: number;
  full_matches?: number;
  partial_matches?: number;
  no_matches?: number;
  pending_grn?: number;
}

export interface FxRate {
  pair: string;
  rate: number;
  prev_rate: number;
  change: number;
  source: string;
  last_updated: string;
  status: 'normal' | 'alert' | 'stale';
}

export interface FxRatesResponse {
  base: string;
  timestamp: string;
  rates: Record<string, number>;
}

export interface FxComparison {
  tender_id: string;
  comparisons: {
    vendor: string;
    bid_currency: string;
    bid_amount: number;
    fx_rate: number;
    bdt_equivalent: number;
    rate_locked: boolean;
    fx_risk: string;
  }[];
}

// Guided Buying
export interface BuyItem {
  id: string;
  name: string;
  vendor: string;
  price: number;
  unit: string;
  category: string;
  in_stock: boolean;
  image_url: string | null;
}

export interface CartItemBuy {
  id: string;
  sku: string;
  name: string;
  vendor: string;
  price: number;
  qty: number;
  source: 'punchout' | 'catalog' | 'quick_buy';
  compliant: boolean;
}

export interface BuyOrder {
  id: string;
  order_number: string;
  status: 'draft' | 'submitted' | 'approved' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  currency: string;
  vendor: string;
  created_at: string;
}

// Risk Assessment
export type RiskTier = 'Green' | 'Yellow' | 'Orange' | 'Red';

export interface RiskDashboardResponse {
  total_vendors: number;
  distribution: { tier: RiskTier; count: number }[];
}

export interface VendorRiskProfileResponse {
  id: string;
  name: string;
  overallScore: number;
  tier: RiskTier;
  lastCalculated: string;
  nextReview: string;
  dimensions?: {
    name: string;
    score: number;
    weight: number;
    weighted: number;
  }[];
}

export interface RiskAssessment {
  id: string;
  vendor_org_id: string;
  vendor_name?: string;
  overall_score: number;
  tier: RiskTier;
  dimension_scores: Record<string, number>;
  status: 'draft' | 'active' | 'archived';
  assessed_by: string | null;
  assessed_at: string;
  next_review_at: string | null;
}

// Agentic AI
export type AgentStatus = 'active' | 'paused' | 'error' | 'disabled';

export interface AiAgent {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  enabled: boolean;
  tasks_completed: number;
  tasks_today: number;
  accuracy: number;
  savings: string;
  spend_limit: string;
  human_checkpoint: string;
  last_action: string;
  model: string;
}

export interface AiAnalytics {
  total_actions_processed: number;
  agents_active: number;
  agents_total: number;
  savings_identified: number;
  risks_flagged: number;
  accuracy_avg?: number;
  weekly_performance?: {
    week: string;
    tasks: number;
    savings: number;
  }[];
}

// Developer Portal
export interface ApiKey {
  id: string;
  name: string;
  env: 'live' | 'test';
  created: string;
  last_used: string | null;
  requests_24h: number;
  status: 'active' | 'inactive' | 'revoked';
}

export interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  secret: string;
  is_active: boolean;
  last_triggered_at: string | null;
  created_at: string;
}

// Accessibility / Settings
export interface AccessibilityPreferences {
  high_contrast: boolean;
  large_text: boolean;
  reduce_motion: boolean;
  dyslexia_font?: boolean;
  screen_reader_optimized?: boolean;
  keyboard_shortcuts?: boolean;
  focus_highlight?: boolean;
}

// Blockchain Audit
export interface BlockchainAnchor {
  id: string;
  event_type: string;
  entity_type: string;
  entity_id: string;
  payload_hash: string;
  block_number: number | null;
  tx_hash: string | null;
  anchored_at: string;
  verified: boolean;
}

// Security (NIST)
export interface SecurityDashboardResponse {
  overall_score: number;
  nist_functions: {
    name: string;
    score: number;
    items: number;
    compliant: number;
  }[];
  controls_count: number;
  implemented_count: number;
}