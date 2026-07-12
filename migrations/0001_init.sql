-- Confessions submitted through the postcard modal + shown on the wall.
CREATE TABLE IF NOT EXISTS confessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_confessions_created ON confessions (created_at DESC);

-- Leads captured by the "For Founders / For VC Firms" CTA form.
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT NOT NULL,
  message TEXT,
  audience TEXT NOT NULL DEFAULT 'founders',
  created_at INTEGER NOT NULL
);
