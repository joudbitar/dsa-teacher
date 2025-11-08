# API Reference

Documentation for the DSA Lab backend API.

## Base URL

```
https://api.dsa-lab.com
```

## Authentication

All API requests require a project token in the Authorization header:

```
Authorization: Bearer your-project-token
```

Project tokens are obtained from the challenge page after selecting a language.

## Endpoints

### Get All Modules

Get a list of all available challenges.

```http
GET /api/modules
```

**Response:**

```json
{
  "modules": [
    {
      "id": "stack",
      "title": "Build a Stack",
      "level": "Beginner",
      "description": "Implement a stack data structure",
      "steps": 6,
      "languages": ["typescript", "python", "javascript"]
    }
  ]
}
```

### Create Project

Create a new project for a challenge.

```http
POST /api/projects
Content-Type: application/json
```

**Request Body:**

```json
{
  "moduleId": "stack",
  "language": "typescript"
}
```

**Response:**

```json
{
  "id": "project-123",
  "moduleId": "stack",
  "language": "typescript",
  "token": "project-token-here",
  "repoUrl": "https://github.com/dsa-lab/stack-typescript",
  "status": "not_started",
  "progress": 0
}
```

### Get Project

Get project details and progress.

```http
GET /api/projects/{projectId}
Authorization: Bearer {projectToken}
```

**Response:**

```json
{
  "id": "project-123",
  "moduleId": "stack",
  "language": "typescript",
  "status": "in_progress",
  "progress": 60,
  "completedSteps": [1, 2, 3],
  "currentStep": 4
}
```

### Submit Solution

Submit a solution for testing.

```http
POST /api/submissions
Authorization: Bearer {projectToken}
Content-Type: application/json
```

**Request Body:**

```json
{
  "projectId": "project-123",
  "testResults": {
    "passed": 4,
    "total": 5,
    "cases": [
      {
        "subchallengeId": "create-class",
        "passed": true
      },
      {
        "subchallengeId": "push",
        "passed": true
      }
    ]
  }
}
```

**Response:**

```json
{
  "id": "submission-456",
  "projectId": "project-123",
  "status": "partial",
  "progress": 80,
  "message": "4 out of 5 tests passed"
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes

- `401 Unauthorized`: Invalid or missing project token
- `404 Not Found`: Resource not found
- `400 Bad Request`: Invalid request data
- `500 Internal Server Error`: Server error

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **100 requests per minute** per project token
- **1000 requests per hour** per project token

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1633024800
```

## Examples

### Creating a project with curl

```bash
curl -X POST https://api.dsa-lab.com/api/projects \\
  -H "Content-Type: application/json" \\
  -d '{
    "moduleId": "stack",
    "language": "typescript"
  }'
```

### Getting project status

```bash
curl https://api.dsa-lab.com/api/projects/project-123 \\
  -H "Authorization: Bearer your-project-token"
```

### Submitting a solution

```bash
curl -X POST https://api.dsa-lab.com/api/submissions \\
  -H "Authorization: Bearer your-project-token" \\
  -H "Content-Type: application/json" \\
  -d @test-results.json
```

