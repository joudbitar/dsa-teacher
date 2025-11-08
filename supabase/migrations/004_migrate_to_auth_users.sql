-- Migration: Link projects and submissions to auth.users with foreign keys
-- This enforces that userId must be a valid UUID from auth.users table

-- Step 1: Convert projects.userId to UUID type (if currently TEXT)
-- Note: This assumes existing data is compatible or table is empty
-- For production with existing data, you'd need a more careful migration

DO $$ 
BEGIN
  -- Check if userId column is TEXT type and convert to UUID
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'projects' 
    AND column_name = 'userId' 
    AND data_type = 'text'
  ) THEN
    -- If you have existing data with TEXT userIds that aren't UUIDs, 
    -- you'll need to clean or migrate that data first
    -- For now, we'll attempt the conversion
    ALTER TABLE projects 
      ALTER COLUMN userId TYPE UUID USING userId::UUID;
  END IF;
END $$;

-- Step 2: Add foreign key constraint to projects table
ALTER TABLE projects
  DROP CONSTRAINT IF EXISTS fk_projects_user;

ALTER TABLE projects
  ADD CONSTRAINT fk_projects_user
    FOREIGN KEY (userId) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 3: Update RLS policies for projects to use auth.uid()
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can create own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;

CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can create own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = userId);

-- Step 4: Update RLS policies for submissions
-- Submissions are accessed via projectId, so policy checks if user owns the project
DROP POLICY IF EXISTS "Users can view submissions for own projects" ON submissions;
DROP POLICY IF EXISTS "Users can create submissions for own projects" ON submissions;

CREATE POLICY "Users can view submissions for own projects"
  ON submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = submissions.projectId
      AND projects.userId = auth.uid()
    )
  );

CREATE POLICY "Users can create submissions for own projects"
  ON submissions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = submissions.projectId
      AND projects.userId = auth.uid()
    )
  );

-- Step 5: Ensure RLS is enabled on both tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Note: After running this migration, ensure frontend sends JWT tokens
-- in Authorization header and backend extracts user.id from tokens

