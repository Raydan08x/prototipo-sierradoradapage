CREATE TABLE IF NOT EXISTS gastrobar_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 80),
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS gastrobar_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 150),
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(12,2) CHECK (price >= 0),
  cost NUMERIC(16,6) CHECK (cost >= 0),
  category_id TEXT NOT NULL REFERENCES gastrobar_categories(id) ON DELETE RESTRICT,
  active BOOLEAN NOT NULL DEFAULT FALSE,
  available BOOLEAN NOT NULL DEFAULT TRUE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  image_url TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  extras_codes TEXT NOT NULL DEFAULT '',
  source_category TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (NOT active OR price IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS gastrobar_items_category ON gastrobar_items(category_id);
ALTER TABLE gastrobar_items ADD COLUMN IF NOT EXISTS recipe_notes TEXT NOT NULL DEFAULT '';

-- Separate from the prototype's generic data API; never publicly exposed.
CREATE TABLE IF NOT EXISTS gastrobar_admins (
  email TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE
);
