# CLI Authentication

## MVP Authentication Strategy

**No `dsa login` command for MVP.** Authentication uses project-scoped tokens embedded in repository configuration.

## How It Works

### Token Generation

When a project is created via `POST /api/projects`:

1. Server generates a random token (32-48 characters)
2. Token is stored in `projects.projectToken` column
3. Token is written to `dsa.config.json` in the GitHub repo

**Token characteristics:**
- Cryptographically secure random string
- 32-48 characters (alphanumeric + special chars)
- No expiration (acceptable for hackathon scope)
- Project-scoped (cannot access other projects)

### Token Storage

**Server-side:**
```sql
projects.projectToken (TEXT, indexed for fast lookups)
```

**Client-side (in repo):**
```json
{
  "projectId": "uuid",
  "projectToken": "abc123...xyz789",
  "moduleId": "stack",
  "language": "TypeScript",
  "testCommand": "node tests/run.js",
  "reportFile": ".dsa-report.json"
}
```

### CLI Usage

When running `dsa test` or `dsa submit`:

1. CLI reads `dsa.config.json` from current directory
2. Extracts `projectId` and `projectToken`
3. Sends HTTP request to API with Authorization header:

```typescript
const headers = {
  'Authorization': `Bearer ${config.projectToken}`,
  'Content-Type': 'application/json'
};
```

### API Validation

`POST /api/submissions` endpoint:

1. Extract token from `Authorization: Bearer <token>` header
2. Query database:
   ```sql
   SELECT id, userId, moduleId 
   FROM projects 
   WHERE projectToken = '<token>'
   ```
3. If no match: `401 Unauthorized`
4. If match: proceed with submission

## Security Considerations

### For MVP (Acceptable)

- ✅ Token embedded in private repo
- ✅ Repo is private (user must have access to clone)
- ✅ Token only grants access to one project
- ✅ Simple implementation for hackathon

### Future Enhancements (Post-Hackathon)

- 🔄 Add token expiration (30-90 days)
- 🔄 Add token refresh mechanism
- 🔄 Add token revocation endpoint
- 🔄 Implement `dsa login` with OAuth or magic link
- 🔄 Store tokens in `~/.dsa/credentials` (encrypted)
- 🔄 Add rate limiting per token
- 🔄 Log token usage for audit trail

## Error Scenarios

### Token Not Found

**CLI reads config but token is invalid/revoked**

Response: `401 Unauthorized`
```json
{
  "error": "Invalid or expired project token"
}
```

User action: Contact support or recreate project

### Config File Missing

**User runs `dsa submit` outside a DSA project**

CLI error:
```
Error: dsa.config.json not found.
Are you inside a DSA Lab project directory?
```

User action: `cd` into correct directory

### Token Stolen/Leaked

**User accidentally commits token to public repo**

Mitigation (future):
- API detects unusual submission patterns
- Email alert to user
- Token revocation endpoint

For MVP: Token is in private repo, so leak risk is low.

## Alternative Approaches (Rejected for MVP)

### ❌ User-scoped JWT

**Why rejected:** Requires `dsa login`, OAuth setup, token refresh logic. Too complex for MVP.

### ❌ API Key in Environment Variable

**Why rejected:** User must manually set `DSA_TOKEN` env var. Poor UX compared to auto-embedded token.

### ❌ SSH Key-based Auth

**Why rejected:** Requires key generation, registration. Overkill for simple submissions API.

## Summary

Project-scoped tokens provide **simple, secure-enough authentication** for the hackathon MVP. The token is automatically embedded during project creation, requiring zero manual auth steps from the user.

