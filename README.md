# DSA Lab

DSA Lab is a toolkit for learning data structures with hands-on projects.  
The monorepo bundles a React dashboard, Node.js CLI, and Supabase Edge Functions that
work together to provision challenge repositories, run local tests, and report progress.

## Packages

- `cli/` – `dsa` command-line interface (test, submit, hints)
- `web/` – Vite + React dashboard
- `supabase/` – Edge Functions, migrations, and database schema
- `docs/` – Reference material for contributors

## Getting Started

```bash
# Clone (replace <org> with your GitHub org or account)
git clone https://github.com/<org>/dsa-lab.git
cd dsa-lab

# Install workspace dependencies
pnpm install

# Build the CLI
pnpm --filter ./cli build

# Start the web dashboard
pnpm --filter ./web dev
```

Supabase and GitHub credentials are not bundled.  
Create your own Supabase project, configure the secrets listed in
`supabase/functions/README.md`, and register a GitHub App with access to your template
repositories before deploying the Edge Functions.

## Install the CLI Globally

Quick start for macOS/Linux/WSL:

```bash
make install-cli         # builds cli/ locally and links dsa into ~/.local/bin
dsa --version            # verify the binary resolves
```

Need to refresh from the latest remote sources? Run `make install-cli-remote`, which wraps the same helper script but downloads the archive defined by `DSA_CLI_REPO`/`DSA_CLI_REF` before building.

Manual steps remain available:

```bash
cd cli
pnpm install
pnpm build
pnpm link --global

# verify
dsa --version
```

A full installer lives in `scripts/install-cli.sh`. Distribute it however you like—
for example, you can create a small wrapper that downloads this repository (or a
packaged release) and then executes the script. Always audit before piping into `bash`.

### One-line remote install (no npm registry)

Run the one-liner:

```bash
curl -fsSL https://raw.githubusercontent.com/<org>/<repo>/main/scripts/install-cli.sh | \
  env DSA_CLI_REPO="https://github.com/<org>/<repo>" COREPACK_ENABLE=0 bash
```

The script downloads the latest sources, builds the CLI locally, and symlinks the
`dsa` command into `~/.local/bin`. It automatically falls back to the `pnpm` on your
PATH if Corepack cannot access `/usr/local/bin`. Adjust `DSA_CLI_HOME` or `DSA_CLI_BIN`
to customize artifact and symlink locations.

