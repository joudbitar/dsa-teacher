// GET /api/projects
// Returns projects for the authenticated user
//
// Query Parameters:
//   ?moduleId=<id> (optional) - filter by module
//
// Request Headers:
//   Authorization: Bearer <supabase-jwt>
//
// Response: 200 OK
// [
//   {
//     "id": "uuid",
//     "userId": "auth-user-id",
//     "moduleId": "stack",
//     "language": "TypeScript",
//     "githubRepoUrl": "https://github.com/org/user-stack-ts",
//     "status": "in_progress",
//     "progress": 60,
//     "createdAt": "2025-11-06T12:00:00Z",
//     "updatedAt": "2025-11-06T14:30:00Z"
//   }
// ]
//
// Environment Variables:
//   SUPABASE_SERVICE_ROLE - Supabase service role key for DB access
//
// Tables Accessed:
//   projects (read)
//
// TODO (implementation):
// 1. Verify JWT from Authorization header using Supabase client
// 2. Extract userId from JWT
// 3. Query projects table filtered by userId (and optional moduleId)
// 4. Return results as JSON
// 5. Handle auth errors (401) and DB errors (500)

