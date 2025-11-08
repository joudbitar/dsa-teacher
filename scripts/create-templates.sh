#!/bin/bash

# DSA Lab - Template Repository Generator
# Creates all 4 template repositories with complete structure

set -e

# Create templates OUTSIDE the current repo (in parent directory)
TEMPLATES_DIR="../dsa-templates"
ORG_NAME="${1:-YOUR_ORG_NAME}"

echo "🚀 Creating DSA Lab template repositories..."
echo "Organization: $ORG_NAME"
echo "Location: $TEMPLATES_DIR"
echo ""

# Create base directory
mkdir -p "$TEMPLATES_DIR"
cd "$TEMPLATES_DIR"

# Function to create common files
create_common_files() {
  local dir=$1
  
  # .gitignore
  cat > "$dir/.gitignore" << 'EOF'
node_modules/
dist/
.dsa-report.json
*.log
.DS_Store
EOF

  # package.json
  cat > "$dir/package.json" << 'EOF'
{
  "name": "dsa-challenge",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "node tests/run.js"
  },
  "devDependencies": {
    "vitest": "^1.0.0",
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0"
  }
}
EOF

  # tsconfig.json
  cat > "$dir/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*", "tests/**/*"]
}
EOF
}

# ============================================
# 1. STACK TEMPLATE
# ============================================
echo "📚 Creating template-dsa-stack-ts..."

STACK_DIR="template-dsa-stack-ts"
mkdir -p "$STACK_DIR/src" "$STACK_DIR/tests"

# README
cat > "$STACK_DIR/README.md" << 'EOF'
# DSA Lab: Build a Stack

Welcome to your Stack challenge! Follow these steps:

## 1. Install Dependencies
```bash
npm install
```

## 2. Test Your Solution
```bash
dsa test
```

## 3. Submit Your Results
```bash
dsa submit
```

## Challenge

Implement a stack data structure with the following methods:
- `push(value)` - Add element to top
- `pop()` - Remove and return top element
- `peek()` - Return top element without removing
- `size()` - Return number of elements

Edit `src/stack.ts` and run tests to validate your solution.
EOF

# dsa.config.json
cat > "$STACK_DIR/dsa.config.json" << 'EOF'
{
  "moduleId": "stack",
  "language": "TypeScript",
  "testCommand": "node tests/run.js",
  "reportFile": ".dsa-report.json",
  "projectId": "TBD",
  "projectToken": "TBD"
}
EOF

# src/stack.ts
cat > "$STACK_DIR/src/stack.ts" << 'EOF'
/**
 * Stack Data Structure
 * 
 * Implement the following methods:
 * - push(value): Add element to top
 * - pop(): Remove and return top element
 * - peek(): Return top element without removing
 * - size(): Return number of elements
 */

export class Stack<T> {
  private items: T[] = [];

  /**
   * TODO: Implement push method
   * Add an element to the top of the stack
   */
  push(value: T): void {
    // Your code here
  }

  /**
   * TODO: Implement pop method
   * Remove and return the top element
   * Return undefined if stack is empty
   */
  pop(): T | undefined {
    // Your code here
  }

  /**
   * TODO: Implement peek method
   * Return the top element without removing it
   * Return undefined if stack is empty
   */
  peek(): T | undefined {
    // Your code here
  }

  /**
   * TODO: Implement size method
   * Return the number of elements in the stack
   */
  size(): number {
    // Your code here
  }
}
EOF

# Test files
cat > "$STACK_DIR/tests/01-create-class.test.ts" << 'EOF'
import { describe, it, expect } from 'vitest';
import { Stack } from '../src/stack.js';

describe('Stack - Create Class', () => {
  it('should create a new stack instance', () => {
    const stack = new Stack<number>();
    expect(stack).toBeDefined();
    expect(stack.size()).toBe(0);
  });
});
EOF

cat > "$STACK_DIR/tests/02-push.test.ts" << 'EOF'
import { describe, it, expect } from 'vitest';
import { Stack } from '../src/stack.js';

