import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

export function getSupabase() {
  if (supabase) return supabase;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  // Quick check: warn if key seems to be an anon key instead of service_role
  try {
    const payload = JSON.parse(Buffer.from(SUPABASE_SERVICE_ROLE_KEY.split('.')[1] || '', 'base64').toString('utf8'));
    if (payload && payload.role && payload.role !== 'service_role') {
      console.warn('[Supabase] La clave parece ser', payload.role, '— usa la "service_role" para inserciones del servidor.');
    }
  } catch {}

  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
    global: { headers: { 'X-Client-Info': 'scout-group-website@server' } }
  });
  return supabase;
}

export function ensureTablesSQL() {
  // SQL schema help string for docs or migrations
  return `
-- Posts table
create table if not exists public.posts (
  id bigint generated always as identity primary key,
  name text not null default 'Anónimo',
  category text not null default 'general',
  message text not null,
  created_at timestamptz not null default now()
);

-- Registrations (public projection only)
create table if not exists public.registrations (
  id bigint generated always as identity primary key,
  child_name text not null,
  section text not null,
  created_at timestamptz not null default now()
);

-- Recommended: RLS disabled for service key; enable RLS + policies for anon if exposing reads client-side.
`;
}
