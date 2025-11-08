# Restart Module Feature

## Overview

This feature allows users to restart a module, resetting their progress to 0% and enabling them to create a new repository to start fresh. The feature is accessible from the "Your Library" section on the Challenges page.

## Implementation Details

### Backend Changes

#### 1. New DELETE Endpoint
**File**: `supabase/functions/projects/delete.ts`

- **Route**: `DELETE /projects/:id`
- **Authentication**: JWT token required
- **Authorization**: Only the project owner can delete their project
- **Functionality**:
  - Verifies the project belongs to the authenticated user
  - Deletes the project from the database
  - Submissions are cascade deleted automatically (foreign key constraint)
  - Returns success message

**File**: `supabase/functions/projects/index.ts`
- Added `handleDelete` handler for DELETE requests

### Frontend Changes

#### 1. API Client Update
**File**: `web/src/lib/api.ts`

Added `deleteProject` method:
```typescript
async deleteProject(projectId: string): Promise<{ success: boolean; message: string }>
```

#### 2. UI Implementation
**File**: `web/src/pages/Challenges.tsx`

**New Components**:
- Restart button on each library card with a rotating icon (RotateCcw)
- Confirmation modal with clear warning about what will happen
- Loading state while restart is in progress

**New State**:
- `restartingProjectId`: Tracks which project is being restarted
- `showRestartConfirm`: Controls confirmation modal visibility
- `projectToRestart`: Stores project details for confirmation

**User Flow**:
1. User clicks "Restart" button on a library card
2. Confirmation modal appears explaining the consequences:
   - Progress will be reset to 0%
   - Project will be removed from library
   - User can create a new repository
   - Old repository remains in GitHub
3. User confirms or cancels
4. If confirmed:
   - API call deletes the project
   - Project is removed from UI state
   - User can now start the module again with a fresh repository

### Database Impact

The `UNIQUE(userId, moduleId)` constraint ensures users can only have one project per module. When a project is deleted via restart:
- The unique constraint is removed
- User can create a new project for that module
- Submissions are cascade deleted automatically

### What Happens to the Old Repository?

The old GitHub repository **remains untouched** in the user's GitHub organization. Only the database entry is deleted. This allows users to:
- Keep their old work for reference
- Have a backup of their previous attempts
- Compare old and new implementations

## User Benefits

1. **Fresh Start**: Users can restart if they feel they've gone down the wrong path
2. **Learning**: Allows multiple attempts to solidify understanding
3. **Experimentation**: Users can try different approaches without losing old work
4. **Progress Management**: Clear visibility of which modules they're actively working on

## Technical Considerations

### Security
- Project deletion requires authentication (JWT token)
- Users can only delete their own projects
- Authorization check verifies project ownership

### Data Integrity
- Cascade deletion handles related submissions automatically
- No orphaned data left in the database
- Unique constraint allows fresh project creation

### UX
- Clear confirmation dialog prevents accidental restarts
- Visual feedback during restart process (button shows "Restarting...")
- Immediate UI update after successful restart
- Old repository kept for reference

## Testing Recommendations

1. **Happy Path**:
   - Start a module
   - Make some progress
   - Restart the module
   - Verify project removed from library
   - Create new project for same module
   - Verify new repository created

2. **Error Cases**:
   - Try to restart without authentication (should fail)
   - Try to restart another user's project (should fail)
   - Cancel restart confirmation (should not delete)
   - Network error during restart (should show error message)

3. **Edge Cases**:
   - Restart a completed module
   - Restart a module with 0% progress
   - Restart multiple modules in sequence
   - Restart while project list is loading

## Future Enhancements

Potential improvements for future iterations:

1. **GitHub Repository Deletion Option**: Give users choice to delete old repository
2. **Archive Feature**: Allow users to archive instead of delete
3. **Restart History**: Track how many times a user has restarted each module
4. **Bulk Restart**: Restart multiple modules at once
5. **Toast Notifications**: Better feedback instead of console.log
6. **Undo Feature**: Brief window to undo a restart
7. **Progress Backup**: Automatically backup progress before restart

## Files Modified

### Backend
- `supabase/functions/projects/index.ts` - Added DELETE method handler
- `supabase/functions/projects/delete.ts` - New file with delete logic

### Frontend
- `web/src/lib/api.ts` - Added deleteProject method
- `web/src/pages/Challenges.tsx` - Added restart UI and confirmation modal

## Dependencies

No new dependencies added. Uses existing:
- React state management
- Lucide React icons (RotateCcw, X)
- Existing API client infrastructure
- Existing theme system

