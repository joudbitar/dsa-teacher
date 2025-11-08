# DSA Lab CLI Reference

The `dsa` command-line interface helps you run challenge tests locally and submit results to the DSA Lab platform. This document covers installation, configuration, commands, flags, and troubleshooting.

---

## 1. Installation

### 1.1 Prerequisites

- Node.js ≥ 18.x
- pnpm ≥ 8.x (`npm install -g pnpm`)
- Git (for capturing commit SHAs used during submission)

Verify with:

```bash
node --version
pnpm --version
git --version
```

### 1.2 Recommended Installation (macOS/Linux)

```bash
./cli/scripts/install.sh
```

This script:

1. Verifies Node.js and pnpm availability.
2. Installs CLI dependencies via pnpm.
3. Builds the TypeScript sources.
4. Links the CLI globally so `dsa` is on your PATH.
5. Runs `dsa --version` as a smoke test.

### 1.3 Windows PowerShell

```powershell
cd cli
.\scripts\install.ps1
```

The PowerShell script mirrors the bash installer. Run PowerShell as administrator on first use to avoid policy issues.

### 1.4 Manual Installation (Fallback)

```bash
cd cli
pnpm install
pnpm build
pnpm link --global
```

Re-run `pnpm build` after pulling CLI code changes. If `dsa` disappears, link it again with `pnpm link --global`.

### 1.5 Uninstall

```bash
pnpm unlink --global @dsa/cli
```

---

## 2. Configuration (`dsa.config.json`)

Each challenge repository created by the platform includes a `dsa.config.json` file at its root:

```json
{
  "projectId": "uuid",
  "projectToken": "secure-token",
  "moduleId": "stack",
  "language": "TypeScript",
  "apiUrl": "https://.../functions/v1",
  "testCommand": "node tests/run.js",
  "reportFile": ".dsa-report.json",
  "currentChallengeIndex": 0
}
```

Key fields:

- `projectId` & `projectToken`: identify and authenticate your challenge project.
- `apiUrl`: Supabase Edge Functions base URL (production by default).
- `testCommand`: shell command the CLI executes when you run `dsa test`.
- `reportFile`: JSON report produced by the template test runner.
- `currentChallengeIndex`: tracks progressive unlocking. Automatically updated after submissions.

The CLI searches upward from the current working directory until it finds `dsa.config.json`. If missing or invalid, commands exit with diagnostic errors.

---

## 3. Commands

### 3.1 `dsa help`

```bash
dsa --help
```

Lists available subcommands and the current version.

---

### 3.2 `dsa test`

Run challenge tests and display results.

```bash
dsa test
```

Workflow:

1. Locate and validate `dsa.config.json`.
2. Execute `config.testCommand` from the project root.
3. Parse `config.reportFile` (e.g., `.dsa-report.json`).
4. Render a status panel that highlights the current unlocked subchallenge.
5. Provide human-friendly hints for common runtime or assertion failures.

Exit codes:

- `0` – CLI finished successfully (even if tests failed; focus on CLI error messages).
- `1` – configuration errors, report parsing failures, or unexpected exceptions.

Typical output includes:

- Module name and language.
- Progress indicators for unlocked vs locked subchallenges.
- Error summaries (`is not a constructor`, expected vs received values, etc.).
- Next-step guidance depending on pass/fail state.

---

### 3.3 `dsa submit`

Submit the latest passing result for the currently unlocked challenge.

```bash
dsa submit
```

Workflow:

1. Internally runs `dsa test` to ensure the report is current.
2. Checks the active subchallenge; aborts if it hasn’t passed.
3. Reads Git status to capture the current commit SHA (if available).
4. Sends a POST request to `{apiUrl}/submissions` with:
   - Project identifiers and token.
   - Summary of challenge status.
   - Detailed test case results.
   - Optional `commitSha`.
5. Updates `currentChallengeIndex` in `dsa.config.json` on success.
6. Prints the dashboard URL to view progress.

Exit codes:

- `0` – submission recorded (or all challenges were already complete).
- `1` – tests failed, missing configuration, or API rejected the request.

Common API responses:

- `401 Unauthorized` – invalid/expired project token.
- `404 Not Found` – incorrect project ID.
- `500` – server error; rerun later or contact support.

---

## 4. Troubleshooting

| Issue | Diagnosis & Fix |
| ----- | --------------- |
| `dsa: command not found` | The CLI isn’t linked globally. Re-run the install script or `pnpm link --global`. Restart the terminal. |
| `Not a DSA project` | You are not inside the repo containing `dsa.config.json`. Navigate to the challenge root. |
| `Failed to parse test report` | The test command crashed or the report file is missing. Delete stale reports and run `dsa test` again. |
| Tests always fail silently | Run the underlying `testCommand` manually to view raw errors (e.g., `node tests/run.js`). |
| Submission returns 401 | The project token rotated. Recreate the challenge or update `dsa.config.json` from the dashboard. |
| Submission returns 404 | The project ID doesn’t match the Supabase record. Ensure you are in the correct repository. |

General tips:

- Copy full error output before seeking help.
- Ensure your network allows outbound HTTPS when submitting.
- Supabase outages will cause submissions to fail temporarily; retry later.

---

## 5. Development & Contribution

If you are modifying the CLI itself:

```bash
cd cli
pnpm install
pnpm dev             # watch mode recompiles TypeScript

# In another terminal
node dist/index.js test   # run without global link
```

Code organization:

- `cli/src/index.ts` – command router (`commander`).
- `cli/src/commands/` – individual command handlers (`test.ts`, `submit.ts`).
- `cli/src/lib/` – helpers (config loading, HTTP client, git utilities, report parser).
- `cli/types/` – shared TypeScript definitions.

When adding commands:

1. Create `cli/src/commands/<name>.ts`.
2. Register the command in `cli/src/index.ts`.
3. Update this document with installation/usage notes.

---

## 6. FAQ

- **Can I submit multiple times?** Yes. Each successful submission unlocks the next challenge; repeated submissions overwrite progress for the current challenge.
- **Do I need to commit before submitting?** No, but if you do, the CLI includes the latest commit SHA in the submission payload.
- **Does it work offline?** `dsa test` works offline; `dsa submit` requires network access to Supabase.
- **Where is my dashboard link?** After a successful submission, the CLI prints `${apiUrl}/projects/${projectId}`.
- **How do I switch environments?** Update `apiUrl` in `dsa.config.json` to target staging/local Supabase deployments.

---

Stay current: rerun the installer script after pulling updates, and check release notes in the repository for new commands or breaking changes.

