import { Router } from 'express';
import { workflowController } from '../controllers/workflow.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// All workflow routes require authentication
router.use(authenticate);

// POST /api/workflow/roles/assign - Assign role to user for tender
router.post('/roles/assign', workflowController.assignRole);

// GET /api/workflow/roles/tender/:tenderId - Get all role assignments for a tender
router.get('/roles/tender/:tenderId', workflowController.getTenderRoleAssignments);

// GET /api/workflow/roles/my-assignments - Get current user's role assignments
router.get('/roles/my-assignments', workflowController.getMyRoleAssignments);

// POST /api/workflow/roles/:assignmentId/activate - Activate role assignment
router.post('/roles/:assignmentId/activate', workflowController.activateRoleAssignment);

// POST /api/workflow/roles/:assignmentId/complete - Complete role assignment
router.post('/roles/:assignmentId/complete', workflowController.completeRoleAssignment);

// POST /api/workflow/roles/:assignmentId/forward - Forward assignment to next role
router.post('/roles/:assignmentId/forward', workflowController.forwardAssignment);

// POST /api/workflow/roles/:assignmentId/skip - Skip role assignment
router.post('/roles/:assignmentId/skip', workflowController.skipRoleAssignment);

// POST /api/workflow/roles/bulk-assign - Bulk assign roles for a tender (admin only)
router.post('/roles/bulk-assign', 
  authorize('admin'), 
  workflowController.bulkAssignRoles
);

// GET /api/workflow/log/:tenderId - Get workflow log for tender
router.get('/log/:tenderId', workflowController.getWorkflowLog);

// GET /api/workflow/permissions/check - Check if user can perform action on tender
router.get('/permissions/check', workflowController.checkActionPermission);

export default router;
