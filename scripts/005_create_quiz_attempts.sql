-- Create quiz_attempts table to track user quiz attempts
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  answers jsonb not null, -- User's answers
  score integer not null,
  passed boolean not null,
  time_taken_minutes integer,
  pok_points_earned integer default 0,
  nft_minted boolean default false,
  nft_token_id text,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Prevent multiple attempts (can be modified later for retakes)
  unique(user_id, quiz_id)
);

-- Enable RLS
alter table public.quiz_attempts enable row level security;

-- RLS policies for quiz attempts
create policy "quiz_attempts_select_own"
  on public.quiz_attempts for select
  using (auth.uid() = user_id);

create policy "quiz_attempts_insert_own"
  on public.quiz_attempts for insert
  with check (auth.uid() = user_id);

create policy "quiz_attempts_update_own"
  on public.quiz_attempts for update
  using (auth.uid() = user_id);
