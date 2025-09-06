-- Add NFT-related fields to quiz_attempts table
ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS nft_token_uri TEXT,
ADD COLUMN IF NOT EXISTS nft_token_id TEXT,
ADD COLUMN IF NOT EXISTS nft_tx_hash TEXT,
ADD COLUMN IF NOT EXISTS nft_minted_at TIMESTAMP WITH TIME ZONE;

-- Add NFT-related fields to project_submissions table  
ALTER TABLE project_submissions
ADD COLUMN IF NOT EXISTS nft_token_uri TEXT,
ADD COLUMN IF NOT EXISTS nft_token_id TEXT,
ADD COLUMN IF NOT EXISTS nft_tx_hash TEXT,
ADD COLUMN IF NOT EXISTS nft_minted_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster NFT queries
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_nft_token_id ON quiz_attempts(nft_token_id);
CREATE INDEX IF NOT EXISTS idx_project_submissions_nft_token_id ON project_submissions(nft_token_id);
