-- Phase 12: Support Ticketing

CREATE TABLE IF NOT EXISTS support_tickets (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number   TEXT        NOT NULL UNIQUE,
    subject         TEXT        NOT NULL,
    description     TEXT        NOT NULL,
    type            TEXT        NOT NULL CHECK (type IN ('bug', 'feature', 'general')),
    priority        TEXT        NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status          TEXT        NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    category        TEXT,
    submitted_by    UUID        NOT NULL REFERENCES profiles(id),
    assigned_to     UUID        REFERENCES profiles(id),
    org_id          UUID        REFERENCES organizations(id),
    resolved_at     TIMESTAMPTZ,
    closed_at       TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ticket_messages (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id       UUID        NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id       UUID        NOT NULL REFERENCES profiles(id),
    message         TEXT        NOT NULL,
    is_internal     BOOLEAN     DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
