// Command: dsa test

import chalk from 'chalk';
import { loadConfig } from '../lib/loadConfig.js';
import { runCommand } from '../lib/runCommand.js';
import { parseReport } from '../lib/parseReport.js';
import type { DSAReport, TestCase } from '../../types/report.js';

/**
 * Clean up technical error messages to be more user-friendly
 */
function cleanErrorMessage(testCase: TestCase): string {
  if (!testCase.message) return 'Test failed - check your implementation';
  
  const msg = testCase.message;
  
  // Pattern 1: "is not a constructor" - means class not exported properly
  if (msg.includes('is not a constructor')) {
    return `Your ${testCase.subchallengeId} class/function is not properly exported. Make sure you export it correctly.`;
  }
  
  // Pattern 2: "is not a function" - means method not implemented
  if (msg.includes('is not a function')) {
    const methodMatch = msg.match(/\.(\w+) is not a function/);
    if (methodMatch) {
      return `The method "${methodMatch[1]}" is not implemented or not working correctly.`;
    }
    return 'A required method is missing or not implemented correctly.';
  }
  
  // Pattern 3: TypeError/ReferenceError - show simplified version
  if (msg.includes('TypeError:') || msg.includes('ReferenceError:')) {
    // Extract just the error type and description, skip stack traces
    const lines = msg.split('\n');
    const errorLine = lines.find(l => l.includes('Error:'));
    if (errorLine) {
      return errorLine.trim().replace(/^(Type|Reference)Error:\s*/, 'Error: ');
    }
  }
  
  // Pattern 4: Expected vs actual values - keep these, they're useful
  if (msg.includes('Expected') || msg.includes('expected')) {
    const lines = msg.split('\n');
    const relevantLines = lines.filter(l => 
      l.includes('Expected') || 
      l.includes('expected') || 
      l.includes('Received') ||
      l.includes('received') ||
      l.includes('got') ||
      l.includes('but')
    );
    if (relevantLines.length > 0) {
      return relevantLines.join('\n').trim();
    }
  }
  
  // Pattern 5: Remove vitest/test framework stack traces
  if (msg.includes('❯') || msg.includes('⎯')) {
    const lines = msg.split('\n');
    // Take first meaningful line before stack trace
    const meaningfulLines = lines.filter(l => 
      !l.includes('❯') && 
      !l.includes('⎯') && 
      !l.includes('tests/') && 
      !l.includes('.test.') &&
      l.trim().length > 0
    );
    if (meaningfulLines.length > 0) {
      return meaningfulLines[0].trim();
    }
  }
  
  // Default: take first line if multi-line, or return as-is
  const firstLine = msg.split('\n')[0].trim();
  return firstLine || 'Test failed - check your implementation';
}

/**
 * Run tests and display results
 * @param cwd - Current working directory (defaults to process.cwd())
 * @returns DSAReport object from the test runner
 */
