import { ChallengeData } from '../types'

export const queue: ChallengeData = {
  id: 'queue',
  title: 'Build a Queue',
  level: 'Beginner',
  summary: 'Circular buffer with enqueue/dequeue.',
  description: 'A queue is a linear data structure that follows the First-In-First-Out (FIFO) principle. Imagine a line at a coffee shop—the first person in line is the first to be served. Queues are essential for task scheduling, breadth-first search, and any scenario where you need to process items in order.',
  concept: 'Queues support enqueue (add to rear) and dequeue (remove from front) operations. You can implement them using arrays (with circular buffering for efficiency) or linked lists. The key challenge is maintaining O(1) operations for both enqueue and dequeue, which requires careful pointer management in a circular array implementation.',
  benefits: [
    'Learn how operating systems schedule tasks and manage process queues',
    'Understand breadth-first search algorithms used in graph traversal',
    'Build systems that need to process requests in order (message queues)',
    'Develop skills in managing circular arrays and pointer arithmetic',
    'Gain experience with producer-consumer patterns'
  ],
  learningOutcome: 'Understand FIFO data flow, real-world buffering, and how queues drive asynchronous systems (printers, network packets).',
  coreSkills: [
    'FIFO concept',
    'Queue-pointer management',
    'Combining multiple data structures'
  ],
  steps: [
    {
      step: 1,
      focus: 'Basic Queue',
      challenge: 'Build enqueue/dequeue using array',
      conceptGained: 'FIFO vs LIFO',
      visualization: 'People queue animation'
    },
    {
      step: 2,
      focus: 'Circular Queue',
      challenge: 'Reuse space efficiently using modular arithmetic',
      conceptGained: 'Pointers & wrap-around logic',
      visualization: 'Rotating wheel animation'
    },
    {
      step: 3,
      focus: 'Queue from Two Stacks',
      challenge: 'Simulate queue using two stacks',
      conceptGained: 'Structure composition',
      visualization: 'Animated flipping arrows'
    },
    {
      step: 4,
      focus: 'Double-Ended Queue (Deque)',
      challenge: 'Support insert/remove both ends',
      conceptGained: 'Flexibility',
      visualization: 'Split-bar visual'
    },
    {
      step: 5,
      focus: 'Priority Queue (Intro)',
      challenge: 'Serve based on priority (manual sort)',
      conceptGained: 'Precursor to heaps',
      visualization: 'Job queue dashboard'
    },
    {
      step: 6,
      focus: 'Integration Project',
      challenge: '"Printer Scheduler" simulation',
      conceptGained: 'Real-world concurrency',
      visualization: 'Task pipeline animation'
    }
  ],
  subchallenges: ['Choose Language', 'Create class', 'enqueue()', 'dequeue()', 'front()', 'size()'],
  time: '30-45 min',
  integrationProject: {
    title: 'Printer Scheduler',
    description: 'Simulate a printer queue system that processes print jobs in order. Handle priority jobs, queue management, and realistic printing delays.'
  }
}
