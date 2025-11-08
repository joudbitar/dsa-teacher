# 🚀 Quick Start: Push Templates to GitHub

You've successfully generated all 4 template repositories locally!

## ✅ What's Done

All templates created at: `/Users/joudbitar/Code/Projects/dsa-templates/`

- ✅ `template-dsa-stack-ts` (Stack data structure - 5 sub-challenges)
- ✅ `template-dsa-queue-ts` (Queue data structure - 5 sub-challenges)
- ✅ `template-dsa-binary-search-ts` (Binary search algorithm - 4 sub-challenges)
- ✅ `template-dsa-min-heap-ts` (Min-heap data structure - 6 sub-challenges)

Each contains:
- Complete test suite with test orchestrator
- Skeleton implementation with TODOs
- README with user instructions
- TypeScript configuration
- `dsa.config.json` with TBD placeholders

## 🎯 Next Steps (5 minutes)

### Step 1: Create GitHub Organization (if you haven't)

Go to: https://github.com/organizations/new

Choose:
- **Organization name**: `dsa-lab-hackathon` (or whatever you prefer)
- **Plan**: Free (works great)
- **Belongs to**: My personal account

**Write down your org name!** You'll need it next.

### Step 2: Push Templates to GitHub

**Option A - Automated (If you have GitHub CLI):**

```bash
cd scripts
./push-templates-auto.sh YOUR_ORG_NAME
```

**Option B - Manual (No GitHub CLI needed):**

```bash
cd scripts
./push-templates.sh YOUR_ORG_NAME
```

This will guide you through the process step-by-step.

### Step 3: Mark as Template Repositories

For each repository, you need to check one box:

1. `https://github.com/YOUR_ORG/template-dsa-stack-ts/settings`
2. `https://github.com/YOUR_ORG/template-dsa-queue-ts/settings`
3. `https://github.com/YOUR_ORG/template-dsa-binary-search-ts/settings`
4. `https://github.com/YOUR_ORG/template-dsa-min-heap-ts/settings`

On each settings page:
- Scroll to **"Template repository"**
- ✅ Check the box
- Done!

### Step 4: Create GitHub App

1. Go to: `https://github.com/organizations/YOUR_ORG/settings/apps/new`

2. Fill in:
   - **Name**: `DSA Lab`
   - **Homepage URL**: `http://localhost:3000`
   - **Webhook**: ❌ Uncheck "Active"

3. **Repository permissions**:
   - Administration: **Read & Write** ✅
   - Contents: **Read & Write** ✅
   - Metadata: **Read** (automatic) ✅

4. **Where can this GitHub App be installed?**
   - Select: **Only on this account**

5. Click **Create GitHub App**

6. **Generate Private Key**:
   - Scroll to "Private keys"
   - Click "Generate a private key"
   - Save the `.pem` file

7. **Install the App**:
   - Click "Install App"
   - Select your organization
   - Choose "All repositories"
   - Note the Installation ID from the URL

### Step 5: Save Environment Variables

Add to your `.env.local` or wherever you store env vars:

```bash
# From GitHub App settings page
GITHUB_APP_ID=your_app_id

# Path to the .pem file OR the key content
GITHUB_APP_PRIVATE_KEY_PATH=/path/to/your-app.private-key.pem

# From installation URL
GITHUB_APP_INSTALLATION_ID=your_installation_id

# Your organization name
GITHUB_ORG=your-org-name
```

## ✅ Verification

Check that everything is ready:

```bash
# 1. Verify templates exist on GitHub (replace YOUR_ORG)
open https://github.com/YOUR_ORG/template-dsa-stack-ts

# 2. Check they're marked as templates
# Should see "Template" badge on repo page

# 3. Test one locally (optional)
cd /Users/joudbitar/Code/Projects/dsa-templates/template-dsa-stack-ts
npm install
npm test
# Should fail (expected!) and create .dsa-report.json
```

## 🎉 You're Done!

Your templates are ready! Now you can:

1. Implement `POST /api/projects` endpoint (see `api/projects.post.ts`)
2. Use Octokit to create repos from these templates
3. Update `dsa.config.json` with actual project credentials

See `TEMPLATE_SETUP_GUIDE.md` for more detailed info.

---

## Quick Reference

**Templates location**: `/Users/joudbitar/Code/Projects/dsa-templates/`

**Scripts**:
- `create-templates.sh` - Generate templates locally ✅ (already done)
- `push-templates-auto.sh` - Automated push to GitHub
- `push-templates.sh` - Manual/interactive push

**Docs to read next**:
- `docs/github-app-flow.md` - How API creates repos
- `docs/template-repos.md` - Template structure details
- `api/projects.post.ts` - API endpoint to implement

**Need help?** Check `TEMPLATE_SETUP_GUIDE.md` for troubleshooting.

