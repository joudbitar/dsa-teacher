# DSA Lab Edge Functions

## Local Development

1. Start Supabase functions:
   ```bash
   cd supabase
   cp .env.example .env
   # Edit .env with your credentials
   supabase functions serve --env-file .env
   ```

2. Test endpoints:
   ```bash
   # Modules
   curl http://localhost:54321/functions/v1/modules
   
   # Projects
   curl -H "x-user-id: test-123" http://localhost:54321/functions/v1/projects
   
   # Create project
   curl -X POST http://localhost:54321/functions/v1/projects \
     -H "x-user-id: test-123" \
     -H "Content-Type: application/json" \
     -d '{"moduleId":"stack","language":"TypeScript"}'
   ```

## Deployment

```bash
supabase functions deploy modules
supabase functions deploy projects
supabase functions deploy submissions
```

## Endpoints

### GET /modules
Returns all available DSA modules from `infra/modules.json`.

**Response:**
```json
{
  "modules": [
    {
      "id": "stack",
      "name": "Stack",
      "description": "..."
    }
  ]
}
```

### GET /projects
Fetch user's projects.

**Headers:**
- `x-user-id`: User identifier (required)

**Query Parameters:**
- `moduleId`: Filter by module (optional)

**Response:**
```json
[
  {
    "id": "uuid",
    "userId": "test-123",
    "moduleId": "stack",
    "language": "TypeScript",
    "status": "in_progress",
    "progress": 50,
    "githubRepoUrl": "https://github.com/...",
    "createdAt": "2025-11-08T..."
  }
]
```

### POST /projects
Create a new project with GitHub repository.

**Headers:**
- `x-user-id`: User identifier (required)

**Body:**
```json
{
  "moduleId": "stack",
  "language": "TypeScript"
}
```

**Response:**
```json
{
  "id": "uuid",
  "githubRepoUrl": "https://github.com/...",
  "status": "in_progress",
  "progress": 0
}
```

### POST /submissions
Submit test results.

**Headers:**
- `Authorization`: Bearer token (project token)

**Body:**
```json
{
  "projectId": "uuid",
  "result": "pass",
  "summary": "10/10 tests passed",
  "details": {
    "cases": [
      {
        "id": "push",
        "passed": true
      }
    ]
  },
  "commitSha": "abc123"
}
```

**Response:**
```json
{
  "id": "uuid",
  "createdAt": "2025-11-08T...",
  "projectUpdated": true,
  "progress": 100,
  "status": "passed"
}
```

