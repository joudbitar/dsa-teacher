# 🚀 Manual Deployment Instructions

Since automated deployment requires browser authentication, here's how to deploy manually:

## Quick Deploy (Recommended)

Run the automated script:

```bash
cd /Users/joudbitar/Code/Projects/hackathon
./supabase/DEPLOY_NOW.sh
```

This will:
1. Login to Supabase (opens browser)
2. Link to your project
3. Deploy all 3 functions
4. Set environment secrets
5. Test the endpoints

---

## Manual Step-by-Step

If the script doesn't work, follow these steps:

### 1. Login to Supabase

```bash
cd /Users/joudbitar/Code/Projects/hackathon
supabase login
```

This will open your browser for authentication.

### 2. Link to Project

```bash
supabase link --project-ref mwlhxwbkuumjxpnvldli
```

### 3. Deploy Functions

```bash
cd supabase

# Deploy each function
supabase functions deploy modules --no-verify-jwt
supabase functions deploy projects --no-verify-jwt
supabase functions deploy submissions --no-verify-jwt
```

### 4. Set Environment Secrets

You can set secrets via:

**Option A: Supabase Dashboard (Easiest)**

1. Go to https://app.supabase.com/project/mwlhxwbkuumjxpnvldli/settings/functions
2. Click "Manage secrets"
3. Add these secrets:
   - `SUPABASE_URL` = `https://mwlhxwbkuumjxpnvldli.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = (from your dashboard)
   - `GITHUB_ORG` = `dsa-teacher`
   - `GITHUB_APP_ID` = `2254712`
   - `GITHUB_APP_INSTALLATION_ID` = `93636419`
   - `GITHUB_APP_PRIVATE_KEY` = (paste contents of .github/app/private-key.pem)

**Option B: Supabase CLI**

```bash
# Get values from .env.local
source .env.local

supabase secrets set SUPABASE_URL="$SUPABASE_URL" --project-ref mwlhxwbkuumjxpnvldli
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" --project-ref mwlhxwbkuumjxpnvldli
supabase secrets set GITHUB_ORG="$GITHUB_ORG" --project-ref mwlhxwbkuumjxpnvldli
supabase secrets set GITHUB_APP_ID="$GITHUB_APP_ID" --project-ref mwlhxwbkuumjxpnvldli
supabase secrets set GITHUB_APP_INSTALLATION_ID="$GITHUB_APP_INSTALLATION_ID" --project-ref mwlhxwbkuumjxpnvldli
supabase secrets set GITHUB_APP_PRIVATE_KEY="$(cat .github/app/private-key.pem)" --project-ref mwlhxwbkuumjxpnvldli
```

### 5. Test Deployed Functions

```bash
BASE_URL="https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1"

# Test modules
curl "$BASE_URL/modules" | jq .

# Test projects GET
curl -H "x-user-id: test-123" "$BASE_URL/projects" | jq .

# Test projects POST (creates real GitHub repo!)
curl -X POST "$BASE_URL/projects" \
  -H "x-user-id: test-$(date +%s)" \
  -H "Content-Type: application/json" \
  -d '{"moduleId":"stack","language":"TypeScript"}' | jq .
```

---

## Verify Deployment

### Check Function Status

```bash
supabase functions list --project-ref mwlhxwbkuumjxpnvldli
```

Should show:
- ✅ modules
- ✅ projects  
- ✅ submissions

### Check Secrets

```bash
supabase secrets list --project-ref mwlhxwbkuumjxpnvldli
```

Should show all 6 environment variables.

### Test Each Endpoint

1. **Modules (simplest test)**
   ```bash
   curl https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1/modules
   ```
   Expected: JSON array with 4 modules

2. **Projects GET**
   ```bash
   curl -H "x-user-id: test-123" \
     https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1/projects
   ```
   Expected: Empty array `[]` for new user

3. **Projects POST**
   ```bash
   curl -X POST https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1/projects \
     -H "x-user-id: test-123" \
     -H "Content-Type: application/json" \
     -d '{"moduleId":"stack","language":"TypeScript"}'
   ```
   Expected: JSON with `id`, `githubRepoUrl`, `status`, `progress`

---

## Troubleshooting

### "Access token not provided"
- Run `supabase login` first
- Or set `SUPABASE_ACCESS_TOKEN` environment variable

### "Function not found"
- Make sure you're in the right directory
- Check function names: `modules`, `projects`, `submissions` (no file extensions)

### "Failed to create GitHub repository"
- Verify GitHub App permissions
- Check that template repos exist in `dsa-teacher` org
- Verify private key is correctly set

### CORS errors from browser
- All functions have CORS enabled
- Check browser console for actual error
- Verify the correct base URL is being used

---

## Quick Reference

**Base URL:** `https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1`

**Endpoints:**
- `GET /modules` - No auth required
- `GET /projects` - Requires `x-user-id` header
- `POST /projects` - Requires `x-user-id` header + JSON body
- `POST /submissions` - Requires `Authorization: Bearer <token>` header

**Full Documentation:**
- API Reference: `supabase/functions/README.md`
- Test Report: `supabase/functions/TEST_REPORT.md`
- Deployment Guide: `supabase/functions/DEPLOYMENT_READY.md`

---

## After Deployment

Update your web app and CLI to use the production URLs:

**Web App (`src/lib/api.ts`):**
```typescript
const API_BASE = 'https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1';
```

**CLI (`cli/src/lib/http.ts`):**
```typescript
const API_BASE = 'https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1';
```

🎉 You're all set!

