-- Robust-ish per-user identity (hash of IP + user-agent + language) for
-- rate limiting without login. Not 100% accurate by design.
ALTER TABLE confessions ADD COLUMN fingerprint TEXT;
ALTER TABLE leads ADD COLUMN fingerprint TEXT;

CREATE INDEX IF NOT EXISTS idx_confessions_fp ON confessions (fingerprint, created_at);
CREATE INDEX IF NOT EXISTS idx_leads_fp ON leads (fingerprint, created_at);
