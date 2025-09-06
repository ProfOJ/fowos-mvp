-- Update jobs table to support hire requests
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS talent_id uuid references auth.users(id),
ADD COLUMN IF NOT EXISTS engagement_type text check (engagement_type in ('full-time', 'part-time', 'contract', 'freelance')),
ADD COLUMN IF NOT EXISTS hours_per_week integer,
ADD COLUMN IF NOT EXISTS rate numeric(10,2),
ADD COLUMN IF NOT EXISTS message text,
ADD COLUMN IF NOT EXISTS company_name text;

-- Update status check constraint to include hire request statuses
ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_status_check;
ALTER TABLE public.jobs ADD CONSTRAINT jobs_status_check 
CHECK (status IN ('draft', 'active', 'paused', 'closed', 'pending', 'accepted', 'declined', 'completed'));

-- Add RLS policy for talent to see their hire requests
CREATE POLICY "jobs_talent_view_own" ON public.jobs
FOR SELECT USING (auth.uid() = talent_id);

-- Add RLS policy for employers to manage their job posts
CREATE POLICY "jobs_employer_manage" ON public.jobs
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.employers 
    WHERE employers.user_id = auth.uid() 
    AND employers.id = jobs.employer_id
  )
);
