import { db } from '../config/database';
import { notifications, profiles } from '../schema';
import { eq, and, desc } from 'drizzle-orm';
import { emitToUser, emitToOrg } from '../config/socket';
import { emailQueue } from '../config/queue';
import type { Tender, Bid, NewNotification } from '../types';

export const notificationService = {
  async create(data: NewNotification) {
    const [notif] = await db.insert(notifications).values(data).returning();

    // Push via Socket.io
    emitToUser(data.recipient_id, 'notification', {
      id: notif.id,
      title: data.title,
      message: data.message,
      type: data.type,
      payload: data.payload,
    });

    // Queue email if channel is 'email' or 'both'
    if (data.channel === 'email' || data.channel === 'both') {
      const [recipient] = await db.select().from(profiles)
        .where(eq(profiles.id, data.recipient_id)).limit(1);

      if (recipient) {
        await emailQueue.add('send-notification-email', {
          to: recipient.email,
          templateKey: data.type,
          variables: {
            name: recipient.full_name,
            title: data.title,
            ...(data.payload as object ?? {}),
          },
        });
      }
    }

    return notif;
  },

  async listForUser(userId: string, unreadOnly = false) {
    let query = db.select().from(notifications)
      .where(eq(notifications.recipient_id, userId))
      .$dynamic();

    if (unreadOnly) {
      query = query.where(eq(notifications.is_read, false));
    }

    return query.orderBy(desc(notifications.created_at)).limit(50);
  },

  async markAsRead(notifId: string, userId: string) {
    await db.update(notifications)
      .set({ is_read: true, read_at: new Date() })
      .where(and(eq(notifications.id, notifId), eq(notifications.recipient_id, userId)));
  },

  async markAllRead(userId: string) {
    await db.update(notifications)
      .set({ is_read: true, read_at: new Date() })
      .where(and(eq(notifications.recipient_id, userId), eq(notifications.is_read, false)));
  },

  async getUnreadCount(userId: string): Promise<number> {
    const result = await db.select().from(notifications)
      .where(and(eq(notifications.recipient_id, userId), eq(notifications.is_read, false)));
    return result.length;
  },

  // ── Convenience methods for specific events ──────────────────

  async sendTenderPublished(tender: Tender, vendorOrgId: string) {
    // Find all users in the vendor org
    const vendorUsers = await db.select().from(profiles)
      .where(eq(profiles.org_id, vendorOrgId));

    for (const user of vendorUsers) {
      await this.create({
        recipient_id: user.id,
        type: 'tender_published',
        title: `New RFQ: ${tender.title}`,
        message: `A new RFQ has been published. Deadline: ${tender.submission_deadline}`,
        payload: { tender_id: tender.id, tender_number: tender.tender_number },
        channel: 'both',
      });
    }
  },

  async sendBidSubmitted(bid: Bid, tender: Tender) {
    // Notify the procurer who created the tender
    await this.create({
      recipient_id: tender.created_by,
      type: 'bid_received',
      title: `New bid received: ${bid.bid_number}`,
      message: `A vendor submitted bid ${bid.bid_number} for ${tender.title}`,
      payload: { bid_id: bid.id, tender_id: tender.id, amount: bid.total_amount },
      channel: 'both',
    });

    // Emit realtime event to org
    emitToOrg(tender.buyer_org_id, 'bid_submitted', {
      tender_id: tender.id,
      bid_id: bid.id,
      bid_number: bid.bid_number,
    });
  },
};
