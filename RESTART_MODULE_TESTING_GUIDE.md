# Restart Module Feature - Testing Guide

## Prerequisites

1. Backend (Supabase functions) is deployed and running
2. Frontend web app is running
3. User is authenticated
4. User has at least one project in their library

## Manual Testing Steps

### Test 1: Basic Restart Flow

1. **Navigate to Challenges page** (`/challenges`)
2. **Verify UI elements**:
   - Your Library section shows your projects
   - Each project card has a "Restart" button at the bottom right
   - Button has a rotating arrow (RotateCcw) icon

3. **Click "Restart" button** on any project:
   - Confirmation modal should appear
   - Modal shows:
     - "Restart Module?" title
     - Project title in the description
     - List of consequences (4 bullet points)
     - "Cancel" and "Restart Module" buttons
   - "Restart Module" button is red to indicate danger

4. **Click "Cancel"**:
   - Modal should close
   - Project should remain in library
   - No changes made

5. **Click "Restart" again, then "Restart Module"**:
   - Modal should close immediately
   - Button text changes to "Restarting..."
   - Button becomes disabled
   - After API call completes:
     - Project disappears from "Your Library"
     - In Progress count decreases by 1 (or Completed count if it was completed)

6. **Verify backend**:
   - Check Supabase dashboard → Projects table
   - Project should be deleted
   - Associated submissions should be deleted (cascade)

7. **Try creating new project** for the same module:
   - Go to "All Challenges" section
   - Click on the module you just restarted
   - Click "Start Challenge"
   - Should succeed (no unique constraint error)
   - New project appears in "Your Library"

### Test 2: Restart Completed Module

1. Find a completed module in Your Library (green "Completed" badge)
2. Click "Restart"
3. Confirm restart
4. Module should disappear from library
5. You should be able to start fresh

### Test 3: Multiple Restarts

1. Restart a module
2. Immediately try to restart another module
3. Both should work independently
4. No interference between restarts

### Test 4: Cancel During Restart

**Note**: This test is tricky because the restart is fast. If you want to test this:

1. Open browser DevTools → Network tab
2. Set throttling to "Slow 3G" or "Offline" to delay the request
3. Click "Restart" and confirm
4. While "Restarting..." is showing, try to interact with other elements
5. Button should be disabled during operation
6. Other cards should still be clickable

### Test 5: Edge Cases

#### 5.1 Restart with no progress
1. Start a module (create project but don't make progress)
2. Restart it immediately
3. Should work fine

#### 5.2 Network Error
1. Disconnect network
2. Try to restart a module
3. Should see an alert: "Failed to restart module. Please try again."
4. Project should remain in library
5. Reconnect and try again - should work

#### 5.3 Unauthorized Access
1. Open DevTools → Console
2. Run: `localStorage.clear()` (to clear auth token)
3. Try to restart a module
4. Should get 401 Unauthorized error
5. Re-authenticate and try again

### Test 6: Visual and UX

1. **Theme compatibility**:
   - Modal should respect current theme colors
   - Buttons should have proper hover effects
   - Text should be readable against background

2. **Responsive design**:
   - Test on mobile screen size
   - Modal should be scrollable if needed
   - Buttons should be easily tappable

3. **Accessibility**:
   - Tab navigation should work
   - Escape key should close modal
   - Button should have descriptive title attribute

## Expected Results Summary

✅ **Backend**:
- DELETE endpoint responds correctly
- Only authorized users can delete
- Project and submissions are deleted
- Unique constraint allows recreation

✅ **Frontend**:
- Restart button is visible and clickable
- Confirmation modal prevents accidents
- Loading states work correctly
- UI updates immediately after deletion
- Error handling works properly

✅ **User Experience**:
- Clear feedback at every step
- No accidental deletions
- Can restart and start fresh
- Old repository remains in GitHub

## Common Issues and Solutions

### Issue 1: "Failed to delete project"
**Cause**: Backend not deployed or not reachable
**Solution**: Deploy backend functions: `cd supabase/functions && supabase functions deploy projects`

### Issue 2: Project doesn't disappear from UI
**Cause**: State not updating correctly
**Solution**: Check browser console for errors, refresh page to verify backend deletion worked

### Issue 3: Can't create new project after restart
**Cause**: Project wasn't actually deleted (unique constraint violation)
**Solution**: Check Supabase dashboard, manually delete project if needed

### Issue 4: Modal doesn't close
**Cause**: Click handler not working
**Solution**: Check browser console for JavaScript errors

## Automated Testing (Future)

For CI/CD, consider implementing:

1. **Backend Unit Tests**:
   - Test DELETE handler with valid auth
   - Test DELETE handler with invalid auth
   - Test DELETE handler with non-existent project
   - Test cascade deletion of submissions

2. **Frontend Unit Tests**:
   - Test restart button click
   - Test modal open/close
   - Test confirmation flow
   - Test API call and state update

3. **E2E Tests** (Playwright/Cypress):
   - Full restart flow
   - Cancel flow
   - Error handling
   - Multiple restarts

## Performance Considerations

- Restart operation should complete in < 2 seconds on good connection
- Modal should open instantly (< 100ms)
- UI should update immediately after API response
- No unnecessary re-renders or API calls

## Security Checklist

- ✅ Authentication required for DELETE endpoint
- ✅ Authorization check (user owns project)
- ✅ No other user's projects can be deleted
- ✅ No SQL injection vulnerabilities
- ✅ Proper error messages (no sensitive data leaked)

