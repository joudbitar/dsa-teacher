import { getSupabaseClient } from '../_shared/supabase.ts';
import { jsonResponse } from '../_shared/cors.ts';

export async function handleGet(req: Request): Promise<Response> {
  const userId = req.headers.get('x-user-id');
  
  if (!userId) {
    return jsonResponse({ error: 'Missing x-user-id header' }, 400);
  }

  const url = new URL(req.url);
  const moduleId = url.searchParams.get('moduleId');

  const supabase = getSupabaseClient();
  
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
