-- Phase 7: Award & Contract Management

CREATE TABLE IF NOT EXISTS contracts (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number     TEXT        NOT NULL UNIQUE,
    tender_id           UUID        NOT NULL REFERENCES tenders(id),
    vendor_org_id       UUID        NOT NULL REFERENCES organizations(id),
    bid_id              UUID        REFERENCES bids(id),
    buyer_org_id        UUID        NOT NULL REFERENCES organizations(id),
    title               TEXT        NOT NULL,
    status              TEXT        NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'pending_signature', 'active', 'completed',
        'terminated', 'suspended', 'expired'
    )),
    contract_value      NUMERIC(15,2) NOT NULL,
    currency            TEXT        NOT NULL DEFAULT 'BDT',
    start_date          DATE        NOT NULL,
    end_date            DATE        NOT NULL,
    performance_score   NUMERIC(3,1) DEFAULT 0.0,
    signed_at           TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contract_milestones (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id     UUID        NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    title           TEXT        NOT NULL,
    description     TEXT,
    due_date        DATE        NOT NULL,
    amount          NUMERIC(15,2),
    status          TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'in_progress', 'completed', 'delayed', 'cancelled'
    )),
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contract_variations (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id     UUID        NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    variation_number TEXT       NOT NULL,
    reason          TEXT        NOT NULL,
    amount_change   NUMERIC(15,2),
    time_extension_days INT,
    status          TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'approved', 'rejected'
    )),
    requested_by    UUID        REFERENCES profiles(id),
    approved_by     UUID        REFERENCES profiles(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payment_certificates (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id     UUID        NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    certificate_no  TEXT        NOT NULL,
    milestone_id    UUID        REFERENCES contract_milestones(id),
    amount          NUMERIC(15,2) NOT NULL,
    status          TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'approved', 'paid', 'rejected'
    )),
    submitted_by    UUID        REFERENCES profiles(id),
    approved_by     UUID        REFERENCES profiles(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