describe('Stack - Push', () => {
  it('should add elements to the stack', () => {
    const stack = new Stack<number>();
    stack.push(10);
    expect(stack.size()).toBe(1);
    stack.push(20);
    expect(stack.size()).toBe(2);
  });
});
EOF

cat > "$STACK_DIR/tests/03-pop.test.ts" << 'EOF'
import { describe, it, expect } from 'vitest';
import { Stack } from '../src/stack.js';

describe('Stack - Pop', () => {
  it('should remove and return the top element', () => {
    const stack = new Stack<number>();
    stack.push(10);
    stack.push(20);
    expect(stack.pop()).toBe(20);
    expect(stack.size()).toBe(1);
  });

  it('should return undefined when popping from empty stack', () => {
    const stack = new Stack<number>();
    expect(stack.pop()).toBeUndefined();
  });
});
EOF

cat > "$STACK_DIR/tests/04-peek.test.ts" << 'EOF'
import { describe, it, expect } from 'vitest';
import { Stack } from '../src/stack.js';

describe('Stack - Peek', () => {
  it('should return the top element without removing it', () => {
    const stack = new Stack<number>();
    stack.push(10);
    stack.push(20);
    expect(stack.peek()).toBe(20);
    expect(stack.size()).toBe(2);
  });

  it('should return undefined when peeking empty stack', () => {
    const stack = new Stack<number>();
    expect(stack.peek()).toBeUndefined();
  });
});
EOF

cat > "$STACK_DIR/tests/05-size.test.ts" << 'EOF'
import { describe, it, expect } from 'vitest';
import { Stack } from '../src/stack.js';

describe('Stack - Size', () => {
  it('should return correct size', () => {
    const stack = new Stack<number>();
    expect(stack.size()).toBe(0);
    stack.push(10);
    expect(stack.size()).toBe(1);
    stack.push(20);
    expect(stack.size()).toBe(2);
    stack.pop();
    expect(stack.size()).toBe(1);
  });
});
EOF

# Test runner
cat > "$STACK_DIR/tests/run.js" << 'EOF'
#!/usr/bin/env node

import { exec } from 'child_process';
import { writeFileSync } from 'fs';
import { promisify } from 'util';

const execPromise = promisify(exec);

const testFiles = [
  { file: '01-create-class.test.ts', slug: 'create-class' },
  { file: '02-push.test.ts', slug: 'push' },
  { file: '03-pop.test.ts', slug: 'pop' },
  { file: '04-peek.test.ts', slug: 'peek' },
  { file: '05-size.test.ts', slug: 'size' },
];

async function runTests() {
  const results = [];
  let passedCount = 0;

  for (const { file, slug } of testFiles) {
    try {
      await execPromise(`npx vitest run tests/${file} --reporter=silent`);
      results.push({ subchallengeId: slug, passed: true });
      passedCount++;
      console.log(`✓ ${slug}`);
    } catch (error) {
      const message = error.stderr || error.stdout || 'Test failed';
      results.push({ subchallengeId: slug, passed: false, message: message.trim() });
      console.log(`✗ ${slug}`);
    }
  }

  const report = {
    moduleId: 'stack',
    summary: `${passedCount}/${testFiles.length} tests passed`,
    pass: passedCount === testFiles.length,
    cases: results,
  };

  writeFileSync('.dsa-report.json', JSON.stringify(report, null, 2));
  
  console.log(`\nSummary: ${report.summary}`);
  process.exit(report.pass ? 0 : 1);
}

runTests().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});
EOF

chmod +x "$STACK_DIR/tests/run.js"
create_common_files "$STACK_DIR"

echo "✅ Stack template created"

# ============================================
# 2. QUEUE TEMPLATE
# ============================================
echo "📚 Creating template-dsa-queue-ts..."

QUEUE_DIR="template-dsa-queue-ts"
mkdir -p "$QUEUE_DIR/src" "$QUEUE_DIR/tests"

# README
cat > "$QUEUE_DIR/README.md" << 'EOF'
# DSA Lab: Build a Queue

Welcome to your Queue challenge! Follow these steps:

