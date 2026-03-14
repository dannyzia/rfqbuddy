import { useState, useMemo } from "react";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Code2,
  Database,
  Layout,
  Shield,
  Server,
  Layers,
  FileText,
  Users,
  Bell,
  Package,
  BarChart3,
  Calendar,
  Settings,
  HelpCircle,
  ShoppingCart,
  Cpu,
  TestTube,
  Rocket,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Building2,
  GitBranch,
  Workflow,
  Award,
  Star,
  Upload,
  ScrollText,
  Zap,
  Globe,
  Lock,
  Container,
  FileCode,
  Table2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

// ─── Plan Data ───────────────────────────────────────────────────────

interface Phase {
  id: number;
  title: string;
  icon: React.ReactNode;
  status: "completed" | "in-progress" | "planned" | "future";
  estimatedHours: string;
  backend: boolean;
  frontend: boolean;
  database: boolean;
  description: string;
  keyDeliverables: string[];
  tables?: string[];
  endpoints?: string[];
  pages?: string[];
  dependencies?: string[];
  notes?: string;
}

const phases: Phase[] = [
  {
    id: 1,
    title: "Project Scaffold & Infrastructure Setup",
    icon: <Container className="size-5" />,
    status: "planned",
    estimatedHours: "3-4",
    backend: true, frontend: true, database: true,
    description: "Monorepo structure (backend/ + frontend/), managed PostgreSQL provisioning (Neon), Cloudflare R2 bucket setup, Redis provisioning (Upstash), Resend email API key, Drizzle ORM schema init, and environment configuration.",
    keyDeliverables: [
      "Managed PostgreSQL database (Neon — zero ops, auto-backups)",
      "Backend: Node.js + Fastify + TypeScript scaffold with directory structure",
      "Frontend: Next.js 15 (App Router) scaffold — shadcn/ui components port 1:1 from prototype",
      "Drizzle ORM schema + migration runner",
      "Cloudflare R2 storage bucket (S3-compatible, zero egress fees)",
      "Upstash Redis for BullMQ job queues",
      "Resend email API integration",
      "Environment variable configuration",
    ],
    tables: [],
    endpoints: [],
    pages: [],
    notes: "No Docker required for development. All services are managed/serverless. Total monthly cost for MVP: $0-$30.",
  },
  {
    id: 2,
    title: "Authentication & RBAC",
    icon: <Shield className="size-5" />,
    status: "planned",
    estimatedHours: "4-6",
    backend: true, frontend: true, database: true,
    description: "Better Auth integration with JWT custom claims (role, org_id), 11-role RBAC system driven by roles.json, Fastify middleware chain (requireAuth → requireRole → requireOrg), Next.js middleware for route protection, login/register UI with role-based redirects.",
    keyDeliverables: [
      "Better Auth setup (email/password + OAuth + 2FA — 1 service, not 3)",
      "requireAuth middleware (JWT verification + profile fetch)",
      "requireRole middleware (configurable allowed roles from roles.json)",
      "requireAdmin middleware (super_admin shortcut)",
      "Next.js middleware.ts for frontend route protection",
      "Pending/approved/rejected approval flow",
      "Login page with role-based redirect (ports from React prototype)",
      "Register pages (Procuring Entity + Vendor)",
      "Forgot/reset password flow",
    ],
    tables: ["profiles"],
    endpoints: ["POST /api/auth/sign-up", "POST /api/auth/sign-in", "POST /api/auth/sign-out", "GET /api/auth/profile", "POST /api/auth/forgot-password", "POST /api/auth/reset-password"],
    pages: ["login", "register", "register/procuring-entity", "register/vendor", "forgot-password", "reset-password", "2fa-verify"],
    dependencies: ["Phase 1 must be complete"],
  },
  {
    id: 3,
    title: "Multi-Tenant Organisation Model",
    icon: <Building2 className="size-5" />,
    status: "planned",
    estimatedHours: "3-4",
    backend: true, frontend: true, database: true,
    description: "Organisation CRUD with type discrimination (procuring_entity vs vendor), member management with role-based invitations, vendor profile extension with business details, certifications, and bank information.",
    keyDeliverables: [
      "Organisation CRUD API",
      "Member management (invite, remove, change role)",
      "Vendor profile extension (business type, categories, certifications)",
      "Org approval workflow (admin approves new orgs)",
      "Organisation settings page",
    ],
    tables: ["organizations", "org_members", "vendor_profiles"],
    endpoints: ["GET /api/orgs", "POST /api/orgs", "GET /api/orgs/:id", "PATCH /api/orgs/:id", "GET /api/orgs/:id/members", "POST /api/orgs/:id/members", "DELETE /api/orgs/:id/members/:uid"],
    pages: ["profile (org settings)", "organisation/members"],
    dependencies: ["Phase 2"],
  },
  {
    id: 4,
    title: "Tender/RFQ Lifecycle",
    icon: <FileText className="size-5" />,
    status: "planned",
    estimatedHours: "6-8",
    backend: true, frontend: true, database: true,
    description: "Complete tender lifecycle from draft to award. Supports 6 tender types (NRQ1 Simple, NRQ2 Detailed, NRQ3 Custom, RFP, Framework Agreement, Catalogue Order). Status state machine with 15 states. Auto-generated tender numbers (RFQ-YYYY-NNNN).",
    keyDeliverables: [
      "Tender CRUD with auto-numbering trigger",
      "Line item management (add, edit, reorder)",
      "Tender type-specific creation wizards",
      "Status state machine (draft → published → open → evaluation stages → awarded)",
      "Vendor invitation system with email notifications",
      "Document upload integration (Cloudflare R2 via S3 SDK)",
      "Tender list page with config-driven columns and URL search param persistence",
      "Publish/close/withhold workflows",
      "RFQ Monitoring: tender dashboard, vendor participation, live bidding, bid timeline, history, audit log",
    ],
    tables: ["tenders", "tender_items", "tender_assignments", "tender_invitations", "tender_documents"],
    endpoints: [
      "GET /api/tenders", "POST /api/tenders", "GET /api/tenders/:id", "PATCH /api/tenders/:id",
      "DELETE /api/tenders/:id", "POST /api/tenders/:id/publish", "POST /api/tenders/:id/close",
      "POST /api/tenders/:id/forward", "GET /api/tenders/:id/items", "POST /api/tenders/:id/items",
      "POST /api/tenders/:id/invite", "GET /api/tenders/:id/participation", "GET /api/tenders/:id/timeline",
    ],
    pages: [
      "tenders (list)", "tenders/create (builder)", "tenders/new (type selector)", "tenders/new/simple",
      "tenders/new/detailed", "tenders/new/custom", "tenders/new/rfp",
      "tenders/new/documents", "tenders/new/vendors", "tenders/new/preview", "tenders/new/publish",
      "tenders/:id (monitoring dashboard)", "tenders/:id/participation", "tenders/:id/live",
      "tenders/:id/timeline", "tenders/:id/history", "tenders/:id/audit",
    ],
    dependencies: ["Phase 2, Phase 3"],
  },
  {
    id: 5,
    title: "Bid Submission & Management",
    icon: <Layers className="size-5" />,
    status: "planned",
    estimatedHours: "5-7",
    backend: true, frontend: true, database: true,
    description: "Vendor bid submission with both quick-submit and 10-step wizard flows. Line item pricing, document upload, compliance declaration. One bid per vendor per tender. Deadline enforcement. Realtime notification to procurer on submission.",
    keyDeliverables: [
      "Bid CRUD with auto-numbering",
      "Quick bid submission form",
      "10-step bid wizard (company info → items → pricing → documents → compliance → review → submit)",
      "Line item pricing with auto-total calculation",
      "Bid document upload (Cloudflare R2)",
      "Deadline enforcement (reject after submission_deadline)",
      "Bid withdrawal flow",
      "Bid history page for vendors",
      "Realtime WebSocket notification to procurer",
    ],
    tables: ["bids", "bid_items", "bid_documents"],
    endpoints: [
      "GET /api/bids", "POST /api/bids", "GET /api/bids/:id", "PATCH /api/bids/:id",
      "POST /api/bids/:id/submit", "POST /api/bids/:id/withdraw",
      "GET /api/bids/:id/items", "POST /api/bids/:id/items",
    ],
    pages: ["rfqs (available)", "rfqs/:id (detail)", "rfqs/:id/bid (quick)", "rfqs/:id/bid/wizard", "rfqs/:id/bid/documents", "vendor-bids (history)"],
    dependencies: ["Phase 4"],
  },
  {
    id: 6,
    title: "Evaluation Workflow (4-Stage Pipeline)",
    icon: <Workflow className="size-5" />,
    status: "planned",
    estimatedHours: "6-8",
    backend: true, frontend: true, database: true,
    description: "Sequential 4-stage evaluation pipeline: Prequalification → Technical → Commercial → Audit. Each stage has dedicated evaluator roles with criterion-based scoring. Forwarding mechanism passes tenders through the pipeline. Configurable pass/fail thresholds and scoring weights.",
    keyDeliverables: [
      "Evaluation criteria CRUD (per tender, per stage)",
      "Scoring forms for each evaluation stage",
      "Pass/fail threshold enforcement",
      "Sequential forwarding with workflow_transitions log",
      "Bid comparison matrix (cross-vendor, cross-criterion)",
      "Vendor ranking with weighted scores",
      "Evaluation report generation",
      "Stage-specific UI for each evaluator role",
    ],
    tables: ["evaluation_criteria", "evaluation_scores", "evaluation_results", "workflow_transitions"],
    endpoints: [
      "GET /api/eval/:tenderId/criteria", "POST /api/eval/:tenderId/criteria",
      "POST /api/eval/:tenderId/scores", "GET /api/eval/:tenderId/results",
      "POST /api/eval/:tenderId/forward", "GET /api/eval/:tenderId/comparison",
      "GET /api/eval/:tenderId/ranking",
    ],
    pages: ["tenders/:id/prequalification-eval", "tenders/:id/technical-eval", "tenders/:id/commercial-eval", "tenders/:id/audit-review", "tenders/:id/bid-opening", "tenders/:id/comparison", "tenders/:id/ranking", "tenders/:id/evaluation-report"],
    dependencies: ["Phase 4, Phase 5"],
  },
  {
    id: 7,
    title: "Award & Contract Management",
    icon: <Award className="size-5" />,
    status: "planned",
    estimatedHours: "4-6",
    backend: true, frontend: true, database: true,
    description: "Award decision by procurement head, contract auto-generation from winning bid data, milestone tracking, variation requests with approval workflow, payment certificate processing, and contract performance ratings.",
    keyDeliverables: [
      "Award decision form (approve/reject with reasons)",
      "Contract auto-generation from tender + bid data",
      "Contract dashboard with lifecycle tracking",
      "Milestone CRUD with status tracking",
      "Variation request + approval workflow",
      "Payment certificate submission + approval",
      "Contract performance rating by buyers",
      "Contract history/audit trail",
    ],
    tables: ["contracts", "contract_milestones", "contract_variations", "payment_certificates"],
    endpoints: [
      "POST /api/tenders/:id/award", "POST /api/contracts", "GET /api/contracts/:id",
      "PATCH /api/contracts/:id", "GET /api/contracts/:id/milestones",
      "POST /api/contracts/:id/variations", "POST /api/contracts/:id/payments",
    ],
    pages: ["tenders/:id/award", "contracts/new (generation)", "contracts/:id (dashboard)", "contracts/:id/details", "contracts/:id/milestones", "contracts/:id/variations/new", "contracts/:id/variations/:vid", "contracts/:id/payments/:pid", "contracts/:id/performance", "contracts/:id/history"],
    dependencies: ["Phase 6"],
  },
  {
    id: 8,
    title: "Vendor Management & SRM",
    icon: <Star className="size-5" />,
    status: "planned",
    estimatedHours: "4-5",
    backend: true, frontend: true, database: true,
    description: "Vendor enlistment system with configurable form builder, performance review mechanism, SRM scoring algorithm, risk level assessment, vendor category mapping, and vendor list with advanced filters.",
    keyDeliverables: [
      "Vendor list with search, filter, sort",
      "Vendor profile detail page",
      "Enlistment form builder (dynamic fields)",
      "Enlistment application + review workflow",
      "Performance review submission + history",
      "SRM score calculation algorithm",
      "Risk level auto-assessment",
      "Vendor category management",
    ],
    tables: ["vendor_enlistments", "vendor_performance_reviews", "vendor_categories_map"],
    endpoints: [
      "GET /api/vendors", "GET /api/vendors/:orgId", "POST /api/vendors/enlistment",
      "PATCH /api/vendors/enlistment/:id", "POST /api/vendors/:orgId/reviews",
      "GET /api/vendors/:orgId/srm",
    ],
    pages: [
      "vendors (list)", "vendors/:id (profile)", "vendors/:id/categories", "vendors/:id/performance",
      "vendor-enlistment", "vendor-enlistment/:id (approval)", "vendor-enlistment/form-builder",
      "vendor-risk", "vendor-dashboard/srm", "vendor-enlistment-requests", "vendor-enlistment/apply/:id",
    ],
    dependencies: ["Phase 3"],
  },
  {
    id: 9,
    title: "Notification Engine (Email + In-App + Realtime)",
    icon: <Bell className="size-5" />,
    status: "planned",
    estimatedHours: "4-5",
    backend: true, frontend: true, database: true,
    description: "Multi-channel notification system: in-app (DB + Socket.io WebSocket), email (Resend API with Handlebars templates), and scheduled digests (BullMQ cron jobs). 6 default email templates with admin-editable content.",
    keyDeliverables: [
      "Notification service (dispatch to in-app + email)",
      "Socket.io subscription for live notifications (org-scoped rooms)",
      "Email sending via Resend API",
      "Handlebars template rendering with variable substitution",
      "6 default email templates (seeded in DB)",
      "Notification bell with unread count",
      "Notification list page with mark-as-read",
      "Vendor RFQ digest (BullMQ scheduled job via Redis)",
    ],
    tables: ["notifications", "email_templates"],
    endpoints: [
      "GET /api/notifications", "PATCH /api/notifications/:id/read",
      "PATCH /api/notifications/read-all",
    ],
    pages: ["notifications"],
    dependencies: ["Phase 2"],
  },
  {
    id: 10,
    title: "File Storage & Document Management",
    icon: <Upload className="size-5" />,
    status: "planned",
    estimatedHours: "2-3",
    backend: true, frontend: true, database: true,
    description: "Cloudflare R2 integration (S3-compatible SDK) for all document types. Pre-signed URL generation for time-limited access, file type/size validation, upload progress tracking, and a generic file attachment system.",
    keyDeliverables: [
      "R2 storage service (S3 SDK wrapper — works with any S3-compatible provider)",
      "File upload endpoint with validation (type, size limits)",
      "Pre-signed URL generation for secure downloads",
      "Upload progress tracking (frontend)",
      "Generic file_attachments table for any entity",
      "4 logical prefixes: tenders/, bids/, contracts/, profiles/",
    ],
    tables: ["file_attachments"],
    endpoints: [
      "POST /api/storage/upload", "GET /api/storage/download/:path",
      "DELETE /api/storage/:path",
    ],
    pages: [],
    dependencies: ["Phase 1"],
    notes: "Files in Cloudflare R2 (zero egress fees). Only metadata (path, name, size) stored in PostgreSQL. S3 SDK means you can swap to AWS S3 or MinIO with zero code changes.",
  },
  {
    id: 11,
    title: "Activity Logs & Audit Trail",
    icon: <ScrollText className="size-5" />,
    status: "planned",
    estimatedHours: "2-3",
    backend: true, frontend: true, database: true,
    description: "Comprehensive activity logging for every user action. Filterable log viewer for PE admins and auditors. Separate admin_audit_log for Super Admin destructive actions. IP address and user agent tracking.",
    keyDeliverables: [
      "Audit service (reusable log function)",
      "Activity log insertion from every controller",
      "Filterable log viewer page (by action, entity, user, date range)",
      "Admin audit log table for destructive actions",
      "Export logs to CSV",
    ],
    tables: ["activity_logs", "admin_audit_log"],
    endpoints: [
      "GET /api/activity-logs", "GET /api/admin/logs",
    ],
    pages: ["activity-logs", "vendor-activity-logs", "activity (RFQ feed)", "admin/audit-logs", "admin/purchaser-logs", "admin/vendor-logs"],
    dependencies: ["Phase 2"],
  },
  {
    id: 12,
    title: "Support Ticketing System",
    icon: <HelpCircle className="size-5" />,
    status: "planned",
    estimatedHours: "3-4",
    backend: true, frontend: true, database: true,
    description: "User-facing ticket submission (bug, feature, general) with priority levels. Admin ticket management with assignment, status tracking, and threaded messaging. Internal notes for admin team.",
    keyDeliverables: [
      "Ticket submission form with type/priority/category",
      "My Tickets list with mobile card view",
      "Ticket detail with threaded messages",
      "Admin ticket list with assignment",
      "Admin ticket detail with internal notes",
      "Email notification on ticket updates",
    ],
    tables: ["support_tickets", "ticket_messages"],
    endpoints: [
      "POST /api/tickets", "GET /api/tickets", "GET /api/tickets/:id",
      "POST /api/tickets/:id/messages", "PATCH /api/tickets/:id",
    ],
    pages: ["support/submit-ticket", "support/my-tickets", "admin/tickets", "admin/tickets/:id"],
    dependencies: ["Phase 2, Phase 9"],
  },
  {
    id: 13,
    title: "Catalogue & Guided Buying",
    icon: <ShoppingCart className="size-5" />,
    status: "planned",
    estimatedHours: "4-5",
    backend: true, frontend: true, database: true,
    description: "Product catalogue with hierarchical categories, vendor item listings, search/filter, shopping cart, and checkout flow that creates catalogue orders. Punch-out integration for external vendor catalogues.",
    keyDeliverables: [
      "Catalogue category tree (hierarchical)",
      "Catalogue item CRUD for vendors",
      "Browse catalogue page with search/filter",
      "Shopping cart (session-based)",
      "Checkout flow → creates catalogue_order tender type",
      "Admin catalogue category management",
      "Guided buying wizard",
    ],
    tables: ["catalogue_categories", "catalogue_items"],
    endpoints: [
      "GET /api/catalogue/categories", "GET /api/catalogue/items",
      "POST /api/catalogue/items", "POST /api/catalogue/cart",
      "POST /api/catalogue/checkout",
    ],
    pages: ["catalogues/browse", "vendor-dashboard/catalogue", "admin/catalogue-categories", "buy (guided buying)", "buy/cart", "buy/checkout"],
    dependencies: ["Phase 3, Phase 4"],
  },
  {
    id: 14,
    title: "Analytics, Reports & Dashboards",
    icon: <BarChart3 className="size-5" />,
    status: "planned",
    estimatedHours: "4-5",
    backend: true, frontend: true, database: false,
    description: "Role-specific dashboards with KPI cards, charts, and data tables. Procurement analytics (spend by category, supplier concentration, savings tracking, vendor performance). PDF report export. Materialized views for performance.",
    keyDeliverables: [
      "Procurer dashboard (KPI cards, charts, recent activity)",
      "Vendor dashboard (available RFQs, bid status, SRM score)",
      "Analytics page (spend by category, supplier concentration)",
      "Vendor performance analytics",
      "Savings tracker",
      "PDF report generation (@react-pdf/renderer — React components → PDF)",
      "Materialized views for complex aggregations (refreshed via BullMQ cron)",
    ],
    tables: [],
    endpoints: [
      "GET /api/analytics/procurement", "GET /api/analytics/spend",
      "GET /api/analytics/vendors", "GET /api/reports/export",
    ],
    pages: [
      "dashboard", "vendor-dashboard", "analytics", "analytics/spend-category",
      "analytics/supplier-concentration", "analytics/savings", "analytics/vendor-performance",
      "reports", "subscription", "how-to-use", "vendor-dashboard/how-to-use",
      "user-management", "vendor-users", "vendor-profile", "organisation/members",
    ],
    dependencies: ["Phase 4, Phase 5, Phase 7"],
    notes: "Uses materialized views (mv_procurement_stats) refreshed nightly via BullMQ scheduled job.",
  },
  {
    id: 15,
    title: "Calendar & Scheduling",
    icon: <Calendar className="size-5" />,
    status: "planned",
    estimatedHours: "2-3",
    backend: true, frontend: true, database: false,
    description: "Calendar view aggregating events from tenders (deadlines, openings), contracts (milestones, end dates), and custom events. Month/week/day views. Mobile-responsive with list fallback.",
    keyDeliverables: [
      "Calendar API aggregating events from multiple sources",
      "Month/week/day calendar views",
      "Event type color coding",
      "Mobile-responsive list view fallback",
      "Vendor calendar variant",
    ],
    tables: [],
    endpoints: ["GET /api/calendar"],
    pages: ["calendar", "vendor-dashboard/calendar"],
    dependencies: ["Phase 4, Phase 7"],
    notes: "No separate calendar table needed — events are derived from tenders, contracts, and milestones.",
  },
  {
    id: 16,
    title: "Admin (Super Admin) Dashboard",
    icon: <Settings className="size-5" />,
    status: "planned",
    estimatedHours: "6-8",
    backend: true, frontend: true, database: true,
    description: "Full Super Admin panel with KPI dashboard, user management (add/approve/reject/deactivate/reset password), RFQ management, email template editor, notification/audit log viewer, and platform settings.",
    keyDeliverables: [
      "Dashboard home with KPI cards and recent activity",
      "User management with approval tabs (Pending/Approved/Rejected)",
      "RFQ/Tender management (list, close, delete)",
      "Email template editor with preview",
      "Audit log viewer with filters",
      "Platform settings panel (key/value)",
      "Procuring entity approval management",
      "Vendor approval management",
    ],
    tables: ["platform_settings"],
    endpoints: [
      "GET /api/admin/stats", "GET /api/admin/users", "POST /api/admin/users",
      "POST /api/admin/users/:id/approve", "POST /api/admin/users/:id/reject",
      "DELETE /api/admin/users/:id", "POST /api/admin/users/:id/reset-password",
      "GET /api/admin/tenders", "DELETE /api/admin/tenders/:id",
      "GET /api/admin/settings", "PUT /api/admin/settings/:key",
    ],
    pages: [
      "admin/dashboard", "admin/buyers", "admin/vendors", "admin/rfq-management",
      "admin/email-templates", "admin/audit-logs", "admin/purchaser-logs", "admin/vendor-logs",
      "admin/settings", "admin/tickets", "admin/tickets/:id", "admin/security (NIST)",
      "admin/catalogue-categories", "admin/prd", "admin/coding-plan",
    ],
    dependencies: ["Phase 2, Phase 4, Phase 9, Phase 11"],
    notes: "See docs/ADMIN_DASHBOARD_PLAN.md for the detailed step-by-step implementation.",
  },
  {
    id: 17,
    title: "Advanced Modules (v5.6 Gap-Closure)",
    icon: <Cpu className="size-5" />,
    status: "future",
    estimatedHours: "8-12",
    backend: true, frontend: true, database: true,
    description: "Enterprise-grade extensions: KYC/AML compliance, three-way matching (PO-Invoice-GRN), NIST cybersecurity framework, guided buying with punch-out, dynamic risk assessment, agentic AI, multi-currency/FX, API/webhooks developer portal, accessibility (WCAG 2.1 AA), and blockchain audit anchoring.",
    keyDeliverables: [
      "KYC/AML vendor compliance dashboard",
      "Three-way matching (PO → Invoice → GRN)",
      "NIST security framework dashboard",
      "Dynamic risk assessment engine",
      "Agentic AI control center",
      "Multi-currency / FX hedging",
      "Developer portal with API keys & webhooks",
      "Accessibility settings (WCAG 2.1 AA)",
    ],
    tables: ["kyc_checks", "sanctions_alerts", "purchase_orders", "invoices", "goods_receipts", "risk_assessments", "ai_agents", "fx_rates", "api_keys", "webhooks"],
    endpoints: [
      "/api/compliance/*", "/api/finance/matching", "/api/risk/*",
      "/api/ai/*", "/api/finance/fx/*", "/api/developers/*",
    ],
    pages: [
      "admin/compliance/kyc", "vendors/:id/kyc", "admin/compliance/alerts",
      "contracts/:id/grn/new", "finance/matching", "finance/disputes/:id",
      "buy/punchout/:vendor_id",
      "risk/dashboard", "vendors/:id/risk", "risk/mitigations/:id",
      "ai/agents", "ai/config", "ai/analytics",
      "finance/fx", "tenders/:id/fx-comparison",
      "developers", "developers/scrollbar-demo",
      "settings/accessibility", "settings/theme-studio", "site-map",
    ],
    dependencies: ["Phases 1-16"],
  },
  {
    id: 18,
    title: "Testing, Security & Deployment",
    icon: <Rocket className="size-5" />,
    status: "future",
    estimatedHours: "4-6",
    backend: true, frontend: true, database: true,
    description: "Comprehensive testing (auth guards, tender lifecycle, RLS policies, evaluation pipeline), security hardening (Helmet, CORS, rate limiting, 2FA enforcement), and Docker-based production deployment with Cloudflare CDN.",
    keyDeliverables: [
      "Auth guard test suite",
      "Tender lifecycle integration tests",
      "RLS policy verification tests",
      "Security hardening (Helmet, CORS, rate limiting)",
      "Docker Compose production configuration",
      "Cloudflare CDN + WAF setup",
      "Environment variable documentation",
      "Deployment runbook",
    ],
    tables: [],
    endpoints: [],
    pages: [],
    dependencies: ["All phases"],
  },
];

