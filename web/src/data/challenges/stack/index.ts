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
      visualization: 'Capacity doubling bar',
      content: `### Continuing From Your Existing Repository

You will keep working in the same repository you used for Step 1. Your goal now is to extend your current stack so that it can grow automatically when it runs out of space. This means your stack should look and behave the same from the outside, but internally it should handle memory growth without throwing an error.

---

### Step 1: Open Your Existing Project

Locate the folder you used for Step 1 — this is your personal GitHub repository for the Stack challenge. If you've already cloned it locally, open it again in your code editor or IDE.

Inside that project, find the file where you implemented your stack logic. You will be adding the dynamic resizing behavior there.

---

### Step 2: Understand What You're Changing

Right now, your stack probably has an internal array or list that holds a fixed number of elements. When it fills up, any new push operation fails or throws an error. Your task is to make it resize itself automatically.

The main idea:

- Detect when the stack is full before performing a push.
- Allocate a new storage array (typically double the current capacity).
- Copy all elements from the old array to the new one in the same order.
- Replace the old reference with the new, larger one.
- Continue pushing the new value.

The public interface — push, pop, peek, size, and isEmpty — must remain the same. Only the internal logic changes.

---

### Step 3: Language-Specific Guidance

#### If You're Using Java

Open the file that defines your Stack class, typically named \`Stack.java\`. Inside, you likely have an array field such as \`int[] data\` or \`T[] items\` and an integer \`top\` or \`size\` variable.

Inside the push method:

- Before inserting a new element, check if \`top\` is equal to the length of your array.
- If so, create a new array that's twice the size (\`newCapacity = oldCapacity * 2\`).
- Use a loop to copy each element from the old array into the new one in order.
- Assign your stack's internal array reference to the new array.
- Then add the new element as normal.

This simulates the same dynamic resizing mechanism used by Java's \`ArrayList\`.

#### If You're Using JavaScript

Open your stack implementation file, for example \`stack.js\`. You may have implemented your stack using a normal JavaScript array. For this step, pretend that your array has a fixed capacity property, such as \`this.capacity\`.

In your push method:

- Check if the current number of items equals the capacity.
- If it does, create a new array of double the capacity (\`newCapacity = this.capacity * 2\`).
- Copy your existing items into the new array (you can use a simple for loop or \`Array.prototype.slice\`).
- Reassign \`this.items\` (or whatever you named your internal array) to this new one and update \`this.capacity\`.
- Add the new value.

This gives you practice simulating how resizing arrays work internally, even though JavaScript handles this for you automatically.

#### If You're Using Python

Open the file \`stack.py\` or whichever file contains your Stack class. In Python, lists are dynamic by default, so for this challenge you must simulate a fixed-size structure manually.

Inside your push method:

- Track the current capacity in a variable such as \`self.capacity\`.
- If \`len(self.data)\` equals \`self.capacity\`, create a new list of twice that capacity.
- Copy the old elements into the new list using a for loop or list comprehension.
- Assign \`self.data\` to the new list, and update \`self.capacity\`.
- Finally, append the new element.

This approach mimics how low-level data structures manage resizing in languages that don't have automatic list growth.

---

### Step 4: Test Your Implementation

After saving your changes, use your terminal to run the same test command you used in Step 1. You do this inside your project folder. The system will now run a new test suite that checks for dynamic stack behavior.

These tests will confirm that:

- You can push more items than your initial capacity without errors.
- No items are lost or reordered after resizing.
- The stack's size and top value remain correct after multiple resizes.

If any tests fail, read the messages carefully, update your logic, and test again until everything passes.

---

### Step 5: Submit Your Solution

Once all tests pass, submit your results from the same project folder. Your submission will be recorded automatically, and the Dynamic Stack step will be marked complete on your dashboard.

---

### Summary

You are building directly on top of your earlier work. Your stack should now manage its own memory, adjusting as you push more data. This simple change introduces you to one of the most common performance patterns in software development — automatic dynamic resizing, used by almost every data structure library in the world.`
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
