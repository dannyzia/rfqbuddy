-- Rollback: 014_subscription_packages_rollback.sql
-- Removes all subscription-related tables

BEGIN;

-- Drop indexes first
DROP INDEX IF EXISTS idx_file_uploads_deleted;
DROP INDEX IF EXISTS idx_file_uploads_tender;
DROP INDEX IF EXISTS idx_file_uploads_org;
DROP INDEX IF EXISTS idx_quota_org_week;
DROP INDEX IF EXISTS idx_org_subs_status;
DROP INDEX IF EXISTS idx_org_subs_org;

-- Drop tables
DROP TABLE IF EXISTS file_uploads;
DROP TABLE IF EXISTS tender_quota_usage;
DROP TABLE IF EXISTS organization_storage_usage;
DROP TABLE IF EXISTS organization_subscriptions;
DROP TABLE IF EXISTS subscription_packages;

COMMIT;
