import { requireRole } from './requireRole';

// Convenience shortcut for super_admin-only routes
export const requireAdmin = requireRole(['super_admin']);
