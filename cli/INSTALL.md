# DSA CLI Installation Guide

Complete guide for installing the DSA Lab CLI tool.

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** - Comes with Node.js
- **Git** - For cloning the repository (if installing from source)

## Quick Install (Recommended) 🚀

Use the remote installer script to download, build, and link the CLI without relying on npm:

```bash
export DSA_CLI_REPO="https://github.com/joudbitar/dsa-teacher"
curl -fsSL https://raw.githubusercontent.com/joudbitar/dsa-teacher/main/scripts/install-cli.sh | bash
```

Replace `<org>` with the GitHub org or username that hosts your fork.

### Updating

Re-run the same one-liner after exporting `DSA_CLI_REPO`; the script replaces the previous installation with the latest commit from `main`.

### Uninstalling

```bash
rm -rf ~/.local/share/dsa-cli
rm -f ~/.local/bin/dsa
```

If you run the installer again it recreates both paths automatically.

### Installing from npm (future)

Once the package is published to npm:

```bash
npm install -g @dsa/cli
```

Updating stays the same:

```bash
npm update -g @dsa/cli
```

Check the README for release announcements before relying on the npm workflow.

## Install from source (advanced)

If you're developing the CLI locally or contributing changes, you can link it from the repository.

### Automated install script

#### macOS / Linux / WSL

```bash
# From the project root directory
./cli/scripts/install.sh
```

#### Windows (PowerShell)

```powershell
# From the project root directory
cd cli
.\scripts\install.ps1
```

### Manual steps

If you prefer to run the steps yourself:

```bash
# Starting in the project root
cd cli

# 1. Install pnpm if needed
npm install -g pnpm

# 2. Install dependencies
pnpm install

# 3. Build the CLI
pnpm build

# 4. Link globally
pnpm link --global
```

## Verify Installation

After installation, verify it works:

```bash
dsa --version
```

You should see the published version number (for example `0.1.0`).

Test the commands:

```bash
dsa --help
dsa test --help
dsa submit --help
```

## Manual Installation (Alternative)

If you prefer to install manually or the script doesn't work:

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

## Updating

For npm installations, run `npm update -g @dsa/cli`.

For local development installs, pull latest changes and rerun the build/link flow:

```bash
git pull
cd cli
pnpm install
pnpm build
pnpm link --global
```

## Installation Methods Comparison

| Method                   | Ease       | Speed  | Recommended For                       |
| ------------------------ | ---------- | ------ | ------------------------------------- |
| **npm (global install)** | ⭐⭐⭐⭐⭐ | Fast   | Learners, production use              |
| **Automated Script**     | ⭐⭐⭐⭐   | Fast   | Contributors working from source      |
| **Manual Steps**         | ⭐⭐⭐     | Medium | Troubleshooting, fine-grained control |

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
npm install -g @dsa/cli
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
