-- Migration: Add currentChallengeIndex column to projects table
-- This column tracks which challenge the user is currently working on

-- Add the column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' 
    AND column_name = 'currentChallengeIndex'
  ) THEN
    ALTER TABLE projects 
    ADD COLUMN "currentChallengeIndex" INTEGER NOT NULL DEFAULT 0;
    
    -- Update existing rows to have a default value (already handled by DEFAULT, but explicit for clarity)
    UPDATE projects 
    SET "currentChallengeIndex" = 0 
    WHERE "currentChallengeIndex" IS NULL;
  END IF;
END $$;

