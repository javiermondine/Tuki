# Scout Group Website

Sitio web del Grupo Scout Myotragus 684. Incluye foro público, inscripciones y contenido institucional.

## Stack

- Frontend: HTML/CSS/JS + PWA (service worker)
- Backend: Vercel Serverless Functions
- Base de datos: Supabase (Postgres) con fallback MongoDB
- i18n: ES/CA/EN

## Variables de entorno

```env
MONGODB_URI=mongodb+srv://user:pass@host/database?retryWrites=true&w=majority
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

## Desarrollo local

```bash
npm install
npx vercel dev
# http://localhost:3000
```

## API

- `GET /api/posts` - Listar mensajes del foro
- `POST /api/posts` - Crear mensaje (name, category, message)
- `GET /api/registrations` - Listar inscripciones públicas
- `POST /api/register` - Crear inscripción

Datos en Supabase (Postgres) con fallback a MongoDB si falla.

## Deploy

1. Conecta el repo a Vercel
2. Configura Environment Variables: `MONGODB_URI`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy automático desde main

## Licencia

MIT

## Internacionalización (i18n)

Los textos se traducen con `data-i18n` (ES/CA/EN) en `scripts/i18n.js`. Si añades contenido nuevo, agrega la clave en los tres idiomas y el atributo `data-i18n` en el HTML.

## PWA

Service Worker con caché `myotragus-v1.1.6`. Si cambias archivos estáticos, incrementa la constante `CACHE_NAME` en `src/sw.js`.

## Supabase (Postgres) – Migración y uso

1) Crea un proyecto en Supabase y obtiene:
- SUPABASE_URL (Project URL)
- SUPABASE_SERVICE_ROLE_KEY (service_role)

2) Crea las tablas (ejecuta en SQL Editor):

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

3) Variables locales (.env):

```
MONGODB_URI=...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

4) Migrar datos desde MongoDB (opcional):

```zsh
# zsh
export MONGODB_URI='mongodb+srv://...'
export SUPABASE_URL='https://YOUR-PROJECT.supabase.co'
export SUPABASE_SERVICE_ROLE_KEY='service_role_key'
node scripts/migrateToSupabase.js
```

5) Despliegue (Vercel): configura los Secrets `supabase-url` y `supabase-service-role-key` (y opcionalmente `mongodb-uri`).

Seguridad: usa SERVICE_ROLE_KEY solo del lado servidor. Si en el futuro expones lecturas directas desde el cliente, habilita RLS y define policies de solo lectura pública en esas tablas.

## Siguientes pasos sugeridos

1) Moderación del foro (servidor)
- Añadir DELETE /api/posts/:id con autenticación (token ADMIN) para moderar.
- Opcional: rate limit por IP y validación adicional del payload.

2) Formulario de voluntariado
- Añadir sección/formulario dedicado (no solo mailto) con `POST /api/volunteers` y listado público opcional.

3) Cobertura i18n total
- Hacer un barrido de textos residuales sin `data-i18n` y completar claves en ES/CA/EN.

4) SEO y accesibilidad
- Añadir metaetiquetas por página (og:title/description), `aria-labels` faltantes y foco gestionado en todos los modales.

## Licencia

MIT