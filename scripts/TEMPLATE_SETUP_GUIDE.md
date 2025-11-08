# DSA Lab Template Repository Setup Guide

This guide walks you through setting up all 4 template repositories for your DSA Lab project.

## What You Have

✅ **4 complete template repositories** created locally at `../dsa-templates/`:

- `template-dsa-stack-ts` (5 sub-challenges)
- `template-dsa-queue-ts` (5 sub-challenges)
- `template-dsa-binary-search-ts` (4 sub-challenges)
- `template-dsa-min-heap-ts` (6 sub-challenges)

## What You Need

Before pushing to GitHub, you need:

1. **A GitHub Organization**

   - Create at: https://github.com/organizations/new
   - Free plan works fine (allows private repos)
   - Note your org name (e.g., `dsa-lab-hackathon`)

2. **GitHub CLI (Optional but Recommended)**
   ```bash
   brew install gh
   gh auth login
   ```

## Option A: Automated Setup (Fastest - Recommended)

If you have GitHub CLI installed:

```bash
cd scripts
./push-templates-auto.sh YOUR_ORG_NAME
```

This will:

- ✅ Initialize git repos
- ✅ Create private repositories on GitHub
- ✅ Push all code
- ⚠️ You still need to manually mark as templates (see below)

## Option B: Manual Setup (No GitHub CLI needed)

```bash
cd scripts
./push-templates.sh YOUR_ORG_NAME
```

This interactive script will:

- Guide you through creating each repo on GitHub
- Wait for you to confirm at each step
- Push code when ready

## Final Step: Mark as Template Repositories

**This must be done manually for each repo:**

1. Go to: `https://github.com/YOUR_ORG/template-dsa-stack-ts/settings`
2. Scroll to **Template repository**
3. ✅ Check **Template repository**
4. Repeat for the other 3 repos

Quick links (replace `YOUR_ORG`):

- https://github.com/YOUR_ORG/template-dsa-stack-ts/settings
- https://github.com/YOUR_ORG/template-dsa-queue-ts/settings
- https://github.com/YOUR_ORG/template-dsa-binary-search-ts/settings
- https://github.com/YOUR_ORG/template-dsa-min-heap-ts/settings

## Verification Checklist

For **each** of the 4 templates, verify:

- [ ] Repository exists on GitHub
- [ ] Repository is **private**
- [ ] Repository is marked as **Template repository**
- [ ] All files are present (check via GitHub web interface)
- [ ] `dsa.config.json` has `"projectId": "TBD"` and `"projectToken": "TBD"`

## Test a Template (Optional but Recommended)

Pick one template and test it:

```bash
cd ../dsa-templates/template-dsa-stack-ts
npm install
npm test
```

Expected output:

```
✗ create-class
✗ push
✗ pop
✗ peek
✗ size

Summary: 0/5 tests passed
```

Check that `.dsa-report.json` was created:

```bash
cat .dsa-report.json
```

Should see:

```json
{
  "moduleId": "stack",
  "summary": "0/5 tests passed",
  "pass": false,
  "cases": [...]
}
```

✅ If tests fail (expected!) and report is generated, the template is working!

## Next Steps: GitHub App Setup

Now that templates exist, set up your GitHub App:

1. **Create GitHub App**

   - Go to: `https://github.com/organizations/YOUR_ORG/settings/apps/new`
   - Name: `DSA Lab`
   - Homepage URL: `http://localhost:3000` (or your app URL)
   - Webhook: Uncheck "Active"
   - **Permissions:**
     - Repository Administration: **Read & Write**
     - Repository Contents: **Read & Write**
     - Repository Metadata: **Read** (automatic)
   - Where can it be installed: **Only on this account**
   - Click **Create GitHub App**

2. **Generate Private Key**

   - On app page, scroll to "Private keys"
   - Click "Generate a private key"
   - Save the `.pem` file securely

3. **Install App**

   - Click "Install App" → Select your organization
   - Choose **All repositories** or select the 4 template repos
   - Click **Install**
   - Note the **Installation ID** from URL: `https://github.com/organizations/YOUR_ORG/settings/installations/INSTALLATION_ID`

4. **Save Environment Variables**

Create `.env.local` (or update your existing one):

```bash
# GitHub App Info (from app settings page)
GITHUB_APP_ID=123456

# From the .pem file you downloaded
# Option 1: One line with \n for newlines
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIE...\n-----END RSA PRIVATE KEY-----\n"

# Option 2: Path to file
GITHUB_APP_PRIVATE_KEY_PATH="/path/to/your-app.private-key.pem"

# From installation URL
GITHUB_APP_INSTALLATION_ID=12345678

# Your organization name
GITHUB_ORG=your-org-name
```

## Troubleshooting

### "Repository already exists"

- Delete the existing repo on GitHub and try again, OR
- Skip to pushing manually with `git push`

### "Permission denied (publickey)"

- Make sure you have SSH keys set up with GitHub
- Or use HTTPS: `git remote set-url origin https://github.com/YOUR_ORG/REPO.git`

### "gh: command not found"

- GitHub CLI not installed
- Use manual script instead: `./push-templates.sh YOUR_ORG_NAME`

### Templates not showing as templates

- Make sure you checked "Template repository" in Settings
- This must be done via web interface, CLI doesn't support it

## Summary

Once completed, you'll have:

✅ 4 private template repositories on GitHub  
✅ All marked as "Template repository"  
✅ GitHub App created and installed  
✅ Environment variables configured

**You're now ready to implement `POST /api/projects` endpoint!**

The API will use these templates to create user repos automatically.

---

## Quick Reference: File Structure

Each template contains:

```
template-dsa-{module}-ts/
├── README.md                 # User instructions
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── dsa.config.json           # DSA Lab config (with TBD values)
├── .gitignore                # Ignore node_modules, etc.
├── src/
│   └── {module}.ts           # Skeleton implementation
└── tests/
    ├── 01-*.test.ts          # Test files (numbered)
    ├── 02-*.test.ts
    ├── ...
    └── run.js                # Test orchestrator
```

## Need Help?

- Review `docs/template-repos.md` for detailed specs
- Review `docs/github-app-flow.md` for API implementation
- Check GitHub App permissions if repo creation fails
