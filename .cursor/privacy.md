# Privacy & Safe Editing Guidelines

## Never Commit Secrets

**FORBIDDEN** in commits:
- API keys, tokens, passwords
- Private keys (GitHub App private key, SSL certs)
- Database URLs with credentials
- OAuth client secrets

**USE INSTEAD:**
- `.env.example` with empty values
- Variable names in documentation: `GITHUB_APP_PRIVATE_KEY=`
- Comments: "Obtain from Vercel dashboard"

## Review Diffs Carefully

Before committing:
1. Review each file's diff individually
2. Ensure no unintended changes (formatting, whitespace)
3. Avoid full-file rewrites when only a small section changed
4. Use targeted edits with search-replace tools

## Prefer Targeted Edits

When using AI assistance:
- Request specific line ranges or sections
- Avoid "rewrite entire file" unless necessary
- Use search-replace for renaming variables
- Summarize large changes rather than pasting full file contents

## Safe File Operations

- Always check `.gitignore` is up-to-date
- Never commit `node_modules/`, `dist/`, `.env`
- Use `.cursorignore` to exclude large generated files

## Data Privacy

- Use placeholder/fake data in examples
- Don't include real user emails, names, or PII
- Sanitize logs and error messages

## Collaboration Safety

- Tag sensitive PRs as "do not merge" if they contain WIP secrets
- Use GitHub Secrets for CI/CD environment variables
- Rotate keys immediately if accidentally committed

