/**
 * Detailed coding instructions for each subchallenge
 * Maps moduleId -> subchallenge name -> specific instructions
 */

export interface SubchallengeInstruction {
  title: string
  objective: string
  methodSignature: Record<string, string> // language -> signature
  requirements: string[]
  examples: {
    input: string
    output: string
    explanation: string
  }[]
  hints: string[]
  edgeCases: string[]
}

export const subchallengeInstructions: Record<string, Record<string, SubchallengeInstruction>> = {
  'min-heap': {
    'Insert': {
      title: 'Implement insert() Method',
      objective: 'Add a new element to the heap while maintaining the min-heap property',
      methodSignature: {
        python: 'def insert(self, value: int) -> None:',
        typescript: 'insert(value: number): void',
        javascript: 'insert(value)',
        java: 'public void insert(int value)',
        go: 'func (h *MinHeap) Insert(value int)',
        'c++': 'void insert(int value)'
      },
      requirements: [
        'Add the new value at the end of the internal array/list',
        'Call heapify_up() to restore the min-heap property',
        'The smallest element should always be at index 0',
        'Time complexity must be O(log n)'
      ],
      examples: [
        {
          input: 'heap.insert(5)\nheap.insert(3)\nheap.insert(7)',
          output: 'heap internal: [3, 5, 7]',
          explanation: 'After inserting 5, 3, 7 - the 3 bubbles to the top as it\'s the smallest'
        },
        {
          input: 'heap.insert(10)\nheap.insert(1)',
          output: 'heap.peek() returns 1',
          explanation: 'The minimum element (1) is always accessible at the root'
        }
      ],
      hints: [
        'Start by appending the value to your array',
        'Then compare it with its parent: parent index = (i - 1) // 2',
        'Keep swapping with parent while current < parent',
        'Stop when you reach the root or heap property is satisfied'
      ],
      edgeCases: [
        'Inserting into an empty heap',
        'Inserting a value smaller than all existing elements',
        'Inserting a value larger than all existing elements',
        'Inserting duplicate values'
      ]
    },
    'Heapify up': {
      title: 'Implement heapify_up() Helper Method',
      objective: 'Move an element up the tree to maintain the min-heap property after insertion',
      methodSignature: {
        python: 'def _heapify_up(self, index: int) -> None:',
        typescript: 'private heapifyUp(index: number): void',
        javascript: 'heapifyUp(index)',
        java: 'private void heapifyUp(int index)',
        go: 'func (h *MinHeap) heapifyUp(index int)',
        'c++': 'void heapifyUp(int index)'
      },
      requirements: [
        'Compare element at index with its parent',
        'If current element < parent, swap them',
        'Repeat until reaching root or heap property is satisfied',
        'Parent of index i is at (i-1)/2'
      ],
      examples: [
        {
          input: 'Array: [5, 10, 15, 20]\nInsert 3 at end → [5, 10, 15, 20, 3]\nCall heapifyUp(4)',
          output: '[3, 5, 15, 20, 10]',
          explanation: '3 bubbles up: swap with 10, then swap with 5, stops at root'
        }
      ],
      hints: [
        'Use a while loop that continues while index > 0',
        'Calculate parent index: parent = (index - 1) // 2',
        'Compare heap[index] with heap[parent]',
        'Swap if current is smaller, then update index = parent'
      ],
      edgeCases: [
        'Element is already at the root (index 0)',
        'Element doesn\'t need to move (already larger than parent)',
        'Element needs to bubble all the way to the root'
      ]
    },
    'Peek': {
      title: 'Implement peek() Method',
      objective: 'Return the minimum element without removing it from the heap',
      methodSignature: {
        python: 'def peek(self) -> int | None:',
        typescript: 'peek(): number | null',
        javascript: 'peek()',
        java: 'public Integer peek()',
        go: 'func (h *MinHeap) Peek() (int, error)',
        'c++': 'int peek()'
      },
      requirements: [
        'Return the element at index 0 (the root)',
        'Do NOT remove the element',
        'Return None/null if heap is empty',
        'Time complexity must be O(1)'
      ],
      examples: [
        {
          input: 'heap with elements [1, 5, 3, 7]\nheap.peek()',
          output: '1',
          explanation: 'Returns the minimum element without modifying the heap'
        },
        {
          input: 'empty heap\nheap.peek()',
          output: 'None (or null)',
          explanation: 'Returns None/null when heap is empty'
        }
      ],
      hints: [
        'The minimum element is always at index 0',
        'Just return heap[0] if heap is not empty',
        'Check if heap is empty first to avoid index errors'
      ],
      edgeCases: [
        'Peeking an empty heap (should return None/null)',
        'Peeking a heap with one element',
        'Multiple peeks should return the same value'
      ]
    },
    'Extract': {
      title: 'Implement extract_min() Method',
      objective: 'Remove and return the minimum element from the heap',
      methodSignature: {
        python: 'def extract_min(self) -> int | None:',
        typescript: 'extractMin(): number | null',
        javascript: 'extractMin()',
        java: 'public Integer extractMin()',
        go: 'func (h *MinHeap) ExtractMin() (int, error)',
        'c++': 'int extractMin()'
      },
      requirements: [
        'Store the root element (minimum) to return later',
        'Replace root with the last element in the heap',
        'Remove the last element',
        'Call heapify_down(0) to restore heap property',
        'Return the original root value',
        'Handle empty heap case'
      ],
      examples: [
        {
          input: 'heap: [1, 5, 3, 7, 10]\nheap.extract_min()',
          output: 'Returns: 1\nHeap becomes: [3, 5, 10, 7]',
          explanation: 'Removes 1, replaces with 10, heapifies down to restore property'
        },
        {
          input: 'heap: [5]\nheap.extract_min()',
          output: 'Returns: 5\nHeap becomes: []',
          explanation: 'Removing the only element results in an empty heap'
        }
      ],
      hints: [
        'Save heap[0] in a variable before modifying',
        'Move the last element (heap[-1]) to the root position',
        'Remove the last element from the array',
        'Call heapify_down(0) to fix the heap',
        'Return the saved minimum value'
      ],
      edgeCases: [
        'Extracting from empty heap (return None/null)',
        'Extracting from heap with one element',
        'Extracting from heap with two elements'
      ]
    },
    'Heapify down': {
      title: 'Implement heapify_down() Helper Method',
      objective: 'Move an element down the tree to maintain the min-heap property after extraction',
      methodSignature: {
        python: 'def _heapify_down(self, index: int) -> None:',
        typescript: 'private heapifyDown(index: number): void',
        javascript: 'heapifyDown(index)',
        java: 'private void heapifyDown(int index)',
        go: 'func (h *MinHeap) heapifyDown(index int)',
        'c++': 'void heapifyDown(int index)'
      },
      requirements: [
        'Compare element with both children',
        'Find the smallest among parent and children',
        'Swap with the smallest child if needed',
        'Repeat until leaf node or heap property is satisfied',
        'Left child index: 2*i + 1, Right child: 2*i + 2'
      ],
      examples: [
        {
          input: 'Array: [10, 5, 3, 7] (10 is out of place at root)\nCall heapifyDown(0)',
          output: '[3, 5, 10, 7]',
          explanation: '10 swaps with 3 (smallest child), heap property restored'
        }
      ],
      hints: [
        'Use a loop that continues while element has children',
        'Calculate left = 2*index + 1, right = 2*index + 2',
        'Find smallest among current, left child, right child',
        'If current is smallest, stop',
        'Otherwise, swap with smallest child and continue from that position'
      ],
      edgeCases: [
        'Node has no children (leaf node)',
        'Node has only left child',
        'Node has both children',
        'Element doesn\'t need to move down'
      ]
    },
    'Size': {
      title: 'Implement size() Method',
      objective: 'Return the number of elements currently in the heap',
      methodSignature: {
        python: 'def size(self) -> int:',
        typescript: 'size(): number',
        javascript: 'size()',
        java: 'public int size()',
        go: 'func (h *MinHeap) Size() int',
        'c++': 'int size()'
      },
      requirements: [
        'Return the length/size of the internal array',
        'Time complexity must be O(1)',
        'Should work correctly even after insertions and extractions'
      ],
      examples: [
        {
          input: 'Empty heap\nheap.size()',
          output: '0',
          explanation: 'Empty heap has size 0'
        },
        {
          input: 'heap.insert(5)\nheap.insert(3)\nheap.size()',
          output: '2',
          explanation: 'Two elements inserted, size is 2'
        },
        {
          input: 'heap with 5 elements\nheap.extract_min()\nheap.size()',
          output: '4',
          explanation: 'After extraction, size decreases by 1'
        }
      ],
      hints: [
        'Simply return the length of your internal array/list',
        'Most languages: len(array), array.length, array.size(), etc.',
        'No need for loops or complex logic'
      ],
      edgeCases: [
        'Size of empty heap (should be 0)',
        'Size after multiple insertions',
        'Size after multiple extractions'
      ]
    }
  },
  
  'stack': {
    'Create class': {
      title: 'Create Stack Class',
      objective: 'Initialize a stack data structure with an internal storage mechanism',
      methodSignature: {
        python: 'class Stack:\n    def __init__(self):',
        typescript: 'class Stack {\n  constructor()',
        javascript: 'class Stack {\n  constructor()',
        java: 'public class Stack {\n    public Stack()',
        go: 'type Stack struct {\n    items []int\n}',
        'c++': 'class Stack {\npublic:\n    Stack()'
      },
      requirements: [
        'Create a class named Stack',
        'Initialize an internal array/list to store elements',
        'The stack should start empty'
      ],
      examples: [
        {
          input: 'stack = Stack()',
          output: 'Empty stack created',
          explanation: 'Creates a new stack instance with no elements'
        }
      ],
      hints: [
        'Use a list/array as internal storage',
        'Initialize it as empty in the constructor',
        'You\'ll add elements to the end (top of stack)'
      ],
      edgeCases: [
        'Creating multiple independent stack instances'
      ]
    },
    'push()': {
      title: 'Implement push() Method',
      objective: 'Add an element to the top of the stack',
      methodSignature: {
        python: 'def push(self, value: int) -> None:',
        typescript: 'push(value: number): void',
        javascript: 'push(value)',
        java: 'public void push(int value)',
        go: 'func (s *Stack) Push(value int)',
        'c++': 'void push(int value)'
      },
      requirements: [
        'Add element to the top of the stack',
        'Append to the end of internal array',
        'Time complexity: O(1)'
      ],
      examples: [
        {
          input: 'stack.push(1)\nstack.push(2)\nstack.push(3)',
          output: 'Stack: [1, 2, 3] (3 is on top)',
          explanation: 'Elements are added to the top in order'
        }
      ],
      hints: [
        'Use array.append() or array.push()',
        'The last element added is the "top"'
      ],
      edgeCases: [
        'Pushing to empty stack',
        'Pushing duplicate values'
      ]
    },
    'pop()': {
      title: 'Implement pop() Method',
      objective: 'Remove and return the top element from the stack',
      methodSignature: {
        python: 'def pop(self) -> int | None:',
        typescript: 'pop(): number | null',
        javascript: 'pop()',
        java: 'public Integer pop()',
        go: 'func (s *Stack) Pop() (int, error)',
        'c++': 'int pop()'
      },
      requirements: [
        'Remove the last element from internal array',
        'Return the removed element',
        'Return None/null if stack is empty',
        'Time complexity: O(1)'
      ],
      examples: [
        {
          input: 'stack: [1, 2, 3]\nstack.pop()',
          output: 'Returns: 3\nStack becomes: [1, 2]',
          explanation: 'Removes and returns the top element'
        }
      ],
      hints: [
        'Check if stack is empty first',
        'Use array.pop() to remove last element'
      ],
      edgeCases: [
        'Popping from empty stack',
        'Popping the last element'
      ]
    },
    'peek()': {
      title: 'Implement peek() Method',
      objective: 'Return the top element without removing it',
      methodSignature: {
        python: 'def peek(self) -> int | None:',
        typescript: 'peek(): number | null',
        javascript: 'peek()',
        java: 'public Integer peek()',
        go: 'func (s *Stack) Peek() (int, error)',
        'c++': 'int peek()'
      },
      requirements: [
        'Return the last element of internal array',
        'Do NOT remove it',
        'Return None/null if empty',
        'Time complexity: O(1)'
      ],
      examples: [
        {
          input: 'stack: [1, 2, 3]\nstack.peek()',
          output: 'Returns: 3\nStack remains: [1, 2, 3]',
          explanation: 'Returns top without modifying stack'
        }
      ],
      hints: [
        'Access array[-1] or array[array.length - 1]',
        'Don\'t modify the array'
      ],
      edgeCases: [
        'Peeking empty stack',
        'Multiple peeks return same value'
      ]
    },
    'size()': {
      title: 'Implement size() Method',
      objective: 'Return the number of elements in the stack',
      methodSignature: {
        python: 'def size(self) -> int:',
        typescript: 'size(): number',
        javascript: 'size()',
        java: 'public int size()',
        go: 'func (s *Stack) Size() int',
        'c++': 'int size()'
      },
      requirements: [
        'Return length of internal array',
        'Time complexity: O(1)'
      ],
      examples: [
        {
          input: 'stack: [1, 2, 3]\nstack.size()',
          output: '3',
          explanation: 'Returns the count of elements'
        }
      ],
      hints: [
        'Return len(array) or array.length'
      ],
      edgeCases: [
        'Size of empty stack is 0'
      ]
    }
  }
  
  // Add more modules as needed (queue, binary-search, etc.)
}

/**
 * Get instruction for a specific subchallenge
 */
export function getSubchallengeInstruction(
  moduleId: string,
  subchallengeName: string
): SubchallengeInstruction | null {
  return subchallengeInstructions[moduleId]?.[subchallengeName] || null
}

