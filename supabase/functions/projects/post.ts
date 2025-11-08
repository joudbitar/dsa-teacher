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
  let { moduleId, language } = body;

  if (!moduleId || !language) {
    return jsonResponse({ error: 'Missing moduleId or language' }, 400);
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
      currentChallengeIndex: 0,
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

    const appId = Deno.env.get('GITHUB_APP_ID');
    const installationId = Deno.env.get('GITHUB_APP_INSTALLATION_ID');
    const configuredOrg = Deno.env.get('GITHUB_ORG');

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
    const newRepoName = `${userId}-${moduleId}-${suffix}`;

    console.log('Template Request:', {
      template_owner: githubOrg,
      template_repo: templateRepo,
      owner: githubOrg,
      name: newRepoName,
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

    console.log(`Creating repo: ${githubOrg}/${newRepoName} from template: ${templateRepo}`);

    const { data: repo } = await octokit.repos.createUsingTemplate({
      template_owner: githubOrg!,
      template_repo: templateRepo,
      owner: githubOrg!,
      name: newRepoName,
      private: true,
      description: `DSA Lab: ${moduleId} challenge in ${language}`,
    });

    console.log(`✓ Repo created: ${repo.html_url}`);

    // Wait a bit for repo to be ready
    await new Promise(resolve => setTimeout(resolve, 3000));

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
    await supabase.from('projects').delete().eq('id', project.id);
    
    return jsonResponse({
      error: 'Failed to create GitHub repository',
      details: error.message,
    }, 500);
  }
}
