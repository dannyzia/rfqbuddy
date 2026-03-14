import { useState } from "react";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Shield,
  Settings,
  DollarSign,
  ClipboardCheck,
  UserCheck,
  Crown,
  FileText,
  Users,
  Eye,
  Edit,
  Plus,
  XCircle,
  CheckCircle2,
  ArrowRight,
  Lock,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  BookOpen,
  Layers,
  Building2,
  Fingerprint,
  Scale,
  ShieldCheck,
  ShoppingCart,
  Activity,
  Bot,
  Link2,
  Coins,
  Globe,
  Accessibility,
  Cpu,
} from "lucide-react";
import { Button } from "../../components/ui/button";

// ─── PRD v5.6 FINAL (100% Complete) — Role-Based Access Control + All Modules ──
// ─── Upgraded from v5.5 to v5.6 with 10 new gap-closure modules ────────────────

/*
 * This page serves as the living PRD reference for role-based access control
 * and the complete v5.6 platform feature set.
 * It documents:
 *   §7.1  Platform Roles (11 roles)
 *   §7.2  Procurement Workflow Roles (6 stages)
 *   §7.3  /tenders page — what each role sees
 *   §7.4  Actions available per role per tender status
 *   §7.5  Approval workflow per tender type
 *   §7.6  Data visibility matrix
 *   §7.7  Sequential forwarding rules
 *   §14.5–14.10  Contract Lifecycle Management (e-CMS)
 *   §9.2  ESG/SPP Criteria
 *   §12.5 AI Anomaly Detection
 *   §8.6–8.7 Vendor SRM
 *   §5.3  Framework Agreements & Catalogue Buying
 *   §15   Updated Subscription Packages
 *   §24.9 Advanced Analytics
 *
 *   ── v5.6 Additions (100% Complete) ──
 *   §8.8  KYC/AML Vendor Compliance
 *   §14.12 Three-Way Matching (PO–Invoice–GRN)
 *   §18.1 NIST Cybersecurity Framework
 *   §5.4  Guided Buying & Punch-Out Catalogs
 *   §8.9  Dynamic Risk Assessment Engine
 *   §12.6 Agentic AI / Autonomous Procurement
 *   §17.1 Blockchain Audit Anchoring
 *   §9.3  Multi-Currency & FX Hedging
 *   §19.5 API-First Architecture & Webhooks
 *   §22.4 Accessibility (WCAG 2.1 AA)
 */

// ─── §7.1 Platform-Level Roles ──────────────────────────────────────────────

interface PlatformRole {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  sidebarSection: string;
  canAccessRoutes: string[];
  tenderListVisibility: string;
  tenderListColumns: string[];
  tenderActions: string[];
}

const PLATFORM_ROLES: PlatformRole[] = [
  {
    id: "procurer",
    name: "Procurer / Procurement Officer",
    description:
      "Creates tenders, manages the procurement lifecycle, assigns workflow roles. This is the primary purchaser-side role.",
    icon: FileText,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    sidebarSection: "Purchaser",
    canAccessRoutes: [
      "/dashboard",
      "/tenders",
      "/tenders/new/*",
      "/tenders/create",
      "/tenders/:id",
      "/tenders/:id/participation",
      "/tenders/:id/live",
      "/tenders/:id/timeline",
      "/tenders/:id/history",
      "/tenders/:id/audit",
      "/tenders/:id/bid-opening",
      "/vendors",
      "/vendor-enlistment",
      "/analytics",
      "/reports",
      "/calendar",
      "/notifications",
      "/profile",
    ],
    tenderListVisibility:
      "Sees ALL tenders created by their organisation. Full CRUD on Draft tenders. Read-only on Published/Closed.",
    tenderListColumns: [
      "Reference",
      "Title",
      "Type",
      "Status",
      "Deadline",
      "Bids",
      "Assigned Workflow",
      "Actions",
    ],
    tenderActions: [
      "Create New Tender",
      "Edit Draft",
      "Delete Draft",
      "Publish",
      "Withhold",
      "Close",
      "Re-open",
      "View All",
      "Export",
    ],
  },
  {
    id: "prequal_evaluator",
    name: "Prequalification Evaluator",
    description:
      "Reviews vendor eligibility documents, checks minimum qualification criteria. Only sees tenders where they are assigned as Prequalification Evaluator.",
    icon: Shield,
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    sidebarSection: "Evaluation",
    canAccessRoutes: [
      "/dashboard",
      "/tenders",
      "/tenders/:id",
      "/tenders/:id/prequalification-eval",
      "/tenders/:id/participation",
      "/tenders/:id/audit",
      "/notifications",
      "/profile",
    ],
    tenderListVisibility:
      'Only sees tenders ASSIGNED to them at the Prequalification stage AND where status is "Pending Prequalification" or later in their queue.',
    tenderListColumns: [
      "Reference",
      "Title",
      "Type",
      "Evaluation Status",
      "Deadline",
      "Vendors to Review",
      "Actions",
    ],
    tenderActions: [
      "View Tender",
      "Start Evaluation",
      "Submit Evaluation",
      "Forward to Next Stage",
      "Request Clarification",
      "Flag Issue",
    ],
  },
  {
    id: "tech_evaluator",
    name: "Technical Evaluator",
    description:
      "Scores technical proposals per evaluation criteria. Only sees tenders assigned to them for Technical Evaluation, and only after Prequalification is complete (if applicable).",
    icon: Settings,
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    sidebarSection: "Evaluation",
    canAccessRoutes: [
      "/dashboard",
      "/tenders",
      "/tenders/:id",
      "/tenders/:id/technical-eval",
      "/tenders/:id/comparison",
      "/tenders/:id/audit",
      "/notifications",
      "/profile",
    ],
    tenderListVisibility:
      'Only sees tenders ASSIGNED to them at the Technical Evaluation stage AND where status is "Pending Technical Evaluation".',
    tenderListColumns: [
      "Reference",
      "Title",
      "Type",
      "Evaluation Status",
      "Deadline",
      "Bids to Score",
      "Actions",
    ],
    tenderActions: [
      "View Tender",
      "Start Technical Scoring",
      "Submit Scores",
      "Forward to Commercial",
      "Request Clarification",
      "Flag Technical Issue",
    ],
  },
  {
    id: "commercial_evaluator",
    name: "Commercial / Financial Evaluator",
    description:
      "Evaluates pricing, financial capacity, and commercial terms. Only sees tenders assigned to them for Commercial Evaluation, and only after Technical Evaluation is complete.",
    icon: DollarSign,
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    sidebarSection: "Evaluation",
    canAccessRoutes: [
      "/dashboard",
      "/tenders",
      "/tenders/:id",
      "/tenders/:id/commercial-eval",
      "/tenders/:id/comparison",
      "/tenders/:id/ranking",
      "/tenders/:id/audit",
      "/notifications",
      "/profile",
    ],
    tenderListVisibility:
      'Only sees tenders ASSIGNED to them at the Commercial Evaluation stage AND where status is "Pending Commercial Evaluation".',
    tenderListColumns: [
      "Reference",
      "Title",
      "Type",
      "Evaluation Status",
      "Deadline",
      "Bids to Evaluate",
      "Actions",
    ],
    tenderActions: [
      "View Tender",
      "Start Commercial Scoring",
      "Submit Evaluation",
      "Forward to Auditor",
      "Request Price Clarification",
      "Flag Financial Concern",
    ],
  },
  {
    id: "auditor",
    name: "Auditor / Compliance Reviewer",
    description:
      "Reviews process integrity, verifies all evaluations are compliant. Cannot modify scores — only reviews and certifies the process. Sees tenders assigned to them after evaluation is complete.",
    icon: ClipboardCheck,
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    sidebarSection: "Evaluation",
    canAccessRoutes: [
      "/dashboard",
      "/tenders",
      "/tenders/:id",
      "/tenders/:id/audit",
      "/tenders/:id/evaluation-report",
      "/tenders/:id/comparison",
      "/tenders/:id/ranking",
      "/tenders/:id/audit-review",
      "/notifications",
      "/profile",
    ],
    tenderListVisibility:
      'Only sees tenders ASSIGNED to them for Audit review AND where status is "Pending Audit".',
    tenderListColumns: [
      "Reference",
      "Title",
      "Type",
      "Audit Status",
      "Deadline",
      "Issues Found",
      "Actions",
    ],
    tenderActions: [
      "View Full Audit Trail",
      "Certify Process",
      "Reject (with reasons)",
      "Forward to Procurement Head",
      "Flag Irregularity",
      "Request Re-evaluation",
    ],
  },
  {
    id: "procurement_head",
    name: "Approving Authority / Procurement Head",
    description:
      "Final authority on award decisions. Sees all tenders that have completed their approval workflow and are pending final approval. Can also view all tenders in the organisation for oversight.",
    icon: Crown,
    color:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    sidebarSection: "Purchaser (elevated)",
    canAccessRoutes: [
      "/dashboard",
      "/tenders",
      "/tenders/:id",
      "/tenders/:id/*",
      "/vendors",
      "/analytics",
      "/reports",
      "/calendar",
      "/notifications",
      "/profile",
    ],
    tenderListVisibility:
      'Sees ALL tenders (oversight role) but PRIMARY view shows tenders "Pending Final Approval". Can toggle to see full list.',
    tenderListColumns: [
      "Reference",
      "Title",
      "Type",
      "Status",
      "Approval Status",
      "Recommended Vendor",
      "Value",
      "Actions",
    ],
    tenderActions: [
      "Approve Award",
      "Reject Award",
      "Send Back for Re-evaluation",
      "View Full Audit Trail",
      "View All Evaluations",
      "Export Report",
    ],
  },
  {
    id: "vendor",
    name: "Vendor / Supplier",
    description:
      "External party who browses published tenders, submits bids, and tracks their submissions. Cannot see any internal evaluation data, workflow assignments, or other vendors' bids.",
    icon: Building2,
    color:
      "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    sidebarSection: "Vendor Portal",
    canAccessRoutes: [
      "/vendor-dashboard",
      "/rfqs",
      "/rfqs/:id",
      "/rfqs/:id/bid",
      "/rfqs/:id/bid/wizard",
      "/rfqs/:id/bid/documents",
      "/vendor-bids",
      "/vendor-profile",
      "/vendor-activity-logs",
      "/notifications",
    ],
    tenderListVisibility:
      'Sees ONLY published tenders matching their enlisted categories. Route: /rfqs (NOT /tenders). Cannot see Draft, Evaluation, or internal statuses.',
    tenderListColumns: [
      "Reference",
      "Title",
      "Category",
      "Deadline",
      "Submission Status",
      "Actions",
    ],
    tenderActions: [
      "View RFQ Details",
      "Submit Bid",
      "Update Bid (if allowed)",
      "Withdraw Bid",
      "Download Documents",
      "Ask Clarification",
    ],
  },
];

