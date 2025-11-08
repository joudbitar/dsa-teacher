# Supabase Realtime Configuration

## Enabled Tables

Both `projects` and `submissions` tables are configured for Realtime broadcasts.

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE submissions;
```

## Channel Naming Conventions

### Projects Channel
Subscribe to project updates for the authenticated user:

**Channel name:** `projects:userId:<user-id>`

**Filter:** `userId=eq.<user-id>`

**Events:** INSERT, UPDATE, DELETE

**Use case:** Project dashboard page - updates when user starts a new project or progress changes

### Submissions Channel
Subscribe to submission updates for a specific project:

**Channel name:** `submissions:projectId:<project-id>`

**Filter:** `projectId=eq.<project-id>`

**Events:** INSERT

**Use case:** Challenge detail page - updates when CLI submits new test results

## Client Implementation Notes

- Use Supabase JS client v2 with postgres_changes listener
- Always filter subscriptions by user-owned resources to respect RLS
- Automatically reconnect on connection drop
- Unsubscribe when component unmounts to prevent memory leaks

## Security

- Row Level Security (RLS) is enforced on both tables
- Users can only subscribe to channels for resources they own
- Realtime broadcasts respect RLS policies automatically

