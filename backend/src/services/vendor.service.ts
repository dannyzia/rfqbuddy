import { db } from '../config/database';
import { organizations, vendorProfiles, vendorEnlistments, vendorPerformanceReviews } from '../schema';
import { eq, and, desc } from 'drizzle-orm';
import type { RequestUser } from '../types';

export const vendorService = {
  async list() {
    return db.select()
      .from(organizations)
      .where(eq(organizations.type, 'vendor'))
      .orderBy(organizations.name);
  },

  async getProfile(orgId: string) {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
    const [vp] = await db.select().from(vendorProfiles).where(eq(vendorProfiles.org_id, orgId)).limit(1);
    return { organization: org, vendorProfile: vp ?? null };
  },

  async submitEnlistment(data: {
    buyer_org_id: string;
    submitted_data: object;
  }, user: RequestUser) {
    const [enlistment] = await db.insert(vendorEnlistments).values({
      vendor_org_id: user.org_id!,
      buyer_org_id: data.buyer_org_id,
      submitted_data: data.submitted_data,
    }).returning();
    return enlistment;
  },

  async reviewEnlistment(enlistmentId: string, approved: boolean, user: RequestUser) {
    const [updated] = await db.update(vendorEnlistments).set({
      status: approved ? 'approved' : 'rejected',
      reviewed_by: user.id,
      reviewed_at: new Date(),
    }).where(eq(vendorEnlistments.id, enlistmentId)).returning();
    return updated;
  },

  async submitReview(data: {
    vendor_org_id: string;
    contract_id?: string;
    quality_score: string;
    delivery_score: string;
    communication_score: string;
    comments?: string;
    review_period?: string;
  }, user: RequestUser) {
    const overall = (
      (Number(data.quality_score) + Number(data.delivery_score) + Number(data.communication_score)) / 3
    ).toFixed(1);

    const [review] = await db.insert(vendorPerformanceReviews).values({
      vendor_org_id: data.vendor_org_id,
      buyer_org_id: user.org_id!,
      contract_id: data.contract_id ?? null,
      quality_score: data.quality_score,
      delivery_score: data.delivery_score,
      communication_score: data.communication_score,
      overall_score: overall,
      comments: data.comments ?? null,
      reviewed_by: user.id,
      review_period: data.review_period ?? null,
    }).returning();

    // Update SRM score on vendor profile (rolling average)
    await this.recalculateSRM(data.vendor_org_id);

    return review;
  },

  async getReviews(vendorOrgId: string) {
    return db.select().from(vendorPerformanceReviews)
      .where(eq(vendorPerformanceReviews.vendor_org_id, vendorOrgId))
      .orderBy(desc(vendorPerformanceReviews.created_at));
  },

  async recalculateSRM(vendorOrgId: string) {
    const reviews = await this.getReviews(vendorOrgId);
    if (reviews.length === 0) return;

    const avg = reviews.reduce((sum, r) => sum + Number(r.overall_score ?? 0), 0) / reviews.length;

    await db.update(vendorProfiles)
      .set({ srm_score: avg.toFixed(1), updated_at: new Date() })
      .where(eq(vendorProfiles.org_id, vendorOrgId));
  },
};
