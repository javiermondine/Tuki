import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import postsRouter from './api/posts.js';
import registerRouter from './api/register.js';
import registrationsRouter from './api/registrations.js';
import deletePostRouter from './api/delete-post.js';
import testRouter from './api/test.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Enable gzip compression
app.use(compression());

app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));

// API routes
app.use('/api/posts', postsRouter);
app.use('/api/register', registerRouter);
app.use('/api/registrations', registrationsRouter);
app.use('/api/delete-post', deletePostRouter);
app.use('/api/test', testRouter);

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
