import { Router } from 'express';
import { enhancedTenderController } from '../controllers/enhancedTender.controller';
import { authenticate } from '../middleware/auth.middleware';
import { checkTenderQuota, checkLiveTenderingEnabled } from '../middleware/quota.middleware';

const router = Router();

// All enhanced tender routes require authentication
router.use(authenticate);

// POST /api/enhanced-tenders/create - Create tender with workflow and quota validation
router.post('/create', 
  checkTenderQuota,
  enhancedTenderController.createTenderWithWorkflow
);

// GET /api/enhanced-tenders/validate - Validate tender creation before actual creation
router.get('/validate', enhancedTenderController.validateTenderCreation);

// POST /api/enhanced-tenders/:tenderId/publish - Publish tender with workflow validation
router.post('/:tenderId/publish', enhancedTenderController.publishTender);

// GET /api/enhanced-tenders/:tenderId/workflow - Get tender workflow status
router.get('/:tenderId/workflow', enhancedTenderController.getWorkflowStatus);

// PUT /api/enhanced-tenders/:tenderId/workflow - Update tender workflow status
router.put('/:tenderId/workflow', enhancedTenderController.updateWorkflowStatus);

// POST /api/enhanced-tenders/:tenderId/live-session - Create live tendering session
router.post('/:tenderId/live-session', 
  checkLiveTenderingEnabled,
  enhancedTenderController.createLiveSession
);

// GET /api/enhanced-tenders/stats/creation - Get tender creation statistics for organization
router.get('/stats/creation', enhancedTenderController.getCreationStats);

// GET /api/enhanced-tenders/types - Get tender type definitions with workflow configuration
router.get('/types', enhancedTenderController.getTenderTypeDefinitions);

// GET /api/enhanced-tenders/roles/available - Get available workflow roles for organization
router.get('/roles/available', enhancedTenderController.getAvailableWorkflowRoles);

export default router;