## 1. Install Dependencies
```bash
npm install
```

## 2. Test Your Solution
```bash
dsa test
```

## 3. Submit Your Results
```bash
dsa submit
```

## Challenge

Implement a queue data structure with the following methods:
- `enqueue(value)` - Add element to back
- `dequeue()` - Remove and return front element
- `front()` - Return front element without removing
- `size()` - Return number of elements

Edit `src/queue.ts` and run tests to validate your solution.
EOF

# dsa.config.json
cat > "$QUEUE_DIR/dsa.config.json" << 'EOF'
{
  "moduleId": "queue",
  "language": "TypeScript",
  "testCommand": "node tests/run.js",
  "reportFile": ".dsa-report.json",
  "projectId": "TBD",
  "projectToken": "TBD"
}
EOF

# src/queue.ts
cat > "$QUEUE_DIR/src/queue.ts" << 'EOF'
/**
 * Queue Data Structure
 * 
 * Implement the following methods:
 * - enqueue(value): Add element to back
 * - dequeue(): Remove and return front element
 * - front(): Return front element without removing
 * - size(): Return number of elements
 */

export class Queue<T> {
  private items: T[] = [];

  /**
   * TODO: Implement enqueue method
   * Add an element to the back of the queue
   */
  enqueue(value: T): void {
    // Your code here
  }

  /**
   * TODO: Implement dequeue method
   * Remove and return the front element
   * Return undefined if queue is empty
   */
  dequeue(): T | undefined {
    // Your code here
  }

  /**
   * TODO: Implement front method
   * Return the front element without removing it
   * Return undefined if queue is empty
   */
  front(): T | undefined {
    // Your code here
  }

  /**
   * TODO: Implement size method
   * Return the number of elements in the queue
   */
  size(): number {
    // Your code here
  }
}
EOF

# Test files
cat > "$QUEUE_DIR/tests/01-create-class.test.ts" << 'EOF'
import { describe, it, expect } from 'vitest';
import { Queue } from '../src/queue.js';

describe('Queue - Create Class', () => {
  it('should create a new queue instance', () => {
    const queue = new Queue<number>();
    expect(queue).toBeDefined();
    expect(queue.size()).toBe(0);
  });
});
EOF

cat > "$QUEUE_DIR/tests/02-enqueue.test.ts" << 'EOF'
import { describe, it, expect } from 'vitest';
import { Queue } from '../src/queue.js';

describe('Queue - Enqueue', () => {
  it('should add elements to the queue', () => {
    const queue = new Queue<number>();
    queue.enqueue(10);
    expect(queue.size()).toBe(1);
    queue.enqueue(20);
    expect(queue.size()).toBe(2);
  });
});
EOF

cat > "$QUEUE_DIR/tests/03-dequeue.test.ts" << 'EOF'
import { describe, it, expect } from 'vitest';
import { Queue } from '../src/queue.js';

describe('Queue - Dequeue', () => {
  it('should remove and return the front element', () => {
    const queue = new Queue<number>();
    queue.enqueue(10);
    queue.enqueue(20);
    expect(queue.dequeue()).toBe(10);
    expect(queue.size()).toBe(1);
  });

  it('should return undefined when dequeuing from empty queue', () => {
    const queue = new Queue<number>();
    expect(queue.dequeue()).toBeUndefined();
  });
});
EOF

cat > "$QUEUE_DIR/tests/04-front.test.ts" << 'EOF'
import { describe, it, expect } from 'vitest';
import { Queue } from '../src/queue.js';

describe('Queue - Front', () => {
  it('should return the front element without removing it', () => {
    const queue = new Queue<number>();
    queue.enqueue(10);
    queue.enqueue(20);
    expect(queue.front()).toBe(10);
    expect(queue.size()).toBe(2);
  });

  it('should return undefined when checking front of empty queue', () => {
    const queue = new Queue<number>();
    expect(queue.front()).toBeUndefined();
  });
});
EOF

cat > "$QUEUE_DIR/tests/05-size.test.ts" << 'EOF'
import { describe, it, expect } from 'vitest';
import { Queue } from '../src/queue.js';

