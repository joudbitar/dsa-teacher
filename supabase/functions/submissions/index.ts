import { handleCors, jsonResponse } from '../_shared/cors.ts';
import { getSupabaseClient } from '../_shared/supabase.ts';

interface TestCase {
  id: string;
  passed: boolean;
  message?: string;
}

interface SubmissionDetails {
  cases: TestCase[];
}

interface SubmissionRequest {
  projectId: string;
  result: 'pass' | 'fail';
  summary: string;
  details: SubmissionDetails;
  commitSha?: string;
}

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Verify Authorization header with project token
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return jsonResponse({ error: 'Missing Authorization header' }, 401);
    }

    const supabase = getSupabaseClient();

    // Verify token and get project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('projectToken', token)
      .single();

    if (projectError || !project) {
      console.error('Invalid token:', projectError);
      return jsonResponse({ error: 'Invalid project token' }, 401);
    }

    // Parse request body
    const body: SubmissionRequest = await req.json();
    const { projectId, result, summary, details, commitSha } = body;

    // Validate projectId matches token
    if (projectId !== project.id) {
      return jsonResponse({ error: 'Project ID mismatch' }, 403);
    }

    // Insert submission
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .insert({
        projectId,
        result,
        summary,
        details,
        commitSha: commitSha || null,
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Submission error:', submissionError);
      return jsonResponse({ error: 'Failed to create submission' }, 500);
    }

    // Calculate progress
    const passed = details.cases.filter(c => c.passed).length;
    const total = details.cases.length;
    const progress = total > 0 ? Math.round((passed / total) * 100) : 0;
    const status = progress === 100 ? 'passed' : 'in_progress';

    // Update project
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        progress,
        status,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', projectId);

    if (updateError) {
      console.error('Project update error:', updateError);
      // Don't fail the request, submission was recorded
    }

    return jsonResponse({
      id: submission.id,
      createdAt: submission.createdAt,
      projectUpdated: !updateError,
      progress,
      status,
    }, 201);
  } catch (error) {
    console.error('Unexpected error:', error);
    return jsonResponse({
      error: 'Internal server error',
      details: error.message,
    }, 500);
  }
});

