import { db } from '../config/database';
import { contracts, contractMilestones, paymentCertificates } from '../schema';
import { eq, desc, sql, and } from 'drizzle-orm';

export const financeService = {
  // Three-way matching: PO ↔ GRN ↔ Invoice
  async getMatchingOverview(orgId: string) {
    const [contractCount] = await db.select({ count: sql<number>`count(*)` })
      .from(contracts).where(eq(contracts.buyer_org_id, orgId));
    const [paymentCount] = await db.select({ count: sql<number>`count(*)` })
      .from(paymentCertificates);

    return {
      total_contracts: Number(contractCount.count),
      total_payments: Number(paymentCount.count),
    };
  },

  async listPayments(params?: { page?: number; pageSize?: number; status?: string }) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;

    const data = await db.select().from(paymentCertificates)
      .orderBy(desc(paymentCertificates.created_at))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(paymentCertificates);
    return { data, total: Number(count), page, pageSize };
  },

  async getPaymentById(id: string) {
    const [payment] = await db.select().from(paymentCertificates)
      .where(eq(paymentCertificates.id, id)).limit(1);
    return payment ?? null;
  },

  async createGRN(data: {
    contract_id: string;
    certificate_no: string;
    milestone_id?: string;
    amount: string;
    submitted_by: string;
  }) {
    const [grn] = await db.insert(paymentCertificates).values({
      contract_id: data.contract_id,
      certificate_no: data.certificate_no,
      milestone_id: data.milestone_id ?? null,
      amount: data.amount,
      submitted_by: data.submitted_by,
    }).returning();
    return grn;
  },

  // FX rates — placeholder service (real implementation would call external FX API)
  async getFxRates(baseCurrency = 'USD') {
    return {
      base: baseCurrency,
      timestamp: new Date().toISOString(),
      rates: {
        BDT: 109.85, EUR: 0.92, GBP: 0.79, JPY: 149.50,
        INR: 83.12, CNY: 7.24, SGD: 1.34, AED: 3.67,
      },
    };
  },

  async getFxComparison(tenderId: string) {
    // Would join bids with FX rates for multi-currency tender comparison
    return { tender_id: tenderId, comparisons: [] };
  },
};
