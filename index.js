import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('src'));
// Serve bundled assets
app.use('/dist', express.static('dist'));

// Import API handlers
const postsHandler = (await import('./api/posts.js')).default;
const registerHandler = (await import('./api/register.js')).default;

// API routes
app.all('/api/posts', postsHandler);
app.all('/api/register', registerHandler);

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 Servidor local iniciado

📍 URLs disponibles:
   - Página principal: http://localhost:${PORT}/
   - Foro:             http://localhost:${PORT}/forum.html
   - Juego:            http://localhost:${PORT}/game.html
   - Inscripción:      http://localhost:${PORT}/signup.html
   - API Posts:        http://localhost:${PORT}/api/posts

✅ Con las variables de entorno de .env.local
✅ Conectado a Supabase y MongoDB

Presiona Ctrl+C para detener el servidor
    `);
});
