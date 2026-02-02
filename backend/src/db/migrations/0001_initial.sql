-- IFA Etsy Plugin - Initial Schema

-- Sellers (users)
CREATE TABLE IF NOT EXISTS sellers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'active' NOT NULL,
  plan TEXT DEFAULT 'free' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Etsy OAuth connections
CREATE TABLE IF NOT EXISTS etsy_connections (
  id TEXT PRIMARY KEY,
  seller_id TEXT NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  shop_id TEXT NOT NULL,
  shop_name TEXT,
  access_token_encrypted TEXT NOT NULL,
  refresh_token_encrypted TEXT NOT NULL,
  token_expires_at TIMESTAMPTZ NOT NULL,
  scopes TEXT[],
  status TEXT DEFAULT 'active' NOT NULL,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(seller_id, shop_id)
);

-- Synced products
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  seller_id TEXT NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  etsy_listing_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2),
  quantity INTEGER,
  state TEXT,
  tags TEXT[],
  images JSONB DEFAULT '[]',
  raw_data JSONB,
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(seller_id, etsy_listing_id)
);

-- Agents (one per seller)
CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  seller_id TEXT UNIQUE NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'provisioning' NOT NULL,
  workspace_path TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  soul_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Agent sessions (OpenClaw session tracking)
CREATE TABLE IF NOT EXISTS agent_sessions (
  agent_id TEXT PRIMARY KEY REFERENCES agents(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  last_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Agent message queue
CREATE TABLE IF NOT EXISTS agent_inbox (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'queued' NOT NULL,
  priority INTEGER DEFAULT 0 NOT NULL,
  source TEXT,
  attempt_count INTEGER DEFAULT 0 NOT NULL,
  available_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  processed_at TIMESTAMPTZ
);

-- Agent events (activity log)
CREATE TABLE IF NOT EXISTS agent_events (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  content TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Agent runs (track each execution)
CREATE TABLE IF NOT EXISTS agent_runs (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  inbox_id TEXT REFERENCES agent_inbox(id),
  status TEXT DEFAULT 'starting' NOT NULL,
  pid INTEGER,
  started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  finished_at TIMESTAMPTZ,
  exit_code INTEGER,
  signal TEXT,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Messaging channels
CREATE TABLE IF NOT EXISTS messaging_channels (
  id TEXT PRIMARY KEY,
  seller_id TEXT NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  platform_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(seller_id, platform)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_etsy_connections_seller ON etsy_connections(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_agent_inbox_status ON agent_inbox(status, available_at);
CREATE INDEX IF NOT EXISTS idx_agent_inbox_agent ON agent_inbox(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_events_agent ON agent_events(agent_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_runs_agent ON agent_runs(agent_id, status);
