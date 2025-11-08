# Cursor Rules for DSA Lab

## Golden Rule: No Application Logic Before Kickoff (Friday 8 PM)

Until the official hackathon kickoff, this repository contains **ONLY**:
- Folder structures
- Empty placeholder files
- Documentation (`.md` files)
- Configuration stubs
- JSON/YAML data files
- OpenAPI/Postman specifications
- CI/CD workflows

**FORBIDDEN** before kickoff:
- JSX/TSX components with actual rendering logic
- Route handlers with business logic
- Test implementations
- Database queries
- API client code beyond type definitions

## Stack Intent

Post-kickoff, the stack will be:
- **Web:** Vite + React + TypeScript, Tailwind CSS, shadcn/ui
- **API:** Vercel Serverless Functions (minimal)
- **Database:** Supabase (PostgreSQL + Realtime)
- **Auth:** Supabase Auth
- **CLI:** Node.js + TypeScript
- **Repos:** GitHub App for private repo creation

## File Boundaries

### web/
- `src/components/*.md` - Component descriptions only (props, interactions, visuals)
- `src/pages/*.md` - Page narratives and data shapes
- `src/lib/*.md` - Describes API fetch patterns and Realtime subscriptions
- `src/hooks/*.md` - Hook signatures and purposes
- NO JSX until kickoff

### cli/
- `src/commands/*.ts` - Step checklists in comments; no implementation
- `src/lib/*.ts` - Input/output signatures in comments; no implementation
- `types/*.d.ts` - TypeScript interfaces only

### api/
- `*.ts` files contain only comment headers:
  - Route path and method
  - Request/response examples
  - Environment variables
  - TODO checklist for implementation

### infra/
- `modules.json` - Static challenge data
- `openapi/` - API specification
- `postman/` - Request collection

### supabase/
- `schema.sql` - Commented SQL (no execution)
- `realtime.md` - Subscription patterns explained

## Commit Style

Use conventional commits:
- `feat(docs):` - New documentation
- `chore(ci):` - CI/CD changes
- `docs(structure):` - Structure/organization
- `build(config):` - Build config changes

## PR Requirements

All PRs before kickoff must include checkbox confirmation:
- "I confirm no application logic in this PR"

## Post-Kickoff Guidelines

After kickoff (Friday 8 PM):
- Follow component-driven development
- Keep PRs focused and reviewable
- Write tests alongside features
- Update docs as you build
- Use feature branches: `feature/component-name`

## Helpful Conventions

- Use absolute imports: `@/components/*`
- Component files: PascalCase (e.g., `ChallengeCard.tsx`)
- Util files: camelCase (e.g., `loadConfig.ts`)
- Constants: UPPER_SNAKE_CASE
- Environment variables: UPPER_SNAKE_CASE with prefixes (NEXT_PUBLIC_ for client-side)

