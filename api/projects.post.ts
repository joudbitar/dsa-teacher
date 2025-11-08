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
// TODO (implementation):
// 1. Verify JWT and extract userId
// 2. Validate request body (moduleId, language)
// 3. Generate repo name: `${username}-${moduleId}-${language.toLowerCase()}`
// 4. Authenticate with GitHub App using Octokit
// 5. Create private repo from template (template-dsa-${moduleId})
//    - Use GitHub API: POST /repos/{template_owner}/{template_repo}/generate
// 6. Add user as collaborator with write access
// 7. Create dsa.config.json in repo with projectId and metadata
// 8. Insert row in projects table with githubRepoUrl
// 9. Return project object
// 10. Handle errors: duplicate project, GitHub API failures, DB errors

