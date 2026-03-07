/**
 * FAQ content for the RFQ Buddy docs page.
 * Each item includes a `category` field so the FAQ page can group questions
 * under category headings.
 *
 * Categories: 'general' | 'account' | 'buyers' | 'vendors' | 'support'
 *
 * Edit this file to add or update questions and answers as the app is enriched.
 */

export type FaqCategory = 'general' | 'account' | 'buyers' | 'vendors' | 'support';

export interface FaqItem {
  question: string;
  answer: string;
  category: FaqCategory;
}

export const faqItems: FaqItem[] = [
  // -------------------------------------------------------------------------
  // General
  // -------------------------------------------------------------------------
  {
    category: 'general',
    question: 'What is RFQ Buddy?',
    answer:
      'RFQ Buddy is an online platform for managing Requests for Quotation (RFQ) and formal tenders. It connects buyers with vendors through structured, transparent bidding and supports the full lifecycle from creation to award.'
  },
  {
    category: 'general',
    question: 'Which browsers are supported?',
    answer:
      'Use a modern browser (Chrome, Firefox, Safari, or Edge, recent versions) with JavaScript enabled. For the best experience, keep your browser up to date.'
  },
  {
    category: 'general',
    question: 'Is my data secure?',
    answer:
      'We use authentication, role-based access, and audit logging. Sensitive actions and data access are tracked. Use a strong password and do not share your login. For full details, refer to the platform\'s security and privacy documentation.'
  },

  // -------------------------------------------------------------------------
  // Account
  // -------------------------------------------------------------------------
  {
    category: 'account',
    question: 'How do I create an account?',
    answer:
      'Click "Get Started" or "Register" and enter your organisation details, email, and password. After registration you can sign in and, depending on your organisation type, create tenders (buyers) or respond to them (vendors).'
  },
  {
    category: 'account',
    question: 'What roles are there?',
    answer:
      'Buyers create and manage tenders, invite vendors, and run evaluation and awards. Vendors view open tenders and submit bids. Evaluators are assigned to evaluate bids (technical/commercial). Admins can manage the organisation and access admin features.'
  },

  // -------------------------------------------------------------------------
  // Buyers
  // -------------------------------------------------------------------------
  {
    category: 'buyers',
    question: 'What is a Simple RFQ?',
    answer:
      'Simple RFQ is for when you mainly need prices — e.g. office supplies, IT gear, or small services. You create a short form, vendors submit quotes, and you can compare and award without the full formal tender process.'
  },
  {
    category: 'buyers',
    question: 'What is a Detailed RFT?',
    answer:
      'Detailed RFT (Request for Tender) is for formal, audit-ready tenders — e.g. government procurement, large projects, construction, or infrastructure. It includes full lifecycle management, document checklists, evaluation, and workflow suitable for compliance.'
  },
  {
    category: 'buyers',
    question: 'What is Live Tendering?',
    answer:
      'Live Tendering runs real-time auction-style bidding. You schedule an auction session; vendors place bids during the session, and pricing can update dynamically. Suitable when you want competitive real-time bidding.'
  },
  {
    category: 'buyers',
    question: 'How does evaluation work?',
    answer:
      'Buyers assign evaluators to tenders. Evaluators score bids (e.g. technical and commercial) through the Evaluator Dashboard. The buyer can then compare scores, run evaluations, and proceed to award. Full and partial awards are supported with notifications.'
  },
  {
    category: 'buyers',
    question: 'Can I award only part of a tender?',
    answer:
      'Yes. When creating an award you can choose a Full Award (one winner for everything) or a Partial Award (different winners for individual items or lots). All awarded vendors and losing bidders are notified automatically.'
  },

  // -------------------------------------------------------------------------
  // Vendors
  // -------------------------------------------------------------------------
  {
    category: 'vendors',
    question: 'How do I submit a bid as a vendor?',
    answer:
      'Go to Tenders, open a published tender you have access to, and use the bid submission page. Fill in your pricing and upload any required documents. Submit before the deadline. You can track your submitted bids from your dashboard.'
  },
  {
    category: 'vendors',
    question: 'How do I participate in Live Tendering as a vendor?',
    answer:
      'Find a tender with a scheduled Live Session in the Tenders list. At the scheduled start time, open the tender page and click "Join Live Session". Once the buyer starts the session, place your bids in real-time. The session ends automatically at the scheduled end time.'
  },
  {
    category: 'vendors',
    question: 'How do I track my bids?',
    answer:
      'Go to My Dashboard and check the My Bids section. Each bid shows its current status (submitted, under evaluation, awarded, or not awarded). You will also receive notifications when bid status changes, and award details are visible on the tender page.'
  },

  // -------------------------------------------------------------------------
  // Support
  // -------------------------------------------------------------------------
  {
    category: 'support',
    question: 'How do I get help or report an issue?',
    answer:
      'Use the Support area to submit a ticket: choose Bug Report or Feature Request, add a title and description, and submit. You can track your tickets under My Tickets. For quick answers, check the FAQ and How-to Guide.'
  }
];

/** Ordered list of category labels for display. */
export const faqCategories: { id: FaqCategory; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'account', label: 'Account' },
  { id: 'buyers', label: 'Buyers' },
  { id: 'vendors', label: 'Vendors' },
  { id: 'support', label: 'Support' }
];
