import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getSupabaseClient } from '../_shared/supabase.ts';
import { jsonResponse } from '../_shared/cors.ts';

interface TestLogs {
  rawOutput: string;
  formattedLines: Array<{
    type: 'compile' | 'test' | 'error' | 'warning' | 'info' | 'output' | 'default';
    content: string;
  }>;
}

export async function handleGetTestLogs(req: Request): Promise<Response> {
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

  const userId = user.id;

  // Use service role client for database operations
  const supabase = getSupabaseClient();

  // Extract project ID from URL path
  // Path format: /functions/v1/projects/:id/test-logs
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(p => p);
  
  // Find the index of 'projects' and get the next part as projectId
  const projectsIndex = pathParts.indexOf('projects');
  const projectId = projectsIndex >= 0 && projectsIndex < pathParts.length - 1 
    ? pathParts[projectsIndex + 1] 
    : null;

  if (!projectId || projectId === 'test-logs') {
    return jsonResponse({ error: 'Project ID required' }, 400);
  }

  // Verify user owns the project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, userId')
    .eq('id', projectId)
    .single();

  if (projectError || !project) {
    return jsonResponse({ error: 'Project not found' }, 404);
  }

  if (project.userId !== userId) {
    return jsonResponse({ error: 'Forbidden' }, 403);
  }

  // Get latest submission with test logs for this project
  const { data: submission, error: submissionError } = await supabase
    .from('submissions')
    .select('testLogs, createdAt, result')
    .eq('projectId', projectId)
    .not('testLogs', 'is', null)
    .order('createdAt', { ascending: false })
    .limit(1)
    .single();

  if (submissionError) {
    // No submissions with logs found - return empty response
    if (submissionError.code === 'PGRST116') {
      return jsonResponse({ testLogs: null, hasLogs: false });
    }
    console.error('Database error:', submissionError);
    return jsonResponse({ error: 'Failed to fetch test logs' }, 500);
  }

  return jsonResponse({
    testLogs: submission.testLogs as TestLogs | null,
    hasLogs: !!submission.testLogs,
    createdAt: submission.createdAt,
    result: submission.result,
  });
}

