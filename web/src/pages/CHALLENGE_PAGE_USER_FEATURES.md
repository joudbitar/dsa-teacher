# Challenge Page - User Features

## Overview

The Challenges page (`/challenges`) provides users with a comprehensive interface to browse, filter, and select data structure and algorithm challenges. This document outlines all user-facing features and interactions available on this page.

## Page Layout

### Challenge Organization
- **In Progress Section**: Displays challenges with progress > 0% and < 100%
- **All Challenges Section**: Displays challenges with 0% or 100% progress
- Challenges are automatically sorted by type (Data Structures first, then Algorithms), then alphabetically

## User Features

### 1. Your Learning

#### Current Project Display
- **Location**: Top of the challenges page, above challenge sections
- **Purpose**: Shows the user's active learning project and progress
- **Display Elements**:
  - **Challenge Title**: Name of the current challenge being worked on
  - **Progress Meter**: Visual progress indicator showing completion
  - **Task Counter**: Displays completed tasks vs total tasks (e.g., "2/4 tasks")
  - **Progress Calculation**: Based on number of implementation steps/test cases
    - Example: Stack has 4 implementations (push, pop, peek, size) = 4 total tasks
    - Progress shown as "X/4 tasks" where X is number of completed implementations

#### Progress Tracking
- **Task-Based Progress**: Progress is calculated based on completed implementation steps
- **Visual Progress Bar**: Shows percentage completion visually
- **Real-Time Updates**: Updates automatically when user completes tasks
- **Multiple Projects**: If user has multiple in-progress challenges, shows the most recent one

### 2. Challenge Filtering

#### Difficulty Filter
- **Location**: Horizontal filter bar on the right side of section headings
- **Options**:
  - **All**: Shows all difficulty levels
  - **Beginner**: Filters to beginner-level challenges only
  - **Intermediate**: Filters to intermediate-level challenges only
  - **Advanced**: Filters to advanced-level challenges only
- **Visual Feedback**: 
  - Active filter has background color and border
  - Inactive filters are semi-transparent
  - Bold "Difficulty:" label for clarity

#### Type Filter
- **Location**: Horizontal filter bar next to difficulty filter
- **Options**:
  - **All**: Shows both data structures and algorithms
  - **Data Structure**: Filters to data structure challenges only
  - **Algorithm**: Filters to algorithm challenges only
- **Visual Feedback**: 
  - Active filter has background color and border
  - Inactive filters are semi-transparent
  - Bold "Type:" label for clarity

#### Reset Filters
- **Location**: X button appears next to filters when any filter is active
- **Functionality**: Clears both difficulty and type filters, returning to "All"
- **Visual**: Compact X icon button with hover effect

### 2. Challenge Card Interactions

#### Card Header (Always Visible)
- **Icon**: Data structure-specific icon (visual identifier)
- **Title**: Challenge name (e.g., "Build a Stack")
- **Level Badge**: 
  - Beginner: Green badge
  - Intermediate: Yellow/Warning badge
  - Advanced: Red/Destructive badge
- **Chevron Icon**: Indicates expandable/collapsible state
- **Interaction**: Click anywhere on the header to expand/collapse the dropdown

