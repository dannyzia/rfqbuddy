import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/root-layout";
import { AuthLayout, AuthLayoutWide } from "./layouts/auth-layout";
import { RouteGuard } from "./components/route-guard";

// Authentication
import { Login } from "./pages/auth/login";
import { Register } from "./pages/auth/register";
import { ForgotPassword } from "./pages/auth/forgot-password";
import { ResetPassword } from "./pages/auth/reset-password";
import { TwoFactorVerify } from "./pages/auth/2fa-verify";
import { RegisterBuyer } from "./pages/auth/register-buyer";
import { RegisterVendor } from "./pages/auth/register-vendor";

// Purchaser Dashboard
import { BuyerDashboard } from "./pages/buyer/dashboard";
import { OrganisationMembers } from "./pages/buyer/organisation-members";
import { PurchaserUserManagement } from "./pages/buyer/user-management";
import { ProcurementAnalytics } from "./pages/buyer/analytics";
import { SpendByCategoryReport } from "./pages/buyer/analytics-spend";
import { SupplierConcentrationDashboard } from "./pages/buyer/analytics-concentration";
import { SavingsTracker } from "./pages/buyer/analytics-savings";
import { VendorPerformanceAnalytics } from "./pages/buyer/analytics-vendor-performance";
import { RfqActivityFeed } from "./pages/buyer/activity";
import { Notifications } from "./pages/buyer/notifications";
import { Calendar } from "./pages/buyer/calendar";
import { ProcurementReports } from "./pages/buyer/reports";
import { PurchaserActivityLogs } from "./pages/buyer/activity-logs";
import { SubscriptionManagement } from "./pages/buyer/subscription";
import { PurchaserProfile } from "./pages/buyer/profile";
import { HowToUse } from "./pages/buyer/how-to-use";
import { TenderPipelineAnalytics } from "./pages/buyer/analytics-tenders";
import { ProcessEfficiencyAnalytics } from "./pages/buyer/analytics-efficiency";
import { ComplianceAnalytics } from "./pages/buyer/analytics-compliance";

// Vendor Management
import { VendorList } from "./pages/vendor-management/vendor-list";
import { VendorProfile } from "./pages/vendor-management/vendor-profile";
import { VendorEnlistment } from "./pages/vendor-management/vendor-enlistment";
import { VendorApproval } from "./pages/vendor-management/vendor-approval";
import { VendorCategories } from "./pages/vendor-management/vendor-categories";
import { VendorRisk } from "./pages/vendor-management/vendor-risk";
import { VendorPerformance } from "./pages/vendor-management/vendor-performance";
import { EnlistmentFormBuilder } from "./pages/vendor-management/enlistment-form-builder";

// RFQ Creation
import { RfqList } from "./pages/rfq/rfq-list";
import { CreateRfq } from "./pages/rfq/create-rfq";
import { CreateNRQ1Simple } from "./pages/rfq/create-nrq1-simple";
import { CreateNRQ2Detailed } from "./pages/rfq/create-nrq2-detailed";
import { CreateNRQ3Custom } from "./pages/rfq/create-nrq3-custom";
import { CreateRFP } from "./pages/rfq/create-rfp";
import { TenderBuilder } from "./pages/rfq/tender-builder";
import { UploadDocuments } from "./pages/rfq/upload-documents";
import { VendorSelection } from "./pages/rfq/vendor-selection";
import { RfqPreview } from "./pages/rfq/preview";
import { PublishRfq } from "./pages/rfq/publish";
import { CatalogueBrowser } from "./pages/rfq/catalogue-browser";

// RFQ Monitoring
import { RfqDashboard } from "./pages/rfq-monitoring/rfq-dashboard";
import { VendorParticipation } from "./pages/rfq-monitoring/vendor-participation";
import { LiveBidding } from "./pages/rfq-monitoring/live-bidding";
import { BidTimeline } from "./pages/rfq-monitoring/bid-timeline";
import { RfqHistory } from "./pages/rfq-monitoring/rfq-history";
import { RfqAuditLog } from "./pages/rfq-monitoring/audit-log";

