-- Create employers table for employer-specific data
create table if not exists public.employers (
  id uuid primary key references public.profiles(id) on delete cascade,
  company_name text not null,
  company_description text,
  company_size text check (company_size in ('1-10', '11-50', '51-200', '201-1000', '1000+')),
  industry text,
  website_url text,
  company_logo_url text,
  verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.employers enable row level security;

-- RLS policies for employers
create policy "employers_select_own"
  on public.employers for select
  using (auth.uid() = id);

create policy "employers_insert_own"
  on public.employers for insert
  with check (auth.uid() = id);

create policy "employers_update_own"
  on public.employers for update
  using (auth.uid() = id);

create policy "employers_delete_own"
  on public.employers for delete
  using (auth.uid() = id);

-- Allow public read access for marketplace
create policy "employers_select_public"
  on public.employers for select
  using (true);
