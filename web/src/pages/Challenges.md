# Challenges Page

## Color Palette

Uses theme colors (supports dark mode):
- Background: Theme-aware (#F0ECDA light / #171512 dark)
- Text: Theme-aware (#171512 light / #F0ECDA dark)
- Accent_blue: #96BFBD (unchanged in both modes)
- Accent_green: #66A056 (unchanged in both modes)

## Data Shape

### Challenge Module Object
```typescript
{
  id: string                    // Unique identifier (e.g., 'stack', 'queue')
  title: string                 // Display name (e.g., 'Build a Stack')
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  summary: string               // Brief description
  subchallenges: string[]       // List of steps/subchallenges
  time: string                  // Estimated time (e.g., '30-45 min')
}
```

### Progress Data (from localStorage)
```typescript
{
  challengeId: string
  completedSteps: string[]      // Array of completed step IDs
  selectedLanguage?: string      // Selected programming language
}
```

## Components Used

- **Navbar**: 
  - Standard navigation with logo, About, Challenges, Docs links
  - User dropdown with dark mode toggle (if authenticated)
  - Auth buttons (if not authenticated)

- **Page Header**:
  - Title: "Data Structures & Algorithms Challenges"
  - Subtitle: "Pick a challenge and start building. Each module comes with tests, starter code, and clear goals."

- **ChallengesGrid**:
  - Grid layout (1 column on mobile, 2 columns on desktop)
  - Displays all available challenge modules
  - Each challenge card shows:
    - **Icon**: Data structure-specific icon (Layers, Search, Minus, Code2)
    - **Title**: Challenge name (e.g., "Build a Stack")
    - **Level Badge**: 
      - Beginner: Green badge
      - Intermediate: Yellow/Warning badge
      - Advanced: Red/Destructive badge
    - **Time Estimate**: Displayed below title
    - **Summary**: Brief description of the challenge
    - **Subchallenges**: First 3 shown as tags, "+X more" if additional
    - **Progress Indicator**: TurtleProgress component showing completion percentage
    - **Hover Effect**: Shows "Start building →" with arrow icon
  - Cards are clickable and navigate to `/challenges/:id`

- **Footer**: Standard footer with links and information

## Features

- **Protected Route**: Requires authentication (redirects to login if not authenticated)
- **Progress Tracking**: 
  - Reads progress from localStorage
  - Updates on page focus/navigation
  - Listens for custom 'challenge-progress-updated' events
- **Theme Support**: Full dark mode support with theme-aware colors
- **Responsive Design**: Grid adapts to screen size (1 col mobile, 2 col desktop)

## Available Challenges

1. **Stack** (Beginner, 30-45 min)
   - Subchallenges: Create class, push(), pop(), peek(), size()

2. **Queue** (Beginner, 30-45 min)
   - Subchallenges: Create class, enqueue(), dequeue(), front(), size()

3. **Binary Search** (Beginner, 20-30 min)
   - Subchallenges: Empty array, Found index, Not found = -1, Bounds

4. **Min-Heap** (Intermediate, 45-60 min)
   - Subchallenges: Insert, Heapify up, Peek, Extract, Heapify down, Size

5. **Linked List** (Beginner, 45-60 min)
   - Subchallenges: Create node, Insert, Delete, Search, Reverse

6. **Hash Table** (Intermediate, 60-90 min)
   - Subchallenges: Hash function, Collision resolution, Get, Set, Delete

7. **Binary Tree** (Intermediate, 60-90 min)
   - Subchallenges: Insert, In-order traversal, Pre-order, Post-order, Search

8. **Graph** (Advanced, 90-120 min)
   - Subchallenges: Adjacency list, Add edge, BFS, DFS, Shortest path

9. **Trie** (Intermediate, 60-90 min)
   - Subchallenges: Insert, Search, Prefix search, Delete, Auto-complete

10. **Binary Search Tree** (Intermediate, 60-90 min)
    - Subchallenges: Insert, Search, Delete, Traversal, Balance

11. **AVL Tree** (Advanced, 90-120 min)
    - Subchallenges: Insert, Rotate, Balance, Delete, Search

12. **Sorting Algorithms** (Beginner, 60-90 min)
    - Subchallenges: Bubble sort, Merge sort, Quick sort, Heap sort, Analysis

## Route

`/challenges`

**Note**: This route is protected and requires authentication. Unauthenticated users are redirected to `/login`.

## Font

JetBrains Mono (monospace font family)

## User Flow

1. User navigates to `/challenges` (must be authenticated)
2. Page displays grid of all available challenges
3. Each challenge card shows:
   - Basic info (title, level, time, summary)
   - Progress indicator (if started)
   - Subchallenges preview
4. User clicks on a challenge card
5. Navigates to `/challenges/:id` (ChallengeDetail page)

## Progress Tracking

- Progress is stored in localStorage per challenge
- Progress updates when:
  - User completes a step in ChallengeDetail page
  - User switches back to Challenges page
  - Custom 'challenge-progress-updated' event is fired
- Progress percentage calculated as: `(completedSteps.length / totalSteps) * 100`
- Total steps = challenge steps + 1 (for "Choose Language" step)

