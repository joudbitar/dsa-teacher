// Execute shell command

import { execa } from 'execa';

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

/**
 * Execute a shell command and capture output
 * @param command - Command string to execute (e.g., "npm test")
 * @param cwd - Working directory to run command in
 * @returns Command result with stdout, stderr, and exit code
 */
export async function runCommand(
  command: string,
  cwd: string = process.cwd()
): Promise<CommandResult> {
  // Split command into parts (handle simple commands, not full shell parsing)
  const parts = command.trim().split(/\s+/);
  const [cmd, ...args] = parts;

  try {
    const result = await execa(cmd, args, {
      cwd,
      all: true, // Capture both stdout and stderr
      reject: false, // Don't throw on non-zero exit
    });

    return {
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      exitCode: result.exitCode ?? 0,
    };
  } catch (error) {
    // execa should not throw with reject: false, but handle just in case
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      stdout: '',
      stderr: errorMessage,
      exitCode: 1,
    };
  }
}
