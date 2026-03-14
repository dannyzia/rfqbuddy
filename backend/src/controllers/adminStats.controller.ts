import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../config/database';
import { profiles, organizations, tenders, bids, contracts, supportTickets } from '../schema';
import { sql, eq } from 'drizzle-orm';

export const adminStatsController = {
  async getDashboardStats(_req: FastifyRequest, reply: FastifyReply) {
    const [users] = await db.select({ count: sql<number>`count(*)` }).from(profiles);
    const [orgs] = await db.select({ count: sql<number>`count(*)` }).from(organizations);
    const [tenderCount] = await db.select({ count: sql<number>`count(*)` }).from(tenders);
    const [bidCount] = await db.select({ count: sql<number>`count(*)` }).from(bids);
    const [contractCount] = await db.select({ count: sql<number>`count(*)` }).from(contracts);
    const [openTickets] = await db.select({ count: sql<number>`count(*)` }).from(supportTickets).where(eq(supportTickets.status, 'open'));
    const [pendingUsers] = await db.select({ count: sql<number>`count(*)` }).from(profiles).where(eq(profiles.status, 'pending'));

    return reply.send({
      total_users: Number(users.count),
      total_organizations: Number(orgs.count),
      total_tenders: Number(tenderCount.count),
      total_bids: Number(bidCount.count),
      total_contracts: Number(contractCount.count),
      open_tickets: Number(openTickets.count),
      pending_approvals: Number(pendingUsers.count),
    });
  },
};
