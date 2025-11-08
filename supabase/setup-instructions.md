# Supabase Setup Instructions

## Option 1: SQL Editor (Quickest)

1. Go to https://app.supabase.com and open your project
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the contents of `supabase/init.sql`
5. Paste and click **Run** (or Cmd/Ctrl + Enter)

## Option 2: Using Supabase CLI

### Install CLI
```bash
npm install -g supabase
```

### Login to Supabase
```bash
supabase login
```

### Link to your project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

(Get YOUR_PROJECT_REF from project settings URL: `https://app.supabase.com/project/YOUR_PROJECT_REF`)

### Run migration
```bash
supabase db push
```

## After Running the Schema

### Enable Realtime (Important!)

For live dashboard updates, you need to enable Realtime on your tables:

1. Go to **Database** → **Replication** in Supabase dashboard
2. Find the **supabase_realtime** publication
3. Enable these tables:
   - ✅ `projects`
   - ✅ `submissions`

Alternatively, if you have superuser access, run in SQL Editor:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE submissions;
```

## Verify Setup

Run this query to check tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see:
- `projects`
- `submissions`

## Test with Sample Data (Optional)

```sql
INSERT INTO projects (userId, moduleId, language, githubRepoUrl, status, progress, projectToken)
VALUES 
  ('test-user-123', 'stack', 'TypeScript', 'https://github.com/org/test-stack-ts', 'in_progress', 60, 'test-token-abc123');

SELECT * FROM projects;
```
