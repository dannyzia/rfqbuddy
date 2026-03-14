import { db } from '../config/database';
import { vendorProfiles, organizations } from '../schema';
import { eq, desc, sql, and } from 'drizzle-orm';

export const complianceService = {
  async listKycChecks(params?: { page?: number; pageSize?: number; status?: string }) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;

    let query = db.select({
      org_id: vendorProfiles.org_id,
      org_name: organizations.name,
      kyc_status: vendorProfiles.kyc_status,
      kyc_verified_at: vendorProfiles.kyc_verified_at,
      risk_level: vendorProfiles.risk_level,
      updated_at: vendorProfiles.updated_at,
    })
      .from(vendorProfiles)
      .innerJoin(organizations, eq(vendorProfiles.org_id, organizations.id))
      .orderBy(desc(vendorProfiles.updated_at))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const data = await query;
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(vendorProfiles);

    return { data, total: Number(count), page, pageSize };
  },

  async getKycDetail(orgId: string) {
    const [vendor] = await db.select({
      org_id: vendorProfiles.org_id,
      org_name: organizations.name,
      kyc_status: vendorProfiles.kyc_status,
      kyc_verified_at: vendorProfiles.kyc_verified_at,
      risk_level: vendorProfiles.risk_level,
      business_type: vendorProfiles.business_type,
      year_established: vendorProfiles.year_established,
      certifications: vendorProfiles.certifications,
      updated_at: vendorProfiles.updated_at,
    })
      .from(vendorProfiles)
      .innerJoin(organizations, eq(vendorProfiles.org_id, organizations.id))
      .where(eq(vendorProfiles.org_id, orgId))
      .limit(1);
    return vendor ?? null;
  },

  async updateKycStatus(orgId: string, status: string) {
    const updates: Record<string, any> = {
      kyc_status: status,
      updated_at: new Date(),
    };
    if (status === 'verified') {
      updates.kyc_verified_at = new Date();
    }
    const [updated] = await db.update(vendorProfiles)
      .set(updates)
      .where(eq(vendorProfiles.org_id, orgId))
      .returning();
    return updated;
  },

  async getSanctionsAlerts() {
    // Sanctions alerts would come from a dedicated table; for now query vendors flagged high-risk
    return db.select({
      org_id: vendorProfiles.org_id,
      org_name: organizations.name,
      risk_level: vendorProfiles.risk_level,
      kyc_status: vendorProfiles.kyc_status,
      updated_at: vendorProfiles.updated_at,
    })
      .from(vendorProfiles)
      .innerJoin(organizations, eq(vendorProfiles.org_id, organizations.id))
      .where(eq(vendorProfiles.risk_level, 'critical'))
      .orderBy(desc(vendorProfiles.updated_at));
  },
};
