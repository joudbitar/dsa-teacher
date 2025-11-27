-- Migration: Add testLogs field to submissions table
-- Run this in Supabase SQL Editor

-- Add testLogs JSONB column to submissions table
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS "testLogs" JSONB;

-- Add comment to document the field structure
COMMENT ON COLUMN submissions."testLogs" IS 'Stores test execution logs with structure: { rawOutput: string, formattedLines: Array<{type: string, content: string}> }';

-- Create index for efficient querying of latest submissions with logs
CREATE INDEX IF NOT EXISTS idx_submissions_projectId_createdAt 
ON submissions("projectId", "createdAt" DESC) 
WHERE "testLogs" IS NOT NULL;

