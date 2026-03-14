-- Phase 5: Bid Submission & Management

CREATE TABLE IF NOT EXISTS bids (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    bid_number      TEXT        NOT NULL UNIQUE,
    tender_id       UUID        NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
    vendor_org_id   UUID        NOT NULL REFERENCES organizations(id),
    submitted_by    UUID        NOT NULL REFERENCES profiles(id),
    status          TEXT        NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'submitted', 'under_review', 'shortlisted',
        'technically_qualified', 'technically_disqualified',
        'commercially_evaluated', 'awarded', 'rejected', 'withdrawn'
    )),
    total_amount    NUMERIC(15,2),
    currency        TEXT        NOT NULL DEFAULT 'BDT',
    validity_days   INT         DEFAULT 90,
    technical_notes TEXT,
    compliance_declaration BOOLEAN DEFAULT FALSE,
    submitted_at    TIMESTAMPTZ,
    withdrawn_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tender_id, vendor_org_id)
);

CREATE INDEX idx_bids_tender ON bids(tender_id, vendor_org_id);

-- Auto-generate bid number
CREATE OR REPLACE FUNCTION generate_bid_number()
RETURNS trigger AS $$
DECLARE seq INT;
BEGIN
    SELECT COALESCE(MAX(CAST(SPLIT_PART(bid_number, '-', 3) AS INT)), 0) + 1
    INTO seq FROM bids
    WHERE bid_number LIKE 'BID-' || TO_CHAR(NOW(), 'YYYY') || '-%';
    NEW.bid_number := 'BID-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(seq::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_bid_number
    BEFORE INSERT ON bids FOR EACH ROW
    WHEN (NEW.bid_number IS NULL OR NEW.bid_number = '')
    EXECUTE FUNCTION generate_bid_number();

CREATE TABLE IF NOT EXISTS bid_items (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    bid_id          UUID        NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
    tender_item_id  UUID        NOT NULL REFERENCES tender_items(id),
    unit_price      NUMERIC(15,2) NOT NULL,
    quantity        NUMERIC(12,3) NOT NULL,
    total_price     NUMERIC(15,2) GENERATED ALWAYS AS (unit_price * quantity) STORED,
    brand           TEXT,
    model           TEXT,
    origin_country  TEXT,
    delivery_days   INT,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bid_documents (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    bid_id          UUID        NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
    file_name       TEXT        NOT NULL,
    file_type       TEXT,
    file_size       BIGINT,
    storage_path    TEXT        NOT NULL,
    document_type   TEXT        DEFAULT 'general' CHECK (document_type IN (
        'technical_proposal', 'commercial_proposal', 'certificate',
        'company_profile', 'experience', 'financial_statement', 'general'
    )),
    uploaded_by     UUID        REFERENCES profiles(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
