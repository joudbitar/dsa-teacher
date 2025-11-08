# GitHub App Flow

## GitHub App Permissions

The DSA Lab GitHub App requires the following permissions:

- **Repository Administration**: Read & Write (to create repos from templates)
- **Repository Contents**: Read & Write (to commit `dsa.config.json`)
- **Repository Metadata**: Read (to access repo details)

## Template Repositories

All templates are **private** and **TypeScript-only** for MVP:

- `template-dsa-stack-ts`
- `template-dsa-queue-ts`
- `template-dsa-binary-search-ts`
- `template-dsa-min-heap-ts`

Templates must exist in the GitHub organization before project creation.

## New Project Creation Flow

When a user starts a new project via `POST /api/projects`:

### Step 1: Insert Project Row

```sql
INSERT INTO projects (
  id,
  userId,
  moduleId,
  language,
  status,
  progress,
  projectToken,
  createdAt,
  updatedAt
) VALUES (
  uuid_generate_v4(),
  '<userId>',
  '<moduleId>',
  'TypeScript',
  'in_progress',
  0,
  '<random-32-48-chars>',
  NOW(),
  NOW()
)
```

Generate `projectToken` as a cryptographically secure random string (32-48 characters).

### Step 2: Create Repository from Template

Use Octokit to create repo from template:

```typescript
const response = await octokit.repos.createUsingTemplate({
  template_owner: process.env.GITHUB_ORG,
  template_repo: `template-dsa-${moduleId}-ts`,
  owner: process.env.GITHUB_ORG,
  name: `${username}-${moduleId}-ts`,
  private: true,
  description: `DSA Lab: ${moduleName} challenge`,
});
```

### Step 3: Commit dsa.config.json

Update the config file in the newly created repo:

```typescript
const configContent = {
  projectId: project.id,
  projectToken: project.projectToken,
  moduleId: moduleId,
  language: "TypeScript",
  testCommand: "node tests/run.js",
  reportFile: ".dsa-report.json",
};

const encodedContent = Buffer.from(
  JSON.stringify(configContent, null, 2)
).toString("base64");

await octokit.repos.createOrUpdateFileContents({
  owner: process.env.GITHUB_ORG,
  repo: `${username}-${moduleId}-ts`,
  path: "dsa.config.json",
  message: "Configure DSA Lab project credentials",
  content: encodedContent,
  // Get the current file SHA first if it exists
  sha: existingFile?.sha,
});
```

### Step 4: Update Project with Repo URL

```sql
UPDATE projects
SET githubRepoUrl = '<repo-url>',
    updatedAt = NOW()
WHERE id = '<project-id>'
```

## Error Handling

### Template Creation Fails (Step 2)

**Response:** `500 Internal Server Error`

**Recovery:**

- Delete the project row from database, OR
- Mark `status = 'failed'` and include error message in response

**User action:** Retry project creation

### Config Commit Fails (Step 3)

**Response:** `202 Accepted` (partial success)

**Recovery:**

- Mark `status = 'needs_config'`
- Store `githubRepoUrl` in project
- Return response indicating manual setup required

**User action:**

- Manually create `dsa.config.json` in repo, OR
- Retry via a `/api/projects/:id/configure` endpoint (future enhancement)

### Repository Already Exists

**Response:** `409 Conflict`

**Message:** "Repository name already exists. Please delete the old repo or choose a different module."

## Security Notes

- All created repos are **private**
- User is NOT added as collaborator (MVP scope)
- Templates remain private in the organization
- Project tokens are stored server-side and embedded in config only
