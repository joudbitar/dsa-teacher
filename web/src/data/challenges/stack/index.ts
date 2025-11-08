import { ChallengeData } from '../types'

export const stack: ChallengeData = {
  id: 'stack',
  title: 'Build a Stack',
  level: 'Beginner',
  summary: 'Implement push, pop, peek, size.',
  description: 'A stack is a fundamental linear data structure that follows the Last-In-First-Out (LIFO) principle. The last element inserted is the first one removed—just like a stack of plates, where you can only add or remove from the top. Stacks are widely used in computer science for managing function calls, parsing expressions, implementing undo/redo operations, and performing backtracking in algorithms. Every push represents a "new context," and every pop returns control to the previous state—mirroring recursion and nested execution.',
  concept: 'A stack supports core operations: push (add to top), pop (remove and return top), peek (view top without removing), size (count elements), and isEmpty (check if empty). Stacks can be implemented in two common ways: (1) Array-based—uses a dynamic array or list with fast access but fixed capacity unless resized, (2) Linked-list—uses nodes with pointers offering flexible size with slightly more memory overhead. The key invariant is that the last element added is always the first one removed. This LIFO property makes stacks perfect for tracking nested structures, undoing operations, parsing expressions, and managing function call execution.',
  benefits: [
    'Understand how function calls are managed in programming languages (the call stack)',
    'Learn to implement backtracking algorithms such as depth-first search',
    'Build the foundation for expression evaluators and syntax parsers',
    'Strengthen your ability to manage memory and handle edge cases (like stack underflow)',
    'Gain intuition for recursive problem-solving and state management',
    'Master the LIFO principle that underpins compilers, undo/redo systems, and expression evaluation'
  ],
  learningOutcome: 'Understand how LIFO structures manage state and recursion. Master the stack operations that enable function call management, expression parsing, backtracking algorithms, and undo/redo systems. Learn to implement both array-based and linked-list stacks, and apply stacks to solve real-world problems like string reversal and expression evaluation.',
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
      focus: 'String Reversal',
      challenge: 'Reverse a string using stack: push all characters, then pop to get reversed order',
      conceptGained: 'LIFO in action - demonstrates how stack reverses order naturally',
      visualization: 'Characters being pushed then popped in reverse order (STACK → KCATS)'
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
