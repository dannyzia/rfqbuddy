-- Phase 9: Notifications

CREATE TABLE IF NOT EXISTS notifications (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id    UUID        NOT NULL REFERENCES profiles(id),
    type            TEXT        NOT NULL,
    title           TEXT        NOT NULL,
    message         TEXT,
    payload         JSONB,
    channel         TEXT        NOT NULL DEFAULT 'in_app' CHECK (channel IN ('in_app', 'email', 'both')),
    is_read         BOOLEAN     NOT NULL DEFAULT FALSE,
    read_at         TIMESTAMPTZ,
    email_sent      BOOLEAN     DEFAULT FALSE,
    email_sent_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, is_read);

CREATE TABLE IF NOT EXISTS email_templates (
    key             TEXT        PRIMARY KEY,
    subject         TEXT        NOT NULL,
    html_body       TEXT        NOT NULL,
    variables       TEXT[],
    description     TEXT,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by      UUID        REFERENCES profiles(id)
);

-- Seed default templates
INSERT INTO email_templates (key, subject, html_body, variables, description) VALUES
('tender_published', 'New RFQ Published: {{tender_title}}',
 '<h2>{{tender_title}}</h2><p>Deadline: {{deadline}}</p><p><a href="{{link}}">View Details</a></p>',
 ARRAY['tender_title', 'deadline', 'link', 'vendor_name'],
 'Sent to invited vendors when a tender is published'),
('bid_confirmation', 'Bid Submitted: {{tender_title}}',
 '<h2>Bid Confirmation</h2><p>Your bid #{{bid_number}} for {{tender_title}} has been received.</p>',
 ARRAY['bid_number', 'tender_title', 'amount', 'vendor_name'],
 'Sent to vendor after successful bid submission'),
('evaluation_complete', 'Evaluation Complete: {{tender_title}}',
 '<h2>Evaluation Results</h2><p>The evaluation for {{tender_title}} has been completed.</p>',
 ARRAY['tender_title', 'stage', 'result', 'link'],
 'Sent to procurer when an evaluation stage finishes'),
('welcome_email', 'Welcome to RFQ Hub',
 '<h2>Welcome, {{name}}!</h2><p>Your account has been created.</p>',
 ARRAY['name', 'email', 'login_url'],
 'Sent when admin creates a new user account'),
('account_approved', 'Your RFQ Hub Account is Approved',
 '<h2>Account Approved</h2><p>Hello {{name}}, your registration has been approved.</p><p><a href="{{login_url}}">Log in</a></p>',
 ARRAY['name', 'login_url'],
 'Sent when admin approves a self-registered user')
ON CONFLICT (key) DO NOTHING;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY notifications_select_own ON notifications FOR SELECT
    USING (recipient_id = current_setting('app.current_user_id')::uuid);