// Vendor Portal
import { VendorDashboard } from "./pages/vendor/vendor-dashboard";
import { VendorProfileEdit } from "./pages/vendor/vendor-profile";
import { AvailableRfqs } from "./pages/vendor/available-rfqs";
import { RfqDetails } from "./pages/vendor/rfq-details";
import { SubmitBid } from "./pages/vendor/submit-bid";
import { SubmitBidWizard } from "./pages/vendor/submit-bid-wizard";
import { UploadBidDocuments } from "./pages/vendor/upload-bid-documents";
import { BidHistory } from "./pages/vendor/bid-history";
import { VendorActivityLogs } from "./pages/vendor/activity-logs";
import { VendorEnlistmentRequests } from "./pages/vendor/enlistment-requests";
import { ApplyEnlistment } from "./pages/vendor/apply-enlistment";
import { VendorSRMDashboard } from "./pages/vendor/vendor-srm";
import { VendorCatalogueManager } from "./pages/vendor/vendor-catalogue";
import { VendorCalendar } from "./pages/vendor/vendor-calendar";
import { VendorHowToUse } from "./pages/vendor/vendor-how-to-use";

// Evaluation
import { TechnicalEvaluation } from "./pages/evaluation/technical-eval";
import { CommercialEvaluation } from "./pages/evaluation/commercial-eval";
import { BidComparison } from "./pages/evaluation/bid-comparison";
import { VendorRanking } from "./pages/evaluation/vendor-ranking";
import { EvaluationReport } from "./pages/evaluation/evaluation-report";
import { BidOpening } from "./pages/evaluation/bid-opening";
import { PrequalificationEval } from "./pages/evaluation/prequalification-eval";
import { AuditReview } from "./pages/evaluation/audit-review";

// Award & Contract
import { AwardDecision } from "./pages/award/award-decision";
import { ContractGeneration } from "./pages/award/contract-generation";
import { ContractManagement } from "./pages/award/contract-management";
import { MilestoneTracking } from "./pages/award/milestone-tracking";
import { ContractDashboard } from "./pages/award/contract-dashboard";
import { VariationRequestForm } from "./pages/award/variation-request";
import { VariationApproval } from "./pages/award/variation-approval";
import { PaymentCertificateApproval } from "./pages/award/payment-certificate";
import { ContractPerformanceRating } from "./pages/award/contract-performance";
import { ContractHistory } from "./pages/award/contract-history";

// Admin
import { AdminDashboard } from "./pages/admin/admin-dashboard";
import { BuyerApprovalManagement } from "./pages/admin/buyer-approval";
import { VendorApprovalManagement } from "./pages/admin/vendor-approval";
import { EmailTemplates } from "./pages/admin/email-templates";
import { PlatformSettings } from "./pages/admin/platform-settings";
import { AdminRfqManagement } from "./pages/admin/rfq-management";
import { AdminAuditLogs } from "./pages/admin/audit-logs";
import { AdminPurchaserLogs } from "./pages/admin/purchaser-logs";
import { AdminVendorLogs } from "./pages/admin/vendor-logs";
import { AdminTickets } from "./pages/admin/tickets";
import { AdminTicketDetail } from "./pages/admin/ticket-detail";
import { PRDReference } from "./pages/admin/prd";
import { CatalogueCategoryManagement } from "./pages/admin/catalogue-categories";
import { CodingPlan } from "./pages/admin/coding-plan";

// v5.6 Gap-Closure Modules

// Compliance (KYC/AML) — Screens 60-62
import { KYCDashboard } from "./pages/compliance/kyc-dashboard";
import { VendorKYCDetail } from "./pages/compliance/vendor-kyc-detail";
import { SanctionsAlerts } from "./pages/compliance/sanctions-alerts";

// Finance (Three-Way Matching) — Screens 63-65
import { GRNCreation } from "./pages/finance/grn-creation";
import { InvoiceMatching } from "./pages/finance/invoice-matching";
import { DisputeResolution } from "./pages/finance/dispute-resolution";

// Security (NIST) — Screen 66
import { SecurityDashboard } from "./pages/admin/security";

// Guided Buying — Screens 67-70
import { GuidedBuying } from "./pages/buy/guided-buying";
import { PunchOutSession } from "./pages/buy/punchout-session";
import { CartReview } from "./pages/buy/cart-review";
import { BuyCheckout } from "./pages/buy/checkout";
import { CatalogueOrders } from "./pages/buy/orders";

// Risk Assessment — Screens 71-73
import { RiskDashboard } from "./pages/risk/risk-dashboard";
import { VendorRiskProfile } from "./pages/risk/vendor-risk-profile";
import { MitigationWorkflow } from "./pages/risk/mitigation-workflow";

