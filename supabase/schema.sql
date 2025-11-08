-- Database schema outline (comments only; no execution)
-- Post-kickoff: run these as migrations in Supabase dashboard or via CLI

-- projects table
-- Stores user challenge projects with progress tracking
-- CREATE TABLE projects (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   userId TEXT NOT NULL,
--   moduleId TEXT NOT NULL,
--   language TEXT NOT NULL,
--   githubRepoUrl TEXT NOT NULL,
--   status TEXT NOT NULL DEFAULT 'in_progress',
--   progress INTEGER NOT NULL DEFAULT 0,
--   currentChallengeIndex INTEGER NOT NULL DEFAULT 0,
--   createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   UNIQUE(userId, moduleId)
-- );

-- CREATE INDEX idx_projects_userId ON projects(userId);
-- CREATE INDEX idx_projects_moduleId ON projects(moduleId);

-- submissions table
-- Stores test submission history
-- CREATE TABLE submissions (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   projectId UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
--   result TEXT NOT NULL,
--   summary TEXT NOT NULL,
--   details JSONB,
--   commitSha TEXT,
--   createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- CREATE INDEX idx_submissions_projectId ON submissions(projectId);
-- CREATE INDEX idx_submissions_createdAt ON submissions(createdAt DESC);

-- Row Level Security (RLS)
-- Enable RLS on both tables
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own projects
-- CREATE POLICY "Users can view own projects"
--   ON projects FOR SELECT
--   USING (auth.uid()::text = userId);

-- Policy: Users can insert their own projects
-- CREATE POLICY "Users can create own projects"
--   ON projects FOR INSERT
--   WITH CHECK (auth.uid()::text = userId);

-- Policy: Users can update their own projects
-- CREATE POLICY "Users can update own projects"
--   ON projects FOR UPDATE
--   USING (auth.uid()::text = userId);

-- Policy: Users can view submissions for their projects
-- CREATE POLICY "Users can view submissions for own projects"
--   ON submissions FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM projects
--       WHERE projects.id = submissions.projectId
--       AND projects.userId = auth.uid()::text
--     )
--   );

-- Realtime: Enable replication for tables
-- ALTER PUBLICATION supabase_realtime ADD TABLE projects;
-- ALTER PUBLICATION supabase_realtime ADD TABLE submissions;

