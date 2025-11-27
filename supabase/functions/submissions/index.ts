import { handleCors, jsonResponse } from '../_shared/cors.ts';
import { getSupabaseClient } from '../_shared/supabase.ts';

interface TestCase {
  id: string;
  passed: boolean;
  message?: string;
}

interface SubmissionDetails {
  cases: TestCase[];
  currentChallengeIndex?: number;
  challengeResult?: TestCase;
}

interface TestLogs {
  rawOutput: string;
  formattedLines: Array<{
    type: 'compile' | 'test' | 'error' | 'warning' | 'info' | 'output' | 'default';
    content: string;
  }>;
}

interface SubmissionRequest {
  projectId: string;
  result: 'pass' | 'fail';
  summary: string;
  details: SubmissionDetails;
  commitSha?: string;
  testLogs?: TestLogs;
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
    const { projectId, result, summary, details, commitSha, testLogs } = body;

    // Validate projectId matches token
    if (projectId !== project.id) {
      return jsonResponse({ error: 'Project ID mismatch' }, 403);
    }

    // Validate and sanitize test logs if provided
    let sanitizedTestLogs: TestLogs | null = null;
    if (testLogs) {
      // Ensure testLogs structure is valid
      if (typeof testLogs.rawOutput === 'string' && Array.isArray(testLogs.formattedLines)) {
        // Limit raw output size to prevent database bloat (max 1MB)
        const maxOutputSize = 1024 * 1024; // 1MB
        sanitizedTestLogs = {
          rawOutput: testLogs.rawOutput.length > maxOutputSize 
            ? testLogs.rawOutput.substring(0, maxOutputSize) + '\n... (truncated)'
            : testLogs.rawOutput,
          formattedLines: testLogs.formattedLines.slice(0, 10000), // Limit to 10k lines
        };
        console.log(`Storing test logs: ${sanitizedTestLogs.rawOutput.length} bytes, ${sanitizedTestLogs.formattedLines.length} lines`);
      } else {
        console.log('Invalid testLogs structure:', { 
          hasRawOutput: typeof testLogs.rawOutput,
          hasFormattedLines: Array.isArray(testLogs.formattedLines),
          testLogsKeys: Object.keys(testLogs || {}),
        });
      }
    } else {
      console.log('No testLogs provided in submission body');
    }
    
    console.log('About to insert submission with testLogs:', {
      hasTestLogs: !!sanitizedTestLogs,
      testLogsSize: sanitizedTestLogs ? JSON.stringify(sanitizedTestLogs).length : 0,
    });

    // Insert submission
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .insert({
        projectId,
        result,
        summary,
        details,
        commitSha: commitSha || null,
        testLogs: sanitizedTestLogs,
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Submission error:', submissionError);
      console.error('Submission error details:', JSON.stringify(submissionError, null, 2));
      return jsonResponse({ error: 'Failed to create submission' }, 500);
    }
    
    // Verify the submission was created with testLogs
    console.log('Submission created successfully:', {
      id: submission.id,
      hasTestLogs: !!submission.testLogs,
      testLogsType: typeof submission.testLogs,
      testLogsKeys: submission.testLogs ? Object.keys(submission.testLogs) : null,
    });

    // Handle progressive challenge unlocking
    const currentIndex = details.currentChallengeIndex ?? 0;
    const challengePassed = details.challengeResult?.passed ?? false;
    
    let nextChallengeIndex = currentIndex;
    let newProgress = 0;
    let newStatus = 'in_progress';

    if (challengePassed) {
      // Increment to next challenge
      const totalChallenges = details.cases.length;
      nextChallengeIndex = currentIndex + 1;

      // Calculate progress based on completed challenges
      newProgress = totalChallenges > 0 
        ? Math.round((nextChallengeIndex / totalChallenges) * 100) 
        : 0;

      // Mark as completed if all challenges done
      if (nextChallengeIndex >= totalChallenges) {
        newStatus = 'completed';
        newProgress = 100;
      }
    } else {
      // Challenge not passed, keep same index and calculate progress
      const totalChallenges = details.cases.length;
      newProgress = totalChallenges > 0 
        ? Math.round((currentIndex / totalChallenges) * 100) 
        : 0;
    }

    // Update project with new challenge index and progress
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        currentChallengeIndex: nextChallengeIndex,
        progress: newProgress,
        status: newStatus,
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
      progress: newProgress,
      status: newStatus,
      currentChallengeIndex: nextChallengeIndex,
      challengeUnlocked: challengePassed && nextChallengeIndex < details.cases.length,
      allCompleted: nextChallengeIndex >= details.cases.length,
    }, 201);
  } catch (error) {
    console.error('Unexpected error:', error);
    return jsonResponse({
      error: 'Internal server error',
      details: error.message,
    }, 500);
  }
});

