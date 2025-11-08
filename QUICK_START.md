# Quick Start

## Status: ✅ Ready to Use

All infrastructure is deployed and working.

## Test the System

```bash
# Test API
curl https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1/modules | jq

# Create a test project
curl -X POST https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1/projects \
  -H "x-user-id: test-$(date +%s)" \
  -H "Content-Type: application/json" \
  -d '{"moduleId":"stack","language":"TypeScript"}' | jq

# Clone the repo URL from response
git clone <githubRepoUrl>
cd <repo-name>

# Install dependencies
npm install

# Test locally
dsa test

# Submit results
dsa submit
```

## Build CLI

```bash
cd cli
npm install
npm run build
pnpm link --global  # Optional: makes 'dsa' command available globally
```

## Run Web Dashboard

```bash
cd web
pnpm install
pnpm dev
```

## Architecture Overview

- **API**: Supabase Edge Functions → `https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1`
- **Database**: Supabase Postgres
- **CLI**: Node.js TypeScript
- **Web**: React + Vite
- **GitHub**: Private repos created via GitHub App

## Key Files

- `README.md` - Full project overview
- `docs/ARCHITECTURE.md` - Technical architecture details
- `cli/README.md` - CLI documentation
- `supabase/functions/README.md` - API reference

## Need Help?

Check the main README or architecture docs for detailed information.

