-- rfq-platform/database/migrations/012_evaluation_committee.sql

-- 1. Create the committee assignment table
CREATE TABLE tender_evaluation_committees (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id        UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
    user_id          UUID NOT NULL REFERENCES users(id),
    tier             TEXT NOT NULL CHECK (tier IN ('pre_qualification', 'technical', 'commercial')),
    status           TEXT NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending', 'approved', 'forwarded')),
    assigned_by      UUID NOT NULL REFERENCES users(id),
    assigned_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at     TIMESTAMPTZ,
    forwarded_at     TIMESTAMPTZ,
    UNIQUE (tender_id, user_id, tier)
);

-- Indexes for performance
CREATE INDEX idx_tender_evaluation_committees_tender ON tender_evaluation_committees(tender_id);
CREATE INDEX idx_tender_evaluation_committees_user ON tender_evaluation_committees(user_id);
CREATE INDEX idx_tender_evaluation_committees_tier ON tender_evaluation_committees(tier);

-- 2. Add the new tender status 'pre_qual_eval' to the master table (if not present)
INSERT INTO tender_status_master (code) VALUES ('pre_qual_eval') ON CONFLICT DO NOTHING;
