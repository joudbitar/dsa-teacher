import { ChallengeData } from '../types'

export const minHeap: ChallengeData = {
  id: 'min-heap',
  title: 'Build a Min-Heap',
  level: 'Intermediate',
  summary: 'Insert, peekMin, extractMin, heapify.',
  description: 'A heap is a complete binary tree that maintains a specific ordering property. In a min-heap, every parent node is smaller than its children. This structure enables efficient priority queue operations and is the foundation for heap sort and many graph algorithms like Dijkstra\'s shortest path.',
  concept: 'Heaps maintain the heap property: for a min-heap, each parent is smaller than its children. This is achieved through two key operations: heapify-up (when inserting) and heapify-down (when extracting the minimum). The tree is typically stored in an array, where the parent of index i is at (i-1)/2, and children are at 2i+1 and 2i+2.',
  benefits: [
    'Understand priority queues and how operating systems schedule processes',
    'Learn heap sort, an efficient in-place sorting algorithm',
    'Build the foundation for advanced algorithms like Dijkstra\'s and Prim\'s',
    'Develop skills in tree manipulation and array-based tree structures',
    'Gain experience with maintaining invariants in complex data structures'
  ],
  learningOutcome: 'Understand how priority-based retrieval and efficient sorting work.',
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
