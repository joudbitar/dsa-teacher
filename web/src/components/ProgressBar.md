# ProgressBar Component

## Purpose

Visual indicator of completion percentage for a challenge.

## Props

```typescript
{
  progress: number; // 0-100
  height?: number; // default 8px
  color?: string; // accent color
}
```

## Interactions

- Purely visual; no interactions

## Visual Notes

- Filled portion animates on mount (smooth transition)
- Rounded corners
- Light background, colored foreground
- Optional text overlay showing percentage