// ─── §7.5 Approval Workflow Per Tender Type ─────────────────────────────────

interface WorkflowSpec {
  tenderType: string;
  code: string;
  totalStages: number;
  stages: { role: string; required: boolean }[];
  notes: string;
}

const WORKFLOW_SPECS: WorkflowSpec[] = [
  {
    tenderType: "Government Tender (PG/PW/PPS)",
    code: "govt-full",
    totalStages: 6,
    stages: [
      { role: "Prequalification Evaluator", required: true },
      { role: "Technical Evaluator", required: true },
      { role: "Commercial Evaluator", required: true },
      { role: "Auditor", required: true },
      { role: "Recommender", required: true },
      { role: "Approving Authority", required: true },
    ],
    notes:
      "Full 6-stage workflow mandated by PPA 2006. All stages are required. Sequential forwarding enforced.",
  },
  {
    tenderType: "Government Tender (Simple)",
    code: "govt-simple",
    totalStages: 4,
    stages: [
      { role: "Technical Evaluator", required: true },
      { role: "Commercial Evaluator", required: true },
      { role: "Auditor", required: true },
      { role: "Approving Authority", required: true },
    ],
    notes:
      "Simplified government workflow for straightforward procurements. Prequalification and Recommender stages skipped.",
  },
  {
    tenderType: "Simple RFQ (NRQ1)",
    code: "nrq1-simple",
    totalStages: 2,
    stages: [
      { role: "Recommender", required: true },
      { role: "Approving Authority", required: true },
    ],
    notes:
      "Minimal workflow for low-value procurement (up to BDT 20 Lac). Only recommendation + final approval.",
  },
  {
    tenderType: "Detailed RFQ (NRQ2)",
    code: "nrq2-detailed",
    totalStages: 4,
    stages: [
      { role: "Technical Evaluator", required: true },
      { role: "Commercial Evaluator", required: true },
      { role: "Auditor", required: false },
      { role: "Approving Authority", required: true },
    ],
    notes:
      "Standard evaluation workflow for mid-value procurement. Auditor is optional but recommended.",
  },
  {
    tenderType: "Custom RFQ (NRQ3)",
    code: "nrq3-custom",
    totalStages: -1,
    stages: [{ role: "Approving Authority", required: true }],
    notes:
      'Fully configurable. Only "Approving Authority" is mandatory. User can add/remove/reorder any number of custom stages. Supports custom role names.',
  },
  {
    tenderType: "Request for Proposal (RFP)",
    code: "rfp",
    totalStages: 5,
    stages: [
      { role: "Technical Evaluator", required: true },
      { role: "Commercial Evaluator", required: true },
      { role: "Auditor", required: true },
      { role: "Recommender", required: true },
      { role: "Approving Authority", required: true },
    ],
    notes:
      "Comprehensive RFP evaluation with QCBS scoring. All evaluation stages + recommendation required before final approval.",
  },
];

// ─── §7.3 Tender Status Lifecycle ───────────────────────────────────────────

const TENDER_STATUSES = [
  { status: "Draft", color: "bg-muted text-muted-foreground", visibleTo: ["procurer", "procurement_head"], description: "Tender is being drafted. Not visible to evaluators or vendors." },
  { status: "Published / Active", color: "bg-green-100 text-green-700", visibleTo: ["procurer", "procurement_head", "vendor"], description: "Tender is live and accepting bids. Vendors see it in /rfqs. Evaluators don't see it yet." },
  { status: "Bid Closing", color: "bg-yellow-100 text-yellow-700", visibleTo: ["procurer", "procurement_head"], description: "Bid submission deadline has passed. Pending bid opening ceremony." },
  { status: "Pending Prequalification", color: "bg-purple-100 text-purple-700", visibleTo: ["procurer", "prequal_evaluator", "procurement_head"], description: "Bids opened. Prequalification Evaluator sees this tender in their queue." },
  { status: "Pending Technical Evaluation", color: "bg-blue-100 text-blue-700", visibleTo: ["procurer", "tech_evaluator", "procurement_head"], description: "Prequalification complete (or skipped). Technical Evaluator sees this tender." },
  { status: "Pending Commercial Evaluation", color: "bg-amber-100 text-amber-700", visibleTo: ["procurer", "commercial_evaluator", "procurement_head"], description: "Technical evaluation complete. Commercial Evaluator sees this tender." },
  { status: "Pending Audit", color: "bg-red-100 text-red-700", visibleTo: ["procurer", "auditor", "procurement_head"], description: "Evaluation complete. Auditor sees this tender for compliance review." },
  { status: "Pending Recommendation", color: "bg-indigo-100 text-indigo-700", visibleTo: ["procurer", "procurement_head"], description: "Audit passed. Recommender prepares the award recommendation." },
  { status: "Pending Final Approval", color: "bg-orange-100 text-orange-700", visibleTo: ["procurer", "procurement_head"], description: "Recommendation submitted. Procurement Head sees this for final approve/reject." },
  { status: "Awarded", color: "bg-emerald-100 text-emerald-700", visibleTo: ["procurer", "procurement_head", "vendor"], description: "Contract awarded. Winning vendor notified. All evaluators can see outcome." },
  { status: "Withheld", color: "bg-orange-100 text-orange-700", visibleTo: ["procurer", "procurement_head"], description: "Temporarily suspended by Procurer or Procurement Head. Not visible to vendors." },
  { status: "Cancelled", color: "bg-red-100 text-red-700", visibleTo: ["procurer", "procurement_head", "vendor"], description: "Tender cancelled. All parties notified." },
  { status: "Closed", color: "bg-muted text-muted-foreground", visibleTo: ["procurer", "procurement_head"], description: "Tender completed and archived." },
];

// ─── §7.7 Sequential Forwarding Rules ───────────────────────────────────────

const FORWARDING_RULES = [
  { rule: "Strict Sequential Order", description: "A tender can only be forwarded to the NEXT stage in the configured workflow. Skipping stages is not allowed unless the stage was explicitly disabled during tender creation.", icon: ArrowRight },
  { rule: "No Self-Forwarding", description: "A user assigned to one stage cannot forward to themselves at the next stage. The system prevents the same user from being assigned to consecutive stages.", icon: XCircle },
  { rule: "Maximum 2 Roles Per User", description: "A single organisation member can hold at most 2 workflow roles across a tender's lifecycle, and those roles must NOT be adjacent in the pipeline.", icon: Users },
  { rule: "Immutable After Publishing", description: "Once a tender is published, the approval workflow configuration (stages, assignments) is locked and cannot be modified. Only the Procurement Head can request a workflow amendment through the audit trail.", icon: Lock },
  { rule: "Audit Trail for Every Forward", description: "Every time a tender moves between stages, the system logs: who forwarded, to whom, timestamp, any comments, and the evaluation summary at that point.", icon: ClipboardCheck },
  { rule: "Send-Back Allowed", description: 'Any evaluator (except Procurer) can "Send Back" a tender to the previous stage with a reason. The Procurement Head can send back to any prior stage.', icon: AlertTriangle },
];

