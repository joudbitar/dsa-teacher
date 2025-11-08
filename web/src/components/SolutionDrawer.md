# SolutionDrawer Component

## Purpose

Side panel or modal that shows submission history and details for a project.

## Props

```typescript
{
  projectId: string;
  submissions: Array<{
    id: string;
    result: "pass" | "fail";
    summary: string;
    details?: object;
    createdAt: string;
  }>;
  isOpen: boolean;
  onClose: () => void;
}
```

## Interactions

- Close button → calls onClose
- Click on submission entry → expands to show details
- Scrollable list of submissions

## Visual Notes

- Slides in from right (desktop) or bottom (mobile)
- Each submission shows timestamp, result badge, summary
- Expandable accordion for details (test output, errors)

