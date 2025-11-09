# DSA Lab API

Supabase Edge Functions (Deno runtime) for DSA Lab backend.

## Base URL

**Production**: `https://<your-project-ref>.supabase.co/functions/v1`  
**Local**: `http://localhost:54321/functions/v1`

## Endpoints

### GET /modules

Returns all available challenge modules.

**Headers**: None required  
**Response**:

```json
{
  "modules": [
    {
      "id": "stack",
      "title": "Build a Stack",
      "level": "beginner",
      "subchallenges": ["Create class", "push()", "pop()", "peek()", "size()"]
    }
  ]
}
```

### GET /projects

Lists user's projects (optionally filtered by module).

**Headers**:

- `x-user-id` (required)

**Query Params**:

- `moduleId` (optional)

**Response**:

```json
[
  {
    "id": "uuid",
    "userId": "user-uuid",
    "moduleId": "stack",
    "language": "TypeScript",
    "status": "in_progress",
    "progress": 60,
    "githubRepoUrl": "https://github.com/...",
    "createdAt": "2025-11-08T..."
  }
]
```

### POST /projects

Creates a new project with GitHub repository.

**Headers**:

- `x-user-id` (required)
- `Content-Type: application/json`

**Body**:

```json
{
  "moduleId": "stack",
  "language": "TypeScript"
}
```

**Response** (201):

```json
{
  "id": "uuid",
  "githubRepoUrl": "https://github.com/org/user-stack-ts",
  "status": "in_progress",
  "progress": 0
}
```

**What it does**:

1. Generates project token
2. Creates database record
3. Creates GitHub repo from template
4. Commits `dsa.config.json` with credentials
5. Updates database with GitHub URL

### POST /submissions

Submits test results and updates progress.

**Headers**:

- `Authorization: Bearer <projectToken>` (required)
- `Content-Type: application/json`

**Body**:

```json
{
  "projectId": "uuid",
  "result": "fail",
  "summary": "3/5 tests passed",
  "details": {
    "cases": [
      {
        "id": "push",
        "passed": true
      },
      {
        "id": "pop",
        "passed": false,
        "message": "Expected 5, got undefined"
      }
    ]
  },
  "commitSha": "abc123"
}
```

**Response** (201):

```json
{
  "id": "submission-uuid",
  "createdAt": "2025-11-08T...",
  "projectUpdated": true,
  "progress": 60,
  "status": "in_progress"
}
```

**What it does**:

1. Validates project token
2. Stores submission
3. Calculates progress: `(passedCount / totalCount) * 100`
4. Updates project status: `passed` if 100%, else `in_progress`

## Local Development

```bash
cd supabase

# Copy environment variables
cp ../.env.local .env

# Start functions
supabase functions serve --env-file .env

# Test
curl http://localhost:54321/functions/v1/modules
```

## Deployment

```bash
# Deploy all functions
supabase functions deploy

# Or individually
supabase functions deploy modules
supabase functions deploy projects
supabase functions deploy submissions

# Set secrets
supabase secrets set SUPABASE_URL="..."
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="..."
supabase secrets set GITHUB_ORG="..."
supabase secrets set GITHUB_APP_ID="..."
supabase secrets set GITHUB_APP_INSTALLATION_ID="..."
supabase secrets set GITHUB_APP_PRIVATE_KEY="..."
```

## Environment Variables

```bash
SUPABASE_URL                      # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY        # Service role key
GITHUB_ORG                        # GitHub org name
GITHUB_APP_ID                     # GitHub App ID
GITHUB_APP_INSTALLATION_ID       # Installation ID
GITHUB_APP_PRIVATE_KEY           # Private key (PEM format)
```

## Error Responses

All errors return JSON:

```json
{
  "error": "Error message",
  "details": "Optional additional info"
}
```

**Status Codes**:

- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (project ID mismatch)
- `404` - Not Found
- `500` - Internal Server Error

## Architecture

```
functions/
├── _shared/
│   ├── cors.ts              # CORS utilities
│   └── supabase.ts          # Supabase client
├── modules/
│   └── index.ts             # GET /modules
├── projects/
│   ├── index.ts             # Router
│   ├── get.ts               # GET handler
│   ├── post.ts              # POST handler (GitHub integration)
│   └── utils.ts             # Helper functions
└── submissions/
    └── index.ts             # POST /submissions
```
