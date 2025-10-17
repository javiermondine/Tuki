import { MongoClient } from 'mongodb';
import { getSupabase } from './_supabase.js';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = 'scout-forum';

let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) {
        return cachedClient;
    }
    
    const client = await MongoClient.connect(MONGODB_URI);
    cachedClient = client;
    return client;
}

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const supabase = getSupabase();
                        let posts;
                        if (supabase) {
                                try {
                                        const { data, error } = await supabase
                                            .from('posts')
                                            .select('*')
                                            .order('created_at', { ascending: false })
                                            .limit(100);
                                        if (error) throw error;
                                        // Normalize keys to existing frontend expectations
                                        posts = (data || []).map(p => ({
                                            name: p.name,
                                            category: p.category,
                                            message: p.message,
                                            createdAt: p.created_at
                                        }));
                                } catch (e) {
                                        console.error('[GET /api/posts] Supabase error, falling back to Mongo:', e);
                                        const client = await connectToDatabase();
                                        const db = client.db(MONGODB_DB);
                                        posts = await db
                                            .collection('posts')
                                            .find({})
                                            .sort({ createdAt: -1 })
                                            .limit(100)
                                            .toArray();
                                }
                        } else {
                                const client = await connectToDatabase();
                                const db = client.db(MONGODB_DB);
                                posts = await db
                                    .collection('posts')
                                    .find({})
                                    .sort({ createdAt: -1 })
                                    .limit(100)
                                    .toArray();
                        }
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener posts' });
        }
    } 
    
    if (req.method === 'POST') {
        try {
            const body = req.body || {};
            const name = (body.name || 'Anónimo').toString().slice(0, 60);
            const category = (body.category || 'general').toString().slice(0, 40);
            const message = (body.message || '').toString().slice(0, 1000);
            if (!message.trim()) {
                return res.status(400).json({ error: 'Mensaje requerido' });
            }

            const supabase = getSupabase();
                        if (supabase) {
                            try {
                                const { data, error } = await supabase
                                    .from('posts')
                                    .insert({ name, category, message })
                                    .select()
                                    .single();
                                if (error) throw error;
                                const post = { name: data.name, category: data.category, message: data.message, createdAt: data.created_at };
                                return res.status(201).json(post);
                            } catch (e) {
                                console.error('[POST /api/posts] Supabase error, falling back to Mongo:', e);
                                const client = await connectToDatabase();
                                const db = client.db(MONGODB_DB);
                                const post = { name, category, message, createdAt: new Date() };
                                await db.collection('posts').insertOne(post);
                                return res.status(201).json(post);
                            }
                        } else {
                            const client = await connectToDatabase();
                            const db = client.db(MONGODB_DB);
                            const post = { name, category, message, createdAt: new Date() };
                            await db.collection('posts').insertOne(post);
                            return res.status(201).json(post);
                        }
        } catch (error) {
            res.status(500).json({ error: 'Error al crear post' });
        }
    }
}