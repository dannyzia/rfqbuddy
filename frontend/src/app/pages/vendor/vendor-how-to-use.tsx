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
  FileText,
  Users,
  Building2,
  Star,
  Package,
  Calendar,
  ScrollText,
  Bell,
  HelpCircle,
  Rocket,
  Layers,
  BookOpen,
  ClipboardCheck,
  ExternalLink,
  CheckCircle2,
  Info,
  Lightbulb,
  Eye,
  Palette,
  Shield,
  DollarSign,
  Upload,
  Gavel,
  ArrowRight,
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
    description: "Register your company, log in, and set up your vendor account",
    badge: "Start Here",
    badgeColor: "bg-green-600 text-white",
    subsections: [
      {
        title: "Registering as a Vendor",
        steps: [
          { text: "Navigate to the registration page by clicking 'Create Account' on the login screen", link: "/register" },
          { text: "Select 'Vendor / Supplier' as your account type — this is for companies that supply goods, works, or services" },
          { text: "Step 1 — Company Info: Enter your company name, registration number, year of establishment, and business description" },
          { text: "Step 2 — Contact & Account: Provide official email, phone number, set a secure password, and designate the primary contact person" },
          { text: "Step 3 — Categories: Select the procurement categories your company operates in (e.g., General Goods, Construction Works, IT Services, Medical Supplies)" },
          { text: "Step 4 — Documents: Upload your company registration certificate, tax clearance, financial statements, and any certifications (ISO, trade licence, etc.)" },
          { text: "Step 5 — Verification: Review all information, accept the Terms of Service, and submit your registration" },
          { text: "Your account will be reviewed by the platform administrator — you'll receive an email notification upon approval" },
        ],
        tip: "Ensure all uploaded documents are current and not expired. Expired documents may delay your approval.",
      },
      {
        title: "Logging In",
        steps: [
          { text: "Go to the Login page", link: "/login" },
          { text: "Enter your registered email address and password" },
          { text: "If Two-Factor Authentication (2FA) is enabled by your organisation admin, enter the 6-digit verification code from your authenticator app" },
          { text: "Once authenticated, you'll land on the Vendor Dashboard" },
        ],
      },
      {
        title: "Forgot Password / Reset Password",
        steps: [
          { text: "Click 'Forgot Password?' on the login page", link: "/forgot-password" },
          { text: "Enter your registered email address and submit" },
          { text: "Check your inbox for a password reset link" },
          { text: "Click the link, set a new password, and log in" },
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
          { text: "The left sidebar shows all menu items available to your role (Vendor Admin, Sales Executive, or Sales Manager)" },
          { text: "Click the collapse button (X / ☰) at the top to toggle between expanded labels and icon-only mode on desktop" },
          { text: "The active page is highlighted with a coloured background" },
          { text: "Your name, role, and company are shown at the top of the sidebar" },
        ],
      },
      {
        title: "Mobile Navigation",
        steps: [
          { text: "On mobile devices, the sidebar is hidden by default" },
          { text: "Tap the hamburger icon (☰) in the top-left corner to open the sidebar as a full-height overlay" },
          { text: "Tap any menu item to navigate — the sidebar closes automatically" },
          { text: "The theme picker is accessible from the top-right of the mobile bar" },
        ],
      },
      {
        title: "Role Switcher (Demo Feature)",
        steps: [
          { text: "At the bottom of the sidebar, expand 'Demo: Switch Role' to see all available roles" },
          { text: "Vendor roles: Vendor Admin (full access), Sales Manager (bid review), Sales Executive (bid preparation)" },
          { text: "Switching roles changes your navigation items and available actions" },
          { text: "In production, roles are assigned by the Vendor Admin — this switcher is for demo purposes only" },
        ],
        tip: "Try switching between vendor roles to see how the sidebar and available features change for each team member.",
      },
      {
        title: "Theme System",
        steps: [
          { text: "The platform supports 5 built-in themes: Light, Dark, Day Sky, Edu Sky, and Cosmic Night" },
          { text: "Click the theme picker at the bottom of the sidebar (or top-right on mobile) to switch themes instantly" },
          { text: "Your theme preference is saved in your browser and persists across sessions" },
          { text: "For advanced customisation, visit Theme Studio to create your own themes", link: "/settings/theme-studio" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. VENDOR DASHBOARD
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    description: "Your command centre with key stats, quick links, and a snapshot of your activity",
    subsections: [
      {
        title: "Overview Stats",
        steps: [
          { text: "Navigate to the Dashboard from the sidebar", link: "/vendor-dashboard" },
          { text: "The top row shows 4 key metrics: Open RFQs (tenders you can bid on), My Bids (total submitted), Awards (contracts won), and Deadlines (upcoming)" },
          { text: "Use these numbers for a quick daily check on your procurement activity" },
        ],
      },
      {
        title: "Quick Action Cards",
        steps: [
          { text: "Available RFQs — browse all open tenders you're eligible to bid on", link: "/rfqs" },
          { text: "My Bids — track every bid you've submitted and its current status", link: "/vendor-bids" },
          { text: "Update Profile — keep your company details and documents current", link: "/vendor-profile" },
          { text: "Notifications — check for new invitations, deadline reminders, and award notifications", link: "/notifications" },
          { text: "Deadlines Calendar — visualise upcoming bid deadlines and events", link: "/vendor-dashboard/calendar" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. AVAILABLE RFQs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "available-rfqs",
    title: "Available RFQs",
    icon: FileStack,
    description: "Browse, search, and bid on open tenders from Procuring Entities",
    badge: "Core Module",
    badgeColor: "bg-blue-600 text-white",
    subsections: [
      {
        title: "Browsing Available Tenders",
        steps: [
          { text: "Navigate to Available RFQs from the sidebar", link: "/rfqs" },
          { text: "All open tenders you're eligible to bid on are listed as cards" },
          { text: "Each card shows: tender title, buyer/procuring entity name, category, budget range, and deadline" },
          { text: "Tenders closing within 48 hours are flagged with a red 'Closing Soon' badge" },
          { text: "Use the search bar to find tenders by title, buyer name, or category" },
          { text: "Switch between 'Open' and 'Closing Soon' tabs to filter by urgency" },
        ],
        tip: "Check Available RFQs daily — new tenders appear as soon as Procuring Entities publish them.",
      },
      {
        title: "Viewing Tender Details",
        steps: [
          { text: "Click 'View Details' on any tender card to open its full details page" },
          { text: "The Overview tab shows: RFQ ID, title, buyer, status, publication date, deadline, budget, and full description" },
          { text: "The Items / BOQ tab lists all required items with quantities, units, and technical specifications — this is what you'll be pricing" },
          { text: "The Documents tab lists all downloadable tender documents (specifications, terms & conditions, BOQ templates, etc.)" },
          { text: "Click the download icon next to each document to save it locally" },
          { text: "Review all details carefully before preparing your bid" },
        ],
      },
      {
        title: "Submitting a Bid — Quick Method",
        description: "A streamlined form for straightforward bids.",
        steps: [
          { text: "From the tender details page, click 'Submit Bid'", link: "/rfqs/RFQ-2024-001/bid" },
          { text: "The pricing table lists each line item with quantity and unit — enter your Unit Price for each item" },
          { text: "The system auto-calculates the line total (quantity × unit price) and the overall bid amount" },
          { text: "Add any notes or special conditions in the Notes / Comments section" },
          { text: "Click 'Save Draft' to save your progress and return later" },
          { text: "Click 'Continue to Documents' to proceed to the document upload step" },
        ],
      },
      {
        title: "Submitting a Bid — Full Wizard",
        description: "A comprehensive multi-step wizard for complex tenders with all required forms.",
        steps: [
          { text: "From the tender details page, click 'Submit Bid' → 'Full Wizard' (or navigate directly)", link: "/rfqs/RFQ-2024-001/bid/wizard" },
          { text: "Step 1 — Tender Overview: Review tender details, type, value, and confirm you want to proceed" },
          { text: "Step 2 — Submission Letter (PG2-1): Fill in your company details, authorised signatory, and generate the formal bid letter" },
          { text: "Step 3 — Tenderer Information (PG2-2): Provide company registration details, years of experience, annual turnover, and financial data" },
          { text: "Step 4 — Experience & References (PG2-3): List relevant past projects, client references, and completed contract values" },
          { text: "Step 5 — Key Personnel (PG2-4): Add team members who will be assigned to this project with their qualifications and roles" },
          { text: "Step 6 — Equipment & Resources (PG2-5): List equipment, vehicles, and tools available for the project" },
          { text: "Step 7 — Work Plan (PG2-6): Describe your approach, methodology, and implementation timeline" },
          { text: "Step 8 — Pricing / BOQ (PG2-7): Enter unit prices for each line item — totals are calculated automatically" },
          { text: "Step 9 — Documents: Upload all required supporting documents (certifications, financial proof, technical proposals)" },
          { text: "Step 10 — Review & Submit: Review your complete bid, verify all sections, then click 'Submit Bid'" },
        ],
        tip: "The wizard adapts based on the tender type (PG, PW, PPS, NRQ). Some steps are optional for simpler tenders. A progress bar at the top shows your completion status.",
      },
      {
        title: "Uploading Bid Documents",
        steps: [
          { text: "Navigate to the Documents step of the bid process", link: "/rfqs/RFQ-2024-001/bid/documents" },
          { text: "The system shows all required and optional documents for this tender" },
          { text: "Required documents are marked with a red asterisk — your bid cannot be submitted without them" },
          { text: "Typical required documents: Company Profile, Technical Specifications, Financial Documents, Compliance Certificates" },
          { text: "Optional documents: Insurance Certificate, Reference Letters, Additional Proposals" },
          { text: "Click 'Upload' next to each document slot, select the file from your device, and wait for the upload to complete" },
          { text: "A green checkmark appears next to successfully uploaded documents" },
          { text: "When all required documents are uploaded, click 'Submit Bid' to finalise" },
        ],
        tip: "Upload documents in PDF format for best compatibility. Keep file sizes under 10MB per document.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. MY BIDS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "my-bids",
    title: "My Bids",
    icon: FileText,
    description: "Track all submitted bids, their status, and outcomes",
    subsections: [
      {
        title: "Viewing Bid History",
        steps: [
          { text: "Navigate to My Bids from the sidebar", link: "/vendor-bids" },
          { text: "All your submitted bids are listed with: Bid ID, Tender Title, Buyer, Bid Amount, Submission Date, and Status" },
          { text: "Switch between tabs: All Bids, Active (under review/shortlisted), and Completed (awarded/not awarded)" },
        ],
      },
      {
        title: "Understanding Bid Statuses",
        steps: [
          { text: "Under Review — your bid has been received and is being evaluated by the procuring entity" },
          { text: "Shortlisted — your bid passed preliminary evaluation and is in the final evaluation round" },
          { text: "Awarded — congratulations! You've won the contract. Check for next steps and contract details" },
          { text: "Not Awarded — the contract was awarded to another vendor. Review feedback if available" },
        ],
      },
      {
        title: "Viewing Bid Details",
        steps: [
          { text: "Click 'View' on any bid to see your full submission details" },
          { text: "Review your submitted pricing, documents, notes, and timestamps" },
          { text: "For awarded bids, you'll see a link to the contract details" },
          { text: "For bids under review, check the expected evaluation timeline" },
        ],
        tip: "Keep checking your bid statuses regularly — status changes trigger notifications but it's good practice to verify directly.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. USER MANAGEMENT (Vendor Admin only)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "user-management",
    title: "User Management",
    icon: Users,
    description: "Manage your vendor team, assign roles, and control access",
    badge: "Vendor Admin",
    badgeColor: "bg-cyan-600 text-white",
    subsections: [
      {
        title: "Viewing Team Members",
        steps: [
          { text: "Navigate to User Management from the sidebar", link: "/vendor-users" },
          { text: "See all team members with: name, email, role, status (Active, Pending, Suspended), and last active date" },
          { text: "Use the search bar to find specific members" },
        ],
      },
      {
        title: "Inviting New Team Members",
        steps: [
          { text: "Click 'Invite User' to open the invite dialog" },
          { text: "Enter the member's full name and email address" },
          { text: "Select a role: Vendor Admin, Sales Manager, Sales Executive" },
          { text: "Click 'Send Invite' — they'll receive an email to set up their account" },
          { text: "Track pending invitations in the member list" },
        ],
      },
      {
        title: "Understanding Vendor Roles",
        steps: [
          { text: "Vendor Admin — Full access: manages team, company profile, bids, enlistment, catalogue, SRM dashboard, and all settings" },
          { text: "Sales Manager — Reviews and approves bids, oversees bid activity, views activity logs and calendar" },
          { text: "Sales Executive — Prepares and submits bids, uploads documents, views available RFQs and calendar" },
        ],
      },
      {
        title: "Creating Custom Roles",
        steps: [
          { text: "Switch to the 'Custom Roles' tab in User Management" },
          { text: "Click 'Create Custom Role' to open the role builder" },
          { text: "Name the role, provide a short label, and describe its purpose" },
          { text: "Toggle permissions: can this role submit bids? view all org tenders? manage users?" },
          { text: "Select which navigation items are visible to this role" },
          { text: "Choose visible tender columns for this role's table view" },
          { text: "Save — the custom role becomes immediately available for assignment" },
        ],
        tip: "Create specialised roles like 'Bid Coordinator' (prepares bids but cannot submit) or 'Finance Viewer' (tracks payments and SRM data only).",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. COMPANY PROFILE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "company-profile",
    title: "Company Profile",
    icon: Building2,
    description: "Manage company details, documents, team, and enlistment status",
    subsections: [
      {
        title: "Updating Company Information",
        steps: [
          { text: "Navigate to Company Profile from the sidebar", link: "/vendor-profile" },
          { text: "The Company tab shows: company name, registration number, address, phone, email, and business description" },
          { text: "Edit any field and click 'Save Changes' to update" },
          { text: "Upload or update your company logo for tender submissions" },
        ],
      },
      {
        title: "Managing Documents",
        steps: [
          { text: "Switch to the Documents tab to manage your company's compliance documents" },
          { text: "Keep your registration certificate, tax clearance, financial statements, and certifications up to date" },
          { text: "Upload new versions of expiring documents before they lapse" },
          { text: "Documents are used across all bid submissions — updating them here updates them everywhere" },
        ],
        tip: "Procuring Entities can see your document status. Keep everything current to maintain your enlistment eligibility.",
      },
      {
        title: "Managing Team Members (from Profile)",
        steps: [
          { text: "Switch to the Team tab to see your current team" },
          { text: "Add new team members by clicking 'Add Team Member'" },
          { text: "Assign roles: Account Manager (full access), Sales Representative (bid submission), Bid Coordinator (bid prep), Viewer (read-only)" },
          { text: "Remove or deactivate members who no longer need access" },
        ],
      },
      {
        title: "Enlistment Applications",
        steps: [
          { text: "Navigate to Enlistment Requests to view all incoming invitations from Procuring Entities", link: "/vendor-enlistment-requests" },
          { text: "Pending requests show the Procuring Entity name, form title, deadline, and description" },
          { text: "Click 'Apply' to start filling out the enlistment application" },
          { text: "Track the status of each application: Pending, Submitted, Approved, or Rejected" },
        ],
      },
      {
        title: "Filling Out an Enlistment Application",
        description: "A 5-step wizard to apply for enlistment with a Procuring Entity.",
        steps: [
          { text: "Step 1 — Enlistment Details: Review the Procuring Entity's requirements and terms" },
          { text: "Step 2 — Company Information: Confirm or update your company details for this specific application" },
          { text: "Step 3 — Documents Upload: Upload all required documents (registration, financials, certifications)" },
          { text: "Step 4 — Category Selection: Select the procurement categories you want to be enlisted for" },
          { text: "Step 5 — Review & Submit: Review everything, then submit your application" },
          { text: "After submission, the Procuring Entity will review and approve or reject your application" },
        ],
        tip: "Being enlisted with a Procuring Entity makes you eligible to bid on their tenders. Some PE's require enlistment before you can see their available tenders.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. SRM DASHBOARD
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "srm-dashboard",
    title: "SRM Dashboard",
    icon: Star,
    description: "Supplier Relationship Management — performance, contracts, payments, and documents",
    badge: "Vendor Admin",
    badgeColor: "bg-cyan-600 text-white",
    subsections: [
      {
        title: "Performance Overview",
        steps: [
          { text: "Navigate to SRM Dashboard from the sidebar", link: "/vendor-dashboard/srm" },
          { text: "View your overall performance rating (1-5 stars) based on contract feedback from Procuring Entities" },
          { text: "The performance trend chart shows your monthly score over the last 6 months" },
          { text: "Performance dimensions: Quality, Timeliness, Communication, and Compliance" },
        ],
        tip: "A high performance score improves your ranking in future evaluations. Maintain scores above 4.0 for preferred vendor status.",
      },
      {
        title: "Active Contracts",
        steps: [
          { text: "The Active Contracts section shows all your ongoing contracts" },
          { text: "Each contract displays: ID, title, total value, status, completion progress bar, next milestone, and due date" },
          { text: "Click a contract to navigate to the contract details page for milestones and deliverables" },
          { text: "Completed contracts move to the history section" },
        ],
      },
      {
        title: "Payment Tracking",
        steps: [
          { text: "The Payment History section shows all payments across your contracts" },
          { text: "Each entry shows: Payment ID, contract reference, amount, date, and status (Paid or Pending)" },
          { text: "View your total paid amount and total pending amount at the top" },
          { text: "Payments are triggered when milestones are completed and payment certificates are approved" },
        ],
      },
      {
        title: "Document Expiry Alerts",
        steps: [
          { text: "The Document Status panel flags documents nearing expiry" },
          { text: "Colour-coded status: Green (valid), Yellow/Orange (expiring within 30 days), Red (expired)" },
          { text: "Click 'Renew' next to any expiring document to upload an updated version" },
          { text: "Expired documents may affect your eligibility for new tenders — renew promptly" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. MY CATALOGUE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "my-catalogue",
    title: "My Catalogue",
    icon: Package,
    description: "Manage your product and service catalogue for PunchOut and catalogue-based ordering",
    badge: "Vendor Admin",
    badgeColor: "bg-cyan-600 text-white",
    subsections: [
      {
        title: "Viewing Your Catalogue",
        steps: [
          { text: "Navigate to My Catalogue from the sidebar", link: "/vendor-dashboard/catalogue" },
          { text: "Your catalogue lists all items with: Item Code, Name, Category, Unit, Unit Price, Stock, and Status" },
          { text: "Use the search bar to quickly find items by name or code" },
          { text: "Active items are visible to Procuring Entities in the Catalogue Browser; Pending items are under review" },
        ],
      },
      {
        title: "Adding a New Item",
        steps: [
          { text: "Click '+ Add Item' to open the item creation dialog" },
          { text: "Enter: Item Code (unique identifier), Name, Description, Category (from the standard list), Unit of Measurement, and Unit Price" },
          { text: "Set the available Stock quantity" },
          { text: "Click 'Save' — the item is added in 'Pending' status until approved" },
        ],
      },
      {
        title: "Editing & Managing Items",
        steps: [
          { text: "Click the Edit (pencil) icon on any item to update its details" },
          { text: "Update prices, stock levels, descriptions, or categories as needed" },
          { text: "Click the Trash icon to delete an item from your catalogue" },
          { text: "Keep your catalogue up to date — Procuring Entities rely on accurate pricing and availability" },
        ],
        tip: "Your catalogue items appear in the Procuring Entity's Catalogue Browser and Guided Buying module. Accurate pricing helps win more orders.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. CALENDAR
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "calendar",
    title: "Calendar",
    icon: Calendar,
    description: "Track bid deadlines, pre-bid meetings, contract milestones, and enlistment renewals",
    subsections: [
      {
        title: "Using the Calendar",
        steps: [
          { text: "Navigate to Calendar from the sidebar", link: "/vendor-dashboard/calendar" },
          { text: "The top stats show: Urgent Deadlines (next 7 days), Upcoming Meetings (next 30 days), and Total Events This Month" },
          { text: "Dates with events are highlighted with bold underlined text in the calendar" },
          { text: "Click any date to see all events scheduled for that day" },
        ],
      },
      {
        title: "Event Types",
        steps: [
          { text: "Bid Deadline (red) — submission deadlines for tenders you're eligible to bid on" },
          { text: "Pre-bid Meeting (blue) — scheduled pre-bid conferences and Q&A sessions" },
          { text: "Contract (green) — contract signing dates and milestone due dates" },
          { text: "Evaluation (purple) — scheduled technical/commercial evaluation sessions" },
          { text: "Enlistment (amber) — enlistment renewal deadlines and application deadlines" },
        ],
      },
      {
        title: "Filtering & Navigating Events",
        steps: [
          { text: "Use the filter pills at the top to show only specific event types (e.g., only deadlines)" },
          { text: "Urgent events are highlighted with a red border and 'URGENT' badge" },
          { text: "Each event card shows: title, date/time, RFQ reference (if applicable), and days until the event" },
          { text: "The Upcoming Events sidebar on the right lists the next 30 days of events in chronological order" },
          { text: "Click 'Export to iCal' to download all events for your personal calendar (Google, Outlook, Apple)" },
        ],
        tip: "Set up daily calendar checks as part of your routine. Missing a bid deadline means losing the opportunity entirely.",
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
    description: "Complete audit trail of all bid submissions, document uploads, and team actions",
    subsections: [
      {
        title: "Viewing Activity Logs",
        steps: [
          { text: "Navigate to Activity Logs from the sidebar", link: "/vendor-activity-logs" },
          { text: "Logs show every action taken by your team: bid submissions, document uploads, profile updates, logins, and more" },
          { text: "Each entry shows: timestamp, user who performed the action, action type, entity reference, details, and status" },
          { text: "Status indicators: green (success), yellow (warning), red (error)" },
        ],
      },
      {
        title: "Searching & Filtering",
        steps: [
          { text: "Use the search bar to find specific actions, users, or bid/entity references" },
          { text: "Filter by action type (bid.submitted, document.uploaded, profile.updated, user.login)" },
          { text: "Filter by status to find errors or warnings that need attention" },
        ],
      },
      {
        title: "Exporting Logs",
        steps: [
          { text: "Click the CSV button to export logs for spreadsheet analysis" },
          { text: "Click the JSON button to export structured log data for integration or archiving" },
          { text: "Exported files include all visible log columns" },
        ],
        tip: "Activity logs are useful for internal audits, bid submission verification, and resolving disputes about who did what and when.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 11. NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
    description: "Real-time alerts for new tenders, bid status changes, deadlines, and awards",
    subsections: [
      {
        title: "Viewing Notifications",
        steps: [
          { text: "Navigate to Notifications from the sidebar", link: "/notifications" },
          { text: "Notifications are organized into tabs: All, Unread, and Read" },
          { text: "Each notification shows: title, message, timestamp, and type" },
          { text: "Unread notifications have a highlighted background for visibility" },
        ],
      },
      {
        title: "Notification Types You'll Receive",
        steps: [
          { text: "Tender Invitation — a Procuring Entity has published a tender you're eligible for" },
          { text: "Deadline Reminder — a bid submission deadline is approaching (2 days, 1 day, same day)" },
          { text: "Bid Status Change — your bid status changed (shortlisted, under review, awarded, not awarded)" },
          { text: "Award Notification — you've been awarded a contract! Next steps and contract details follow" },
          { text: "Enlistment Update — your enlistment application was approved, rejected, or requires additional info" },
          { text: "Contract Milestone — a milestone is due or a payment has been processed" },
          { text: "Document Expiry — one of your compliance documents is nearing expiration" },
        ],
      },
      {
        title: "Managing Notifications",
        steps: [
          { text: "Click 'Mark All Read' to clear all unread indicators at once" },
          { text: "Click 'Clear All' to remove all notifications from the list" },
        ],
        tip: "Don't ignore notifications — they often contain time-sensitive information about deadlines and awards.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 12. SUPPORT
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "support",
    title: "Support",
    icon: HelpCircle,
    description: "Get help from the platform support team — report issues, request features, or ask questions",
    subsections: [
      {
        title: "Submitting a Support Ticket",
        steps: [
          { text: "Navigate to Support from the sidebar, then click 'Submit Ticket'", link: "/support/submit-ticket" },
          { text: "Select a ticket type: Bug Report (something is broken), Feature Request (suggest an improvement), or General Question" },
          { text: "Choose priority: Low, Medium, High, or Critical" },
          { text: "Write a detailed description of your issue — include what you were doing, what happened, and what you expected" },
          { text: "Attach screenshots or files to help the support team understand the problem" },
          { text: "Click 'Submit Ticket' — you'll receive a confirmation with a ticket number for tracking" },
        ],
      },
      {
        title: "Tracking Your Tickets",
        steps: [
          { text: "Navigate to Support > My Tickets to see all your submitted tickets", link: "/support/my-tickets" },
          { text: "Each ticket shows: ticket number, type, priority, status (Open, In Progress, Resolved, Closed), and submission date" },
          { text: "Click on a ticket to see the full conversation thread and any responses from the support team" },
          { text: "Reply to tickets to add additional information or respond to support questions" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 13. TIPS & BEST PRACTICES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "best-practices",
    title: "Tips & Best Practices",
    icon: Lightbulb,
    description: "Practical advice to maximise your success on the platform",
    subsections: [
      {
        title: "Winning More Bids",
        steps: [
          { text: "Read the full tender document before starting your bid — understand all requirements, evaluation criteria, and scoring weights" },
          { text: "Complete every section of the bid wizard — incomplete bids score lower or may be disqualified" },
          { text: "Price competitively but realistically — abnormally low prices are flagged for review and may be rejected" },
          { text: "Upload all required documents in the correct format (PDF preferred) and within size limits" },
          { text: "Submit early — don't wait until the last minute. Technical issues near the deadline could cost you the bid" },
          { text: "Attend pre-bid meetings and Q&A sessions — they provide valuable clarifications" },
        ],
      },
      {
        title: "Maintaining Your Profile",
        steps: [
          { text: "Keep your company registration, tax clearance, and certifications current — expired documents affect eligibility" },
          { text: "Update your catalogue prices regularly to reflect market rates" },
          { text: "Respond promptly to enlistment invitations — they expand your access to more tenders" },
          { text: "Monitor your SRM performance score and address any areas below 4.0" },
        ],
      },
      {
        title: "Team Collaboration",
        steps: [
          { text: "Assign clear roles: Sales Executives prepare bids, Sales Managers review before submission" },
          { text: "Use the Activity Logs to track team actions and ensure accountability" },
          { text: "Set up internal deadlines 2-3 days before the actual tender deadline for review time" },
          { text: "Use the Calendar to keep your entire team aware of upcoming deadlines and meetings" },
        ],
      },
      {
        title: "Security Best Practices",
        steps: [
          { text: "Enable Two-Factor Authentication (2FA) for all team members, especially admins" },
          { text: "Use unique, strong passwords — the platform enforces minimum complexity requirements" },
          { text: "Review the Activity Logs periodically to detect any unauthorised access" },
          { text: "Remove team members who leave the company promptly to prevent unauthorized access" },
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

      {isExpanded && (
        <div className="border-t border-border">
          {filteredSubs.map((sub, idx) => {
            const isSubExpanded = expandedSubs.has(idx) || !!searchQuery;
            return (
              <div key={idx} className="border-b border-border last:border-b-0">
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
                            <p className="text-sm text-foreground leading-relaxed">{step.text}</p>
                            {step.link && (
                              <Link
                                to={step.link}
                                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-0.5"
                              >
                                Open page <ExternalLink className="size-3" />
                              </Link>
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

export function VendorHowToUse() {
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
        description="A complete step-by-step guide for vendors — from registration to winning contracts"
      />

      {/* Welcome Banner */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Welcome to the Vendor Guide</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This guide covers every feature available to vendor users — from registering your company and
                browsing available tenders, through to submitting bids, managing your catalogue, tracking contracts,
                and monitoring your performance. Each section corresponds to a menu item in your sidebar.
                Click any section to expand it and follow the step-by-step instructions.
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
              if (e.target.value.trim()) expandAll();
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

      {/* Table of Contents */}
      {!lowerSearch && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Navigation</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {GUIDE_SECTIONS.map((section) => {
                const SIcon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setExpandedSections(new Set([section.id]));
                      document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-foreground hover:bg-muted transition-colors text-left"
                  >
                    <SIcon className="size-3.5 text-muted-foreground shrink-0" />
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
          or contact your Vendor Admin.
        </p>
      </div>
    </div>
  );
}
