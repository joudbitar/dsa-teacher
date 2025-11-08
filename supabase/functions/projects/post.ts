import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getSupabaseClient } from '../_shared/supabase.ts';
import { jsonResponse } from '../_shared/cors.ts';
import {
  languageToSuffix,
  supportedCombos,
  validateLanguageSupport,
  getTestCommand,
  generateToken,
} from './utils.ts';

export async function handlePost(req: Request): Promise<Response> {
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
    return jsonResponse({ 
      error: 'Unauthorized',
      message: authError?.message || 'Authentication failed',
      hint: 'Make sure you are signed in and your session is valid.'
    }, 401);
  }

  const userId = user.id; // UUID from auth.users

  // Use service role client for database operations
  const supabase = getSupabaseClient();

  let body;
  try {
    body = await req.json();
  } catch (parseError) {
    console.error('Failed to parse request body:', parseError);
    return jsonResponse({
      error: 'Invalid request body',
      message: 'Failed to parse JSON body',
      hint: 'Make sure the request body is valid JSON with moduleId and language fields.'
    }, 400);
  }
  
  let { moduleId, language } = body;

  if (!moduleId || !language) {
    return jsonResponse({ 
      error: 'Missing required fields',
      message: `Missing ${!moduleId ? 'moduleId' : ''}${!moduleId && !language ? ' and ' : ''}${!language ? 'language' : ''}`,
      hint: 'Request body must include both moduleId and language fields.',
      received: { moduleId, language }
    }, 400);
  }

  // Normalize language to proper case (e.g., "go" -> "Go", "python" -> "Python")
  const languageMap: Record<string, string> = {
    'typescript': 'TypeScript',
    'javascript': 'JavaScript',
    'python': 'Python',
    'go': 'Go',
    'java': 'Java',
    'c++': 'C++',
    'cpp': 'C++',
  };
  
  const normalizedLanguage = languageMap[language.toLowerCase()] || language;
  language = normalizedLanguage;

  // Validate language support
  if (!validateLanguageSupport(moduleId, language)) {
    return jsonResponse({
      error: `${language} not supported for ${moduleId}. Available: ${
        supportedCombos[moduleId]?.join(', ') || 'none'
      }`
    }, 400);
  }

  // Check if project already exists
  const { data: existingProjects } = await supabase
    .from('projects')
    .select('*')
    .eq('userId', userId)
    .eq('moduleId', moduleId);

  if (existingProjects && existingProjects.length > 0) {
    const existingProject = existingProjects[0];
    
    // If GitHub repo URL exists, verify it's accessible before returning
    if (existingProject.githubRepoUrl) {
      console.log('Found existing project with GitHub repo:', existingProject.githubRepoUrl);
      
      // Try to verify the repo exists and is accessible (at least publicly visible)
      // Extract owner and repo name from URL
      const urlMatch = existingProject.githubRepoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (urlMatch) {
        const [, owner, repoName] = urlMatch;
        
        try {
          // Quick check if repo is accessible via GitHub API (public repos don't need auth)
          const checkResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
            headers: { 'User-Agent': 'DSA-Lab' }
          });
          
          if (checkResponse.ok) {
            console.log('✓ Existing repo is accessible, returning existing project');
            return jsonResponse({
              id: existingProject.id,
              githubRepoUrl: existingProject.githubRepoUrl,
              status: existingProject.status,
              progress: existingProject.progress,
            }, 200);
          } else if (checkResponse.status === 404 || checkResponse.status === 403) {
            console.log('✗ Existing repo is not accessible (404/403), will delete and recreate');
            await supabase
              .from('projects')
              .delete()
              .eq('id', existingProject.id);
          }
        } catch (error) {
          console.log('Failed to verify repo accessibility:', error);
          // If verification fails, assume repo is fine and return it
          return jsonResponse({
            id: existingProject.id,
            githubRepoUrl: existingProject.githubRepoUrl,
            status: existingProject.status,
            progress: existingProject.progress,
          }, 200);
        }
      } else {
        // If URL doesn't match expected format, delete and recreate
        console.log('Invalid GitHub URL format, deleting and retrying...');
        await supabase
          .from('projects')
          .delete()
          .eq('id', existingProject.id);
      }
    } else {
      // If GitHub repo failed previously, delete the broken record and continue
      console.log('Found broken project record (no GitHub URL), deleting and retrying...');
      await supabase
        .from('projects')
        .delete()
        .eq('id', existingProject.id);
    }
  }

  const projectToken = generateToken();

  // Insert project into database
  const { data: project, error: dbError } = await supabase
    .from('projects')
    .insert({
      userId,
      moduleId,
      language,
      status: 'in_progress',
      progress: 0,
      projectToken,
      currentChallengeIndex: 0,
    })
    .select()
    .single();

  if (dbError) {
    console.error('Database error:', dbError);
    return jsonResponse({ 
      error: 'Failed to create project',
      message: dbError.message || 'Database error',
      details: dbError.details || JSON.stringify(dbError),
      hint: 'Check database connection and schema. Verify that the projects table exists and has the correct structure.'
    }, 500);
  }

  // Authenticate with GitHub App
  try {
    const privateKeyPath = Deno.env.get('GITHUB_APP_PRIVATE_KEY_PATH');
    let privateKey = Deno.env.get('GITHUB_APP_PRIVATE_KEY');
    
    if (!privateKey && privateKeyPath) {
      try {
        privateKey = await Deno.readTextFile(privateKeyPath);
      } catch {
        // If file doesn't exist in Deno environment, use env var
        privateKey = Deno.env.get('GITHUB_APP_PRIVATE_KEY');
      }
    }

    if (!privateKey) {
      console.error('GitHub App private key not configured');
      console.error('Environment check:', {
        hasPrivateKey: !!privateKey,
        hasPrivateKeyPath: !!privateKeyPath,
        hasAppId: !!Deno.env.get('GITHUB_APP_ID'),
        hasInstallationId: !!Deno.env.get('GITHUB_APP_INSTALLATION_ID'),
        hasOrg: !!Deno.env.get('GITHUB_ORG'),
      });
      throw new Error('GitHub App private key not configured. Please set GITHUB_APP_PRIVATE_KEY in Supabase Edge Function secrets.');
    }

    // Fix newlines if they were escaped (common when storing in env vars)
    // Replace literal \n with actual newlines
    if (privateKey.includes('\\n') && !privateKey.includes('\n')) {
      console.log('Converting escaped newlines in private key');
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    // Verify private key format
    if (!privateKey.includes('-----BEGIN') || !privateKey.includes('-----END')) {
      console.error('Private key format invalid - missing PEM headers');
      throw new Error('GitHub App private key format is invalid. It should be in PEM format with -----BEGIN and -----END markers.');
    }

    const appId = Deno.env.get('GITHUB_APP_ID');
    const installationId = Deno.env.get('GITHUB_APP_INSTALLATION_ID');
    const configuredOrg = Deno.env.get('GITHUB_ORG');

    // Validate all required environment variables
    const missingConfig: string[] = [];
    if (!appId) missingConfig.push('GITHUB_APP_ID');
    if (!installationId) missingConfig.push('GITHUB_APP_INSTALLATION_ID');
    if (!configuredOrg) missingConfig.push('GITHUB_ORG');

    if (missingConfig.length > 0) {
      const errorMsg = `Missing required GitHub App configuration: ${missingConfig.join(', ')}. Please set these in Supabase Edge Function secrets.`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    console.log('GitHub Auth Config:', {
      appId: appId ? 'SET' : 'MISSING',
      installationId: installationId ? 'SET' : 'MISSING',
      configuredOrg: configuredOrg,
      hasPrivateKey: !!privateKey,
      privateKeyPrefix: privateKey?.substring(0, 30) + '...',
    });

    const octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId,
        privateKey,
        installationId,
      },
    });

    // Verify authentication and get actual installation account
    console.log('Verifying GitHub App authentication...');
    let githubOrg: string;
    try {
      const { data: installation } = await octokit.apps.getInstallation({
        installation_id: parseInt(installationId!),
      });
      githubOrg = installation.account?.login || configuredOrg!;
      console.log('✓ Authentication verified.');
      console.log(`  Installation account: ${githubOrg}`);
      console.log(`  Configured org: ${configuredOrg}`);
      
      if (githubOrg !== configuredOrg) {
        console.warn(`⚠️  WARNING: App is installed on "${githubOrg}" but GITHUB_ORG is set to "${configuredOrg}"`);
        console.warn(`⚠️  Using actual installation account: ${githubOrg}`);
      }
    } catch (authError) {
      console.error('✗ Authentication failed:', authError);
      throw new Error(`GitHub App authentication failed: ${authError.message}`);
    }

    // Check accessible repos
    console.log('Checking accessible repositories...');
    try {
      const { data: reposData } = await octokit.apps.listReposAccessibleToInstallation();
      console.log(`✓ App has access to ${reposData.total_count} repositories`);
      if (reposData.repositories?.length > 0) {
        console.log('Sample repos:', reposData.repositories.slice(0, 5).map(r => r.full_name));
      }
    } catch (repoError) {
      console.error('✗ Failed to list accessible repos:', repoError);
    }

    // Create repo from template
    const suffix = languageToSuffix[language];
    const templateRepo = `template-dsa-${moduleId}-${suffix}`;
    
    // Generate meaningful repo name from user's email or fallback to userId
    let repoUsername = userId.split('-')[0]; // Use first segment of UUID as fallback
    if (user.email) {
      // Extract username from email (e.g., john.doe@example.com -> john-doe)
      const emailUsername = user.email.split('@')[0];
      repoUsername = emailUsername.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    }
    
    // Count existing projects for this user to create unique names (e.g., john-stack-1, john-stack-2)
    const { count } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('userId', userId)
      .eq('moduleId', moduleId);
    
    const projectNumber = (count || 0) + 1;
    const newRepoName = `${repoUsername}-${moduleId}-${projectNumber}`;

    console.log('Template Request:', {
      template_owner: githubOrg,
      template_repo: templateRepo,
      owner: githubOrg,
      name: newRepoName,
      generated_from: user.email || userId,
    });

    // Verify template exists and is accessible
    console.log(`Verifying template repository: ${githubOrg}/${templateRepo}...`);
    try {
      const { data: template } = await octokit.repos.get({
        owner: githubOrg!,
        repo: templateRepo,
      });
      console.log('✓ Template found:', {
        name: template.name,
        is_template: template.is_template,
        visibility: template.visibility || (template.private ? 'private' : 'public'),
      });

      if (!template.is_template) {
        throw new Error(`Repository ${githubOrg}/${templateRepo} exists but is not marked as a template`);
      }
    } catch (templateError) {
      console.error('✗ Template verification failed:', templateError);
      throw new Error(`Template repository ${githubOrg}/${templateRepo} not accessible: ${templateError.message}`);
    }

    // Check if repo already exists
    console.log(`Checking if repo already exists: ${githubOrg}/${newRepoName}...`);
    let repo;
    let repoAlreadyExisted = false;
    
    try {
      const { data: existingRepo } = await octokit.repos.get({
        owner: githubOrg!,
        repo: newRepoName,
      });
      
      console.log(`⚠️  Repo already exists: ${existingRepo.html_url}`);
      console.log(`  This might be from a previous session. Deleting to ensure fresh start...`);
      
      // Delete the old repo to ensure we start fresh from the latest template
      try {
        await octokit.repos.delete({
          owner: githubOrg!,
          repo: newRepoName,
        });
        console.log(`  ✓ Old repo deleted, will create fresh from template`);
        
        // Wait a moment for GitHub to process the deletion
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (deleteError) {
        console.error(`  ✗ Failed to delete old repo:`, deleteError);
        console.log(`  Will try to use existing repo...`);
        
        // If deletion fails, make it public and reuse it
        if (existingRepo.private) {
          console.log(`  Converting repo to public...`);
          await octokit.repos.update({
            owner: githubOrg!,
            repo: newRepoName,
            private: false,
          });
          console.log(`  ✓ Repo is now public`);
        }
        
        repo = existingRepo;
        repoAlreadyExisted = true;
      }
    } catch (notFoundError) {
      // Repo doesn't exist, good - we'll create it fresh
      console.log(`✓ No existing repo found, will create fresh`);
    }
    
    // Create repo from template if we deleted the old one or it never existed
    if (!repoAlreadyExisted) {
      console.log(`Creating: ${githubOrg}/${newRepoName} from template: ${templateRepo}`);
      
      try {
        const { data: newRepo } = await octokit.repos.createUsingTemplate({
          template_owner: githubOrg!,
          template_repo: templateRepo,
          owner: githubOrg!,
          name: newRepoName,
          private: false, // Make public so users can clone without being collaborators
          description: `DSA Lab: ${moduleId} challenge in ${language}`,
        });
        
        repo = newRepo;
        console.log(`✓ Repo created: ${repo.html_url}`);
      } catch (createError) {
        console.error('Failed to create repo from template:', createError);
        throw new Error(`Could not create repository: ${createError.message}`);
      }
    }

    // Wait a bit for repo to be ready (only for new repos)
    if (!repoAlreadyExisted) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Get the default branch
    console.log(`Getting default branch for ${newRepoName}...`);
    const { data: repoData } = await octokit.repos.get({
      owner: githubOrg!,
      repo: newRepoName,
    });
    const defaultBranch = repoData.default_branch;
    console.log(`Default branch: ${defaultBranch}`);

    // Commit dsa.config.json
    const configContent = {
      projectId: project.id,
      projectToken: project.projectToken,
      moduleId,
      language,
      apiUrl: 'https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1',
      testCommand: getTestCommand(language),
      reportFile: '.dsa-report.json',
      currentChallengeIndex: 0,
    };

    const encodedContent = btoa(JSON.stringify(configContent, null, 2));

    console.log(`Committing dsa.config.json to ${newRepoName} on branch ${defaultBranch}`);

    // Check if file already exists and get its SHA
    let fileSha: string | undefined;
    try {
      const { data: existingFile } = await octokit.repos.getContent({
        owner: githubOrg!,
        repo: newRepoName,
        path: 'dsa.config.json',
      });
      if ('sha' in existingFile) {
        fileSha = existingFile.sha;
        console.log(`Found existing dsa.config.json with SHA: ${fileSha}`);
      }
    } catch (error) {
      console.log('No existing dsa.config.json found, will create new file');
    }

    await octokit.repos.createOrUpdateFileContents({
      owner: githubOrg!,
      repo: newRepoName,
      path: 'dsa.config.json',
      message: 'Configure DSA Lab project',
      content: encodedContent,
      branch: defaultBranch,
      ...(fileSha && { sha: fileSha }),
    });

    console.log('Config committed successfully');

    // Update project with GitHub URL
    await supabase
      .from('projects')
      .update({ githubRepoUrl: repo.html_url })
      .eq('id', project.id);

    return jsonResponse({
      id: project.id,
      githubRepoUrl: repo.html_url,
      status: project.status,
      progress: project.progress,
    }, 201);

  } catch (error) {
    console.error('GitHub error:', error);
    
    // Delete the project since GitHub provisioning failed
    try {
      await supabase.from('projects').delete().eq('id', project.id);
    } catch (deleteError) {
      console.error('Failed to delete project after error:', deleteError);
    }
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = {
      error: 'Failed to create GitHub repository',
      message: errorMessage,
      hint: errorMessage.includes('private key') 
        ? 'Check that GITHUB_APP_PRIVATE_KEY is set in Supabase Edge Function secrets'
        : errorMessage.includes('authentication') || errorMessage.includes('401') || errorMessage.includes('403')
        ? 'Check GitHub App credentials (App ID, Installation ID, Private Key)'
        : errorMessage.includes('template')
        ? 'Verify template repository exists and GitHub App has access'
        : 'Check Supabase Edge Function logs for more details',
    };
    
    console.error('Error details:', errorDetails);
    
    return jsonResponse(errorDetails, 500);
  }
}
