#!/usr/bin/env node
/*
  Migration script: MongoDB -> Supabase (Postgres)
  Copies posts and registrations (public projection) into Supabase tables.
*/
import { MongoClient } from 'mongodb';
import { createClient } from '@supabase/supabase-js';

const MONGODB_URI = process.env.MONGODB_URI;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI');
  process.exit(1);
}
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

async function run() {
  const mongo = await MongoClient.connect(MONGODB_URI);
  const db = mongo.db('scout-forum');
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  // Migrate posts
  const posts = await db.collection('posts').find({}).sort({ createdAt: 1 }).toArray();
  console.log(`Found ${posts.length} posts`);
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

  // Migrate registrations (public projection)
  const regs = await db.collection('registrations').find({}).sort({ createdAt: 1 }).toArray();
  console.log(`Found ${regs.length} registrations`);
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
  console.log('Migration complete');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
