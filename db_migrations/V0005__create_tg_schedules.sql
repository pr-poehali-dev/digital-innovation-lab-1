CREATE TABLE IF NOT EXISTS t_p65948304_digital_innovation_l.tg_schedules (
    id SERIAL PRIMARY KEY,
    tg_token TEXT NOT NULL,
    tg_chat_id TEXT NOT NULL,
    report_time TEXT NOT NULL DEFAULT '22:00',
    journal_url TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tg_chat_id)
);