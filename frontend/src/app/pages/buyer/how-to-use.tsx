import { useState, useCallback } from "react";
import { Link } from "react-router";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  ChevronDown,
  ChevronRight,
  Search,
  LayoutDashboard,
  FileStack,
  Users,
  Building2,
  TrendingUp,
  Award,
  ShoppingCart,
  ScrollText,
  Calendar,
  FileText,
  Bell,
  Settings,
  HelpCircle,
  LogIn,
  Palette,
  Shield,
  ClipboardCheck,
  Gavel,
  DollarSign,
  BookOpen,
  Rocket,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Info,
  Lightbulb,
  Eye,
  Zap,
  Layers,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Step {
  text: string;
  link?: string;
  tip?: string;
}

interface SubSection {
  title: string;
  description?: string;
  steps: Step[];
  tip?: string;
}

interface GuideSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: string;
  badgeColor?: string;
  subsections: SubSection[];
}

// ─── Guide Data ─────────────────────────────────────────────────────────────

const GUIDE_SECTIONS: GuideSection[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 0. GETTING STARTED
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Rocket,
    description: "Account registration, login, and initial platform setup",
    badge: "Start Here",
    badgeColor: "bg-green-600 text-white",
    subsections: [
      {
        title: "Registering as a Procuring Entity",
        steps: [
          { text: "Navigate to the registration page by clicking 'Create Account' on the login screen", link: "/register" },
          { text: "Select 'Procuring Entity' as your account type — this is for government agencies, organisations, or companies that create and manage tenders" },
          { text: "Fill in your Organisation Name, Official Email, and set a strong password" },
          { text: "Provide your organisation's registration/tax number and country of operation" },
          { text: "Accept the Terms of Service and Privacy Policy, then submit" },
          { text: "Verify your email address using the link sent to your inbox" },
          { text: "Your account will be reviewed by a platform administrator — you'll receive an approval notification" },
        ],
        tip: "Your organisation can have multiple users. Once approved, the PE Admin can invite team members from User Management.",
      },
      {
        title: "Logging In",
        steps: [
          { text: "Go to the Login page", link: "/login" },
          { text: "Enter your registered email address and password" },
          { text: "If Two-Factor Authentication (2FA) is enabled, you'll be redirected to enter a verification code" },
          { text: "Once authenticated, you'll land on the Purchaser Dashboard" },
        ],
      },
      {
        title: "Two-Factor Authentication (2FA)",
        steps: [
          { text: "After entering correct credentials, you may be prompted for a 6-digit verification code" },
          { text: "Check your authenticator app (Google Authenticator, Authy, etc.) for the current code" },
          { text: "Enter the code and click 'Verify' to complete sign-in" },
          { text: "You can enable or disable 2FA from Organisation Settings > Security tab" },
        ],
        tip: "2FA adds an extra layer of security. It is highly recommended for PE Admin and Procurement Head roles.",
      },
      {
        title: "Forgot Password / Reset Password",
        steps: [
          { text: "Click 'Forgot Password?' on the login page", link: "/forgot-password" },
          { text: "Enter your registered email address and submit" },
          { text: "Check your inbox for a password reset link" },
          { text: "Click the link, enter a new password, and confirm" },
          { text: "Log in with your new password" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. PLATFORM NAVIGATION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "platform-navigation",
    title: "Platform Navigation",
    icon: Layers,
    description: "Sidebar, role switcher, themes, and mobile experience",
    subsections: [
      {
        title: "Sidebar Navigation",
        steps: [
          { text: "The left sidebar displays all available menu items based on your active role" },
          { text: "On desktop, click the collapse button (X / hamburger icon) at the top of the sidebar to toggle between expanded and icon-only mode" },
          { text: "The active page is highlighted with a distinct background colour in the sidebar" },
          { text: "Your name, role, and organisation are shown in a badge at the top of the sidebar" },
        ],
      },
      {
        title: "Mobile Navigation",
        steps: [
          { text: "On mobile and tablet, the sidebar is hidden by default" },
          { text: "Tap the hamburger menu icon (☰) in the top-left to open the sidebar as a full-height overlay" },
          { text: "Tap any menu item to navigate — the sidebar closes automatically" },
          { text: "Tap the backdrop or the X button to close the sidebar without navigating" },
          { text: "The theme picker is also accessible from the mobile top bar (top-right)" },
        ],
      },
      {
        title: "Role Switcher (Demo Feature)",
        steps: [
          { text: "At the bottom of the sidebar, click the 'Demo: Switch Role' section to expand the role switcher" },
          { text: "Roles are grouped by entity type: Procuring Entity, Vendor, and Platform" },
          { text: "Click any role to instantly switch — the sidebar navigation, permissions, and visible data all update automatically" },
          { text: "The current active role is marked with a dot indicator" },
          { text: "This is a demo feature for testing — in production, roles are assigned by the PE Admin" },
        ],
        tip: "Switching roles changes everything: navigation items, tender visibility, actions available, and column displays. Use it to understand each role's perspective.",
      },
      {
        title: "Theme System & Theme Picker",
        steps: [
          { text: "The platform supports 5 built-in themes: Light, Dark, Day Sky, Edu Sky, and Cosmic Night" },
          { text: "Click the theme picker button at the bottom of the sidebar (or top-right on mobile)" },
          { text: "Select a theme — it applies instantly across the entire application" },
          { text: "Your theme preference is saved in your browser and persists between sessions" },
          { text: "For advanced customisation, visit Theme Studio to create your own themes", link: "/settings/theme-studio" },
        ],
      },
      {
        title: "Theme Studio (Advanced)",
        steps: [
          { text: "Navigate to Settings > Theme Studio", link: "/settings/theme-studio" },
          { text: "The Gallery tab shows all available themes (built-in + custom) with live preview cards" },
          { text: "Click 'Create New Theme' to open the editor with 34 customisable colour tokens" },
          { text: "Adjust background, foreground, card, sidebar, primary, secondary, accent, and other tokens using colour pickers" },
          { text: "Choose a custom font family from the font selector" },
          { text: "Adjust the border radius using the slider" },
          { text: "Toggle dark mode ON/OFF to create light or dark themes" },
          { text: "The live preview panel on the right updates in real-time as you make changes" },
          { text: "Save your theme — it is stored in localStorage and appears in the Gallery and Theme Picker" },
          { text: "Use 'Export JSON' or 'Export CSS' to share your theme with others or use it in other projects" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. DASHBOARD
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    description: "Your procurement command centre with stats, quick actions, and recent activity",
    subsections: [
      {
        title: "Overview Stats",
        steps: [
          { text: "The top row shows 4 key metrics: Active Tenders, Total Bids, Enlisted Vendors, and Pending Actions" },
          { text: "Each card shows a count with a colour-coded icon for quick visual scanning" },
          { text: "In the Day Sky theme, stats render as colourful gradient cards with circular progress indicators" },
        ],
      },
      {
        title: "Quick Action Cards",
        steps: [
          { text: "Create RFQ/Tender — start a new procurement process or open the Custom Tender Builder", link: "/tenders/new" },
          { text: "RFQ/Tender Management — view all tenders, check the activity feed, or open the deadlines calendar", link: "/tenders" },
          { text: "Manage Vendors — browse the vendor list, handle enlistment applications, or check vendor risk", link: "/vendors" },
        ],
      },
      {
        title: "Recent Activity",
        steps: [
          { text: "The right-side card shows the latest actions across your organisation" },
          { text: "Each entry shows: action type, tender/vendor reference, and time ago" },
          { text: "Click 'View All Activity' to see the full activity feed", link: "/activity" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. TENDERS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "tenders",
    title: "Tenders",
    icon: FileStack,
    description: "Create, manage, publish, monitor, and evaluate tenders through their full lifecycle",
    badge: "Core Module",
    badgeColor: "bg-blue-600 text-white",
    subsections: [
      {
        title: "Tender List Page",
        description: "The central hub for all your tenders.",
        steps: [
          { text: "Navigate to Tenders from the sidebar — this shows all tenders you have access to", link: "/tenders" },
          { text: "Use the search bar to find tenders by title, reference number, or description" },
          { text: "Filter by Status (All, Draft, Active, Evaluation, Awarded, Cancelled, etc.) using the status dropdown" },
          { text: "Filter by Type (All, Procurement of Goods, Public Works, Professional Services) using the type dropdown" },
          { text: "On mobile, use the Sort dropdown (visible below filters) to sort by any sortable column" },
          { text: "On desktop, click column headers with sort arrows (↕) to sort ascending/descending" },
          { text: "Your filter, sort, and page state is saved in the URL — use browser back/forward to restore previous views" },
          { text: "Change page size (5, 10, 20, 50, 100) using the dropdown next to the pagination controls" },
          { text: "Admin roles can select multiple tenders using checkboxes for bulk actions (delete, archive, export)" },
        ],
        tip: "Bookmark a filtered/sorted view — the URL preserves your exact state (e.g., /tenders?status=Active&sort=deadline&dir=asc).",
      },
      {
        title: "Creating a Tender — 15-Segment Wizard",
        description: "The most comprehensive way to create a fully specified tender.",
        steps: [
          { text: "Click 'New Tender' on the Dashboard or Tenders page, then select the tender type", link: "/tenders/new" },
          { text: "Segment 1 — Tender Identification: Enter title, reference number, procurement method, and currency" },
          { text: "Segment 2 — Procurement Details: Specify the procuring entity, department, funding source, and budget range" },
          { text: "Segment 3 — Scope of Work / BOQ: Define line items with quantities, units, unit prices, and specifications" },
          { text: "Segment 4 — Technical Specifications: Detail the technical requirements and standards" },
          { text: "Segment 5 — Eligibility Criteria: Set minimum experience, turnover, certifications, and other qualification criteria" },
          { text: "Segment 6 — Qualification Requirements: Define pre-qualification requirements (if applicable)" },
          { text: "Segment 7 — Bid Submission Requirements: Specify required documents, formats, and submission instructions" },
          { text: "Segment 8 — Evaluation Methodology: Choose evaluation type (Lowest Price, MEAT, Quality-based) and set weightings" },
          { text: "Segment 9 — Payment & Contract Terms: Define payment schedules, retention money, and contract conditions" },
          { text: "Segment 10 — Timeline & Milestones: Set bid opening date, closing date, contract start/end, and key milestones" },
          { text: "Segment 11 — Tender Documents: Upload RFQ/RFP documents, annexes, BOQs, and supporting files" },
          { text: "Segment 12 — Vendor Selection & Invitation: For limited tenders, select specific vendors to invite" },
          { text: "Segment 13 — Live Bidding Configuration: Enable/disable live bidding, set session rules and duration" },
          { text: "Segment 14 — Approval Workflow & Roles: Configure the approval pipeline with stages, approvers, and routing rules" },
          { text: "Segment 15 — Preview & Publish: Review the complete tender, verify all fields, then publish or save as draft" },
        ],
        tip: "You can navigate between segments using the left sidebar or Next/Previous buttons. Progress is saved automatically within the session.",
      },
      {
        title: "Creating a Tender — Custom Tender Builder",
        description: "A flexible builder that lets you pick and choose which sections to include.",
        steps: [
          { text: "Go to Dashboard > 'Custom RFQ/Tender Builder' or navigate directly", link: "/tenders/create" },
          { text: "Start by selecting a Tender Type (PG, PW, PPS, NRQ-1, NRQ-2, NRQ-3, RFP) — each has pre-configured rules" },
          { text: "Browse the Master Section List — toggle ON/OFF the sections you need using the switches" },
          { text: "Each section expands to show its fields and sub-forms" },
          { text: "Use the Saved Presets feature to save your section selection as a template for future tenders" },
          { text: "Load a saved preset to instantly restore your preferred section configuration" },
          { text: "The side panel shows a live summary of enabled sections, applicable rules, and estimated complexity" },
        ],
      },
      {
        title: "Quick Tender Templates (NRQ-1, NRQ-2, NRQ-3)",
        steps: [
          { text: "NRQ-1 (Simple): A lightweight request for quotation — ideal for low-value, simple purchases", link: "/tenders/new/simple" },
          { text: "NRQ-2 (Detailed): A more structured quotation request with BOQ and technical specs", link: "/tenders/new/detailed" },
          { text: "NRQ-3 (Custom): A fully customisable quotation with advanced evaluation criteria", link: "/tenders/new/custom" },
          { text: "RFP (Request for Proposal): For professional services requiring detailed technical proposals", link: "/tenders/new/rfp" },
        ],
      },
      {
        title: "Upload Documents",
        steps: [
          { text: "Navigate to the Documents segment of tender creation", link: "/tenders/new/documents" },
          { text: "Drag and drop files or click to browse — supported formats: PDF, DOCX, XLSX, images" },
          { text: "Categorise each document (BOQ, Terms of Reference, Annexes, etc.)" },
          { text: "Set document visibility: Public (all vendors), or Private (evaluation committee only)" },
        ],
      },
      {
        title: "Vendor Selection & Invitation (Limited Tender)",
        steps: [
          { text: "For limited/selective tenders, navigate to Vendor Selection", link: "/tenders/new/vendors" },
          { text: "Search the enlisted vendor database by name, category, or rating" },
          { text: "Check the boxes next to vendors you want to invite" },
          { text: "Selected vendors appear in the 'Invited' panel on the right" },
          { text: "Invited vendors will receive an email notification when the tender is published" },
        ],
      },
      {
        title: "Preview & Publish",
        steps: [
          { text: "Click 'Preview' to see how the tender will appear to vendors", link: "/tenders/new/preview" },
          { text: "Review all sections, documents, and settings for accuracy" },
          { text: "When ready, click 'Publish' to go to the final confirmation page", link: "/tenders/new/publish" },
          { text: "Acknowledge the warnings: Once published, the tender cannot be deleted; vendors are notified immediately; the timeline starts" },
          { text: "Click 'Confirm & Publish' — the tender goes live and appears in the Available RFQs for vendors" },
        ],
        tip: "Always save as Draft first. You can revisit and edit a Draft tender at any time before publishing.",
      },
      {
        title: "Monitoring a Live Tender",
        steps: [
          { text: "Click on any tender in the list to open its Tender Dashboard — this shows bids received, participating vendors, days remaining, and current stage" },
          { text: "Vendor Participation — see which vendors have viewed, downloaded documents, or submitted bids" },
          { text: "Live Bidding — if enabled, watch bids come in real-time with automatic ranking" },
          { text: "Bid Timeline — a chronological view of all bid-related events and actions" },
          { text: "History — the full history of tender modifications, addendums, and status changes" },
          { text: "Audit Log — a tamper-proof log of every action taken on this tender" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. EVALUATION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "evaluation",
    title: "Evaluation",
    icon: ClipboardCheck,
    description: "Bid opening, technical/commercial evaluation, comparison, ranking, and reporting",
    subsections: [
      {
        title: "Bid Opening Ceremony",
        steps: [
          { text: "Once the submission deadline passes, navigate to the tender > Bid Opening" },
          { text: "The ceremony can be scheduled, in-progress, or completed" },
          { text: "Click 'Start Ceremony' to unlock and reveal bid envelopes in the presence of the evaluation committee" },
          { text: "Each bid's key details (vendor name, bid amount, submission time) are displayed securely" },
          { text: "Download the Bid Opening Report for the official record" },
        ],
        tip: "Bid opening is a formal step required for transparency. The system logs every action with timestamps.",
      },
      {
        title: "Pre-qualification Evaluation",
        steps: [
          { text: "For tenders with pre-qualification, evaluators score vendors against eligibility criteria" },
          { text: "Each criterion (financial capacity, experience, certifications) is rated on the configured scale" },
          { text: "Vendors meeting the minimum threshold proceed to the technical evaluation" },
          { text: "Those below threshold are disqualified — with reasons documented" },
        ],
      },
      {
        title: "Technical Evaluation",
        steps: [
          { text: "Assigned Technical Evaluators score each bid against technical criteria" },
          { text: "Each criterion has a maximum score and weight — fill in your assessment per vendor" },
          { text: "Add comments and justification for each score" },
          { text: "Evaluators can attach supporting documents or reference materials" },
          { text: "When complete, submit your evaluation — it cannot be modified after submission" },
        ],
      },
      {
        title: "Commercial Evaluation",
        steps: [
          { text: "Commercial Evaluators review pricing, payment terms, and financial proposals" },
          { text: "The system automatically calculates normalised price scores based on the evaluation methodology" },
          { text: "Review for arithmetic errors, missing items, or conditional pricing" },
          { text: "Flag any abnormally low or high bids for further review" },
        ],
      },
      {
        title: "Bid Comparison",
        steps: [
          { text: "The Bid Comparison screen shows all bids side-by-side" },
          { text: "Compare technical scores, commercial scores, and combined weighted scores" },
          { text: "Use the matrix view to compare specific criteria across vendors" },
          { text: "Export the comparison as a report for committee review" },
        ],
      },
      {
        title: "Vendor Ranking",
        steps: [
          { text: "After all evaluations are complete, the system generates an automatic ranking" },
          { text: "Rankings are based on the combined technical + commercial scores" },
          { text: "The highest-ranked vendor becomes the recommended awardee" },
          { text: "The Procurement Head or PE Admin can review and confirm or override the ranking" },
        ],
      },
      {
        title: "Evaluation Report",
        steps: [
          { text: "The system compiles all evaluation data into a formal Evaluation Report" },
          { text: "Review summary scores, individual evaluator assessments, and the final ranking" },
          { text: "The report includes methodology, scoring matrices, and committee observations" },
          { text: "Download the report in PDF format for filing and audit purposes" },
        ],
      },
      {
        title: "Audit Review",
        steps: [
          { text: "Auditors can access a read-only view of the entire evaluation process" },
          { text: "Review individual evaluator scores, timestamps, and justifications" },
          { text: "Flag any concerns or irregularities for investigation" },
          { text: "The audit trail is immutable — no data can be modified retroactively" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. CONTRACTS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "contracts",
    title: "Contracts",
    icon: Award,
    description: "Award decisions, contract generation, milestones, variations, payments, and performance",
    subsections: [
      {
        title: "Award Decision",
        steps: [
          { text: "After evaluation, the Procurement Head or PE Admin navigates to the tender > Award Decision" },
          { text: "Review the recommended vendor (highest-ranked) and the evaluation summary" },
          { text: "Approve or reject the recommendation with documented reasons" },
          { text: "If approved, the system generates intent-to-award notifications to all bidders" },
          { text: "A standstill period may apply before the contract can be finalised" },
        ],
      },
      {
        title: "Contract Generation",
        steps: [
          { text: "After award confirmation, navigate to Generate Contract", link: "/contracts/new" },
          { text: "The system pre-fills contract details from the tender and winning bid" },
          { text: "Review and edit: contract value, duration, payment terms, delivery schedule, and special conditions" },
          { text: "Attach the signed contract document (PDF)" },
          { text: "Both parties (PE and Vendor) can view the contract in their respective dashboards" },
        ],
      },
      {
        title: "Contract Dashboard",
        steps: [
          { text: "Navigate to Contracts from the sidebar to open the Contract Dashboard", link: "/contracts/C-2026-0042" },
          { text: "View the contract overview: value, vendor, dates, completion percentage, and financial summary" },
          { text: "Tabs organize different aspects: Overview, Milestones, Payments, Variations, Documents, and History" },
          { text: "The progress bar shows overall contract completion based on milestone deliverables" },
        ],
      },
      {
        title: "Milestone Tracking",
        steps: [
          { text: "From the Contract Dashboard, go to the Milestones tab" },
          { text: "Each milestone shows: description, due date, value, status (Pending, In Progress, Completed, Overdue)" },
          { text: "Click a milestone to expand details, upload evidence of completion, and add notes" },
          { text: "Mark milestones as complete — this triggers the payment release process" },
        ],
      },
      {
        title: "Variation Requests",
        steps: [
          { text: "When contract scope or value needs to change, submit a Variation Request" },
          { text: "Specify the type of variation: Scope Change, Price Adjustment, Time Extension, or Other" },
          { text: "Provide justification, impact analysis, and any supporting documents" },
          { text: "The variation goes through an approval workflow before taking effect" },
        ],
      },
      {
        title: "Payment Certificates",
        steps: [
          { text: "When a milestone is completed, a Payment Certificate can be generated" },
          { text: "Review: milestone deliverables, inspected quality, certified amount, and retention deductions" },
          { text: "Approve or reject the payment certificate" },
          { text: "Approved certificates proceed to the finance team for disbursement" },
        ],
      },
      {
        title: "Contract Performance Rating",
        steps: [
          { text: "Rate the vendor's performance across multiple dimensions: Quality, Timeliness, Communication, Compliance" },
          { text: "Ratings are on a 1-5 star scale per dimension" },
          { text: "Add written performance notes and recommendations" },
          { text: "Performance ratings feed into the vendor's overall performance score visible in Vendor Management" },
        ],
      },
      {
        title: "Contract History",
        steps: [
          { text: "View the complete chronological history of all contract events" },
          { text: "Includes: creation, amendments, milestones completed, payments, variations, and status changes" },
          { text: "Each entry has a timestamp, actor, and description" },
          { text: "Export the history for audit or reporting purposes" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. USER MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "user-management",
    title: "User Management",
    icon: Users,
    description: "Invite team members, configure roles, set permissions, and manage navigation",
    badge: "PE Admin Only",
    badgeColor: "bg-purple-600 text-white",
    subsections: [
      {
        title: "Viewing Team Members",
        steps: [
          { text: "Navigate to User Management from the sidebar", link: "/user-management" },
          { text: "The member list shows: name, email, role, status (Active, Pending, Suspended, etc.), and last active date" },
          { text: "Use the search bar to find members by name or email" },
          { text: "Filter by role or status using the dropdowns" },
        ],
      },
      {
        title: "Inviting New Members",
        steps: [
          { text: "Click 'Invite User' to open the invite dialog" },
          { text: "Enter the member's full name, email address, and select a role" },
          { text: "Optionally assign them to specific tenders (for evaluator roles)" },
          { text: "Click 'Send Invite' — the member receives an email with a setup link" },
          { text: "Track pending invitations in the member list (shown with 'Pending' badge)" },
        ],
      },
      {
        title: "Built-in Roles",
        description: "The platform includes pre-configured roles for Procuring Entity teams:",
        steps: [
          { text: "PE Admin — Full access: manages organisation, users, tenders, vendors, contracts, and all settings" },
          { text: "Procurer — Creates and manages tenders, publishes, configures workflows, but cannot manage users or delete tenders" },
          { text: "Procurement Head — Senior oversight: can approve awards, view all org tenders, and manage the evaluation pipeline" },
          { text: "Pre-qual Evaluator — Evaluates vendor pre-qualification submissions for assigned tenders only" },
          { text: "Technical Evaluator — Scores technical proposals against criteria for assigned tenders" },
          { text: "Commercial Evaluator — Reviews pricing and financial proposals for assigned tenders" },
          { text: "Auditor — Read-only access to evaluation data, audit trails, and compliance checks" },
        ],
      },
      {
        title: "Creating Custom Roles",
        steps: [
          { text: "In the User Management page, switch to the 'Custom Roles' tab" },
          { text: "Click 'Create Custom Role' to open the role builder" },
          { text: "Name the role, provide a short label (2-4 chars), and write a description" },
          { text: "Toggle individual permissions: Create Tender, Edit Tender, Delete Tender, Publish, Evaluate, Approve, etc." },
          { text: "Select which navigation items this role can see (e.g., Dashboard, Tenders, Vendors, etc.)" },
          { text: "Choose which tender columns are visible for this role" },
          { text: "Configure page-level actions (e.g., can this role run reports? can they export data?)" },
          { text: "Save the custom role — it immediately becomes available for assignment" },
        ],
        tip: "Custom roles are powerful — you can create specialised roles like 'Document Reviewer' or 'Budget Approver' with precise permissions.",
      },
      {
        title: "Managing Permissions",
        steps: [
          { text: "Each role (built-in or custom) has a permission matrix" },
          { text: "Permissions control: canCreateTender, canEditTender, canDeleteTender, canPublishTender, canWithholdTender, canConfigureWorkflow, canAssignRoles, canManageOrgUsers, canViewAllOrgTenders, canEvaluate, canApprove, canBid" },
          { text: "Toggle each permission ON or OFF for the selected role" },
          { text: "Changes take effect immediately for all users assigned to that role" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. VENDOR MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "vendors",
    title: "Vendors",
    icon: Building2,
    description: "Enlisted vendors, enlistment applications, categories, risk, and performance",
    subsections: [
      {
        title: "Vendor List",
        steps: [
          { text: "Navigate to Vendors from the sidebar", link: "/vendors" },
          { text: "Browse all enlisted vendors with search and filter capabilities" },
          { text: "Each vendor card/row shows: company name, category, enlistment status, rating, and contact" },
          { text: "Click on a vendor to open their full profile" },
        ],
      },
      {
        title: "Vendor Profile",
        steps: [
          { text: "The profile shows: company details, registration info, financial data, certifications, and contact information" },
          { text: "View bid history — all tenders this vendor has bid on and their outcomes" },
          { text: "Check performance ratings from previous contracts" },
          { text: "View KYC/AML compliance status (if Compliance module is enabled)" },
        ],
      },
      {
        title: "Vendor Enlistment",
        steps: [
          { text: "Navigate to Vendor Enlistment to manage incoming applications", link: "/vendor-enlistment" },
          { text: "Review new vendor applications: company info, documents, certifications" },
          { text: "Approve or reject applications with documented reasons" },
          { text: "Approved vendors are added to your enlisted vendor pool and can bid on your tenders" },
        ],
      },
      {
        title: "Vendor Categories",
        steps: [
          { text: "Assign vendors to procurement categories (Goods, Works, Services, etc.)" },
          { text: "Categories determine which tenders a vendor is eligible to bid on" },
          { text: "View category-level vendor counts and manage assignments" },
        ],
      },
      {
        title: "Vendor Risk Assessment",
        steps: [
          { text: "Navigate to Vendor Risk from the vendor profile or directly", link: "/vendor-risk" },
          { text: "View the overall risk score and breakdown by category: Financial, Operational, Compliance, Reputational" },
          { text: "Each risk factor is scored on a scale with colour-coded severity (Low, Medium, High, Critical)" },
          { text: "Set up automated risk monitoring alerts for high-risk vendors" },
        ],
      },
      {
        title: "Vendor Performance",
        steps: [
          { text: "Track vendor performance across all contracts" },
          { text: "Metrics include: on-time delivery %, quality score, defect rate, responsiveness, and contract compliance" },
          { text: "Performance scores are aggregated from individual contract ratings" },
          { text: "Use performance data to make informed award decisions on future tenders" },
        ],
      },
      {
        title: "Enlistment Form Builder",
        steps: [
          { text: "Navigate to the Form Builder to customise your vendor enlistment form", link: "/vendor-enlistment/form-builder" },
          { text: "Drag and drop fields to build a custom application form" },
          { text: "Add required documents (registration certificate, tax clearance, financial statements)" },
          { text: "Set validation rules and mandatory fields" },
          { text: "Preview the form as a vendor would see it" },
          { text: "Publish the form — new vendor applicants will use this form" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. ANALYTICS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "analytics",
    title: "Analytics",
    icon: TrendingUp,
    description: "Procurement metrics, spend analysis, supplier concentration, savings, and vendor performance",
    subsections: [
      {
        title: "Procurement Overview",
        steps: [
          { text: "Navigate to Analytics from the sidebar", link: "/analytics" },
          { text: "View key metrics: Total Spend (YTD), Tender Success Rate, and Average Processing Time" },
          { text: "The monthly spend chart shows procurement expenditure trends over the current year" },
          { text: "The category breakdown shows spend distribution across Goods, Works, and Services" },
          { text: "Export the full analytics report using the 'Export Report' button" },
        ],
      },
      {
        title: "Spend by Category",
        steps: [
          { text: "Navigate to Analytics > Spend by Category", link: "/analytics/spend-category" },
          { text: "View detailed spend breakdowns by procurement category with visual charts" },
          { text: "Compare spend against budget allocations per category" },
          { text: "Drill down into individual categories to see specific tenders and contracts" },
        ],
      },
      {
        title: "Supplier Concentration",
        steps: [
          { text: "Navigate to Analytics > Supplier Concentration", link: "/analytics/supplier-concentration" },
          { text: "Identify concentration risk — how much spend is concentrated with a few vendors" },
          { text: "View the Pareto analysis (80/20 rule) across your vendor base" },
          { text: "Get alerts when a single vendor exceeds recommended concentration thresholds" },
        ],
      },
      {
        title: "Savings Tracker",
        steps: [
          { text: "Navigate to Analytics > Savings", link: "/analytics/savings" },
          { text: "Track procurement savings against estimated/budgeted amounts" },
          { text: "Compare winning bid prices versus budget estimates for each tender" },
          { text: "View cumulative savings over time and by category" },
        ],
      },
      {
        title: "Vendor Performance Analytics",
        steps: [
          { text: "Navigate to Analytics > Vendor Performance", link: "/analytics/vendor-performance" },
          { text: "See aggregate performance metrics across all enlisted vendors" },
          { text: "Identify top performers and underperformers" },
          { text: "Benchmark vendor performance against category averages" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. CATALOGUES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "catalogues",
    title: "Catalogues",
    icon: ShoppingCart,
    description: "Browse standardised procurement items, manage a shopping cart, and create orders",
    subsections: [
      {
        title: "Browsing the Catalogue",
        steps: [
          { text: "Navigate to Catalogues from the sidebar", link: "/catalogues/browse" },
          { text: "Search for items by name, item code, or description" },
          { text: "Filter by category using the category dropdown (sourced from the centralised category list)" },
          { text: "View item details: vendor, unit price, unit of measurement, and availability" },
        ],
      },
      {
        title: "Adding Items to Cart",
        steps: [
          { text: "Click the '+' button next to an item to add it to your cart" },
          { text: "Adjust quantities using the +/- buttons in the cart panel" },
          { text: "The cart shows a running total with item count and total value" },
          { text: "Remove items by clicking the trash icon" },
        ],
      },
      {
        title: "Guided Buying (Optional Module)",
        steps: [
          { text: "Navigate to Buy for a guided purchase experience", link: "/buy" },
          { text: "The guided buying wizard walks you through: need identification, supplier selection, and checkout" },
          { text: "PunchOut Sessions allow browsing vendor catalogues directly within the platform" },
          { text: "Review your cart, then proceed to Checkout to generate a purchase order" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. ACTIVITY LOGS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "activity-logs",
    title: "Activity Logs",
    icon: ScrollText,
    description: "Complete audit trail of all actions with search, filter, and export capabilities",
    subsections: [
      {
        title: "Viewing Activity Logs",
        steps: [
          { text: "Navigate to Activity Logs from the sidebar", link: "/activity-logs" },
          { text: "Logs show: timestamp, user, action type, entity name/ID, details, IP address, and severity" },
          { text: "Actions are colour-coded by severity: green (success), blue (info), yellow (warning), red (error)" },
          { text: "Use the search bar to find specific actions, users, or entity references" },
        ],
      },
      {
        title: "Filtering Logs",
        steps: [
          { text: "Filter by action type: rfq.published, rfq.created, bid.submitted, vendor.approved, user.login, etc." },
          { text: "Filter by entity type: RFQ, Vendor, User, Contract" },
          { text: "Filter by severity: Success, Info, Warning, Error" },
          { text: "Filter by date range to focus on specific periods" },
        ],
      },
      {
        title: "Exporting Logs",
        steps: [
          { text: "Click the 'CSV' button to export visible logs as a CSV file for spreadsheets" },
          { text: "Click the 'JSON' button to export logs as structured JSON for integration or archiving" },
          { text: "Exported files include all columns: timestamp, user, action, entity, details, IP, and severity" },
        ],
        tip: "Activity logs are essential for compliance and audit. They cannot be edited or deleted by any user, including PE Admins.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 11. CALENDAR
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "calendar",
    title: "Calendar",
    icon: Calendar,
    description: "Visual deadline tracking for tender submissions, meetings, and evaluations",
    subsections: [
      {
        title: "Using the Calendar",
        steps: [
          { text: "Navigate to Calendar from the sidebar", link: "/calendar" },
          { text: "The calendar view shows the current month with clickable date cells" },
          { text: "Dates with events are visually highlighted" },
          { text: "Click a date to see all events scheduled for that day" },
        ],
      },
      {
        title: "Event Types",
        steps: [
          { text: "Deadline events (red) — bid submission deadlines" },
          { text: "Meeting events (blue) — pre-bid conferences and committee meetings" },
          { text: "Evaluation events (purple) — scheduled technical/commercial evaluation sessions" },
          { text: "Live Bidding events (orange) — live bidding session schedules" },
        ],
      },
      {
        title: "Upcoming Events Panel",
        steps: [
          { text: "The right sidebar shows upcoming events in chronological order" },
          { text: "Each event shows: title, date, time, and type icon" },
          { text: "Click 'Export to iCal' to download events for your personal calendar (Google Calendar, Outlook, etc.)" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 12. REPORTS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "reports",
    title: "Reports",
    icon: FileText,
    description: "Generate, download, and schedule procurement reports",
    subsections: [
      {
        title: "Generating a Report",
        steps: [
          { text: "Navigate to Reports from the sidebar", link: "/reports" },
          { text: "Select a Report Type: Monthly Summary, Vendor Performance, Spend Analysis, Compliance Report, or Audit Trail" },
          { text: "Choose the time period: Last Month, Last Quarter, Year-to-Date, or Custom range" },
          { text: "Select the output format: PDF or Excel" },
          { text: "Click 'Generate Report' — the system creates the report and makes it available for download" },
        ],
      },
      {
        title: "Recent Reports",
        steps: [
          { text: "The 'Recent Reports' section shows previously generated reports" },
          { text: "Each entry shows: report name, generation date, format, and file size" },
          { text: "Click the download icon to save the report to your device" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 13. NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
    description: "Real-time alerts for bids, deadlines, approvals, and role assignments",
    subsections: [
      {
        title: "Viewing Notifications",
        steps: [
          { text: "Navigate to Notifications from the sidebar", link: "/notifications" },
          { text: "Notifications are organised into tabs: All, Unread, and Read" },
          { text: "Each notification shows: title, message, time, and type (bid, deadline, vendor, role)" },
          { text: "Unread notifications appear with a highlighted background" },
        ],
      },
      {
        title: "Managing Notifications",
        steps: [
          { text: "Click 'Mark All Read' to clear all unread indicators" },
          { text: "Click 'Clear All' to remove all notifications" },
          { text: "Individual notifications can be dismissed or actioned" },
        ],
      },
      {
        title: "Notification Types",
        steps: [
          { text: "Bid notifications — new bid submitted, bid withdrawn, bid modification" },
          { text: "Deadline notifications — upcoming deadline reminders (2 days, 1 day, same day)" },
          { text: "Vendor notifications — new vendor approved, enlistment application received" },
          { text: "Role notifications — role assigned, role changed, tender assignment" },
          { text: "Contract notifications — milestone due, payment approved, variation submitted" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 14. ORGANISATION SETTINGS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "org-settings",
    title: "Organisation Settings",
    icon: Settings,
    description: "Organisation profile, security, subscription, workflow, and integrations",
    badge: "PE Admin Only",
    badgeColor: "bg-purple-600 text-white",
    subsections: [
      {
        title: "Organisation Profile",
        steps: [
          { text: "Navigate to Org Settings from the sidebar", link: "/profile" },
          { text: "Update your organisation name, registration number, address, and contact details" },
          { text: "Upload your organisation logo" },
          { text: "Configure default settings: preferred currency, fiscal year, and timezone" },
        ],
      },
      {
        title: "Team Members",
        steps: [
          { text: "View all organisation members with their roles and status" },
          { text: "Add new members via email invitation" },
          { text: "Change member roles or suspend/reactivate accounts" },
          { text: "Track last login and active status per member" },
        ],
      },
      {
        title: "Security Settings",
        steps: [
          { text: "Enable or disable mandatory Two-Factor Authentication (2FA) for the organisation" },
          { text: "Set password policies: minimum length, complexity requirements, expiry period" },
          { text: "Configure session timeout duration" },
          { text: "View login activity and active sessions" },
        ],
      },
      {
        title: "Subscription & Billing",
        steps: [
          { text: "Navigate to Subscription from the Organisation Settings", link: "/subscription" },
          { text: "View current plan: features included, usage limits, and billing cycle" },
          { text: "Compare plans: Starter, Professional, Enterprise with feature comparison matrix" },
          { text: "Upgrade or downgrade your plan" },
          { text: "View billing history and download invoices" },
        ],
      },
      {
        title: "Workflow Configuration",
        steps: [
          { text: "Configure default approval workflows for your organisation" },
          { text: "Set the order of evaluation stages: Pre-qualification → Technical → Commercial → Audit → Award" },
          { text: "Define auto-routing rules: e.g., tenders above a certain value require Procurement Head approval" },
          { text: "Enable or disable specific workflow stages per tender type" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 15. SUPPORT
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "support",
    title: "Support",
    icon: HelpCircle,
    description: "Submit tickets, track issues, and get help from the platform support team",
    subsections: [
      {
        title: "Submitting a Support Ticket",
        steps: [
          { text: "Navigate to Support > Submit Ticket", link: "/support/submit-ticket" },
          { text: "Select ticket type: Bug Report, Feature Request, or General Question" },
          { text: "Choose a priority: Low, Medium, High, or Critical" },
          { text: "Write a detailed description of your issue" },
          { text: "Attach screenshots or files to help the support team understand the issue" },
          { text: "Click 'Submit Ticket' — you'll receive a confirmation with a ticket number" },
        ],
      },
      {
        title: "Viewing Your Tickets",
        steps: [
          { text: "Navigate to Support > My Tickets", link: "/support/my-tickets" },
          { text: "See all your submitted tickets with status: Open, In Progress, Resolved, Closed" },
          { text: "Click on a ticket to see the full conversation and any responses from the support team" },
          { text: "Reply to tickets or add additional information" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 16. ACCESSIBILITY & SETTINGS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "accessibility",
    title: "Accessibility & Settings",
    icon: Eye,
    description: "Accessibility options, theme customisation, and personalisation",
    subsections: [
      {
        title: "Accessibility Settings",
        steps: [
          { text: "Navigate to Settings > Accessibility", link: "/settings/accessibility" },
          { text: "Toggle high-contrast mode for improved visibility" },
          { text: "Adjust font size scaling for larger or smaller text" },
          { text: "Enable reduced motion to minimise animations" },
          { text: "Configure keyboard navigation preferences" },
        ],
      },
      {
        title: "Site Map",
        steps: [
          { text: "Navigate to the Site Map for a bird's-eye view of all platform pages", link: "/site-map" },
          { text: "Pages are organised by category: Authentication, Purchaser, RFQ, Evaluation, Award, etc." },
          { text: "Click any page link to navigate directly to it" },
          { text: "Use the site map to discover features you may not have tried yet" },
        ],
      },
    ],
  },
];

// ─── Collapsible Section Component ──────────────────────────────────────────

function CollapsibleSection({
  section,
  isExpanded,
  onToggle,
  searchQuery,
}: {
  section: GuideSection;
  isExpanded: boolean;
  onToggle: () => void;
  searchQuery: string;
}) {
  const [expandedSubs, setExpandedSubs] = useState<Set<number>>(new Set());
  const Icon = section.icon;

  const toggleSub = (idx: number) => {
    setExpandedSubs((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // Filter subsections by search query
  const filteredSubs = searchQuery
    ? section.subsections.filter(
        (sub) =>
          sub.title.toLowerCase().includes(searchQuery) ||
          sub.steps.some((s) => s.text.toLowerCase().includes(searchQuery)) ||
          (sub.description || "").toLowerCase().includes(searchQuery)
      )
    : section.subsections;

  if (searchQuery && filteredSubs.length === 0) return null;

  return (
    <Card className="overflow-hidden">
      {/* Section Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 sm:p-5 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="size-4 sm:size-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-semibold text-foreground">{section.title}</h2>
            {section.badge && (
              <Badge className={`text-[10px] px-1.5 py-0 ${section.badgeColor}`}>
                {section.badge}
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-1">{section.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="text-[10px] hidden sm:inline-flex">
            {filteredSubs.length} {filteredSubs.length === 1 ? "topic" : "topics"}
          </Badge>
          {isExpanded ? (
            <ChevronDown className="size-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border">
          {filteredSubs.map((sub, idx) => {
            const isSubExpanded = expandedSubs.has(idx) || !!searchQuery;
            return (
              <div key={idx} className="border-b border-border last:border-b-0">
                {/* Sub-section header */}
                <button
                  onClick={() => toggleSub(idx)}
                  className="w-full flex items-center gap-2.5 px-5 sm:px-6 py-3 text-left hover:bg-muted/30 transition-colors"
                >
                  {isSubExpanded ? (
                    <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
                  )}
                  <span className="text-sm font-medium text-foreground">{sub.title}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">
                    {sub.steps.length} {sub.steps.length === 1 ? "step" : "steps"}
                  </span>
                </button>

                {/* Steps */}
                {isSubExpanded && (
                  <div className="px-5 sm:px-6 pb-4">
                    {sub.description && (
                      <p className="text-xs text-muted-foreground mb-3 ml-6">{sub.description}</p>
                    )}
                    <ol className="space-y-2 ml-6">
                      {sub.steps.map((step, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2.5">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold shrink-0 mt-0.5">
                            {sIdx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground leading-relaxed">
                              {step.text}
                            </p>
                            {step.link && (
                              <Link
                                to={step.link}
                                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-0.5"
                              >
                                Open page <ExternalLink className="size-3" />
                              </Link>
                            )}
                            {step.tip && (
                              <div className="flex items-start gap-1.5 mt-1.5 p-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded text-xs text-amber-800 dark:text-amber-300">
                                <Lightbulb className="size-3 mt-0.5 shrink-0" />
                                <span>{step.tip}</span>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                    {sub.tip && (
                      <div className="flex items-start gap-2 mt-3 ml-6 p-2.5 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-800 dark:text-blue-300">
                        <Lightbulb className="size-3.5 mt-0.5 shrink-0" />
                        <span>{sub.tip}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

// ─── Main Page Component ────────────────────────────────────────────────────

export function HowToUse() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["getting-started"]));
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSection = useCallback((id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expandAll = () => setExpandedSections(new Set(GUIDE_SECTIONS.map((s) => s.id)));
  const collapseAll = () => setExpandedSections(new Set());

  const lowerSearch = searchQuery.toLowerCase().trim();

  // Count matching sections for search feedback
  const matchingSections = lowerSearch
    ? GUIDE_SECTIONS.filter((s) =>
        s.title.toLowerCase().includes(lowerSearch) ||
        s.description.toLowerCase().includes(lowerSearch) ||
        s.subsections.some(
          (sub) =>
            sub.title.toLowerCase().includes(lowerSearch) ||
            sub.steps.some((step) => step.text.toLowerCase().includes(lowerSearch))
        )
      )
    : GUIDE_SECTIONS;

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <PageHeader
        title="How to Use This Platform"
        description="A complete step-by-step guide covering every feature of the RFQ/Tendering Platform"
      />

      {/* Welcome Banner */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Welcome to the Platform Guide</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This guide covers every feature available to Purchasing Entity users — from registration and login through to
                tender creation, evaluation, contract management, and reporting. Each section below corresponds to a menu
                item in your sidebar. Click any section to expand it and follow the step-by-step instructions.
                Links are provided to take you directly to the relevant page.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className="text-[10px]">
                  <CheckCircle2 className="size-3 mr-1" />
                  {GUIDE_SECTIONS.length} sections
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  <Layers className="size-3 mr-1" />
                  {GUIDE_SECTIONS.reduce((acc, s) => acc + s.subsections.length, 0)} topics
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  <ClipboardCheck className="size-3 mr-1" />
                  {GUIDE_SECTIONS.reduce((acc, s) => acc + s.subsections.reduce((a, sub) => a + sub.steps.length, 0), 0)} steps
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search + Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search all topics, steps, and instructions..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.trim()) {
                expandAll();
              }
            }}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-2 text-xs text-muted-foreground hover:text-foreground bg-muted rounded-lg transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-2 text-xs text-muted-foreground hover:text-foreground bg-muted rounded-lg transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Search feedback */}
      {lowerSearch && (
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <Info className="size-4" />
          Found {matchingSections.length} of {GUIDE_SECTIONS.length} sections matching "{searchQuery}"
        </div>
      )}

      {/* Table of Contents (quick jump) */}
      {!lowerSearch && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Navigation</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {GUIDE_SECTIONS.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setExpandedSections(new Set([section.id]));
                      document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-foreground hover:bg-muted transition-colors text-left"
                  >
                    <Icon className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{section.title}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sections */}
      <div className="space-y-3">
        {matchingSections.map((section) => (
          <div key={section.id} id={`section-${section.id}`}>
            <CollapsibleSection
              section={section}
              isExpanded={expandedSections.has(section.id)}
              onToggle={() => toggleSection(section.id)}
              searchQuery={lowerSearch}
            />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>
          Need more help?{" "}
          <Link to="/support/submit-ticket" className="text-primary hover:underline">
            Submit a support ticket
          </Link>{" "}
          or contact your Platform Administrator.
        </p>
      </div>
    </div>
  );
}
