# Web Authentication

## MVP Strategy: Anonymous Users

For the hackathon MVP, we skip traditional authentication and use **anonymous user identifiers** stored in browser localStorage.

## How It Works

### User Identification

When a user first visits the site:

1. Check `localStorage.getItem('dsa-user-id')`
2. If not found, generate a UUID: `crypto.randomUUID()`
3. Store it: `localStorage.setItem('dsa-user-id', uuid)`
4. Use this UUID for all API requests

### API Requests

Include the user ID in all authenticated requests:

```typescript
const userId = localStorage.getItem('dsa-user-id');

fetch('/api/projects', {
  headers: {
    'x-user-id': userId,
    'Content-Type': 'application/json'
  }
});
```

### Server-Side Validation

API handlers extract and use the user ID:

```typescript
const userId = request.headers['x-user-id'];

// Store in database
await db.projects.insert({
  userId: userId,
  moduleId: 'stack',
  // ...
});

// Query user's projects
await db.projects.findMany({
  where: { userId: userId }
});
```

## Security Implications

### ✅ Acceptable for MVP

- Users can test the platform immediately (zero friction)
- No email verification delays
- No password management
- Perfect for hackathon demo

### ⚠️ Limitations

- User ID can be spoofed (anyone can set `x-user-id` header)
- No way to recover projects if localStorage is cleared
- No cross-device sync
- No way to prove project ownership

### 🔒 Mitigation

For MVP, these risks are acceptable because:
- Private repos are the real security boundary
- User can't access another user's GitHub repo without credentials
- CLI uses project-scoped tokens (separate auth)
- No sensitive data stored in profiles

## User Experience

### First Visit

```typescript
// App initialization
useEffect(() => {
  let userId = localStorage.getItem('dsa-user-id');
  
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('dsa-user-id', userId);
  }
  
  setCurrentUserId(userId);
}, []);
```

User sees: **No sign-up form, just "Start Learning" button**

### Subsequent Visits

User ID persists in localStorage → instant access to their projects

### Lost Session

If user clears browser data:
- Loses access to old projects in UI
- But can still clone GitHub repos and use CLI
- Projects remain in database (orphaned)

## API Endpoints Behavior

### `GET /api/projects`

Returns projects for the user:

```typescript
const projects = await db.projects.findMany({
  where: { userId: request.headers['x-user-id'] }
});
```

Empty array if user ID is new.

### `POST /api/projects`

Creates project owned by the user:

```typescript
const project = await db.projects.create({
  userId: request.headers['x-user-id'],
  moduleId: body.moduleId,
  // ...
});
```

### `GET /api/modules`

Public endpoint, no user ID required.

### `POST /api/submissions`

Uses **project token** (from CLI), not user ID.

## Database Schema Impact

```sql
projects.userId TEXT  -- Stores the anonymous UUID
```

No `users` table needed for MVP.

## Future: Real Authentication (Post-MVP)

When adding Clerk, Supabase Auth, or similar:

### Migration Path

1. Add `users` table with email/auth fields
2. Add `projects.userId` foreign key constraint
3. Migration script to link anonymous projects:
   - Prompt user to "claim" projects by email
   - Match old `userId` to new authenticated `user.id`

### Enhanced Flow

```typescript
// With Clerk
const { user } = useUser();

fetch('/api/projects', {
  headers: {
    'Authorization': `Bearer ${await getToken()}`
  }
});
```

Server validates JWT and extracts real user ID.

### Why Not Start With Auth?

**Time savings for MVP:**
- No auth provider setup (Clerk, Supabase, Auth0)
- No email templates
- No OAuth app configuration
- No session management
- No password reset flows

**Can add auth later** without breaking existing API contracts (just swap `x-user-id` header for JWT).

## Implementation Notes

### Frontend Hook

```typescript
// hooks/useUserId.ts
export function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    let id = localStorage.getItem('dsa-user-id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('dsa-user-id', id);
    }
    setUserId(id);
  }, []);
  
  return userId;
}
```

### API Client Wrapper

```typescript
// lib/api.ts
function getHeaders() {
  const userId = localStorage.getItem('dsa-user-id');
  return {
    'x-user-id': userId,
    'Content-Type': 'application/json'
  };
}

export async function fetchProjects() {
  const response = await fetch('/api/projects', {
    headers: getHeaders()
  });
  return response.json();
}
```

### Backend Middleware

```typescript
// api/middleware/auth.ts
export function requireUserId(handler) {
  return async (req, res) => {
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(400).json({ 
        error: 'Missing x-user-id header' 
      });
    }
    
    req.userId = userId;
    return handler(req, res);
  };
}
```

## Testing Considerations

### Multi-User Testing

Open different browser profiles:
- Chrome Profile 1 → User A (different UUID)
- Chrome Profile 2 → User B (different UUID)
- Incognito → User C (different UUID)

Each gets isolated projects.

### Reset User

For testing: `localStorage.removeItem('dsa-user-id')`

Next page load generates new ID.

## Summary

Anonymous localStorage-based user IDs provide **zero-friction onboarding** for the MVP. Real authentication can be added post-hackathon without major refactoring. The CLI auth (project tokens) is independent and unaffected by this choice.

