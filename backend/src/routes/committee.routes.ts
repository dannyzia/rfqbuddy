import { Router } from 'express';
import { committeeController } from '../controllers/committee.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// All committee routes require authentication
router.use(authenticate);

// POST /api/committee/tenders/:tenderId/assign - Assign evaluators to tender tier
// Only admins and buyers can assign evaluators
router.post('/tenders/:tenderId/assign', 
  authorize('admin', 'buyer'), 
  committeeController.assign
);

// DELETE /api/committee/tenders/:tenderId/remove - Remove evaluator from tender tier
// Only admins and buyers can remove evaluators
router.delete('/tenders/:tenderId/remove', 
  authorize('admin', 'buyer'), 
  committeeController.remove
);

// GET /api/committee/tenders/:tenderId - Get all committee assignments for a tender
// Admins, buyers, and assigned evaluators can view
router.get('/tenders/:tenderId', committeeController.getByTender);

// GET /api/committee/my-assignments - Get current evaluator's assignments
// Only evaluators can view their own assignments
router.get('/my-assignments', 
  authorize('evaluator'), 
  committeeController.getMyAssignments
);

// PUT /api/committee/assignments/:id/status - Update assignment status
// Only assigned evaluators can update their own status
router.put('/assignments/:id/status', 
  authorize('evaluator'), 
  committeeController.updateStatus
);

// GET /api/committee/evaluators - Get available evaluators
// Only admins and buyers can view available evaluators
router.get('/evaluators', 
  authorize('admin', 'buyer'), 
  committeeController.getAvailableEvaluators
);

// GET /api/committee/tenders/:tenderId/stats - Get committee statistics for a tender
// Admins, buyers, and assigned evaluators can view
router.get('/tenders/:tenderId/stats', committeeController.getStats);

export default router;
