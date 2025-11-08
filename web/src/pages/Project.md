# Project Page

## Narrative

User's personal dashboard showing all their active and completed projects. Each project card displays the challenge title, language, progress bar, status badge, and a link to the ChallengeDetail page. Realtime updates trigger when new submissions arrive.

## Data Shape

```typescript
{
  projects: Array<{
    id: string;
    moduleId: string;
    moduleName: string;
    language: string;
    githubRepoUrl: string;
    status: string;
    progress: number;
    updatedAt: string;
  }>;
}
```

## Components Used

- Navbar
- ChallengeCard (repurposed for projects)
- ProgressBar
- StatusBadge

## Route

`/projects`

## Data Source

`GET /api/projects` (all projects for current user)

Realtime subscription to `projects` table filtered by `userId`.

