// Command: dsa test

import chalk from 'chalk';
import { loadConfig } from '../lib/loadConfig.js';
import { runCommand } from '../lib/runCommand.js';
import { parseReport } from '../lib/parseReport.js';
import type { DSAReport } from '../../types/report.js';

/**
 * Run tests and display results
 * @param cwd - Current working directory (defaults to process.cwd())
 * @returns DSAReport object from the test runner
 */
export async function testCommand(cwd: string = process.cwd()): Promise<DSAReport> {
  // 1. Load project config
  const config = loadConfig(cwd);

  // 2. Run test command (from config)
  console.log(chalk.blue(`Running tests: ${config.testCommand}`));
  console.log('');

  const result = await runCommand(config.testCommand, cwd);

  // Stream output if available (execa already handles this, but we can show it)
  if (result.stdout) {
    console.log(result.stdout);
  }
  if (result.stderr) {
    console.error(result.stderr);
  }

  // 3. Parse report file
  const reportPath = config.reportFile.startsWith('/')
    ? config.reportFile
    : `${cwd}/${config.reportFile}`;

  let report: DSAReport;
  try {
    report = parseReport(reportPath);
  } catch (error) {
    console.error(chalk.red('✗ Failed to parse test report'));
    console.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }

  // 4. Display results with color
  console.log('');
  if (report.pass) {
    console.log(chalk.green('✓ All tests passed!'));
  } else {
    console.log(chalk.red('✗ Some tests failed'));
  }

  console.log(chalk.cyan(`Summary: ${report.summary}`));
  console.log('');

  // Show individual test results
  if (report.cases.length > 0) {
    console.log('Test Results:');
    for (const testCase of report.cases) {
      const icon = testCase.passed ? chalk.green('✓') : chalk.red('✗');
      const name = chalk.white(testCase.subchallengeId);
      const status = testCase.passed
        ? chalk.green('PASSED')
        : chalk.red('FAILED');

      console.log(`  ${icon} ${name} - ${status}`);

      if (!testCase.passed && testCase.message) {
        console.log(chalk.gray(`    ${testCase.message}`));
      }
    }
    console.log('');
  }

  // 5. Return report for use by submit command
  return report;
}
