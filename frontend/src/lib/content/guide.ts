/**
 * How-to-Use guide content for RFQ Buddy.
 * Structured as role-based accordion sections (Buyer / Vendor) with
 * numbered, action-oriented steps per purchase type.
 *
 * Edit this file to update or add guide content as the platform evolves.
 */

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

/** A single numbered step inside a guide sub-section. */
export interface GuideStep {
  /** The action to perform, e.g. "Click Start Simple RFQ from your Dashboard." */
  action: string;
  /** Optional additional context or explanation for this step. */
  detail?: string;
}

/** A named sub-section under a role accordion (e.g. "Simple RFQ — Step-by-Step"). */
export interface GuideSubSection {
  id: string;
  /** Heading shown in the subsection card. */
  title: string;
  /** One-line summary: when to use this guide. */
  summary: string;
  /** Ordered, action-oriented steps. */
  steps: GuideStep[];
}

/** Top-level expandable accordion for either buyers or vendors. */
export interface GuideRoleSection {
  role: 'buyer' | 'vendor';
  /** Label shown on the accordion button, e.g. "For Buyers". */
  label: string;
  /** Emoji used as a visual indicator next to the label. */
  icon: string;
  /** Sub-sections listed inside the accordion. */
  subsections: GuideSubSection[];
}

/** Shared sections shown outside the accordions (Getting Started, Where to Get Help). */
export interface SharedGuideSection {
  id: string;
  title: string;
  steps: GuideStep[];
}

// ---------------------------------------------------------------------------
// Shared sections (always visible, not role-specific)
// ---------------------------------------------------------------------------

export const gettingStarted: SharedGuideSection = {
  id: 'getting-started',
  title: 'Getting Started',
  steps: [
    { action: 'Register your account with your organisation details and email.' },
    { action: 'Sign in and complete your profile if prompted.' },
    { action: 'Go to your Dashboard to start creating tenders (buyers) or browsing open tenders (vendors).' }
  ]
};

export const whereToGetHelp: SharedGuideSection = {
  id: 'help',
  title: 'Where to Get Help',
  steps: [
    { action: 'Check the FAQ for quick answers to common questions.' },
    { action: 'Go to Support and submit a ticket for bugs or feature requests.' },
    { action: 'Track your support tickets under My Tickets.' }
  ]
};

// ---------------------------------------------------------------------------
// Buyer role section
// ---------------------------------------------------------------------------

export const buyerGuide: GuideRoleSection = {
  role: 'buyer',
  label: 'For Buyers',
  icon: '🏢',
  subsections: [
    {
      id: 'buyer-simple-rfq',
      title: 'Simple RFQ — Step-by-Step',
      summary: 'For quick price comparisons — office supplies, IT gear, small services.',
      steps: [
        { action: 'Click "Start Simple RFQ" from your Dashboard.' },
        { action: 'Enter a title (e.g., "Office Furniture Q1 2026").' },
        { action: 'Add line items: for each item, enter the name, quantity, unit of measure, and optional description.' },
        { action: 'Set the submission deadline — vendors must submit quotes before this date and time.' },
        { action: 'Choose visibility: "Open" for any vendor, or "Limited" to invite specific vendors only.' },
        { action: 'Review your RFQ details and click "Publish".' },
        { action: 'Monitor incoming quotes on the Bids tab of your RFQ.' },
        { action: 'Compare vendor quotes side by side.' },
        { action: 'Click "Award" to select a winning vendor — full or partial award supported.' },
        { action: 'The awarded vendor receives an automatic notification.' }
      ]
    },
    {
      id: 'buyer-detailed-rft',
      title: 'Detailed RFT — Step-by-Step',
      summary: 'For formal, auditable tenders — government procurement, large projects, construction.',
      steps: [
        { action: 'Click "Start Detailed RFT" from your Dashboard.' },
        { action: 'Select the procurement type: Goods, Works, or Services.' },
        { action: 'Enter the estimated value in BDT — the system suggests the correct tender type code (e.g., PG2, PW3).', detail: 'Government organisations see additional codes such as PG1–PG9A, PW1–PW3A, PPS1–PPS6.' },
        { action: 'If applicable, mark any special conditions: Emergency, Single Source, International, or Turnkey.' },
        { action: 'Fill in the 14-segment tender form: basic info, technical specifications, commercial terms, evaluation criteria, and more.' },
        { action: 'Complete the Document Checklist — upload or mark each required document (varies by tender type).' },
        { action: 'Set up the Workflow: assign a Procurer, Approver, and Committee Head from your organisation.' },
        { action: 'Assign Evaluators from the Committee section — each evaluator will score bids independently.' },
        { action: 'Configure visibility and the submission deadline.' },
        { action: 'Click "Publish" — the tender becomes visible to eligible vendors.' },
        { action: 'After the deadline, go to the Evaluation tab.' },
        { action: 'Evaluators score bids (technical and commercial) through their Evaluator Dashboard.' },
        { action: 'Review evaluation results and compare total scores.' },
        { action: 'Create an Award — choose Full Award (one winner) or Partial Award (multiple winners for different items/lots).' },
        { action: 'Confirm the award — winning vendors and all relevant parties are notified automatically.' }
      ]
    },
    {
      id: 'buyer-live-tendering',
      title: 'Live Tendering — Step-by-Step',
      summary: 'For competitive, real-time auction-style bidding sessions.',
      steps: [
        { action: 'Create a tender from the Dashboard (Simple RFQ or Detailed RFT).' },
        { action: 'On the tender page, click "Schedule Live Session".' },
        { action: 'Set the start time and end time for the auction.' },
        { action: 'Choose the bidding type: open (all see each other\'s bids) or sealed.' },
        { action: 'Optionally restrict to specific vendors (limited access).' },
        { action: 'Click "Create Session" — the session appears as "Scheduled".' },
        { action: 'At the scheduled time, click "Start Session" to open bidding.' },
        { action: 'Monitor incoming bids in real-time on the Live Tendering dashboard.' },
        { action: 'The session ends automatically at the scheduled end time, or you can end it early.' },
        { action: 'Review the final bids, compare, and proceed to Award.' }
      ]
    },
    {
      id: 'buyer-managing-vendors',
      title: 'Managing Vendors',
      summary: 'Invite, approve, and manage vendor access to your tenders.',
      steps: [
        { action: 'Go to Vendors from the main navigation.' },
        { action: 'Click "Add Vendor" — enter the vendor organisation\'s details or invite by email.' },
        { action: 'Review pending vendor applications and click "Approve" or "Reject".' },
        { action: 'To restrict a tender to specific vendors: when creating or editing a tender, set visibility to "Limited" and select vendors from your approved list.' },
        { action: 'View all your approved, pending, and blocked vendors from the Vendors page.' }
      ]
    },
    {
      id: 'buyer-evaluation-award',
      title: 'Evaluation & Award',
      summary: 'Score bids and award winning vendors after the submission deadline.',
      steps: [
        { action: 'Open your tender and go to the Committee or Workflow section.' },
        { action: 'Assign evaluators — each one gets access to score bids independently.' },
        { action: 'Evaluators sign in and go to the Evaluator Dashboard to score each bid (technical and commercial criteria).' },
        { action: 'Once all evaluators have submitted scores, go to the Evaluation tab.' },
        { action: 'Compare aggregate scores across all bids.' },
        { action: 'Click "Create Award" — choose Full Award (one winner) or Partial Award (multiple winners for different items/lots).' },
        { action: 'Add any award notes or conditions.' },
        { action: 'Confirm the award — winning vendors and all relevant parties are notified automatically.' }
      ]
    }
  ]
};

