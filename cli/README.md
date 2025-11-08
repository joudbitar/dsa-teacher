# @dsa/cli

The DSA Lab command-line interface for testing and submitting solutions locally.

## Status

✅ **Fully implemented and functional!** All commands are working.

## Commands

### `dsa test`

Runs the test suite for the current challenge project.

**Steps:**
1. Detect project root (git repo, package.json, or dsa.config.json)
2. Load configuration (language, moduleId)
3. Execute language-specific test command (npm test, pytest, go test, etc.)
4. Parse test output and generate structured report
5. Display results in terminal with color coding

### `dsa submit`

Submits test results to the DSA Lab API and updates dashboard.

**Steps:**
1. Run `dsa test` internally to get latest results
2. Confirm git working tree is clean (or prompt user)
3. Capture current git commit SHA
4. Load project ID from config
5. POST results to /api/submissions
6. Display confirmation message with link to dashboard

## Installation

### Quick Install (Recommended) 🚀

**One command installation:**

```bash
./cli/scripts/install.sh
```

The automated script handles everything:
- ✅ Checks for Node.js and npm
- ✅ Installs pnpm if needed
- ✅ Sets up pnpm automatically
- ✅ Installs CLI dependencies
- ✅ Builds TypeScript
- ✅ Links CLI globally
- ✅ Verifies installation

**For Windows (PowerShell):**
```powershell
cd cli
.\scripts\install.ps1
```

**Verify installation:**
```bash
dsa --version
```

### Alternative: Manual Installation

If you prefer manual steps or the script doesn't work:

```bash
# 1. Install and set up pnpm
npm install -g pnpm
pnpm setup
source ~/.zshrc  # or restart terminal

# 2. Install dependencies and build
cd cli
pnpm install
pnpm build

# 3. Link CLI globally
pnpm link --global

# 4. Verify
dsa --version
```

### Troubleshooting

If `dsa` command is not found after installation:

1. **Restart your terminal**
2. **Or add to PATH:**
   ```bash
   export PATH="$(npm config get prefix)/bin:$PATH"
   ```

See `INSTALL.md` for detailed troubleshooting guide.

### Future (After Publishing to npm)

```bash
pnpm install -g @dsa/cli
```

## Usage

```bash
cd your-dsa-challenge-repo
dsa test
dsa submit
```

## Configuration

Projects will contain a `dsa.config.json` file:

```json
{
  "projectId": "uuid",
  "moduleId": "stack",
  "language": "TypeScript",
  "apiUrl": "https://dsa-lab.vercel.app"
}
```

