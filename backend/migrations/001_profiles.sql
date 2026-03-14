-- Phase 2: Authentication & RBAC
-- Better Auth manages the core users/sessions tables automatically.
-- This creates the app-specific profiles extension.

CREATE TABLE IF NOT EXISTS public.profiles (
    id              UUID        PRIMARY KEY,
    full_name       TEXT        NOT NULL,
    email           TEXT        NOT NULL UNIQUE,
    phone           TEXT,
    avatar_url      TEXT,
    role            TEXT        NOT NULL CHECK (role IN (
        'pe_admin', 'procurer', 'procurement_head',
        'prequal_evaluator', 'tech_evaluator', 'commercial_evaluator',
        'auditor', 'vendor_admin', 'sales_executive', 'sales_manager',
        'super_admin'
    )),
    org_id          UUID,  -- FK added after organizations table exists
    status          TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
