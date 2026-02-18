export interface SubscriptionPackage {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  simple_rfq_quota: number;
  detailed_tender_quota: number;
  storage_limit_bytes: number;
  live_tendering_enabled: boolean;
  custom_storage_enabled: boolean;
  is_active: boolean;
  created_at: string;
}

export interface OrganizationSubscription {
  id: string;
  organization_id: string;
  package_id: string;
  status: 'active' | 'cancelled' | 'expired';
  started_at: string;
  expires_at: string | null;
  cancelled_at: string | null;
  custom_storage_bytes: number | null;
  name: string;
  description: string;
  simple_rfq_quota: number;
  detailed_tender_quota: number;
  storage_limit_bytes: number;
  live_tendering_enabled: boolean;
  custom_storage_enabled: boolean;
  simple_rfq_quota_used: number;
  detailed_tender_quota_used: number;
  created_at: string;
  updated_at: string;
}

export interface StorageUsage {
  used_bytes: number;
  total_bytes: number;
  file_count: number;
  last_updated: string;
}

export interface QuotaUsage {
  simple_rfq_quota: number;
  detailed_tender_quota: number;
  simple_rfq_quota_used: number;
  detailed_tender_quota_used: number;
  week_start: string;
  week_end: string;
}

export interface FileUpload {
  id: string;
  organization_id: string;
  filename: string;
  file_path: string;
  file_size_bytes: number;
  mime_type: string;
  uploaded_by: string;
  uploaded_at: string;
}
