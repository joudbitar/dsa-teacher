import { ChallengeData } from '../types'

export const stack: ChallengeData = {
  id: 'stack',
  title: 'Build a Stack',
  level: 'Beginner',
  summary: 'Implement push, pop, peek, size.',
  description: 'A stack is a fundamental data structure that follows the Last-In-First-Out (LIFO) principle. Think of it like a stack of plates—you can only add or remove from the top. This simple structure is the foundation for many algorithms and is used in function call management, expression evaluation, and backtracking algorithms.',
  concept: 'A stack supports two primary operations: push (add to top) and pop (remove from top). Internally, you can implement it using an array or linked list. The key invariant is that the last element added is always the first one removed. This property makes stacks perfect for tracking nested structures, undoing operations, and parsing expressions.',
  benefits: [
    'Understand how function calls are managed in programming languages (call stack)',
    'Learn to implement backtracking algorithms like depth-first search',
    'Build a foundation for more complex data structures like expression parsers',
    'Develop skills in managing memory and handling edge cases (empty stack)',
    'Gain intuition for recursive problem-solving patterns'
  ],
  learningOutcome: 'Understand how LIFO structures manage state and recursion, and how this logic underpins compilers, function calls, and undo mechanisms.',
  coreSkills: [
    'Push/Pop discipline',
    'Memory management',
    'Handling edge cases'
  ],
  steps: [
    {
      step: 1,
      focus: 'Stack Basics',
      challenge: 'Build a fixed-size array-based stack with push() and pop()',
      conceptGained: 'Memory growth direction, overflow/underflow',
      visualization: 'Animated "plates stack"'
    },
    {
      step: 2,
      focus: 'Dynamic Stack',
      challenge: 'Implement auto-resizing when full',
      conceptGained: 'Amortized analysis',
      visualization: 'Capacity doubling bar'
    },
    {
      step: 3,
      focus: 'Error Handling',
      challenge: 'Return specific errors for underflow',
      conceptGained: 'Defensive programming',
      visualization: 'Flashing red "empty" slot'
    },
    {
      step: 4,
      focus: 'Advanced Variant',
      challenge: 'Build a MinStack supporting O(1) getMin()',
      conceptGained: 'Auxiliary structures',
      visualization: 'Two synchronized stacks visualized'
    },
    {
      step: 5,
      focus: 'Recursion Trace',
      challenge: 'Reverse a string using stack manually',
      conceptGained: 'Recursion simulation',
      visualization: 'Call stack animation'
    },
    {
      step: 6,
      focus: 'Integration Project',
      challenge: 'Implement "Undo/Redo" for text editor',
      conceptGained: 'Dual stack interaction',
      visualization: 'Time-travel slider UI'
    }
  ],
  subchallenges: ['Choose Language', 'Create class', 'push()', 'pop()', 'peek()', 'size()'],
  time: '30-45 min',
  integrationProject: {
    title: 'Undo/Redo Text Editor',
    description: 'Implement a text editor with undo/redo functionality using dual stacks. Each action (type, delete) is stored in one stack, and undo operations move actions to the redo stack.'
  }
}
