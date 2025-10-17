# Grupo Scout Myotragus 684

Web del grupo scout con foro público, inscripciones y contenido sobre nuestras actividades.

## Tecnologías

- Frontend estático (HTML/CSS/JS) con PWA
- Serverless functions en Vercel
- Datos en Supabase (Postgres), con respaldo en MongoDB

## Setup local

```bash
npm install
cp .env.example .env.local
# Rellena las variables en .env.local
npx vercel dev
```

## API endpoints

- `GET /api/posts` - Lista mensajes del foro
- `POST /api/posts` - Publica mensaje
- `DELETE /api/delete-post?id={id}` - Borra un mensaje
- `GET /api/registrations` - Lista inscripciones públicas
- `POST /api/register` - Envía inscripción

## Deploy

Push a main → deploy automático en Vercel.

Configura las variables de entorno en el dashboard de Vercel.

## Licencia

MIT