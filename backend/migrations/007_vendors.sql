-- Phase 8: Vendor Management & SRM

CREATE TABLE IF NOT EXISTS vendor_enlistments (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_org_id   UUID        NOT NULL REFERENCES organizations(id),
    buyer_org_id    UUID        NOT NULL REFERENCES organizations(id),
    form_id         UUID,
    status          TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'under_review', 'approved', 'rejected', 'expired'
    )),
    submitted_data  JSONB,
    reviewed_by     UUID        REFERENCES profiles(id),
    reviewed_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(vendor_org_id, buyer_org_id)
);

CREATE TABLE IF NOT EXISTS vendor_performance_reviews (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_org_id   UUID        NOT NULL REFERENCES organizations(id),
    buyer_org_id    UUID        NOT NULL REFERENCES organizations(id),
    contract_id     UUID        REFERENCES contracts(id),
    quality_score   NUMERIC(3,1),
    delivery_score  NUMERIC(3,1),
    communication_score NUMERIC(3,1),
    overall_score   NUMERIC(3,1),
    comments        TEXT,
    reviewed_by     UUID        REFERENCES profiles(id),
    review_period   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vendor_categories_map (
    vendor_org_id   UUID        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    category_id     UUID        NOT NULL,  -- FK added after catalogue_categories exists
    PRIMARY KEY (vendor_org_id, category_id)
);
