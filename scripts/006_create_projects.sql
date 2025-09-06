-- Create projects table for POS (Proof of Skill) system
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null, -- e.g., 'frontend', 'backend', 'fullstack', 'design'
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')) not null,
  requirements jsonb not null, -- Project requirements and criteria
  deliverables text[] not null, -- Expected deliverables
  estimated_hours integer,
  pos_points integer not null default 200,
  created_by uuid references public.profiles(id),
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.projects enable row level security;

-- Allow public read access for active projects
create policy "projects_select_active"
  on public.projects for select
  using (is_active = true);

-- Allow creators to manage their projects
create policy "projects_manage_own"
  on public.projects for all
  using (auth.uid() = created_by);
