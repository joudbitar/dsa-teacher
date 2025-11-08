# SubChallengeList Component

## Purpose

Displays a list of sub-challenges with completion checkmarks.

## Props

```typescript
{
  subchallenges: string[];
  completed: boolean[]; // parallel array; true if completed
}
```

## Interactions

- Purely informational; no interactions (completion driven by CLI submissions)

## Visual Notes

- Vertical list
- Each item has checkbox icon (checked or unchecked)
- Completed items may have strikethrough or muted color
- Animated check transitions on state change

