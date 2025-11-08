-- Cleanup broken projects (those without GitHub repos)
-- Run this in Supabase SQL Editor to clean up failed project creation attempts

-- View broken projects first
SELECT 
  id,
  "userId",
  "moduleId",
  language,
  "githubRepoUrl",
  "createdAt"
FROM projects
WHERE "githubRepoUrl" IS NULL
ORDER BY "createdAt" DESC;

-- Uncomment the line below to delete all broken projects
-- DELETE FROM projects WHERE "githubRepoUrl" IS NULL;

-- Or delete for a specific user and module:
-- DELETE FROM projects 
-- WHERE "userId" = 'USER_ID_HERE' 
--   AND "moduleId" = 'MODULE_ID_HERE';