// ─── v5.6 New Modules Data ──────────────────────────────────────────────────

const V56_MODULES = [
  {
    id: "kyc",
    section: "§8.8",
    title: "KYC/AML Vendor Compliance",
    icon: Fingerprint,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-100 dark:bg-rose-900/30",
    tier: "Gold+ / Platinum",
    screens: ["Screen 60: KYC Dashboard (/compliance/kyc)", "Screen 61: Vendor KYC Detail (/vendors/:id/kyc)", "Screen 62: Sanctions Alert Management (/compliance/alerts)"],
    schema: [
      "vendors: + kyc_level ENUM, kyc_verified_at, kyc_expires_at, beneficial_owners JSONB, pep_status, sanctions_screening_status, adverse_media_found",
      "NEW: vendor_kyc_checks (vendor_id, check_type, provider, result JSONB, checked_at, next_check_due)",
    ],
    details: [
      { label: "Regulatory Context", value: "Bangladesh Bank AML Guidelines 2022, FATF supplier due diligence" },
      { label: "KYC Levels", value: "Basic (all vendors) → Enhanced (>BDT 10 Lac or foreign) → Ongoing (active contracts)" },
      { label: "Basic Verification", value: "Trade license, TIN, bank account — Automated OCR + NBR API check" },
      { label: "Enhanced Verification", value: "Beneficial ownership, source of funds — Manual review + adverse media screening" },
      { label: "Ongoing Monitoring", value: "Annual re-verification, transaction monitoring — Automated alerts" },
      { label: "Integrations", value: "NBR TIN API, Bangladesh Bank sanctions list, UN/OFAC (LSEG/Dow Jones), Google News NLP" },
      { label: "PEP Screening", value: "Politically Exposed Person checks for all beneficial owners" },
    ],
  },
  {
    id: "three-way",
    section: "§14.12",
    title: "Three-Way Matching (PO–Invoice–GRN)",
    icon: Scale,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    tier: "Gold+",
    screens: ["Screen 63: GRN Creation (/contracts/:id/grn/new) — Mobile-optimized", "Screen 64: Invoice Matching Queue (/finance/matching)", "Screen 65: Dispute Resolution (/finance/disputes/:id)"],
    schema: [
      "NEW: goods_receipt_notes (grn_id, po_id, contract_id, received_by, received_at, items JSONB, attachments, status)",
      "NEW: invoice_matching (invoice_id, po_id, grn_id, vendor_id, invoice_number, amounts, match_status ENUM, auto_approved)",
    ],
    details: [
      { label: "Purpose", value: "Prevent overpayment, duplicate payments, and invoice fraud" },
      { label: "Full Match", value: "100% match → Auto-approve payment" },
      { label: "Partial Match", value: "±5% qty / ±2% price → Flag for AP review" },
      { label: "No Match", value: ">5% variance → Block payment, all fields mismatch" },
      { label: "OCR Engine", value: "Tesseract/AWS Textract for invoice extraction" },
      { label: "AI Enhancement", value: "Platinum: invoice fraud detection, duplicate invoice flagging, predictive GRN-to-PO matching" },
      { label: "Workflow", value: "Upload → OCR → Auto-match → Review queue → Approve → Payment certificate" },
    ],
  },
  {
    id: "nist",
    section: "§18.1",
    title: "NIST Cybersecurity Framework",
    icon: ShieldCheck,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    tier: "All Tiers",
    screens: ["Screen 66: Security Dashboard (/admin/security)"],
    schema: [],
    details: [
      { label: "NIST Functions", value: "Identify → Protect → Detect → Respond → Recover" },
      { label: "Encryption", value: "AES-256 at rest, TLS 1.3 in transit, certificate pinning" },
      { label: "Access Control", value: "RBAC with least privilege, 90-day account review, automated provisioning" },
      { label: "Monitoring", value: "SIEM integration, anomaly detection, failed login monitoring, 24/7 SOC" },
      { label: "Data Classification", value: "Public → Internal → Confidential → Restricted (tokenized, 2-person rule)" },
      { label: "Certification Path", value: "Y1: ISO 27001 → Y2: SOC 2 Type II → Y3: NIST 800-171" },
      { label: "Testing", value: "Annual penetration testing, quarterly vulnerability scans, tabletop exercises" },
    ],
  },
  {
    id: "guided-buying",
    section: "§5.4",
    title: "Guided Buying & Punch-Out Catalogs",
    icon: ShoppingCart,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-100 dark:bg-violet-900/30",
    tier: "Silver+ / Gold+ / Platinum",
    screens: ["Screen 67: Guided Buying Homepage (/buy)", "Screen 68: Punch-Out Session (/buy/punchout/:vendor_id)", "Screen 69: Cart Review (/buy/cart)", "Screen 70: Requisition to PO (/buy/checkout)"],
    schema: [
      "NEW: punchout_vendors (vendor_id, punchout_url, protocol ENUM, credentials_encrypted, catalog_last_sync)",
      "NEW: guided_buying_rules (org_id, category_id, max_spend, preferred_vendor_id, approval_threshold, auto_approve)",
      "NEW: shopping_carts (cart_id, user_id, status ENUM, items JSONB, total_amount, compliance_flags)",
    ],
    details: [
      { label: "Concept", value: "B2C-like buying experience for B2B procurement — Amazon Business standard" },
      { label: "Punch-Out Protocol", value: "cXML/OCI standard for vendor site integration with return callback" },
      { label: "Flow", value: "Search → Punch-out to vendor → Configure → Return cart → Validate → Generate PO" },
      { label: "Compliance", value: "Auto-validate against budget, policy, preferred vendor rules" },
      { label: "BD Suppliers", value: "Amazon Business, Startech, Ryans Computers, IDLC Finance, SSL Wireless" },
      { label: "Tiers", value: "Silver+: basic catalogs | Gold+: punch-out | Platinum: custom integrations" },
    ],
  },
  {
    id: "risk",
    section: "§8.9",
    title: "Dynamic Risk Assessment Engine",
    icon: Activity,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    tier: "Gold+ / Platinum",
    screens: ["Screen 71: Risk Command Center (/risk/dashboard)", "Screen 72: Vendor Risk Profile (/vendors/:id/risk)", "Screen 73: Mitigation Workflow (/risk/mitigations/:id)"],
    schema: [
      "NEW: vendor_risk_scores (vendor_id, calculated_at, overall_score, dimension_scores JSONB, risk_tier ENUM, mitigation_plan, next_review_date)",
      "NEW: risk_events (event_id, vendor_id, dimension, severity ENUM, description, source, detected_at, acknowledged_by/at)",
    ],
    details: [
      { label: "Dimensions", value: "Financial (25%), Operational (25%), Compliance (20%), Geopolitical (15%), Cyber (10%), ESG (5%)" },
      { label: "Score Range", value: "0-100 scale — 0-30 Green, 31-60 Yellow, 61-80 Orange, 81-100 Red" },
      { label: "Green (0-30)", value: "Preferred status — no action" },
      { label: "Yellow (31-60)", value: "Enhanced monitoring → notify Category Manager" },
      { label: "Orange (61-80)", value: "Require mitigation plan, limit new POs → notify Procurement Head + Vendor" },
      { label: "Red (81-100)", value: "Suspend new awards, trigger contingency → notify CPO + Legal + Vendor" },
      { label: "Data Sources", value: "Credit bureaus, delivery performance, KYC status, country risk, security posture, ESG scores" },
    ],
  },
  {
    id: "agentic-ai",
    section: "§12.6",
    title: "Agentic AI / Autonomous Procurement",
    icon: Bot,
    color: "text-fuchsia-600 dark:text-fuchsia-400",
    bgColor: "bg-fuchsia-100 dark:bg-fuchsia-900/30",
    tier: "Platinum Only (Phase 3)",
    screens: ["Screen 74: AI Agent Control Center (/ai/agents)", "Screen 75: Agent Configuration (/ai/config)", "Screen 76: Agent Performance (/ai/analytics)"],
    schema: [],
    details: [
      { label: "Sourcing Agent", value: "Auto-RFQ to pre-approved vendors, initial screening — Human checkpoint: final award" },
      { label: "Contract Agent", value: "Draft amendments, route approvals, update terms — Human checkpoint: >10% changes" },
      { label: "Risk Agent", value: "Initiate mitigation, suggest alternatives, alert stakeholders — Human checkpoint: Red-tier suspension" },
      { label: "Savings Agent", value: "Identify consolidation, negotiate volume discounts — Human checkpoint: Category manager approval" },
      { label: "Guardrails", value: "All actions logged, spend limits per agent (max BDT 5 Lac), daily transaction limits" },
      { label: "Mandatory Human", value: "New vendor onboarding, contract termination, price increases >10%" },
      { label: "Tech Stack", value: "GPT-4/Claude API + Temporal.io + Rules+ML hybrid decision engine" },
      { label: "Timeline", value: "Beta Year 2, GA Year 3 — Platinum only" },
    ],
  },
  {
    id: "blockchain",
    section: "§17.1",
    title: "Blockchain Audit Anchoring",
    icon: Link2,
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    tier: "Gold+ / Platinum",
    screens: ["No new UI screens — backend service with verification API"],
    schema: [],
    details: [
      { label: "Purpose", value: "Cryptographic proof of audit log integrity for legal disputes and corruption investigations" },
      { label: "Architecture", value: "Audit service → SHA-256 hashes → Merkle root anchored hourly to Hyperledger Fabric or Ethereum PoA" },
      { label: "Anchored Events", value: "Tender published, bid submitted (hash), bid opened, evaluation scores, award decision, contract signed, payment disbursed" },
      { label: "Verification API", value: "GET /api/audit/verify/:event_id → { anchored, block_number, merkle_proof, timestamp }" },
      { label: "Legal Status", value: "Blockchain timestamp admissible as evidence under Bangladesh Evidence Act (digital records)" },
      { label: "Trust Model", value: "BPPA or independent auditor operates validator node" },
    ],
  },
  {
    id: "multi-currency",
    section: "§9.3",
    title: "Multi-Currency & FX Risk Management",
    icon: Coins,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    tier: "Gold+ / Platinum",
    screens: ["Screen 77: FX Dashboard (/finance/fx)", "Screen 78: Multi-Currency Bid Comparison (/tenders/:id/fx-comparison)"],
    schema: [
      "tenders: + currency ENUM, fx_rate_locked, fx_rate_source, fx_valid_until",
      "bids: + bid_currency ENUM, fx_rate_used, bdt_equivalent",
      "NEW: fx_rates (currency_pair, rate, source, effective_at)",
    ],
    details: [
      { label: "Currencies", value: "BDT (default), USD, EUR, GBP, JPY" },
      { label: "FX Sources", value: "BDT: Bangladesh Bank mid-rate | USD: BB selling +1% | EUR: ECB | GBP: BoE | JPY: BOJ" },
      { label: "Rate Locking", value: "Fix FX rate at bid submission for 90 days — reduces vendor contingency pricing" },
      { label: "Hedging", value: "API to banks for forward contracts — buyer protection against currency swings" },
      { label: "Dual Bidding", value: "Vendor quotes in BDT or USD — system auto-calculates BDT equivalent for comparison" },
    ],
  },
  {
    id: "api-first",
    section: "§19.5",
    title: "API-First Architecture & Webhooks",
    icon: Globe,
    color: "text-sky-600 dark:text-sky-400",
    bgColor: "bg-sky-100 dark:bg-sky-900/30",
    tier: "Silver+ / Gold+ / Platinum",
    screens: ["Screen 79: Developer Portal (/developers)"],
    schema: [],
    details: [
      { label: "REST API", value: "OpenAPI 3.0 with Swagger UI at /api/docs" },
      { label: "GraphQL", value: "Apollo Server for complex queries and mobile apps" },
      { label: "Webhooks", value: "tender.published, bid.received, award.issued, milestone.completed, payment.disbursed" },
      { label: "ERP Integrations", value: "SAP (OData+RFC), Oracle (REST), Dynamics (Power Automate), QuickBooks, Tally Prime" },
      { label: "Notifications", value: "Slack/Teams (webhook+bot), WhatsApp Business API (BD preference)" },
      { label: "Developer Portal", value: "Self-service API keys, sandbox environment, rate limits (100-10000/hr by tier)" },
      { label: "SDKs", value: "Node.js, Python, Java (community contributions)" },
    ],
  },
  {
    id: "accessibility",
    section: "§22.4",
    title: "Accessibility (WCAG 2.1 AA)",
    icon: Accessibility,
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-100 dark:bg-teal-900/30",
    tier: "All Tiers (Legal Requirement)",
    screens: ["Screen 80: Accessibility Settings (/settings/accessibility)"],
    schema: [],
    details: [
      { label: "Standards", value: "WCAG 2.1 Level AA, Section 508, EN 301 549" },
      { label: "Keyboard Nav", value: "All functions operable without mouse — tab order testing" },
      { label: "Screen Readers", value: "ARIA labels, alt text, semantic HTML — NVDA/VoiceOver/JAWS/TalkBack tested" },
      { label: "Color Contrast", value: "Minimum 4.5:1 for normal text — automated axe-core scanning" },
      { label: "Inclusive Features", value: "Dyslexia-friendly font (OpenDyslexic), high contrast mode, reduced motion, simple language mode (Bangla+English)" },
      { label: "Accessibility Statement", value: "Published at /accessibility — conformance status, limitations, feedback mechanism" },
    ],
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export function PRDReference() {
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string>("v56modules");
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? "" : section);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="PRD v5.6 FINAL — 100% Complete Platform Reference"
        description="Living reference: RBAC (§7), e-CMS (§14), ESG (§9.2), AI (§12.5-12.6), SRM (§8.6-8.9), Framework/Catalogue (§5.3-5.4), Analytics (§24.9), KYC/AML (§8.8), Three-Way Matching (§14.12), NIST (§18.1), Blockchain (§17.1), FX (§9.3), API (§19.5), Accessibility (§22.4). 100 screens total."
      />

      {/* Version Banner */}
      <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
        <div className="flex items-center gap-3">
          <BookOpen className="size-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <p className="text-sm">
              <span className="font-semibold">PRD Version 5.6 FINAL</span> — Last updated March 12, 2026
              <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">100% Complete</Badge>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              v5.6 closes all 10 identified gaps: KYC/AML, Three-Way Matching, NIST Cybersecurity, Guided Buying, Risk Assessment,
              Agentic AI, Blockchain Audit, Multi-Currency, API-First, and WCAG Accessibility.
              Total: <strong>100 screens, 36 sections, 5 appendices</strong>.
              Source: <code className="text-indigo-600 dark:text-indigo-400">/src/imports/prd_update_v6.md</code>
            </p>
          </div>
        </div>
      </div>

      {/* v5.6 Gap Closure Summary */}
      <Card className="mb-6">
        <CardHeader className="cursor-pointer" onClick={() => toggleSection("gaps")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="size-5 text-red-600 dark:text-red-400" />
              <div>
                <CardTitle>v5.6 Gap Analysis & Closure — 10 Critical Gaps Resolved</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">All gaps identified in competitive analysis now addressed</p>
              </div>
            </div>
            {expandedSection === "gaps" ? <ChevronUp className="size-5 text-muted-foreground" /> : <ChevronDown className="size-5 text-muted-foreground" />}
          </div>
        </CardHeader>
        {expandedSection === "gaps" && (
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">#</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Gap</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Why Critical</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Impact if Missing</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { num: 1, gap: "KYC/AML Vendor Compliance", why: "Bangladesh Bank regulations, international funding", impact: "Cannot onboard foreign vendors; compliance risk", section: "§8.8" },
                    { num: 2, gap: "Three-Way Matching (PO-Invoice-GRN)", why: "Universal procurement standard; prevents overpayment", impact: "Financial leakage; audit failures", section: "§14.12" },
                    { num: 3, gap: "NIST Cybersecurity Framework", why: "Government procurement data classification", impact: "Data breaches; loss of government trust", section: "§18.1" },
                    { num: 4, gap: "Guided Buying / Punch-Out Catalogs", why: "Modern UX expectation; Amazon Business standard", impact: "Low adoption; maverick spending", section: "§5.4" },
                    { num: 5, gap: "Dynamic Risk Assessment Engine", why: "Real-time supply chain resilience", impact: "Vendor failures; project delays", section: "§8.9" },
                    { num: 6, gap: "Agentic AI / Autonomous Procurement", why: "2025 differentiator per GEP", impact: "Competitive disadvantage", section: "§12.6" },
                    { num: 7, gap: "Blockchain Audit Anchoring", why: "Tamper-proof records for disputes", impact: "Legal challenges; corruption allegations", section: "§17.1" },
                    { num: 8, gap: "Multi-Currency & FX Hedging", why: "International tenders (PG4)", impact: "Currency risk; vendor reluctance", section: "§9.3" },
                    { num: 9, gap: "API-First Architecture & Webhooks", why: "ERP integration requirement", impact: "Siloed systems; manual workarounds", section: "§19.5" },
                    { num: 10, gap: "Accessibility (WCAG 2.1 AA)", why: "Legal requirement; inclusivity", impact: "Lawsuits; exclusion of disabled users", section: "§22.4" },
                  ].map((g) => (
                    <tr key={g.num} className="border-b border-border/50">
                      <td className="py-2 px-3 text-muted-foreground">{g.num}</td>
                      <td className="py-2 px-3">
                        <p className="font-medium">{g.gap}</p>
                        <code className="text-[10px] text-indigo-600 dark:text-indigo-400">{g.section}</code>
                      </td>
                      <td className="py-2 px-3 text-xs text-muted-foreground">{g.why}</td>
                      <td className="py-2 px-3 text-xs text-red-600 dark:text-red-400">{g.impact}</td>
                      <td className="py-2 px-3">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">
                          <CheckCircle2 className="size-3 mr-1" /> Addressed
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>

      {/* v5.6 New Module Details */}
      <Card className="mb-6">
        <CardHeader className="cursor-pointer" onClick={() => toggleSection("v56modules")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cpu className="size-5 text-fuchsia-600 dark:text-fuchsia-400" />
              <div>
                <CardTitle>v5.6 New Modules — Detailed Specifications (10 Modules, 21 Screens)</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Click each module for schema, integration details, and screen specs</p>
              </div>
            </div>
            {expandedSection === "v56modules" ? <ChevronUp className="size-5 text-muted-foreground" /> : <ChevronDown className="size-5 text-muted-foreground" />}
          </div>
        </CardHeader>
        {expandedSection === "v56modules" && (
          <CardContent className="space-y-3">
            {V56_MODULES.map((mod) => {
              const Icon = mod.icon;
              const isOpen = expandedModule === mod.id;
              return (
                <div key={mod.id} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedModule(isOpen ? null : mod.id)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors text-left"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${mod.bgColor}`}>
                      <Icon className={`size-5 ${mod.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{mod.section} {mod.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {mod.screens.length} screen(s) | Tier: {mod.tier}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-xs">{mod.section}</Badge>
                    {isOpen ? <ChevronUp className="size-4 text-muted-foreground shrink-0" /> : <ChevronDown className="size-4 text-muted-foreground shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="border-t border-border p-4 bg-muted space-y-4">
                      {/* Screens */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">New Screens</p>
                        <div className="space-y-1">
                          {mod.screens.map((s) => (
                            <div key={s} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="size-3 text-green-500 shrink-0" />
                              <code className="text-xs text-indigo-600 dark:text-indigo-400">{s}</code>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Schema */}
                      {mod.schema.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Schema Additions</p>
                          <div className="space-y-1">
                            {mod.schema.map((s, idx) => (
                              <div key={idx} className="p-2 bg-background rounded border border-border">
                                <code className="text-xs whitespace-pre-wrap">{s}</code>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Details */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Specification Details</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {mod.details.map((d, idx) => (
                            <div key={idx} className="p-2 bg-background rounded border border-border">
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase">{d.label}</p>
                              <p className="text-xs mt-0.5">{d.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        )}
      </Card>

      {/* v5.5 + v5.6 Changelog Combined */}
      <Card className="mb-6">
        <CardHeader className="cursor-pointer" onClick={() => toggleSection("changelog")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Edit className="size-5 text-green-600 dark:text-green-400" />
              <div>
                <CardTitle>Full Changelog (v5.4 → v5.5 → v5.6)</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Complete feature evolution across all versions</p>
              </div>
            </div>
            {expandedSection === "changelog" ? <ChevronUp className="size-5 text-muted-foreground" /> : <ChevronDown className="size-5 text-muted-foreground" />}
          </div>
        </CardHeader>
        {expandedSection === "changelog" && (
          <CardContent>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">v5.5 Features (from v5.4)</p>
            <div className="space-y-2 mb-6">
              {[
                { feature: "Full e-CMS / Post-Award Module (§14.5-14.10)", screens: "7 screens (46-52)", tier: "Gold+", status: "Implemented" },
                { feature: "Sustainable Public Procurement / ESG Criteria (§9.2)", screens: "ESG tab in Tender Builder", tier: "Gold+", status: "Implemented" },
                { feature: "AI Anomaly Detection (§12.5)", screens: "Flags in Bid Comparison", tier: "Silver+", status: "Implemented" },
                { feature: "Vendor SRM Self-Service Portal (§8.6-8.7)", screens: "SRM Dashboard, Docs, Performance", tier: "All", status: "Implemented" },
                { feature: "Framework Agreements & Catalogue Buying (§5.3)", screens: "3 screens (57-59)", tier: "Gold+", status: "Implemented" },
                { feature: "Advanced Analytics (§24.9)", screens: "4 screens (53-56)", tier: "Gold+", status: "Implemented" },
                { feature: "Bangla UI + Mobile/PWA (§22.3)", screens: "All screens", tier: "All", status: "Planned" },
                { feature: "OCDS Compliance (§28.4)", screens: "API endpoints", tier: "All", status: "Planned" },
                { feature: "NRB Bank Payment Integration (§14.11)", screens: "Payment flow", tier: "Gold+", status: "Planned" },
              ].map((item) => (
                <div key={item.feature} className="flex items-center gap-4 p-3 bg-muted rounded-lg border border-border">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.feature}</p>
                    <p className="text-xs text-muted-foreground">{item.screens} | Tier: {item.tier}</p>
                  </div>
                  <Badge variant="secondary" className={`shrink-0 text-xs ${
                    item.status === "Implemented" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                    item.status === "Planned" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>

            <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">v5.6 Features (Gap Closures)</p>
            <div className="space-y-2">
              {[
                { feature: "KYC/AML Vendor Compliance (§8.8)", screens: "3 screens (60-62)", tier: "Gold+/Platinum", status: "PRD Complete" },
                { feature: "Three-Way Matching PO–Invoice–GRN (§14.12)", screens: "3 screens (63-65)", tier: "Gold+", status: "PRD Complete" },
                { feature: "NIST Cybersecurity Framework (§18.1)", screens: "1 screen (66)", tier: "All", status: "PRD Complete" },
                { feature: "Guided Buying & Punch-Out Catalogs (§5.4)", screens: "4 screens (67-70)", tier: "Silver+/Gold+/Plat", status: "PRD Complete" },
                { feature: "Dynamic Risk Assessment Engine (§8.9)", screens: "3 screens (71-73)", tier: "Gold+/Platinum", status: "PRD Complete" },
                { feature: "Agentic AI / Autonomous Procurement (§12.6)", screens: "3 screens (74-76)", tier: "Platinum (Phase 3)", status: "PRD Complete" },
                { feature: "Blockchain Audit Anchoring (§17.1)", screens: "0 screens (backend)", tier: "Gold+/Platinum", status: "PRD Complete" },
                { feature: "Multi-Currency & FX Hedging (§9.3)", screens: "2 screens (77-78)", tier: "Gold+/Platinum", status: "PRD Complete" },
                { feature: "API-First Architecture & Webhooks (§19.5)", screens: "1 screen (79)", tier: "Silver+/Gold+/Plat", status: "PRD Complete" },
                { feature: "Accessibility WCAG 2.1 AA (§22.4)", screens: "1 screen (80)", tier: "All (legal req.)", status: "PRD Complete" },
              ].map((item) => (
                <div key={item.feature} className="flex items-center gap-4 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.feature}</p>
                    <p className="text-xs text-muted-foreground">{item.screens} | Tier: {item.tier}</p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Complete Screen Map (100 Screens) */}
      <Card className="mb-6">
        <CardHeader className="cursor-pointer" onClick={() => toggleSection("screens")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layers className="size-5 text-purple-600 dark:text-purple-400" />
              <div>
                <CardTitle>§24 Complete Screen Map — 100 Screens Total</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">v5.5 implemented screens + v5.6 PRD-complete new screens</p>
              </div>
            </div>
            {expandedSection === "screens" ? <ChevronUp className="size-5 text-muted-foreground" /> : <ChevronDown className="size-5 text-muted-foreground" />}
          </div>
        </CardHeader>
        {expandedSection === "screens" && (
          <CardContent>
            {/* Screen count summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 text-center">
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">79</p>
                <p className="text-[10px] text-green-600 dark:text-green-500">Core v5.4</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-center">
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">+15</p>
                <p className="text-[10px] text-blue-600 dark:text-blue-500">v5.5 Additions</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 text-center">
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">+21</p>
                <p className="text-[10px] text-purple-600 dark:text-purple-500">v5.6 Additions</p>
              </div>
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 text-center">
                <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">100</p>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-500">Total Final</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">#</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Screen</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Route</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Category</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Version</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Done</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    // v5.5 implemented screens
                    { num: 46, name: "Contract Dashboard", route: "/contracts/:id", cat: "e-CMS", ver: "v5.5", done: true },
                    { num: 47, name: "Milestone Tracker", route: "/contracts/:id/milestones", cat: "e-CMS", ver: "v5.5", done: true },
                    { num: 48, name: "Variation Request", route: "/contracts/:id/variations/new", cat: "e-CMS", ver: "v5.5", done: true },
                    { num: 49, name: "Variation Approval", route: "/contracts/:id/variations/:vid", cat: "e-CMS", ver: "v5.5", done: true },
                    { num: 50, name: "Payment Certificate", route: "/contracts/:id/payments/:pid", cat: "e-CMS", ver: "v5.5", done: true },
                    { num: 51, name: "Performance Rating", route: "/contracts/:id/performance", cat: "e-CMS", ver: "v5.5", done: true },
                    { num: 52, name: "Contract History", route: "/contracts/:id/history", cat: "e-CMS", ver: "v5.5", done: true },
                    { num: 53, name: "Spend by Category", route: "/analytics/spend-category", cat: "Analytics", ver: "v5.5", done: true },
                    { num: 54, name: "Supplier Concentration", route: "/analytics/supplier-concentration", cat: "Analytics", ver: "v5.5", done: true },
                    { num: 55, name: "Savings Tracker", route: "/analytics/savings", cat: "Analytics", ver: "v5.5", done: true },
                    { num: 56, name: "Vendor Performance", route: "/analytics/vendor-performance", cat: "Analytics", ver: "v5.5", done: true },
                    { num: 58, name: "Vendor Catalogue", route: "/vendor-dashboard/catalogue", cat: "Catalogue", ver: "v5.5", done: true },
                    { num: 59, name: "Catalogue Browser", route: "/catalogues/browse", cat: "Catalogue", ver: "v5.5", done: true },
                    { num: 57, name: "Vendor SRM Dashboard", route: "/vendor-dashboard/srm", cat: "SRM", ver: "v5.5", done: true },
                    // v5.6 new screens
                    { num: 60, name: "KYC Dashboard", route: "/compliance/kyc", cat: "KYC/AML", ver: "v5.6", done: false },
                    { num: 61, name: "Vendor KYC Detail", route: "/vendors/:id/kyc", cat: "KYC/AML", ver: "v5.6", done: false },
                    { num: 62, name: "Sanctions Alert Mgmt", route: "/compliance/alerts", cat: "KYC/AML", ver: "v5.6", done: false },
                    { num: 63, name: "GRN Creation", route: "/contracts/:id/grn/new", cat: "Three-Way Match", ver: "v5.6", done: false },
                    { num: 64, name: "Invoice Matching Queue", route: "/finance/matching", cat: "Three-Way Match", ver: "v5.6", done: false },
                    { num: 65, name: "Dispute Resolution", route: "/finance/disputes/:id", cat: "Three-Way Match", ver: "v5.6", done: false },
                    { num: 66, name: "Security Dashboard", route: "/admin/security", cat: "NIST Security", ver: "v5.6", done: false },
                    { num: 67, name: "Guided Buying Homepage", route: "/buy", cat: "Guided Buying", ver: "v5.6", done: false },
                    { num: 68, name: "Punch-Out Session", route: "/buy/punchout/:vendor_id", cat: "Guided Buying", ver: "v5.6", done: false },
                    { num: 69, name: "Cart Review", route: "/buy/cart", cat: "Guided Buying", ver: "v5.6", done: false },
                    { num: 70, name: "Requisition to PO", route: "/buy/checkout", cat: "Guided Buying", ver: "v5.6", done: false },
                    { num: 71, name: "Risk Command Center", route: "/risk/dashboard", cat: "Risk Engine", ver: "v5.6", done: false },
                    { num: 72, name: "Vendor Risk Profile", route: "/vendors/:id/risk", cat: "Risk Engine", ver: "v5.6", done: false },
                    { num: 73, name: "Mitigation Workflow", route: "/risk/mitigations/:id", cat: "Risk Engine", ver: "v5.6", done: false },
                    { num: 74, name: "AI Agent Control Center", route: "/ai/agents", cat: "Agentic AI", ver: "v5.6", done: false },
                    { num: 75, name: "Agent Configuration", route: "/ai/config", cat: "Agentic AI", ver: "v5.6", done: false },
                    { num: 76, name: "Agent Performance", route: "/ai/analytics", cat: "Agentic AI", ver: "v5.6", done: false },
                    { num: 77, name: "FX Dashboard", route: "/finance/fx", cat: "Multi-Currency", ver: "v5.6", done: false },
                    { num: 78, name: "Multi-Currency Bid Comparison", route: "/tenders/:id/fx-comparison", cat: "Multi-Currency", ver: "v5.6", done: false },
                    { num: 79, name: "Developer Portal", route: "/developers", cat: "API Ecosystem", ver: "v5.6", done: false },
                    { num: 80, name: "Accessibility Settings", route: "/settings/accessibility", cat: "Accessibility", ver: "v5.6", done: false },
                  ].map((s) => (
                    <tr key={s.num} className={`border-b border-border/50 ${s.ver === "v5.6" ? "bg-purple-50/50 dark:bg-purple-900/5" : ""}`}>
                      <td className="py-2 px-3 text-muted-foreground">{s.num}</td>
                      <td className="py-2 px-3 font-medium">{s.name}</td>
                      <td className="py-2 px-3"><code className="text-xs text-indigo-600 dark:text-indigo-400">{s.route}</code></td>
                      <td className="py-2 px-3"><Badge variant="outline" className="text-xs">{s.cat}</Badge></td>
                      <td className="py-2 px-3">
                        <Badge className={`text-[10px] ${s.ver === "v5.6" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}>{s.ver}</Badge>
                      </td>
                      <td className="py-2 px-3">{s.done ? <CheckCircle2 className="size-4 text-green-500" /> : <XCircle className="size-4 text-muted-foreground/50" />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Category breakdown */}
            <div className="mt-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">Screen Count by Category</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { cat: "Authentication", v55: 4, v56new: 0 },
                  { cat: "Buyer Dashboard", v55: 6, v56new: 0 },
                  { cat: "Vendor Management", v55: 7, v56new: 3 },
                  { cat: "RFQ Creation", v55: 7, v56new: 0 },
                  { cat: "RFQ Monitoring", v55: 6, v56new: 0 },
                  { cat: "Vendor Portal", v55: 6, v56new: 0 },
                  { cat: "Evaluation", v55: 5, v56new: 0 },
                  { cat: "Award & Contract", v55: 4, v56new: 4 },
                  { cat: "Admin", v55: 11, v56new: 2 },
                  { cat: "Support", v55: 2, v56new: 0 },
                  { cat: "Analytics", v55: 4, v56new: 0 },
                  { cat: "e-CMS", v55: 7, v56new: 0 },
                  { cat: "Framework/Catalogue", v55: 3, v56new: 4 },
                  { cat: "AI/Automation", v55: 0, v56new: 3 },
                  { cat: "Risk", v55: 0, v56new: 3 },
                  { cat: "FX/Finance", v55: 0, v56new: 2 },
                  { cat: "Accessibility", v55: 0, v56new: 1 },
                ].map((c) => (
                  <div key={c.cat} className="p-2 border border-border rounded text-center">
                    <p className="text-xs font-medium">{c.cat}</p>
                    <p className="text-lg font-bold">{c.v55 + c.v56new}</p>
                    {c.v56new > 0 && <p className="text-[10px] text-purple-600 dark:text-purple-400">+{c.v56new} v5.6</p>}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* v5.6 Final Structure Tree */}
      <Card className="mb-6">
        <CardHeader className="cursor-pointer" onClick={() => toggleSection("tree")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layers className="size-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <CardTitle>v5.6 FINAL — 100% Complete PRD Structure</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Full module tree with screen counts</p>
              </div>
            </div>
            {expandedSection === "tree" ? <ChevronUp className="size-5 text-muted-foreground" /> : <ChevronDown className="size-5 text-muted-foreground" />}
          </div>
        </CardHeader>
        {expandedSection === "tree" && (
          <CardContent>
            <div className="font-mono text-xs space-y-1 p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto">
              <p className="text-yellow-400 font-bold">v5.6 FINAL (100% Complete)</p>
              {[
                { line: "├── Core Platform (v5.4)", detail: "79 screens", color: "text-green-400" },
                { line: "├── e-CMS & Post-Award (v5.5)", detail: "7 screens → 11 screens", color: "text-blue-400" },
                { line: "├── ESG & Sustainability (v5.5)", detail: "1 screen", color: "text-blue-400" },
                { line: "├── SRM & Vendor Portal (v5.5)", detail: "4 screens → 7 screens", color: "text-blue-400" },
                { line: "├── Framework & Catalogue (v5.5)", detail: "3 screens → 7 screens", color: "text-blue-400" },
                { line: "├── KYC/AML Compliance (NEW §8.8)", detail: "3 screens", color: "text-purple-400" },
                { line: "├── Three-Way Matching (NEW §14.12)", detail: "3 screens", color: "text-purple-400" },
                { line: "├── Security & NIST (NEW §18.1)", detail: "1 screen", color: "text-purple-400" },
                { line: "├── Guided Buying (NEW §5.4)", detail: "4 screens", color: "text-purple-400" },
                { line: "├── Risk Intelligence (NEW §8.9)", detail: "3 screens", color: "text-purple-400" },
                { line: "├── Agentic AI (NEW §12.6)", detail: "3 screens", color: "text-purple-400" },
                { line: "├── Blockchain Audit (NEW §17.1)", detail: "0 screens (backend)", color: "text-purple-400" },
                { line: "├── Multi-Currency (NEW §9.3)", detail: "2 screens", color: "text-purple-400" },
                { line: "├── API Ecosystem (NEW §19.5)", detail: "1 screen", color: "text-purple-400" },
                { line: "└── Accessibility (NEW §22.4)", detail: "1 screen", color: "text-purple-400" },
              ].map((t, idx) => (
                <p key={idx}><span className="text-muted-foreground">{t.line}</span> — <span className={t.color}>{t.detail}</span></p>
              ))}
              <p className="mt-2 text-yellow-400 font-bold">TOTAL: 100 screens, 36 sections, 5 appendices</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Subscription Tiers */}
      <Card className="mb-6">
        <CardHeader className="cursor-pointer" onClick={() => toggleSection("subscriptions")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="size-5 text-amber-600 dark:text-amber-400" />
              <div>
                <CardTitle>§15 Subscription Packages (v5.6 Hybrid Model)</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Monthly subscription + success fee per award — updated with v5.6 module tiers</p>
              </div>
            </div>
            {expandedSection === "subscriptions" ? <ChevronUp className="size-5 text-muted-foreground" /> : <ChevronDown className="size-5 text-muted-foreground" />}
          </div>
        </CardHeader>
        {expandedSection === "subscriptions" && (
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Package</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Monthly</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Fee</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">v5.5 Features</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">v5.6 Features</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { pkg: "Starter", price: "BDT 4,900", fee: "0.50%", v55: "Basic e-Tendering, 5 RFQs/week", v56: "WCAG AA, basic API (read), NIST alignment" },
                    { pkg: "Professional", price: "BDT 14,900", fee: "0.25%", v55: "+ Live bidding, Basic e-CMS, Basic AI", v56: "+ Basic catalogs, read/write API, webhooks" },
                    { pkg: "Business", price: "BDT 34,900", fee: "0.15%", v55: "+ Full e-CMS, ESG, Framework, Analytics", v56: "+ KYC basic, three-way matching, punch-out, risk basic, multi-currency, blockchain anchoring" },
                    { pkg: "Enterprise", price: "BDT 79,900+", fee: "0.10%", v55: "+ Custom workflows, Full AI, Variations", v56: "+ KYC enhanced, predictive risk, FX hedging, custom integrations" },
                    { pkg: "Platinum", price: "Negotiated", fee: "Negotiated", v55: "All features, dedicated support", v56: "+ Agentic AI, ongoing KYC, custom blockchain validators, private API" },
                  ].map((t) => (
                    <tr key={t.pkg} className="border-b border-border/50">
                      <td className="py-2 px-3 font-medium">{t.pkg}</td>
                      <td className="py-2 px-3">{t.price}</td>
                      <td className="py-2 px-3">{t.fee}</td>
                      <td className="py-2 px-3 text-xs text-muted-foreground">{t.v55}</td>
                      <td className="py-2 px-3 text-xs text-purple-600 dark:text-purple-400">{t.v56}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3 italic">
              Success Fee Cap: Max BDT 500,000/tender. Auto-calculated on AWARD_ISSUED. 7-day payment terms.
            </p>
          </CardContent>
        )}
      </Card>

      {/* ─── §7.1 Platform Roles ──────────────────────────────────────── */}
      <Card className="mb-6">
        <CardHeader className="cursor-pointer" onClick={() => toggleSection("roles")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="size-5 text-blue-600 dark:text-blue-400" />
              <div>
                <CardTitle>§7.1 Platform Roles & Tender Visibility</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  11 roles across 3 entity types. All role definitions sourced from <code className="text-indigo-600 dark:text-indigo-400">/src/app/config/roles.json</code>.
                </p>
              </div>
            </div>
            {expandedSection === "roles" ? <ChevronUp className="size-5 text-muted-foreground" /> : <ChevronDown className="size-5 text-muted-foreground" />}
          </div>
        </CardHeader>
        {expandedSection === "roles" && (
          <CardContent className="space-y-4">
            {PLATFORM_ROLES.map((role) => {
              const Icon = role.icon;
              const isExpanded = expandedRole === role.id;
              return (
                <div key={role.id} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedRole(isExpanded ? null : role.id)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors text-left"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${role.color}`}>
                      <Icon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{role.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{role.description}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-xs">{role.sidebarSection}</Badge>
                    {isExpanded ? <ChevronUp className="size-4 text-muted-foreground shrink-0" /> : <ChevronDown className="size-4 text-muted-foreground shrink-0" />}
                  </button>
                  {isExpanded && (
                    <div className="border-t border-border p-4 bg-muted space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">/tenders Page Visibility</p>
                        <div className="p-3 bg-background rounded-lg border border-border">
                          <div className="flex items-start gap-2">
                            <Eye className="size-4 text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-sm">{role.tenderListVisibility}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Table Columns Visible</p>
                        <div className="flex flex-wrap gap-1.5">
                          {role.tenderListColumns.map((col) => (
                            <Badge key={col} variant="secondary" className="text-xs">{col}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Available Actions</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {role.tenderActions.map((action) => (
                            <div key={action} className="flex items-center gap-2 text-xs p-2 bg-background rounded border border-border">
                              <CheckCircle2 className="size-3 text-green-500 shrink-0" />
                              <span>{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Accessible Routes</p>
                        <div className="flex flex-wrap gap-1.5">
                          {role.canAccessRoutes.map((route) => (
                            <code key={route} className="text-[10px] px-2 py-1 bg-muted rounded text-muted-foreground">{route}</code>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        )}
      </Card>

      {/* §7.3 Tender Status Visibility Matrix */}
      <Card className="mb-6">
        <CardHeader className="cursor-pointer" onClick={() => toggleSection("statuses")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layers className="size-5 text-green-600 dark:text-green-400" />
              <div>
                <CardTitle>§7.3 Tender Status Lifecycle & Visibility Matrix</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">13 statuses — which roles see each status</p>
              </div>
            </div>
            {expandedSection === "statuses" ? <ChevronUp className="size-5 text-muted-foreground" /> : <ChevronDown className="size-5 text-muted-foreground" />}
          </div>
        </CardHeader>
        {expandedSection === "statuses" && (
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                    {["Procurer", "PreQual", "Tech Eval", "Comm Eval", "Auditor", "Proc Head", "Vendor"].map((h) => (
                      <th key={h} className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TENDER_STATUSES.map((s) => (
                    <tr key={s.status} className="border-b border-border/50">
                      <td className="py-2.5 px-4">
                        <Badge variant="secondary" className={`text-[10px] ${s.color}`}>{s.status}</Badge>
                        <p className="text-[10px] text-muted-foreground/70 mt-0.5 max-w-xs">{s.description}</p>
                      </td>
                      {["procurer", "prequal_evaluator", "tech_evaluator", "commercial_evaluator", "auditor", "procurement_head", "vendor"].map((roleId) => (
                        <td key={roleId} className="py-2.5 px-2 text-center">
                          {s.visibleTo.includes(roleId) ? <CheckCircle2 className="size-4 text-green-500 mx-auto" /> : <XCircle className="size-4 text-muted-foreground/50 mx-auto" />}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>

      {/* §7.5 Approval Workflow */}
      <Card className="mb-6">
        <CardHeader className="cursor-pointer" onClick={() => toggleSection("workflows")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ArrowRight className="size-5 text-purple-600 dark:text-purple-400" />
              <div>
                <CardTitle>§7.5 Approval Workflow Per Tender Type</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">6 tender types — required approval stages</p>
              </div>
            </div>
            {expandedSection === "workflows" ? <ChevronUp className="size-5 text-muted-foreground" /> : <ChevronDown className="size-5 text-muted-foreground" />}
          </div>
        </CardHeader>
        {expandedSection === "workflows" && (
          <CardContent className="space-y-6">
            {WORKFLOW_SPECS.map((wf) => (
              <div key={wf.code} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium">{wf.tenderType}</p>
                    <code className="text-[10px] text-muted-foreground">preset: {wf.code}</code>
                  </div>
                  <Badge variant="outline">{wf.totalStages === -1 ? "Custom" : `${wf.totalStages} stages`}</Badge>
                </div>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {wf.stages.map((stage, idx) => (
                    <div key={stage.role} className="flex items-center gap-2">
                      <div className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                        stage.required
                          ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400"
                          : "bg-muted border-border text-muted-foreground"
                      }`}>
                        {stage.role}{stage.required && <span className="ml-1 text-red-500">*</span>}
                      </div>
                      {idx < wf.stages.length - 1 && <ArrowRight className="size-3 text-muted-foreground shrink-0" />}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground italic">{wf.notes}</p>
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      {/* §7.7 Sequential Forwarding Rules */}
      <Card className="mb-6">
        <CardHeader className="cursor-pointer" onClick={() => toggleSection("forwarding")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="size-5 text-red-600 dark:text-red-400" />
              <div>
                <CardTitle>§7.7 Sequential Forwarding Rules</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">6 rules governing tender stage movement</p>
              </div>
            </div>
            {expandedSection === "forwarding" ? <ChevronUp className="size-5 text-muted-foreground" /> : <ChevronDown className="size-5 text-muted-foreground" />}
          </div>
        </CardHeader>
        {expandedSection === "forwarding" && (
          <CardContent className="space-y-3">
            {FORWARDING_RULES.map((rule) => {
              const Icon = rule.icon;
              return (
                <div key={rule.rule} className="flex items-start gap-4 p-4 bg-muted rounded-lg border border-border">
                  <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                    <Icon className="size-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{rule.rule}</p>
                    <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        )}
      </Card>

      {/* §7.6 Data Visibility Rules */}
      <Card className="mb-6">
        <CardHeader className="cursor-pointer" onClick={() => toggleSection("data")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="size-5 text-amber-600 dark:text-amber-400" />
              <div>
                <CardTitle>§7.6 Data Visibility & Isolation Rules</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">What data each role can see within a tender</p>
              </div>
            </div>
            {expandedSection === "data" ? <ChevronUp className="size-5 text-muted-foreground" /> : <ChevronDown className="size-5 text-muted-foreground" />}
          </div>
        </CardHeader>
        {expandedSection === "data" && (
          <CardContent>
            <div className="space-y-3">
              {[
                { title: "Vendor Bid Isolation", description: "Vendors can NEVER see other vendors' bids, scores, or rankings. Each vendor only sees their own submissions.", roles: "All vendor-facing pages", severity: "critical" },
                { title: "Evaluation Scores", description: "Technical scores are only visible to Technical Evaluator + Procurement Head + Auditor. Commercial Evaluator cannot see technical scores until commercial evaluation is complete.", roles: "tech_evaluator, procurement_head, auditor", severity: "high" },
                { title: "Commercial Pricing", description: "Bid prices are sealed until the Commercial Evaluation stage. Technical Evaluator CANNOT see prices during technical scoring (prevents bias).", roles: "commercial_evaluator, procurement_head, auditor", severity: "critical" },
                { title: "Audit Trail", description: "Full audit trail visible to Auditor + Procurement Head. Other evaluators see only their own stage's audit entries.", roles: "auditor, procurement_head", severity: "high" },
                { title: "Draft Tenders", description: "Draft tenders are only visible to the Procurer who created them and the Procurement Head.", roles: "procurer (creator), procurement_head", severity: "medium" },
                { title: "Workflow Configuration", description: "Evaluators can see WHO is assigned to each stage but cannot modify assignments. Only the Procurer can configure during Draft stage.", roles: "procurer (edit), all evaluators (read-only)", severity: "medium" },
                { title: "Organisation Boundary", description: "All data is scoped to the organisation. Multi-tenancy enforced at database level.", roles: "All roles", severity: "critical" },
                { title: "KYC/AML Data (v5.6)", description: "Beneficial ownership, PEP status, sanctions screening results are classified as RESTRICTED. Only Compliance Officer + Super Admin with 2-person rule.", roles: "compliance_officer, super_admin", severity: "critical" },
                { title: "FX & Pricing (v5.6)", description: "FX rates and bid currency conversions are sealed during evaluation. Only Commercial Evaluator + Procurement Head see converted BDT equivalents.", roles: "commercial_evaluator, procurement_head", severity: "high" },
              ].map((rule) => (
                <div key={rule.title} className="p-4 bg-muted rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{rule.title}</p>
                    <Badge variant="secondary" className={`text-[10px] ${
                      rule.severity === "critical" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                      rule.severity === "high" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}>
                      {rule.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{rule.description}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">Visible to: {rule.roles}</p>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Implementation Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings className="size-5 text-muted-foreground" />
            <div>
              <CardTitle>Implementation Status (v5.6)</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Current status across all modules — 94 screens built, 21 screens PRD-complete</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { page: "roles.json (Single Source of Truth)", status: "Done", note: "All 11 roles across 3 entity types defined. Drives sidebar, columns, permissions, and navigation." },
              { page: "Auth Context + Tender Tagging", status: "Done", note: "useAuth() provides activeRole, tenderTags[], isTaggedOnTender(). PE Admin sees org-wide, Super Admin sees all." },
              { page: "useRoles() Hook", status: "Done", note: "Reads roles.json at runtime. Provides getRole(), getPermissions(), getNavigation(), getTenderColumns()." },
              { page: "/tenders (rfq-list.tsx)", status: "Done", note: "Tender-level tagging. Columns, actions, stats driven by roles.json. Vendor roles redirected to /rfqs." },
              { page: "/tenders/new/* (all create forms)", status: "Done", note: "ApprovalWorkflowConfig in all tender types. Evaluator assignment triggers tender tagging." },
              { page: "/tenders/:id/* (evaluation pages)", status: "Done", note: "RouteGuard gates all pages by role + tender tagging." },
              { page: "Sidebar Navigation (11-role switcher)", status: "Done", note: "Grouped by entity type. Navigation items from roles.json. Role badge + user info." },
              { page: "e-CMS Post-Award (§14.5-14.10)", status: "Done", note: "7 screens: Contract Dashboard, Milestone Tracker, Variation, Payment, Performance, History." },
              { page: "Advanced Analytics (§24.9)", status: "Done", note: "4 screens: Spend by Category, Supplier Concentration, Savings Tracker, Vendor Performance." },
              { page: "Vendor SRM (§8.6-8.7)", status: "Done", note: "SRM Dashboard with performance trends, contracts, payments, document expiry." },
              { page: "Framework/Catalogue (§5.3)", status: "Done", note: "Vendor Catalogue Manager + Catalogue Browser. Categories from JSON config." },
              { page: "Catalogue Category Mgmt", status: "Done", note: "Super Admin CRUD at /admin/catalogue-categories. Single source of truth from tender-options.json." },
              { page: "PRD Reference Page (this page)", status: "Done", note: "Updated to v5.6 FINAL with all 10 gap closure modules, 100-screen map, structure tree." },
              { page: "ESG/SPP Criteria (§9.2)", status: "Partial", note: "PRD documented. ESG fields defined. Frontend toggle/weighting UI planned." },
              { page: "AI Anomaly Detection (§12.5)", status: "Partial", note: "PRD documented. SLT/outlier flag logic defined. Frontend integration planned." },
              { page: "KYC/AML Compliance (§8.8)", status: "PRD Complete", note: "v5.6: 3 screens (60-62). KYC levels, schema, integrations (NBR, sanctions, PEP) fully specified." },
              { page: "Three-Way Matching (§14.12)", status: "PRD Complete", note: "v5.6: 3 screens (63-65). GRN, invoice matching, disputes. OCR + auto-match rules defined." },
              { page: "NIST Security (§18.1)", status: "PRD Complete", note: "v5.6: 1 screen (66). NIST functions, controls, data classification, certification path." },
              { page: "Guided Buying (§5.4)", status: "PRD Complete", note: "v5.6: 4 screens (67-70). Punch-out cXML/OCI, guided rules, cart, BD supplier integration." },
              { page: "Risk Assessment (§8.9)", status: "PRD Complete", note: "v5.6: 3 screens (71-73). 6-dimension scoring, risk tiers, automated actions, mitigation workflow." },
              { page: "Agentic AI (§12.6)", status: "PRD Complete", note: "v5.6: 3 screens (74-76). 4 agent types, guardrails, GPT/Claude + Temporal.io. Platinum Phase 3." },
              { page: "Blockchain Audit (§17.1)", status: "PRD Complete", note: "v5.6: Backend service. Merkle root anchoring, verification API, legal admissibility." },
              { page: "Multi-Currency (§9.3)", status: "PRD Complete", note: "v5.6: 2 screens (77-78). BDT/USD/EUR/GBP/JPY, rate locking, hedging, dual-currency bidding." },
              { page: "API-First (§19.5)", status: "PRD Complete", note: "v5.6: 1 screen (79). REST+GraphQL+Webhooks, ERP integrations, developer portal, rate limits." },
              { page: "Accessibility (§22.4)", status: "PRD Complete", note: "v5.6: 1 screen (80). WCAG 2.1 AA, screen readers, dyslexia font, high contrast, reduced motion." },
              { page: "Bangla UI / i18n (§22.3)", status: "Not Started", note: "PRD documented. i18next integration, en.json/bn.json, language toggle planned." },
            ].map((item) => (
              <div key={item.page} className="flex items-center gap-4 p-3 bg-muted rounded-lg border border-border">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.page}</p>
                  <p className="text-xs text-muted-foreground">{item.note}</p>
                </div>
                <Badge variant="secondary" className={`shrink-0 text-xs ${
                  item.status === "Done" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                  item.status === "Partial" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                  item.status === "PRD Complete" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                  item.status === "Not Started" ? "bg-muted text-muted-foreground" :
                  "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                }`}>
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
