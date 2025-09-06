-- Add Web3 fields to existing tables

-- Add wallet and ENS fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wallet_address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ens_name TEXT;

-- Add Web3 fields to talents table  
ALTER TABLE talents ADD COLUMN IF NOT EXISTS pok_tokens TEXT[] DEFAULT '{}';
ALTER TABLE talents ADD COLUMN IF NOT EXISTS pos_tokens TEXT[] DEFAULT '{}';

-- Add job management fields to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS talent_id UUID REFERENCES auth.users(id);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS engagement_type TEXT CHECK (engagement_type IN ('fulltime', 'parttime', 'contract', 'freelance'));
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS hours_per_week INTEGER;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS rate DECIMAL(10,2);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_wallet_address ON profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_profiles_ens_name ON profiles(ens_name);
CREATE INDEX IF NOT EXISTS idx_jobs_talent_id ON jobs(talent_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);

-- Update RLS policies for new fields
ALTER POLICY "Users can view own profile" ON profiles USING (auth.uid() = id);
ALTER POLICY "Users can update own profile" ON profiles USING (auth.uid() = id);

-- Add RLS policy for jobs table
CREATE POLICY "Users can view jobs assigned to them" ON jobs
  FOR SELECT USING (talent_id = auth.uid() OR employer_id = auth.uid());

CREATE POLICY "Employers can create jobs" ON jobs
  FOR INSERT WITH CHECK (employer_id = auth.uid());

CREATE POLICY "Users can update jobs they're involved in" ON jobs
  FOR UPDATE USING (talent_id = auth.uid() OR employer_id = auth.uid());
