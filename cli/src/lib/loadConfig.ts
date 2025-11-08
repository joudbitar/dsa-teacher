// Load project configuration

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import type { ProjectConfig } from '../../types/report.js';

/**
 * Find dsa.config.json by searching up the directory tree
 * @param startDir - Directory to start searching from
 * @returns Path to config file, or null if not found
 */
function findConfigFile(startDir: string): string | null {
  let currentDir = resolve(startDir);

  // Search up to root directory
  const root = resolve('/');
  while (currentDir !== root) {
    const configPath = resolve(currentDir, 'dsa.config.json');
    if (existsSync(configPath)) {
      return configPath;
    }
    
    // Move to parent directory
    const parent = dirname(currentDir);
    if (parent === currentDir) {
      break; // Reached root
    }
    currentDir = parent;
  }

  return null;
}

/**
 * Load and validate project configuration
 * @param cwd - Current working directory to search from
 * @returns Object with config and projectRoot (directory containing dsa.config.json)
 * @throws Error if config file not found or invalid
 */
export function loadConfig(cwd: string = process.cwd()): { config: ProjectConfig; projectRoot: string } {
  const configPath = findConfigFile(cwd);

  if (!configPath) {
    throw new Error(
      'Not a DSA project. Run this command inside a cloned challenge repo.\n' +
      'Make sure dsa.config.json exists in the project directory.'
    );
  }

  const projectRoot = dirname(configPath);

  try {
    const configContent = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configContent) as Partial<ProjectConfig>;

    // Validate required fields
    const requiredFields: (keyof ProjectConfig)[] = [
      'projectId',
      'projectToken',
      'moduleId',
      'language',
      'apiUrl',
      'testCommand',
      'reportFile',
    ];

    const missingFields = requiredFields.filter((field) => !config[field]);

    if (missingFields.length > 0) {
      throw new Error(
        `Invalid dsa.config.json: Missing required fields: ${missingFields.join(', ')}\n` +
        `Config file: ${configPath}`
      );
    }

    // Ensure currentChallengeIndex defaults to 0 for backward compatibility
    if (config.currentChallengeIndex === undefined) {
      config.currentChallengeIndex = 0;
    }

    return {
      config: config as ProjectConfig,
      projectRoot,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Invalid JSON in dsa.config.json: ${error.message}\n` +
        `Config file: ${configPath}`
      );
    }
    if (error instanceof Error && error.message.includes('Invalid dsa.config.json')) {
      throw error;
    }
    throw new Error(
      `Failed to read dsa.config.json: ${error instanceof Error ? error.message : 'Unknown error'}\n` +
      `Config file: ${configPath}`
    );
  }
}
