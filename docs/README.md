# DSA Lab Platform Documentation

Welcome to the DSA Lab knowledge base. This manual explains every component of the platform—from provisioning the dashboard to installing, operating, and troubleshooting the CLI. Whether you are an instructor, learner, or platform maintainer, you will find authoritative guidance here.

---

## Quick Start: Install the CLI

Install the CLI with a single command:

```bash
curl -fsSL https://raw.githubusercontent.com/joudbitar/dsa-teacher/main/scripts/install-cli.sh | bash
```

After installation, verify with `dsa --version`. If the command is not found, add `~/.local/bin` to your PATH and restart your terminal.

For troubleshooting and more details, continue with [Installing the CLI](#installing-the-cli).

---

## Table of Contents

1. [Quick Start: Install the CLI](#quick-start-install-the-cli)
2. [Platform Overview](#platform-overview)
3. [System Architecture](#system-architecture)
4. [Roles & Responsibilities](#roles--responsibilities)
5. [Prerequisites](#prerequisites)
6. [Installing the CLI](#installing-the-cli)
7. [Verifying & Updating Your Environment](#verifying--updating-your-environment)
8. [Uninstalling & Reinstalling](#uninstalling--reinstalling)
9. [Working with Challenge Repositories](#working-with-challenge-repositories)
10. [Configuration Reference (`dsa.config.json`)](#configuration-reference-dsaconfigjson)
11. [Daily Workflow](#daily-workflow)
12. [Command Reference](#command-reference)
13. [Advanced Usage & Automation](#advanced-usage--automation)
14. [Troubleshooting & Diagnostics](#troubleshooting--diagnostics)
15. [Support Playbook](#support-playbook)
16. [How the CLI Works Internally](#how-the-cli-works-internally)
17. [Release & Versioning Strategy](#release--versioning-strategy)
18. [Security & Compliance Considerations](#security--compliance-considerations)
19. [Glossary](#glossary)
20. [Additional Resources](#additional-resources)

---

## Platform Overview

DSA Lab is a full-stack learning environment for data structures and algorithms. It unifies three primary subsystems:

- **Dashboard (`web/`)** – A Vite + React SPA that provisions learner repositories, unlocks subchallenges, and exposes progress analytics.
- **CLI (`cli/`)** – A Node.js `commander`-based tool (`dsa`) that runs challenge tests locally, surfaces hints, and posts submissions to the backend.
- **Edge Functions & Database (`supabase/`)** – Supabase-hosted APIs and Postgres schema that authenticate users, manage challenge states, and store submissions.

Each learner works within template repositories mirrored from the platform. The CLI coordinates local execution with the hosted services to ensure progress is tracked and validated.

---

## System Architecture

```
┌───────────────┐       HTTPS        ┌────────────────┐        SQL / Storage
│   CLI (dsa)   │ ─────────────────▶ │ Supabase Edge  │ ───────────────────────┐
│  Local Tests  │  submissions API   │   Functions     │                        │
│ Hint Renderer │ ◀───────────────── │ (Node runtime)  │ ◀────────┐             │
└──────┬────────┘    hint payloads   └────────────────┘          │             │
       │                                                         │             │
       │file IO                                                  │             │
       ▼                                                         ▼             ▼
┌───────────────┐     git clone / pull     ┌────────────────┐    │  Postgres    │
│ Challenge Repo│◀────────────────────────▶│ Git Provider   │    │  (Projects,  │
│ templates +   │                           │ (GitHub, etc.)│    │ Submissions) │
│ dsa.config    │                           └────────────────┘    └─────────────┘
└───────────────┘
```

- **Data Flow**: The CLI reads `dsa.config.json`, executes the local `testCommand`, parses `.dsa-report.json`, and posts results to Supabase. Supabase persists outcomes and signals the dashboard to unlock new subchallenges.
- **Authentication**: Each repo embeds a `projectId` and `projectToken`. Tokens should be rotated when regenerating repos. Edge Functions validate both values before accepting submissions.
- **Hints**: The CLI reads `HINTS.md` locally. Future iterations may fetch hints from Supabase; the interface is ready for either source.
- **Git Metadata**: The CLI attempts to capture the current commit SHA to aid instructors when reviewing progress.

---

## Roles & Responsibilities

| Role                | Primary Actions                                                                    | Key Docs                                                                                        |
| ------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Learner             | Clone challenge repos, run tests, request hints, submit progress.                  | [Daily Workflow](#daily-workflow), [Troubleshooting](#troubleshooting--diagnostics)             |
| Instructor          | Provision challenges, monitor submissions, rotate tokens, answer support requests. | [Support Playbook](#support-playbook), [`guides/QUICK_START.md`](./guides/QUICK_START.md)       |
| Platform Maintainer | Update CLI/dashboard, ship releases, maintain Supabase schema.                     | [Release & Versioning](#release--versioning-strategy), [`cli-reference.md`](./cli-reference.md) |

---

## Prerequisites

Install and keep the following tools current:

- **Node.js ≥ 18** – Required runtime for the CLI (`type: module`). Prefer the LTS build.
- **npm** – Bundled with Node. Used for global installs when pulling from the npm registry.
- **pnpm ≥ 8** – Required for building the CLI from source and running workspace scripts.
- **Git** – Needed for cloning repos and capturing commit metadata.
- **Shell Environment** – POSIX shell (macOS/Linux/WSL) or PowerShell 7 on Windows.
- **Optional**: Corepack (ships with Node 18+) to manage pnpm automatically.

Verify dependencies:

```bash
node --version
git --version
pnpm --version
corepack --version  # optional
```

> Keep these tools patched. Outdated Node or pnpm versions are the most common root cause of installation failures.

---

## Installing the CLI

Install the CLI with a single command:

```bash
curl -fsSL https://raw.githubusercontent.com/joudbitar/dsa-teacher/main/scripts/install-cli.sh | bash
```

This downloads the CLI source, builds it, and installs the `dsa` command to `~/.local/bin`. No configuration needed.

---

## Verifying & Updating Your Environment

After installation:

```bash
dsa --version
which dsa          # macOS/Linux
Get-Command dsa    # Windows
```

If PATH is missing:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

To update: Re-run the curl command above.

The CLI prints the filesystem path it was invoked from when run with `--version`. Confirm it matches the intended location.

---

## Uninstalling & Reinstalling

- **npm**: `npm uninstall -g @dsa/cli`
- **Script install**: Remove the artifact directory (default `~/.local/share/dsa-cli`) and delete the `dsa` symlink under `~/.local/bin`.

```bash
rm -rf ~/.local/share/dsa-cli
rm -f ~/.local/bin/dsa
hash -r  # clear shell command cache
```

- **pnpm link**: `pnpm unlink --global @dsa/cli`

Always close and reopen the terminal after uninstalling to avoid stale PATH cache.

---

## Working with Challenge Repositories

1. **Provision** – Instructors use the dashboard to create a new project, which seeds a repository containing starter code, `dsa.config.json`, `.dsa-report.json` template, and `HINTS.md` (when provided).
2. **Clone** – Learners clone the generated repository with their Git provider credentials.
3. **Install project dependencies** – Follow the repository-specific README (e.g., `pnpm install`, `npm install`, or language-specific tooling).
4. **Understand directory structure** – Template directories often include `solutions/`, `tests/`, and `docs/` supporting files. Challenge-specific instructions live in `README.md` or in the dashboard.
5. **Keep secrets private** – `projectToken` is sensitive. Avoid committing `dsa.config.json` modifications containing real tokens to public forks.

---

## Configuration Reference (`dsa.config.json`)

| Field                   | Type              | Description                                           | Required |
| ----------------------- | ----------------- | ----------------------------------------------------- | -------- |
| `projectId`             | string (UUID)     | Identifies the learner project in Supabase.           | ✔︎       |
| `projectToken`          | string            | HMAC token for authenticating submissions.            | ✔︎       |
| `moduleId`              | string            | Challenge module slug (e.g., `min-heap`).             | ✔︎       |
| `language`              | string            | Preferred programming language (display only).        | ✔︎       |
| `apiUrl`                | string (URL)      | Base URL for Supabase Edge Functions.                 | ✔︎       |
| `testCommand`           | string            | Shell command executed when running `dsa test`.       | ✔︎       |
| `reportFile`            | string            | Relative path to the JSON report generated by tests.  | ✔︎       |
| `currentChallengeIndex` | number            | Zero-based index of the latest unlocked subchallenge. | ✔︎       |
| `hintsSource`           | string (optional) | Overrides hint retrieval source (`local`, `remote`).  | ✖︎       |

Notes:

- The CLI searches for `dsa.config.json` starting from the current directory and moving upward. Keep the file at the repository root.
- `currentChallengeIndex` is automatically updated by the CLI after successful submissions.
- When deploying to staging environments, edit `apiUrl` to point at your staging Supabase instance.

---

## Daily Workflow

1. **Update local code**
   - Pull latest template changes.
   - Merge updates carefully to avoid regressing solved challenges.
2. **Implement solution**
   - Work within the provided `solutions/` directory or equivalent.
3. **Run tests with `dsa test`**
   - The CLI executes `testCommand`, streams logs, and parses `.dsa-report.json`.
   - The terminal UI highlights pass/fail state per subchallenge.
4. **Request hints with `dsa hint`**
   - Hints display progressively based on `currentChallengeIndex`.
5. **Submit progress with `dsa submit`**
   - CLI re-runs tests, validates success, posts to Supabase, updates `currentChallengeIndex`, and prints the dashboard URL.
6. **Review dashboard**
   - Ensure the submission appears. If not, follow the [Troubleshooting](#troubleshooting--diagnostics) steps.

---

## Command Reference

| Command                               | Description                                               | Output                                                    | Exit Codes                      | File References                                                                       |
| ------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------- |
| `dsa --help` / `dsa <command> --help` | Display usage, examples, and options.                     | Usage banner, version string.                             | `0`                             | `cli/src/index.ts`                                                                    |
| `dsa test [--report <path>]`          | Execute `testCommand`, parse report, render results.      | Status panel, summary of failed assertions, hint prompts. | `0` success, `1` error.         | `cli/src/commands/test.ts`, `cli/src/lib/runCommand.ts`, `cli/src/lib/parseReport.ts` |
| `dsa submit [--skip-test] [--ci]`     | Validate latest report (or rerun tests), send submission. | Submission ID, dashboard URL, unlocked challenge index.   | `0` success, `1` failure.       | `cli/src/commands/submit.ts`, `cli/src/lib/http.ts`                                   |
| `dsa hint [--all]`                    | Render hints relevant to the unlocked challenge.          | Hint content with formatting.                             | `0` success, `1` missing hints. | `cli/src/commands/hint.ts`                                                            |

> Flags such as `--report`, `--skip-test`, `--ci`, and `--all` are designed for advanced automation and CI flows. Refer to [`docs/cli-reference.md`](./cli-reference.md) for the complete option list and behavior.

---

## Advanced Usage & Automation

- **Continuous Integration**: Configure CI pipelines to run `dsa test --ci` to validate solutions without interactive prompts. Avoid `dsa submit` from CI unless you intend to automate unlocking.
- **Custom Test Commands**: For multi-language templates, update `testCommand` to invoke language-specific runners (`python -m pytest`, `cargo test`, etc.). Ensure the command writes a JSON report compatible with the CLI parser.
- **Offline Mode**: `dsa test` and `dsa hint` work offline. `dsa submit` requires network connectivity. Queue submissions locally if connectivity is intermittent and resubmit when online.
- **Scripting**: Because `dsa` is a standard CLI, you can compose it with other tools. Example:

```bash
pnpm lint && dsa test && git commit -am "Solve stack challenge"
```

- **Debug Logging**: Set `DEBUG=dsa:*` in your environment to enable verbose logging (if implemented). Inspect `cli/src/lib/logger.ts` when customizing logging behavior.

---

## Troubleshooting & Diagnostics

### Quick-Fix Matrix

| Symptom                             | Likely Cause                                                 | Resolution                                                                                                     |
| ----------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `dsa: command not found`            | PATH missing CLI binary.                                     | Re-run installer; export `PATH` to include `~/.local/bin`; restart shell.                                      |
| `Permission denied` during install  | Shell lacks execute permissions or directories require sudo. | Ensure `install-cli.sh` is executable (`chmod +x`), avoid using `sudo`; choose a user-writable `DSA_CLI_HOME`. |
| `Not a DSA project`                 | CLI cannot find `dsa.config.json`.                           | Navigate to repo root or copy config file from dashboard template.                                             |
| `Failed to parse test report`       | Test command crashed or wrote malformed JSON.                | Run `testCommand` manually, inspect console output, delete `.dsa-report.json`, rerun `dsa test`.               |
| Submission HTTP `401`               | `projectToken` expired.                                      | Refresh token via dashboard and update config.                                                                 |
| Submission HTTP `404`               | Wrong `projectId`.                                           | Confirm repository corresponds to learner project; verify dashboard URL.                                       |
| `ECONNREFUSED` / timeout            | Supabase unreachable (network, VPN, firewall).               | Test connectivity (`curl <apiUrl>/health`), disable VPN/firewall temporarily, retry later.                     |
| `spawn ENOENT`                      | Required binary in `testCommand` missing.                    | Install dependency (e.g., `pnpm`, `python`), or adjust command.                                                |
| `pnpm` complains about Node version | Node < 18.                                                   | Upgrade Node to supported LTS release.                                                                         |
| `git` SHA missing in submission     | Repository has no commits.                                   | Commit at least once, or ignore if commit linkage is optional.                                                 |

### Deep-Dive Diagnostics

1. **Enable verbose CLI logs** (if available): `DEBUG=dsa:* dsa test`.
2. **Inspect generated report file**: Open `.dsa-report.json` to confirm structure matches expectation (see template in challenge repo).
3. **Check Supabase function logs**: Use `supabase functions logs --project <project>` to inspect backend errors.
4. **Validate tokens**: Run `dsa test --report` to ensure CLI picks up overrides; verify `projectId` and `projectToken` directly against the dashboard.
5. **Network tracing**: Run `dsa submit --verbose` (if supported) or wrap with `NODE_DEBUG=http dsa submit` to trace outgoing requests.

---

## Support Playbook

When helping a learner:

1. **Collect context**: Operating system, Node & pnpm versions, CLI version (`dsa --version`), full command output.
2. **Reproduce**: Attempt to replicate with a similar repo. Pay attention to `testCommand` differences.
3. **Escalate**:
   - Configuration issues → update `dsa.config.json`.
   - Template/test bugs → file issues in the template repository.
   - Backend outages → check Supabase status page or internal monitoring.
4. **Token Rotation**: If a token leaks or submissions fail due to auth, regenerate the project via the dashboard and distribute the new repo.
5. **Documentation links**: Share relevant sections (e.g., [Troubleshooting](#troubleshooting--diagnostics)) to encourage self-service.

Maintain a changelog of recurring issues to feed into future CLI enhancements.

---

## How the CLI Works Internally

Understanding module responsibilities helps in extending or debugging the CLI:

| Module         | Path                         | Responsibility                                                                            |
| -------------- | ---------------------------- | ----------------------------------------------------------------------------------------- |
| Entry Point    | `cli/src/index.ts`           | Configures `commander`, registers subcommands, handles top-level error trapping.          |
| Test Command   | `cli/src/commands/test.ts`   | Loads configuration, executes test runner, formats output.                                |
| Submit Command | `cli/src/commands/submit.ts` | Validates results, posts to Supabase, updates config, prints dashboard link.              |
| Hint Command   | `cli/src/commands/hint.ts`   | Reads hints from local markdown (or future remote APIs) and renders formatted output.     |
| Config Loader  | `cli/src/lib/loadConfig.ts`  | Searches parent directories for `dsa.config.json`, validates schema, handles overrides.   |
| Command Runner | `cli/src/lib/runCommand.ts`  | Spawns child processes for `testCommand`, captures stdout/stderr, handles non-zero exits. |
| Report Parser  | `cli/src/lib/parseReport.ts` | Parses `.dsa-report.json`, normalizes results into strongly typed objects.                |
| HTTP Client    | `cli/src/lib/http.ts`        | Wraps `fetch`/`node:https`, applies authentication headers, retries network failures.     |
| Git Utilities  | `cli/src/lib/git.ts`         | Retrieves the latest commit SHA; detects detached HEAD scenarios.                         |

Type definitions live under `cli/types/`, ensuring consistent structures across commands.

---

## Release & Versioning Strategy

- **Semantic Versioning**: The CLI follows `MAJOR.MINOR.PATCH`. Breaking changes bump `MAJOR`.
- **Distribution Channels**:
  - npm registry (`@dsa/cli`)
  - GitHub release tarballs (consumed by `install-cli.sh`)
- **Release Process**:
  1. Update version in `cli/package.json`.
  2. Run `pnpm --filter ./cli build` and ensure `dist/` is up to date.
  3. Publish to npm (`npm publish --access public`).
  4. Tag the repository (`git tag vX.Y.Z`) and push tags.
  5. Update documentation (this file, `cli-reference.md`) with new features or flags.
- **Deprecations**: Mark deprecated commands or flags with warnings in CLI output, then remove in the next major release.

---

## Security & Compliance Considerations

- **Token Safety**: Treat `projectToken` as a secret. Rotate promptly if exposed.
- **HTTPS Enforcement**: `apiUrl` should always use HTTPS. The CLI does not bypass TLS validation.
- **Dependency Audits**: Run `pnpm audit` or `npm audit` regularly, especially before releases.
- **Least Privilege**: Restrict Supabase service role keys; Edge Functions should verify token + project ID combinations.
- **Logging**: Avoid logging tokens or sensitive data. Scrub output before sharing logs externally.
- **Data Retention**: Supabase stores submission history. Consult privacy policies before uploading real learner data.

---

## Glossary

- **Challenge**: A coding task bundled with tests and hints.
- **Subchallenge**: Incremental milestone within a challenge unlock sequence.
- **Report**: JSON artifact generated by template tests; ingested by the CLI.
- **Dashboard**: Web interface displaying learner progress and provisioning tools.
- **Edge Function**: Supabase serverless function responding to CLI submissions.
- **Project Token**: Secret used by the CLI to authenticate submissions for a specific learner.

---

## Additional Resources

- [`docs/cli-reference.md`](./cli-reference.md) – Detailed command syntax, options, and developer workflows.
- [`docs/guides/QUICK_START.md`](./guides/QUICK_START.md) – Instructor-focused platform setup.
- [`docs/guides/RUN_APP.md`](./guides/RUN_APP.md) – Running dashboard and Supabase locally.
- [`docs/command-line-tips.md`](./command-line-tips.md) – Shell productivity tips for learners.
- Supabase Documentation – https://supabase.com/docs
- Commander.js Docs – https://github.com/tj/commander.js

Stay aligned with release notes in the repository and rerun installers after pulling updates to keep the CLI current with platform capabilities.
