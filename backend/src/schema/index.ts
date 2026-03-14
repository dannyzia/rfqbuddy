// Drizzle ORM schema definitions — all 40+ tables
// Maps 1:1 to the SQL in /src/docs/coding-plan/04-database-schema.md

import {
  pgTable, text, uuid, boolean, timestamp, numeric, integer, jsonb,
  uniqueIndex, index, bigint, inet, date, pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ═══════════════════════════════════════════════════════════════
// ENUMS
// ═══════════════════════════════════════════════════════════════

export const roleEnum = pgEnum('role_type', [
  'pe_admin', 'procurer', 'procurement_head',
  'prequal_evaluator', 'tech_evaluator', 'commercial_evaluator',
  'auditor', 'vendor_admin', 'sales_executive', 'sales_manager',
  'super_admin',
]);

export const profileStatusEnum = pgEnum('profile_status', [
  'pending', 'approved', 'rejected', 'suspended',
]);

export const orgTypeEnum = pgEnum('org_type', [
  'procuring_entity', 'vendor',
]);

export const orgStatusEnum = pgEnum('org_status', [
  'pending', 'approved', 'rejected', 'suspended',
]);

export const subscriptionTierEnum = pgEnum('subscription_tier', [
  'free', 'starter', 'professional', 'enterprise',
]);

export const tenderTypeEnum = pgEnum('tender_type', [
  'nrq1_simple', 'nrq2_detailed', 'nrq3_custom', 'rfp',
  'framework_agreement', 'catalogue_order',
]);

export const tenderStatusEnum = pgEnum('tender_status', [
  'draft', 'published', 'open', 'under_evaluation',
  'pending_prequal', 'pending_tech_eval', 'pending_commercial_eval',
  'pending_audit', 'pending_approval',
  'awarded', 'closed', 'cancelled', 'withheld',
]);

export const evalMethodEnum = pgEnum('eval_method', [
  'lowest_price', 'qcbs', 'technical_only', 'custom_weighted',
]);

export const bidStatusEnum = pgEnum('bid_status', [
  'draft', 'submitted', 'under_review', 'shortlisted',
  'technically_qualified', 'technically_disqualified',
  'commercially_evaluated', 'awarded', 'rejected', 'withdrawn',
]);

export const contractStatusEnum = pgEnum('contract_status', [
  'draft', 'pending_signature', 'active', 'completed',
  'terminated', 'suspended', 'expired',
]);

export const milestoneStatusEnum = pgEnum('milestone_status', [
  'pending', 'in_progress', 'completed', 'delayed', 'cancelled',
]);

export const variationStatusEnum = pgEnum('variation_status', [
  'pending', 'approved', 'rejected',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending', 'approved', 'paid', 'rejected',
]);

export const enlistmentStatusEnum = pgEnum('enlistment_status', [
  'pending', 'under_review', 'approved', 'rejected', 'expired',
]);

export const ticketTypeEnum = pgEnum('ticket_type', [
  'bug', 'feature', 'general',
]);

export const ticketPriorityEnum = pgEnum('ticket_priority', [
  'low', 'medium', 'high', 'critical',
]);

export const ticketStatusEnum = pgEnum('ticket_status', [
  'open', 'in_progress', 'resolved', 'closed',
]);

export const notificationChannelEnum = pgEnum('notification_channel', [
  'in_app', 'email', 'both',
]);

export const riskLevelEnum = pgEnum('risk_level', [
  'low', 'medium', 'high', 'critical',
]);

export const kycStatusEnum = pgEnum('kyc_status', [
  'pending', 'verified', 'failed', 'expired',
]);

export const evalStageEnum = pgEnum('eval_stage', [
  'prequalification', 'technical', 'commercial',
]);

export const documentTypeEnum = pgEnum('document_type', [
  'general', 'specification', 'terms', 'drawing', 'sample', 'addendum',
]);

export const bidDocumentTypeEnum = pgEnum('bid_document_type', [
  'technical_proposal', 'commercial_proposal', 'certificate',
  'company_profile', 'experience', 'financial_statement', 'general',
]);

export const catalogueOrderStatusEnum = pgEnum('catalogue_order_status', [
  'draft', 'submitted', 'approved', 'processing', 'shipped', 'delivered', 'cancelled',
]);

// ═══════════════════════════════════════════════════════════════
// PHASE 2: Authentication & RBAC
// ═══════════════════════════════════════════════════════════════

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  full_name: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  avatar_url: text('avatar_url'),
  role: roleEnum('role').notNull(),
  org_id: uuid('org_id').references(() => organizations.id),
  status: profileStatusEnum('status').notNull().default('pending'),
  is_active: boolean('is_active').notNull().default(true),
  last_login_at: timestamp('last_login_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ═══════════════════════════════════════════════════════════════
// PHASE 3: Multi-Tenant Organisation Model
// ═══════════════════════════════════════════════════════════════

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  type: orgTypeEnum('type').notNull(),
  registration_no: text('registration_no'),
  tax_id: text('tax_id'),
  address: jsonb('address'),
  contact_email: text('contact_email'),
  contact_phone: text('contact_phone'),
  website: text('website'),
  logo_url: text('logo_url'),
  is_active: boolean('is_active').notNull().default(true),
  status: orgStatusEnum('status').notNull().default('pending'),
  subscription_tier: subscriptionTierEnum('subscription_tier').default('free'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const orgMembers = pgTable('org_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  org_id: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  user_id: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  invited_by: uuid('invited_by').references(() => profiles.id),
  joined_at: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('org_members_unique').on(table.org_id, table.user_id),
]);

export const vendorProfiles = pgTable('vendor_profiles', {
  org_id: uuid('org_id').primaryKey().references(() => organizations.id, { onDelete: 'cascade' }),
  business_type: text('business_type'),
  year_established: integer('year_established'),
  employee_count: text('employee_count'),
  annual_revenue: text('annual_revenue'),
  categories: text('categories').array(),
  certifications: jsonb('certifications'),
  bank_details: jsonb('bank_details'),
  insurance_details: jsonb('insurance_details'),
  srm_score: numeric('srm_score', { precision: 3, scale: 1 }).default('0.0'),
  risk_level: riskLevelEnum('risk_level').default('medium'),
  kyc_status: kycStatusEnum('kyc_status').default('pending'),
  kyc_verified_at: timestamp('kyc_verified_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ═══════════════════════════════════════════════════════════════
// PHASE 4: Tender/RFQ Lifecycle
// ═══════════════════════════════════════════════════════════════

export const tenders = pgTable('tenders', {
  id: uuid('id').primaryKey().defaultRandom(),
  tender_number: text('tender_number').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  tender_type: tenderTypeEnum('tender_type').notNull(),
  status: tenderStatusEnum('status').notNull().default('draft'),
  buyer_org_id: uuid('buyer_org_id').notNull().references(() => organizations.id),
  created_by: uuid('created_by').notNull().references(() => profiles.id),
  currency: text('currency').notNull().default('BDT'),
  estimated_value: numeric('estimated_value', { precision: 15, scale: 2 }),
  submission_deadline: timestamp('submission_deadline', { withTimezone: true }).notNull(),
  opening_date: timestamp('opening_date', { withTimezone: true }),
  validity_days: integer('validity_days').default(90),
  eval_method: evalMethodEnum('eval_method').default('lowest_price'),
  tech_weight: numeric('tech_weight', { precision: 5, scale: 2 }).default('70.00'),
  commercial_weight: numeric('commercial_weight', { precision: 5, scale: 2 }).default('30.00'),
  pass_fail_threshold: numeric('pass_fail_threshold', { precision: 5, scale: 2 }).default('70.00'),
  current_stage: text('current_stage'),
  forwarded_to: uuid('forwarded_to').references(() => profiles.id),
  forwarded_at: timestamp('forwarded_at', { withTimezone: true }),
  categories: text('categories').array(),
  tags: text('tags').array(),
  terms_conditions: text('terms_conditions'),
  is_published: boolean('is_published').default(false),
  published_at: timestamp('published_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_tenders_status_org').on(table.status, table.buyer_org_id),
]);

export const tenderItems = pgTable('tender_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  tender_id: uuid('tender_id').notNull().references(() => tenders.id, { onDelete: 'cascade' }),
  item_number: integer('item_number').notNull(),
  description: text('description').notNull(),
  specification: text('specification'),
  unit: text('unit').notNull().default('each'),
  quantity: numeric('quantity', { precision: 12, scale: 3 }).notNull(),
  estimated_price: numeric('estimated_price', { precision: 15, scale: 2 }),
  category: text('category'),
  is_mandatory: boolean('is_mandatory').default(true),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('tender_items_unique').on(table.tender_id, table.item_number),
]);

export const tenderAssignments = pgTable('tender_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  tender_id: uuid('tender_id').notNull().references(() => tenders.id, { onDelete: 'cascade' }),
  user_id: uuid('user_id').notNull().references(() => profiles.id),
  role: text('role').notNull(),
  assigned_by: uuid('assigned_by').references(() => profiles.id),
  assigned_at: timestamp('assigned_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('tender_assignments_unique').on(table.tender_id, table.user_id, table.role),
]);

export const tenderInvitations = pgTable('tender_invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tender_id: uuid('tender_id').notNull().references(() => tenders.id, { onDelete: 'cascade' }),
  vendor_org_id: uuid('vendor_org_id').notNull().references(() => organizations.id),
  invited_by: uuid('invited_by').references(() => profiles.id),
  invitation_sent: boolean('invitation_sent').default(false),
  sent_at: timestamp('sent_at', { withTimezone: true }),
  viewed_at: timestamp('viewed_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('tender_invitations_unique').on(table.tender_id, table.vendor_org_id),
]);

export const tenderDocuments = pgTable('tender_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  tender_id: uuid('tender_id').notNull().references(() => tenders.id, { onDelete: 'cascade' }),
  file_name: text('file_name').notNull(),
  file_type: text('file_type'),
  file_size: bigint('file_size', { mode: 'number' }),
  storage_path: text('storage_path').notNull(),
  uploaded_by: uuid('uploaded_by').references(() => profiles.id),
  document_type: documentTypeEnum('document_type').default('general'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ═══════════════════════════════════════════════════════════════
// PHASE 5: Bid Submission & Management
// ═══════════════════════════════════════════════════════════════

export const bids = pgTable('bids', {
  id: uuid('id').primaryKey().defaultRandom(),
  bid_number: text('bid_number').notNull().unique(),
  tender_id: uuid('tender_id').notNull().references(() => tenders.id, { onDelete: 'cascade' }),
  vendor_org_id: uuid('vendor_org_id').notNull().references(() => organizations.id),
  submitted_by: uuid('submitted_by').notNull().references(() => profiles.id),
  status: bidStatusEnum('status').notNull().default('draft'),
  total_amount: numeric('total_amount', { precision: 15, scale: 2 }),
  currency: text('currency').notNull().default('BDT'),
  validity_days: integer('validity_days').default(90),
  technical_notes: text('technical_notes'),
  compliance_declaration: boolean('compliance_declaration').default(false),
  submitted_at: timestamp('submitted_at', { withTimezone: true }),
  withdrawn_at: timestamp('withdrawn_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('bids_tender_vendor_unique').on(table.tender_id, table.vendor_org_id),
  index('idx_bids_tender').on(table.tender_id, table.vendor_org_id),
]);

export const bidItems = pgTable('bid_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  bid_id: uuid('bid_id').notNull().references(() => bids.id, { onDelete: 'cascade' }),
  tender_item_id: uuid('tender_item_id').notNull().references(() => tenderItems.id),
  unit_price: numeric('unit_price', { precision: 15, scale: 2 }).notNull(),
  quantity: numeric('quantity', { precision: 12, scale: 3 }).notNull(),
  brand: text('brand'),
  model: text('model'),
  origin_country: text('origin_country'),
  delivery_days: integer('delivery_days'),
  notes: text('notes'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const bidDocuments = pgTable('bid_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  bid_id: uuid('bid_id').notNull().references(() => bids.id, { onDelete: 'cascade' }),
  file_name: text('file_name').notNull(),
  file_type: text('file_type'),
  file_size: bigint('file_size', { mode: 'number' }),
  storage_path: text('storage_path').notNull(),
  document_type: bidDocumentTypeEnum('document_type').default('general'),
  uploaded_by: uuid('uploaded_by').references(() => profiles.id),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ═══════════════════════════════════════════════════════════════
// PHASE 6: Evaluation Workflow
// ═══════════════════════════════════════════════════════════════

export const evaluationCriteria = pgTable('evaluation_criteria', {
  id: uuid('id').primaryKey().defaultRandom(),
  tender_id: uuid('tender_id').notNull().references(() => tenders.id, { onDelete: 'cascade' }),
  stage: evalStageEnum('stage').notNull(),
  criterion_name: text('criterion_name').notNull(),
  max_score: numeric('max_score', { precision: 5, scale: 2 }).notNull(),
  weight: numeric('weight', { precision: 5, scale: 2 }).default('1.0'),
  description: text('description'),
  is_pass_fail: boolean('is_pass_fail').default(false),
  sort_order: integer('sort_order').default(0),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const evaluationScores = pgTable('evaluation_scores', {
  id: uuid('id').primaryKey().defaultRandom(),
  tender_id: uuid('tender_id').notNull().references(() => tenders.id),
  bid_id: uuid('bid_id').notNull().references(() => bids.id),
  criterion_id: uuid('criterion_id').notNull().references(() => evaluationCriteria.id),
  evaluator_id: uuid('evaluator_id').notNull().references(() => profiles.id),
  score: numeric('score', { precision: 5, scale: 2 }),
  remarks: text('remarks'),
  scored_at: timestamp('scored_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('eval_scores_unique').on(table.bid_id, table.criterion_id, table.evaluator_id),
]);

export const evaluationResults = pgTable('evaluation_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  tender_id: uuid('tender_id').notNull().references(() => tenders.id),
  bid_id: uuid('bid_id').notNull().references(() => bids.id),
  stage: text('stage').notNull(),
  total_score: numeric('total_score', { precision: 6, scale: 2 }),
  max_possible: numeric('max_possible', { precision: 6, scale: 2 }),
  percentage: numeric('percentage', { precision: 5, scale: 2 }),
  passed: boolean('passed'),
  evaluated_by: uuid('evaluated_by').references(() => profiles.id),
  remarks: text('remarks'),
  evaluated_at: timestamp('evaluated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('eval_results_unique').on(table.tender_id, table.bid_id, table.stage),
]);

export const workflowTransitions = pgTable('workflow_transitions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tender_id: uuid('tender_id').notNull().references(() => tenders.id),
  from_stage: text('from_stage').notNull(),
  to_stage: text('to_stage').notNull(),
  from_user: uuid('from_user').notNull().references(() => profiles.id),
  to_user: uuid('to_user').references(() => profiles.id),
  notes: text('notes'),
  transitioned_at: timestamp('transitioned_at', { withTimezone: true }).notNull().defaultNow(),
});

// ═══════════════════════════════════════════════════════════════
// PHASE 7: Award & Contract Management
// ═══════════════════════════════════════════════════════════════

export const contracts = pgTable('contracts', {
  id: uuid('id').primaryKey().defaultRandom(),
  contract_number: text('contract_number').notNull().unique(),
  tender_id: uuid('tender_id').notNull().references(() => tenders.id),
  vendor_org_id: uuid('vendor_org_id').notNull().references(() => organizations.id),
  bid_id: uuid('bid_id').references(() => bids.id),
  buyer_org_id: uuid('buyer_org_id').notNull().references(() => organizations.id),
  title: text('title').notNull(),
  status: contractStatusEnum('status').notNull().default('draft'),
  contract_value: numeric('contract_value', { precision: 15, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('BDT'),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  performance_score: numeric('performance_score', { precision: 3, scale: 1 }).default('0.0'),
  signed_at: timestamp('signed_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const contractMilestones = pgTable('contract_milestones', {
  id: uuid('id').primaryKey().defaultRandom(),
  contract_id: uuid('contract_id').notNull().references(() => contracts.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  due_date: date('due_date').notNull(),
  amount: numeric('amount', { precision: 15, scale: 2 }),
  status: milestoneStatusEnum('status').notNull().default('pending'),
  completed_at: timestamp('completed_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const contractVariations = pgTable('contract_variations', {
  id: uuid('id').primaryKey().defaultRandom(),
  contract_id: uuid('contract_id').notNull().references(() => contracts.id, { onDelete: 'cascade' }),
  variation_number: text('variation_number').notNull(),
  reason: text('reason').notNull(),
  amount_change: numeric('amount_change', { precision: 15, scale: 2 }),
  time_extension_days: integer('time_extension_days'),
  status: variationStatusEnum('status').notNull().default('pending'),
  requested_by: uuid('requested_by').references(() => profiles.id),
  approved_by: uuid('approved_by').references(() => profiles.id),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const paymentCertificates = pgTable('payment_certificates', {
  id: uuid('id').primaryKey().defaultRandom(),
  contract_id: uuid('contract_id').notNull().references(() => contracts.id, { onDelete: 'cascade' }),
  certificate_no: text('certificate_no').notNull(),
  milestone_id: uuid('milestone_id').references(() => contractMilestones.id),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  status: paymentStatusEnum('status').notNull().default('pending'),
  submitted_by: uuid('submitted_by').references(() => profiles.id),
  approved_by: uuid('approved_by').references(() => profiles.id),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ═══════════════════════════════════════════════════════════════
// PHASE 8: Vendor Management & SRM
// ═══════════════════════════════════════════════════════════════

export const vendorEnlistments = pgTable('vendor_enlistments', {
  id: uuid('id').primaryKey().defaultRandom(),
  vendor_org_id: uuid('vendor_org_id').notNull().references(() => organizations.id),
  buyer_org_id: uuid('buyer_org_id').notNull().references(() => organizations.id),
  form_id: uuid('form_id'),
  status: enlistmentStatusEnum('status').notNull().default('pending'),
  submitted_data: jsonb('submitted_data'),
  reviewed_by: uuid('reviewed_by').references(() => profiles.id),
  reviewed_at: timestamp('reviewed_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('vendor_enlistments_unique').on(table.vendor_org_id, table.buyer_org_id),
]);

export const vendorPerformanceReviews = pgTable('vendor_performance_reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  vendor_org_id: uuid('vendor_org_id').notNull().references(() => organizations.id),
  buyer_org_id: uuid('buyer_org_id').notNull().references(() => organizations.id),
  contract_id: uuid('contract_id').references(() => contracts.id),
  quality_score: numeric('quality_score', { precision: 3, scale: 1 }),
  delivery_score: numeric('delivery_score', { precision: 3, scale: 1 }),
  communication_score: numeric('communication_score', { precision: 3, scale: 1 }),
  overall_score: numeric('overall_score', { precision: 3, scale: 1 }),
  comments: text('comments'),
  reviewed_by: uuid('reviewed_by').references(() => profiles.id),
  review_period: text('review_period'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const vendorCategoriesMap = pgTable('vendor_categories_map', {
  vendor_org_id: uuid('vendor_org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  category_id: uuid('category_id').notNull().references(() => catalogueCategories.id),
}, (table) => [
  // Composite primary key
  uniqueIndex('vendor_categories_pk').on(table.vendor_org_id, table.category_id),
]);

// ═══════════════════════════════════════════════════════════════
// PHASE 9: Notifications
// ═══════════════════════════════════════════════════════════════

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  recipient_id: uuid('recipient_id').notNull().references(() => profiles.id),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message'),
  payload: jsonb('payload'),
  channel: notificationChannelEnum('channel').notNull().default('in_app'),
  is_read: boolean('is_read').notNull().default(false),
  read_at: timestamp('read_at', { withTimezone: true }),
  email_sent: boolean('email_sent').default(false),
  email_sent_at: timestamp('email_sent_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_notifications_recipient').on(table.recipient_id, table.is_read),
]);

export const emailTemplates = pgTable('email_templates', {
  key: text('key').primaryKey(),
  subject: text('subject').notNull(),
  html_body: text('html_body').notNull(),
  variables: text('variables').array(),
  description: text('description'),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  updated_by: uuid('updated_by').references(() => profiles.id),
});

// ═══════════════════════════════════════════════════════════════
// PHASE 10: File Storage (metadata — files in R2)
// ═══════════════════════════════════════════════════════════════

export const fileAttachments = pgTable('file_attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  entity_type: text('entity_type').notNull(),
  entity_id: uuid('entity_id').notNull(),
  file_name: text('file_name').notNull(),
  file_type: text('file_type'),
  file_size: bigint('file_size', { mode: 'number' }),
  storage_path: text('storage_path').notNull(),
  uploaded_by: uuid('uploaded_by').references(() => profiles.id),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_file_attachments_entity').on(table.entity_type, table.entity_id),
]);

// ═══════════════════════════════════════════════════════════════
// PHASE 11: Activity Logs & Audit Trail
// ═══════════════════════════════════════════════════════════════

export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => profiles.id),
  org_id: uuid('org_id').references(() => organizations.id),
  action: text('action').notNull(),
  entity_type: text('entity_type').notNull(),
  entity_id: uuid('entity_id'),
  description: text('description'),
  metadata: jsonb('metadata'),
  ip_address: inet('ip_address'),
  user_agent: text('user_agent'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_activity_user').on(table.user_id, table.created_at),
  index('idx_activity_org').on(table.org_id, table.created_at),
  index('idx_activity_entity').on(table.entity_type, table.entity_id),
]);

export const adminAuditLog = pgTable('admin_audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  admin_id: uuid('admin_id').notNull().references(() => profiles.id),
  action: text('action').notNull(),
  target_type: text('target_type').notNull(),
  target_id: text('target_id'),
  payload: jsonb('payload'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_audit_admin').on(table.admin_id, table.created_at),
  index('idx_audit_target').on(table.target_type, table.target_id),
]);

// ═══════════════════════════════════════════════════════════════
// PHASE 12: Support Ticketing
// ═══════════════════════════════════════════════════════════════

export const supportTickets = pgTable('support_tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  ticket_number: text('ticket_number').notNull().unique(),
  subject: text('subject').notNull(),
  description: text('description').notNull(),
  type: ticketTypeEnum('type').notNull(),
  priority: ticketPriorityEnum('priority').notNull().default('medium'),
  status: ticketStatusEnum('status').notNull().default('open'),
  category: text('category'),
  submitted_by: uuid('submitted_by').notNull().references(() => profiles.id),
  assigned_to: uuid('assigned_to').references(() => profiles.id),
  org_id: uuid('org_id').references(() => organizations.id),
  resolved_at: timestamp('resolved_at', { withTimezone: true }),
  closed_at: timestamp('closed_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const ticketMessages = pgTable('ticket_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  ticket_id: uuid('ticket_id').notNull().references(() => supportTickets.id, { onDelete: 'cascade' }),
  sender_id: uuid('sender_id').notNull().references(() => profiles.id),
  message: text('message').notNull(),
  is_internal: boolean('is_internal').default(false),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ═══════════════════════════════════════════════════════════════
// PHASE 13: Catalogue & Guided Buying
// ═══════════════════════════════════════════════════════════════

export const catalogueCategories = pgTable('catalogue_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  parent_id: uuid('parent_id').references((): any => catalogueCategories.id),
  description: text('description'),
  icon: text('icon'),
  sort_order: integer('sort_order').default(0),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const catalogueItems = pgTable('catalogue_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  vendor_org_id: uuid('vendor_org_id').notNull().references(() => organizations.id),
  category_id: uuid('category_id').references(() => catalogueCategories.id),
  name: text('name').notNull(),
  description: text('description'),
  sku: text('sku'),
  unit: text('unit').notNull().default('each'),
  unit_price: numeric('unit_price', { precision: 15, scale: 2 }).notNull(),
  currency: text('currency').default('BDT'),
  min_order_qty: numeric('min_order_qty', { precision: 12, scale: 3 }).default('1'),
  lead_time_days: integer('lead_time_days'),
  image_url: text('image_url'),
  specifications: jsonb('specifications'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const catalogueCartItems = pgTable('catalogue_cart_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  item_id: uuid('item_id').notNull().references(() => catalogueItems.id, { onDelete: 'cascade' }),
  quantity: numeric('quantity', { precision: 12, scale: 3 }).notNull().default('1'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('cart_user_item_unique').on(table.user_id, table.item_id),
]);

export const catalogueOrders = pgTable('catalogue_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  order_number: text('order_number').notNull().unique(),
  buyer_id: uuid('buyer_id').notNull().references(() => profiles.id),
  buyer_org_id: uuid('buyer_org_id').references(() => organizations.id),
  status: catalogueOrderStatusEnum('status').notNull().default('submitted'),
  total_amount: numeric('total_amount', { precision: 15, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('BDT'),
  delivery_address: text('delivery_address'),
  notes: text('notes'),
  submitted_at: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
  approved_at: timestamp('approved_at', { withTimezone: true }),
  delivered_at: timestamp('delivered_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const catalogueOrderItems = pgTable('catalogue_order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  order_id: uuid('order_id').notNull().references(() => catalogueOrders.id, { onDelete: 'cascade' }),
  item_id: uuid('item_id').notNull().references(() => catalogueItems.id),
  vendor_org_id: uuid('vendor_org_id').notNull().references(() => organizations.id),
  name: text('name').notNull(),
  sku: text('sku'),
  unit: text('unit').notNull(),
  unit_price: numeric('unit_price', { precision: 15, scale: 2 }).notNull(),
  quantity: numeric('quantity', { precision: 12, scale: 3 }).notNull(),
  total_price: numeric('total_price', { precision: 15, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('BDT'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ═══════════════════════════════════════════════════════════════
// PHASE 16: Platform Settings
// ═══════════════════════════════════════════════════════════════

export const platformSettings = pgTable('platform_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  description: text('description'),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  updated_by: uuid('updated_by').references(() => profiles.id),
});

// ═══════════════════════════════════════════════════════════════
// RELATIONS (for Drizzle relational queries)
// ═══════════════════════════════════════════════════════════════

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  organization: one(organizations, { fields: [profiles.org_id], references: [organizations.id] }),
  bids: many(bids),
  notifications: many(notifications),
}));

export const organizationsRelations = relations(organizations, ({ many, one }) => ({
  members: many(orgMembers),
  tenders: many(tenders),
  vendorProfile: one(vendorProfiles, { fields: [organizations.id], references: [vendorProfiles.org_id] }),
}));

export const tendersRelations = relations(tenders, ({ one, many }) => ({
  buyerOrg: one(organizations, { fields: [tenders.buyer_org_id], references: [organizations.id] }),
  creator: one(profiles, { fields: [tenders.created_by], references: [profiles.id] }),
  items: many(tenderItems),
  invitations: many(tenderInvitations),
  bids: many(bids),
  documents: many(tenderDocuments),
}));

export const bidsRelations = relations(bids, ({ one, many }) => ({
  tender: one(tenders, { fields: [bids.tender_id], references: [tenders.id] }),
  vendorOrg: one(organizations, { fields: [bids.vendor_org_id], references: [organizations.id] }),
  submitter: one(profiles, { fields: [bids.submitted_by], references: [profiles.id] }),
  items: many(bidItems),
  documents: many(bidDocuments),
}));

export const contractsRelations = relations(contracts, ({ one, many }) => ({
  tender: one(tenders, { fields: [contracts.tender_id], references: [tenders.id] }),
  vendorOrg: one(organizations, { fields: [contracts.vendor_org_id], references: [organizations.id] }),
  buyerOrg: one(organizations, { fields: [contracts.buyer_org_id], references: [organizations.id] }),
  milestones: many(contractMilestones),
  variations: many(contractVariations),
  payments: many(paymentCertificates),
}));