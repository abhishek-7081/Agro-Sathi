const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function test() {
    try {
        const { data, error } = await supabase.from('price_alerts').select('*').limit(1);
        if (error) {
            console.error('Supabase Error:', error);
        } else {
            console.log('Success, data:', data);
        }
    } catch (err) {
        console.error('Exception:', err);
    }
}
test();
