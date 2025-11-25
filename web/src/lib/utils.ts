import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert a GitHub HTML URL to a git clone URL.
 * Adds .git extension if not present and ensures proper format.
 * 
 * @param htmlUrl - GitHub HTML URL (e.g., "https://github.com/owner/repo")
 * @returns Git clone URL (e.g., "https://github.com/owner/repo.git")
 */
export function toGitCloneUrl(htmlUrl: string): string {
  if (!htmlUrl) return htmlUrl;
  
  // If it already ends with .git, return as-is
  if (htmlUrl.endsWith('.git')) {
    return htmlUrl;
  }
  
  // If it's a GitHub URL, add .git extension
  if (htmlUrl.startsWith('https://github.com/') || htmlUrl.startsWith('http://github.com/')) {
    return `${htmlUrl}.git`;
  }
  
  // For other URLs, return as-is (might be SSH format or other)
  return htmlUrl;
}

