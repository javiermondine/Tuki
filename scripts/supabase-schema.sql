-- Schema for Supabase: forum posts and registrations (public projection)
-- Run this in Supabase SQL editor before migrating/seeding.

create table if not exists public.posts (
  id bigint generated always as identity primary key,
  name text not null default 'Anónimo',
  category text not null default 'general',
  message text not null,
  created_at timestamptz not null default now()
);

-- Store full registration details in the same table (server writes, public reads are projected by API)
create table if not exists public.registrations (
  id bigint generated always as identity primary key,
  child_name text not null,
  child_surname text,
  child_birthdate date,
  child_gender text,
  section text not null,
  health_info text,
  guardian_name text,
  guardian_relation text,
  guardian_email text,
  guardian_phone text,
  guardian_address text,
  additional_info text,
  privacy_policy boolean,
  image_consent boolean,
  created_at timestamptz not null default now()
);

-- If the table already existed, ensure columns are present
alter table public.registrations add column if not exists child_surname text;
alter table public.registrations add column if not exists child_birthdate date;
alter table public.registrations add column if not exists child_gender text;
alter table public.registrations add column if not exists health_info text;
alter table public.registrations add column if not exists guardian_name text;
alter table public.registrations add column if not exists guardian_relation text;
alter table public.registrations add column if not exists guardian_email text;
alter table public.registrations add column if not exists guardian_phone text;
alter table public.registrations add column if not exists guardian_address text;
alter table public.registrations add column if not exists additional_info text;
alter table public.registrations add column if not exists privacy_policy boolean;
alter table public.registrations add column if not exists image_consent boolean;

-- Optional: RLS policies are in scripts/supabase-rls.sql
-- If you plan to read directly from the browser with anon key, enable RLS and apply the public SELECT policies.
