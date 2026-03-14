import { db } from '../config/database';
import { vendorProfiles, organizations, contracts } from '../schema';
import { eq, desc, sql } from 'drizzle-orm';

export const riskService = {
  async getDashboard() {
    const riskDistribution = await db.select({
      risk_level: vendorProfiles.risk_level,
      count: sql<number>`count(*)`,
    })
      .from(vendorProfiles)
      .groupBy(vendorProfiles.risk_level);

    const [totalVendors] = await db.select({ count: sql<number>`count(*)` }).from(vendorProfiles);

    return {
      total_vendors: Number(totalVendors.count),
      distribution: riskDistribution.map(r => ({
        level: r.risk_level,
        count: Number(r.count),
      })),
    };
  },

  async listAssessments(params?: { page?: number; pageSize?: number }) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;

    const data = await db.select({
      org_id: vendorProfiles.org_id,
      org_name: organizations.name,
      risk_level: vendorProfiles.risk_level,
      kyc_status: vendorProfiles.kyc_status,
      srm_score: vendorProfiles.srm_score,
      updated_at: vendorProfiles.updated_at,
    })
      .from(vendorProfiles)
      .innerJoin(organizations, eq(vendorProfiles.org_id, organizations.id))
      .orderBy(desc(vendorProfiles.updated_at))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(vendorProfiles);
    return { data, total: Number(count), page, pageSize };
  },

  async getVendorRiskProfile(orgId: string) {
    const [vendor] = await db.select({
      org_id: vendorProfiles.org_id,
      org_name: organizations.name,
      risk_level: vendorProfiles.risk_level,
      kyc_status: vendorProfiles.kyc_status,
      srm_score: vendorProfiles.srm_score,
      business_type: vendorProfiles.business_type,
      year_established: vendorProfiles.year_established,
      certifications: vendorProfiles.certifications,
    })
      .from(vendorProfiles)
      .innerJoin(organizations, eq(vendorProfiles.org_id, organizations.id))
      .where(eq(vendorProfiles.org_id, orgId))
      .limit(1);

    if (!vendor) return null;

    const vendorContracts = await db.select({
      id: contracts.id,
      title: contracts.title,
      status: contracts.status,
      contract_value: contracts.contract_value,
      performance_score: contracts.performance_score,
    })
      .from(contracts)
      .where(eq(contracts.vendor_org_id, orgId))
      .orderBy(desc(contracts.created_at))
      .limit(10);

    return { ...vendor, contracts: vendorContracts };
  },

  async updateRiskLevel(orgId: string, riskLevel: string) {
    const [updated] = await db.update(vendorProfiles)
      .set({ risk_level: riskLevel as any, updated_at: new Date() })
      .where(eq(vendorProfiles.org_id, orgId))
      .returning();
    return updated;
  },
};
