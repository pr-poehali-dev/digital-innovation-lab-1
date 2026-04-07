ALTER TABLE t_p65948304_digital_innovation_l.bot_trades
  ADD COLUMN IF NOT EXISTS strategy_name text,
  ADD COLUMN IF NOT EXISTS indicator_value text;