# Tests and Sub-Challenge Mapping

## Mapping Rule: File Name Prefix

Test files use a numbered prefix to map to sub-challenges:

```
NN-<slug>.test.ts
```

Where:
- `NN` = two-digit number (01, 02, 03, etc.)
- `<slug>` = kebab-case identifier matching sub-challenge
- `.test.ts` = TypeScript test file extension

### Example: Stack Module

**Sub-challenges (from `infra/modules.json`):**
```json
{
  "id": "stack",
  "subchallenges": ["Create class", "push()", "pop()", "peek()", "size()"]
}
```

**Test files in template repo:**
```
tests/
├── 01-create-class.test.ts
├── 02-push.test.ts
├── 03-pop.test.ts
├── 04-peek.test.ts
└── 05-size.test.ts
```

**Slug generation:**
- "Create class" → `create-class`
- "push()" → `push`
- "pop()" → `pop`
- "peek()" → `peek`
- "size()" → `size`

## Test Report Format

### The `.dsa-report.json` File

The test runner (`tests/run.js`) writes a structured JSON report to `.dsa-report.json`:

```json
{
  "moduleId": "stack",
  "summary": "4/5 tests passed",
  "pass": false,
  "cases": [
    {
      "subchallengeId": "create-class",
      "passed": true
    },
    {
      "subchallengeId": "push",
      "passed": true
    },
    {
      "subchallengeId": "pop",
      "passed": true
    },
    {
      "subchallengeId": "peek",
      "passed": false,
      "message": "Expected 10, received undefined"
    },
    {
      "subchallengeId": "size",
      "passed": true
    }
  ]
}
```

### Schema Definition

```typescript
interface DSAReport {
  moduleId: string;          // e.g., "stack"
  summary: string;           // Human-readable summary
  pass: boolean;             // Overall pass/fail
  cases: TestCase[];         // Per-sub-challenge results
}

interface TestCase {
  subchallengeId: string;    // Slug from filename
  passed: boolean;           // true/false
  message?: string;          // Optional error message
}
```

### Report Requirements

- **Must** be valid JSON
- **Must** include all sub-challenges (even if not run)
- **Must** set `pass = true` only if all cases passed
- **May** include additional fields (ignored by CLI)

## CLI Parse Report Logic

The CLI (`cli/src/lib/parseReport.ts`) implementation:

1. Read `config.reportFile` (defaults to `.dsa-report.json`)
2. Parse JSON
3. Validate schema (has required fields)
4. Return structured report to `submit` command

**No custom parsing per language** — all languages must produce the same JSON format.

## Test Runner Responsibilities

Each template repo includes `tests/run.js` which:

1. Discovers all `NN-<slug>.test.ts` files
2. Runs each test file (using test framework like Jest, Vitest, or Node's test runner)
3. Collects results
4. Maps file names to `subchallengeId` slugs
5. Writes `.dsa-report.json`

### Example run.js (pseudocode)

```javascript
// tests/run.js
const fs = require('fs');
const { execSync } = require('child_process');

const testFiles = [
  { file: '01-create-class.test.ts', slug: 'create-class' },
  { file: '02-push.test.ts', slug: 'push' },
  // ...
];

const results = [];
let allPassed = true;

for (const { file, slug } of testFiles) {
  try {
    execSync(`npx vitest run tests/${file}`, { stdio: 'pipe' });
    results.push({ subchallengeId: slug, passed: true });
  } catch (error) {
    results.push({ 
      subchallengeId: slug, 
      passed: false,
      message: extractErrorMessage(error)
    });
    allPassed = false;
  }
}

const report = {
  moduleId: 'stack',
  summary: `${results.filter(r => r.passed).length}/${results.length} tests passed`,
  pass: allPassed,
  cases: results
};

fs.writeFileSync('.dsa-report.json', JSON.stringify(report, null, 2));
process.exit(allPassed ? 0 : 1);
```

## Multi-Language Support (Future)

For Python, Go, etc., the same JSON format applies:

**Python:** `tests/run.py` writes `.dsa-report.json`
**Go:** `tests/run.go` writes `.dsa-report.json`

The CLI doesn't care about the implementation language.

## Validation Rules

### Server-side (`POST /api/submissions`)

When receiving submission:

1. Verify `moduleId` matches project's module
2. Validate all expected sub-challenges are present
3. Accept `details` as-is (store raw JSON)
4. Calculate progress from `cases` array

### CLI-side (`dsa submit`)

Before submitting:

1. Check `.dsa-report.json` exists
2. Validate JSON is parseable
3. Warn if `pass: false` (optional: require confirmation)
4. Display summary before submitting

## Edge Cases

### Missing Report File

CLI error: "No report file found. Run `dsa test` first."

### Malformed JSON

CLI error: "Invalid report format. Check test runner output."

### Extra Sub-Challenges

Server ignores unknown `subchallengeId` values (forward compatibility).

### Missing Sub-Challenges

Server counts as failed (implicit `passed: false`).

## Summary

The filename-to-slug mapping provides a **simple, language-agnostic** way to connect test files to sub-challenges. The standardized JSON report format allows the CLI to remain minimal while supporting any test framework.

