-- Phase 6: Evaluation Workflow

CREATE TABLE IF NOT EXISTS evaluation_criteria (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id       UUID        NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
    stage           TEXT        NOT NULL CHECK (stage IN ('prequalification', 'technical', 'commercial')),
    criterion_name  TEXT        NOT NULL,
    max_score       NUMERIC(5,2) NOT NULL,
    weight          NUMERIC(5,2) DEFAULT 1.0,
    description     TEXT,
    is_pass_fail    BOOLEAN     DEFAULT FALSE,
    sort_order      INT         DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS evaluation_scores (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id       UUID        NOT NULL REFERENCES tenders(id),
    bid_id          UUID        NOT NULL REFERENCES bids(id),
    criterion_id    UUID        NOT NULL REFERENCES evaluation_criteria(id),
    evaluator_id    UUID        NOT NULL REFERENCES profiles(id),
    score           NUMERIC(5,2),
    remarks         TEXT,
    scored_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(bid_id, criterion_id, evaluator_id)
);

CREATE TABLE IF NOT EXISTS evaluation_results (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id       UUID        NOT NULL REFERENCES tenders(id),
    bid_id          UUID        NOT NULL REFERENCES bids(id),
    stage           TEXT        NOT NULL,
    total_score     NUMERIC(6,2),
    max_possible    NUMERIC(6,2),
    percentage      NUMERIC(5,2),
    passed          BOOLEAN,
    evaluated_by    UUID        REFERENCES profiles(id),
    remarks         TEXT,
    evaluated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tender_id, bid_id, stage)
);

CREATE TABLE IF NOT EXISTS workflow_transitions (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id       UUID        NOT NULL REFERENCES tenders(id),
    from_stage      TEXT        NOT NULL,
    to_stage        TEXT        NOT NULL,
    from_user       UUID        NOT NULL REFERENCES profiles(id),
    to_user         UUID        REFERENCES profiles(id),
    notes           TEXT,
    transitioned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
