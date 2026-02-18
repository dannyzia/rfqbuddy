-- Migration: 013_extend_tender_type_definitions.sql
-- Adds method and form_segment_config columns to existing tender_type_definitions.
-- The table was created in 001; is_govt_type added in 008; NRQ types seeded in 009.

BEGIN;

-- Add method column (procurement method)
ALTER TABLE tender_type_definitions
  ADD COLUMN IF NOT EXISTS method TEXT
    CHECK (method IN ('rfq','open','limited','direct','turnkey'));

-- Backfill method from existing columns
UPDATE tender_type_definitions SET method = 'direct'  WHERE is_direct_procurement = TRUE;
UPDATE tender_type_definitions SET method = 'turnkey' WHERE code = 'PG5A';
UPDATE tender_type_definitions SET method = 'rfq'
  WHERE code IN ('PG1','PW1','NRQ1','NRQ2','NRQ3') AND method IS NULL;
UPDATE tender_type_definitions SET method = 'open'
  WHERE code IN ('PG2','PG3','PG4','PW3','PPS2','PPS3') AND method IS NULL;

-- Make method NOT NULL now that backfill is complete
ALTER TABLE tender_type_definitions
  ALTER COLUMN method SET NOT NULL;

-- Add form_segment_config: defines which creation segments are active per type
ALTER TABLE tender_type_definitions
  ADD COLUMN IF NOT EXISTS form_segment_config JSONB NOT NULL DEFAULT '{}';

-- Populate sensible defaults
UPDATE tender_type_definitions
SET form_segment_config = '{"segments": ["S1","S2","S3","S4","S5","S6","S7","S8"]}'
WHERE is_govt_type = FALSE;

UPDATE tender_type_definitions
SET form_segment_config = '{
  "segments": ["S1","S2","S3","S4","S5","S6","S7","S8","S9","S10","S11","S12","S13","S14"],
  "conditional": {"S8": "requires_tender_security"}
}'
WHERE is_govt_type = TRUE;

CREATE INDEX IF NOT EXISTS idx_ttd_method ON tender_type_definitions(method);

COMMIT;
