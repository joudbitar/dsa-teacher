# Challenges Page

## Narrative

User sees a grid of available challenges (Stack, Queue, Binary Search, Min-Heap, etc.). Each card shows the title, level, summary, and sub-challenge count. If the user is logged in and has started a project, the card displays a progress bar.

## Data Shape

```typescript
{
  challenges: Array<{
    id: string;
    title: string;
    level: string;
    summary: string;
    subchallenges: string[];
  }>;
  userProjects?: Array<{
    moduleId: string;
    progress: number;
  }>;
}
```

## Components Used

- Navbar
- ChallengeGrid
  - ChallengeCard (multiple)
    - ProgressBar (conditional)

## Route

`/challenges`

## Data Source

Fetches from `GET /api/modules` and merges with `GET /api/projects` (if authenticated).

