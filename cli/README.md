# @dsa/cli

The DSA Lab command-line interface for testing and submitting solutions locally.

## Status

Currently contains **only** placeholder files and comments. No application logic.

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

## Installation (Post-Kickoff)

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

