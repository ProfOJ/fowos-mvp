-- Create quizzes table for POK (Proof of Knowledge) system
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null, -- e.g., 'javascript', 'react', 'blockchain'
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')) not null,
  questions jsonb not null, -- Array of question objects
  passing_score integer not null default 70,
  time_limit_minutes integer default 30,
  pok_points integer not null default 100,
  created_by uuid references public.profiles(id),
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.quizzes enable row level security;

-- Allow public read access for active quizzes
create policy "quizzes_select_active"
  on public.quizzes for select
  using (is_active = true);

-- Allow creators to manage their quizzes
create policy "quizzes_manage_own"
  on public.quizzes for all
  using (auth.uid() = created_by);