#### Expandable Dropdown
- **Trigger**: Click on challenge card header
- **Content** (when expanded):
  - **Time Estimate**: Estimated completion time (e.g., "30-45 min")
  - **Learning Goals**: Learning outcome description from challenge data
  - **Implement Section**: 
    - Lists all methods/functions to implement
    - Functions displayed in code-style formatting
    - Each function includes a short description
    - Example: `push()` - "Add an element to the top of the stack"
  - **Progress Indicator**: TurtleProgress component (only shown if progress > 0%)
  - **Begin Button**: 
    - Accent green color (#66A056)
    - Full width at bottom of dropdown
    - Includes arrow icon
    - Navigates to challenge detail page

#### Card States
- **Collapsed**: Shows only header (icon, title, level badge, chevron)
- **Expanded**: Shows header + dropdown content
- **Multiple Expansion**: Users can expand multiple challenge cards simultaneously

### 3. Progress Tracking

#### Visual Progress Indicator
- **Component**: TurtleProgress
- **Display**: Only shown in dropdown when progress > 0%
- **Calculation**: `(completedSteps.length / totalSteps) * 100`
- **Updates**: 
  - Automatically refreshes when returning to Challenges page
  - Updates on window focus
  - Listens for 'challenge-progress-updated' custom events

#### Progress-Based Organization
- **In Progress**: Challenges with 1-99% completion appear in separate section
- **Completed**: Challenges with 100% completion appear in "All Challenges"
- **Not Started**: Challenges with 0% progress appear in "All Challenges"

### 4. Challenge Information Display

#### Function Notation
- All implemented functions use code-style formatting with `()` notation
- Examples: `push()`, `pop()`, `insert()`, `search()`
- Functions are styled with:
  - Monospace font (JetBrains Mono)
  - Background color with opacity
  - Border for code-like appearance

#### Function Descriptions
- Each function includes a short description
- Examples:
  - `push()` - "Add an element to the top of the stack"
  - `pop()` - "Remove and return the top element from the stack"
  - `insert()` - "Add a new element to the heap and maintain heap property"

#### Learning Goals
- Displays the learning outcome for each challenge
- Helps users understand what they'll gain from completing the challenge

### 5. Navigation

#### Challenge Selection
- **Method 1**: Click "Begin" button in expanded dropdown
- **Method 2**: Click anywhere on challenge card (navigates to detail page)
- **Route**: `/challenges/:id` (e.g., `/challenges/stack`)

#### Protected Route
- Requires authentication
- Unauthenticated users are redirected to `/login`
- Session persists across page refreshes

### 6. Theme Support

#### Dark Mode Toggle
- **Location**: User dropdown in Navbar
- **Functionality**: 
  - Toggles between light and dark themes
  - Preference saved in localStorage
  - Applies globally to all pages

#### Theme-Aware Colors
- **Background**: Inverts between light (#F0ECDA) and dark (#171512)
- **Text**: Inverts between dark (#171512) and light (#F0ECDA)
- **Borders**: Adapt to current theme
- **Accent Colors**: 
  - Accent Blue (#96BFBD): Unchanged in both modes
  - Accent Green (#66A056): Unchanged in both modes
- **Code Sections**: Background and text adapt to theme

### 7. Responsive Design

#### Layout Adaptations
- **Desktop**: Filters display horizontally on same line as headings
- **Mobile**: Filters wrap to multiple lines if needed
- **Cards**: Full width on mobile, optimized spacing

#### Minimum Height
- Page maintains minimum height to prevent footer from covering content
- Uses `min-h-[calc(100vh-12rem)]` for proper spacing

### 8. Empty States

#### No Matching Challenges
- **Message**: "No challenges match the selected filters."
- **Trigger**: When filter combination results in zero challenges
- **Styling**: Secondary text color, monospace font

## User Workflows

### Workflow 1: Browse and Select Challenge
1. User lands on `/challenges` page
2. Sees "In Progress" section (if any) and "All Challenges" section
3. Clicks on a challenge card header to expand dropdown
4. Reviews challenge details (time, learning goals, functions to implement)
5. Clicks "Begin" button
6. Navigates to challenge detail page

### Workflow 2: Filter by Difficulty
1. User clicks difficulty filter (e.g., "Beginner")
2. Challenge list updates to show only beginner challenges
3. Can combine with type filter for more specific results
4. Clicks reset button (X) to clear filters

### Workflow 3: Filter by Type
1. User clicks type filter (e.g., "Algorithm")
2. Challenge list updates to show only algorithm challenges
3. Challenges sorted: Data Structures first, then Algorithms
4. Can combine with difficulty filter

### Workflow 4: Track Progress
1. User starts a challenge (progress > 0%)
2. Challenge automatically moves to "In Progress" section
3. Progress indicator shows completion percentage
4. When returning to Challenges page, progress updates automatically

### Workflow 5: Toggle Dark Mode
1. User clicks email/account in Navbar
2. Clicks "Dark Mode" toggle in dropdown
3. All page colors invert (except accent colors)
4. Preference saved for future sessions

## Available Challenges

### Data Structures (10 challenges)
1. **Stack** - Beginner, 30-45 min
2. **Queue** - Beginner, 30-45 min
3. **Linked List** - Beginner, 45-60 min
4. **Hash Table** - Intermediate, 60-90 min
5. **Binary Tree** - Intermediate, 60-90 min
6. **Graph** - Advanced, 90-120 min
7. **Trie** - Intermediate, 60-90 min
8. **Binary Search Tree** - Intermediate, 60-90 min
9. **AVL Tree** - Advanced, 90-120 min
10. **Min-Heap** - Intermediate, 45-60 min

### Algorithms (2 challenges)
1. **Binary Search** - Beginner, 20-30 min
2. **Sorting Algorithms** - Beginner, 60-90 min

## Technical Details

### Data Storage
- Progress stored in `localStorage` with key: `dsa-lab-challenge-progress-{challengeId}`
- Format: `{ completedSteps: number[], currentStepIndex: number, selectedLanguage?: string, lastUpdated: number }`

### Event System
- Custom event: `challenge-progress-updated`
- Fired when progress changes in ChallengeDetail page
- ChallengesGrid listens and refreshes progress automatically

### Performance
- Progress calculated on-demand
- Filters applied client-side (fast, no API calls)
- Smooth transitions and hover effects

## Future Enhancements (Potential)

- Search functionality for challenge names
- Sort by progress percentage
- Sort by time estimate
- Favorite/bookmark challenges
- Challenge recommendations based on completed challenges
- Filter by completion status (not started, in progress, completed)
- Bulk actions (e.g., "Mark all as read")

