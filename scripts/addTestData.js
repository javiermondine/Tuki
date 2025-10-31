import { createClient } from '@supabase/supabase-js';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load .env.local file
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔍 Environment variables loaded:');
console.log('- SUPABASE_URL:', SUPABASE_URL ? 'OK' : 'FAIL');
console.log('- SUPABASE_KEY:', SUPABASE_KEY ? 'OK' : 'FAIL');
console.log('- MONGODB_URI:', MONGODB_URI ? 'OK' : 'FAIL');

async function addTestPost() {
    console.log('🔵 Agregando post de prueba...');
    
    // Try Supabase first
    if (SUPABASE_URL && SUPABASE_KEY) {
        try {
            const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
            
            const testPost = {
                name: 'Jefe Scout',
                category: 'actividades',
                message: '¡Bienvenidos al foro! Este fin de semana tendremos un campamento en la sierra. Todos los scouts deben traer su equipo completo.'
            };
            
            const { data, error } = await supabase
                .from('posts')
                .insert(testPost)
                .select()
                .single();
                
            if (error) {
                console.error('FAIL Error en Supabase:', error.message);
                throw error;
            }
            
            console.log('OK Post agregado a Supabase:', data);
            return data;
        } catch (e) {
            console.error('Warning  Supabase falló, intentando MongoDB...', e.message);
        }
    }
    
    // Fallback to MongoDB
    if (MONGODB_URI) {
        try {
            const client = await MongoClient.connect(MONGODB_URI);
            const db = client.db('scout-forum');
            
            const testPost = {
                name: 'Jefe Scout',
                category: 'actividades',
                message: '¡Bienvenidos al foro! Este fin de semana tendremos un campamento en la sierra. Todos los scouts deben traer su equipo completo.',
                createdAt: new Date()
            };
            
            const result = await db.collection('posts').insertOne(testPost);
            console.log('OK Post agregado a MongoDB:', result.insertedId);
            
            await client.close();
            return result;
        } catch (e) {
            console.error('FAIL Error en MongoDB:', e.message);
            throw e;
        }
    }
    
    throw new Error('No hay conexión a base de datos disponible');
}

async function addTestRegistration() {
    console.log('\n🔵 Agregando registro de prueba...');
    
    // Try Supabase first
    if (SUPABASE_URL && SUPABASE_KEY) {
        try {
            const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
            
            const testRegistration = {
                child_name: 'Juan',
                child_surname: 'Pérez García',
                child_birthdate: '2010-05-15',
                child_gender: 'Masculino',
                section: 'Scouts',
                health_info: 'Alergia al polen',
                guardian_name: 'María García',
                guardian_relation: 'Madre',
                guardian_email: 'maria.garcia@example.com',
                guardian_phone: '+34 600 123 456',
                guardian_address: 'Calle Principal 123, Madrid',
                additional_info: 'Primera inscripción',
                privacy_policy: true,
                image_consent: true,
                created_at: new Date()
            };
            
            const { data, error } = await supabase
                .from('registrations')
                .insert(testRegistration)
                .select()
                .single();
                
            if (error) {
                console.error('FAIL Error en Supabase:', error.message);
                throw error;
            }
            
            console.log('OK Registro agregado a Supabase:', data);
            return data;
        } catch (e) {
            console.error('Warning  Supabase falló, intentando MongoDB...', e.message);
        }
    }
    
    // Fallback to MongoDB
    if (MONGODB_URI) {
        try {
            const client = await MongoClient.connect(MONGODB_URI);
            const db = client.db('scout-forum');
            
            const testRegistration = {
                childName: 'Juan',
                childSurname: 'Pérez García',
                childBirthdate: '2010-05-15',
                childGender: 'Masculino',
                section: 'Scouts',
                healthInfo: 'Alergia al polen',
                guardianName: 'María García',
                guardianRelation: 'Madre',
                guardianEmail: 'maria.garcia@example.com',
                guardianPhone: '+34 600 123 456',
                guardianAddress: 'Calle Principal 123, Madrid',
                additionalInfo: 'Primera inscripción',
                privacyPolicy: true,
                imageConsent: true,
                createdAt: new Date()
            };
            
            const result = await db.collection('registrations').insertOne(testRegistration);
            console.log('OK Registro agregado a MongoDB:', result.insertedId);
            
            await client.close();
            return result;
        } catch (e) {
            console.error('FAIL Error en MongoDB:', e.message);
            throw e;
        }
    }
    
    throw new Error('No hay conexión a base de datos disponible');
}

async function main() {
    try {
        console.log(' Iniciando script de prueba...\n');
        
        await addTestPost();
        await addTestRegistration();
        
        console.log('\nOK ¡Script completado exitosamente!');
        console.log('\nPuedes verificar en:');
        console.log('- Foro: https://tuki-ten.vercel.app/forum.html');
        console.log('- API: https://tuki-ten.vercel.app/api/posts');
        
    } catch (error) {
        console.error('\nFAIL Error en el script:', error);
        process.exit(1);
    }
}

main();
