# ChallengeDetail.tsx UI Changes

This document tracks planned UI changes and improvements for the `ChallengeDetail.tsx` component.

## File Location
`web/src/pages/ChallengeDetail.tsx`

## Planned Changes

### Change 1: Remove chips above the project time line heading. THIS IS A GENERAL CHANGE TO ALL DATA STRUCTURES AND ALGORITHMS IN THE CHALLENGE'S.
**Status:** ✅ Completed

**Description:**
- What needs to be changed? - The Language, time, and difficulty are unecessary.
-   
- Why is this change needed?
UNECESSARY
- What will it improve?
    - less noise on screen. 

**Implementation Notes:**
- Technical details: Removed the chips displaying time, difficulty level, and selected language from ChallengeSidebar.tsx (lines 53-74)
- Components affected: `web/src/components/ChallengeSidebar.tsx`
- Dependencies needed: None
- Changes made:
  - Removed the `<div className="flex items-center gap-3 mb-6 flex-wrap">` section containing time, level, and language chips
  - Removed unused `isIntermediate` and `isAdvanced` variables
  - Kept the props in the interface for backward compatibility but they're no longer displayed

**Screenshots/Mockups:**
- [Add screenshots or mockups here]

---

### Change 2: Dynamic Page Headings
**Status:** ✅ Completed

**Description:**
- What needs to be changed?
    - PAge headings: 
    ex: 
    <h1 class="text-4xl font-bold mb-4">Build a Stack</h1>
    instead of build a stack, it should just be called the stack, or it should the what the project timelie is attempting to accomplish (i.e create a class implement push(), etc.)
- Why is this change needed?
    makes each page more unique rather than always saying the challenge name. nstead of build a stack, it should just be called the stack, or it should the what the project timelie is attempting to accomplish (i.e create a class implement push(), etc.)
- What will it improve?

**Implementation Notes:**
- Technical details: Added `getPageTitle()` and `getPageSubheading()` functions in ChallengeInfo.tsx that dynamically generate page titles and subheadings based on the current step
- Components affected: `web/src/components/ChallengeInfo.tsx`
- Dependencies needed: None
- Changes made:
  - Created `getPageTitle()` helper function that:
    - On language selection step (step 0): Shows simplified challenge name (e.g., "Stack" instead of "Build a Stack")
    - On challenge steps: Shows the instruction title (e.g., "Implement enqueue()" instead of "Build a Queue")
    - Falls back to formatted subchallenge name if instruction title is not available
  - Created `getPageSubheading()` helper function that:
    - On language selection step (step 0): Shows challenge summary
    - On challenge steps: Shows the instruction objective (e.g., "Add an element to the rear (end) of the queue")
    - Falls back to challenge summary if instruction objective is not available
  - Updated the h1 tag to use `{getPageTitle()}` instead of `{title}`
  - Updated the subheading paragraph to use `{getPageSubheading()}` instead of `{summary}`
  - The functions remove "Build a " or "Build " prefixes and format instruction titles appropriately

**Screenshots/Mockups:**
- [Add screenshots or mockups here]

---

### Change 3: [Title/Description]
**Status:** ⏳ Planned / 🚧 In Progress / ✅ Completed

**Description:**
- What needs to be changed?
- Why is this change needed?
- What will it improve?

**Implementation Notes:**
- Technical details
- Components affected
- Dependencies needed

**Screenshots/Mockups:**
- [Add screenshots or mockups here]

---

## General UI Improvements

### Areas to Consider:
- [ ] Layout improvements
- [ ] Responsive design enhancements
- [ ] Accessibility improvements
- [ ] Performance optimizations
- [ ] User experience enhancements
- [ ] Visual design updates
- [ ] Animation/transitions
- [ ] Loading states
- [ ] Error handling UI
- [ ] Mobile optimization

## Notes
- Add any additional notes, ideas, or considerations here
- Reference related issues or discussions
- Link to design files or resources

## Implementation Checklist
- [ ] Review current component structure
- [ ] Identify all affected components
- [ ] Test changes in development
- [ ] Verify responsive design
- [ ] Check accessibility
- [ ] Update tests if needed
- [ ] Document changes
- [ ] Deploy and verify

---

## Change Log

### 2024-12-19 - Remove Chips and Dynamic Page Headings
- **Change 1**: Removed time, difficulty level, and language chips from above the Project Timeline heading in ChallengeSidebar
  - Files modified: `web/src/components/ChallengeSidebar.tsx`
  - Impact: Cleaner UI with less visual noise, more focus on the timeline
- **Change 2**: Implemented dynamic page headings and subheadings that change based on current step
  - Files modified: `web/src/components/ChallengeInfo.tsx`
  - Impact: More contextual and unique page titles and subheadings that reflect what the user is currently working on
  - Benefits: Better user experience with clearer context about current task
  - Details:
    - Page headings now show step-specific titles (e.g., "Implement enqueue()" instead of "Build a Queue")
    - Page subheadings now show step-specific objectives (e.g., "Add an element to the rear (end) of the queue")
    - Both headings and subheadings adapt to the current step in the project timeline

---

*Last Updated: 2024-12-19*

