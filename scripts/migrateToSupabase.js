#!/usr/bin/env node
// Script de migración: copia datos de MongoDB a Supabase
import { MongoClient } from 'mongodb';
import { createClient } from '@supabase/supabase-js';

const MONGODB_URI = process.env.MONGODB_URI;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!MONGODB_URI) {
  console.error('Falta MONGODB_URI');
  process.exit(1);
}
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

async function run() {
  const mongo = await MongoClient.connect(MONGODB_URI);
  const db = mongo.db('scout-forum');
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  // Migrar posts
  const posts = await db.collection('posts').find({}).sort({ createdAt: 1 }).toArray();
  console.log(`Encontrados ${posts.length} posts`);
  for (const p of posts) {
    const { data, error } = await supabase.from('posts').insert({
      name: p.name || 'Anónimo',
      category: p.category || 'general',
      message: p.message || '',
      created_at: p.createdAt || new Date(),
    });
    if (error) {
      console.error('Error inserting post', error);
      process.exitCode = 1;
    }
  }

  // Migrar inscripciones (solo datos públicos)
  const regs = await db.collection('registrations').find({}).sort({ createdAt: 1 }).toArray();
  console.log(`Encontradas ${regs.length} inscripciones`);
  for (const r of regs) {
    const { data, error } = await supabase.from('registrations').insert({
      child_name: r.childName,
      section: r.section,
      created_at: r.createdAt || new Date(),
    });
    if (error) {
      console.error('Error inserting registration', error);
      process.exitCode = 1;
    }
  }

  await mongo.close();
  console.log('Migración completada');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
