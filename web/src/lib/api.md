# API Client Library

## Purpose

Centralized HTTP client for interacting with backend API endpoints.

## Endpoints & Shapes

### GET /api/modules
**Response:**
```json
[
  {
    "id": "stack",
    "title": "Build a Stack",
    "level": "Beginner",
    "summary": "Implement push, pop, peek, size.",
    "subchallenges": ["Create class", "push()", "pop()", "peek()", "size()"],
    "template": "template-dsa-stack"
  }
]
```

### GET /api/projects
**Query params:** `?moduleId=<id>` (optional)
**Response:**
```json
[
  {
    "id": "uuid",
    "userId": "auth-id",
    "moduleId": "stack",
    "language": "TypeScript",
    "githubRepoUrl": "https://github.com/org/user-stack-ts",
    "status": "in_progress",
    "progress": 60,
    "createdAt": "2025-11-06T12:00:00Z",
    "updatedAt": "2025-11-06T14:30:00Z"
  }
]
```

### POST /api/projects
**Request body:**
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
  "githubRepoUrl": "https://github.com/org/user-stack-ts"
}
```

### POST /api/submissions
**Request body:**
```json
{
  "projectId": "uuid",
  "result": "pass",
  "summary": "All tests passed",
  "details": { "passed": 5, "failed": 0 }
}
```
**Response:**
```json
{
  "id": "uuid",
  "createdAt": "2025-11-06T15:00:00Z"
}
```

## Implementation Notes

- Use fetch API
- Include auth token in Authorization header (from Supabase session)
- Handle errors gracefully; return typed results

