// Command: dsa submit

import chalk from 'chalk';
import { writeFileSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { testCommand } from './test.js';
import { checkStatus } from '../lib/git.js';
import { loadConfig } from '../lib/loadConfig.js';
import { post } from '../lib/http.js';
import type { SubmissionRequest, ProjectConfig } from '../../types/report.js';

/**
 * Submit test results to the API
 * @param cwd - Current working directory (defaults to process.cwd())
 */
export async function submitCommand(cwd: string = process.cwd()): Promise<void> {
  // 1. Run test command internally to get latest results
  console.log(chalk.blue('Running tests before submission...'));
  console.log('');

  let report;
  try {
    report = await testCommand(cwd);
  } catch (error) {
    console.error(chalk.red('✗ Tests failed. Cannot submit.'));
    console.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }

  // 2. Check git status (for commit SHA only, don't notify user)
  const gitStatus = await checkStatus(cwd);

  // 3. Load project config
  const { config, projectRoot } = loadConfig(cwd);

  // 4. Validate current challenge (progressive unlock)
  const currentIndex = report.currentChallengeIndex || config.currentChallengeIndex || 0;
  
  // Use the full cases array, not a filtered one - index should match database
  const currentChallenge = report.cases[currentIndex];

  if (!currentChallenge) {
    console.log(chalk.yellow('⚠️  All challenges completed! Nothing to submit.'));
    console.log('');
    process.exit(0);
  }

  // Check if challenge is locked (shouldn't happen with proper flow, but safety check)
  if (currentChallenge.message === 'Challenge locked') {
    console.log('');
    console.log(chalk.yellow('⚠️  This challenge is still locked.'));
    console.log(chalk.gray('   Complete previous challenges first.'));
    console.log('');
    process.exit(1);
  }

  if (!currentChallenge.passed) {
    console.log('');
    console.log(chalk.red('❌ Current challenge not passed. Fix the tests first.'));
    console.log(chalk.cyan(`Challenge: ${currentChallenge.subchallengeId}`));
    if (currentChallenge.message) {
      console.log(chalk.gray(`  ${currentChallenge.message}`));
    }
    console.log('');
    process.exit(1);
  }

  // 5. POST results to API
  const submissionUrl = `${config.apiUrl}/submissions`;
  const submissionBody: SubmissionRequest = {
    projectId: config.projectId,
    result: currentChallenge.passed ? 'pass' : 'fail',
    summary: `Challenge ${currentIndex + 1}: ${currentChallenge.subchallengeId}`,
    details: {
      cases: report.cases.map(tc => ({
        id: tc.subchallengeId,
        passed: tc.passed,
        message: tc.message,
      })),
      currentChallengeIndex: currentIndex,
      challengeResult: currentChallenge,
    },
    commitSha: gitStatus.commitSha !== 'unknown' ? gitStatus.commitSha : undefined,
  };

  console.log('');
  console.log(chalk.blue('Submitting results to API...'));

  const response = await post(submissionUrl, submissionBody, {
    Authorization: `Bearer ${config.projectToken}`,
  });

  // 6. Display confirmation or error
  if (response.ok) {
    console.log('');
    console.log(chalk.green('✓ Submission recorded!'));
    console.log(chalk.green(`✓ Challenge "${currentChallenge.subchallengeId}" completed!`));
    
    // Check if there are more challenges
    const nextIndex = currentIndex + 1;
    
    // 7. Update local config file with new challenge index
    try {
      const configPath = resolve(projectRoot, 'dsa.config.json');
      const configContent = readFileSync(configPath, 'utf-8');
      const configData = JSON.parse(configContent) as ProjectConfig;
      
      configData.currentChallengeIndex = nextIndex;
      
      writeFileSync(configPath, JSON.stringify(configData, null, 2), 'utf-8');
    } catch (error) {
      console.error(chalk.yellow('⚠️  Warning: Failed to update local config file'));
      console.error(chalk.gray(`   ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
    
    if (nextIndex < report.cases.length) {
      const nextChallenge = report.cases[nextIndex];
      console.log('');
      console.log(chalk.cyan(`🔓 Next challenge unlocked: ${nextChallenge.subchallengeId}`));
      console.log(chalk.gray('   Run `dsa test` to start working on it.'));
    } else {
      console.log('');
      console.log(chalk.yellow('🎉 Congratulations! All challenges in this module completed!'));
    }
    
    console.log('');
    console.log(
      chalk.cyan(
        `View your progress: ${config.apiUrl}/projects/${config.projectId}`
      )
    );
    console.log('');
  } else {
    console.log('');
    console.error(chalk.red('✗ Submission failed'));

    if (response.status === 401) {
      console.error(
        chalk.red('Invalid or expired project token. Please check your dsa.config.json')
      );
    } else if (response.status === 404) {
      console.error(chalk.red('Project not found. Please check your projectId.'));
    } else if (response.error) {
      console.error(chalk.red(response.error));
    } else {
      console.error(chalk.red(`HTTP ${response.status}: Unknown error`));
    }

    console.log('');
    process.exit(1);
  }

  // 8. Exit with success code (implicit, process will exit normally)
}
