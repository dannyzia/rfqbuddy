export type ProcurementRole = 'procurer' | 'prequal_evaluator' | 'tech_evaluator' | 'commercial_evaluator' | 'auditor' | 'procurement_head';

export interface TenderRoleAssignment {
  id: string;
  tender_id: string;
  role_type: ProcurementRole;
  assigned_user_id: string;
  is_self: boolean;
  assigned_by: string;
  assigned_at: string;
  status: 'pending' | 'active' | 'completed' | 'forwarded' | 'skipped';
  activated_at: string | null;
  completed_at: string | null;
  notes: string | null;
  assigned_user_name?: string;
  assigned_user_email?: string;
  tender_title?: string;
  tender_number?: string;
  current_workflow_role?: string;
}

export interface WorkflowLog {
  id: string;
  tender_id: string;
  from_role: ProcurementRole | null;
  to_role: ProcurementRole | null;
  actor_id: string;
  action: 'assigned' | 'forwarded' | 'returned' | 'skipped' | 'completed' | 'reassigned' | 'activated';
  notes: string | null;
  created_at: string;
  actor_name?: string;
  actor_email?: string;
}

export interface RoleAssignmentInput {
  tenderId: string;
  roleType: ProcurementRole;
  assignedUserId: string;
  isSelf?: boolean;
  notes?: string;
}

export interface WorkflowActionInput {
  action: 'activate' | 'complete' | 'forward' | 'skip';
  toRole?: ProcurementRole;
  notes?: string;
}
