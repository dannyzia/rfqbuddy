import { Resend } from 'resend';
import Handlebars from 'handlebars';
import { db } from '../config/database';
import { emailTemplates, notifications } from '../schema';
import { eq } from 'drizzle-orm';
import { env } from '../config/env';

const resend = new Resend(env.RESEND_API_KEY);

export const emailService = {
  async sendTemplated(to: string, templateKey: string, variables: Record<string, unknown>) {
    // Fetch template from DB
    const [template] = await db.select().from(emailTemplates)
      .where(eq(emailTemplates.key, templateKey)).limit(1);

    if (!template) {
      console.error(`[Email] Template not found: ${templateKey}`);
      return;
    }

    // Render with Handlebars
    const subjectTemplate = Handlebars.compile(template.subject);
    const bodyTemplate = Handlebars.compile(template.html_body);

    const subject = subjectTemplate(variables);
    const html = bodyTemplate(variables);

    try {
      await resend.emails.send({
        from: 'RFQ Hub <noreply@rfqhub.com>',
        to,
        subject,
        html,
      });

      console.log(`[Email] Sent "${templateKey}" to ${to}`);
    } catch (err) {
      console.error(`[Email] Failed to send "${templateKey}" to ${to}:`, err);
      throw err; // Let BullMQ retry
    }
  },

  async sendRaw(to: string, subject: string, html: string) {
    await resend.emails.send({
      from: 'RFQ Hub <noreply@rfqhub.com>',
      to,
      subject,
      html,
    });
  },
};
