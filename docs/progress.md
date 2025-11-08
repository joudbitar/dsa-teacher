# Progress Calculation

## Formula

Progress is calculated as:

```
progress = (passed_count / total_count) * 100
```

Rounded to the nearest integer.

### Example: Stack Module (5 sub-challenges)

```json
{
  "cases": [
    { "subchallengeId": "create-class", "passed": true },
    { "subchallengeId": "push", "passed": true },
    { "subchallengeId": "pop", "passed": false },
    { "subchallengeId": "peek", "passed": false },
    { "subchallengeId": "size", "passed": true }
  ]
}
```

**Calculation:**
- Passed: 3
- Total: 5
- Progress: `(3 / 5) * 100 = 60%`

### Example: Binary Search Module (4 sub-challenges)

All passed:
```
(4 / 4) * 100 = 100%
```

None passed:
```
(0 / 4) * 100 = 0%
```

## Project Status

The `projects.status` field has three possible values:

### `not_started`

- **When:** Project created but no submissions yet
- **Progress:** 0%

### `in_progress`

- **When:** At least one submission received, but not all tests passing
- **Progress:** 1% - 99%

### `passed`

- **When:** All sub-challenges have `passed: true`
- **Progress:** 100%

### Status Transitions

```
not_started (0%)
    ↓ (first submission)
in_progress (1-99%)
    ↓ (all tests pass)
passed (100%)
```

**Note:** Status never goes backward (no `passed` → `in_progress`). Once passed, always passed.

## Data Storage

### Source of Truth: `submissions.details`

The submission table stores the full report:

```sql
submissions.details = {
  "moduleId": "stack",
  "summary": "3/5 tests passed",
  "pass": false,
  "cases": [...]
}
```

### Cached in `projects` Table (Optional)

For performance, cache the latest values:

```sql
projects.progress = 60        -- integer (0-100)
projects.status = 'in_progress'
```

### Why Cache?

- Faster queries for dashboard (avoid JOIN + JSON parsing)
- Simplified real-time updates
- Easy filtering (e.g., "show all projects > 50% progress")

**Trade-off:** Redundant data, but acceptable for MVP.

## Update Logic

When `POST /api/submissions` is received:

1. **Insert submission row** with full `details` JSON
2. **Calculate progress** from `details.cases`
3. **Determine status** based on progress
4. **Update projects table:**
   ```sql
   UPDATE projects
   SET progress = <calculated>,
       status = <determined>,
       updatedAt = NOW()
   WHERE id = <projectId>
   ```

### Pseudocode

```typescript
function calculateProgress(cases: TestCase[]): number {
  const passedCount = cases.filter(c => c.passed).length;
  const totalCount = cases.length;
  return Math.round((passedCount / totalCount) * 100);
}

function determineStatus(progress: number, currentStatus: string): string {
  if (progress === 100) return 'passed';
  if (progress > 0) return 'in_progress';
  return currentStatus; // Keep 'not_started' if 0%
}

// On submission
const progress = calculateProgress(details.cases);
const status = determineStatus(progress, project.status);

await db.query(`
  UPDATE projects 
  SET progress = $1, status = $2, updatedAt = NOW()
  WHERE id = $3
`, [progress, status, projectId]);
```

## Edge Cases

### Submission with 0 Total Cases

**Scenario:** Malformed report with empty `cases: []`

**Handling:** Reject submission with `400 Bad Request`

### Re-submission After Passing

**Scenario:** User submits again after reaching 100%

**Handling:** Accept submission, but status remains `passed` (even if new submission fails)

**Rationale:** Prevents accidental regression in dashboard UI.

### Multiple Submissions Per Day

**Scenario:** User submits 10 times in an hour

**Handling:** All submissions stored; only latest affects progress

**Future:** Rate limiting (e.g., 1 submission per minute)

## Display on Dashboard

### Project Card

```
┌─────────────────────────────┐
│ Build a Stack               │
│ TypeScript                  │
│ ████████░░ 80%              │ ← Progress bar
│ Status: In Progress         │
└─────────────────────────────┘
```

### Challenge Detail Page

```
Sub-Challenges:
✅ Create class
✅ push()
❌ pop()
❌ peek()
✅ size()

Overall Progress: 60%
Status: In Progress
```

### Sub-Challenge Completion

Derived from latest submission's `details.cases`:

```typescript
const latestSubmission = await getLatestSubmission(projectId);
const completedMap = {};
latestSubmission.details.cases.forEach(c => {
  completedMap[c.subchallengeId] = c.passed;
});
```

## Performance Considerations

### For MVP

- ✅ Store progress in `projects` table (cached)
- ✅ Query latest submission for sub-challenge details
- ✅ No complex aggregations needed

### For Scale (Future)

- 🔄 Index `projects.status` and `projects.progress`
- 🔄 Materialized view for leaderboard
- 🔄 Cache submission details in Redis

## Summary

Progress is a simple percentage based on passed tests. Status reflects overall completion state. Caching in the `projects` table keeps queries fast while `submissions.details` preserves full history.

