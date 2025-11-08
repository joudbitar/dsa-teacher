import { ChallengeData } from '../types'

export const linkedList: ChallengeData = {
  id: 'linked-list',
  title: 'Build a Linked List',
  level: 'Beginner',
  summary: 'Implement insertion, deletion, and traversal.',
  description: 'A linked list is a linear data structure where elements are stored in nodes, and each node points to the next node. Unlike arrays, linked lists don\'t require contiguous memory, making insertion and deletion operations more flexible. Understanding linked lists is crucial for understanding more complex structures.',
  concept: 'Linked lists consist of nodes containing data and a pointer to the next node. The main operations are insertion, deletion, and traversal. The key advantage over arrays is O(1) insertion/deletion at any position (once you have a pointer to it), but the tradeoff is O(n) random access. You can implement singly-linked, doubly-linked, or circular variants.',
  benefits: [
    'Understand how dynamic memory allocation works in low-level languages',
    'Learn the foundation for more complex structures (trees, graphs)',
    'Build intuition for pointer manipulation and memory management',
    'Develop skills in handling edge cases (empty list, single node)',
    'Gain experience with recursive and iterative traversal patterns'
  ],
  learningOutcome: 'Internalize how pointers connect data, building intuition for memory references, allocation, and iteration.',
  coreSkills: [
    'Pointer management',
    'Recursion understanding',
    'Dynamic memory tracing'
  ],
  steps: [
    {
      step: 1,
      focus: 'Node Creation',
      challenge: 'Create nodes manually and link them',
      conceptGained: 'Address references',
      visualization: 'Pointer arrows'
    },
    {
      step: 2,
      focus: 'Traversal',
      challenge: 'Iterate through list and print elements',
      conceptGained: 'Iterators',
      visualization: 'Highlight moving pointer'
    },
    {
      step: 3,
      focus: 'Insert/Delete',
      challenge: 'Add/remove at head, tail, and index',
      conceptGained: 'Memory manipulation',
      visualization: 'Smooth insert animation'
    },
    {
      step: 4,
      focus: 'Reverse List',
      challenge: 'Reverse list iteratively, then recursively',
      conceptGained: 'Recursion mechanics',
      visualization: 'Arrows flipping direction'
    },
    {
      step: 5,
      focus: 'Cycle Detection',
      challenge: 'Implement Floyd\'s cycle algorithm',
      conceptGained: 'Two-pointer logic',
      visualization: 'Two cursors moving at speeds'
    },
    {
      step: 6,
      focus: 'Integration Project',
      challenge: '"Playlist System" (next/previous navigation)',
      conceptGained: 'Real-world app mapping',
      visualization: 'Song playback queue animation'
    }
  ],
  subchallenges: ['Choose Language', 'Create node', 'Insert', 'Delete', 'Search', 'Reverse'],
  time: '45-60 min',
  integrationProject: {
    title: 'Playlist System',
    description: 'Build a music playlist system with next/previous navigation, add/remove songs, and playlist management using a doubly-linked list structure.'
  }
}
