# Supabase + Migración rápida

## 1) Variables locales

Edita `.env.local` y rellena:

```
MONGODB_URI=mongodb+srv://USUARIO:CONTRASEÑA_ENCODEADA@cluster0.xxxxx.mongodb.net/scout-forum?retryWrites=true&w=majority&appName=Cluster0
SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=service_role_key
```

Sugerencias:
- Codifica caracteres especiales en la contraseña (usa `encodeURIComponent`).
- Autoriza tu IP en Atlas (Network Access) para migrar.

## 2) Tablas en Supabase

Copia en el SQL Editor de Supabase:

```
create table if not exists public.posts (
  id bigint generated always as identity primary key,
  name text not null default 'Anónimo',
  category text not null default 'general',
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.registrations (
  id bigint generated always as identity primary key,
  child_name text not null,
  section text not null,
  created_at timestamptz not null default now()
);
```

Opcional (RLS lectura pública): abre `scripts/supabase-rls.sql` y ejecútalo si vas a leer desde el navegador.

## 3) Migración

Con Node 18+ (recomendado 20):

```
npm install --prefix scout-group-website
cd scout-group-website
npm run migrate:local
```

Verás logs del tipo `Found X posts` y, al final, `Migration complete`.

## 4) Vercel

Añade Secrets en tu proyecto de Vercel:
- `supabase-url`
- `supabase-service-role-key`
- (opcional) `mongodb-uri` durante la transición/fallback

El backend ya usará Supabase si esas variables existen; el frontend no necesita cambios.