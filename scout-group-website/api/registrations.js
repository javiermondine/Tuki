import { MongoClient } from 'mongodb';
import { getSupabase } from './_supabase.js';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = 'scout-forum'; // reuse existing DB

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = await MongoClient.connect(MONGODB_URI);
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabase();
    let regs;
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('registrations')
          .select('child_name, section, created_at')
          .order('created_at', { ascending: false })
          .limit(100);
        if (error) throw error;
        regs = (data || []).map(r => ({ childName: r.child_name, section: r.section, createdAt: r.created_at }));
      } catch (e) {
        console.error('[GET /api/registrations] Supabase error, falling back to Mongo:', e);
        const client = await connectToDatabase();
        const db = client.db(MONGODB_DB);
        regs = await db
          .collection('registrations')
          .find({}, { projection: { childName: 1, section: 1, createdAt: 1, _id: 0 } })
          .sort({ createdAt: -1 })
          .limit(100)
          .toArray();
      }
    } else {
      const client = await connectToDatabase();
      const db = client.db(MONGODB_DB);
      regs = await db
        .collection('registrations')
        .find({}, { projection: { childName: 1, section: 1, createdAt: 1, _id: 0 } })
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray();
    }

    res.status(200).json(regs);
  } catch (err) {
    console.error('Error list registrations', err);
    res.status(500).json({ error: 'Error al obtener inscripciones' });
  }
}
