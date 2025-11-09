# Releasing `@dsa/cli` to npm

This guide walks through preparing, versioning, and publishing a new CLI release.

## 1. Prerequisites

- You have write access to the npm scope `@dsa`.
- You are authenticated with npm locally (`npm login`).
- The workspace is clean (`git status` shows no uncommitted changes).
- All changes live on the `main` branch (or the branch you intend to release from).

## 2. Sanity checks

```bash
pnpm install
pnpm build
dsa --version           # ensure the CLI runs locally
pnpm lint               # when a lint script is available
pnpm test               # when tests are available
```

> Tip: the `prepack` script automatically rebuilds the CLI before the publish step, but running the build yourself catches issues earlier.

## 3. Choose the next version

Decide whether the release is a:

- **patch** – bug fixes or docs only (`npm version patch`)
- **minor** – backwards-compatible feature (`npm version minor`)
- **major** – breaking changes (`npm version major`)

Update any user-facing docs (e.g. `CHANGELOG`, roadmap) before tagging.

```bash
git pull --rebase origin main
npm version <patch|minor|major>
```

This command bumps the version in `package.json`, creates a matching git tag, and commits the change.

## 4. Publish

Publishing with pnpm keeps workspace dependencies intact:

```bash
pnpm publish --access public
```

If you prefer npm, run `npm publish --access public`. Both commands trigger the `prepack` script to ensure `dist/` is up to date.

## 5. Push tags and announce

```bash
git push origin main --follow-tags
```

Share the release notes in the team channel and update any dashboards. Users installing afterward with `npm install -g @dsa/cli` automatically receive the new version.

## 6. Validate downstream

Smoke test the published build from a clean environment:

```bash
npm uninstall -g @dsa/cli
npm install -g @dsa/cli
dsa --version
```

Run a quick `dsa test` and `dsa submit` flow against a sample project to confirm nothing regressed.

