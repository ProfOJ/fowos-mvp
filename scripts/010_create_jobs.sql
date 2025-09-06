-- Create jobs table for employer job postings
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid references public.employers(id) on delete cascade not null,
  title text not null,
  description text not null,
  requirements text[] not null,
  skills_required text[] not null,
  job_type text check (job_type in ('full-time', 'part-time', 'contract', 'freelance')) not null,
  experience_level text check (experience_level in ('junior', 'mid', 'senior', 'expert')),
  budget_min numeric(10,2),
  budget_max numeric(10,2),
  location text,
  remote_ok boolean default false,
  min_pok_score integer default 0,
  min_pos_score integer default 0,
  status text check (status in ('draft', 'active', 'paused', 'closed')) default 'draft',
  applications_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.jobs enable row level security;

-- RLS policies for jobs
create policy "jobs_select_active"
  on public.jobs for select
  using (status = 'active');

create policy "jobs_manage_own"
  on public.jobs for all
  using (auth.uid() = employer_id);
