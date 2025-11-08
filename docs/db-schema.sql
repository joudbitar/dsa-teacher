-- Database schema outline (comments only; no execution)
-- Post-kickoff: run these as migrations in Supabase dashboard or via CLI

-- projects table
-- Stores user challenge projects with progress tracking and authentication tokens
-- CREATE TABLE projects (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   userId TEXT NOT NULL,
--   moduleId TEXT NOT NULL,
--   language TEXT NOT NULL DEFAULT 'TypeScript',
--   githubRepoUrl TEXT,
--   status TEXT NOT NULL DEFAULT 'not_started',
--   progress INTEGER NOT NULL DEFAULT 0,
--   projectToken TEXT NOT NULL UNIQUE,
--   createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   UNIQUE(userId, moduleId)
-- );

-- CREATE INDEX idx_projects_userId ON projects(userId);
-- CREATE INDEX idx_projects_moduleId ON projects(moduleId);
-- CREATE INDEX idx_projects_projectToken ON projects(projectToken);
-- CREATE INDEX idx_projects_status ON projects(status);

-- submissions table
-- Stores test submission history with full test results
-- CREATE TABLE submissions (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   projectId UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
--   result TEXT NOT NULL,
--   summary TEXT NOT NULL,
--   details JSONB NOT NULL,
--   createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- CREATE INDEX idx_submissions_projectId ON submissions(projectId);
-- CREATE INDEX idx_submissions_createdAt ON submissions(createdAt DESC);

-- Row Level Security (RLS)
-- Note: For MVP with anonymous users, RLS is optional since userId is not authenticated
-- Enable RLS on both tables (optional for MVP)
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own projects (via x-user-id header)
-- CREATE POLICY "Users can view own projects"
--   ON projects FOR SELECT
--   USING (userId = current_setting('request.headers')::json->>'x-user-id');

-- Policy: Users can insert their own projects
-- CREATE POLICY "Users can create own projects"
--   ON projects FOR INSERT
--   WITH CHECK (userId = current_setting('request.headers')::json->>'x-user-id');

-- Policy: Users can update their own projects
-- CREATE POLICY "Users can update own projects"
--   ON projects FOR UPDATE
--   USING (userId = current_setting('request.headers')::json->>'x-user-id');

-- Policy: Anyone with projectToken can insert submissions
-- CREATE POLICY "Project token holders can submit"
--   ON submissions FOR INSERT
--   WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM projects
--       WHERE projects.id = submissions.projectId
--     )
--   );

-- Policy: Users can view submissions for their projects
-- CREATE POLICY "Users can view submissions for own projects"
--   ON submissions FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM projects
--       WHERE projects.id = submissions.projectId
--       AND projects.userId = current_setting('request.headers')::json->>'x-user-id'
--     )
--   );

-- Realtime: Enable replication for tables
-- ALTER PUBLICATION supabase_realtime ADD TABLE projects;
-- ALTER PUBLICATION supabase_realtime ADD TABLE submissions;

-- Function: Auto-update updatedAt timestamp
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.updatedAt = NOW();
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER update_projects_updated_at
--   BEFORE UPDATE ON projects
--   FOR EACH ROW
--   EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing (optional)
-- INSERT INTO projects (userId, moduleId, language, githubRepoUrl, status, progress, projectToken)
-- VALUES 
--   ('test-user-123', 'stack', 'TypeScript', 'https://github.com/org/test-stack-ts', 'in_progress', 60, 'test-token-abc123'),
--   ('test-user-123', 'queue', 'TypeScript', 'https://github.com/org/test-queue-ts', 'not_started', 0, 'test-token-xyz789');

