-- Run this SQL in your Supabase SQL Editor to create the events table

CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  date TEXT NOT NULL,
  time TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL CHECK (type IN ('care', 'doctor', 'note', 'vital', 'visitor', 'shift', 'status', 'meal', 'event')),
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  details TEXT NOT NULL DEFAULT '',
  meta JSONB DEFAULT '{}'::jsonb
);

-- Index for fast date queries
CREATE INDEX idx_events_date ON events(date);

-- Index for chronological ordering
CREATE INDEX idx_events_created_at ON events(created_at DESC);

-- Enable Row Level Security (public read/write for simplicity)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read and write (for family sharing)
CREATE POLICY "Allow all access" ON events
  FOR ALL
  USING (true)
  WITH CHECK (true);
