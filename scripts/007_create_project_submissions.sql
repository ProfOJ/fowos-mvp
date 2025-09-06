-- Create project_submissions table to track user project submissions
create table if not exists public.project_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  submission_url text not null, -- GitHub repo, live demo, etc.
  description text,
  deliverables jsonb, -- Submitted deliverables
  status text check (status in ('submitted', 'under_review', 'approved', 'rejected')) default 'submitted',
  reviewer_id uuid references public.profiles(id),
  review_notes text,
  score integer, -- 0-100
  pos_points_earned integer default 0,
  nft_minted boolean default false,
  nft_token_id text,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  reviewed_at timestamp with time zone,
  
  -- Prevent multiple submissions (can be modified later)
  unique(user_id, project_id)
);

-- Enable RLS
alter table public.project_submissions enable row level security;

-- RLS policies for project submissions
create policy "project_submissions_select_own"
  on public.project_submissions for select
  using (auth.uid() = user_id or auth.uid() = reviewer_id);

create policy "project_submissions_insert_own"
  on public.project_submissions for insert
  with check (auth.uid() = user_id);

create policy "project_submissions_update_own"
  on public.project_submissions for update
  using (auth.uid() = user_id or auth.uid() = reviewer_id);
