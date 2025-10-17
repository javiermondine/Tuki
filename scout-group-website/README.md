# Scout Group Website

Sitio web del Grupo Scout Myotragus 684 (HTML/CSS/JS + PWA + API serverless). Incluye foro público y formulario de inscripciones con listado público básico.

## Estructura

```
scout-group-website
├── api/                     # Endpoints serverless (Vercel)
│   ├── posts.js             # GET/POST mensajes del foro (MongoDB)
│   ├── register.js          # POST inscripciones (MongoDB)
│   └── registrations.js     # GET inscripciones públicas
├── src/
│   ├── index.html           # Home (secciones, actividades, voluntariado)
│   ├── forum.html           # Foro público (API + fallback local)
│   ├── signup.html          # Inscripciones (envío a API + modal éxito)
│   ├── activities.html      # Actividades
│   ├── teachings.html       # Metodología
│   ├── offline.html         # Página offline
│   ├── scripts/
│   │   ├── main.js
│   │   ├── i18n.js          # ES/CA/EN via data-i18n
│   │   └── forum.js         # Cliente del foro (API + localStorage)
│   ├── styles/
│   │   ├── main.css
│   │   └── forum.css
│   ├── manifest.json
│   └── sw.js                # Service Worker (cache v1.1.3)
├── vercel.json              # Configuración de build en Vercel
├── .env.example             # Variables de entorno (MONGODB_URI)
├── package.json
└── README.md
```

## Requisitos

- Node.js 18+
- Cuenta de MongoDB Atlas (o instancia MongoDB accesible)

## Variables de entorno

Copiar `.env.example` a `.env` y rellenar `MONGODB_URI`:

```
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@HOST/DATABASE_NAME?retryWrites=true&w=majority
```

En Vercel, define el Secret `mongodb-uri` y enlázalo (ya referenciado en `vercel.json`).

## Ejecutar en local

Opción recomendada con Vercel CLI (sirve estático + API):

```
npm install
npx vercel dev
```

Visita http://localhost:3000

## Endpoints

- `GET /api/posts` → lista mensajes del foro (público)
- `POST /api/posts` { name, category, message } → crea mensaje
- `POST /api/register` → guarda inscripción (campos del formulario)
- `GET /api/registrations` → devuelve inscripciones públicas (nombre, sección, fecha)

Notas:
- Los mensajes del foro son públicos. El borrado del cliente sólo elimina en el dispositivo (fallback local). Para moderación real, ver “Siguientes pasos”.
- Las inscripciones públicas solo muestran datos básicos; los datos sensibles NO se exponen.

## Internacionalización (i18n)

Los textos se traducen con `data-i18n` (ES/CA/EN) en `scripts/i18n.js`. Si añades contenido nuevo, agrega la clave en los tres idiomas y el atributo `data-i18n` en el HTML.

## PWA

Service Worker con caché `myotragus-v1.1.3`. Si cambias archivos estáticos, incrementa la constante `CACHE_NAME` en `src/sw.js`.

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