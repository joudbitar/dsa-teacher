# DSA Lab Architecture

## Backend: Supabase Edge Functions

We're using **Supabase Edge Functions** (Deno runtime) instead of Vercel for the backend API.

### Why Supabase Edge Functions?

1. **Tight Integration** - Database and API on the same platform
2. **Edge Distribution** - Geographically distributed for low latency
3. **Deno Runtime** - Modern, secure, TypeScript-first runtime
4. **Realtime Ready** - Seamless integration with Supabase Realtime
5. **No Additional Deployment** - Everything in one place

### API Endpoints

**Production URL:** `https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1`  
**Local Dev URL:** `http://localhost:54321/functions/v1`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/modules` | GET | List available challenge modules |
| `/projects` | GET | Get user's projects |
| `/projects` | POST | Create new project + GitHub repo |
| `/submissions` | POST | Submit test results |

### Function Structure

```
supabase/functions/
├── _shared/           # Shared utilities
│   ├── cors.ts        # CORS helpers
│   └── supabase.ts    # Supabase client
├── modules/
│   ├── index.ts       # GET /modules
│   └── import_map.json
├── projects/
│   ├── index.ts       # Main handler
│   ├── get.ts         # GET handler
│   ├── post.ts        # POST handler (GitHub integration)
│   ├── utils.ts       # Helper functions
│   └── import_map.json
└── submissions/
    ├── index.ts       # POST /submissions
    └── import_map.json
```

## Frontend: React (Vite)

Location: `/web`

- Shows available challenges
- Tracks user progress
- Real-time updates via Supabase Realtime
- Anonymous users (UUID in localStorage)

**API Integration:**
```typescript
const API_BASE_URL = 'https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1';
```

## CLI: Node.js

Location: `/cli`

Commands:
- `dsa test` - Run tests locally
- `dsa submit` - Submit results to API

Reads `dsa.config.json` from user's repo:
```json
{
  "projectId": "uuid",
  "projectToken": "secret-token",
  "moduleId": "stack",
  "language": "TypeScript",
  "testCommand": "npm test",
  "reportFile": ".dsa-report.json"
}
```

## Database: Supabase (Postgres)

Tables:
- `projects` - User projects with GitHub URLs, progress, status
- `submissions` - Test submission history

Realtime enabled for live dashboard updates.

## GitHub Integration

**GitHub App:** `DSA Lab`
- **Organization:** `dsa-teacher`
- **Templates:** 24 repos (4 modules × 6 languages)
- **Permissions:** Repo admin, contents, metadata

**Flow:**
1. User clicks "Start Challenge" on web
2. API creates repo from template via GitHub App
3. API commits `dsa.config.json` with project credentials
4. User clones repo and codes locally
5. User runs `dsa test` and `dsa submit`
6. Dashboard updates in real-time

## Authentication

**MVP:** Anonymous users
- UUID generated on first visit
- Stored in `localStorage`
- Sent as `x-user-id` header to API

**Submissions:** Project-scoped tokens
- Each project has unique token in database
- Token embedded in `dsa.config.json`
- CLI sends as `Authorization: Bearer <token>` header

## Deployment

### Database
Already deployed on Supabase.

### API (Edge Functions)
```bash
supabase functions deploy modules
supabase functions deploy projects
supabase functions deploy submissions
```

### Frontend
TBD (Vercel/Netlify)

### CLI
Published to npm as `@dsa/cli`

## Local Development

### Start API
```bash
cd supabase
supabase functions serve --env-file .env
```

### Test API
```bash
pnpm api:test
```

### Environment Variables
See `supabase/.env.example` for required variables.