export async function testCommand(cwd: string = process.cwd()): Promise<DSAReport> {
  // 1. Load project config
  const { config, projectRoot } = loadConfig(cwd);

  // 2. Run test command (from config)
  console.log('');
  console.log(chalk.bold.cyan('  ██████╗ ███████╗ █████╗     ████████╗███████╗███████╗████████╗'));
  console.log(chalk.bold.cyan('  ██╔══██╗██╔════╝██╔══██╗    ╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝'));
  console.log(chalk.bold.cyan('  ██║  ██║███████╗███████║       ██║   █████╗  ███████╗   ██║   '));
  console.log(chalk.bold.cyan('  ██║  ██║╚════██║██╔══██║       ██║   ██╔══╝  ╚════██║   ██║   '));
  console.log(chalk.bold.cyan('  ██████╔╝███████║██║  ██║       ██║   ███████╗███████║   ██║   '));
  console.log(chalk.bold.cyan('  ╚═════╝ ╚══════╝╚═╝  ╚═╝       ╚═╝   ╚══════╝╚══════╝   ╚═╝   '));
  console.log('');
  console.log(chalk.gray(`  Module: ${config.moduleId} | Language: ${config.language}`));
  console.log('');

  // Animated loading while tests run
  let dots = '';
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let frameIndex = 0;
  
  const loadingInterval = setInterval(() => {
    process.stdout.write('\r' + chalk.yellow(`  ${frames[frameIndex]} Running tests${dots}   `));
    dots = dots.length < 3 ? dots + '.' : '';
    frameIndex = (frameIndex + 1) % frames.length;
  }, 80);

  // Run tests silently - we'll show filtered results after parsing
  const result = await runCommand(config.testCommand, projectRoot);
  
  // Stop loading animation
  clearInterval(loadingInterval);
  process.stdout.write('\r' + ' '.repeat(50) + '\r'); // Clear the line

  // 3. Parse report file (always relative to project root)
  const reportPath = config.reportFile.startsWith('/')
    ? config.reportFile
    : `${projectRoot}/${config.reportFile}`;

  let report: DSAReport;
  try {
    report = parseReport(reportPath);
  } catch (error) {
    console.error(chalk.red('✗ Failed to parse test report'));
    console.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }

  // Small delay for visual transition
  await new Promise(resolve => setTimeout(resolve, 300));

  // 4. Display results - templates now handle progressive unlocking
  const currentIndex = report.currentChallengeIndex || config.currentChallengeIndex || 0;
  const runTests = report.cases.filter(tc => tc.message !== 'Challenge locked');
  const lockedTests = report.cases.filter(tc => tc.message === 'Challenge locked');
  const currentTest = report.cases[currentIndex]; // Test at current index in full array

  console.log('');
  console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.bold.white('  📊  TEST RESULTS'));
  console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log('');

  if (!currentTest) {
    console.log(chalk.yellow('  ⚠️  All challenges completed!'));
    console.log(chalk.cyan(`  Module: ${report.moduleId}`));
    console.log(chalk.green('  ✓ You have finished all challenges in this module.'));
    console.log('');
    return report;
  }

  await new Promise(resolve => setTimeout(resolve, 200));

  // Progress indicator
  const progressBar = '█'.repeat(currentIndex) + '░'.repeat(report.cases.length - currentIndex);
  console.log(chalk.gray(`  Progress: [${progressBar}] ${currentIndex}/${report.cases.length} completed`));
  console.log('');

  await new Promise(resolve => setTimeout(resolve, 250));

  // Display current challenge status
  console.log(chalk.bold.white(`  Challenge ${currentIndex + 1} of ${report.cases.length}`));
  console.log(chalk.gray(`  ─────────────────────────────────────────────────────────────`));
  console.log('');
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const icon = currentTest.passed ? chalk.green('✓') : chalk.red('✗');
  const status = currentTest.passed ? chalk.green.bold('PASSED') : chalk.red.bold('FAILED');
  const challengeName = chalk.white.bold(currentTest.subchallengeId);
  
  console.log(`  ${icon}  ${challengeName}`);
  
  await new Promise(resolve => setTimeout(resolve, 150));
  
  console.log(`      Status: ${status}`);

  if (!currentTest.passed && currentTest.message && currentTest.message !== 'Challenge locked') {
    await new Promise(resolve => setTimeout(resolve, 200));
    const cleanedMessage = cleanErrorMessage(currentTest);
    console.log('');
    console.log(chalk.yellow('      ⚠️  What went wrong:'));
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log(chalk.white(`      ${cleanedMessage}`));
  }

  console.log('');
  console.log(chalk.gray(`  ─────────────────────────────────────────────────────────────`));
  console.log('');

  await new Promise(resolve => setTimeout(resolve, 250));

  // Show appropriate next step message
  if (currentTest.passed) {
    console.log(chalk.green.bold('  ✨ Success!'));
    await new Promise(resolve => setTimeout(resolve, 150));
    console.log(chalk.white('  Your solution passed all tests for this challenge.'));
    console.log('');
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log(chalk.cyan('  📤 Next Step:'));
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log(chalk.white('     Run ') + chalk.bold('dsa submit') + chalk.white(' to save your progress and unlock the next challenge.'));
  } else {
    console.log(chalk.yellow.bold('  💡 Keep Going!'));
    await new Promise(resolve => setTimeout(resolve, 150));
    console.log(chalk.white('  Your solution needs some more work.'));
    console.log('');
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log(chalk.cyan('  💭 What to do:'));
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Provide specific guidance based on the error
    if (currentTest.message?.includes('is not a constructor')) {
      console.log(chalk.white('     1. Make sure you\'re exporting your class correctly'));
      await new Promise(resolve => setTimeout(resolve, 80));
      console.log(chalk.white('     2. Check the syntax: ') + chalk.bold('export class ClassName { }'));
      await new Promise(resolve => setTimeout(resolve, 80));
      console.log(chalk.white('     3. Verify the class name matches what\'s expected'));
    } else if (currentTest.message?.includes('is not a function')) {
      console.log(chalk.white('     1. Make sure the method is defined inside your class'));
      await new Promise(resolve => setTimeout(resolve, 80));
      console.log(chalk.white('     2. Check for typos in the method name'));
      await new Promise(resolve => setTimeout(resolve, 80));
      console.log(chalk.white('     3. Verify the method has the correct signature'));
    } else {
      console.log(chalk.white('     1. Read the error message above carefully'));
      await new Promise(resolve => setTimeout(resolve, 80));
      console.log(chalk.white('     2. Check your implementation in the source file'));
      await new Promise(resolve => setTimeout(resolve, 80));
      console.log(chalk.white('     3. Make sure your logic handles all cases'));
    }
    
    console.log('');
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log(chalk.gray('     Run ') + chalk.bold('dsa test') + chalk.gray(' again after making changes'));
  }

  console.log('');

  await new Promise(resolve => setTimeout(resolve, 200));

  // Show locked challenges
  if (lockedTests.length > 0) {
    console.log(chalk.gray('  🔒 Locked Challenges:'));
    await new Promise(resolve => setTimeout(resolve, 100));
    for (let i = 0; i < Math.min(3, lockedTests.length); i++) {
      console.log(chalk.gray(`     ${currentIndex + i + 2}. ${lockedTests[i].subchallengeId}`));
      await new Promise(resolve => setTimeout(resolve, 60));
    }
    if (lockedTests.length > 3) {
      console.log(chalk.gray(`     ... and ${lockedTests.length - 3} more`));
    }
    console.log('');
  }

  await new Promise(resolve => setTimeout(resolve, 150));

  console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log('');

  // 5. Return report for use by submit command
  return report;
}
