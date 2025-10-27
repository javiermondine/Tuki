import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function checkPosts() {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('❌ Error:', error);
        return;
    }
    
    console.log('📋 Posts en Supabase:');
    console.log(JSON.stringify(data, null, 2));
}

checkPosts();