// Agentic AI — Screens 74-76
import { AgentControlCenter } from "./pages/ai/agent-control";
import { AgentConfiguration } from "./pages/ai/agent-config";
import { AgentAnalytics } from "./pages/ai/agent-analytics";

// Multi-Currency & FX — Screens 77-78
import { FXDashboard } from "./pages/finance/fx-dashboard";
import { FXComparison } from "./pages/finance/fx-comparison";

// Developer Portal — Screen 79
import { DeveloperPortal } from "./pages/developers/developer-portal";
import ScrollbarDemo from "./pages/developers/scrollbar-demo";

// Accessibility — Screen 80
import { AccessibilitySettings } from "./pages/settings/accessibility";

// Theme Studio
import { ThemeStudio } from "./pages/settings/theme-studio";

// Site Map
import { SiteMap } from "./pages/site-map";

// Support
import { SubmitTicket } from "./pages/support/submit-ticket";
import { MyTickets } from "./pages/support/my-tickets";

// Not Found
import { NotFound } from "./pages/not-found";

export const router = createBrowserRouter([
  // ─── Auth Routes (standalone layout, no sidebar) ──────────────────
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "2fa-verify", element: <TwoFactorVerify /> },
    ],
  },
  {
    path: "/",
    element: <AuthLayoutWide />,
    children: [
      { path: "register", element: <Register /> },
      { path: "register/procuring-entity", element: <RegisterBuyer /> },
      { path: "register/vendor", element: <RegisterVendor /> },
      // Legacy paths
      { path: "register-buyer", element: <RegisterBuyer /> },
      { path: "register-vendor", element: <RegisterVendor /> },
    ],
  },

  // ─── App Routes (full layout with sidebar) ────────────────────────
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // Site Map as default
      { index: true, element: <SiteMap /> },
      { path: "site-map", element: <SiteMap /> },
      
      // Purchaser Dashboard
      { path: "dashboard", element: <BuyerDashboard /> },
      { path: "organisation/members", element: <OrganisationMembers /> },
      { path: "user-management", element: <PurchaserUserManagement /> },
      { path: "analytics", element: <ProcurementAnalytics /> },
      { path: "analytics/spend-category", element: <SpendByCategoryReport /> },
      { path: "analytics/supplier-concentration", element: <SupplierConcentrationDashboard /> },
      { path: "analytics/savings", element: <SavingsTracker /> },
      { path: "analytics/vendor-performance", element: <VendorPerformanceAnalytics /> },
      { path: "activity", element: <RfqActivityFeed /> },
      { path: "notifications", element: <Notifications /> },
      { path: "calendar", element: <Calendar /> },
      { path: "reports", element: <ProcurementReports /> },
      { path: "activity-logs", element: <PurchaserActivityLogs /> },
      { path: "subscription", element: <SubscriptionManagement /> },
      { path: "profile", element: <PurchaserProfile /> },
      { path: "how-to-use", element: <HowToUse /> },
      { path: "analytics/tenders", element: <TenderPipelineAnalytics /> },
      { path: "analytics/efficiency", element: <ProcessEfficiencyAnalytics /> },
      { path: "analytics/compliance", element: <ComplianceAnalytics /> },

      // Vendor Management
      { path: "vendors", element: <VendorList /> },
      { path: "vendors/:id", element: <VendorProfile /> },
      { path: "vendor-enlistment", element: <VendorEnlistment /> },
      { path: "vendor-enlistment/:id", element: <VendorApproval /> },
      { path: "vendors/:id/categories", element: <VendorCategories /> },
      { path: "vendor-risk", element: <VendorRisk /> },
      { path: "vendors/:id/performance", element: <VendorPerformance /> },
      { path: "vendor-enlistment/form-builder", element: <EnlistmentFormBuilder /> },

      // RFQ Creation
      { path: "tenders", element: <RfqList /> },
      { path: "tenders/create", element: <TenderBuilder /> },
      { path: "tenders/new/items", element: <TenderBuilder /> },
      { path: "tenders/new", element: <CreateRfq /> },
      { path: "tenders/new/simple", element: <CreateNRQ1Simple /> },
      { path: "tenders/new/detailed", element: <CreateNRQ2Detailed /> },
      { path: "tenders/new/custom", element: <CreateNRQ3Custom /> },
      { path: "tenders/new/rfp", element: <CreateRFP /> },
      { path: "tenders/new/documents", element: <UploadDocuments /> },
      { path: "tenders/new/vendors", element: <VendorSelection /> },
      { path: "tenders/new/preview", element: <RfqPreview /> },
      { path: "tenders/new/publish", element: <PublishRfq /> },
      { path: "catalogues/browse", element: <CatalogueBrowser /> },

      // RFQ Monitoring
      { path: "tenders/:id", element: <RfqDashboard /> },
      { path: "tenders/:id/participation", element: <VendorParticipation /> },
      { path: "tenders/:id/live", element: <LiveBidding /> },
      { path: "tenders/:id/timeline", element: <BidTimeline /> },
      { path: "tenders/:id/history", element: <RfqHistory /> },
      { path: "tenders/:id/audit", element: <RfqAuditLog /> },

      // Vendor Portal
      { path: "vendor-dashboard", element: <VendorDashboard /> },
      { path: "vendor-dashboard/srm", element: <VendorSRMDashboard /> },
      { path: "vendor-dashboard/catalogue", element: <VendorCatalogueManager /> },
      { path: "vendor-dashboard/calendar", element: <VendorCalendar /> },
      { path: "vendor-dashboard/how-to-use", element: <VendorHowToUse /> },
      { path: "vendor-profile", element: <VendorProfileEdit /> },
      { path: "rfqs", element: <AvailableRfqs /> },
      { path: "rfqs/:id", element: <RfqDetails /> },
      { path: "rfqs/:id/bid", element: <SubmitBid /> },
      { path: "rfqs/:id/bid/wizard", element: <SubmitBidWizard /> },
      { path: "rfqs/:id/bid/documents", element: <UploadBidDocuments /> },
      { path: "vendor-bids", element: <BidHistory /> },
      { path: "vendor-activity-logs", element: <VendorActivityLogs /> },
      { path: "vendor-users", element: <PurchaserUserManagement /> },
      { path: "vendor-enlistment-requests", element: <VendorEnlistmentRequests /> },
      { path: "vendor-enlistment/apply/:id", element: <ApplyEnlistment /> },

      // Evaluation
      { path: "tenders/:id/technical-eval", element: <RouteGuard allowedRoles={["tech_evaluator", "procurement_head", "procurer", "pe_admin"]} requireTenderAssignment evaluationStage="technical"><TechnicalEvaluation /></RouteGuard> },
      { path: "tenders/:id/commercial-eval", element: <RouteGuard allowedRoles={["commercial_evaluator", "procurement_head", "procurer", "pe_admin"]} requireTenderAssignment evaluationStage="commercial"><CommercialEvaluation /></RouteGuard> },
      { path: "tenders/:id/comparison", element: <RouteGuard allowedRoles={["tech_evaluator", "commercial_evaluator", "auditor", "procurement_head", "procurer", "pe_admin"]}><BidComparison /></RouteGuard> },
      { path: "tenders/:id/ranking", element: <RouteGuard allowedRoles={["commercial_evaluator", "auditor", "procurement_head", "procurer", "pe_admin"]}><VendorRanking /></RouteGuard> },
      { path: "tenders/:id/evaluation-report", element: <RouteGuard allowedRoles={["auditor", "procurement_head", "procurer", "pe_admin"]}><EvaluationReport /></RouteGuard> },
      { path: "tenders/:id/bid-opening", element: <RouteGuard allowedRoles={["procurer", "procurement_head", "pe_admin"]}><BidOpening /></RouteGuard> },
      { path: "tenders/:id/prequalification-eval", element: <RouteGuard allowedRoles={["prequal_evaluator", "procurement_head", "procurer", "pe_admin"]} requireTenderAssignment evaluationStage="prequalification"><PrequalificationEval /></RouteGuard> },
      { path: "tenders/:id/audit-review", element: <RouteGuard allowedRoles={["auditor", "procurement_head", "procurer", "pe_admin"]} requireTenderAssignment evaluationStage="audit"><AuditReview /></RouteGuard> },

      // Award & Contract
      { path: "tenders/:id/award", element: <RouteGuard allowedRoles={["procurement_head", "pe_admin"]}><AwardDecision /></RouteGuard> },
      { path: "contracts/new", element: <ContractGeneration /> },
      { path: "contracts/:id", element: <ContractDashboard /> },
      { path: "contracts/:id/details", element: <ContractManagement /> },
      { path: "contracts/:id/milestones", element: <MilestoneTracking /> },
      { path: "contracts/:id/variations/new", element: <VariationRequestForm /> },
      { path: "contracts/:id/variations/:vid", element: <VariationApproval /> },
      { path: "contracts/:id/payments/:pid", element: <PaymentCertificateApproval /> },
      { path: "contracts/:id/performance", element: <ContractPerformanceRating /> },
      { path: "contracts/:id/history", element: <ContractHistory /> },

      // Admin
      { path: "admin/dashboard", element: <AdminDashboard /> },
      { path: "admin/buyers", element: <BuyerApprovalManagement /> },
      { path: "admin/vendors", element: <VendorApprovalManagement /> },
      { path: "admin/email-templates", element: <EmailTemplates /> },
      { path: "admin/settings", element: <PlatformSettings /> },
      { path: "admin/rfq-management", element: <AdminRfqManagement /> },
      { path: "admin/audit-logs", element: <AdminAuditLogs /> },
      { path: "admin/purchaser-logs", element: <AdminPurchaserLogs /> },
      { path: "admin/vendor-logs", element: <AdminVendorLogs /> },
      { path: "admin/tickets", element: <AdminTickets /> },
      { path: "admin/tickets/:id", element: <AdminTicketDetail /> },
      { path: "admin/prd", element: <PRDReference /> },
      { path: "admin/catalogue-categories", element: <CatalogueCategoryManagement /> },
      { path: "admin/coding-plan", element: <CodingPlan /> },

      // v5.6 Gap-Closure Modules

      // Compliance (KYC/AML) — Screens 60-62
      { path: "admin/compliance/kyc", element: <KYCDashboard /> },
      { path: "vendors/:id/kyc", element: <VendorKYCDetail /> },
      { path: "admin/compliance/alerts", element: <SanctionsAlerts /> },

      // Finance (Three-Way Matching) — Screens 63-65
      { path: "contracts/:id/grn/new", element: <GRNCreation /> },
      { path: "finance/matching", element: <InvoiceMatching /> },
      { path: "finance/disputes/:id", element: <DisputeResolution /> },

      // Security (NIST) — Screen 66
      { path: "admin/security", element: <SecurityDashboard /> },

      // Guided Buying — Screens 67-70
      { path: "buy", element: <GuidedBuying /> },
      { path: "buy/punchout/:vendor_id", element: <PunchOutSession /> },
      { path: "buy/cart", element: <CartReview /> },
      { path: "buy/checkout", element: <BuyCheckout /> },
      { path: "buy/orders", element: <CatalogueOrders /> },

      // Risk Assessment — Screens 71-73
      { path: "risk/dashboard", element: <RiskDashboard /> },
      { path: "risk/assessments", element: <RiskDashboard /> },
      { path: "vendors/:id/risk", element: <VendorRiskProfile /> },
      { path: "risk/mitigations/:id", element: <MitigationWorkflow /> },

      // Agentic AI — Screens 74-76
      { path: "ai/agents", element: <AgentControlCenter /> },
      { path: "ai/config", element: <AgentConfiguration /> },
      { path: "ai/analytics", element: <AgentAnalytics /> },

      // Multi-Currency & FX — Screens 77-78
      { path: "finance/fx", element: <FXDashboard /> },
      { path: "tenders/:id/fx-comparison", element: <FXComparison /> },

      // Developer Portal — Screen 79
      { path: "developers", element: <DeveloperPortal /> },
      { path: "developers/api-keys", element: <DeveloperPortal /> },
      { path: "developers/webhooks", element: <DeveloperPortal /> },
      { path: "developers/scrollbar-demo", element: <ScrollbarDemo /> },

      // Accessibility — Screen 80
      { path: "settings/accessibility", element: <AccessibilitySettings /> },

      // Theme Studio
      { path: "settings/theme-studio", element: <ThemeStudio /> },

      // Support/Ticketing
      { path: "support/submit-ticket", element: <SubmitTicket /> },
      { path: "support/my-tickets", element: <MyTickets /> },

      // 404
      { path: "*", element: <NotFound /> },
    ],
  },
]);