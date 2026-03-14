import { db } from '../config/database';
import { tenders, contractMilestones, contracts } from '../schema';
import { eq, and, gte, lte, isNotNull } from 'drizzle-orm';

export interface CalendarEvent {
  type: 'deadline' | 'opening' | 'milestone' | 'contract_end';
  id: string;
  title: string;
  date: Date | string | null;
}

export const calendarService = {
  async getEvents(orgId: string, start: string, end: string): Promise<CalendarEvent[]> {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const [deadlines, openings, milestones, contractEnds] = await Promise.all([
      // Tender submission deadlines
      db.select({
        id: tenders.id,
        title: tenders.title,
        date: tenders.submission_deadline,
      })
        .from(tenders)
        .where(and(
          eq(tenders.buyer_org_id, orgId),
          gte(tenders.submission_deadline, startDate),
          lte(tenders.submission_deadline, endDate),
        )),

      // Tender opening dates
      db.select({
        id: tenders.id,
        title: tenders.title,
        date: tenders.opening_date,
      })
        .from(tenders)
        .where(and(
          eq(tenders.buyer_org_id, orgId),
          isNotNull(tenders.opening_date),
          gte(tenders.opening_date, startDate),
          lte(tenders.opening_date, endDate),
        )),

      // Contract milestones
      db.select({
        id: contractMilestones.id,
        title: contractMilestones.title,
        date: contractMilestones.due_date,
      })
        .from(contractMilestones)
        .innerJoin(contracts, eq(contracts.id, contractMilestones.contract_id))
        .where(and(
          eq(contracts.buyer_org_id, orgId),
          gte(contractMilestones.due_date, start),
          lte(contractMilestones.due_date, end),
        )),

      // Contract end dates
      db.select({
        id: contracts.id,
        title: contracts.title,
        date: contracts.end_date,
      })
        .from(contracts)
        .where(and(
          eq(contracts.buyer_org_id, orgId),
          gte(contracts.end_date, start),
          lte(contracts.end_date, end),
        )),
    ]);

    return [
      ...deadlines.map(t => ({ type: 'deadline' as const, ...t })),
      ...openings.map(t => ({ type: 'opening' as const, ...t })),
      ...milestones.map(m => ({ type: 'milestone' as const, ...m })),
      ...contractEnds.map(c => ({ type: 'contract_end' as const, ...c })),
    ];
  },
};
