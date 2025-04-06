import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Server-side Supabase client that bypasses RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function GET() {
  try {
    const headersList = await headers();
    const authorization = headersList.get('authorization');

    if (!authorization) {
      return new Response('Unauthorized', { status: 401 });
    }

    const token = authorization.replace('Bearer ', '');

    // Verify the session token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get credits from database
    const { data: creditsData } = await supabaseAdmin
      .from('credits')
      .select('credits')
      .eq('user_id', user.id)
      .single();

    return new Response(JSON.stringify({ credits: creditsData?.credits || 0 }));
  } catch (error) {
    console.error('Error fetching credits:', error);
    return new Response('Error fetching credits', { status: 500 });
  }
}