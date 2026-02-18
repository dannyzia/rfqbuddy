-- Rollback: 013_extend_tender_type_definitions_rollback.sql
-- Removes method and form_segment_config columns from tender_type_definitions

BEGIN;

-- Remove the index
DROP INDEX IF EXISTS idx_ttd_method;

-- Remove form_segment_config column
ALTER TABLE tender_type_definitions
  DROP COLUMN IF EXISTS form_segment_config;

-- Remove method column
ALTER TABLE tender_type_definitions
  DROP COLUMN IF EXISTS method;

COMMIT;
