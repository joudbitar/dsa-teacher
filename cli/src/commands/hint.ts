// Command: dsa hint

import chalk from 'chalk';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { loadConfig } from '../lib/loadConfig.js';
import { parseReport } from '../lib/parseReport.js';

/**
 * Extract hints for a specific challenge from HINTS.md
 * Looks for sections like "## Challenge 1: push" or "## push"
 */
function extractChallengeHints(hintsContent: string, challengeName: string, challengeIndex: number): string | null {
  const lines = hintsContent.split('\n');
  const challengePatterns = [
    new RegExp(`^##\\s+Challenge\\s+${challengeIndex + 1}[:\\s]`, 'i'),
    new RegExp(`^##\\s+${challengeIndex + 1}[.\\s]`, 'i'),
    new RegExp(`^##\\s+${challengeName}`, 'i'),
    new RegExp(`^###\\s+${challengeName}`, 'i'),
  ];

  let startIndex = -1;
  let endIndex = lines.length;

  // Find the start of the challenge section
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (challengePatterns.some(pattern => pattern.test(line))) {
      startIndex = i;
      break;
    }
  }

  if (startIndex === -1) {
    return null; // No specific section found for this challenge
  }

  // Find the end of this section (next ## or ### header, or end of file)
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/^##+\s/)) {
      endIndex = i;
      break;
    }
  }

  // Extract the section
  const section = lines.slice(startIndex, endIndex).join('\n');
  return section.trim() || null;
}

/**
 * Display hints from HINTS.md file
 * @param cwd - Current working directory (defaults to process.cwd())
 */
export async function hintCommand(cwd: string = process.cwd()): Promise<void> {
  // 1. Load project config to get project root
  const { config, projectRoot } = loadConfig(cwd);

  // 2. Check if HINTS.md exists
  const hintsPath = resolve(projectRoot, 'HINTS.md');
  
  if (!existsSync(hintsPath)) {
    console.log('');
    console.log(chalk.yellow('⚠️  HINTS.md file not found in this project.'));
    console.log(chalk.gray(`   Expected location: ${hintsPath}`));
    console.log('');
    process.exit(0);
  }

  // 3. Read HINTS.md
  let hintsContent: string;
  try {
    hintsContent = readFileSync(hintsPath, 'utf-8');
  } catch (error) {
    console.error(chalk.red('✗ Failed to read HINTS.md'));
    console.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }

  // 4. Try to get current challenge info (optional - if report exists)
  let currentChallengeName: string | null = null;
  let currentChallengeIndex: number | null = null;
  
  try {
    const reportPath = config.reportFile.startsWith('/')
      ? config.reportFile
      : `${projectRoot}/${config.reportFile}`;
    
    if (existsSync(reportPath)) {
      const report = parseReport(reportPath);
      const index = report.currentChallengeIndex ?? config.currentChallengeIndex ?? 0;
      const currentChallenge = report.cases[index];
      
      if (currentChallenge && currentChallenge.message !== 'Challenge locked') {
        currentChallengeName = currentChallenge.subchallengeId;
        currentChallengeIndex = index;
      }
    }
  } catch (error) {
    // Report doesn't exist or can't be parsed - that's okay, just show all hints
  }

  // 5. Display hints
  console.log('');
  console.log(chalk.bold.cyan('  ██╗  ██╗██╗███╗   ██╗████████╗███████╗'));
  console.log(chalk.bold.cyan('  ██║  ██║██║████╗  ██║╚══██╔══╝██╔════╝'));
  console.log(chalk.bold.cyan('  ███████║██║██╔██╗ ██║   ██║   ███████╗'));
  console.log(chalk.bold.cyan('  ██╔══██║██║██║╚██╗██║   ██║   ╚════██║'));
  console.log(chalk.bold.cyan('  ██║  ██║██║██║ ╚████║   ██║   ███████║'));
  console.log(chalk.bold.cyan('  ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝'));
  console.log('');
  console.log(chalk.gray(`  Module: ${config.moduleId} | Language: ${config.language}`));
  console.log('');

  // 6. Try to extract challenge-specific hints, otherwise show all
  let displayContent: string;
  
  if (currentChallengeName && currentChallengeIndex !== null) {
    const challengeHints = extractChallengeHints(hintsContent, currentChallengeName, currentChallengeIndex);
    
    if (challengeHints) {
      console.log(chalk.cyan(`  💡 Hints for Challenge ${currentChallengeIndex + 1}: ${currentChallengeName}`));
      console.log('');
      displayContent = challengeHints;
    } else {
      console.log(chalk.cyan('  💡 All Hints'));
      console.log(chalk.gray(`  (Showing all hints - no specific section found for current challenge)`));
      console.log('');
      displayContent = hintsContent;
    }
  } else {
    console.log(chalk.cyan('  💡 All Hints'));
    console.log('');
    displayContent = hintsContent;
  }

  // 7. Display the hints with nice formatting
  console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log('');
  
  // Parse and display markdown-like content
  const lines = displayContent.split('\n');
  let inCodeBlock = false;
  let codeBlockLang = '';
  
  for (const line of lines) {
    // Handle code blocks
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        codeBlockLang = line.trim().slice(3).trim();
        inCodeBlock = true;
        console.log(chalk.gray('```' + codeBlockLang));
      } else {
        inCodeBlock = false;
        console.log(chalk.gray('```'));
      }
      continue;
    }
    
    if (inCodeBlock) {
      console.log(chalk.white(line));
      continue;
    }
    
    // Handle headers
    if (line.startsWith('# ')) {
      console.log('');
      console.log(chalk.bold.white(line.slice(2)));
      console.log('');
    } else if (line.startsWith('## ')) {
      console.log('');
      console.log(chalk.bold.cyan(line.slice(3)));
      console.log('');
    } else if (line.startsWith('### ')) {
      console.log('');
      console.log(chalk.bold.yellow(line.slice(4)));
      console.log('');
    } else if (line.startsWith('#### ')) {
      console.log(chalk.bold(line.slice(5)));
    } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      // Bullet points
      console.log(chalk.white('  • ') + chalk.white(line.trim().slice(2)));
    } else if (line.trim().startsWith('1. ') || line.trim().match(/^\d+\.\s/)) {
      // Numbered list
      console.log(chalk.white('  ') + chalk.white(line.trim()));
    } else if (line.trim() === '') {
      console.log('');
    } else {
      // Regular text
      console.log(chalk.white(line));
    }
  }
  
  console.log('');
  console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log('');
  
  // 8. Show helpful message
  if (currentChallengeName) {
    console.log(chalk.gray('  Run ') + chalk.bold('dsa test') + chalk.gray(' to check your progress'));
  } else {
    console.log(chalk.gray('  Run ') + chalk.bold('dsa test') + chalk.gray(' to see which challenge you\'re working on'));
  }
  console.log('');
}

