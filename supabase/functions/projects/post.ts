import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
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
  const userId = req.headers.get('x-user-id');
  
  if (!userId) {
    return jsonResponse({ error: 'Missing x-user-id header' }, 400);
  }

  const body = await req.json();
  const { moduleId, language } = body;

  if (!moduleId || !language) {
    return jsonResponse({ error: 'Missing moduleId or language' }, 400);
  }

  // Validate language support
  if (!validateLanguageSupport(moduleId, language)) {
    return jsonResponse({
      error: `${language} not supported for ${moduleId}. Available: ${
        supportedCombos[moduleId]?.join(', ') || 'none'
      }`
    }, 400);
  }

  const supabase = getSupabaseClient();
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
    })
    .select()
    .single();

  if (dbError) {
    console.error('Database error:', dbError);
    return jsonResponse({ error: 'Failed to create project' }, 500);
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
      throw new Error('GitHub App private key not configured');
    }

    const octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: Deno.env.get('GITHUB_APP_ID'),
        privateKey,
        installationId: Deno.env.get('GITHUB_APP_INSTALLATION_ID'),
      },
    });

    // Create repo from template
    const suffix = languageToSuffix[language];
    const templateRepo = `template-dsa-${moduleId}-${suffix}`;
    const newRepoName = `${userId}-${moduleId}-${suffix}`;
    const githubOrg = Deno.env.get('GITHUB_ORG');

    console.log(`Creating repo: ${githubOrg}/${newRepoName} from template: ${templateRepo}`);

    const { data: repo } = await octokit.repos.createUsingTemplate({
      template_owner: githubOrg!,
      template_repo: templateRepo,
      owner: githubOrg!,
      name: newRepoName,
      private: true,
      description: `DSA Lab: ${moduleId} challenge in ${language}`,
    });

    console.log(`Repo created: ${repo.html_url}`);

    // Wait a bit for repo to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Commit dsa.config.json
    const configContent = {
      projectId: project.id,
      projectToken: project.projectToken,
      moduleId,
      language,
      testCommand: getTestCommand(language),
      reportFile: '.dsa-report.json',
    };

    const encodedContent = btoa(JSON.stringify(configContent, null, 2));

    console.log(`Committing dsa.config.json to ${newRepoName}`);

    await octokit.repos.createOrUpdateFileContents({
      owner: githubOrg!,
      repo: newRepoName,
      path: 'dsa.config.json',
      message: 'Configure DSA Lab project',
      content: encodedContent,
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
    await supabase.from('projects').delete().eq('id', project.id);
    
    return jsonResponse({
      error: 'Failed to create GitHub repository',
      details: error.message,
    }, 500);
  }
}
