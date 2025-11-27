# Setup Instructions: Sustainable CLI Release System

## What We've Built

A **fully automated release system** that ensures every CLI release:
- ✅ Automatically creates GitHub releases
- ✅ Works reliably (no CDN caching issues)
- ✅ Requires zero manual intervention
- ✅ Provides consistent release notes

## What You Need to Do

### Step 1: Commit and Push the Workflow

The GitHub Actions workflow is ready. Just push it:

```bash
git add .github/workflows/release.yml docs/IDEAL_RELEASE_SETUP.md docs/SETUP_INSTRUCTIONS.md
git commit -m "ci: Add automatic release creation workflow"
git push origin main
```

### Step 2: Test the System

Once the workflow is pushed, test it by creating a test release:

```bash
# This will create tag v0.1.2 and trigger the workflow
./scripts/release-cli.sh 0.1.2 "Test automatic release creation"
```

**What should happen**:
1. Script updates versions, builds, commits, creates tag, pushes tag
2. GitHub Actions automatically detects tag push
3. Workflow runs and creates GitHub release
4. Check Actions tab - you should see "Auto Create Release" workflow run
5. Check Releases page - new release should appear

### Step 3: Verify Update Detection

After the release is created, test update detection:

```bash
# Clear cache to force check
rm ~/.dsa-cli-update-check

# Run update command (should detect 0.1.2)
dsa update
```

## How It Works (After Setup)

### Normal Release Flow

```bash
# 1. Make your changes
vim cli/src/commands/test.ts

# 2. Run release script
./scripts/release-cli.sh 0.1.3 "Added new feature"

# That's it! The script handles:
# - Version updates
# - Building
# - Committing
# - Tagging
# - Pushing
# 
# GitHub Actions automatically:
# - Creates release
# - Generates release notes
#
# Users automatically:
# - Get update notifications
# - Can run dsa update
```

## Architecture

```
Developer → release-cli.sh → Git Tag → GitHub Actions → GitHub Release → CLI Update Check
```

**Key Points**:
- **GitHub Releases API** is primary (most reliable, no caching)
- **package.json fallback** is backup (for edge cases)
- **Automatic workflow** eliminates manual steps
- **Consistent process** every time

## Benefits

| Before | After |
|--------|-------|
| Manual release creation | Automatic |
| CDN caching delays | Instant via Releases API |
| Inconsistent process | Standardized workflow |
| Easy to forget steps | One command does everything |

## Troubleshooting

### Workflow doesn't run

- Check tag format: must be `v*` (e.g., `v0.1.2`)
- Verify workflow file exists: `.github/workflows/release.yml`
- Check Actions tab for errors

### Release not created

- Check workflow logs in Actions tab
- Verify `GITHUB_TOKEN` permissions (should be automatic)
- Ensure tag was pushed successfully

### Update check still shows old version

- Wait 10-30 seconds for GitHub API to update
- Clear cache: `rm ~/.dsa-cli-update-check`
- Verify release exists: Check Releases page

## Current Status

✅ **Release script**: Ready (`scripts/release-cli.sh`)  
✅ **GitHub Actions workflow**: Created (`.github/workflows/release.yml`)  
✅ **Update check logic**: Working (uses Releases API)  
⏳ **Workflow pushed**: Needs to be committed and pushed  

## Next Action

**Just run this**:

```bash
git add .github/workflows/release.yml docs/
git commit -m "ci: Add automatic release creation workflow"
git push origin main
```

Then test with:

```bash
./scripts/release-cli.sh 0.1.2 "Test automatic release"
```

That's it! The system will be fully automated and sustainable.