After installation, make sure `~/.local/bin` is in your PATH:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc    # or restart your terminal
```

## Environment

- Node.js ≥ 18 (includes npm)
- pnpm ≥ 8
- Supabase CLI (for deploying Edge Functions)
- GitHub App private key + credentials (for provisioning repositories)

Copy any environment variables into `.env.local` (not committed) and load them before
running `supabase functions serve` or deploying to production.

## Repository Layout

```
.
├─ cli/            # Node.js CLI (TypeScript)
├─ docs/           # Additional contributor guides
├─ infra/          # API definitions & support files
├─ supabase/       # Edge Functions, migrations, seed data
├─ web/            # React dashboard
└─ scripts/        # Utility scripts
```

## Documentation

This section is the canonical reference for onboarding to the DSA Lab platform and its CLI. Share it with learners, instructors, and administrators to ensure everyone follows the same workflow.

### Platform Overview

- The dashboard provisions challenge repositories and tracks learner progress via Supabase Edge Functions.
- Each challenge repo ships with `dsa.config.json`, template tests, and optional `HINTS.md` that the CLI can surface.
- The CLI (`dsa`) is the primary touchpoint for running tests locally, requesting hints, and submitting progress back to the platform.

### Install the CLI

| Scenario                       | Command                                                      | Notes                                                                                             |
| ------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Local workspace (recommended)  | `make install-cli`                                           | Builds from your checkout and links `dsa` into `~/.local/bin`.                                    |
| Remote fetch helper            | `make install-cli-remote`                                    | Downloads sources via `scripts/install-cli.sh` before building/linking.                           |
| Published npm registry package | `npm install -g @dsa/cli`                                    | Installs the published package and adds `dsa` to your PATH. Update with `npm update -g @dsa/cli`. |
| Script with custom locations   | `DSA_CLI_HOME=$HOME/dsa-cli ./scripts/install-cli.sh`        | Overrides artifact cache path; pair with `DSA_CLI_BIN` to control the symlink directory.          |
| Manual fallback                | `cd cli && pnpm install && pnpm build && pnpm link --global` | Use when automation is blocked. Re-run after pulling CLI changes.                                 |

Verify the install:

```bash
dsa --version
which dsa   # confirm the command resolves
```

> Note: On macOS and Linux the installer links to `~/.local/bin`. Append the directory to your shell profile: `echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc`.

### Daily Workflow

1. **Sync the challenge repository** – Pull the latest template updates before you code.
2. **Run tests locally** – Use `dsa test` to execute the `testCommand` defined in `dsa.config.json`; the CLI parses `.dsa-report.json` and highlights unlocked subchallenges.
3. **Request hints when stuck** – Run `dsa hint` to render context-aware tips pulled from `HINTS.md`.
4. **Submit progress** – After passing tests, run `dsa submit`. The CLI re-runs tests, attaches the current Git commit SHA (if available), and unlocks the next challenge on success.
5. **Review the dashboard** – Follow the URL printed after submission to confirm that Supabase recorded your progress.

### Command Reference

| Command      | Purpose                                                                        | Key Output                                                                    |
| ------------ | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `dsa --help` | Lists all subcommands and global flags.                                        | Usage banner, version information.                                            |
| `dsa test`   | Runs the configured test suite, parses the report, and renders a status panel. | Module name, unlocked challenge index, pass/fail summary, next-step guidance. |
| `dsa submit` | Re-runs tests and posts results to `{apiUrl}/submissions`.                     | Submission status, dashboard URL, unlock confirmation.                        |
| `dsa hint`   | Prints curated hints for the active subchallenge.                              | Excerpt from `HINTS.md`, aligned with the learner’s current step.             |

All commands exit with status `0` when the CLI completes successfully. Configuration errors, network failures, or unhandled exceptions return status `1` with actionable messaging.

### Troubleshooting & Diagnostics

| Symptom                       | Likely Cause                                         | Resolution                                                                                                            |
| ----------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `dsa: command not found`      | PATH does not include the CLI bin directory.         | Re-run the installer or `pnpm link --global`, then restart the shell after exporting `PATH="$HOME/.local/bin:$PATH"`. |
| `Not a DSA project`           | CLI cannot locate `dsa.config.json`.                 | Change into the repository root or copy the config from the dashboard-generated repo.                                 |
| `Failed to parse test report` | The `testCommand` crashed or wrote malformed JSON.   | Run the raw command (e.g., `node tests/run.js`) and delete stale `.dsa-report.json` before retrying `dsa test`.       |
| Submission returns `401`      | Project token rotated or is missing.                 | Refresh the project from the dashboard, update `projectToken`, and try again.                                         |
| Submission returns `404`      | Repository is not linked to the expected project ID. | Confirm you cloned the correct challenge repo and that `projectId` matches the dashboard.                             |
| Timeout or ECONNREFUSED       | Supabase Edge Function unreachable.                  | Check network connectivity, VPN, or staging URLs; retry after service is healthy.                                     |

Capture the full CLI output when asking for support. Many errors include remediation hints inline.

### How the CLI Works

- `cli/src/index.ts` bootstraps the `commander` program and delegates to subcommand handlers.
- `cli/src/lib/loadConfig.ts` walks up from the current directory to locate and validate `dsa.config.json`.
- `cli/src/lib/runCommand.ts` executes the project’s `testCommand`, streaming logs and surfacing non-zero exit codes.
- `cli/src/lib/parseReport.ts` reads the JSON report and normalizes results for display and submission payloads.
- `cli/src/lib/http.ts` signs API requests with `projectId` and `projectToken` to communicate with Supabase Edge Functions.
- `cli/src/lib/git.ts` captures the latest commit SHA when available, enabling auditing on the dashboard.

For a deeper dive, review `docs/cli-reference.md` and `docs/guides/QUICK_START.md`. Keep these documents updated when the workflow changes.

## Contributing

1. Fork and clone the repository.
2. Run `pnpm install` at the workspace root.
3. Use `pnpm --filter ./cli build` or `pnpm --filter ./web dev` when working on a package.
4. Keep secrets in environment variables—never commit real keys.
5. Submit a pull request with tests or manual verification notes.

## License

This project is released under the MIT License. See `LICENSE` for details.
