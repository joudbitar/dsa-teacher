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

From a local checkout:

```bash
cd cli
pnpm install
pnpm build
pnpm link --global

# verify
dsa --version
```

A full installer lives in `cli/scripts/install.sh`. Distribute it however you like—
for example, you can create a small wrapper that downloads this repository (or a
packaged release) and then executes the script. Always audit before piping into `bash`.

### One-line remote install (no npm registry)

1. Set the repository URL for your fork/organization:

   ```bash
   export DSA_CLI_REPO="https://github.com/<org>/dsa-lab"
   ```

2. Run the remote installer:

   ```bash
   curl -fsSL https://raw.githubusercontent.com/<org>/dsa-lab/main/scripts/install-cli.sh | bash
   ```

The script downloads the latest sources, builds the CLI locally, and symlinks the
`dsa` command into `~/.local/bin`. Adjust `DSA_CLI_HOME` or `DSA_CLI_BIN` to customize
where it installs artifacts or the executable shim.

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

- `docs/cli-reference.md` – detailed CLI command behavior
- `docs/command-line-tips.md` – terminal workflow tips
- `docs/guides/QUICK_START.md` – end-to-end setup walkthrough
- `docs/guides/RUN_APP.md` – running the full stack locally

## Contributing

1. Fork and clone the repository.
2. Run `pnpm install` at the workspace root.
3. Use `pnpm --filter ./cli build` or `pnpm --filter ./web dev` when working on a package.
4. Keep secrets in environment variables—never commit real keys.
5. Submit a pull request with tests or manual verification notes.

## License

This project is released under the MIT License. See `LICENSE` for details.
