import { MongoClient, ObjectId } from 'mongodb';
import { getSupabase } from './_supabase.js';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = 'scout-forum';

async function connectToDatabase() {
    if (!MONGODB_URI) throw new Error('MONGODB_URI no configurado');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    return client;
}

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;
            
            if (!id) {
                return res.status(400).json({ error: 'ID requerido' });
            }

            // Intentar eliminar de Supabase primero
            const supabase = getSupabase();
            let deleted = false;

            if (supabase) {
                try {
                    const { error } = await supabase
                        .from('posts')
                        .delete()
                        .eq('id', id);
                    
                    if (!error) {
                        deleted = true;
                        return res.status(200).json({ 
                            success: true, 
                            message: 'Post eliminado correctamente',
                            source: 'supabase'
                        });
                    }
                } catch (e) {
                    console.error('[DELETE /api/delete-post] Supabase error:', e);
                }
            }

            // Fallback a MongoDB si Supabase falla o no está configurado
            if (!deleted) {
                const client = await connectToDatabase();
                const db = client.db(MONGODB_DB);
                
                const result = await db.collection('posts').deleteOne({ 
                    _id: new ObjectId(id) 
                });

                if (result.deletedCount === 0) {
                    return res.status(404).json({ error: 'Post no encontrado' });
                }

                return res.status(200).json({ 
                    success: true, 
                    message: 'Post eliminado correctamente',
                    source: 'mongodb'
                });
            }
        } catch (error) {
            console.error('Error DELETE /api/delete-post:', error);
            return res.status(500).json({ error: 'Error al eliminar post' });
        }
    }

    return res.status(405).json({ error: 'Método no permitido' });
}
