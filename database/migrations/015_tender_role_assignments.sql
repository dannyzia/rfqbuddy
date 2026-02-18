-- Migration: 015_tender_role_assignments.sql
-- Adds six-role procurement workflow.
-- References 'organizations' (not 'organisations').
-- Does NOT touch live_bidding_sessions (already created in migration 010).

BEGIN;

-- Create the procurement role enum
DO $$ BEGIN
  CREATE TYPE procurement_role AS ENUM (
    'procurer',
    'prequal_evaluator',
    'tech_evaluator',
    'commercial_evaluator',
    'auditor',
    'procurement_head'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Per-tender assignment of each of the six roles to a user
CREATE TABLE IF NOT EXISTS tender_role_assignments (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tender_id        UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
    role_type        procurement_role NOT NULL,
    assigned_user_id UUID NOT NULL REFERENCES users(id),
    is_self          BOOLEAN NOT NULL DEFAULT FALSE,
    -- TRUE when the procurer assigns themselves (single-user org fallback)
    assigned_by      UUID NOT NULL REFERENCES users(id),
    assigned_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    status           TEXT NOT NULL DEFAULT 'pending'
                       CHECK (status IN (
                         'pending','active','completed','forwarded','skipped'
                       )),
    activated_at     TIMESTAMPTZ,
    completed_at     TIMESTAMPTZ,
    notes            TEXT,
    UNIQUE (tender_id, role_type)  -- one assignment per role per tender
);

CREATE INDEX IF NOT EXISTS idx_tra_tender
    ON tender_role_assignments(tender_id);
CREATE INDEX IF NOT EXISTS idx_tra_user
    ON tender_role_assignments(assigned_user_id);
CREATE INDEX IF NOT EXISTS idx_tra_status
    ON tender_role_assignments(tender_id, status);

-- Append-only log of every forward/return/assign action
CREATE TABLE IF NOT EXISTS tender_workflow_log (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tender_id   UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
    from_role   procurement_role,   -- NULL for initial assignment
    to_role     procurement_role,   -- NULL for terminal award step
    actor_id    UUID NOT NULL REFERENCES users(id),
    action      TEXT NOT NULL
                  CHECK (action IN (
                    'assigned','forwarded','returned','skipped','completed','reassigned'
                  )),
    notes       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_twl_tender
    ON tender_workflow_log(tender_id, created_at);

-- Extend tenders table with new workflow column
-- (tender_type, is_live_tendering, live_session_id already exist)
ALTER TABLE tenders
  ADD COLUMN IF NOT EXISTS current_workflow_role procurement_role,
  ADD COLUMN IF NOT EXISTS workflow_status TEXT DEFAULT 'draft'
    CHECK (workflow_status IN ('draft','active','completed','cancelled','awarded'));

-- Set default workflow role for existing tenders based on their type
UPDATE tenders 
SET current_workflow_role = 'procurer'
WHERE current_workflow_role IS NULL;

-- Create indexes for new tender columns
CREATE INDEX IF NOT EXISTS idx_tenders_workflow_role ON tenders(current_workflow_role);
CREATE INDEX IF NOT EXISTS idx_tenders_workflow_status ON tenders(workflow_status);

COMMIT;
