// CLI Entry Point

import { Command } from 'commander';
import { testCommand } from './commands/test.js';
import { submitCommand } from './commands/submit.js';

const program = new Command();

program
  .name('dsa')
  .description('DSA Lab CLI - Test and submit your solutions')
  .version('0.0.0');

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

// Parse arguments
program.parse(process.argv);

// If no command provided, show help
if (process.argv.length === 2) {
  program.help();
}