// ---------------------------------------------------------------------------
// Vendor role section
// ---------------------------------------------------------------------------

export const vendorGuide: GuideRoleSection = {
  role: 'vendor',
  label: 'For Vendors / Sellers',
  icon: '🏪',
  subsections: [
    {
      id: 'vendor-simple-rfq',
      title: 'Responding to a Simple RFQ — Step-by-Step',
      summary: 'Submit price quotes for goods or services requested by a buyer.',
      steps: [
        { action: 'Go to Tenders from the main navigation.' },
        { action: 'Filter or browse for open tenders you have access to.' },
        { action: 'Click on a Simple RFQ to view the items and requirements.' },
        { action: 'Click "Submit Bid" to open the bid form.' },
        { action: 'For each line item, enter your unit price and any notes.' },
        { action: 'Upload any supporting documents if required.' },
        { action: 'Review your bid and click "Submit" — make sure it is before the deadline.' },
        { action: 'Track your bid status from My Dashboard or the tender page.' },
        { action: 'You will receive a notification if you are awarded.' }
      ]
    },
    {
      id: 'vendor-detailed-rft',
      title: 'Responding to a Detailed RFT — Step-by-Step',
      summary: 'Prepare and submit a formal bid for an auditable government or large-scale tender.',
      steps: [
        { action: 'Go to Tenders from the main navigation.' },
        { action: 'Open a published Detailed RFT to view the full tender documents.' },
        { action: 'Download the document checklist to understand what documents are required.' },
        { action: 'Prepare your technical response — approach, methodology, team, and timeline.' },
        { action: 'Prepare your commercial/financial response — pricing breakdown and totals.' },
        { action: 'Upload all required documents through the bid submission page.' },
        { action: 'Fill in pricing per item/lot as requested.' },
        { action: 'Review everything and click "Submit Bid" before the deadline.' },
        { action: 'Track your submission status from the tender page or My Dashboard.' },
        { action: 'After evaluation, you will be notified of the result. If awarded, view award details on the tender page.' }
      ]
    },
    {
      id: 'vendor-live-tendering',
      title: 'Participating in Live Tendering — Step-by-Step',
      summary: 'Bid in real-time during a scheduled auction session.',
      steps: [
        { action: 'Go to Tenders and find a tender with an upcoming Live Session.' },
        { action: 'Note the scheduled start time — you must be online at that time.' },
        { action: 'At the scheduled time, open the tender page and click "Join Live Session".' },
        { action: 'Wait for the buyer to start the session (status changes from "Scheduled" to "Active").' },
        { action: 'Once active, enter your bid amount and click "Place Bid".' },
        { action: 'Monitor the session — depending on the bidding type, you may see competing bids.' },
        { action: 'You can update your bid during the session (submit a better price).' },
        { action: 'The session ends automatically at the scheduled end time.' },
        { action: 'After the session, review results. The buyer will proceed to evaluation and award.' },
        { action: 'You will receive a notification if you are awarded.' }
      ]
    },
    {
      id: 'vendor-tracking-bids',
      title: 'Tracking Your Bids',
      summary: 'Monitor the status of all your submitted bids in one place.',
      steps: [
        { action: 'Go to My Dashboard after signing in.' },
        { action: 'View the My Bids section to see all tenders you have bid on.' },
        { action: 'Each bid shows its current status: submitted, under evaluation, awarded, or not awarded.' },
        { action: 'Click any bid to open the tender detail page for more information.' },
        { action: 'Check Notifications (bell icon) for real-time updates about your bids.' },
        { action: 'If awarded, the tender page shows award details including any conditions or next steps.' }
      ]
    }
  ]
};
