export const languageToSuffix: Record<string, string> = {
  "TypeScript": "ts",
  "JavaScript": "js",
  "Python": "py",
  "Go": "go",
  "Java": "java",
  "C++": "cpp"
};

export const supportedCombos: Record<string, string[]> = {
  "stack": ["TypeScript", "JavaScript", "Python", "Go", "Java", "C++"],
  "queue": ["TypeScript", "JavaScript", "Python", "Go", "Java", "C++"],
  "binary-search": ["TypeScript", "JavaScript", "Python", "Go", "Java", "C++"],
  "min-heap": ["TypeScript", "JavaScript", "Python", "Go", "Java", "C++"]
};

export function getTestCommand(language: string): string {
  const commands: Record<string, string> = {
    "TypeScript": "npm test",
    "JavaScript": "npm test",
    "Python": "python3 tests/run.py",
    "Go": "go run tests/run.go",
    "Java": "bash tests/run.sh",
    "C++": "bash tests/run.sh"
  };
  return commands[language] || "npm test";
}

export function generateToken(): string {
  return crypto.randomUUID() + crypto.randomUUID().replace(/-/g, '');
}

export function validateLanguageSupport(moduleId: string, language: string): boolean {
  return supportedCombos[moduleId]?.includes(language) ?? false;
}

/**
 * Generate a short, readable user code from a userId (UUID).
 * Creates a 7-character base36 code (0-9, a-z) for use in repository names.
 * 
 * @param userId - The user's UUID
 * @returns A 7-character readable code (e.g., "k8m2x9p")
 */
export function generateUserCode(userId: string): string {
  // Remove hyphens from UUID and take first 16 hex characters
  const uuidWithoutHyphens = userId.replace(/-/g, '');
  
  // Convert hex string to BigInt, then to base36 (0-9, a-z)
  // This ensures consistent output for the same userId
  const hexValue = uuidWithoutHyphens.substring(0, 16);
  const numValue = BigInt('0x' + hexValue);
  
  // Convert to base36 (0-9, a-z)
  let base36 = numValue.toString(36);
  
  // Ensure we have exactly 7 characters by padding or truncating
  if (base36.length < 7) {
    base36 = base36.padStart(7, '0');
  } else {
    base36 = base36.substring(0, 7);
  }
  
  return base36;
}
