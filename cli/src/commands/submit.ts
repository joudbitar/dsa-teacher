// Command: dsa submit

import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { testCommand } from './test.js';
import { checkStatus } from '../lib/git.js';
import { loadConfig } from '../lib/loadConfig.js';
import { post } from '../lib/http.js';
import type { SubmissionRequest } from '../../types/report.js';

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

  // 2. Check git status
  const gitStatus = await checkStatus(cwd);

  if (!gitStatus.clean) {
    const answer = readlineSync.question(
      chalk.yellow('⚠ Uncommitted changes detected. Continue anyway? (y/N): ')
    );

    if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
      console.log(chalk.gray('Submission cancelled.'));
      process.exit(0);
    }
  }

  // 3. Load project config
  const config = loadConfig(cwd);

  // 4. POST results to API
  const submissionUrl = `${config.apiUrl}/api/submissions`;
  const submissionBody: SubmissionRequest = {
    projectId: config.projectId,
    details: report,
    commitSha: gitStatus.commitSha !== 'unknown' ? gitStatus.commitSha : undefined,
  };

  console.log('');
  console.log(chalk.blue('Submitting results to API...'));

  const response = await post(submissionUrl, submissionBody, {
    Authorization: `Bearer ${config.projectToken}`,
  });

  // 5. Display confirmation or error
  if (response.ok) {
    console.log('');
    console.log(chalk.green('✓ Submission recorded!'));
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

  // 6. Exit with success code (implicit, process will exit normally)
}
