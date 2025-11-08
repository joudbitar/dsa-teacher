// POST /api/submissions
// Records a test submission and updates project progress
//
// Request Headers:
//   Authorization: Bearer <supabase-jwt> or X-API-Key: <project-api-key>
//   Content-Type: application/json
//
// Request Body:
// {
//   "projectId": "uuid",
//   "result": "pass",
//   "summary": "5 tests passed, 0 failed",
//   "details": {
//     "total": 5,
//     "passed": 5,
//     "failed": 0
//   },
//   "commitSha": "abc123"
// }
//
// Response: 201 Created
// {
//   "id": "uuid",
//   "createdAt": "2025-11-06T15:00:00Z",
//   "projectUpdated": true
// }
//
// Environment Variables:
//   SUPABASE_SERVICE_ROLE - Supabase service role key
//
// Tables Accessed:
//   submissions (insert)
//   projects (update: status, progress, updatedAt)
//
// TODO (implementation):
// 1. Verify authentication (JWT or API key)
// 2. Validate request body (projectId, result, summary)
// 3. Verify projectId exists and user has access
// 4. Insert submission row into submissions table
// 5. Calculate progress based on sub-challenge completion in details
// 6. Update projects table:
//    - progress: calculated percentage
//    - status: "completed" if 100%, else "in_progress" or "failed"
//    - updatedAt: current timestamp
// 7. Trigger Supabase Realtime notification (automatic via DB trigger)
// 8. Return confirmation
// 9. Handle errors: invalid projectId, DB errors, auth errors

