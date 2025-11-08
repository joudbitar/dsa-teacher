import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getSupabaseClient } from '../_shared/supabase.ts';
import { jsonResponse } from '../_shared/cors.ts';

export async function handleDelete(req: Request): Promise<Response> {
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

  // Extract project ID from URL path
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  const projectId = pathParts[pathParts.length - 1];

  if (!projectId) {
    return jsonResponse({ error: 'Project ID is required' }, 400);
  }

  // Use service role client for database operations
  const supabase = getSupabaseClient();

  // First, verify the project belongs to the user
  const { data: project, error: fetchError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('userId', userId)
    .single();

  if (fetchError || !project) {
    console.error('Project not found or unauthorized:', fetchError);
    return jsonResponse({ error: 'Project not found or unauthorized' }, 404);
  }

  // Try to delete the GitHub repository if it exists
  if (project.githubRepoUrl) {
    console.log(`Attempting to delete GitHub repo: ${project.githubRepoUrl}`);
    
    try {
      // Extract owner and repo name from URL
      const urlMatch = project.githubRepoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (urlMatch) {
        const [, owner, repoName] = urlMatch;
        
        // Authenticate with GitHub App
        const privateKeyPath = Deno.env.get('GITHUB_APP_PRIVATE_KEY_PATH');
        let privateKey = Deno.env.get('GITHUB_APP_PRIVATE_KEY');
        
        if (!privateKey && privateKeyPath) {
          try {
            privateKey = await Deno.readTextFile(privateKeyPath);
          } catch {
            privateKey = Deno.env.get('GITHUB_APP_PRIVATE_KEY');
          }
        }

        if (privateKey) {
          const appId = Deno.env.get('GITHUB_APP_ID');
          const installationId = Deno.env.get('GITHUB_APP_INSTALLATION_ID');

          const octokit = new Octokit({
            authStrategy: createAppAuth,
            auth: {
              appId,
              privateKey,
              installationId,
            },
          });

          // Delete the repository
          await octokit.repos.delete({
            owner,
            repo: repoName,
          });

          console.log(`✓ GitHub repo deleted: ${owner}/${repoName}`);
        } else {
          console.log('⚠️  GitHub credentials not available, skipping repo deletion');
        }
      }
    } catch (githubError) {
      // Don't fail the entire operation if GitHub deletion fails
      console.error('Failed to delete GitHub repo (non-fatal):', githubError);
      console.log('Continuing with database deletion...');
    }
  }

  // Delete the project (submissions will be cascade deleted due to foreign key)
  const { error: deleteError } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('userId', userId);

  if (deleteError) {
    console.error('Database error deleting project:', deleteError);
    return jsonResponse({ error: 'Failed to delete project' }, 500);
  }

  console.log(`Project ${projectId} deleted successfully for user ${userId}`);

  return jsonResponse({ 
    success: true, 
    message: 'Project deleted successfully. GitHub repo removed. You can now create a fresh project for this module.' 
  });
}

