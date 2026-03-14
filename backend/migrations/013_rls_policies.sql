-- RLS Policies -- Apply after all tables exist
-- These use current_setting('app.current_user_id') which must be set
-- by the Fastify middleware before each request using SET LOCAL.

-- Profiles: users see own, admins see all
CREATE POLICY profiles_select_own ON profiles FOR SELECT
    USING (id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY profiles_select_same_org ON profiles FOR SELECT
    USING (org_id = (
        SELECT org_id FROM profiles WHERE id = current_setting('app.current_user_id', true)::uuid
    ));

CREATE POLICY profiles_select_admin ON profiles FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = current_setting('app.current_user_id', true)::uuid AND role = 'super_admin'
    ));

-- Tenders: org members see their org's tenders, invited vendors see theirs
CREATE POLICY tenders_select_org ON tenders FOR SELECT
    USING (
        buyer_org_id = (
            SELECT org_id FROM profiles WHERE id = current_setting('app.current_user_id', true)::uuid
        )
        OR EXISTS (
            SELECT 1 FROM tender_invitations ti
            WHERE ti.tender_id = id
            AND ti.vendor_org_id = (
                SELECT org_id FROM profiles WHERE id = current_setting('app.current_user_id', true)::uuid
            )
        )
        OR EXISTS (
            SELECT 1 FROM profiles WHERE id = current_setting('app.current_user_id', true)::uuid AND role = 'super_admin'
        )
    );

-- Bids: vendors see own, buyers see bids on their tenders
CREATE POLICY bids_select ON bids FOR SELECT
    USING (
        vendor_org_id = (
            SELECT org_id FROM profiles WHERE id = current_setting('app.current_user_id', true)::uuid
        )
        OR tender_id IN (
            SELECT id FROM tenders WHERE buyer_org_id = (
                SELECT org_id FROM profiles WHERE id = current_setting('app.current_user_id', true)::uuid
            )
        )
        OR EXISTS (
            SELECT 1 FROM profiles WHERE id = current_setting('app.current_user_id', true)::uuid AND role = 'super_admin'
        )
    );

-- Contracts: both parties can see
CREATE POLICY contracts_select ON contracts FOR SELECT
    USING (
        buyer_org_id = (SELECT org_id FROM profiles WHERE id = current_setting('app.current_user_id', true)::uuid)
        OR vendor_org_id = (SELECT org_id FROM profiles WHERE id = current_setting('app.current_user_id', true)::uuid)
        OR EXISTS (
            SELECT 1 FROM profiles WHERE id = current_setting('app.current_user_id', true)::uuid AND role = 'super_admin'
        )
    );

-- Activity logs: users see own org, admins see all
CREATE POLICY activity_logs_select ON activity_logs FOR SELECT
    USING (
        org_id = (SELECT org_id FROM profiles WHERE id = current_setting('app.current_user_id', true)::uuid)
        OR EXISTS (
            SELECT 1 FROM profiles WHERE id = current_setting('app.current_user_id', true)::uuid AND role = 'super_admin'
        )
    );
