#!/usr/bin/env node
// Seed demo data into Supabase (or Mongo fallback) by calling our API handlers directly
import postsHandler from '../api/posts.js';
import registerHandler from '../api/register.js';

function mockRes(label) {
  return {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(payload) { console.log(`[${label}] status=${this.statusCode}`, payload); this._done && this._done(); },
    set done(fn) { this._done = fn; }
  };
}

async function callHandler(handler, reqInit, label) {
  const req = { method: reqInit.method, body: reqInit.body, headers: {}, query: reqInit.query || {} };
  await new Promise((resolve) => {
    const res = mockRes(label);
    res.done = resolve;
    handler(req, res);
  });
}

async function main() {
  console.log('Seeding demo data...');

  // 1) Create a forum post
  await callHandler(postsHandler, {
    method: 'POST',
    body: {
      name: 'María P.',
      category: 'actividades',
      message: '¿Cuándo es la próxima salida de la manada? Gracias.'
    }
  }, 'POST /api/posts');

  // 2) Create a registration (public projection)
  await callHandler(registerHandler, {
    method: 'POST',
    body: {
      childName: 'Lucas',
      childSurname: 'Fernández',
      childBirthdate: '2013-04-22',
      childGender: 'male',
      section: 'lobatos',
      healthInfo: 'Sin alergias conocidas',
      guardianName: 'Carla Fernández',
      guardianRelation: 'mother',
      guardianEmail: 'carla.fernandez@example.com',
      guardianPhone: '+34666000111',
      guardianAddress: 'C/ Olmos 12, Palma',
      additionalInfo: 'Disponible los sábados por la tarde',
      privacyPolicy: true,
      imageConsent: true
    }
  }, 'POST /api/register');

  console.log('Seeding complete. Revisa en Supabase las tablas posts y registrations.');
}

main().catch((e) => { console.error(e); process.exit(1); });
