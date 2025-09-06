-- Create reviews table for talent reviews
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  talent_id uuid references public.talents(id) on delete cascade not null,
  reviewer_id uuid references public.profiles(id) on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  project_context text, -- What project/work this review is for
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Prevent duplicate reviews from same reviewer to same talent
  unique(talent_id, reviewer_id)
);

-- Enable RLS
alter table public.reviews enable row level security;

-- RLS policies for reviews
create policy "reviews_select_all"
  on public.reviews for select
  using (true); -- Public read access

create policy "reviews_insert_own"
  on public.reviews for insert
  with check (auth.uid() = reviewer_id);

create policy "reviews_update_own"
  on public.reviews for update
  using (auth.uid() = reviewer_id);

create policy "reviews_delete_own"
  on public.reviews for delete
  using (auth.uid() = reviewer_id);
