# Grupo Scout Myotragus 684

Web del grupo scout con foro público, inscripciones y contenido sobre nuestras actividades.

## Tecnologías

- Frontend estático (HTML/CSS/JS) con PWA
- Serverless functions en Vercel
- Datos en Supabase (Postgres), con respaldo en MongoDB si hay problemas
- Multiidioma: español, catalán e inglés

## Setup local

```bash
npm install
npx vercel dev
```

Abre http://localhost:3000

## Variables de entorno

Crea un `.env.local` con:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database?retryWrites=true&w=majority
SUPABASE_URL=https://tuprojecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

## API endpoints

- `GET /api/posts` - Lista mensajes del foro
- `POST /api/posts` - Publica mensaje (campos: name, category, message)
- `DELETE /api/delete-post?id={id}` - Borra un mensaje
- `GET /api/registrations` - Lista inscripciones públicas
- `POST /api/register` - Envía inscripción

Todo se guarda en Supabase. Si falla, usa MongoDB como respaldo.

## Deploy en Vercel

1. Conecta el repositorio
2. Añade las variables de entorno (MONGODB_URI, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
3. Deploy automático desde main

## Base de datos (Supabase)

Crea las tablas en el SQL Editor:

```sql
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

Si tienes datos antiguos en MongoDB, puedes migrarlos:

```bash
export MONGODB_URI='tu_uri'
export SUPABASE_URL='tu_url'
export SUPABASE_SERVICE_ROLE_KEY='tu_key'
node scripts/migrateToSupabase.js
```

## Idiomas (i18n)

Los textos se traducen automáticamente usando el atributo `data-i18n`. Las traducciones están en `scripts/i18n.js`. Si añades texto nuevo:

1. Añade la clave en los tres idiomas (es, ca, en)
2. Pon `data-i18n="tuClave"` en el HTML

## PWA y caché

El service worker guarda archivos para usar offline. Si actualizas CSS o JS, cambia el número de versión en `src/sw.js`:

```javascript
const CACHE_NAME = 'myotragus-v1.1.9';
```

## Próximas mejoras

- Añadir moderación con contraseña para borrar posts
- Formulario de voluntariado dedicado
- Mejorar SEO y accesibilidad

## Licencia

MIT