-- Drop existing tables if they exist
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create projects table with correct schema
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" TEXT NOT NULL,
  "moduleId" TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'TypeScript',
  "githubRepoUrl" TEXT,
  status TEXT NOT NULL DEFAULT 'in_progress',
  progress INTEGER NOT NULL DEFAULT 0,
  "currentChallengeIndex" INTEGER NOT NULL DEFAULT 0,
  "projectToken" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE("userId", "moduleId")
);

-- Create indexes for projects
CREATE INDEX idx_projects_userId ON projects("userId");
CREATE INDEX idx_projects_moduleId ON projects("moduleId");
CREATE INDEX idx_projects_projectToken ON projects("projectToken");
CREATE INDEX idx_projects_status ON projects(status);

-- Create submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "projectId" UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  result TEXT NOT NULL,
  summary TEXT NOT NULL,
  details JSONB NOT NULL,
  "commitSha" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for submissions
CREATE INDEX idx_submissions_projectId ON submissions("projectId");
CREATE INDEX idx_submissions_createdAt ON submissions("createdAt" DESC);

-- Function: Auto-update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updatedAt
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

