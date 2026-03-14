-- Phase 13: Catalogue & Guided Buying

CREATE TABLE IF NOT EXISTS catalogue_categories (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT        NOT NULL,
    parent_id       UUID        REFERENCES catalogue_categories(id),
    description     TEXT,
    icon            TEXT,
    sort_order      INT         DEFAULT 0,
    is_active       BOOLEAN     DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS catalogue_items (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_org_id   UUID        NOT NULL REFERENCES organizations(id),
    category_id     UUID        REFERENCES catalogue_categories(id),
    name            TEXT        NOT NULL,
    description     TEXT,
    sku             TEXT,
    unit            TEXT        NOT NULL DEFAULT 'each',
    unit_price      NUMERIC(15,2) NOT NULL,
    currency        TEXT        DEFAULT 'BDT',
    min_order_qty   NUMERIC(12,3) DEFAULT 1,
    lead_time_days  INT,
    image_url       TEXT,
    specifications  JSONB,
    is_active       BOOLEAN     DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add FK from vendor_categories_map now that catalogue_categories exists
ALTER TABLE vendor_categories_map
    ADD CONSTRAINT vendor_categories_map_category_fkey
    FOREIGN KEY (category_id) REFERENCES catalogue_categories(id);
