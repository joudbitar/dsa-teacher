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
    console.error('Unexpected error:', error);
    return jsonResponse({
      error: 'Internal server error',
      details: error.message,
    }, 500);
  }
});
