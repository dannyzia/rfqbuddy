import { notificationService } from '../notification.service';
import type { CreateNotificationInput, NotificationType, NotificationChannel } from '../../schemas/notification.schema';

// Mock the database
jest.mock('../../config/database');
jest.mock('../../config/logger');

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new notification with all fields', async () => {
      const mockDatabase = require('../../config/database');

      const input: CreateNotificationInput = {
        tenderId: 'tender-001',
        recipientId: 'user-001',
        notificationType: 'tender_published' as NotificationType,
        channel: 'in_app' as NotificationChannel,
        payload: { tenderTitle: 'Test Tender' },
      };

      const mockCreatedNotification = {
        id: 'notif-001',
        tender_id: 'tender-001',
        recipient_id: 'user-001',
        notification_type: 'tender_published',
        channel: 'in_app',
        status: 'pending',
        payload: { tenderTitle: 'Test Tender' },
        sent_at: null,
        failed_reason: null,
        created_at: new Date().toISOString(),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockCreatedNotification] });

      const result = await notificationService.create(input);

      expect(result).toEqual(mockCreatedNotification);
      expect(result.status).toBe('pending');
      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO notifications'),
        expect.arrayContaining(['tender-001', 'user-001', 'tender_published', 'in_app'])
      );
    });

    it('should create notification without tender ID', async () => {
      const mockDatabase = require('../../config/database');

      const input: CreateNotificationInput = {
        recipientId: 'user-001',
        notificationType: 'bid_submitted' as NotificationType,
        channel: 'email' as NotificationChannel,
        payload: { message: 'Your bid was submitted' },
      };

      const mockCreatedNotification = {
        id: 'notif-002',
        tender_id: null,
        recipient_id: 'user-001',
        notification_type: 'bid_submitted',
        channel: 'email',
        status: 'pending',
        payload: { message: 'Your bid was submitted' },
        sent_at: null,
        failed_reason: null,
        created_at: new Date().toISOString(),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockCreatedNotification] });

      const result = await notificationService.create(input);

      expect(result.tender_id).toBeNull();
      expect(result.channel).toBe('email');
    });

    it('should create notification without payload', async () => {
      const mockDatabase = require('../../config/database');

      const input: CreateNotificationInput = {
        recipientId: 'user-001',
        notificationType: 'tender_awarded' as NotificationType,
        channel: 'in_app' as NotificationChannel,
      };

      const mockCreatedNotification = {
        id: 'notif-003',
        tender_id: null,
        recipient_id: 'user-001',
        notification_type: 'tender_awarded',
        channel: 'in_app',
        status: 'pending',
        payload: null,
        sent_at: null,
        failed_reason: null,
        created_at: new Date().toISOString(),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockCreatedNotification] });

      const result = await notificationService.create(input);

      expect(result.payload).toBeNull();
    });
  });

  describe('createBulk', () => {
    it('should create notifications for multiple recipients', async () => {
      const mockDatabase = require('../../config/database');
      const recipientIds = ['user-001', 'user-002', 'user-003'];

      const mockNotifications = recipientIds.map((id, idx) => ({
        id: `notif-${idx + 1}`,
        tender_id: 'tender-001',
        recipient_id: id,
        notification_type: 'tender_published',
        channel: 'in_app',
        status: 'pending',
        payload: { tenderTitle: 'Test Tender' },
        sent_at: null,
        failed_reason: null,
        created_at: new Date().toISOString(),
      }));

      // 3 recipients = 3 create() calls = 3 INSERT queries
      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockNotifications[0]] })
        .mockResolvedValueOnce({ rows: [mockNotifications[1]] })
        .mockResolvedValueOnce({ rows: [mockNotifications[2]] });

      const result = await notificationService.createBulk(
        recipientIds,
        'tender_published' as NotificationType,
        'in_app' as NotificationChannel,
        'tender-001',
        { tenderTitle: 'Test Tender' }
      );

      expect(result).toHaveLength(3);
      expect(result).toEqual(mockNotifications);
    });

    it('should create bulk notifications without tender ID', async () => {
      const mockDatabase = require('../../config/database');
      const recipientIds = ['user-001', 'user-002'];

      const mockNotifications = recipientIds.map((id, idx) => ({
        id: `notif-${idx + 1}`,
        tender_id: null,
        recipient_id: id,
        notification_type: 'bid_opening',
        channel: 'email',
        status: 'pending',
        payload: null,
        sent_at: null,
        failed_reason: null,
        created_at: new Date().toISOString(),
      }));

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockNotifications[0]] })
        .mockResolvedValueOnce({ rows: [mockNotifications[1]] });

      const result = await notificationService.createBulk(
        recipientIds,
        'bid_opening' as NotificationType,
        'email' as NotificationChannel
      );

      expect(result).toHaveLength(2);
      expect(result[0].tender_id).toBeNull();
    });
  });

  describe('findPending', () => {
    it('should return pending notifications with default limit', async () => {
      const mockDatabase = require('../../config/database');

      const mockPendingNotifications = [
        {
          id: 'notif-001',
          tender_id: 'tender-001',
          recipient_id: 'user-001',
          notification_type: 'tender_published',
          channel: 'in_app',
          status: 'pending',
          payload: { tenderTitle: 'Test Tender' },
          sent_at: null,
          failed_reason: null,
          created_at: new Date().toISOString(),
        },
        {
          id: 'notif-002',
          tender_id: 'tender-002',
          recipient_id: 'user-002',
          notification_type: 'bid_opening',
          channel: 'email',
          status: 'retried',
          payload: null,
          sent_at: null,
          failed_reason: 'Email service down',
          created_at: new Date().toISOString(),
        },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: mockPendingNotifications });

      const result = await notificationService.findPending();

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockPendingNotifications);
      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining('status IN'),
        [50]
      );
    });

    it('should return pending notifications with custom limit', async () => {
      const mockDatabase = require('../../config/database');

      const mockNotifications = [
        {
          id: 'notif-001',
          tender_id: 'tender-001',
          recipient_id: 'user-001',
          notification_type: 'tender_published',
          channel: 'in_app',
          status: 'pending',
          payload: null,
          sent_at: null,
          failed_reason: null,
          created_at: new Date().toISOString(),
        },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: mockNotifications });

      const result = await notificationService.findPending(10);

      expect(result).toHaveLength(1);
      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT'),
        [10]
      );
    });

    it('should return empty array if no pending notifications', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await notificationService.findPending();

      expect(result).toEqual([]);
    });
  });

  describe('findByRecipientId', () => {
    it('should return notifications for a recipient', async () => {
      const mockDatabase = require('../../config/database');
      const userId = 'user-001';

      const mockNotifications = [
        {
          id: 'notif-001',
          tender_id: 'tender-001',
          recipient_id: userId,
          notification_type: 'tender_published',
          channel: 'in_app',
          status: 'delivered',
          payload: { tenderTitle: 'Test Tender' },
          sent_at: new Date().toISOString(),
          failed_reason: null,
          created_at: new Date().toISOString(),
        },
        {
          id: 'notif-002',
          tender_id: 'tender-002',
          recipient_id: userId,
          notification_type: 'bid_opening',
          channel: 'email',
          status: 'sent',
          payload: null,
          sent_at: new Date().toISOString(),
          failed_reason: null,
          created_at: new Date().toISOString(),
        },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: mockNotifications });

      const result = await notificationService.findByRecipientId(userId);

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockNotifications);
      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY created_at DESC'),
        [userId, 50, 0]
      );
    });

    it('should support pagination', async () => {
      const mockDatabase = require('../../config/database');
      const userId = 'user-001';

      const mockNotifications: any[] = [];
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: mockNotifications });

      await notificationService.findByRecipientId(userId, 25, 50);

      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining('OFFSET'),
        [userId, 25, 50]
      );
    });

    it('should return empty array if recipient has no notifications', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await notificationService.findByRecipientId('user-999');

      expect(result).toEqual([]);
    });
  });

  describe('markAsSent', () => {
    it('should update notification status to sent', async () => {
      const mockDatabase = require('../../config/database');
      const notificationId = 'notif-001';

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      await notificationService.markAsSent(notificationId);

      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining("status = 'sent'"),
        [notificationId]
      );
    });
  });

  describe('markAsDelivered', () => {
    it('should update notification status to delivered', async () => {
      const mockDatabase = require('../../config/database');
      const notificationId = 'notif-001';

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      await notificationService.markAsDelivered(notificationId);

      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining("status = 'delivered'"),
        [notificationId]
      );
    });
  });

  describe('markAsFailed', () => {
    it('should mark as retried if under max retries', async () => {
      const mockDatabase = require('../../config/database');
      const notificationId = 'notif-001';
      const reason = 'Email service timeout';
      const retryCount = 1;

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      await notificationService.markAsFailed(notificationId, reason, retryCount);

      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining("status = 'retried'"),
        [reason, notificationId]
      );
    });

    it('should mark as failed if max retries exceeded', async () => {
      const mockDatabase = require('../../config/database');
      const notificationId = 'notif-001';
      const reason = 'Email service permanently down';
      const retryCount = 3; // MAX_RETRIES

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      await notificationService.markAsFailed(notificationId, reason, retryCount);

      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining("status = 'failed'"),
        [reason, notificationId]
      );
    });
  });

  describe('sendEmail', () => {
    it('should return true for email send (placeholder)', async () => {
      const result = await notificationService.sendEmail('user@example.com', 'Test Subject', 'Test body');

      expect(result).toBe(true);
    });
  });

  describe('sendSms', () => {
    it('should return true for SMS send (placeholder)', async () => {
      const result = await notificationService.sendSms('+1234567890', 'Test message');

      expect(result).toBe(true);
    });
  });

  describe('processNotification', () => {
    it('should process email notification successfully', async () => {
      const mockDatabase = require('../../config/database');

      const mockNotification = {
        id: 'notif-001',
        tender_id: 'tender-001',
        recipient_id: 'user-001',
        notification_type: 'tender_published',
        channel: 'email' as NotificationChannel,
        status: 'pending',
        payload: { tenderTitle: 'Test Tender' },
        sent_at: null,
        failed_reason: null,
        created_at: new Date().toISOString(),
      };

      const mockUser = {
        email: 'user@example.com',
        name: 'John Doe',
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockUser] })
        .mockResolvedValueOnce({ rows: [] }); // markAsSent update

      await notificationService.processNotification(mockNotification);

      expect(mockDatabase.pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT email, name FROM users'),
        ['user-001']
      );
    });

    it('should mark as failed if recipient not found', async () => {
      const mockDatabase = require('../../config/database');

      const mockNotification = {
        id: 'notif-001',
        tender_id: 'tender-001',
        recipient_id: 'user-999',
        notification_type: 'tender_published',
        channel: 'email' as NotificationChannel,
        status: 'pending',
        payload: { tenderTitle: 'Test Tender' },
        sent_at: null,
        failed_reason: null,
        created_at: new Date().toISOString(),
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [] }) // recipient not found
        .mockResolvedValueOnce({ rows: [] }); // markAsFailed update

      await notificationService.processNotification(mockNotification);

      expect(mockDatabase.pool.query).toHaveBeenCalledTimes(2);
      expect(mockDatabase.pool.query).toHaveBeenNthCalledWith(2, expect.stringContaining('UPDATE'), expect.any(Array));
    });

    it('should process in-app notification', async () => {
      const mockDatabase = require('../../config/database');

      const mockNotification = {
        id: 'notif-002',
        tender_id: 'tender-001',
        recipient_id: 'user-001',
        notification_type: 'bid_opening',
        channel: 'in_app' as NotificationChannel,
        status: 'pending',
        payload: { bidCount: 5 },
        sent_at: null,
        failed_reason: null,
        created_at: new Date().toISOString(),
      };

      const mockUser = {
        email: 'user@example.com',
        name: 'John Doe',
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockUser] })
        .mockResolvedValueOnce({ rows: [] }); // markAsSent

      await notificationService.processNotification(mockNotification);

      // in_app is instant success
      expect(mockDatabase.pool.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('processPendingNotifications', () => {
    it('should process all pending notifications', async () => {
      const mockDatabase = require('../../config/database');

      const mockPendingNotifications = [
        {
          id: 'notif-001',
          tender_id: 'tender-001',
          recipient_id: 'user-001',
          notification_type: 'tender_published',
          channel: 'in_app',
          status: 'pending',
          payload: null,
          sent_at: null,
          failed_reason: null,
          created_at: new Date().toISOString(),
        },
      ];

      // First query: findPending
      // Then for each notification: processNotification (1 user lookup + 1 update)
      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: mockPendingNotifications }) // findPending
        .mockResolvedValueOnce({ rows: [{ email: 'user@example.com', name: 'John' }] }) // getUser
        .mockResolvedValueOnce({ rows: [] }); // markAsSent

      const result = await notificationService.processPendingNotifications();

      expect(result).toBe(1);
    });

    it('should return 0 if no pending notifications', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await notificationService.processPendingNotifications();

      expect(result).toBe(0);
    });
  });

  describe('getEmailSubject', () => {
    it('should return correct subject for tender_published', () => {
      const subject = notificationService.getEmailSubject('tender_published', { tenderTitle: 'Supply Contract' });
      expect(subject).toContain('New Tender: Supply Contract');
    });

    it('should return correct subject for deadline_reminder_1d', () => {
      const subject = notificationService.getEmailSubject('deadline_reminder_1d', {
        tenderTitle: 'IT Equipment',
      });
      expect(subject).toContain('URGENT: 1 Day Until Deadline');
    });

    it('should return default subject for unknown type', () => {
      const subject = notificationService.getEmailSubject('unknown_type', {});
      expect(subject).toBe('RFQ Buddy Notification');
    });
  });

  describe('getEmailBody', () => {
    it('should return email body with recipient name', () => {
      const payload = { tenderTitle: 'Test Tender', message: 'Important' };
      const body = notificationService.getEmailBody('tender_published', payload, 'Jane Doe');

      expect(body).toContain('Dear Jane Doe');
      expect(body).toContain('RFQ Buddy Team');
      expect(body).toContain('Test Tender');
    });
  });

  describe('getSmsMessage', () => {
    it('should return SMS message', () => {
      const message = notificationService.getSmsMessage('tender_published', { tenderTitle: 'Test' });

      expect(message).toContain('RFQ Buddy:');
      expect(message).toContain('New Tender');
    });
  });

  describe('notifyTenderPublished', () => {
    it('should create notifications for open tenders to all vendors', async () => {
      const mockDatabase = require('../../config/database');

      const mockTender = { visibility: 'open' };
      const mockVendors = [
        { id: 'user-001' },
        { id: 'user-002' },
        { id: 'user-003' },
      ];

      // Queries: SELECT tender, SELECT vendors, then 3 × create
      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockTender] })
        .mockResolvedValueOnce({ rows: mockVendors })
        .mockResolvedValueOnce({ rows: [{ id: 'notif-1' }] })
        .mockResolvedValueOnce({ rows: [{ id: 'notif-2' }] })
        .mockResolvedValueOnce({ rows: [{ id: 'notif-3' }] });

      await notificationService.notifyTenderPublished('tender-001', 'Test Tender');

      expect(mockDatabase.pool.query).toHaveBeenCalled();
    });

    it('should not notify for non-open tenders', async () => {
      const mockDatabase = require('../../config/database');

      const mockTender = { visibility: 'restricted' };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockTender] });

      await notificationService.notifyTenderPublished('tender-001', 'Test Tender');

      // Only 1 query (the SELECT) since visibility is not 'open'
      expect(mockDatabase.pool.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('notifyBidSubmitted', () => {
    it('should notify vendor and buyer organizations', async () => {
      const mockDatabase = require('../../config/database');

      const mockTender = { title: 'Supply Contract', buyer_org_id: 'org-buyer' };
      const mockVendorUsers = [{ id: 'vendor-user-1' }];
      const mockBuyerUsers = [{ id: 'buyer-user-1' }];

      // Queries: SELECT tender, SELECT vendor users, 1 × createBulk (1 INSERT), SELECT buyer users, 1 × createBulk (1 INSERT)
      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [mockTender] })
        .mockResolvedValueOnce({ rows: mockVendorUsers })
        .mockResolvedValueOnce({ rows: [{ id: 'notif-1' }] })
        .mockResolvedValueOnce({ rows: mockBuyerUsers })
        .mockResolvedValueOnce({ rows: [{ id: 'notif-2' }] });

      await notificationService.notifyBidSubmitted('bid-001', 'tender-001', 'org-vendor');

      expect(mockDatabase.pool.query).toHaveBeenCalled();
    });
  });
});
