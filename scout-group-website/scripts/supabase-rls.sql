-- Enable Row Level Security
alter table public.posts enable row level security;
alter table public.registrations enable row level security;

-- Allow public SELECT (read-only) for anon role (if you plan to read from browser)
create policy "Public read posts" on public.posts
  for select using (true);

create policy "Public read registrations" on public.registrations
  for select using (true);

-- Optionally restrict INSERT/UPDATE/DELETE to service role only by not creating policies for those
-- The service role bypasses RLS so your server can still write.