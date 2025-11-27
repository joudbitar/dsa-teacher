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

  // First, check if any submissions exist for this project
  const { data: allSubmissions, error: checkError } = await supabase
    .from('submissions')
    .select('id, createdAt, result')
    .eq('projectId', projectId)
    .order('createdAt', { ascending: false })
    .limit(5);
  
  console.log('Checking submissions for project:', {
    projectId,
    submissionCount: allSubmissions?.length || 0,
    checkError: checkError?.message,
  });

  // Get latest submission with test logs for this project
  // Try to get one with logs first
  let { data: submission, error: submissionError } = await supabase
    .from('submissions')
    .select('testLogs, createdAt, result')
    .eq('projectId', projectId)
    .not('testLogs', 'is', null)
    .order('createdAt', { ascending: false })
    .limit(1)
    .maybeSingle(); // Use maybeSingle() instead of single() to avoid error when no rows
  
  console.log('Query for submissions with testLogs:', {
    found: !!submission,
    error: submissionError?.message,
    errorCode: submissionError?.code,
    hasTestLogs: !!submission?.testLogs,
  });
  
  // If no submission with logs, get the latest submission anyway
  if (!submission || submissionError) {
    console.log('No submission with testLogs found, checking latest submission...');
    const { data: latestSubmission, error: latestError } = await supabase
      .from('submissions')
      .select('testLogs, createdAt, result')
      .eq('projectId', projectId)
      .order('createdAt', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (latestError) {
      console.error('Error fetching latest submission:', latestError);
      // If it's a "no rows" error, that's fine - just return empty
      if (latestError.code === 'PGRST116') {
        console.log('No submissions found for project');
        return jsonResponse({ 
          testLogs: null, 
          hasLogs: false,
          createdAt: null,
          result: null,
        });
      }
      return jsonResponse({ error: 'Failed to fetch test logs' }, 500);
    }
    
    if (latestSubmission) {
      submission = latestSubmission;
      submissionError = null;
      console.log('Found latest submission:', {
        hasTestLogs: !!latestSubmission.testLogs,
        testLogsType: typeof latestSubmission.testLogs,
        testLogsValue: latestSubmission.testLogs ? 'present' : 'null/undefined',
        result: latestSubmission.result,
        createdAt: latestSubmission.createdAt,
      });
    } else {
      // No submissions at all
      console.log('No submissions found for project');
      return jsonResponse({ 
        testLogs: null, 
        hasLogs: false,
        createdAt: null,
        result: null,
      });
    }
  }

  if (!submission) {
    console.log('No submissions found for project');
    return jsonResponse({ 
      testLogs: null, 
      hasLogs: false,
      createdAt: null,
      result: null,
    });
  }

  const hasLogs = !!submission.testLogs && submission.testLogs !== null;
  
  console.log('Returning test logs response:', {
    hasLogs,
    hasTestLogs: !!submission.testLogs,
    testLogsType: typeof submission.testLogs,
    testLogsIsNull: submission.testLogs === null,
    testLogsIsUndefined: submission.testLogs === undefined,
    result: submission.result,
    createdAt: submission.createdAt,
  });
  
  return jsonResponse({
    testLogs: submission.testLogs as TestLogs | null,
    hasLogs: hasLogs,
    createdAt: submission.createdAt,
    result: submission.result,
  });
}

