# Plan: Save User Progress in ChallengeDetail

## Problem Statement
Currently, when a user begins a challenge in ChallengeDetail, their progress (language selection, current step, completed steps) is not saved to localStorage. When they leave the page, the progress is lost and "Your Library" doesn't update to show the in-progress challenge.

## Root Cause Analysis

### Current State (ChallengeDetail.tsx)
1. **Uses local state only**: `useState` for `selectedLanguage` and `currentStepIndex`
2. **No persistence**: Progress is not loaded from localStorage on mount
3. **No saving**: Progress is not saved when:
   - Language is selected
   - Step is changed
   - User navigates away
4. **Utility functions exist but unused**: `saveChallengeProgress`, `getChallengeProgress`, `markStepCompleted` are available but not called

### Expected Behavior
- Progress should persist across page navigations
- "Your Library" should show challenges with any progress (>0%)
- Progress should update in real-time when user makes changes

## Implementation Plan

### Phase 1: Load Existing Progress on Mount
**File**: `web/src/pages/ChallengeDetail.tsx`

**Changes**:
1. Import progress utilities:
   ```typescript
   import { getChallengeProgress, saveChallengeProgress, markStepCompleted } from '@/utils/challengeProgress'
   ```

2. Load progress on component mount:
   ```typescript
   useEffect(() => {
     if (!id) return
     const savedProgress = getChallengeProgress(id)
     if (savedProgress) {
       setSelectedLanguage(savedProgress.selectedLanguage)
       setCurrentStepIndex(savedProgress.currentStepIndex || 0)
     }
   }, [id])
   ```

**Why**: Restore user's previous state when they return to the challenge

---

### Phase 2: Save Progress When Language is Selected
**File**: `web/src/pages/ChallengeDetail.tsx`

**Changes**:
1. Update `handleLanguageSelect` to save progress:
   ```typescript
   const handleLanguageSelect = (language: string | undefined) => {
     setSelectedLanguage(language)
     if (language) {
       setCurrentStepIndex(1)
     } else {
       setCurrentStepIndex(0)
     }
     
     // Save progress
     if (id) {
       const currentProgress = getChallengeProgress(id) || {
         completedSteps: [],
         currentStepIndex: language ? 1 : 0,
         selectedLanguage: undefined,
         lastUpdated: Date.now()
       }
       
       saveChallengeProgress(id, {
         ...currentProgress,
         selectedLanguage: language,
         currentStepIndex: language ? 1 : 0,
         lastUpdated: Date.now()
       })
       
       // Mark step 0 (Choose Language) as completed if language selected
       if (language) {
         markStepCompleted(id, 0)
       }
     }
   }
   ```

**Why**: When user selects a language, this is the first step (step 0) and should be saved as progress

---

### Phase 3: Save Progress When Step Changes
**File**: `web/src/pages/ChallengeDetail.tsx`

**Changes**:
1. Update `handleStepClick` to save current step:
   ```typescript
   const handleStepClick = (stepIndex: number) => {
     if (stepIndex === 0 || timelineSteps[stepIndex]?.completed || (stepIndex === 1 && isLanguageSelected)) {
       setCurrentStepIndex(stepIndex)
       
       // Save current step
       if (id) {
         const currentProgress = getChallengeProgress(id) || {
           completedSteps: [],
           currentStepIndex: 0,
           selectedLanguage: undefined,
           lastUpdated: Date.now()
         }
         
         saveChallengeProgress(id, {
           ...currentProgress,
           currentStepIndex: stepIndex,
           lastUpdated: Date.now()
         })
       }
     }
   }
   ```

**Why**: Track which step the user is currently viewing

---

### Phase 4: Save Progress on Component Unmount
**File**: `web/src/pages/ChallengeDetail.tsx`

**Changes**:
1. Add cleanup effect to save progress when leaving:
   ```typescript
   useEffect(() => {
     return () => {
       // Save progress when component unmounts (user navigates away)
       if (id) {
         const currentProgress = getChallengeProgress(id) || {
           completedSteps: [],
           currentStepIndex: 0,
           selectedLanguage: undefined,
           lastUpdated: Date.now()
         }
         
         saveChallengeProgress(id, {
           ...currentProgress,
           selectedLanguage: selectedLanguage,
           currentStepIndex: currentStepIndex,
           lastUpdated: Date.now()
         })
       }
     }
   }, [id, selectedLanguage, currentStepIndex])
   ```

**Why**: Ensure progress is saved even if user navigates away without explicit actions

---

### Phase 5: Mark Steps as Completed (Future Enhancement)
**Note**: This phase depends on how step completion is determined (test results, manual marking, etc.)

**Potential Implementation**:
1. When a step's tests pass (via submission API), call `markStepCompleted(challengeId, stepIndex)`
2. Update `timelineSteps` to check completed steps from saved progress:
   ```typescript
   const savedProgress = getChallengeProgress(id)
   const completedSteps = savedProgress?.completedSteps || []
   
   const timelineSteps = [
     {
       id: `${id}-0`,
       name: 'Choose Language',
       completed: completedSteps.includes(0) || isLanguageSelected
     },
     ...challenge.steps.map((step, index) => ({
       id: `${id}-${index + 1}`,
       name: step.focus,
       completed: completedSteps.includes(index + 1)
     }))
   ]
   ```

**Why**: Show which steps are actually completed, not just which language is selected

---

## Testing Checklist

- [ ] **Test 1**: Select language → Navigate away → Return → Language should still be selected
- [ ] **Test 2**: Select language → Check "Your Library" → Challenge should appear in "In Progress"
- [ ] **Test 3**: Select language → Change step → Navigate away → Return → Should be on same step
- [ ] **Test 4**: Start challenge → Complete step 0 (language) → Progress should be > 0%
- [ ] **Test 5**: Multiple challenges → Each should maintain independent progress
- [ ] **Test 6**: Clear browser data → Progress should be reset (expected behavior)
- [ ] **Test 7**: Progress updates should trigger "Your Library" refresh (via event)

## Implementation Order

1. **Phase 1** (Load on mount) - Foundation
2. **Phase 2** (Save language) - Critical for "Your Library" to show challenges
3. **Phase 3** (Save step) - User experience
4. **Phase 4** (Save on unmount) - Safety net
5. **Phase 5** (Mark completed) - Future enhancement

## Additional Considerations

### Edge Cases
- What if localStorage is full? (Handle gracefully with try-catch)
- What if user has multiple tabs open? (Event system handles this)
- What if challenge data structure changes? (Version the progress data)

### Performance
- Progress saving is synchronous (localStorage) - should be fast
- Consider debouncing if saving on every step change becomes an issue

### User Experience
- Progress should save immediately (no delay)
- "Your Library" should update automatically (via event system)
- No loading states needed (localStorage is instant)

## Success Criteria

✅ User selects language → Progress saved → "Your Library" shows challenge
✅ User navigates away → Returns → Progress restored
✅ User changes step → Progress saved → Returns to same step
✅ Multiple challenges maintain independent progress
✅ "Your Library" updates in real-time when progress changes

