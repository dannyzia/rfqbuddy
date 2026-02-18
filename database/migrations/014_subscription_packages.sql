-- Migration: 014_subscription_packages.sql
-- Subscription packages, per-org subscriptions, storage and quota tracking.
-- Uses 'organizations' (American spelling) matching schema.sql.

BEGIN;

CREATE TABLE IF NOT EXISTS subscription_packages (
    id                           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code                         VARCHAR(20) NOT NULL UNIQUE,
    name                         TEXT NOT NULL,
    weekly_simple_rfq_limit      INTEGER,        -- NULL = unlimited
    weekly_detailed_tender_limit INTEGER,        -- NULL = unlimited
    storage_limit_bytes          BIGINT,         -- NULL = custom/negotiated
    live_tendering_enabled       BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order                   INTEGER NOT NULL DEFAULT 0,
    is_active                    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at                   TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO subscription_packages
    (code, name, weekly_simple_rfq_limit, weekly_detailed_tender_limit,
     storage_limit_bytes, live_tendering_enabled, sort_order)
VALUES
    ('free_try', 'Free to Try', 2, 1,   52428800,   FALSE, 1), -- 50 MB
    ('silver',   'Silver',      NULL, NULL, 104857600, TRUE, 2), -- 100 MB
    ('gold',     'Gold',        NULL, NULL, 524288000, TRUE, 3), -- 500 MB
    ('platinum', 'Platinum',    NULL, NULL, 1073741824, TRUE, 4), -- 1 GB
    ('custom',   'Custom',      NULL, NULL, NULL,      TRUE, 5)
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS organization_subscriptions (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id  UUID NOT NULL UNIQUE
                       REFERENCES organizations(id) ON DELETE CASCADE,
    package_id       UUID NOT NULL REFERENCES subscription_packages(id),
    custom_storage_bytes BIGINT,      -- Only used for 'custom' package
    starts_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at       TIMESTAMPTZ,    -- NULL = perpetual/auto-renewing
    status           TEXT NOT NULL DEFAULT 'active'
                       CHECK (status IN ('active','expired','cancelled','trial')),
    created_by       UUID REFERENCES users(id),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_org_subs_org    ON organization_subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_subs_status ON organization_subscriptions(status);

-- Tracks total bytes uploaded per organization (running total, not per-tender)
CREATE TABLE IF NOT EXISTS organization_storage_usage (
    organization_id    UUID PRIMARY KEY
                         REFERENCES organizations(id) ON DELETE CASCADE,
    used_bytes         BIGINT NOT NULL DEFAULT 0,
    last_calculated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tracks RFQ/tender creations per rolling week per organization
CREATE TABLE IF NOT EXISTS tender_quota_usage (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id  UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    week_start       DATE NOT NULL,         -- Monday 00:00 UTC
    simple_rfq_count INTEGER NOT NULL DEFAULT 0,
    detailed_tender_count INTEGER NOT NULL DEFAULT 0,
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (organization_id, week_start)
);

CREATE INDEX IF NOT EXISTS idx_quota_org_week
    ON tender_quota_usage(organization_id, week_start);

-- File upload metadata — tracks every uploaded file for storage accounting
-- (No equivalent table exists in current schema; this is new)
CREATE TABLE IF NOT EXISTS file_uploads (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    tender_id       UUID REFERENCES tenders(id) ON DELETE SET NULL,
    uploaded_by     UUID NOT NULL REFERENCES users(id),
    original_name   TEXT NOT NULL,
    stored_key      TEXT NOT NULL UNIQUE, -- S3/MinIO object key (UUID-based)
    mime_type       TEXT,
    file_size_bytes BIGINT NOT NULL,
    upload_path     TEXT,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at       TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_file_uploads_org ON file_uploads(organization_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_tender ON file_uploads(tender_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_deleted ON file_uploads(is_deleted);

COMMIT;
