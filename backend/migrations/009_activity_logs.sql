-- Phase 11: Activity Logs & Audit Trail

CREATE TABLE IF NOT EXISTS activity_logs (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        REFERENCES profiles(id),
    org_id          UUID        REFERENCES organizations(id),
    action          TEXT        NOT NULL,
    entity_type     TEXT        NOT NULL,
    entity_id       UUID,
    description     TEXT,
    metadata        JSONB,
    ip_address      INET,
    user_agent      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_user ON activity_logs(user_id, created_at DESC);
CREATE INDEX idx_activity_org  ON activity_logs(org_id, created_at DESC);
CREATE INDEX idx_activity_entity ON activity_logs(entity_type, entity_id);

CREATE TABLE IF NOT EXISTS admin_audit_log (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id        UUID        NOT NULL REFERENCES profiles(id),
    action          TEXT        NOT NULL,
    target_type     TEXT        NOT NULL,
    target_id       TEXT,
    payload         JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_admin  ON admin_audit_log(admin_id, created_at DESC);
CREATE INDEX idx_audit_target ON admin_audit_log(target_type, target_id);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
