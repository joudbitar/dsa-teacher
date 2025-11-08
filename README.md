# DSA Lab

> A platform where you pick a data structures challenge, get a private GitHub repo with tests, code it locally, and watch your progress update live on a dashboard.

## Quick Start

```bash
# Test the API
curl https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1/modules | jq

# See QUICK_START.md for complete setup
```

## How It Works

1. **Pick a challenge** (Stack, Queue, Binary Search, Min-Heap)
2. **Get a private GitHub repo** with starter code and tests
3. **Code locally** in your preferred editor
4. **Test** with `dsa test`
5. **Submit** with `dsa submit`
6. **Watch your progress** update live on the dashboard

## Repo Structure

```
dsa-lab/
├── web/                → React dashboard (shows challenges, tracks progress)
├── cli/                → The `dsa` command (test & submit from terminal)
├── supabase/
│   ├── functions/      → Edge Functions (API endpoints)
│   ├── init.sql        → Database schema
│   └── config.toml     → Supabase config
├── infra/              → Config files (challenge data, API specs)
├── docs/               → Detailed specs (read these to understand the flow)
└── .github/            → CI stuff
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

## Current Status

✅ **Production Ready**
- API deployed and working
- CLI built and tested
- GitHub integration working
- Database schema applied
- Template repos ready

## Getting Started

```bash
# CLI
cd cli && npm install && npm run build

# Web
cd web && pnpm install && pnpm dev

# Test the system
See QUICK_START.md
```

## Architecture

- **Web**: React + Vite (dashboard)
- **CLI**: Node.js + TypeScript (local testing & submission)
- **API**: Supabase Edge Functions (Deno runtime)
- **Database**: Supabase Postgres
- **Auth**: Anonymous UUIDs (MVP) + project tokens (CLI)
- **GitHub**: Private repos via GitHub App

See `docs/ARCHITECTURE.md` for details.


## Key Features

- **4 Challenges**: Stack, Queue, Binary Search, Min-Heap
- **TypeScript Only**: Other languages post-MVP
- **GitHub Integration**: Auto-creates private repos
- **CLI Testing**: Local test runner with instant feedback
- **Live Dashboard**: Real-time progress updates
- **Anonymous Auth**: No sign-up required (MVP)
- **Project Tokens**: Auto-configured, secure per-project auth

---

## Documentation

- **`QUICK_START.md`** - Get started in 2 minutes
- **`docs/ARCHITECTURE.md`** - Complete architecture reference
- **`cli/README.md`** - CLI documentation
- **`supabase/functions/README.md`** - API reference
