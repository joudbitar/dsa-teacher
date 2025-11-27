// Command: dsa update

import chalk from 'chalk';
import { execa } from 'execa';
import { checkForUpdate, getCurrentVersion } from '../lib/checkUpdate.js';

/**
 * Update the CLI to the latest version
 */
export async function updateCommand(): Promise<void> {
  console.log('');
  console.log(chalk.bold.cyan('  🔄 Checking for updates...'));
  console.log('');

  const currentVersion = getCurrentVersion();
  const updateInfo = await checkForUpdate();

  if (!updateInfo.updateAvailable) {
    console.log(chalk.green(`  ✓ You're using the latest version (${currentVersion})`));
    console.log('');
    return;
  }

  console.log(chalk.yellow(`  Current version: ${currentVersion}`));
  console.log(chalk.green(`  Latest version: ${updateInfo.latestVersion}`));
  console.log('');
  console.log(chalk.cyan('  Updating CLI...'));
  console.log('');

  // Run the install script to update
  const installScript = 'https://raw.githubusercontent.com/joudbitar/dsa-teacher/main/scripts/install-cli.sh';
  
  try {
    // Use the install script directly via curl | bash
    // This is safer and matches the user's original installation method
    const { exitCode } = await execa('bash', ['-c', `curl -fsSL ${installScript} | bash`], {
      stdout: 'inherit',
      stderr: 'inherit',
    });

    if (exitCode !== 0) {
      throw new Error('Install script failed');
    }

    console.log('');
    console.log(chalk.green('  ✓ CLI updated successfully!'));
    console.log(chalk.gray(`  Version: ${updateInfo.latestVersion}`));
    console.log('');
    console.log(chalk.cyan('  You may need to restart your terminal for changes to take effect.'));
    console.log('');
  } catch (error) {
    console.log('');
    console.error(chalk.red('  ✗ Update failed'));
    console.error(chalk.gray(`  ${error instanceof Error ? error.message : 'Unknown error'}`));
    console.log('');
    console.log(chalk.yellow('  You can update manually by running:'));
    console.log(chalk.cyan(`  ${updateInfo.updateCommand}`));
    console.log('');
    throw error;
  }
}

