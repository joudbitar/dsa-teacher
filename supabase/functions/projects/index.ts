import { handleCors } from '../_shared/cors.ts';
import { handleGet } from './get.ts';
import { handlePost } from './post.ts';
import { handleDelete } from './delete.ts';
import { handleGetTestLogs } from './test-logs.ts';
import { jsonResponse } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(p => p);
    
    // Check if this is a test-logs request: /functions/v1/projects/:id/test-logs
    // Path parts will be: ['functions', 'v1', 'projects', projectId, 'test-logs']
    const isTestLogsRequest = pathParts.length >= 5 && 
                              pathParts[pathParts.length - 1] === 'test-logs' && 
                              pathParts[pathParts.length - 3] === 'projects' &&
                              req.method === 'GET';
    
    if (isTestLogsRequest) {
      return await handleGetTestLogs(req);
    }
    
    // Regular projects routes
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
