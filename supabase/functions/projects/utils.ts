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
    "Java": "mvn test",
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
