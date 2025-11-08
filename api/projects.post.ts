// POST /api/projects
// Creates a new project and provisions a GitHub repository
//
// Request Headers:
//   Authorization: Bearer <supabase-jwt>
//   Content-Type: application/json
//
// Request Body:
// {
//   "moduleId": "stack",
//   "language": "TypeScript"
// }
//
// Response: 201 Created
// {
//   "id": "uuid",
//   "githubRepoUrl": "https://github.com/org/user-stack-ts",
//   "status": "in_progress",
//   "progress": 0
// }
//
// Environment Variables:
//   SUPABASE_SERVICE_ROLE - Supabase service role key
//   GITHUB_APP_ID - GitHub App ID
//   GITHUB_APP_PRIVATE_KEY - GitHub App private key (PEM format)
//   GITHUB_APP_INSTALLATION_ID - GitHub App installation ID
//   GITHUB_ORG - GitHub organization name
//
// Tables Accessed:
//   projects (insert)
//
// Language to Template Suffix Mapping:
const languageToSuffix: Record<string, string> = {
  "TypeScript": "ts",
  "JavaScript": "js",
  "Python": "py",
  "Go": "go",
  "Java": "java",
  "C++": "cpp"
};

// Module-Language Support Matrix
const supportedCombos: Record<string, string[]> = {
  "stack": ["TypeScript", "JavaScript", "Python", "Go", "Java", "C++"],
  "queue": ["TypeScript", "JavaScript", "Python", "Go", "Java", "C++"],
  "binary-search": ["TypeScript", "JavaScript", "Python", "Go", "Java", "C++"],
  "min-heap": ["TypeScript", "JavaScript", "Python", "Go", "Java", "C++"]
};
//
// TODO (implementation):
// 1. Verify JWT and extract userId
// 2. Validate request body (moduleId, language)
//    - Check if moduleId exists in supportedCombos
//    - Check if language is supported for the module:
//      if (!supportedCombos[moduleId]?.includes(language)) {
//        return res.status(400).json({
//          error: `${language} not yet supported for ${moduleId}. Available: ${supportedCombos[moduleId].join(", ")}`
//        });
//      }
// 3. Generate repo name: `${username}-${moduleId}-${languageToSuffix[language]}`
// 4. Authenticate with GitHub App using Octokit
// 5. Create private repo from template using language-specific template:
//    - Template repo name: `template-dsa-${moduleId}-${languageToSuffix[language]}`
//    - Use GitHub API: POST /repos/{template_owner}/{template_repo}/generate
// 6. Add user as collaborator with write access
// 7. Create dsa.config.json in repo with projectId and metadata
// 8. Insert row in projects table with githubRepoUrl
// 9. Return project object
// 10. Handle errors: duplicate project, GitHub API failures, DB errors