describe('Queue - Size', () => {
  it('should return correct size', () => {
    const queue = new Queue<number>();
    expect(queue.size()).toBe(0);
    queue.enqueue(10);
    expect(queue.size()).toBe(1);
    queue.enqueue(20);
    expect(queue.size()).toBe(2);
    queue.dequeue();
    expect(queue.size()).toBe(1);
  });
});
EOF

# Test runner
cat > "$QUEUE_DIR/tests/run.js" << 'EOF'
#!/usr/bin/env node

import { exec } from 'child_process';
import { writeFileSync } from 'fs';
import { promisify } from 'util';

const execPromise = promisify(exec);

const testFiles = [
  { file: '01-create-class.test.ts', slug: 'create-class' },
  { file: '02-enqueue.test.ts', slug: 'enqueue' },
  { file: '03-dequeue.test.ts', slug: 'dequeue' },
  { file: '04-front.test.ts', slug: 'front' },
  { file: '05-size.test.ts', slug: 'size' },
];

async function runTests() {
  const results = [];
  let passedCount = 0;

  for (const { file, slug } of testFiles) {
    try {
      await execPromise(`npx vitest run tests/${file} --reporter=silent`);
      results.push({ subchallengeId: slug, passed: true });
      passedCount++;
      console.log(`✓ ${slug}`);
    } catch (error) {
      const message = error.stderr || error.stdout || 'Test failed';
      results.push({ subchallengeId: slug, passed: false, message: message.trim() });
      console.log(`✗ ${slug}`);
    }
  }

  const report = {
    moduleId: 'queue',
    summary: `${passedCount}/${testFiles.length} tests passed`,
    pass: passedCount === testFiles.length,
    cases: results,
  };

  writeFileSync('.dsa-report.json', JSON.stringify(report, null, 2));
  
  console.log(`\nSummary: ${report.summary}`);
  process.exit(report.pass ? 0 : 1);
}

runTests().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});
EOF

chmod +x "$QUEUE_DIR/tests/run.js"
create_common_files "$QUEUE_DIR"

echo "✅ Queue template created"

# ============================================
# 3. BINARY SEARCH TEMPLATE
# ============================================
echo "📚 Creating template-dsa-binary-search-ts..."

BINSEARCH_DIR="template-dsa-binary-search-ts"
mkdir -p "$BINSEARCH_DIR/src" "$BINSEARCH_DIR/tests"

# README
cat > "$BINSEARCH_DIR/README.md" << 'EOF'
# DSA Lab: Binary Search

Welcome to your Binary Search challenge! Follow these steps:

## 1. Install Dependencies
```bash
npm install
```

## 2. Test Your Solution
```bash
dsa test
```

## 3. Submit Your Results
```bash
dsa submit
```

## Challenge

Implement binary search algorithm to find the index of a target value in a sorted array.
Return -1 if the target is not found.

Edit `src/binarySearch.ts` and run tests to validate your solution.
EOF

# dsa.config.json
cat > "$BINSEARCH_DIR/dsa.config.json" << 'EOF'
{
  "moduleId": "binary-search",
  "language": "TypeScript",
  "testCommand": "node tests/run.js",
  "reportFile": ".dsa-report.json",
  "projectId": "TBD",
  "projectToken": "TBD"
}
EOF

# src/binarySearch.ts
cat > "$BINSEARCH_DIR/src/binarySearch.ts" << 'EOF'
/**
 * Binary Search Algorithm
 * 
 * Find the index of a target value in a sorted array
 * Return -1 if not found
 * 
 * @param arr - Sorted array of numbers
 * @param target - Value to search for
 * @returns Index of target, or -1 if not found
 */

export function binarySearch(arr: number[], target: number): number {
  // TODO: Implement binary search
  // Your code here
  return -1;
}
EOF

# Test files
cat > "$BINSEARCH_DIR/tests/01-empty-array.test.ts" << 'EOF'
import { describe, it, expect } from 'vitest';
import { binarySearch } from '../src/binarySearch.js';

