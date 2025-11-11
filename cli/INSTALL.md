# DSA CLI Installation Guide

Complete guide for installing the DSA Lab CLI tool.

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** - Comes with Node.js
- **Git** - For cloning the repository (if installing from source)

## Quick Install (Recommended) 🚀

Install with a single command (no configuration needed):

```bash
curl -fsSL https://raw.githubusercontent.com/joudbitar/dsa-teacher/main/scripts/install-cli.sh | bash
```

The script downloads the CLI source, installs dependencies, builds the CLI, and links the `dsa`
command into `~/.local/bin`. If Corepack cannot modify global binaries, it falls back to
the `pnpm` already on your PATH.

### Troubleshooting Installation Errors

If you encounter a `400 Bad Request` or other HTTP error when running the install command:

1. **Check your internet connection** - Ensure you can access GitHub
2. **Try without the `-f` flag** to see the full error:
   ```bash
   curl -sSL https://raw.githubusercontent.com/joudbitar/dsa-teacher/main/scripts/install-cli.sh | bash
   ```
3. **Check if GitHub is accessible** from your location:
   ```bash
   curl -I https://github.com
   ```
4. **Try downloading the script first**, then running it:
   ```bash
   curl -fsSL https://raw.githubusercontent.com/joudbitar/dsa-teacher/main/scripts/install-cli.sh -o install-cli.sh
   bash install-cli.sh
   rm install-cli.sh
   ```
5. **If you have the repository cloned**, you can install from local source:
   ```bash
   cd /path/to/dsa-teacher
   DSA_CLI_LOCAL_DIR="$(pwd)/cli" bash scripts/install-cli.sh
   ```

### Updating

Re-run the same one-liner; the script replaces the previous installation with the latest commit from `main`.

### Uninstalling

```bash
rm -rf ~/.local/share/dsa-cli
rm -f ~/.local/bin/dsa
```

If you run the installer again it recreates both paths automatically.

> **PATH reminder:** Ensure `~/.local/bin` is in your PATH so the `dsa` command resolves:
>
> ```bash
> echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
> source ~/.zshrc
> ```
>
> Or for bash:
> ```bash
> echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
> source ~/.bashrc
> ```

### Installing from npm (Coming Soon)

The CLI will be available via npm in the future:

```bash
npm install -g @dsa/cli
```

Check the README for release announcements when npm installation becomes available.

## Install from source (For Contributors Only)

If you're developing the CLI locally or contributing changes, see the [CLI README](../cli/README.md) for contributor installation instructions.

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

For quick install, re-run the curl command.

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
curl -fsSL https://raw.githubusercontent.com/joudbitar/dsa-teacher/main/scripts/install-cli.sh | bash
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
