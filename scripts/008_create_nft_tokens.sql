-- Create nft_tokens table to track POK/POS NFTs
create table if not exists public.nft_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  token_type text check (token_type in ('pok', 'pos')) not null,
  token_id text not null, -- Blockchain token ID
  contract_address text not null,
  chain text not null default 'polygon', -- blockchain network
  metadata jsonb not null, -- NFT metadata (title, description, image, etc.)
  quiz_attempt_id uuid references public.quiz_attempts(id),
  project_submission_id uuid references public.project_submissions(id),
  minted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure either quiz_attempt_id or project_submission_id is set
  check (
    (token_type = 'pok' and quiz_attempt_id is not null and project_submission_id is null) or
    (token_type = 'pos' and project_submission_id is not null and quiz_attempt_id is null)
  )
);

-- Enable RLS
alter table public.nft_tokens enable row level security;

-- RLS policies for NFT tokens
create policy "nft_tokens_select_own"
  on public.nft_tokens for select
  using (auth.uid() = user_id);

create policy "nft_tokens_insert_own"
  on public.nft_tokens for insert
  with check (auth.uid() = user_id);

-- Allow public read access for marketplace display
create policy "nft_tokens_select_public"
  on public.nft_tokens for select
  using (true);
