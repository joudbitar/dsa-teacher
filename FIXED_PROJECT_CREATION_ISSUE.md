# Fixed: Project Creation Issues

## What Was Wrong

1. **Duplicate Key Error**: When project creation failed (e.g., GitHub repo creation), a database record was left behind. When users tried again, they got: `duplicate key value violates unique constraint "projects_userId_moduleId_key"`

2. **Permission Error**: Repos were created as private, so users couldn't clone them (403/404 errors) unless they were GitHub org admins.

## What Was Fixed

### 1. Smart Duplicate Handling with Repo Verification
The backend now:
- Checks if a project already exists before creating a new one
- **Verifies the repo is actually accessible** via GitHub API
- If repo is accessible (200 OK), returns the existing project
- If repo is not accessible (404/403), deletes the broken record and creates a new public one
- If no GitHub URL exists, deletes the broken record and creates a new one

### 2. Public Repos
- Changed repos from `private: true` to `private: false`
- Now anyone can clone the repos without needing to be added as a collaborator

### 3. Automatic Cleanup of Inaccessible Repos
- If an old private repo exists that users can't access, it's automatically detected and recreated as public

## For Users Who Got Errors

### Option 1: Just Try Again (Recommended)
The fix is deployed! Just try creating the project again - it will automatically clean up broken records and create a new one.

### Option 2: Manual Cleanup (If Still Having Issues)

If you still get errors, run this SQL in Supabase SQL Editor to see your broken projects:

```sql
SELECT 
  id,
  "userId",
  "moduleId",
  language,
  "githubRepoUrl",
  "createdAt"
FROM projects
WHERE "userId" = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@example.com')
  AND "githubRepoUrl" IS NULL;
```

Then delete them:

```sql
DELETE FROM projects 
WHERE "userId" = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@example.com')
  AND "githubRepoUrl" IS NULL;
```

## For the "Repo Not Found" Error

If you got a repo URL but can't clone it (404 error):

**Just try creating the project again!** The system now:
1. Detects that the repo is not accessible (returns 404 or 403)
2. Automatically deletes the broken project record
3. Creates a new public repo you can clone

No manual cleanup needed! ✨

## Files Changed

- `supabase/functions/projects/post.ts` - Added duplicate checking and cleanup logic, changed repos to public
- `supabase/cleanup_broken_projects.sql` - Helper SQL script for manual cleanup

## Deployment

Function deployed at: `https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1/projects`

---

**TL;DR**: Just try again, it should work now! 🎉

