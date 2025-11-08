// Git operations

import { execa } from 'execa';

export interface GitStatus {
  clean: boolean; // true if no uncommitted changes
  commitSha: string; // current HEAD commit
}

/**
 * Check git status and get current commit SHA
 * @param cwd - Working directory to check
 * @returns Git status object
 */
export async function checkStatus(cwd: string): Promise<GitStatus> {
  try {
    // Check if working tree is clean
    const statusResult = await execa('git', ['status', '--porcelain'], {
      cwd,
      reject: false, // Don't throw on non-zero exit
    });

    const clean = statusResult.stdout.trim().length === 0;

    // Get current commit SHA
    const commitResult = await execa('git', ['rev-parse', 'HEAD'], {
      cwd,
      reject: false,
    });

    const commitSha = commitResult.exitCode === 0 
      ? commitResult.stdout.trim() 
      : 'unknown';

    return {
      clean,
      commitSha,
    };
  } catch (error) {
    // If git commands fail (not a git repo, git not installed, etc.)
    // Return default values
    return {
      clean: true,
      commitSha: 'unknown',
    };
  }
}
