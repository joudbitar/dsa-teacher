# ChallengeDetail Page

## Narrative

User clicks on a specific challenge and lands here. The page shows the full description, sub-challenge list, and a "Start Project" button (or "View Project" if already started). After starting, the page displays the GitHub repo URL in a CopyBlock, CLI instructions, and a SubChallengeList showing which steps are completed. A button opens the SolutionDrawer to review past submissions.

## Data Shape

```typescript
{
  module: {
    id: string;
    title: string;
    level: string;
    summary: string;
    subchallenges: string[];
    template: string;
  };
  project?: {
    id: string;
    githubRepoUrl: string;
    status: string;
    progress: number;
    completedSubchallenges: boolean[];
  };
  submissions?: Array<{
    id: string;
    result: string;
    summary: string;
    details?: object;
    createdAt: string;
  }>;
}
```

## Components Used

- Navbar
- LanguagePicker (if no project yet)
- CopyBlock (for clone command)
- SubChallengeList
- SolutionDrawer
- StatusBadge

## Route

`/challenges/:id`

## Data Source

- `GET /api/modules` (filter by id)
- `GET /api/projects?moduleId=:id` (if authenticated)
- `POST /api/projects` (on "Start Project")

