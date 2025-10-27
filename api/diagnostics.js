export default async function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');
    
    const diagnostics = {
        env: {
            SUPABASE_URL: !!process.env.SUPABASE_URL,
            SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
            SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
            MONGODB_URI: !!process.env.MONGODB_URI,
        },
        values: {
            SUPABASE_URL: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 30) + '...' : 'NOT SET',
            SUPABASE_KEY_LENGTH: process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.length : 0,
            MONGODB_SET: !!process.env.MONGODB_URI,
        }
    };
    
    return res.status(200).json(diagnostics);
}
