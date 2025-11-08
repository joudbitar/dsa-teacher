# Template Repository Structure

## Overview

Template repositories provide starter code, tests, and configuration for each challenge module. For MVP, we support **TypeScript only**.

## Template Naming Convention

```
template-dsa-<module-id>-ts
```

Examples:
- `template-dsa-stack-ts`
- `template-dsa-queue-ts`
- `template-dsa-binary-search-ts`
- `template-dsa-min-heap-ts`

All templates are **private repositories** in the GitHub organization.

## Directory Structure

```
template-dsa-stack-ts/
├── README.md                 # User instructions (3 steps)
├── package.json              # Dependencies (vitest, typescript, etc.)
├── tsconfig.json             # TypeScript configuration
├── dsa.config.json           # DSA Lab configuration (with TBD values)
├── src/
│   └── stack.ts              # Skeleton implementation with TODOs
└── tests/
    ├── 01-create-class.test.ts
    ├── 02-push.test.ts
    ├── 03-pop.test.ts
    ├── 04-peek.test.ts
    ├── 05-size.test.ts
    └── run.js                # Test orchestrator
```

## File Contents

### `README.md`

```markdown
# DSA Lab: Build a Stack

Welcome to your Stack challenge! Follow these steps:

## 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

## 2. Test Your Solution
\`\`\`bash
dsa test
\`\`\`

## 3. Submit Your Results
\`\`\`bash
dsa submit
\`\`\`

## Challenge

Implement a stack data structure with the following methods:
- `push(value)` - Add element to top
- `pop()` - Remove and return top element
- `peek()` - Return top element without removing
- `size()` - Return number of elements

Edit `src/stack.ts` and run tests to validate your solution.
```

### `package.json`

```json
{
  "name": "dsa-stack-challenge",
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
```

### `tsconfig.json`

```json
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
```

### `dsa.config.json` (Template Version)

```json
{
  "moduleId": "stack",
  "language": "TypeScript",
  "testCommand": "node tests/run.js",
  "reportFile": ".dsa-report.json",
  "projectId": "TBD",
  "projectToken": "TBD"
}
```

**Note:** `projectId` and `projectToken` are placeholders. The API will update these via GitHub API when creating a project.

### `src/stack.ts` (Skeleton)

```typescript
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
```

### `tests/01-create-class.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { Stack } from '../src/stack.js';

describe('Stack - Create Class', () => {
  it('should create a new stack instance', () => {
    const stack = new Stack<number>();
    expect(stack).toBeDefined();
    expect(stack.size()).toBe(0);
  });
});
```

### `tests/02-push.test.ts`

```typescript
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
```

### `tests/run.js` (Orchestrator)

```javascript
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
```

## Configuration Keys

### `dsa.config.json` Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `moduleId` | string | Challenge module identifier | `"stack"` |
| `language` | string | Programming language | `"TypeScript"` |
| `testCommand` | string | Command to run tests | `"node tests/run.js"` |
| `reportFile` | string | Output report file path | `".dsa-report.json"` |
| `projectId` | string | UUID of project (filled by API) | `"abc-123..."` |
| `projectToken` | string | Auth token (filled by API) | `"xyz789..."` |

## Template Creation Checklist

For each new module, create a template repo with:

- [ ] All test files with correct `NN-<slug>` naming
- [ ] Skeleton implementation with clear TODOs
- [ ] Working `tests/run.js` that writes `.dsa-report.json`
- [ ] README with 3-step instructions
- [ ] `package.json` with correct dependencies
- [ ] `tsconfig.json` configured for ES modules
- [ ] `dsa.config.json` with TBD placeholders
- [ ] `.gitignore` (node_modules, dist, .dsa-report.json)

## Multi-Language Support (Future)

For Python templates:

```
template-dsa-stack-py/
├── README.md
├── pyproject.toml
├── dsa.config.json
├── src/
│   └── stack.py
└── tests/
    ├── test_01_create_class.py
    ├── test_02_push.py
    └── run.py              # Writes .dsa-report.json
```

For Go templates:

```
template-dsa-stack-go/
├── README.md
├── go.mod
├── dsa.config.json
├── stack.go
└── stack_test.go           # All tests in one file
```

## Template Maintenance

- Templates should remain **private**
- Tag templates with versions (e.g., `v1.0.0`) for stability
- Test template repos before using in production
- Keep dependencies up-to-date

## Summary

Templates provide a **consistent, working environment** for each challenge. The TypeScript-only MVP keeps things simple while the structure supports multi-language expansion post-hackathon.

