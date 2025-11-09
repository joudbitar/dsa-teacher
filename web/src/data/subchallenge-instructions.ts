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
      objective: 'Build or initialize your array-backed heap structure and add a new element while maintaining the min-heap property',
      methodSignature: {
        python: 'def insert(self, value: int) -> None:',
        typescript: 'insert(value: number): void',
        javascript: 'insert(value)',
        java: 'public void insert(int value)',
        go: 'func (h *MinHeap) Insert(value int)',
        'c++': 'void insert(int value)'
      },
      requirements: [
        'Ensure your heap uses an internal array/list; initialize it if it does not exist yet',
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
        'If you haven’t already, set up an empty array/list to represent the heap before inserting',
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
        'Time complexity: O(1)',
        'Every push represents a "new context" in the stack'
      ],
      examples: [
        {
          input: 'stack.push(1)\nstack.push(2)\nstack.push(3)',
          output: 'Stack: [1, 2, 3] (3 is on top)',
          explanation: 'Elements are added to the top in order. The last element pushed is at the top.'
        },
        {
          input: 'stack.push("S")\nstack.push("T")\nstack.push("A")\nstack.push("C")\nstack.push("K")',
          output: 'Stack: ["S", "T", "A", "C", "K"] (top = "K")',
          explanation: 'Useful for string reversal: push all characters, then pop to get reversed order'
        }
      ],
      hints: [
        'Use array.append() or array.push()',
        'The last element added is the "top"',
        'Think of it like adding a plate to a stack of plates'
      ],
      edgeCases: [
        'Pushing to empty stack',
        'Pushing duplicate values',
        'Pushing after multiple pops'
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
        'Return None/null if stack is empty (handle stack underflow)',
        'Time complexity: O(1)',
        'Every pop returns control to the previous state'
      ],
      examples: [
        {
          input: 'stack: [1, 2, 3]\nstack.pop()',
          output: 'Returns: 3\nStack becomes: [1, 2]',
          explanation: 'Removes and returns the top element (LIFO: Last In, First Out)'
        },
        {
          input: 'stack: ["S", "T", "A", "C", "K"]\nwhile not stack.is_empty():\n    print(stack.pop())',
          output: 'K\nC\nA\nT\nS',
          explanation: 'Popping all elements reverses the order—this is how string reversal works!'
        }
      ],
      hints: [
        'Check if stack is empty first to avoid stack underflow',
        'Use array.pop() to remove last element',
        'The element removed is always the most recently added (LIFO)'
      ],
      edgeCases: [
        'Popping from empty stack (stack underflow)',
        'Popping the last element (stack becomes empty)',
        'Multiple consecutive pops'
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
  },

  'queue': {
    'Create class': {
      title: 'Create Queue Class',
      objective: 'Initialize a queue data structure with internal storage and a head pointer for efficient FIFO operations',
      methodSignature: {
        python: 'class Queue:\n    def __init__(self):',
        typescript: 'class Queue {\n  constructor()',
        javascript: 'class Queue {\n  constructor()',
        java: 'public class Queue {\n    public Queue()',
        go: 'type Queue struct {\n    items []int\n    head int\n}',
        'c++': 'class Queue {\npublic:\n    Queue()'
      },
      requirements: [
        'Create a class named Queue',
        'Initialize an internal array/list to store elements (_items or items)',
        'Initialize a head pointer (_head or head) starting at 0',
        'The queue should start empty',
        'The head pointer tracks the front of the queue without removing elements'
      ],
      examples: [
        {
          input: 'queue = Queue()',
          output: 'Empty queue created with _items=[] and _head=0',
          explanation: 'Creates a new queue instance ready to enqueue and dequeue elements'
        }
      ],
      hints: [
        'Use a list/array as internal storage',
        'Keep a separate integer variable for the head position',
        'The head pointer helps avoid expensive remove operations from the front',
        'Initialize both in the constructor'
      ],
      edgeCases: [
        'Creating multiple independent queue instances',
        'Each instance should have its own items and head'
      ]
    },
    'enqueue()': {
      title: 'Implement enqueue() Method',
      objective: 'Add an element to the rear (end) of the queue',
      methodSignature: {
        python: 'def enqueue(self, value: int) -> None:',
        typescript: 'enqueue(value: number): void',
        javascript: 'enqueue(value)',
        java: 'public void enqueue(int value)',
        go: 'func (q *Queue) Enqueue(value int)',
        'c++': 'void enqueue(int value)'
      },
      requirements: [
        'Add element to the end of the internal array',
        'Use append/push to add to the rear',
        'Time complexity: O(1)',
        'FIFO principle: first in, first out',
        'The first element enqueued will be the first one dequeued'
      ],
      examples: [
        {
          input: 'queue.enqueue(1)\nqueue.enqueue(2)\nqueue.enqueue(3)',
          output: 'Queue internally: [1, 2, 3] with head=0',
          explanation: 'Elements are added to the back. Element 1 is at front, 3 at rear'
        },
        {
          input: 'queue.enqueue(10)',
          output: 'Queue size increases by 1',
          explanation: 'Each enqueue adds one element to the rear'
        },
        {
          input: 'queue.enqueue("Alice")\nqueue.enqueue("Bob")\nqueue.enqueue("Charlie")',
          output: 'Queue: ["Alice", "Bob", "Charlie"]',
          explanation: 'Useful for ticket counter simulation: customers join the line in order'
        }
      ],
      hints: [
        'Simply append/push the value to the internal array',
        'The head pointer stays unchanged during enqueue',
        'New elements always go to the end',
        'Think of it like joining a line at a ticket counter'
      ],
      edgeCases: [
        'Enqueueing to empty queue',
        'Enqueueing after dequeue operations',
        'Enqueueing duplicate values is allowed',
        'Enqueueing after multiple dequeues'
      ]
    },
    'dequeue()': {
      title: 'Implement dequeue() Method',
      objective: 'Remove and return the element at the front of the queue',
      methodSignature: {
        python: 'def dequeue(self) -> int | None:',
        typescript: 'dequeue(): number | null',
        javascript: 'dequeue()',
        java: 'public Integer dequeue()',
        go: 'func (q *Queue) Dequeue() (int, error)',
        'c++': 'int dequeue()'
      },
      requirements: [
        'Return the element at the head position',
        'Increment the head pointer after returning',
        'Return None/null if queue is empty (handle queue underflow)',
        'Time complexity: O(1) (no array shifting required)',
        'FIFO principle: the first element enqueued is the first one dequeued',
        'Optional: Periodically clean up unused space when head grows large'
      ],
      examples: [
        {
          input: 'queue with [1, 2, 3], head=0\nqueue.dequeue()',
          output: 'Returns: 1\nQueue state: [1, 2, 3], head=1',
          explanation: 'Returns element at head, increments head pointer. No array modification needed.'
        },
        {
          input: 'queue.enqueue(5)\nqueue.enqueue(10)\nqueue.dequeue()\nqueue.dequeue()',
          output: 'First dequeue returns 5, second returns 10',
          explanation: 'FIFO: elements are removed in the order they were added'
        },
        {
          input: 'empty queue\nqueue.dequeue()',
          output: 'None (or null)',
          explanation: 'Dequeueing from empty queue returns None/null'
        },
        {
          input: 'queue: ["Alice", "Bob", "Charlie"]\nwhile not queue.is_empty():\n    print("Serving:", queue.dequeue())',
          output: 'Serving: Alice\nServing: Bob\nServing: Charlie',
          explanation: 'Dequeueing all elements serves them in FIFO order—this is how ticket counters work!'
        }
      ],
      hints: [
        'Check if queue is empty: head >= len(items)',
        'Get value at items[head]',
        'Increment head by 1',
        'Return the value',
        'The element removed is always the first one added (FIFO)',
        'Advanced: If head exceeds half the array length, trim the unused front portion'
      ],
      edgeCases: [
        'Dequeueing from empty queue (return None/null)',
        'Dequeueing the last element',
        'Dequeueing after multiple enqueue/dequeue operations',
        'Memory optimization: resetting array when head grows too large'
      ]
    },
    'front()': {
      title: 'Implement front() Method',
      objective: 'Return the element at the front of the queue without removing it',
      methodSignature: {
        python: 'def front(self) -> int | None:',
        typescript: 'front(): number | null',
        javascript: 'front()',
        java: 'public Integer front()',
        go: 'func (q *Queue) Front() (int, error)',
        'c++': 'int front()'
      },
      requirements: [
        'Return the element at the head position',
        'Do NOT remove the element',
        'Do NOT increment the head pointer',
        'Return None/null if queue is empty',
        'Time complexity: O(1)'
      ],
      examples: [
        {
          input: 'queue with [1, 2, 3], head=0\nqueue.front()',
          output: 'Returns: 1\nQueue unchanged: [1, 2, 3], head=0',
          explanation: 'Returns front element without modifying queue'
        },
        {
          input: 'empty queue\nqueue.front()',
          output: 'None (or null)',
          explanation: 'Returns None/null when queue is empty'
        },
        {
          input: 'queue.front()\nqueue.front()',
          output: 'Both calls return the same value',
          explanation: 'Multiple front() calls return the same element'
        }
      ],
      hints: [
        'Check if queue is empty: head >= len(items)',
        'Return items[head] without modifying anything',
        'Similar to peek() in stack, but returns the front not the back'
      ],
      edgeCases: [
        'Front of empty queue (return None/null)',
        'Front after dequeue operations (head > 0)',
        'Multiple front calls should be idempotent'
      ]
    },
    'size()': {
      title: 'Implement size() Method',
      objective: 'Return the number of elements currently in the queue',
      methodSignature: {
        python: 'def size(self) -> int:',
        typescript: 'size(): number',
        javascript: 'size()',
        java: 'public int size()',
        go: 'func (q *Queue) Size() int',
        'c++': 'int size()'
      },
      requirements: [
        'Return the count of elements available in the queue',
        'Account for the head pointer position',
        'Formula: length of items - head position',
        'Time complexity: O(1)'
      ],
      examples: [
        {
          input: 'Empty queue\nqueue.size()',
          output: '0',
          explanation: 'Empty queue has size 0'
        },
        {
          input: 'queue.enqueue(1)\nqueue.enqueue(2)\nqueue.size()',
          output: '2',
          explanation: 'Two elements enqueued, size is 2'
        },
        {
          input: 'queue with [1, 2, 3, 4], head=2\nqueue.size()',
          output: '2',
          explanation: 'Array has 4 elements, but head=2, so only 2 elements remain (indices 2 and 3)'
        },
        {
          input: 'queue with 5 elements\nqueue.dequeue()\nqueue.size()',
          output: '4',
          explanation: 'After dequeueing, size decreases by 1'
        }
      ],
      hints: [
        'Calculate: len(items) - head',
        'This accounts for elements already dequeued (before head)',
        'Don\'t just return array length, must subtract head'
      ],
      edgeCases: [
        'Size of empty queue (should be 0)',
        'Size after multiple enqueues',
        'Size after multiple dequeues (head > 0)',
        'Size after alternating enqueue/dequeue operations'
      ]
    }
  }
  
  // Add more modules as needed (binary-search, etc.)
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