describe('Binary Search - Empty Array', () => {
  it('should return -1 for empty array', () => {
    expect(binarySearch([], 5)).toBe(-1);
  });
});
EOF

cat > "$BINSEARCH_DIR/tests/02-found-index.test.ts" << 'EOF'
import { describe, it, expect } from 'vitest';
import { binarySearch } from '../src/binarySearch.js';

describe('Binary Search - Found Index', () => {
  it('should return correct index when target is found', () => {
    expect(binarySearch([1, 2, 3, 4, 5], 3)).toBe(2);
    expect(binarySearch([10, 20, 30, 40, 50], 10)).toBe(0);
    expect(binarySearch([10, 20, 30, 40, 50], 50)).toBe(4);
  });
});
EOF

cat > "$BINSEARCH_DIR/tests/03-not-found.test.ts" << 'EOF'
import { describe, it, expect } from 'vitest';
import { binarySearch } from '../src/binarySearch.js';

describe('Binary Search - Not Found', () => {
  it('should return -1 when target is not found', () => {
    expect(binarySearch([1, 2, 3, 4, 5], 6)).toBe(-1);
    expect(binarySearch([1, 2, 3, 4, 5], 0)).toBe(-1);
    expect(binarySearch([10, 20, 30], 15)).toBe(-1);
  });
});
EOF

cat > "$BINSEARCH_DIR/tests/04-bounds.test.ts" << 'EOF'
import { describe, it, expect } from 'vitest';
import { binarySearch } from '../src/binarySearch.js';

describe('Binary Search - Bounds', () => {
  it('should handle single element array', () => {
    expect(binarySearch([5], 5)).toBe(0);
    expect(binarySearch([5], 3)).toBe(-1);
  });

  it('should handle large arrays', () => {
    const largeArray = Array.from({ length: 1000 }, (_, i) => i * 2);
    expect(binarySearch(largeArray, 500)).toBe(250);
    expect(binarySearch(largeArray, 999)).toBe(-1);
  });
});
EOF

# Test runner
cat > "$BINSEARCH_DIR/tests/run.js" << 'EOF'
#!/usr/bin/env node

import { exec } from 'child_process';
import { writeFileSync } from 'fs';
import { promisify } from 'util';

const execPromise = promisify(exec);

const testFiles = [
  { file: '01-empty-array.test.ts', slug: 'empty-array' },
  { file: '02-found-index.test.ts', slug: 'found-index' },
  { file: '03-not-found.test.ts', slug: 'not-found' },
  { file: '04-bounds.test.ts', slug: 'bounds' },
];

async function runTests() {
  const results = [];
  let passedCount = 0;

  for (const { file, slug } of testFiles) {
    try {
      await execPromise(`npx vitest run tests/${file} --reporter=silent`);
      results.push({ subchallengeId: slug, passed: true });
      passedCount++;
      console.log(`✓ ${slug}`);
    } catch (error) {
      const message = error.stderr || error.stdout || 'Test failed';
      results.push({ subchallengeId: slug, passed: false, message: message.trim() });
      console.log(`✗ ${slug}`);
    }
  }

  const report = {
    moduleId: 'binary-search',
    summary: `${passedCount}/${testFiles.length} tests passed`,
    pass: passedCount === testFiles.length,
    cases: results,
  };

  writeFileSync('.dsa-report.json', JSON.stringify(report, null, 2));
  
  console.log(`\nSummary: ${report.summary}`);
  process.exit(report.pass ? 0 : 1);
}

runTests().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});
EOF

chmod +x "$BINSEARCH_DIR/tests/run.js"
create_common_files "$BINSEARCH_DIR"

echo "✅ Binary Search template created"

# ============================================
# 4. MIN-HEAP TEMPLATE
# ============================================
echo "📚 Creating template-dsa-min-heap-ts..."

HEAP_DIR="template-dsa-min-heap-ts"
mkdir -p "$HEAP_DIR/src" "$HEAP_DIR/tests"

# README
cat > "$HEAP_DIR/README.md" << 'EOF'
# DSA Lab: Build a Min-Heap

