-- Create talents table for talent-specific data
create table if not exists public.talents (
  id uuid primary key references public.profiles(id) on delete cascade,
  bio text,
  skills text[], -- Array of skills
  experience_level text check (experience_level in ('junior', 'mid', 'senior', 'expert')),
  hourly_rate numeric(10,2),
  availability text check (availability in ('full-time', 'part-time', 'contract', 'freelance')),
  location text,
  portfolio_url text,
  github_url text,
  linkedin_url text,
  total_pok_score integer default 0,
  total_pos_score integer default 0,
  reputation_score numeric(3,2) default 0.0,
  total_reviews integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.talents enable row level security;

-- RLS policies for talents
create policy "talents_select_own"
  on public.talents for select
  using (auth.uid() = id);

create policy "talents_insert_own"
  on public.talents for insert
  with check (auth.uid() = id);

create policy "talents_update_own"
  on public.talents for update
  using (auth.uid() = id);

create policy "talents_delete_own"
  on public.talents for delete
  using (auth.uid() = id);

-- Allow public read access for marketplace
create policy "talents_select_public"
  on public.talents for select
  using (true);
