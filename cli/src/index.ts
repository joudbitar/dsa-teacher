// CLI Entry Point

import { Command } from 'commander';
import { testCommand } from './commands/test.js';
import { submitCommand } from './commands/submit.js';
import { hintCommand } from './commands/hint.js';
import { updateCommand } from './commands/update.js';
import { getCurrentVersion, checkForUpdateIfNeeded } from './lib/checkUpdate.js';
import chalk from 'chalk';

const program = new Command();
const CLI_VERSION = getCurrentVersion();

program
  .name('dsa')
  .description('DSA Lab CLI - Test and submit your solutions')
  .version(CLI_VERSION);

program
  .command('test')
  .description('Run tests for the current challenge project')
  .action(async () => {
    try {
      await testCommand();
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program
  .command('submit')
  .description('Submit test results to the DSA Lab dashboard')
  .action(async () => {
    try {
      await submitCommand();
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program
  .command('hint')
  .description('Display hints from HINTS.md for the current challenge')
  .action(async () => {
    try {
      await hintCommand();
      await showUpdateNotification();
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program
  .command('update')
  .description('Update the CLI to the latest version')
  .action(async () => {
    try {
      await updateCommand();
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

// Show update notification (non-blocking)
async function showUpdateNotification() {
  try {
    const updateInfo = await checkForUpdateIfNeeded();
    if (updateInfo?.updateAvailable) {
      console.log('');
      console.log(chalk.yellow('  ⚠️  Update available!'));
      console.log(chalk.gray(`  Current version: ${updateInfo.currentVersion}`));
      console.log(chalk.gray(`  Latest version: ${updateInfo.latestVersion}`));
      console.log(chalk.cyan(`  Run: ${updateInfo.updateCommand}`));
      console.log(chalk.gray('  Or run: dsa update'));
      console.log('');
    }
  } catch {
    // Silently fail - don't interrupt user workflow
  }
}

// Parse arguments
program.parse(process.argv);

// If no command provided, show help
if (process.argv.length === 2) {
  program.help();
}
