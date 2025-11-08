# DSA CLI Installation Guide

Complete guide for installing the DSA Lab CLI tool.

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** - Comes with Node.js
- **Git** - For cloning the repository (if installing from source)

## Quick Install (Recommended) 🚀

The easiest way to install the CLI is using our automated installation script:

### macOS / Linux / WSL

```bash
# From the project root directory
./cli/scripts/install.sh
```

That's it! The script will:
- ✅ Check for Node.js and npm
- ✅ Install pnpm if needed
- ✅ Set up pnpm automatically
- ✅ Install all CLI dependencies
- ✅ Build TypeScript
- ✅ Link CLI globally
- ✅ Verify installation

### Windows (PowerShell)

```powershell
# From the project root directory
cd cli
.\scripts\install.ps1
```

## Installation from CLI Directory

If you're already in the `cli/` directory:

```bash
# Make sure you're in the cli directory
cd cli

# Run the install script
./scripts/install.sh

# Or use the pnpm script
pnpm run install:cli
```

## Verify Installation

After installation, verify it works:

```bash
dsa --version
```

You should see: `0.0.0` (or the current version)

Test the commands:

```bash
dsa --help
dsa test --help
dsa submit --help
```

## Manual Installation (Alternative)

If you prefer to install manually or the script doesn't work:

### Step 1: Install pnpm

```bash
npm install -g pnpm
```

### Step 2: Set up pnpm

```bash
pnpm setup
```

Then restart your terminal or run:
```bash
source ~/.zshrc  # For zsh
# or
source ~/.bashrc  # For bash
```

### Step 3: Install CLI Dependencies

```bash
cd cli
pnpm install
```

### Step 4: Build TypeScript

```bash
pnpm build
```

### Step 5: Link CLI Globally

```bash
pnpm link --global
```

### Step 6: Verify

```bash
dsa --version
```

## Troubleshooting

### "Command not found: dsa"

**Solution 1:** Restart your terminal
```bash
# Close and reopen your terminal
```

**Solution 2:** Add pnpm to PATH manually
```bash
export PATH="$(npm config get prefix)/bin:$PATH"
```

**Solution 3:** Add to shell config permanently
```bash
# For zsh
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# For bash
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### "pnpm: command not found"

The install script should handle this, but if it doesn't:

```bash
npm install -g pnpm
pnpm setup
# Restart terminal
```

### "Node.js version too old"

You need Node.js 18 or higher:

```bash
# Check your version
node --version

# If it's below v18, update Node.js from https://nodejs.org/
```

### Installation Script Fails

If the automated script fails:

1. Check error messages - they usually tell you what's wrong
2. Try manual installation (see above)
3. Make sure you have:
   - Node.js 18+
   - npm installed
   - Internet connection
   - Write permissions in the directory

### "Permission denied" on install.sh

Make the script executable:

```bash
chmod +x cli/scripts/install.sh
./cli/scripts/install.sh
```

## Uninstalling

To uninstall the CLI:

```bash
pnpm unlink --global @dsa/cli
```

Or manually remove:
```bash
# Find where it's linked
which dsa

# Remove the symlink (path will vary)
rm /path/to/dsa
```

## Updating

To update the CLI:

```bash
# Pull latest changes
git pull

# Rebuild and relink
cd cli
pnpm install
pnpm build
pnpm link --global
```

## Installation Methods Comparison

| Method | Ease | Speed | Recommended For |
|--------|------|-------|-----------------|
| **Automated Script** | ⭐⭐⭐⭐⭐ | Fast | Everyone |
| **Manual Steps** | ⭐⭐⭐ | Medium | Advanced users, troubleshooting |
| **npm publish** (future) | ⭐⭐⭐⭐⭐ | Fastest | Production use |

## Next Steps

After installation:

1. **Test the CLI:**
   ```bash
   dsa --help
   ```

2. **Use in a project:**
   ```bash
   cd your-dsa-challenge-repo
   dsa test
   dsa submit
   ```

3. **Read the docs:**
   - `README.md` - Overview and commands
   - `FUNCTIONALITY.md` - How it works
   - `MANUAL_TESTING.md` - Testing guide

## Need Help?

- Check `README.md` for command usage
- See `MANUAL_TESTING.md` for testing examples
- Review error messages - they're designed to be helpful
- Check that your `dsa.config.json` is valid

## Summary

**Easiest installation:**
```bash
./cli/scripts/install.sh
```

**Verify:**
```bash
dsa --version
```

**Start using:**
```bash
cd your-project
dsa test
```

That's it! 🎉

