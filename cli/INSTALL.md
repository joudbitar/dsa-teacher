# DSA CLI Installation Guide

Complete guide for installing the DSA Lab CLI tool.

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** - Comes with Node.js
- **Git** - For cloning the repository (if installing from source)

## Quick Install (Recommended) 🚀

### Option 1: Direct Install (One-liner)

```bash
curl -fsSL https://raw.githubusercontent.com/joudbitar/dsa-teacher/main/scripts/install-cli.sh | bash
```

### Option 2: Download & Verify First (Recommended if you encounter errors)

If you get HTML errors (like `bash: line 2: html: No such file or directory`) or 400 Bad Request, GitHub is returning an error page instead of the script. Download and verify first:

```bash
# Download the script
curl -fsSL https://raw.githubusercontent.com/joudbitar/dsa-teacher/main/scripts/install-cli.sh -o install-cli.sh

# Verify it's a bash script (should show "#!/usr/bin/env bash")
# If you see HTML tags like "<html>" or "<head>", the download failed
head -1 install-cli.sh

# If it shows the bash shebang, run it
bash install-cli.sh

# Clean up
rm install-cli.sh
```

**If you see HTML instead of a bash script:**
- Check your internet connection and try again
- Try accessing GitHub in a browser: https://github.com/joudbitar/dsa-teacher
- Your network may be blocking or proxying GitHub requests
- Try using a VPN or different network

The script downloads the CLI source, installs dependencies, builds the CLI, and links the `dsa`
command into `~/.local/bin`. If Corepack cannot modify global binaries, it falls back to
the `pnpm` already on your PATH.

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
>
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
