# Progress Saving Plan

## Overview

This document outlines how user progress is tracked and saved in the DSA Lab application. Progress is primarily updated through CLI submissions, not through web app interactions.

## Current Implementation

### Data Flow

1. **CLI Submission** (`dsa submit` command)
   - User completes a challenge step in their local environment
   - Runs `dsa test` to verify the solution
   - Runs `dsa submit` to submit results to the API
   - CLI sends submission to `/submissions` endpoint with:
     - `projectId`: The project UUID
     - `result`: "pass" or "fail"
     - `summary`: Challenge description
     - `details`: Full test results including all test cases and `currentChallengeIndex`
     - `commitSha`: Optional git commit SHA

2. **Backend Processing** (`supabase/functions/submissions/index.ts`)
   - Receives submission via POST `/submissions`
   - Authenticates using `projectToken` from Authorization header
   - Creates a new submission record in `submissions` table
   - Updates the `projects` table with:
     - `currentChallengeIndex`: Incremented if challenge passed
     - `progress`: Recalculated as percentage (0-100)
     - `status`: "in_progress" or "completed"
     - `updatedAt`: Current timestamp

3. **Web App Display** (`web/src/pages/Challenges.tsx`)
   - Fetches user projects from `/projects` API endpoint
   - Polls for updates every 10 seconds to catch CLI submissions
   - Displays projects in "Your Library" section with:
     - Status badges (In Progress/Completed)
     - Progress counters (X/Y tasks)
     - Progress bars showing completion percentage
     - Last updated timestamp

### Database Schema

**projects table:**
- `id`: UUID (primary key)
- `userId`: TEXT (user identifier)
- `moduleId`: TEXT (challenge module ID, e.g., "stack", "queue")
- `language`: TEXT (programming language)
- `status`: TEXT ("not_started" | "in_progress" | "completed")
- `progress`: INTEGER (0-100 percentage)
- `currentChallengeIndex`: INTEGER (0-based index of current challenge)
- `projectToken`: TEXT (unique token for CLI authentication)
- `githubRepoUrl`: TEXT (GitHub repository URL)
- `createdAt`: TIMESTAMP
- `updatedAt`: TIMESTAMP

**submissions table:**
- `id`: UUID (primary key)
- `projectId`: UUID (foreign key to projects)
- `result`: TEXT ("pass" | "fail")
- `summary`: TEXT (submission summary)
- `details`: JSONB (full test results)
- `commitSha`: TEXT (optional git commit SHA)
- `createdAt`: TIMESTAMP

### Progress Calculation

Progress is calculated based on `currentChallengeIndex` and total number of challenges:

```typescript
// Total challenges = length of subchallenges array
const totalChallenges = details.cases.length

// Progress percentage
progress = (currentChallengeIndex / totalChallenges) * 100

// Status determination
if (currentChallengeIndex >= totalChallenges) {
  status = 'completed'
  progress = 100
} else if (currentChallengeIndex > 0) {
  status = 'in_progress'
} else {
  status = 'not_started'
}
```

### Task Counting

For display purposes, we count implementation tasks (excluding setup steps):

- **Excluded from task count:**
  - "Choose Language" (index 0)
  - "Create class" or "Create node" (index 1)

- **Included in task count:**
  - All other subchallenges (index 2+)

- **Completed tasks calculation:**
  ```typescript
  completedTasks = Math.max(0, currentChallengeIndex - 2)
  ```

## Key Points

1. **Progress is CLI-driven**: Progress updates only happen when users submit via CLI, not when interacting with the web app
2. **Real-time updates**: Web app polls every 10 seconds to refresh progress from database
3. **Single source of truth**: Database is the authoritative source for progress; localStorage is not used for progress tracking
4. **Authentication**: Projects are fetched using Supabase auth session (user ID from JWT token)

## Future Enhancements

### Potential Improvements

1. **Real-time Subscriptions**
   - Use Supabase Realtime to subscribe to `projects` table changes
   - Eliminate need for polling
   - Instant updates when CLI submissions occur

2. **Progress Sync**
   - Add ability to sync progress from multiple devices
   - Store progress in database instead of localStorage

3. **Progress History**
   - Track progress over time
   - Show progress graphs/charts
   - Identify learning patterns

4. **Offline Support**
   - Cache progress locally
   - Sync when connection restored

5. **Progress Validation**
   - Verify progress consistency
   - Handle edge cases (e.g., skipped challenges)
   - Recalculate progress if needed

## API Endpoints

### GET /projects
- **Headers**: `x-user-id` (user identifier)
- **Query Params**: `moduleId` (optional filter)
- **Response**: Array of Project objects
- **Auth**: Uses Supabase session user ID

### POST /submissions
- **Headers**: `Authorization: Bearer <projectToken>`
- **Body**: SubmissionRequest with projectId, result, summary, details, commitSha
- **Response**: Submission object with updated project info
- **Auth**: Uses projectToken for authentication

## Testing

To test progress updates:

1. Create a project via web app or API
2. Clone the GitHub repository
3. Complete a challenge step locally
4. Run `dsa submit` in the CLI
5. Check web app "Your Library" section (should update within 10 seconds)

## Troubleshooting

### Progress not updating in web app
- Check browser console for API errors
- Verify user is authenticated
- Check network tab for `/projects` requests
- Verify project exists in database
- Check `currentChallengeIndex` value in database

### Progress calculation incorrect
- Verify `currentChallengeIndex` is being updated correctly
- Check total challenges count matches subchallenges array
- Verify progress percentage calculation in backend

### Authentication issues
- Ensure Supabase environment variables are set
- Verify user session is valid
- Check API endpoint authentication logic
