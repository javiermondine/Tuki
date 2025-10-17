import { MongoClient } from 'mongodb';

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
            const client = await connectToDatabase();
            const db = client.db(MONGODB_DB);
            
            const posts = await db
                .collection('posts')
                .find({})
                .sort({ createdAt: -1 })
                .limit(100)
                .toArray();
                
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener posts' });
        }
    } 
    
    if (req.method === 'POST') {
        try {
            const client = await connectToDatabase();
            const db = client.db(MONGODB_DB);
            
            const body = req.body || {};
            const name = (body.name || 'Anónimo').toString().slice(0, 60);
            const category = (body.category || 'general').toString().slice(0, 40);
            const message = (body.message || '').toString().slice(0, 1000);
            if (!message.trim()) {
                return res.status(400).json({ error: 'Mensaje requerido' });
            }

            const post = {
                name,
                category,
                message,
                createdAt: new Date(),
            };
            
            await db.collection('posts').insertOne(post);
            res.status(201).json(post);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear post' });
        }
    }
}