# StatusBadge Component

## Purpose

Displays project or submission status with color coding.

## Props

```typescript
{
  status: "in_progress" | "completed" | "failed" | "pending";
}
```

## Interactions

- Static display; no interactions

## Visual Notes

- Pill shape with rounded edges
- Color mapping:
  - in_progress: blue
  - completed: green
  - failed: red
  - pending: gray
- Small dot indicator + text label

