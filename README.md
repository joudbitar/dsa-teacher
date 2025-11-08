# DSA Lab

A platform where you pick a data structures challenge, get a private GitHub repo with tests, code it locally, and watch your progress update live on a dashboard.

## What Are We Building?

Think of it like LeetCode but instead of coding in a browser, you:

1. Pick a challenge (like "Build a Stack")
2. Get a private GitHub repo with starter code and tests
3. Clone it, code locally, run `dsa test` to check your work
4. Run `dsa submit` when ready
5. Watch your dashboard update in real-time

**Why this is cool:** Real coding environment, git practice, live feedback.

## Repo Structure

```
dsa-lab/
├── web/         → React dashboard (shows challenges, tracks progress)
├── cli/         → The `dsa` command (test & submit from terminal)
├── api/         → Backend endpoints (creates repos, records submissions)
├── infra/       → Config files (challenge data, API specs)
├── supabase/    → Database setup (stores projects & submissions)
├── docs/        → Detailed specs (read these to understand the flow)
└── .github/     → CI stuff
```

## How It Actually Works

### The User Flow

1. **User visits web app** → sees 4 challenges (Stack, Queue, Binary Search, Min-Heap)
2. **Clicks "Start Challenge"** → backend creates a private GitHub repo from a template
3. **User clones repo** → gets TypeScript starter code with TODOs and pre-written tests
4. **User codes solution** → runs `dsa test` to see if tests pass
5. **Tests pass?** → runs `dsa submit` to send results to our API
6. **Dashboard updates** → progress bar fills up, checkmarks appear

### The Data Flow

```
CLI (your laptop)
  └─ runs tests
  └─ reads .dsa-report.json
  └─ POSTs to /api/submissions (with project token)
      └─ API saves to database
          └─ Database triggers Realtime event
              └─ Dashboard updates automatically
```

## Current State (Pre-Kickoff)

**Right now:** This repo is all docs and placeholders. No real code yet.

- `.md` files = descriptions of what we'll build
- `.ts` files = comments explaining what goes there
- `infra/` = actual config files we'll use

**After kickoff (Friday 8 PM):** We start writing real code.

## Getting Started (For Devs)

### First Time Setup

```bash
# Install everything
pnpm install

# Copy env template (you'll need to fill in secrets later)
cp .env.example .env.local
```

### Running Locally (Post-Kickoff)

```bash
# Web dashboard
cd web && pnpm dev

# CLI (for testing)
cd cli && pnpm build && pnpm link --global
dsa test  # in a challenge repo
```

## Understanding the Architecture

**If you're new to this codebase, start here:**

1. Read `docs/github-app-flow.md` → understand how repos get created
2. Read `docs/tests-and-mapping.md` → understand how tests work
3. Read `docs/web-auth.md` → understand how users are tracked (spoiler: it's simple)
4. Look at `infra/modules.json` → see the actual challenge data
5. Check `infra/openapi/openapi.yaml` → see what APIs we're building

**TL;DR of each part:**

- **Web:** React app, shows challenges, tracks your progress
- **CLI:** Node.js tool, runs tests, sends results to API
- **API:** Serverless functions on Vercel, handles repo creation & submissions
- **Database:** Supabase (Postgres), stores projects & submissions
- **Auth:** Super simple for MVP (just a UUID in localStorage)

## Team Roles (Rough Division)

Pick what interests you:

- **Backend/API** → Implement `/api/*.ts` handlers, set up GitHub App, Supabase setup
- **Frontend** → Build React components in `web/`, make it look good
- **CLI** → Make `dsa test` and `dsa submit` work in `cli/src/`
- **DevOps** → Deploy to Vercel, set up environment variables, CI/CD

Everyone should understand the whole flow though!

## Key Decisions We Made (So You Don't Have To)

To keep this hackathon manageable, we made some opinionated choices. Here's what and why:

### 1. **GitHub App Integration**

- Using GitHub App with Repository Administration (R/W), Contents (R/W), and Metadata (R) permissions
- Four private template repos (TypeScript only): `template-dsa-stack-ts`, `template-dsa-queue-ts`, `template-dsa-binary-search-ts`, `template-dsa-min-heap-ts`
- Automatic repo creation from templates with `dsa.config.json` committed via GitHub API
- See `docs/github-app-flow.md` for full flow

### 2. **TypeScript-Only Templates (MVP)**

- All challenges support TypeScript only for initial launch
- Python and Go support deferred to post-hackathon
- Keeps template maintenance simple during time-constrained dev
- See `docs/template-repos.md` for structure

### 3. **Project-Scoped Token Authentication**

- No `dsa login` command needed
- Each project gets a unique random token (32-48 chars) stored in `projects.projectToken`
- Token auto-embedded in `dsa.config.json` when repo is created
- CLI sends `Authorization: Bearer <projectToken>` when submitting
- See `docs/cli-auth.md` for details

### 4. **Filename-to-Subchallenge Mapping**

- Test files named `NN-<slug>.test.ts` (e.g., `01-create-class.test.ts`, `02-push.test.ts`)
- Test runner (`tests/run.js`) writes standardized `.dsa-report.json`
- CLI reads report and submits to API (no language-specific parsing logic)
- See `docs/tests-and-mapping.md` for conventions

### 5. **Structured JSON Test Reports**

- All test runners must output `.dsa-report.json` with schema:
  ```json
  {
    "moduleId": "stack",
    "summary": "3/5 passed",
    "pass": false,
    "cases": [
      { "subchallengeId": "push", "passed": true },
      { "subchallengeId": "pop", "passed": false, "message": "..." }
    ]
  }
  ```
- Language-agnostic format enables multi-language support later
- See `docs/tests-and-mapping.md` for schema

### 6. **Simple Progress Formula**

- `progress = (passed_count / total_count) * 100` (rounded)
- Status: `not_started` (0%) → `in_progress` (1-99%) → `passed` (100%)
- Progress cached in `projects` table; full details stored in `submissions.details` JSONB
- See `docs/progress.md` for calculation logic

### 7. **Anonymous Web Users (No Auth MVP)**

- Frontend generates UUID in `localStorage` on first visit
- All API requests include `x-user-id` header
- Zero-friction onboarding (no sign-up forms or email verification)
- Real auth (Clerk/Supabase Auth) deferred to post-hackathon
- See `docs/web-auth.md` for implementation

### 8. **Scope: IN vs OUT**

**✅ IN (MVP):**

- 4 challenges (Stack, Queue, Binary Search, Min-Heap)
- TypeScript support only
- Basic CLI (`dsa test`, `dsa submit`)
- Web dashboard with real-time progress
- Anonymous user sessions
- GitHub repo creation via GitHub App

**❌ OUT (Post-MVP):**

- Multi-language support (Python, Go)
- User authentication (email/password, OAuth)
- Submission history drawer with expandable details
- Leaderboards
- `dsa login` command
- Rate limiting
- User profiles/settings
- Token expiration/refresh

---

## Documentation

Detailed specifications available in `docs/`:

- `github-app-flow.md` - Repo creation and config injection
- `cli-auth.md` - Project token authentication
- `tests-and-mapping.md` - Test structure and report format
- `progress.md` - Progress calculation and status transitions
- `web-auth.md` - Anonymous user implementation
- `template-repos.md` - Template repository structure
- `db-schema.sql` - Database schema with comments
