-- Phase 3: Multi-Tenant Organisation Model

CREATE TABLE IF NOT EXISTS organizations (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT        NOT NULL,
    type            TEXT        NOT NULL CHECK (type IN ('procuring_entity', 'vendor')),
    registration_no TEXT,
    tax_id          TEXT,
    address         JSONB,
    contact_email   TEXT,
    contact_phone   TEXT,
    website         TEXT,
    logo_url        TEXT,
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    status          TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    subscription_tier TEXT      DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'professional', 'enterprise')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add FK from profiles to organizations
ALTER TABLE profiles ADD CONSTRAINT profiles_org_id_fkey
    FOREIGN KEY (org_id) REFERENCES organizations(id);

CREATE TABLE IF NOT EXISTS org_members (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id          UUID        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id         UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role            TEXT        NOT NULL,
    invited_by      UUID        REFERENCES profiles(id),
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(org_id, user_id)
);

CREATE TABLE IF NOT EXISTS vendor_profiles (
    org_id              UUID    PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
    business_type       TEXT,
    year_established    INT,
    employee_count      TEXT,
    annual_revenue      TEXT,
    categories          TEXT[],
    certifications      JSONB,
    bank_details        JSONB,
    insurance_details   JSONB,
    srm_score           NUMERIC(3,1) DEFAULT 0.0,
    risk_level          TEXT    DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    kyc_status          TEXT    DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'failed', 'expired')),
    kyc_verified_at     TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
