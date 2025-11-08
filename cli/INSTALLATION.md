# CLI Installation Guide

## Current Installation Process (Manual - Needs Automation)

⚠️ **TODO: Create automated installation script to simplify this process**

### Prerequisites

1. Node.js 18+ installed
2. pnpm installed (`npm install -g pnpm`)

### Manual Installation Steps

1. **Set up pnpm global bin directory:**
   ```bash
   pnpm setup
   source ~/.zshrc  # or restart terminal
   ```

2. **Link CLI globally:**
   ```bash
   cd cli
   pnpm link --global
   ```

3. **Verify installation:**
   ```bash
   dsa --version
   ```

### Problems with Current Approach

- ❌ Requires manual pnpm setup
- ❌ Requires manual linking
- ❌ User must navigate to CLI directory
- ❌ Not user-friendly for end users
- ❌ Different steps for different shells (zsh, bash, etc.)

## Better Installation Options (To Implement)

### Option 1: Publish to npm/pnpm registry (Recommended for Production)

```bash
# User would just run:
pnpm install -g @dsa/cli

# Or:
npm install -g @dsa/cli
```

**Pros:**
- ✅ Standard installation method
- ✅ Works across all platforms
- ✅ No manual setup needed
- ✅ Version management built-in

**Cons:**
- Requires publishing to npm registry
- Need to set up package publishing

### Option 2: Installation Script

Create `install.sh` / `install.ps1` that:
1. Checks prerequisites
2. Sets up pnpm if needed
3. Installs CLI globally
4. Verifies installation

**User would run:**
```bash
curl -fsSL https://raw.githubusercontent.com/your-repo/cli/install.sh | sh
```

**Pros:**
- ✅ One command installation
- ✅ Works for local development
- ✅ Can handle all setup steps

**Cons:**
- Need to maintain install scripts
- Different scripts for different platforms

### Option 3: Package Manager with Post-Install Script

Add to `package.json`:
```json
{
  "scripts": {
    "postinstall": "node scripts/setup.js"
  }
}
```

**Pros:**
- ✅ Automatic setup after install
- ✅ Works with npm/pnpm install

**Cons:**
- Still requires publishing or local install

## Recommended Solution

**For MVP/Hackathon:**
- Create a simple `install.sh` script that automates the setup
- Document it clearly in README

**For Production:**
- Publish to npm as `@dsa/cli`
- Users install with: `pnpm install -g @dsa/cli`

## TODO: Create Installation Script

Create `scripts/install.sh` that:

1. Checks if Node.js is installed
2. Checks if pnpm is installed (installs if not)
3. Runs `pnpm setup` if needed
4. Installs CLI globally: `pnpm install -g ./cli` or `pnpm link --global`
5. Verifies installation
6. Shows success message

**Script should:**
- Work on macOS, Linux, Windows (via WSL)
- Handle errors gracefully
- Provide clear error messages
- Support both `pnpm install -g` and `pnpm link --global` modes

## Current Workaround for Users

Until automation is in place, users need to:

```bash
# 1. Install pnpm if not installed
npm install -g pnpm

# 2. Set up pnpm
pnpm setup
source ~/.zshrc  # or restart terminal

# 3. Install CLI
cd /path/to/dsa-teacher/cli
pnpm link --global

# 4. Verify
dsa --version
```

## Notes

- The `pnpm link --global` approach is for **development**
- For **production**, should use `pnpm install -g @dsa/cli` after publishing
- Consider adding installation instructions to main README
- Consider adding a `Makefile` or `justfile` for common tasks

