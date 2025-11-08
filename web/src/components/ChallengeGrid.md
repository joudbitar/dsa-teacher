# ChallengeGrid Component

## Purpose

Responsive grid layout for displaying multiple ChallengeCard components.

## Props

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

## Interactions

- Renders ChallengeCard for each challenge
- Merges userProjects data to show progress on cards

## Visual Notes

- CSS Grid: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- Equal height cards
- Gap spacing: 1.5rem