// ─── Tech Stack Data ─────────────────────────────────────────────────

const techStack = {
  frontend: { name: "Next.js 15 (App Router)", icon: <Layout className="size-5" />, color: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-100 dark:bg-orange-900/30", reason: "SSR, file routing, middleware — 50+ React pages port directly" },
  backend: { name: "Node.js + Fastify + TS", icon: <Server className="size-5" />, color: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-900/30", reason: "5x faster than Express, built-in validation + TypeScript" },
  database: { name: "PostgreSQL 16 (Managed)", icon: <Database className="size-5" />, color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/30", reason: "Neon/Railway — zero ops, auto-backups, no 9-container Supabase" },
  auth: { name: "Better Auth", icon: <Shield className="size-5" />, color: "text-purple-600 dark:text-purple-400", bgColor: "bg-purple-100 dark:bg-purple-900/30", reason: "Open-source, 1 service vs GoTrue + Kong + Supavisor (3)" },
  realtime: { name: "Socket.io", icon: <Zap className="size-5" />, color: "text-yellow-600 dark:text-yellow-400", bgColor: "bg-yellow-100 dark:bg-yellow-900/30", reason: "Org-scoped rooms, role-filtered events, 10+ years battle-tested" },
  storage: { name: "Cloudflare R2", icon: <Upload className="size-5" />, color: "text-cyan-600 dark:text-cyan-400", bgColor: "bg-cyan-100 dark:bg-cyan-900/30", reason: "S3-compatible, zero egress fees — critical for documents" },
};

// ─── Summary Stats ───────────────────────────────────────────────────

const dbStats = {
  tables: "40+",
  endpoints: "90+",
  pages: "90+",
  roles: "11",
  estimatedHours: "70-100",
};

// ─── Infrastructure Capacity Data ────────────────────────────────────

interface InfraTier {
  name: string;
  monthlyCost: string;
  color: string;
  services: {
    service: string;
    plan: string;
    storage: string;
    traffic: string;
    limits: string;
    cost: string;
  }[];
  supports: {
    users: string;
    concurrent: string;
    tenders: string;
    bids: string;
    documents: string;
    apiRequests: string;
    websockets: string;
    emails: string;
  };
}

const infraTiers: InfraTier[] = [
  {
    name: "Free / MVP",
    monthlyCost: "$0",
    color: "text-green-600 dark:text-green-400",
    services: [
      { service: "PostgreSQL (Neon)", plan: "Free", storage: "512 MB", traffic: "190 compute-hours/mo (auto-suspends idle)", limits: "1 project, 10 branches, ~50 connections", cost: "$0" },
      { service: "Redis (Upstash)", plan: "Free", storage: "256 MB", traffic: "10,000 commands/day", limits: "1 database, 100 concurrent connections", cost: "$0" },
      { service: "File Storage (R2)", plan: "Free", storage: "10 GB", traffic: "ZERO egress (unlimited downloads)", limits: "1M writes/mo, 10M reads/mo", cost: "$0" },
      { service: "Email (Resend)", plan: "Free", storage: "N/A", traffic: "3,000 emails/month", limits: "100 emails/day, 1 domain", cost: "$0" },
      { service: "Frontend (Vercel)", plan: "Hobby", storage: "N/A", traffic: "100 GB bandwidth/mo", limits: "Personal use, 100 GB-hours serverless", cost: "$0" },
      { service: "Backend (Fly.io)", plan: "Free", storage: "1 GB", traffic: "Shared CPU, 256 MB RAM", limits: "3 VMs, auto-stop when idle", cost: "$0" },
    ],
    supports: {
      users: "Up to 200 registered",
      concurrent: "10-30 concurrent users",
      tenders: "~100-200 tenders (512 MB DB limit)",
      bids: "~500-1,000 bids",
      documents: "10 GB — ~2,000-5,000 PDF/docs",
      apiRequests: "~5,000-10,000 req/day",
      websockets: "~50-100 concurrent connections",
      emails: "100/day — bid confirmations + notifications",
    },
  },
  {
    name: "Startup / Growth",
    monthlyCost: "$30-75",
    color: "text-blue-600 dark:text-blue-400",
    services: [
      { service: "PostgreSQL (Neon)", plan: "Launch ($19)", storage: "10 GB", traffic: "300 compute-hours/mo, autoscaling", limits: "100 connections, point-in-time recovery", cost: "$19" },
      { service: "Redis (Upstash)", plan: "Pay-as-you-go", storage: "1 GB", traffic: "Unlimited commands", limits: "$0.2 per 100K commands", cost: "$2-5" },
      { service: "File Storage (R2)", plan: "Standard", storage: "50-100 GB", traffic: "ZERO egress (free downloads)", limits: "$0.015/GB beyond 10 GB", cost: "$0.60-1.35" },
      { service: "Email (Resend)", plan: "Pro ($20)", storage: "N/A", traffic: "50,000 emails/month", limits: "Multiple domains, webhooks", cost: "$20" },
      { service: "Frontend (Vercel)", plan: "Pro ($20)", storage: "N/A", traffic: "1 TB bandwidth/mo", limits: "Team features, analytics", cost: "$20" },
      { service: "Backend (Railway)", plan: "Pro ($5+)", storage: "5 GB", traffic: "8 GB RAM, dedicated CPU", limits: "Autoscaling, private networking", cost: "$5-20" },
    ],
    supports: {
      users: "500-2,000 registered",
      concurrent: "50-200 concurrent users",
      tenders: "~2,000-5,000 active (10 GB = millions of rows)",
      bids: "~10,000-50,000 bids",
      documents: "50-100 GB — ~10K-50K documents",
      apiRequests: "~50,000-200,000 req/day",
      websockets: "~500-1,000 concurrent connections",
      emails: "~1,600/day — digests + all notifications",
    },
  },
  {
    name: "Production / Enterprise",
    monthlyCost: "$150-400",
    color: "text-purple-600 dark:text-purple-400",
    services: [
      { service: "PostgreSQL (Neon)", plan: "Scale ($69+)", storage: "50 GB+", traffic: "750 compute-hours/mo, 8 CU autoscale", limits: "500 connections, read replicas, IP allow-list", cost: "$69+" },
      { service: "Redis (Upstash)", plan: "Pro ($10+)", storage: "10 GB", traffic: "Unlimited", limits: "Multi-region, TLS, fine-grained ACL", cost: "$10-20" },
      { service: "File Storage (R2)", plan: "Standard", storage: "500 GB-1 TB", traffic: "ZERO egress", limits: "$0.015/GB — scales linearly", cost: "$7.50-15" },
      { service: "Email (Resend)", plan: "Business ($45+)", storage: "N/A", traffic: "100,000+ emails/month", limits: "Dedicated IP, SOC 2", cost: "$45+" },
      { service: "Frontend (Vercel)", plan: "Pro ($20)", storage: "N/A", traffic: "1 TB bandwidth", limits: "Same Pro — Vercel scales well", cost: "$20" },
      { service: "Backend (Railway/Fly)", plan: "Pro", storage: "20 GB+", traffic: "16+ GB RAM, dedicated, multi-region", limits: "Auto-scaling, zero-downtime deploys", cost: "$40-100" },
    ],
    supports: {
      users: "5,000-50,000 registered",
      concurrent: "500-2,000 concurrent users",
      tenders: "Unlimited (50 GB = tens of millions of rows)",
      bids: "Unlimited",
      documents: "500 GB-1 TB — enterprise archive",
      apiRequests: "~500K-2M req/day",
      websockets: "~5,000-10,000 concurrent connections",
      emails: "~3,300/day — full enterprise volume",
    },
  },
];

const scalingBreakpoints = [
  { trigger: "512 MB DB full (~500K rows)", action: "Neon Free → Launch ($19/mo)", urgency: "warning" as const },
  { trigger: "10 GB files stored", action: "R2 charges $0.015/GB — 50 GB = only $0.60/mo", urgency: "info" as const },
  { trigger: "100 emails/day limit hit", action: "Resend Free → Pro ($20/mo) for 1,600/day", urgency: "warning" as const },
  { trigger: "190 Neon compute-hours exhausted", action: "Upgrade Neon or optimize idle queries", urgency: "warning" as const },
  { trigger: "100 GB Vercel bandwidth", action: "Vercel Hobby → Pro ($20/mo) for 1 TB", urgency: "info" as const },
  { trigger: "500+ concurrent WebSocket connections", action: "Scale backend RAM: 256 MB → 2-4 GB", urgency: "info" as const },
  { trigger: "Compliance needed (SOC 2, GDPR)", action: "All providers offer compliance tiers at enterprise pricing", urgency: "critical" as const },
];

// ─── Component ───────────────────────────────────────────────────────

export function CodingPlan() {
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStack, setFilterStack] = useState<"all" | "backend" | "frontend" | "database">("all");
  const [showInfraDetail, setShowInfraDetail] = useState(false);
  const [selectedTier, setSelectedTier] = useState(0);

  const togglePhase = (id: number) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedPhases(new Set(phases.map((p) => p.id)));
  const collapseAll = () => setExpandedPhases(new Set());

  const filteredPhases = useMemo(() => {
    return phases.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.keyDeliverables.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter =
        filterStack === "all" ||
        (filterStack === "backend" && p.backend) ||
        (filterStack === "frontend" && p.frontend) ||
        (filterStack === "database" && p.database);
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filterStack]);

  const getStatusBadge = (status: Phase["status"]) => {
    const configs = {
      "completed": { label: "Completed", color: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700" },
      "in-progress": { label: "In Progress", color: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700" },
      "planned": { label: "Planned", color: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700" },
      "future": { label: "Future", color: "bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600" },
    };
    return <Badge variant="outline" className={configs[status].color}>{configs[status].label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <PageHeader
          title="Full-Stack Coding Plan"
          description="RFQ Buddy — Complete implementation roadmap for backend, frontend, and database"
        />

        {/* Tech Stack Overview */}
        <div className="mt-4 sm:mt-6 mb-6 sm:mb-8">
          <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Technology Stack</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {Object.entries(techStack).map(([key, tech]) => (
              <Card key={key} className="border-border">
                <CardContent className="p-3 sm:p-4">
                  <div className={`flex items-center gap-2 mb-1.5 ${tech.color}`}>
                    {tech.icon}
                    <span className="text-xs font-medium truncate">{tech.name.split(" ")[0]}</span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2">{tech.reason}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 mb-6 sm:mb-8">
          {[
            { label: "DB Tables", value: dbStats.tables, icon: <Table2 className="size-4" />, color: "text-blue-600 dark:text-blue-400" },
            { label: "API Endpoints", value: dbStats.endpoints, icon: <GitBranch className="size-4" />, color: "text-green-600 dark:text-green-400" },
            { label: "UI Pages", value: dbStats.pages, icon: <Layout className="size-4" />, color: "text-purple-600 dark:text-purple-400" },
            { label: "RBAC Roles", value: dbStats.roles, icon: <Shield className="size-4" />, color: "text-orange-600 dark:text-orange-400" },
            { label: "Dev Hours", value: dbStats.estimatedHours, icon: <Clock className="size-4" />, color: "text-red-600 dark:text-red-400" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className={`flex items-center justify-center gap-1.5 mb-1 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className={`text-lg sm:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search phases, deliverables, tables, endpoints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["all", "backend", "frontend", "database"] as const).map((f) => (
              <Button
                key={f}
                variant={filterStack === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStack(f)}
                className="text-xs"
              >
                {f === "all" ? "All" : f === "backend" ? "Backend" : f === "frontend" ? "Frontend" : "Database"}
              </Button>
            ))}
            <div className="hidden sm:flex gap-2 ml-2 border-l border-border pl-2">
              <Button variant="ghost" size="sm" onClick={expandAll} className="text-xs">Expand All</Button>
              <Button variant="ghost" size="sm" onClick={collapseAll} className="text-xs">Collapse All</Button>
            </div>
          </div>
        </div>

        {/* Mobile expand/collapse */}
        <div className="flex gap-2 mb-4 sm:hidden">
          <Button variant="ghost" size="sm" onClick={expandAll} className="text-xs flex-1">Expand All</Button>
          <Button variant="ghost" size="sm" onClick={collapseAll} className="text-xs flex-1">Collapse All</Button>
        </div>

        {/* Phase Cards */}
        <div className="space-y-3">
          {filteredPhases.map((phase) => {
            const isExpanded = expandedPhases.has(phase.id);
            return (
              <Card key={phase.id} className="border-border overflow-hidden">
                {/* Phase Header */}
                <button
                  onClick={() => togglePhase(phase.id)}
                  className="w-full text-left p-3 sm:p-4 flex items-start sm:items-center gap-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-muted shrink-0 text-foreground">
                    {phase.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="text-xs text-muted-foreground font-mono">Phase {phase.id}</span>
                      {getStatusBadge(phase.status)}
                      <div className="hidden sm:flex items-center gap-1.5 ml-auto">
                        {phase.backend && <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">BE</Badge>}
                        {phase.frontend && <Badge variant="outline" className="text-[10px] bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">FE</Badge>}
                        {phase.database && <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">DB</Badge>}
                        <span className="text-xs text-muted-foreground flex items-center gap-1 ml-2">
                          <Clock className="size-3" /> {phase.estimatedHours}h
                        </span>
                      </div>
                    </div>
                    <h3 className="text-sm sm:text-base font-medium text-foreground">{phase.title}</h3>
                    {/* Mobile: stack badges */}
                    <div className="flex sm:hidden items-center gap-1.5 mt-1.5">
                      {phase.backend && <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">BE</Badge>}
                      {phase.frontend && <Badge variant="outline" className="text-[10px] bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">FE</Badge>}
                      {phase.database && <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">DB</Badge>}
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 ml-auto">
                        <Clock className="size-3" /> {phase.estimatedHours}h
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 text-muted-foreground">
                    {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </div>
                </button>

                {/* Phase Detail */}
                {isExpanded && (
                  <div className="border-t border-border p-3 sm:p-5 bg-muted/5 space-y-4 sm:space-y-5">
                    {/* Description */}
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{phase.description}</p>

                    {/* Key Deliverables */}
                    <div>
                      <h4 className="text-xs font-medium text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-green-600 dark:text-green-400" />
                        Key Deliverables ({phase.keyDeliverables.length})
                      </h4>
                      <ul className="space-y-1.5">
                        {phase.keyDeliverables.map((d, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-foreground">
                            <ArrowRight className="size-3 mt-1 text-muted-foreground shrink-0" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tables */}
                    {phase.tables && phase.tables.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Database className="size-3.5 text-blue-600 dark:text-blue-400" />
                          Database Tables ({phase.tables.length})
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {phase.tables.map((t) => (
                            <Badge key={t} variant="outline" className="font-mono text-[10px] sm:text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Endpoints */}
                    {phase.endpoints && phase.endpoints.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <GitBranch className="size-3.5 text-green-600 dark:text-green-400" />
                          API Endpoints ({phase.endpoints.length})
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {phase.endpoints.map((ep) => (
                            <code key={ep} className="text-[10px] sm:text-xs font-mono text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded px-2 py-1 truncate block">
                              {ep}
                            </code>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pages */}
                    {phase.pages && phase.pages.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Layout className="size-3.5 text-purple-600 dark:text-purple-400" />
                          UI Pages ({phase.pages.length})
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {phase.pages.map((pg) => (
                            <Badge key={pg} variant="outline" className="text-[10px] sm:text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
                              /{pg}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dependencies */}
                    {phase.dependencies && phase.dependencies.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <AlertTriangle className="size-3" /> Depends on:
                        </span>
                        {phase.dependencies.map((dep) => (
                          <Badge key={dep} variant="outline" className="text-[10px] sm:text-xs">{dep}</Badge>
                        ))}
                      </div>
                    )}

                    {/* Notes */}
                    {phase.notes && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                        <p className="text-xs text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                          <BookOpen className="size-3.5 mt-0.5 shrink-0" />
                          {phase.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Infrastructure Capacity & Pricing */}
        <Card className="border-border mb-6 sm:mb-8">
          <button
            onClick={() => setShowInfraDetail(!showInfraDetail)}
            className="w-full text-left p-4 sm:p-5 flex items-center justify-between hover:bg-muted/30 transition-colors"
          >
            <div>
              <h2 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Server className="size-4" />
                Infrastructure Capacity & Pricing — Real Numbers
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Storage, traffic limits, and scaling breakpoints per tier</p>
            </div>
            {showInfraDetail ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
          </button>

          {showInfraDetail && (
            <div className="border-t border-border p-3 sm:p-5 space-y-5">
              {/* Tier Tabs */}
              <div className="flex gap-2">
                {infraTiers.map((tier, i) => (
                  <Button
                    key={tier.name}
                    variant={selectedTier === i ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTier(i)}
                    className="text-xs"
                  >
                    {tier.name} <span className={`ml-1.5 ${selectedTier === i ? "" : tier.color}`}>{tier.monthlyCost}/mo</span>
                  </Button>
                ))}
              </div>

              {/* Selected Tier: Service Breakdown */}
              <div>
                <h3 className="text-xs font-medium text-foreground uppercase tracking-wider mb-3">Service-by-Service Breakdown</h3>
                <div className="overflow-x-auto -mx-3 sm:mx-0">
                  <table className="w-full text-xs min-w-[600px]">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="text-left py-2 px-3">Service</th>
                        <th className="text-left py-2 px-3">Plan</th>
                        <th className="text-left py-2 px-3">Storage</th>
                        <th className="text-left py-2 px-3">Traffic / Throughput</th>
                        <th className="text-left py-2 px-3">Key Limits</th>
                        <th className="text-right py-2 px-3">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {infraTiers[selectedTier].services.map((svc) => (
                        <tr key={svc.service} className="border-b border-border/50 hover:bg-muted/20">
                          <td className="py-2 px-3 font-medium text-foreground whitespace-nowrap">{svc.service}</td>
                          <td className="py-2 px-3 text-muted-foreground">{svc.plan}</td>
                          <td className="py-2 px-3 font-mono text-foreground">{svc.storage}</td>
                          <td className="py-2 px-3 text-muted-foreground">{svc.traffic}</td>
                          <td className="py-2 px-3 text-muted-foreground">{svc.limits}</td>
                          <td className={`py-2 px-3 text-right font-mono ${infraTiers[selectedTier].color}`}>{svc.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* What This Tier Supports */}
              <div>
                <h3 className="text-xs font-medium text-foreground uppercase tracking-wider mb-3">What This Supports</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(infraTiers[selectedTier].supports).map(([key, val]) => {
                    const labels: Record<string, string> = {
                      users: "Registered Users", concurrent: "Concurrent Users", tenders: "Tenders",
                      bids: "Bids", documents: "Documents", apiRequests: "API Requests",
                      websockets: "WebSocket Conns", emails: "Emails",
                    };
                    return (
                      <div key={key} className="bg-muted/30 rounded-lg p-2.5 sm:p-3">
                        <div className="text-[10px] text-muted-foreground uppercase">{labels[key] || key}</div>
                        <div className="text-xs sm:text-sm font-medium text-foreground mt-0.5">{val}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scaling Breakpoints */}
              <div>
                <h3 className="text-xs font-medium text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="size-3.5 text-yellow-600 dark:text-yellow-400" />
                  When to Upgrade — Scaling Breakpoints
                </h3>
                <div className="space-y-2">
                  {scalingBreakpoints.map((bp, i) => (
                    <div key={i} className={`flex items-start gap-3 rounded-lg p-2.5 text-xs ${
                      bp.urgency === "critical" ? "bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800" :
                      bp.urgency === "warning" ? "bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800" :
                      "bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800"
                    }`}>
                      <span
                        className={`shrink-0 mt-0.5 ${
                          bp.urgency === "critical" ? "text-red-600 dark:text-red-400" :
                          bp.urgency === "warning" ? "text-yellow-600 dark:text-yellow-400" :
                          "text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {bp.urgency === "critical" ? (<Lock className="size-3.5" />) :
                         bp.urgency === "warning" ? (<AlertTriangle className="size-3.5" />) :
                         (<ArrowRight className="size-3.5" />)}
                      </span>
                      <div>
                        <span className="font-medium text-foreground">{bp.trigger}</span>
                        <span className="text-muted-foreground"> → {bp.action}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Line */}
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Bottom line:</span> Start at $0. The first upgrade you will need is either Neon ($19) when you hit 500K DB rows, or Resend ($20) when you exceed 100 emails/day. File storage (R2) remains effectively free for years — 1 TB costs only $15/mo with zero download fees.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Footer */}
        {filteredPhases.length === 0 && (
          <Card className="border-border">
            <CardContent className="p-8 sm:p-12 text-center">
              <Search className="size-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No phases match your search criteria.</p>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Full plan available at <code className="bg-muted px-1.5 py-0.5 rounded text-[10px]">/src/docs/PROJECT_CODING_PLAN.md</code>
            {" "}&middot;{" "}
            Admin Dashboard detail at <code className="bg-muted px-1.5 py-0.5 rounded text-[10px]">/src/docs/ADMIN_DASHBOARD_PLAN.md</code>
          </p>
        </div>
      </div>
    </div>
  );
}