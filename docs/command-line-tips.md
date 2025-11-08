# Command-Line Tips

Practical advice for contributors and students working with the DSA Lab challenge repositories. The goal is to stay productive in the terminal across macOS, Linux, and Windows (PowerShell).

---

## 1. Environment Readiness

### Required Tools

| Tool | macOS / Linux | Windows (PowerShell) | Purpose |
| ---- | ------------- | -------------------- | ------- |
| Node.js ≥ 18 | `brew install node` or download from nodejs.org | `winget install OpenJS.NodeJS.LTS` | Runs the CLI & local scripts |
| pnpm ≥ 8 | `npm install -g pnpm` | `npm install -g pnpm` | Package manager for monorepo |
| Git | `brew install git` or pre-installed | https://git-scm.com/download/win | Clone repos, capture commits |

Verify versions:

```bash
node --version
pnpm --version
git --version
```

> Keep tools up to date; older Node.js releases may fail to install dependencies required by the CLI.

### Optional Utilities

- **nvm** for switching Node versions (`brew install nvm` or `winget install nvm`).
- **VS Code CLI** (`code` command) for editing files quickly from the terminal.
- **Supabase CLI** (`npm install -g supabase`) if working on backend functions.

---

## 2. Navigation Essentials

| Task | macOS / Linux | Windows PowerShell |
| ---- | ------------- | ------------------ |
| Show current directory | `pwd` | `Get-Location` |
| List files | `ls -la` | `ls -Force` |
| Change directory | `cd path/to/folder` | `cd path\to\folder` |
| Go up one level | `cd ..` | `cd ..` |
| Create folder | `mkdir docs` | `mkdir docs` |

Tips:

- Use **Tab** to auto-complete file or folder names.
- Quote paths with spaces: `cd "My Projects/dsa-stack"`.
- Keep challenge repos under a predictable workspace (e.g. `~/Code/DSA/`).

---

## 3. Working with Challenge Repositories

```bash
# Clone the repo provisioned by the platform
git clone https://github.com/dsa-lab/<your-project>.git
cd <your-project>

# Inspect current status
git status

# Stage and commit changes
git add src/stack.ts
git commit -m "Implement push operation"
```

Guidelines:

- Configure Git identity once:

  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "you@example.com"
  ```

- Commit often with descriptive messages; the CLI includes the latest commit SHA when submitting.
- Use branches for experiments: `git checkout -b feature/improve-pop`.

---

## 4. Editing & Productivity

- Open the current folder in VS Code: `code .`
- Quick edits:
  - `nano file.ts` (macOS/Linux)
  - `code file.ts` (VS Code CLI)
  - `notepad file.ts` (Windows fallback)
- Use terminal multiplexers (tmux, Windows Terminal tabs) to keep one pane for `pnpm dev` and another for CLI commands.

---

## 5. Running Local Commands

Inside a challenge repository:

```bash
# Install dependencies (if required by the template)
pnpm install

# Run tests with the DSA CLI (installed globally)
dsa test

# Submit results after tests pass
dsa submit
```

Common variations:

- Specify Node version before installing dependencies: `nvm use 18`.
- Pass environment variables inline when targeting local Supabase functions:

  ```bash
  API_URL=http://localhost:54321/functions/v1 dsa submit
  ```

  ```powershell
  $env:API_URL="http://localhost:54321/functions/v1"; dsa submit
  ```

---

## 6. Troubleshooting Checklist

| Symptom | Resolution |
| ------- | ---------- |
| `command not found: dsa` | Re-run the CLI installer or `pnpm link --global` inside `cli/`. Restart the terminal afterward. |
| `Not a DSA project` | Ensure you are inside the repo containing `dsa.config.json`. Run `pwd` to confirm location. |
| Tests hang | Execute the command from `testCommand` manually (e.g. `node tests/run.js`) to inspect raw errors. |
| Permission denied | On macOS/Linux run `chmod +x cli/scripts/install.sh` before executing. |
| CRLF vs LF issues | Configure Git to use consistent line endings: `git config core.autocrlf input` (macOS/Linux) or `true` (Windows). |

Stay calm—copy the full error message, take a breath, and cross-reference the CLI documentation below for command-specific fixes.

---

## 7. Habits that Prevent Issues

- Pull latest changes before starting new work: `git pull origin main`.
- Keep terminals tidy; close stale shells so PATH changes take effect.
- Document any local overrides in a `.env.local` file rather than editing committed configs.
- After installing global tools, restart your terminal session to refresh the environment.

