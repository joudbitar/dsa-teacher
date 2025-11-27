// Check for CLI updates

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CURRENT_VERSION = '0.1.5';
const GITHUB_REPO = 'joudbitar/dsa-teacher';
const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface UpdateInfo {
  currentVersion: string;
  latestVersion: string;
  updateAvailable: boolean;
  updateCommand: string;
}

/**
 * Get current CLI version from package.json
 */
export function getCurrentVersion(): string {
  try {
    // Try to read from installed location first
    const packagePath = join(__dirname, '../../package.json');
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
    return packageJson.version || CURRENT_VERSION;
  } catch {
    return CURRENT_VERSION;
  }
}

/**
 * Fetch latest version from GitHub
 */
export async function getLatestVersion(): Promise<string | null> {
  try {
    // Check GitHub releases API
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'dsa-cli'
        }
      }
    );

    if (!response.ok) {
      // Fallback: check package.json from main branch
      const packageResponse = await fetch(
        `https://raw.githubusercontent.com/${GITHUB_REPO}/main/cli/package.json`
      );
      if (packageResponse.ok) {
        const packageJson = await packageResponse.json();
        return packageJson.version || null;
      }
      return null;
    }

    const release = await response.json();
    // Extract version from tag (e.g., "v0.1.0" -> "0.1.0")
    return release.tag_name?.replace(/^v/, '') || null;
  } catch (error) {
    // Network error or other issue - fail silently
    return null;
  }
}

/**
 * Compare semantic versions
 * Returns: 1 if v1 > v2, -1 if v1 < v2, 0 if equal
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }
  return 0;
}

/**
 * Check if update is available
 */
export async function checkForUpdate(): Promise<UpdateInfo> {
  const currentVersion = getCurrentVersion();
  const latestVersion = await getLatestVersion();

  if (!latestVersion) {
    return {
      currentVersion,
      latestVersion: currentVersion,
      updateAvailable: false,
      updateCommand: 'curl -fsSL https://raw.githubusercontent.com/joudbitar/dsa-teacher/main/scripts/install-cli.sh | bash',
    };
  }

  const updateAvailable = compareVersions(latestVersion, currentVersion) > 0;

  return {
    currentVersion,
    latestVersion,
    updateAvailable,
    updateCommand: 'curl -fsSL https://raw.githubusercontent.com/joudbitar/dsa-teacher/main/scripts/install-cli.sh | bash',
  };
}

/**
 * Check if we should check for updates (throttle to once per day)
 */
function getLastCheckTime(): number {
  try {
    const cacheFile = join(process.env.HOME || process.env.USERPROFILE || '', '.dsa-cli-update-check');
    if (existsSync(cacheFile)) {
      const content = readFileSync(cacheFile, 'utf-8').trim();
      return parseInt(content, 10) || 0;
    }
  } catch {
    // Ignore errors
  }
  return 0;
}

function setLastCheckTime(): void {
  try {
    const cacheFile = join(process.env.HOME || process.env.USERPROFILE || '', '.dsa-cli-update-check');
    writeFileSync(cacheFile, Date.now().toString(), 'utf-8');
  } catch {
    // Ignore errors
  }
}

/**
 * Check for updates if enough time has passed since last check
 */
export async function checkForUpdateIfNeeded(): Promise<UpdateInfo | null> {
  const lastCheck = getLastCheckTime();
  const now = Date.now();

  // Only check if 24 hours have passed
  if (now - lastCheck < CHECK_INTERVAL_MS) {
    return null;
  }

  // Only set last check time if we successfully checked (even if no update available)
  // This prevents blocking retries if network fails
  try {
    const result = await checkForUpdate();
    setLastCheckTime();
    return result;
  } catch {
    // If check fails, don't update timestamp so we can retry sooner
    return null;
  }
}

