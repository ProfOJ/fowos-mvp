-- Create trigger function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, user_type)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'user_type', 'talent')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Create the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Add updated_at triggers to relevant tables
create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger talents_updated_at
  before update on public.talents
  for each row
  execute function public.handle_updated_at();

create trigger employers_updated_at
  before update on public.employers
  for each row
  execute function public.handle_updated_at();

create trigger quizzes_updated_at
  before update on public.quizzes
  for each row
  execute function public.handle_updated_at();

create trigger projects_updated_at
  before update on public.projects
  for each row
  execute function public.handle_updated_at();

create trigger jobs_updated_at
  before update on public.jobs
  for each row
  execute function public.handle_updated_at();
