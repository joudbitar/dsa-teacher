# useProjectProgress Hook

## Purpose

Fetches and tracks progress for a specific project, including sub-challenge completion status.

## Parameters

```typescript
{
  projectId: string;
}
```

## Returns

```typescript
{
  project: Project | null;
  submissions: Submission[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

## Implementation Notes

- Fetches project data and submissions from API
- Subscribes to Realtime updates for this projectId
- Automatically updates when new submissions arrive
- Calculates sub-challenge completion from submission details

