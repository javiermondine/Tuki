import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testSupabase() {
    console.log('Testing Supabase connection...\n');
    
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('URL:', url ? '✅ Found' : '❌ Missing');
    console.log('KEY:', key ? '✅ Found' : '❌ Missing');
    
    if (!url || !key) {
        console.error('\n❌ Missing environment variables');
        return;
    }
    
    const supabase = createClient(url, key);
    
    console.log('\nFetching posts...');
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('❌ Error:', error);
        return;
    }
    
    console.log(`\n✅ Found ${data.length} posts:`);
    data.forEach((post, i) => {
        console.log(`\n${i + 1}. ${post.name} (${post.category})`);
        console.log(`   ${post.message.substring(0, 50)}...`);
    });
}

testSupabase();
