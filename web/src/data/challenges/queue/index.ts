import { ChallengeData } from '../types'

export const queue: ChallengeData = {
  id: 'queue',
  title: 'Build a Queue',
  level: 'Beginner',
  summary: 'Circular buffer with enqueue/dequeue.',
  description: 'A queue is a fundamental linear data structure that follows the First-In-First-Out (FIFO) principle. The first element inserted is the first one removed—just like a line of people waiting at a ticket counter: the person who arrives first is served first. Queues are widely used in computer science for scheduling tasks, managing resources, and handling asynchronous data like I/O buffers, network packets, and process scheduling. Queues ensure fairness and order: the first element to enter is the first to leave, which is critical in real-world systems where order of arrival matters.',
  concept: 'A queue supports core operations: enqueue (add to rear), dequeue (remove from front), front/peek (view front without removing), size (count elements), and isEmpty (check if empty). Queues can be implemented in several ways: (1) Array-based Queue—uses a fixed-size array with front and rear pointers, requires wrap-around handling (circular queue), (2) Linked-list Queue—uses nodes connected linearly where each node points to the next, offering flexible size and efficient enqueue/dequeue operations, (3) Double-ended Queue (Deque)—supports insertion and removal from both ends. The key challenge is maintaining O(1) operations for both enqueue and dequeue, which requires careful pointer management in a circular array implementation.',
  benefits: [
    'Understand how scheduling systems and resource management work in operating systems',
    'Learn the foundation of algorithms like breadth-first search (BFS)',
    'Manage sequential data in networking and message-passing systems',
    'Gain insight into buffering, throttling, and event-driven architectures',
    'Build intuition for system design where fairness and order of processing matter',
    'Develop skills in managing circular arrays and pointer arithmetic'
  ],
  learningOutcome: 'Understand FIFO data flow, real-world buffering, and how queues drive asynchronous systems. Master queue operations that enable process scheduling, breadth-first search, request management, and event-driven architectures. Learn to implement both array-based and linked-list queues, and apply queues to solve real-world problems like ticket counter simulation and task scheduling.',
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
      conceptGained: 'FIFO vs LIFO - first in, first out principle',
      visualization: 'People queue animation (ticket counter simulation)'
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
