# CLI Release Guide

This guide explains how to release a new version of the CLI that will automatically prompt users to update.

## How Update Detection Works

The CLI checks for updates in two ways:

1. **Primary**: Checks GitHub Releases API for the latest release tag
2. **Fallback**: If no releases exist, checks `package.json` from the `main` branch

Users are automatically notified when:

- They run `dsa test` or `dsa submit` (checks once per 24 hours)
- They run `dsa update` (always checks)
- They run `dsa hint` (checks once per 24 hours)

## Release Process

### Step 1: Update Version Numbers

You need to update the version in **two places**:

1. **`cli/package.json`** - Update the `version` field
2. **`cli/src/lib/checkUpdate.ts`** - Update the `CURRENT_VERSION` constant

Example for version `0.1.1`:

```json
// cli/package.json
{
  "version": "0.1.1"
}
```

```typescript
// cli/src/lib/checkUpdate.ts
const CURRENT_VERSION = "0.1.1";
```

### Step 2: Build and Test

```bash
cd cli
npm run build
npm test  # if tests exist
```

### Step 3: Commit Changes

```bash
git add cli/package.json cli/src/lib/checkUpdate.ts cli/dist/
git commit -m "chore(cli): Bump version to 0.1.1"
```

### Step 4: Create Git Tag

Create a tag matching your version (with or without `v` prefix):

```bash
# Option 1: With 'v' prefix (recommended)
git tag -a v0.1.1 -m "CLI v0.1.1: [Brief description of changes]"

# Option 2: Without 'v' prefix (also works)
git tag -a 0.1.1 -m "CLI v0.1.1: [Brief description of changes]"
```

### Step 5: Push Changes and Tags

```bash
git push origin main
git push origin v0.1.1  # or git push origin --tags to push all tags
```

### Step 6: Create GitHub Release (Recommended)

1. Go to: `https://github.com/joudbitar/dsa-teacher/releases/new`
2. Select the tag you just created (e.g., `v0.1.1`)
3. Add a release title: `CLI v0.1.1`
4. Add release notes describing what changed
5. Click "Publish release"

**Why GitHub Releases?**

- More reliable than checking `package.json` from main branch
- Allows you to add release notes
- Better for version management

### Step 7: Verify Update Detection

After releasing, verify the update check works:

```bash
# Test locally (will check GitHub API)
cd cli
node -e "
import('./dist/lib/checkUpdate.js').then(m => {
  m.checkForUpdate().then(info => {
    console.log('Current:', info.currentVersion);
    console.log('Latest:', info.latestVersion);
    console.log('Update available:', info.updateAvailable);
  });
});
"
```

Or test the full flow:

```bash
# Delete the update check cache to force a check
rm ~/.dsa-cli-update-check

# Run a command that triggers update check
dsa test  # in a project directory
# Should show update notification if version is newer
```

## Automated Release Script

Use the provided `scripts/release-cli.sh` script to automate the process:

```bash
./scripts/release-cli.sh 0.1.1 "Added new ASCII art banner"
```

This script will:

1. Update version in both files
2. Build the CLI
3. Commit changes
4. Create and push tag
5. Provide instructions for creating GitHub release

## Version Numbering

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backward compatible
- **PATCH** (0.0.1): Bug fixes, backward compatible

Examples:

- `0.1.0` → `0.1.1` (patch: bug fix)
- `0.1.0` → `0.2.0` (minor: new feature)
- `0.1.0` → `1.0.0` (major: breaking change)

## Testing Update Detection Locally

To test update detection without creating a real release:

### Method 1: Mock GitHub API Response

Temporarily modify `checkUpdate.ts` to return a fake version:

```typescript
export async function getLatestVersion(): Promise<string | null> {
  // For testing: return fake version
  return "0.2.0"; // Higher than current 0.1.0
}
```

### Method 2: Create a Test Release

1. Create a test tag: `git tag v0.1.1-test`
2. Push it: `git push origin v0.1.1-test`
3. Create a GitHub release from that tag
4. Test update detection
5. Delete the test release and tag when done

### Method 3: Use Fallback Method

If you don't create a GitHub release, the CLI will fall back to checking `package.json` from the main branch. Just make sure:

- Version in `cli/package.json` is updated
- Changes are pushed to `main` branch
- The CLI can fetch the file from GitHub

## Troubleshooting

### Users Not Getting Update Notifications

1. **Check version comparison**: Ensure new version is higher than current
2. **Verify GitHub release exists**: Check `https://api.github.com/repos/joudbitar/dsa-teacher/releases/latest`
3. **Check tag format**: Should be `v0.1.1` or `0.1.1` (both work)
4. **Verify 24h throttle**: Users won't see notification if they checked within 24 hours
   - They can delete `~/.dsa-cli-update-check` to force a check
   - Or run `dsa update` which always checks

### Update Check Fails Silently

This is intentional! Update checks are non-blocking and fail silently to not interrupt user workflow. Check:

- Network connectivity
- GitHub API availability
- Firewall/proxy settings

### Version Not Detected

If GitHub release doesn't work, the CLI falls back to checking `package.json`:

- Ensure `cli/package.json` has correct version
- Ensure changes are on `main` branch
- Verify file is accessible: `https://raw.githubusercontent.com/joudbitar/dsa-teacher/main/cli/package.json`

## Best Practices

1. **Always create GitHub releases** for better reliability
2. **Write clear release notes** so users know what changed
3. **Test update detection** before announcing the release
4. **Use semantic versioning** consistently
5. **Update both version locations** (package.json and checkUpdate.ts)
6. **Tag releases** for easy reference
7. **Keep a CHANGELOG** to track changes

## Quick Reference

```bash
# Full release process
cd cli
# 1. Update versions
vim package.json  # Update version
vim src/lib/checkUpdate.ts  # Update CURRENT_VERSION

# 2. Build
npm run build

# 3. Commit
git add package.json src/lib/checkUpdate.ts dist/
git commit -m "chore(cli): Bump version to X.Y.Z"

# 4. Tag and push
git tag -a vX.Y.Z -m "CLI vX.Y.Z: Description"
git push origin main
git push origin vX.Y.Z

# 5. Create GitHub release (manual step)
# Go to: https://github.com/joudbitar/dsa-teacher/releases/new
```
