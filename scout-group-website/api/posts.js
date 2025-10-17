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
            
            const post = {
                name: req.body.name,
                message: req.body.message,
                createdAt: new Date(),
            };
            
            await db.collection('posts').insertOne(post);
            res.status(201).json(post);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear post' });
        }
    }
}