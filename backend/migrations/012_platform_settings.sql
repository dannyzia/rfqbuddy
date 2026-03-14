-- Phase 16: Platform Settings & Analytics

CREATE TABLE IF NOT EXISTS platform_settings (
    key             TEXT        PRIMARY KEY,
    value           TEXT        NOT NULL,
    description     TEXT,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by      UUID        REFERENCES profiles(id)
);

INSERT INTO platform_settings (key, value, description) VALUES
('digest_interval_hours',   '6',        'Vendor RFQ digest interval in hours'),
('max_bids_per_rfq',        '50',       'Maximum bids allowed per RFQ'),
('default_currency',        'BDT',      'Default currency for new tenders'),
('maintenance_mode',        'false',    'Show maintenance banner if true'),
('platform_name',           'RFQ Hub','Platform display name'),
('support_email',           'support@rfqhub.com', 'Support contact email'),
('max_file_size_mb',        '25',       'Maximum file upload size in MB'),
('session_timeout_minutes', '60',       'Session timeout in minutes'),
('require_2fa_admin',       'true',     'Require 2FA for admin roles'),
('tender_auto_close',       'true',     'Auto-close tenders after deadline')
ON CONFLICT (key) DO NOTHING;

-- Phase 10: File attachments (generic)
CREATE TABLE IF NOT EXISTS file_attachments (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type     TEXT        NOT NULL,
    entity_id       UUID        NOT NULL,
    file_name       TEXT        NOT NULL,
    file_type       TEXT,
    file_size       BIGINT,
    storage_path    TEXT        NOT NULL,
    uploaded_by     UUID        REFERENCES profiles(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_file_attachments_entity ON file_attachments(entity_type, entity_id);

-- Phase 14: Analytics materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_procurement_stats AS
SELECT
    o.id AS org_id,
    COUNT(DISTINCT t.id) AS total_tenders,
    COUNT(DISTINCT t.id) FILTER (WHERE t.status IN ('published', 'open', 'under_evaluation')) AS active_tenders,
    COUNT(DISTINCT b.id) AS total_bids,
    AVG(b.total_amount) AS avg_bid_value,
    COUNT(DISTINCT c.id) AS total_contracts,
    SUM(c.contract_value) AS total_contract_value
FROM organizations o
LEFT JOIN tenders t ON t.buyer_org_id = o.id
LEFT JOIN bids b ON b.tender_id = t.id AND b.status != 'withdrawn'
LEFT JOIN contracts c ON c.buyer_org_id = o.id
WHERE o.type = 'procuring_entity'
GROUP BY o.id;
