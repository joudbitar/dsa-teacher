import { handleCors } from '../_shared/cors.ts';
import { handleGet } from './get.ts';
import { handlePost } from './post.ts';
import { handleDelete } from './delete.ts';
import { jsonResponse } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    if (req.method === 'GET') {
      return await handleGet(req);
    } else if (req.method === 'POST') {
      return await handlePost(req);
    } else if (req.method === 'DELETE') {
      return await handleDelete(req);
    } else {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }
  } catch (error) {
    console.error('Unexpected error in projects function:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return jsonResponse({
      error: 'Internal server error',
      message: errorMessage,
      details: errorStack || JSON.stringify(error),
      hint: 'Check Supabase Edge Function logs for more details. This error occurred before the request could be processed.',
    }, 500);
  }
});
