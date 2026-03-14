import { db } from '../config/database';
import { contracts, contractMilestones, contractVariations, paymentCertificates, tenders, bids } from '../schema';
import { eq, desc } from 'drizzle-orm';
import { auditService } from './audit.service';
import type { RequestUser, NewContract } from '../types';

export const contractService = {
  async list(orgId: string) {
    return db.select().from(contracts)
      .where(eq(contracts.buyer_org_id, orgId))
      .orderBy(desc(contracts.created_at));
  },

  async getById(id: string) {
    const [contract] = await db.select().from(contracts)
      .where(eq(contracts.id, id)).limit(1);
    return contract ?? null;
  },

  async generate(tenderId: string, bidId: string, user: RequestUser) {
    const [tender] = await db.select().from(tenders).where(eq(tenders.id, tenderId)).limit(1);
    const [bid] = await db.select().from(bids).where(eq(bids.id, bidId)).limit(1);

    if (!tender || !bid) throw new Error('Tender or bid not found');

    const year = new Date().getFullYear();
    const [contract] = await db.insert(contracts).values({
      contract_number: `C-${year}-${Date.now().toString(36).toUpperCase()}`,
      tender_id: tenderId,
      vendor_org_id: bid.vendor_org_id,
      bid_id: bidId,
      buyer_org_id: tender.buyer_org_id,
      title: `Contract for ${tender.title}`,
      contract_value: bid.total_amount ?? '0',
      currency: bid.currency,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }).returning();

    // Update bid status
    await db.update(bids).set({ status: 'awarded', updated_at: new Date() }).where(eq(bids.id, bidId));

    // Update tender status
    await db.update(tenders).set({ status: 'awarded', updated_at: new Date() }).where(eq(tenders.id, tenderId));

    await auditService.log(
      user.id, user.org_id, 'CREATE_CONTRACT', 'contract', contract.id,
      `Generated contract ${contract.contract_number} for tender ${tender.tender_number}`,
    );

    return contract;
  },

  async update(id: string, data: Partial<typeof contracts.$inferInsert>, user: RequestUser) {
    const [updated] = await db.update(contracts)
      .set({ ...data, updated_at: new Date() })
      .where(eq(contracts.id, id))
      .returning();
    return updated;
  },

  // Milestones
  async getMilestones(contractId: string) {
    return db.select().from(contractMilestones)
      .where(eq(contractMilestones.contract_id, contractId))
      .orderBy(contractMilestones.due_date);
  },

  async createMilestone(contractId: string, data: {
    title: string; description?: string; due_date: string; amount?: string;
  }) {
    const [milestone] = await db.insert(contractMilestones).values({
      contract_id: contractId,
      title: data.title,
      description: data.description ?? null,
      due_date: data.due_date,
      amount: data.amount ?? null,
    }).returning();
    return milestone;
  },

  async updateMilestoneStatus(milestoneId: string, status: string) {
    const [updated] = await db.update(contractMilestones).set({
      status: status as any,
      completed_at: status === 'completed' ? new Date() : null,
    }).where(eq(contractMilestones.id, milestoneId)).returning();
    return updated;
  },

  // Variations
  async submitVariation(contractId: string, data: {
    reason: string; amount_change?: string; time_extension_days?: number;
  }, user: RequestUser) {
    const [variation] = await db.insert(contractVariations).values({
      contract_id: contractId,
      variation_number: `VAR-${Date.now().toString(36).toUpperCase()}`,
      reason: data.reason,
      amount_change: data.amount_change ?? null,
      time_extension_days: data.time_extension_days ?? null,
      requested_by: user.id,
    }).returning();
    return variation;
  },

  async approveVariation(variationId: string, approved: boolean, user: RequestUser) {
    const [updated] = await db.update(contractVariations).set({
      status: approved ? 'approved' : 'rejected',
      approved_by: user.id,
    }).where(eq(contractVariations.id, variationId)).returning();
    return updated;
  },

  // Payment certificates
  async submitPayment(contractId: string, data: {
    amount: string; milestone_id?: string;
  }, user: RequestUser) {
    const [payment] = await db.insert(paymentCertificates).values({
      contract_id: contractId,
      certificate_no: `PAY-${Date.now().toString(36).toUpperCase()}`,
      milestone_id: data.milestone_id ?? null,
      amount: data.amount,
      submitted_by: user.id,
    }).returning();
    return payment;
  },
};
