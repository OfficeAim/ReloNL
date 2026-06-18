-- ============================================================
-- ReloNL — Supabase Schema v1.0
-- Run this in the Supabase SQL Editor to initialize the database.
-- ============================================================

-- Client-side event logs (batched from browser localStorage)
CREATE TABLE IF NOT EXISTS client_logs (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    user_id     TEXT,                           -- email from wizard onboarding
    session_id  TEXT,                           -- sess_<timestamp>
    event_type  TEXT NOT NULL,                  -- 'page_loaded', 'badge_generated', etc.
    payload     JSONB,                          -- arbitrary event data
    app_version TEXT DEFAULT '1.0-minimax',
    ip_hash     TEXT                            -- SHA256 of IP, for dedup (never raw IP)
);

-- Index for querying by event type and date
CREATE INDEX IF NOT EXISTS client_logs_event_type_idx ON client_logs (event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS client_logs_user_idx ON client_logs (user_id);

-- Google-authenticated user accounts (Gems system)
CREATE TABLE IF NOT EXISTS gem_accounts (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    google_id   TEXT UNIQUE NOT NULL,           -- from Google ID token 'sub' claim
    email       TEXT,
    display_name TEXT,
    avatar_url  TEXT,
    balance     INTEGER DEFAULT 3 CHECK (balance >= 0),  -- 3 free gems on signup
    tier        TEXT DEFAULT 'free' CHECK (tier IN ('free', 'partner', 'pro'))
);

-- Gem usage transactions (debit = usage, credit = top-up)
CREATE TABLE IF NOT EXISTS gem_transactions (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    account_id  UUID NOT NULL REFERENCES gem_accounts(id) ON DELETE CASCADE,
    gem_feature TEXT NOT NULL CHECK (gem_feature IN (
        'contract_analyzer',
        'bsn_navigator',
        'legal_coach',
        'letter_generator_ai',
        'credit_purchase',
        'signup_bonus'
    )),
    delta       INTEGER NOT NULL,               -- negative = usage, positive = credit
    note        TEXT                            -- optional description
);

-- B2B partnership inquiries (from University White-Label form)
CREATE TABLE IF NOT EXISTS b2b_inquiries (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    university  TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_person TEXT,
    student_population INTEGER,
    status      TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'demo_scheduled', 'signed', 'declined'))
);

-- Landlord property listings (from WWSO section form)
CREATE TABLE IF NOT EXISTS landlord_listings (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    address     TEXT NOT NULL,
    property_type TEXT,
    current_rent NUMERIC,
    contact_email TEXT NOT NULL,
    status      TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'wwso_verified', 'live', 'archived'))
);

-- ============================================================
-- Row Level Security (RLS) — Phase 2 policy definitions
-- Enable after Supabase Auth is configured
-- ============================================================

-- ALTER TABLE client_logs ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Service role only" ON client_logs FOR ALL USING (auth.role() = 'service_role');

-- ALTER TABLE gem_accounts ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can see own account" ON gem_accounts
--   FOR SELECT USING (google_id = current_setting('app.google_id', true));

-- ALTER TABLE gem_transactions ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can see own transactions" ON gem_transactions
--   FOR SELECT USING (account_id IN (
--     SELECT id FROM gem_accounts WHERE google_id = current_setting('app.google_id', true)
--   ));