Welcome to your Min-Heap challenge! Follow these steps:

## 1. Install Dependencies
```bash
npm install
```

## 2. Test Your Solution
```bash
dsa test
```

## 3. Submit Your Results
```bash
dsa submit
```

## Challenge

Implement a min-heap data structure with the following methods:
- `insert(value)` - Add element and maintain heap property
- `peekMin()` - Return minimum element
- `extractMin()` - Remove and return minimum element
- `size()` - Return number of elements

Edit `src/minHeap.ts` and run tests to validate your solution.
EOF

# dsa.config.json
cat > "$HEAP_DIR/dsa.config.json" << 'EOF'
{
  "moduleId": "min-heap",
  "language": "TypeScript",
  "testCommand": "node tests/run.js",
  "reportFile": ".dsa-report.json",
  "projectId": "TBD",
  "projectToken": "TBD"
}
EOF

# src/minHeap.ts
cat > "$HEAP_DIR/src/minHeap.ts" << 'EOF'
/**
 * Min-Heap Data Structure
 * 
 * Implement the following methods:
 * - insert(value): Add element and maintain heap property
 * - peekMin(): Return minimum element
 * - extractMin(): Remove and return minimum element
 * - size(): Return number of elements
 */

export class MinHeap {
  private heap: number[] = [];

  /**
   * TODO: Implement insert method
   * Add an element and maintain the min-heap property
   */
  insert(value: number): void {
    // Your code here
  }

  /**
   * TODO: Implement peekMin method
   * Return the minimum element without removing it
   * Return undefined if heap is empty
   */
  peekMin(): number | undefined {
    // Your code here
  }

  /**
   * TODO: Implement extractMin method
   * Remove and return the minimum element
   * Return undefined if heap is empty
   */
  extractMin(): number | undefined {
    // Your code here
  }

  /**
   * TODO: Implement size method
   * Return the number of elements in the heap
   */
  size(): number {
    // Your code here
  }

  /**
   * Helper method: Heapify up (for insert)
   * Restore heap property by moving element up
   */
  private heapifyUp(index: number): void {
    // Your code here (optional helper)
  }

  /**
   * Helper method: Heapify down (for extractMin)
   * Restore heap property by moving element down
   */
  private heapifyDown(index: number): void {
    // Your code here (optional helper)
  }
}
EOF

# Test files
cat > "$HEAP_DIR/tests/01-insert.test.ts" << 'EOF'
import { describe, it, expect } from 'vitest';
import { MinHeap } from '../src/minHeap.js';

describe('Min-Heap - Insert', () => {
  it('should insert elements into the heap', () => {
    const heap = new MinHeap();
    heap.insert(10);
    expect(heap.size()).toBe(1);
    heap.insert(5);
    expect(heap.size()).toBe(2);
  });
});
EOF

cat > "$HEAP_DIR/tests/02-heapify-up.test.ts" << 'EOF'
import { describe, it, expect } from 'vitest';
import { MinHeap } from '../src/minHeap.js';

describe('Min-Heap - Heapify Up', () => {
  it('should maintain min-heap property after insertions', () => {
    const heap = new MinHeap();
    heap.insert(10);
    heap.insert(5);
    heap.insert(15);
    expect(heap.peekMin()).toBe(5);
    
    heap.insert(3);
    expect(heap.peekMin()).toBe(3);
  });
});
EOF

cat > "$HEAP_DIR/tests/03-peek.test.ts" << 'EOF'
import { describe, it, expect } from 'vitest';
import { MinHeap } from '../src/minHeap.js';

describe('Min-Heap - Peek', () => {
  it('should return the minimum element without removing it', () => {
    const heap = new MinHeap();
    heap.insert(10);
    heap.insert(5);
    heap.insert(20);
    
    expect(heap.peekMin()).toBe(5);
    expect(heap.size()).toBe(3);
  });

  it('should return undefined when peeking empty heap', () => {
    const heap = new MinHeap();
    expect(heap.peekMin()).toBeUndefined();
  });
});
EOF

