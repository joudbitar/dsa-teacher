# Realtime Subscription Library

## Purpose

Manages Supabase Realtime subscriptions for live updates to projects and submissions.

## Channel Naming

- **Projects:** `projects:userId:<auth-id>` (filtered by userId)
- **Submissions:** `submissions:projectId:<project-id>` (filtered by projectId)

## Subscription Pattern

```typescript
// Subscribe to project updates for current user
supabase
  .channel(`projects:userId:${userId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'projects',
    filter: `userId=eq.${userId}`
  }, handleProjectChange)
  .subscribe();

// Subscribe to submission updates for a specific project
supabase
  .channel(`submissions:projectId:${projectId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'submissions',
    filter: `projectId=eq.${projectId}`
  }, handleSubmissionChange)
  .subscribe();
```

## Implementation Notes

- Create a custom hook `useRealtime` that returns subscription manager
- Auto-cleanup on unmount
- Reconnect logic on connection drop

