export interface CommitteeAssignment {
  id: string;
  tender_id: string;
  user_id: string;
  tier: 'pre_qualification' | 'technical' | 'commercial';
  status: 'pending' | 'approved' | 'forwarded';
  assigned_by: string;
  assigned_at: Date;
  completed_at?: Date;
  forwarded_at?: Date;
  name?: string;
  email?: string;
  roles?: string[];
  tender_title?: string;
  tender_number?: string;
}

export interface CommitteeStats {
  tier: string;
  total: number;
  pending: number;
  approved: number;
  forwarded: number;
}

export interface CommitteeAssignmentInput {
  tenderId: string;
  userIds: string[];
  tier: 'pre_qualification' | 'technical' | 'commercial';
}

export interface CommitteeUpdateInput {
  status: 'pending' | 'approved' | 'forwarded';
  remarks?: string;
}
