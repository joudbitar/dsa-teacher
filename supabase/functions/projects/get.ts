import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getSupabaseClient } from '../_shared/supabase.ts';
import { jsonResponse } from '../_shared/cors.ts';

export async function handleGet(req: Request): Promise<Response> {
  // Authenticate using JWT token from Authorization header
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  // Create Supabase client with user's JWT token for authentication
  const supabaseAuth = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: authHeader },
      },
    }
  );
  
  // Extract user from JWT token
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();

  if (authError || !user) {
    console.error('Auth error:', authError);
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const userId = user.id; // UUID from auth.users

  // Use service role client for database operations
  const supabase = getSupabaseClient();

  const url = new URL(req.url);
  const moduleId = url.searchParams.get('moduleId');
  
  let query = supabase
    .from('projects')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });

  if (moduleId) {
    query = query.eq('moduleId', moduleId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Database error:', error);
    return jsonResponse({ error: 'Failed to fetch projects' }, 500);
  }

  return jsonResponse(data);
}
