# Quick Start

Spin up the CLI and dashboard locally with these steps.

## 1. Clone & Install

```bash
git clone https://github.com/<org>/dsa-lab.git
cd dsa-lab
pnpm install
```

## 2. Build the CLI

```bash
cd cli
pnpm install
pnpm build
pnpm link --global   # optional, exposes the `dsa` command
dsa --version
```

## 3. Run Supabase Functions Locally

```bash
cd ../supabase
supabase start
supabase functions serve --env-file ../.env.local
```

Populate `.env.local` with the secrets listed in `supabase/functions/README.md`
(no real keys are committed to this repo).

## 4. Start the Dashboard

```bash
cd ../web
pnpm install
pnpm dev
```

Set `VITE_API_URL` and `VITE_SUPABASE_URL` in `web/.env.local` to point at your local or
hosted Supabase project, e.g. `http://localhost:54321/functions/v1`.

## 5. Smoke Test

```bash
# In a separate shell
dsa test     # run inside a generated challenge repository
dsa submit
```

Need more detail? See:

- `README.md` – project overview
- `cli/README.md` – CLI usage
- `docs/cli-reference.md` – command reference
- `supabase/functions/README.md` – backend setup
