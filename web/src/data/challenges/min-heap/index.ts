import { ChallengeData } from '../types'

export const minHeap: ChallengeData = {
  id: 'min-heap',
  title: 'Build a Min-Heap',
  level: 'Intermediate',
  summary: 'Insert, peekMin, extractMin, heapify.',
  description: 'A Min Heap is a special type of binary tree-based data structure that maintains a specific ordering property: the value of each node is less than or equal to the values of its children. This property ensures that the minimum element is always at the root of the tree. Heaps are essential for implementing efficient priority queues, sorting algorithms (like Heap Sort), and graph algorithms such as Dijkstra\'s shortest path. The Min Heap maintains a complete binary tree structure—all levels are fully filled except possibly the last, which is filled from left to right.',
  concept: 'A Min Heap supports fundamental operations: insert(x) to add a new element while maintaining the heap property, extractMin() to remove and return the smallest element (the root), peekMin() to return the smallest element without removing it, size() to return the total number of elements, and isEmpty() to check whether the heap is empty. To maintain the heap property, we use two key helper operations: heapifyUp (bubble up) to restore order after insertion, and heapifyDown (bubble down) to restore order after removal of the root. Min Heaps are commonly implemented using arrays instead of explicit tree nodes because a complete binary tree can be efficiently represented in a zero-indexed array: for a node at index i, left child is at 2*i + 1, right child is at 2*i + 2, and parent is at (i - 1) // 2. When inserting, the element is added at the end (bottom rightmost position) and "bubbles up" until the heap property is restored. When extracting the minimum, the root (minimum) is removed, the last element moves to the root, and the element "bubbles down" to maintain order.',
  benefits: [
    'Understand how priority-based systems are built',
    'Learn how to efficiently manage dynamically changing datasets',
    'Build the foundation for graph algorithms like Dijkstra and Prim',
    'Strengthen understanding of tree-based structures implemented in arrays',
    'Improve algorithmic thinking related to order maintenance and optimization',
    'Master priority queues, task scheduling, and CPU job management'
  ],
  learningOutcome: 'Master Min Heaps and understand how priority-based systems are built. Learn to efficiently manage dynamically changing datasets and build the foundation for graph algorithms like Dijkstra and Prim. Strengthen understanding of tree-based structures implemented in arrays and improve algorithmic thinking related to order maintenance and optimization. Gain practical experience with priority queues, heap sort, and real-time event simulation systems.',
  coreSkills: [
    'Index math',
    'Property maintenance',
    'Efficient sorting'
  ],
  steps: [
    {
      step: 1,
      focus: 'Heapify',
      challenge: 'Build heap from array',
      conceptGained: 'Bottom-up logic',
      visualization: 'Tree flattening'
    },
    {
      step: 2,
      focus: 'Insert',
      challenge: 'Maintain heap property',
      conceptGained: 'Structural recursion',
      visualization: 'Bubbles up node'
    },
    {
      step: 3,
      focus: 'Extract-Min',
      challenge: 'Remove smallest',
      conceptGained: 'Swapping strategy',
      visualization: 'Bubble-down animation'
    },
    {
      step: 4,
      focus: 'Heap Sort',
      challenge: 'Sort via repeated extract',
      conceptGained: 'Sorting mechanism',
      visualization: 'Bars reorganizing'
    },
    {
      step: 5,
      focus: 'Compare Heaps',
      challenge: 'Max vs Min heap',
      conceptGained: 'Contrast learning',
      visualization: 'Color-coded swap'
    },
    {
      step: 6,
      focus: 'Integration Project',
      challenge: '"To-Do Prioritizer"',
      conceptGained: 'Task management',
      visualization: 'Animated list reordering'
    }
  ],
  subchallenges: ['Choose Language', 'Insert', 'Heapify up', 'Peek', 'Extract', 'Heapify down', 'Size'],
  time: '45-60 min',
  integrationProject: {
    title: 'To-Do Prioritizer',
    description: 'Build a task management system where tasks are stored in a priority queue (min-heap). Users can add tasks with priorities, and the system always serves the highest priority task first.'
  }
}
