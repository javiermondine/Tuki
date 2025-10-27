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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method === 'GET') {
        try {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
            const supabase = getSupabase();
            let posts = [];

            if (supabase) {
                try {
                    const { data, error } = await supabase
                        .from('posts')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(100);
                    if (error) {
                        console.error('[Supabase Error]:', error);
                    } else {
                        posts = (data || []).map(p => ({
                            id: p.id,
                            name: p.name,
                            category: p.category,
                            message: p.message,
                            createdAt: p.created_at,
                        }));
                    }
                } catch (e) {
                    console.error('[GET /api/posts] Error en Supabase:', e.message);
                }
            }

            if (!posts || posts.length === 0) {
                if (!MONGODB_URI) {
                    console.error('[MongoDB] URI not configured');
                    return res.status(200).json([]);
                }
                
                try {
                    const client = await connectToDatabase();
                    const db = client.db(MONGODB_DB);
                    const mongoPosts = await db
                        .collection('posts')
                        .find({})
                        .sort({ createdAt: -1 })
                        .limit(100)
                        .toArray();
                    posts = mongoPosts.map(p => ({
                        id: p._id.toString(),
                        name: p.name,
                        category: p.category,
                        message: p.message,
                        createdAt: p.createdAt,
                    }));
                } catch (mongoErr) {
                    console.error('[MongoDB Error]:', mongoErr.message);
                    return res.status(200).json([]);
                }
            }

            return res.status(200).json(posts);
        } catch (error) {
            console.error('Error GET /api/posts:', error.message, error.stack);
            return res.status(200).json([]);
        }
    }

    if (req.method === 'POST') {
        try {
            // Sin caché para respuestas de creación
            res.setHeader('Cache-Control', 'no-store');
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
                    const post = {
                        id: data.id,
                        name: data.name,
                        category: data.category,
                        message: data.message,
                        createdAt: data.created_at,
                    };
                    return res.status(201).json(post);
                } catch (e) {
                    console.error('[POST /api/posts] Error en Supabase, usando MongoDB:', e);
                }
            }

            // Si falla Supabase, guardar en MongoDB
            const client = await connectToDatabase();
            const db = client.db(MONGODB_DB);
            const post = { name, category, message, createdAt: new Date() };
            const result = await db.collection('posts').insertOne(post);
            return res.status(201).json({
                id: result.insertedId.toString(),
                name,
                category,
                message,
                createdAt: post.createdAt,
            });
        } catch (error) {
            console.error('Error POST /api/posts:', error);
            return res.status(500).json({ error: 'Error al crear post' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}