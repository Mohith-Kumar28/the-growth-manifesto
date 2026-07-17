-- Like/unlike support for confessions, and a place for the founder/VC
-- intake forms to store their extra structured answers.
ALTER TABLE confessions ADD COLUMN likes_count INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS confession_likes (
  confession_id INTEGER NOT NULL,
  fingerprint TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (confession_id, fingerprint)
);

ALTER TABLE leads ADD COLUMN details TEXT;
