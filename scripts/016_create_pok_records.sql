-- Create pok_records table for Story Protocol integration
CREATE TABLE IF NOT EXISTS pok_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  tx_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pok_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own POK records" ON pok_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own POK records" ON pok_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pok_records_user_id ON pok_records(user_id);
CREATE INDEX IF NOT EXISTS idx_pok_records_quiz_id ON pok_records(quiz_id);
CREATE INDEX IF NOT EXISTS idx_pok_records_score ON pok_records(score DESC);
