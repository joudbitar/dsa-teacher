# Ideal CLI Release Setup

## Overview

The ideal setup ensures that **every CLI release is reliable, consistent, and automatically creates GitHub releases** so update detection always works perfectly.

## Architecture

```
┌─────────────────┐
│  Developer      │
│  runs script    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ release-cli.sh  │
│ - Updates ver   │
│ - Builds CLI    │
│ - Commits       │
│ - Creates tag   │
│ - Pushes tag    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Git Push Tag   │
│  (v0.1.1)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Actions  │
│ Auto-triggers   │
│ on tag push     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Auto-creates    │
│ GitHub Release  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ CLI Update      │
│ Check Works!    │
│ (via Releases   │
│  API)           │
└─────────────────┘
```

## Components

### 1. GitHub Actions Workflow (`.github/workflows/release.yml`)

**Purpose**: Automatically creates a GitHub release when a tag is pushed.

**Triggers**: When a tag matching `v*` pattern is pushed (e.g., `v0.1.1`)

**What it does**:
- Extracts version from tag
- Generates release notes from commit message
- Creates GitHub release automatically
- No manual intervention needed

**Status**: ✅ Created and ready

### 2. Release Script (`scripts/release-cli.sh`)

**Purpose**: Automates the entire release process.

**What it does**:
- Updates version in `package.json` and `checkUpdate.ts`
- Builds the CLI
- Commits changes
- Creates git tag
- Pushes to GitHub

**Status**: ✅ Already exists

### 3. Update Check Logic (`cli/src/lib/checkUpdate.ts`)

**Purpose**: Checks for available updates.

**Priority order**:
1. **GitHub Releases API** (primary, most reliable)
2. **package.json from main branch** (fallback)

**Status**: ✅ Already implemented correctly

## Setup Steps

### Step 1: Push the GitHub Actions Workflow

The workflow file is already created at `.github/workflows/release.yml`. Just commit and push it:

```bash
git add .github/workflows/release.yml
git commit -m "ci: Add automatic release creation workflow"
git push origin main
```

### Step 2: Verify Workflow Permissions

The workflow needs `contents: write` permission to create releases. This is already configured in the workflow file. GitHub automatically provides `GITHUB_TOKEN` with the necessary permissions.

### Step 3: Test the Workflow

To test that everything works:

```bash
# Use the release script (it will create a tag)
./scripts/release-cli.sh 0.1.2 "Test automatic release creation"

# Watch GitHub Actions tab - you should see the workflow run
# Check Releases page - a new release should appear automatically
```

## How It Works

### Release Process (After Setup)

1. **Developer runs release script**:
   ```bash
   ./scripts/release-cli.sh 0.1.2 "Added new feature"
   ```

2. **Script does**:
   - Updates version numbers
   - Builds CLI
   - Commits changes
   - Creates tag `v0.1.2`
   - Pushes tag to GitHub

3. **GitHub Actions automatically**:
   - Detects tag push
   - Extracts version from tag
   - Generates release notes from commit message
   - Creates GitHub release

4. **CLI update check**:
   - Users running `dsa update` or `dsa test`
   - Checks GitHub Releases API
   - Finds new release `v0.1.2`
   - Prompts user to update

### Benefits

✅ **Reliable**: Always uses GitHub Releases API (no CDN caching issues)  
✅ **Automatic**: No manual release creation needed  
✅ **Consistent**: Every release follows the same process  
✅ **Fast**: Release appears immediately after tag push  
✅ **Traceable**: Release notes come from commit messages  

## Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Release script | ✅ Ready | `scripts/release-cli.sh` |
| GitHub Actions workflow | ✅ Created | `.github/workflows/release.yml` |
| Update check logic | ✅ Working | Uses Releases API first |
| Workflow permissions | ✅ Configured | `contents: write` |

## Next Steps

1. **Commit and push the workflow**:
   ```bash
   git add .github/workflows/release.yml
   git commit -m "ci: Add automatic release creation workflow"
   git push origin main
   ```

2. **Test with a new release**:
   ```bash
   ./scripts/release-cli.sh 0.1.2 "Test automatic release"
   ```

3. **Verify**:
   - Check GitHub Actions tab - workflow should run
   - Check Releases page - release should appear
   - Test `dsa update` - should detect new version

## Troubleshooting

### Workflow doesn't trigger

- Ensure tag format is `v*` (e.g., `v0.1.2`)
- Check workflow file is in `.github/workflows/`
- Verify workflow is pushed to `main` branch

### Release not created

- Check GitHub Actions logs for errors
- Verify `GITHUB_TOKEN` has `contents: write` permission
- Ensure tag exists before workflow runs

### Update check still shows old version

- Wait a few seconds for GitHub API to update
- Clear update cache: `rm ~/.dsa-cli-update-check`
- Verify release exists: `curl https://api.github.com/repos/joudbitar/dsa-teacher/releases/latest`

## Future Enhancements

- [ ] Add changelog generation from commits
- [ ] Add release notes template
- [ ] Add pre-release validation (tests, build)
- [ ] Add release notifications (Discord, Slack, etc.)
- [ ] Add version bump validation (semantic versioning)

