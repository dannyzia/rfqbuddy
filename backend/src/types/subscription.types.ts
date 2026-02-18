export interface SubscriptionPackage {
  id: string;
  code: string;
  name: string;
  weekly_simple_rfq_limit: number | null;
  weekly_detailed_tender_limit: number | null;
  storage_limit_bytes: number | null;
  live_tendering_enabled: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'suspended';

export interface OrganizationSubscription {
  id: string;
  organization_id: string;
  package_id: string;
  custom_storage_bytes: number | null;
  starts_at: string;
  expires_at: string | null;
  status: SubscriptionStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  package_name?: string;
  package_code?: string;
  weekly_simple_rfq_limit?: number | null;
  weekly_detailed_tender_limit?: number | null;
  storage_limit_bytes?: number | null;
  live_tendering_enabled?: boolean;
}

export interface StorageUsage {
  organization_id: string;
  used_bytes: number;
  last_calculated_at: string;
}

export interface QuotaUsage {
  id: string;
  organization_id: string;
  week_start: string;
  simple_rfq_count: number;
  detailed_tender_count: number;
  updated_at: string;
}

export interface FileUpload {
  id: string;
  organization_id: string;
  tender_id: string | null;
  uploaded_by: string;
  original_name: string;
  stored_key: string;
  mime_type: string | null;
  file_size_bytes: number;
  upload_path: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
  created_at: string;
}
