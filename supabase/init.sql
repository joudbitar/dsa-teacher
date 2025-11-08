-- DSA Lab Database Schema
-- Run this in Supabase SQL Editor to create all tables and setup

-- =============================================================================
-- TABLES
-- =============================================================================

-- Projects table: Stores user challenge projects with progress tracking
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId TEXT NOT NULL,
  moduleId TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'TypeScript',
  githubRepoUrl TEXT,
  status TEXT NOT NULL DEFAULT 'not_started',
  progress INTEGER NOT NULL DEFAULT 0,
  projectToken TEXT NOT NULL UNIQUE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(userId, moduleId)
);

-- Submissions table: Stores test submission history
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  projectId UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  result TEXT NOT NULL,
  summary TEXT NOT NULL,
  details JSONB NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_projects_userId ON projects(userId);
CREATE INDEX IF NOT EXISTS idx_projects_moduleId ON projects(moduleId);
CREATE INDEX IF NOT EXISTS idx_projects_projectToken ON projects(projectToken);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_submissions_projectId ON submissions(projectId);
CREATE INDEX IF NOT EXISTS idx_submissions_createdAt ON submissions(createdAt DESC);

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Auto-update updatedAt timestamp on projects
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Note: For MVP with anonymous users (localStorage UUID), we'll skip RLS
-- and handle authorization in the API layer. Uncomment these if you add
-- real authentication later.

-- Enable RLS (currently disabled for MVP simplicity)
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policies for when you add real auth:
-- CREATE POLICY "Users can view own projects"
--   ON projects FOR SELECT
--   USING (userId = auth.uid()::text);

-- CREATE POLICY "Users can create own projects"
--   ON projects FOR INSERT
--   WITH CHECK (userId = auth.uid()::text);

-- CREATE POLICY "Users can update own projects"
--   ON projects FOR UPDATE
--   USING (userId = auth.uid()::text);

-- CREATE POLICY "Users can view submissions for own projects"
--   ON submissions FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM projects
--       WHERE projects.id = submissions.projectId
--       AND projects.userId = auth.uid()::text
--     )
--   );

-- =============================================================================
-- REALTIME
-- =============================================================================

-- Enable Realtime for live dashboard updates
-- Note: You need to enable this in Supabase Dashboard > Database > Replication
-- OR run these commands (requires superuser):
-- ALTER PUBLICATION supabase_realtime ADD TABLE projects;
-- ALTER PUBLICATION supabase_realtime ADD TABLE submissions;

-- =============================================================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================================================

-- Uncomment to insert test data:
-- INSERT INTO projects (userId, moduleId, language, githubRepoUrl, status, progress, projectToken)
-- VALUES 
--   ('test-user-123', 'stack', 'TypeScript', 'https://github.com/org/test-stack-ts', 'in_progress', 60, 'test-token-abc123'),
--   ('test-user-123', 'queue', 'TypeScript', 'https://github.com/org/test-queue-ts', 'not_started', 0, 'test-token-xyz789');

