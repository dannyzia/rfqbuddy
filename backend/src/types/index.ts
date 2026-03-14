// Shared TypeScript interfaces used across controllers, services, and routes

import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import type * as schema from '../schema';

// ── Table Model Types ──────────────────────────────────────────

export type Profile = InferSelectModel<typeof schema.profiles>;
export type NewProfile = InferInsertModel<typeof schema.profiles>;

export type Organization = InferSelectModel<typeof schema.organizations>;
export type NewOrganization = InferInsertModel<typeof schema.organizations>;

export type Tender = InferSelectModel<typeof schema.tenders>;
export type NewTender = InferInsertModel<typeof schema.tenders>;

export type TenderItem = InferSelectModel<typeof schema.tenderItems>;
export type NewTenderItem = InferInsertModel<typeof schema.tenderItems>;

export type Bid = InferSelectModel<typeof schema.bids>;
export type NewBid = InferInsertModel<typeof schema.bids>;

export type BidItem = InferSelectModel<typeof schema.bidItems>;
export type NewBidItem = InferInsertModel<typeof schema.bidItems>;

export type Contract = InferSelectModel<typeof schema.contracts>;
export type NewContract = InferInsertModel<typeof schema.contracts>;

export type ContractMilestone = InferSelectModel<typeof schema.contractMilestones>;
export type ContractVariation = InferSelectModel<typeof schema.contractVariations>;
export type PaymentCertificate = InferSelectModel<typeof schema.paymentCertificates>;

export type EvaluationCriterion = InferSelectModel<typeof schema.evaluationCriteria>;
export type EvaluationScore = InferSelectModel<typeof schema.evaluationScores>;
export type EvaluationResult = InferSelectModel<typeof schema.evaluationResults>;

export type Notification = InferSelectModel<typeof schema.notifications>;
export type NewNotification = InferInsertModel<typeof schema.notifications>;

export type ActivityLog = InferSelectModel<typeof schema.activityLogs>;
export type SupportTicket = InferSelectModel<typeof schema.supportTickets>;
export type TicketMessage = InferSelectModel<typeof schema.ticketMessages>;

export type CatalogueCategory = InferSelectModel<typeof schema.catalogueCategories>;
export type CatalogueItem = InferSelectModel<typeof schema.catalogueItems>;

export type VendorProfile = InferSelectModel<typeof schema.vendorProfiles>;
export type VendorEnlistment = InferSelectModel<typeof schema.vendorEnlistments>;
export type VendorPerformanceReview = InferSelectModel<typeof schema.vendorPerformanceReviews>;

export type EmailTemplate = InferSelectModel<typeof schema.emailTemplates>;
export type PlatformSetting = InferSelectModel<typeof schema.platformSettings>;

// ── Role Types ─────────────────────────────────────────────────

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

export const EVALUATOR_ROLES: Role[] = [
  'prequal_evaluator', 'tech_evaluator', 'commercial_evaluator', 'auditor',
];

// ── Request User (attached by requireAuth middleware) ──────────

export interface RequestUser {
  id: string;
  full_name: string;
  email: string;
  role: Role;
  org_id: string | null;
  status: string;
  is_active: boolean;
}

// ── Fastify Type Extensions ────────────────────────────────────

declare module 'fastify' {
  interface FastifyRequest {
    user: RequestUser;
  }
}

// ── API Response Types ─────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

export interface ApiSuccess {
  success: true;
  message?: string;
}

// ── Calendar Event ─────────────────────────────────────────────

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date | string;
  type: 'deadline' | 'opening' | 'milestone' | 'contract_end';
}

// ── Evaluation Stage Map ───────────────────────────────────────

export const EVAL_STAGE_ORDER = [
  'pending_prequal',
  'pending_tech_eval',
  'pending_commercial_eval',
  'pending_audit',
  'pending_approval',
] as const;

export const EVAL_ROLE_MAP: Record<string, Role> = {
  pending_prequal: 'prequal_evaluator',
  pending_tech_eval: 'tech_evaluator',
  pending_commercial_eval: 'commercial_evaluator',
  pending_audit: 'auditor',
  pending_approval: 'procurement_head',
};
