-- Phase 4: Tender/RFQ Lifecycle

CREATE TABLE IF NOT EXISTS tenders (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_number       TEXT        NOT NULL UNIQUE,
    title               TEXT        NOT NULL,
    description         TEXT,
    tender_type         TEXT        NOT NULL CHECK (tender_type IN (
        'nrq1_simple', 'nrq2_detailed', 'nrq3_custom', 'rfp',
        'framework_agreement', 'catalogue_order'
    )),
    status              TEXT        NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'published', 'open', 'under_evaluation',
        'pending_prequal', 'pending_tech_eval', 'pending_commercial_eval',
        'pending_audit', 'pending_approval',
        'awarded', 'closed', 'cancelled', 'withheld'
    )),
    buyer_org_id        UUID        NOT NULL REFERENCES organizations(id),
    created_by          UUID        NOT NULL REFERENCES profiles(id),
    currency            TEXT        NOT NULL DEFAULT 'BDT',
    estimated_value     NUMERIC(15,2),
    submission_deadline TIMESTAMPTZ NOT NULL,
    opening_date        TIMESTAMPTZ,
    validity_days       INT         DEFAULT 90,
    eval_method         TEXT        DEFAULT 'lowest_price' CHECK (eval_method IN (
        'lowest_price', 'qcbs', 'technical_only', 'custom_weighted'
    )),
    tech_weight         NUMERIC(5,2) DEFAULT 70.00,
    commercial_weight   NUMERIC(5,2) DEFAULT 30.00,
    pass_fail_threshold NUMERIC(5,2) DEFAULT 70.00,
    current_stage       TEXT,
    forwarded_to        UUID        REFERENCES profiles(id),
    forwarded_at        TIMESTAMPTZ,
    categories          TEXT[],
    tags                TEXT[],
    terms_conditions    TEXT,
    is_published        BOOLEAN     DEFAULT FALSE,
    published_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tenders_status_org ON tenders(status, buyer_org_id);

-- Auto-generate tender number
CREATE OR REPLACE FUNCTION generate_tender_number()
RETURNS trigger AS $$
DECLARE seq INT;
BEGIN
    SELECT COALESCE(MAX(CAST(SPLIT_PART(tender_number, '-', 3) AS INT)), 0) + 1
    INTO seq FROM tenders
    WHERE tender_number LIKE 'RFQ-' || TO_CHAR(NOW(), 'YYYY') || '-%';
    NEW.tender_number := 'RFQ-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(seq::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_tender_number
    BEFORE INSERT ON tenders FOR EACH ROW
    WHEN (NEW.tender_number IS NULL OR NEW.tender_number = '')
    EXECUTE FUNCTION generate_tender_number();

-- Tender line items
CREATE TABLE IF NOT EXISTS tender_items (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id       UUID        NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
    item_number     INT         NOT NULL,
    description     TEXT        NOT NULL,
    specification   TEXT,
    unit            TEXT        NOT NULL DEFAULT 'each',
    quantity        NUMERIC(12,3) NOT NULL,
    estimated_price NUMERIC(15,2),
    category        TEXT,
    is_mandatory    BOOLEAN     DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tender_id, item_number)
);

-- Evaluator assignments
CREATE TABLE IF NOT EXISTS tender_assignments (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id       UUID        NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
    user_id         UUID        NOT NULL REFERENCES profiles(id),
    role            TEXT        NOT NULL,
    assigned_by     UUID        REFERENCES profiles(id),
    assigned_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tender_id, user_id, role)
);

-- Vendor invitations
CREATE TABLE IF NOT EXISTS tender_invitations (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id       UUID        NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
    vendor_org_id   UUID        NOT NULL REFERENCES organizations(id),
    invited_by      UUID        REFERENCES profiles(id),
    invitation_sent BOOLEAN     DEFAULT FALSE,
    sent_at         TIMESTAMPTZ,
    viewed_at       TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tender_id, vendor_org_id)
);

-- Tender documents (metadata -- files in Cloudflare R2)
CREATE TABLE IF NOT EXISTS tender_documents (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id       UUID        NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
    file_name       TEXT        NOT NULL,
    file_type       TEXT,
    file_size       BIGINT,
    storage_path    TEXT        NOT NULL,
    uploaded_by     UUID        REFERENCES profiles(id),
    document_type   TEXT        DEFAULT 'general' CHECK (document_type IN (
        'general', 'specification', 'terms', 'drawing', 'sample', 'addendum'
    )),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;
