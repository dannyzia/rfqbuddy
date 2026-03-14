import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { PageHeader } from "../components/page-header";
import { 
  LogIn, 
  LayoutDashboard, 
  Users, 
  FileText, 
  Activity, 
  FileStack,
  Award,
  Settings,
  ShieldCheck,
  Fingerprint,
  Receipt,
  Shield,
  ShoppingCart,
  AlertTriangle,
  Bot,
  DollarSign,
  Code2,
  Accessibility
} from "lucide-react";

export function SiteMap() {
  const sections = [
    {
      title: "Authentication (7 screens)",
      icon: LogIn,
      color: "text-purple-600",
      links: [
        { name: "Login", path: "/login" },
        { name: "Register (Gateway)", path: "/register" },
        { name: "Register — Procuring Entity", path: "/register/procuring-entity" },
        { name: "Register — Vendor", path: "/register/vendor" },
        { name: "Forgot Password", path: "/forgot-password" },
        { name: "Reset Password", path: "/reset-password" },
        { name: "2FA Verification", path: "/2fa-verify" },
      ]
    },
    {
      title: "Procuring Entity Dashboard (13 screens)",
      icon: LayoutDashboard,
      color: "text-blue-600",
      links: [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Purchaser Profile", path: "/profile" },
        { name: "Organisation Members", path: "/organisation/members" },
        { name: "Analytics", path: "/analytics" },
        { name: "Spend by Category (v5.5)", path: "/analytics/spend-category" },
        { name: "Supplier Concentration (v5.5)", path: "/analytics/supplier-concentration" },
        { name: "Savings Tracker (v5.5)", path: "/analytics/savings" },
        { name: "Vendor Performance Analytics (v5.5)", path: "/analytics/vendor-performance" },
        { name: "Activity Feed", path: "/activity" },
        { name: "Activity Logs", path: "/activity-logs" },
        { name: "Notifications", path: "/notifications" },
        { name: "Calendar", path: "/calendar" },
        { name: "Reports", path: "/reports" },
      ]
    },
    {
      title: "Vendor Management (7 screens)",
      icon: Users,
      color: "text-green-600",
      links: [
        { name: "Vendor List", path: "/vendors" },
        { name: "Vendor Profile", path: "/vendors/1" },
        { name: "Vendor Enlistment", path: "/vendor-enlistment" },
        { name: "Vendor Approval", path: "/vendor-enlistment/1" },
        { name: "Vendor Categories", path: "/vendors/1/categories" },
        { name: "Vendor Risk Assessment", path: "/vendor-risk" },
        { name: "Vendor Performance", path: "/vendors/1/performance" },
      ]
    },
    {
      title: "RFQ Creation (7 screens)",
      icon: FileText,
      color: "text-orange-600",
      links: [
        { name: "RFQ List", path: "/tenders" },
        { name: "Create New Tender (Gateway)", path: "/tenders/create" },
        { name: "Create Government Tender (PG/PW/PPS)", path: "/tenders/new" },
        { name: "Create NRQ1 - Simple RFQ", path: "/tenders/new/simple" },
        { name: "Create NRQ2 - Detailed RFQ", path: "/tenders/new/detailed" },
        { name: "Create NRQ3 - Custom RFQ", path: "/tenders/new/custom" },
        { name: "Upload Documents", path: "/tenders/new/documents" },
        { name: "Vendor Selection", path: "/tenders/new/vendors" },
        { name: "Preview RFQ", path: "/tenders/new/preview" },
        { name: "Publish RFQ", path: "/tenders/new/publish" },
      ]
    },
    {
      title: "RFQ Monitoring (6 screens)",
      icon: Activity,
      color: "text-cyan-600",
      links: [
        { name: "RFQ Dashboard", path: "/tenders/1" },
        { name: "Vendor Participation", path: "/tenders/1/participation" },
        { name: "Live Bidding", path: "/tenders/1/live" },
        { name: "Bid Timeline", path: "/tenders/1/timeline" },
        { name: "RFQ History", path: "/tenders/1/history" },
        { name: "Audit Log", path: "/tenders/1/audit" },
      ]
    },
    {
      title: "Vendor Portal (11 screens)",
      icon: FileStack,
      color: "text-indigo-600",
      links: [
        { name: "Vendor Dashboard", path: "/vendor-dashboard" },
        { name: "Edit Profile", path: "/vendor-profile" },
        { name: "Available RFQs", path: "/rfqs" },
        { name: "RFQ Details", path: "/rfqs/RFQ-2024-001" },
        { name: "Submit Bid", path: "/rfqs/RFQ-2024-001/bid" },
        { name: "Upload Bid Documents", path: "/rfqs/RFQ-2024-001/bid/documents" },
        { name: "Bid History", path: "/vendor-bids" },
        { name: "SRM Dashboard (v5.5)", path: "/vendor-dashboard/srm" },
        { name: "Vendor Catalogue Manager (v5.5)", path: "/vendor-dashboard/catalogue" },
        { name: "Catalogue Browser (v5.5)", path: "/catalogues/browse" },
        { name: "Activity Logs", path: "/vendor-activity-logs" },
      ]
    },
    {
      title: "Evaluation (5 screens)",
      icon: ShieldCheck,
      color: "text-pink-600",
      links: [
        { name: "Technical Evaluation", path: "/tenders/1/technical-eval" },
        { name: "Commercial Evaluation", path: "/tenders/1/commercial-eval" },
        { name: "Bid Comparison", path: "/tenders/1/comparison" },
        { name: "Vendor Ranking", path: "/tenders/1/ranking" },
        { name: "Evaluation Report", path: "/tenders/1/evaluation-report" },
      ]
    },
    {
      title: "Award & Contract / e-CMS (11 screens)",
      icon: Award,
      color: "text-yellow-600",
      links: [
        { name: "Award Decision", path: "/tenders/1/award" },
        { name: "Contract Generation", path: "/contracts/new" },
        { name: "Contract Dashboard (v5.5)", path: "/contracts/C-2026-0042" },
        { name: "Contract Details", path: "/contracts/C-2026-0042/details" },
        { name: "Milestone Tracking", path: "/contracts/C-2026-0042/milestones" },
        { name: "Variation Request (v5.5)", path: "/contracts/C-2026-0042/variations/new" },
        { name: "Variation Approval (v5.5)", path: "/contracts/C-2026-0042/variations/VAR-001" },
        { name: "Payment Certificate (v5.5)", path: "/contracts/C-2026-0042/payments/PAY-003" },
        { name: "Performance Rating (v5.5)", path: "/contracts/C-2026-0042/performance" },
        { name: "Contract History (v5.5)", path: "/contracts/C-2026-0042/history" },
      ]
    },
    {
      title: "Admin/Platform Management (11 screens)",
      icon: Settings,
      color: "text-red-600",
      links: [
        { name: "Admin Dashboard", path: "/admin/dashboard" },
        { name: "RFQ/Tender Management", path: "/admin/rfq-management" },
        { name: "Purchaser Management", path: "/admin/buyers" },
        { name: "Vendor Management", path: "/admin/vendors" },
        { name: "System Audit Logs", path: "/admin/audit-logs" },
        { name: "All Purchaser Logs", path: "/admin/purchaser-logs" },
        { name: "All Vendor Logs", path: "/admin/vendor-logs" },
        { name: "Email Templates", path: "/admin/email-templates" },
        { name: "Platform Settings", path: "/admin/settings" },
        { name: "Catalogue Categories (v5.5)", path: "/admin/catalogue-categories" },
        { name: "PRD v5.6 FINAL — Platform Reference", path: "/admin/prd" },
      ]
    },
    // ─── v5.6 Gap-Closure Modules ─────────────────────────────────────
    {
      title: "KYC/AML Compliance (3 screens) — v5.6",
      icon: Fingerprint,
      color: "text-emerald-600",
      links: [
        { name: "KYC Dashboard", path: "/admin/compliance/kyc" },
        { name: "Vendor KYC Detail", path: "/vendors/1/kyc" },
        { name: "Sanctions & PEP Alerts", path: "/admin/compliance/alerts" },
      ]
    },
    {
      title: "Three-Way Matching (3 screens) — v5.6",
      icon: Receipt,
      color: "text-teal-600",
      links: [
        { name: "GRN Creation", path: "/contracts/C-2026-0042/grn/new" },
        { name: "Invoice Matching (PO ↔ GRN ↔ Invoice)", path: "/finance/matching" },
        { name: "Dispute Resolution", path: "/finance/disputes/DISP-001" },
      ]
    },
    {
      title: "NIST Security Framework (1 screen) — v5.6",
      icon: Shield,
      color: "text-slate-600",
      links: [
        { name: "Security Dashboard (NIST CSF 2.0)", path: "/admin/security" },
      ]
    },
    {
      title: "Guided Buying (4 screens) — v5.6",
      icon: ShoppingCart,
      color: "text-lime-600",
      links: [
        { name: "Guided Buying Home", path: "/buy" },
        { name: "Punch-Out Session", path: "/buy/punchout/amazon-business" },
        { name: "Cart Review", path: "/buy/cart" },
        { name: "Checkout & Requisition", path: "/buy/checkout" },
      ]
    },
    {
      title: "Risk Assessment (3 screens) — v5.6",
      icon: AlertTriangle,
      color: "text-amber-600",
      links: [
        { name: "Risk Dashboard (Heat Map)", path: "/risk/dashboard" },
        { name: "Vendor Risk Profile", path: "/vendors/1/risk" },
        { name: "Mitigation Workflow", path: "/risk/mitigations/MIT-001" },
      ]
    },
    {
      title: "Agentic AI Orchestration (3 screens) — v5.6",
      icon: Bot,
      color: "text-violet-600",
      links: [
        { name: "Agent Control Center", path: "/ai/agents" },
        { name: "Agent Configuration", path: "/ai/config" },
        { name: "Agent Analytics", path: "/ai/analytics" },
      ]
    },
    {
      title: "Multi-Currency & FX (2 screens) — v5.6",
      icon: DollarSign,
      color: "text-sky-600",
      links: [
        { name: "FX Rate Dashboard", path: "/finance/fx" },
        { name: "FX Bid Comparison", path: "/tenders/1/fx-comparison" },
      ]
    },
    {
      title: "API-First Developer Portal (1 screen) — v5.6",
      icon: Code2,
      color: "text-fuchsia-600",
      links: [
        { name: "Developer Portal (REST & Webhooks)", path: "/developers" },
      ]
    },
    {
      title: "Accessibility Center (1 screen) — v5.6",
      icon: Accessibility,
      color: "text-rose-600",
      links: [
        { name: "Accessibility Settings (WCAG 2.2 AA)", path: "/settings/accessibility" },
      ]
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="RFQ/Tendering Platform - Site Map"
        description="Comprehensive procurement and tendering solution with 100+ screens across 18 categories (PRD v5.6 FINAL)"
      />

      {/* Getting Started Banner */}
      <div className="mb-4 sm:mb-6 p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border-2 border-indigo-300 dark:border-indigo-700 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <Award className="size-10 sm:size-12 text-indigo-600 shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-2 text-indigo-900 dark:text-indigo-200">Welcome to the RFQ/Tendering Platform!</h3>
            <p className="mb-4">
              This is your complete procurement management solution with 100+ fully functional screens (PRD v5.6 FINAL). 
              Use this site map to navigate through all 18 modules, or use the sidebar navigation to explore by role.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-background rounded-lg border border-indigo-200 dark:border-indigo-700">
                <div className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1 flex items-center gap-2">
                  <LayoutDashboard className="size-4" />
                  Purchaser Role
                </div>
                <p className="text-muted-foreground text-xs">
                  Create RFQs, manage vendors, evaluate bids, and award contracts
                </p>
              </div>
              <div className="p-3 bg-background rounded-lg border border-indigo-200 dark:border-indigo-700">
                <div className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1 flex items-center gap-2">
                  <FileStack className="size-4" />
                  Vendor Role
                </div>
                <p className="text-muted-foreground text-xs">
                  Browse RFQs, submit bids, track submissions, and manage your profile
                </p>
              </div>
              <div className="p-3 bg-background rounded-lg border border-indigo-200 dark:border-indigo-700">
                <div className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1 flex items-center gap-2">
                  <Settings className="size-4" />
                  Admin Role
                </div>
                <p className="text-muted-foreground text-xs">
                  Approve users, configure settings, and oversee platform activities
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <p className="text-sm text-yellow-900 dark:text-yellow-200">
                <span className="font-semibold">💡 Tip:</span> Use the <strong>Role Switcher</strong> in the sidebar (bottom left) to experience the platform from different user perspectives!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* v5.6 New Modules Banner */}
      <div className="mb-4 sm:mb-6 p-4 bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-950/40 dark:to-fuchsia-950/40 border border-violet-300 dark:border-violet-700 rounded-lg">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
          <Bot className="size-8 sm:size-10 text-violet-600 dark:text-violet-400 shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2 text-violet-900 dark:text-violet-200">🚀 v5.6 Gap-Closure — 9 New Modules (21 Screens)</h3>
            <p className="text-sm mb-3">
              The latest release adds KYC/AML Compliance, Three-Way Matching, NIST Security, Guided Buying, 
              Risk Assessment, Agentic AI Orchestration, Multi-Currency FX, Developer Portal, and Accessibility Center.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "KYC/AML", "Three-Way Match", "NIST Security", "Guided Buying",
                "Risk Assessment", "Agentic AI", "FX Rates", "Developer API", "WCAG 2.2"
              ].map(tag => (
                <span key={tag} className="px-2 py-1 text-xs rounded-full bg-violet-100 dark:bg-violet-900/60 text-violet-800 dark:text-violet-200 border border-violet-200 dark:border-violet-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-4 sm:mb-6 p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-700 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">Welcome to the RFQ/Tendering Platform</h3>
            <p className="text-sm mb-3">
              This comprehensive platform manages the entire procurement lifecycle from RFQ creation to contract management.
              Navigate through different modules using the sidebar or explore all screens below.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="size-2 bg-blue-500 rounded-full"></div>
                <span>Buyer Portal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 bg-green-500 rounded-full"></div>
                <span>Vendor Portal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 bg-red-500 rounded-full"></div>
                <span>Admin Portal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 bg-purple-500 rounded-full"></div>
                <span>Authentication</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          const isV56 = section.title.includes("v5.6");
          return (
            <Card key={section.title} className={`hover:shadow-lg transition-shadow ${isV56 ? "border-violet-200 dark:border-violet-800 ring-1 ring-violet-100 dark:ring-violet-900" : ""}`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Icon className={`size-6 ${section.color}`} />
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  {isV56 && <span className="ml-auto px-2 py-0.5 text-[10px] rounded-full bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 uppercase tracking-wider">New</span>}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline flex items-center gap-2"
                      >
                        <span className="text-muted-foreground">→</span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Navigation Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold mb-2">For Buyers:</div>
              <p className="text-muted-foreground">
                Start at the Dashboard, create RFQs, manage vendors, evaluate bids, and award contracts.
              </p>
            </div>
            <div>
              <div className="font-semibold mb-2">For Vendors:</div>
              <p className="text-muted-foreground">
                Access the Vendor Dashboard, browse available RFQs, submit bids, and track your submissions.
              </p>
            </div>
            <div>
              <div className="font-semibold mb-2">For Administrators:</div>
              <p className="text-muted-foreground">
                Manage user approvals, configure platform settings, and oversee all platform activities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}