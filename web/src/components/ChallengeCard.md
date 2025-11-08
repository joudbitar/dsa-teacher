# ChallengeCard Component

## Purpose

Displays a single challenge module as a card in the challenges grid.

## Props

```typescript
{
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  summary: string;
  subchallenges: string[];
  userProgress?: number; // 0-100 if user has started
}
```

## Interactions

- Click anywhere on card → navigate to `/challenges/:id`
- Hover effect: lift shadow, slight scale

## Visual Notes

- Level badge in top-right corner (color-coded: green/yellow/red)
- Title and summary text
- Progress bar at bottom (if userProgress exists)
- Sub-challenge count indicator

