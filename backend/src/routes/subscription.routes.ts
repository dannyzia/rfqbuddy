import { Router } from 'express';
import { subscriptionController } from '../controllers/subscription.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { 
  checkStorageQuota
} from '../middleware/quota.middleware';

const router = Router();

// All subscription routes require authentication
router.use(authenticate);

// GET /api/subscription/packages - Get available packages (public for logged in users)
router.get('/packages', subscriptionController.getAvailablePackages);

// GET /api/subscription/current - Get current organization subscription
router.get('/current', subscriptionController.getOrganizationSubscription);

// POST /api/subscription/current - Create/update subscription (admin only)
router.post('/current', 
  authorize('admin'), 
  subscriptionController.createOrUpdateSubscription
);

// DELETE /api/subscription/current - Cancel subscription (admin only)
router.delete('/current', 
  authorize('admin'), 
  subscriptionController.cancelSubscription
);

// GET /api/subscription/storage - Get storage usage
router.get('/storage', subscriptionController.getStorageUsage);

// POST /api/subscription/storage/recalculate - Recalculate storage usage (admin only)
router.post('/storage/recalculate', 
  authorize('admin'), 
  subscriptionController.recalculateStorageUsage
);

// GET /api/subscription/files - Get organization files
router.get('/files', subscriptionController.getOrganizationFiles);

// POST /api/subscription/files - Upload file (with storage quota check)
router.post('/files', 
  checkStorageQuota,
  subscriptionController.uploadFile
);

// DELETE /api/subscription/files/:fileId - Delete file
router.delete('/files/:fileId', subscriptionController.deleteFile);

// GET /api/subscription/files/:fileId - Get file details
router.get('/files/:fileId', subscriptionController.getFile);

// GET /api/subscription/quota/tender - Check tender quota
router.get('/quota/tender', subscriptionController.checkTenderQuota);

export default router;