cat > "$HEAP_DIR/tests/04-extract.test.ts" << 'EOF'
import { describe, it, expect } from 'vitest';
import { MinHeap } from '../src/minHeap.js';

describe('Min-Heap - Extract', () => {
  it('should extract and return the minimum element', () => {
    const heap = new MinHeap();
    heap.insert(10);
    heap.insert(5);
    heap.insert(20);
    
    expect(heap.extractMin()).toBe(5);
    expect(heap.size()).toBe(2);
    expect(heap.peekMin()).toBe(10);
  });

  it('should return undefined when extracting from empty heap', () => {
    const heap = new MinHeap();
    expect(heap.extractMin()).toBeUndefined();
  });
});
EOF

cat > "$HEAP_DIR/tests/05-heapify-down.test.ts" << 'EOF'
import { describe, it, expect } from 'vitest';
import { MinHeap } from '../src/minHeap.js';

describe('Min-Heap - Heapify Down', () => {
  it('should maintain min-heap property after extraction', () => {
    const heap = new MinHeap();
    [10, 5, 20, 3, 8].forEach(n => heap.insert(n));
    
    expect(heap.extractMin()).toBe(3);
    expect(heap.extractMin()).toBe(5);
    expect(heap.extractMin()).toBe(8);
    expect(heap.extractMin()).toBe(10);
    expect(heap.extractMin()).toBe(20);
  });
});
EOF

cat > "$HEAP_DIR/tests/06-size.test.ts" << 'EOF'
import { describe, it, expect } from 'vitest';
import { MinHeap } from '../src/minHeap.js';

describe('Min-Heap - Size', () => {
  it('should return correct size', () => {
    const heap = new MinHeap();
    expect(heap.size()).toBe(0);
    
    heap.insert(10);
    expect(heap.size()).toBe(1);
    
    heap.insert(5);
    expect(heap.size()).toBe(2);
    
    heap.extractMin();
    expect(heap.size()).toBe(1);
  });
});
EOF

# Test runner
cat > "$HEAP_DIR/tests/run.js" << 'EOF'
#!/usr/bin/env node

import { exec } from 'child_process';
import { writeFileSync } from 'fs';
import { promisify } from 'util';

const execPromise = promisify(exec);

const testFiles = [
  { file: '01-insert.test.ts', slug: 'insert' },
  { file: '02-heapify-up.test.ts', slug: 'heapify-up' },
  { file: '03-peek.test.ts', slug: 'peek' },
  { file: '04-extract.test.ts', slug: 'extract' },
  { file: '05-heapify-down.test.ts', slug: 'heapify-down' },
  { file: '06-size.test.ts', slug: 'size' },
];

async function runTests() {
  const results = [];
  let passedCount = 0;

  for (const { file, slug } of testFiles) {
    try {
      await execPromise(`npx vitest run tests/${file} --reporter=silent`);
      results.push({ subchallengeId: slug, passed: true });
      passedCount++;
      console.log(`✓ ${slug}`);
    } catch (error) {
      const message = error.stderr || error.stdout || 'Test failed';
      results.push({ subchallengeId: slug, passed: false, message: message.trim() });
      console.log(`✗ ${slug}`);
    }
  }

  const report = {
    moduleId: 'min-heap',
    summary: `${passedCount}/${testFiles.length} tests passed`,
    pass: passedCount === testFiles.length,
    cases: results,
  };

  writeFileSync('.dsa-report.json', JSON.stringify(report, null, 2));
  
  console.log(`\nSummary: ${report.summary}`);
  process.exit(report.pass ? 0 : 1);
}

runTests().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});
EOF

chmod +x "$HEAP_DIR/tests/run.js"
create_common_files "$HEAP_DIR"

echo "✅ Min-Heap template created"

# ============================================
# SUMMARY
# ============================================
echo ""
echo "🎉 All templates created successfully!"
echo ""
echo "📁 Templates location: $TEMPLATES_DIR"
echo ""
echo "Next steps:"
echo "1. Review the generated templates"
echo "2. Run the setup script to push to GitHub"
echo ""

