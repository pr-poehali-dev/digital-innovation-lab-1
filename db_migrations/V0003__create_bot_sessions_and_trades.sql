CREATE TABLE IF NOT EXISTS bot_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_name TEXT NOT NULL,
  strategy TEXT NOT NULL,
  asset TEXT NOT NULL,
  bet_amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'RUB',
  is_demo BOOLEAN NOT NULL DEFAULT true,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  total_trades INT NOT NULL DEFAULT 0,
  wins INT NOT NULL DEFAULT 0,
  losses INT NOT NULL DEFAULT 0,
  total_profit NUMERIC NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS bot_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES bot_sessions(id),
  traded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  asset TEXT NOT NULL,
  direction TEXT NOT NULL,
  bet NUMERIC NOT NULL,
  payout_pct NUMERIC NOT NULL,
  won BOOLEAN NOT NULL,
  profit NUMERIC NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bot_trades_session_id ON bot_trades(session_id);
CREATE INDEX IF NOT EXISTS idx_bot_sessions_started_at ON bot_sessions(started_at DESC);
