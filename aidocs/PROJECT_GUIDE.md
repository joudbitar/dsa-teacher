# DSA Lab - AI Developer Guide

**Last Updated:** November 8, 2025

This is a consolidated guide containing all essential information about the DSA Lab project for AI developers working on this codebase.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Quick Start](#quick-start)
4. [How It Works](#how-it-works)
5. [Key Technical Details](#key-technical-details)
6. [Progressive Unlocking System](#progressive-unlocking-system)
7. [Testing & User Simulation](#testing--user-simulation)
8. [Future Improvements](#future-improvements)

---

## Project Overview

DSA Lab is a platform where users pick a data structures challenge, get a private GitHub repo with tests, code it locally, and watch their progress update live on a dashboard.

**Status:** ✅ **Production Ready** - All systems operational (100% working)

### Available Challenges

- **Stack** - LIFO data structure (5 tests)
- **Queue** - FIFO data structure (5 tests)  
- **Binary Search** - Divide and conquer algorithm (4 tests)
- **Min Heap** - Priority queue structure (6 tests)

### Supported Languages

TypeScript, JavaScript, Python, Go, Java, C++ (24 templates total: 4 modules × 6 languages)

---

## Architecture

### Tech Stack

- **Web:** React + Vite + TypeScript + Tailwind CSS
- **CLI:** Node.js + TypeScript (the `dsa` command)
- **API:** Supabase Edge Functions (Deno runtime)
- **Database:** Supabase Postgres
- **GitHub:** Private repos via GitHub App (org: `dsa-teacher`)

### Repository Structure

```
dsa-lab/
├── web/                → React dashboard (shows challenges, tracks progress)
├── cli/                → The `dsa` command (test & submit from terminal)
├── supabase/
│   ├── functions/      → Edge Functions (API endpoints)
│   ├── init.sql        → Database schema
│   └── config.toml     → Supabase config
├── infra/              → Config files (challenge data, API specs)
└── aidocs/             → **This consolidated documentation folder**
```

### Data Flow

```
User's Laptop (CLI)
  └─ runs `dsa test`
  └─ reads .dsa-report.json
  └─ runs `dsa submit`
      └─ POSTs to /api/submissions (with project token)
          └─ API saves to database
              └─ Database triggers Realtime event
                  └─ Dashboard updates automatically
```

---

## Quick Start

### API Test
```bash
curl https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1/modules | jq
```

### Create Test Project
```bash
curl -X POST https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1/projects \
  -H "x-user-id: test-$(date +%s)" \
  -H "Content-Type: application/json" \
  -d '{"moduleId":"stack","language":"TypeScript"}' | jq
```

### Clone and Test
```bash
# Clone the repo URL from response
git clone <githubRepoUrl>
cd <repo-name>

# Install and test
npm install
dsa test
dsa submit
```

### Build CLI
```bash
cd cli
npm install
npm run build
pnpm link --global  # Makes 'dsa' command available globally
```

### Run Web Dashboard
```bash
cd web
pnpm install
pnpm dev
```

---

## How It Works

### User Flow

1. **User visits web app** → sees 4 challenges
2. **Clicks "Start Challenge"** → backend creates a private GitHub repo from a template
3. **User clones repo** → gets starter code with TODOs and pre-written tests
4. **User codes solution** → runs `dsa test` to see if tests pass
5. **Tests pass?** → runs `dsa submit` to send results to API
6. **Dashboard updates** → progress bar fills up, checkmarks appear

### API Endpoints

**Base URL:** `https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1`

- **GET /modules** - Returns all available challenges
- **GET /projects** - Lists user's projects (requires `x-user-id` header)
- **POST /projects** - Creates new project + GitHub repo (requires `x-user-id`)
- **POST /submissions** - Submits test results (requires `Authorization: Bearer <projectToken>`)

---

## Key Technical Details

### Template Structure

Each of the 24 templates follows this pattern:

```
template-dsa-MODULE-LANG/
├── src/                    → Implementation file (minimal starter code)
├── tests/                  → Test files + custom test runner
├── dsa.config.json         → Project configuration
├── .dsa-report.json        → Generated test results
├── README.md               → Challenge description
└── HINTS.md                → Progressive hints
```

### Test Report Format

```json
{
  "moduleId": "stack",
  "summary": "3/5 tests passed",
  "pass": false,
  "currentChallengeIndex": 2,
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
      "passed": false,
      "message": "Expected 5, got undefined"
    },
    {
      "subchallengeId": "peek",
      "passed": false,
      "message": "Challenge locked"
    },
    {
      "subchallengeId": "size",
      "passed": false,
      "message": "Challenge locked"
    }
  ]
}
```

### Language-Specific Test Runners

- **TypeScript/JavaScript:** Node.js runner executing vitest tests individually
- **Python:** Python script executing pytest tests individually
- **Go:** Go test runner executing test functions individually  
- **Java:** TestRunner class using JUnit Platform Launcher
- **C++:** Bash script with CMake build, GoogleTest execution, Python JSON parser

---

## Progressive Unlocking System

### The Problem (Solved)

**Initial Issue:** Compiled languages (Go, Java, C++) compile ALL test code at once. If locked tests reference undefined methods → compilation fails → users forced to implement everything!

**Solution Implemented:** Tests only run for unlocked challenges at execution level

### How It Works Now

1. Each template's test runner reads `currentChallengeIndex` from `dsa.config.json`
2. Only runs tests up to and including current challenge
3. Locked challenges show `"message": "Challenge locked"` in report
4. CLI displays results without filtering (no wasteful logic)

### Example

With `currentChallengeIndex: 2` (3rd challenge):

**Before (❌ Wasteful):**
```
Template: Run ALL 5 tests → Generate full report
CLI: Filter display to show only 3 tests
```

**After (✅ Efficient):**
```
Template: Run only 3 tests (challenges 0-2)
CLI: Display everything from report (no filtering)
```

### Verification Status

✅ **All 24 templates tested and working** (100% success rate)

---

## Testing & User Simulation

### User Simulation Instructions

For testing the system as a real learner would use it:

#### Setup
```bash
mkdir -p ~/dsa-learning-session
cd ~/dsa-learning-session
```

#### Create Project
```bash
curl -X POST https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1/projects \
  -H "Content-Type: application/json" \
  -H "x-user-id: learner-$(uuidgen)" \
  -d '{"moduleId": "stack", "language": "TypeScript"}' | jq .
```

#### Learning Workflow

**Rule #1: NEVER Write All Code At Once!**

```bash
# 1. Run test to see what fails (DON'T peek at test files)
dsa test

# 2. Read the ERROR MESSAGE carefully
# 3. Think: "What's the MINIMUM to fix THIS specific error?"
# 4. Code ONLY that one thing
# 5. Test again

dsa test  # Likely still fails - iterate!

# 6. When passing, submit and unlock next
dsa submit
```

#### Example Learning Session

**Challenge 1: create-class**

```bash
$ dsa test
✗ create-class - "Stack is not a constructor"
```

💭 Think: Need to export a class. Don't add methods yet!

```typescript
export class Stack<T> {
  // That's it!
}
```

```bash
$ dsa test
✗ create-class - "size is not a function"
```

💭 Think: Ah, needs size(). Return 0 for now.

```typescript
export class Stack<T> {
  size(): number {
    return 0;
  }
}
```

```bash
$ dsa test
✓ create-class PASSED

$ dsa submit
✓ Challenge completed!
🔓 Next challenge unlocked: push
```

### Expected Behavior

- **2-3 attempts per challenge** (not one-shot solutions)
- **Mistakes documented** (try wrong approaches, learn from errors)
- **Discovery through tests** (not by reading test files)
- **Incremental implementation** (add one method at a time)

---

## Future Improvements

### CLI Output Enhancements

**Current:**
```
✗  push
Status: FAILED  
⚠️  What went wrong: Method "push" is not implemented
```

**Proposed:**
```
✗  push
Status: FAILED

💭 Before you code, think:
   • What is the SIMPLEST way to store items?
   • What happens when I add an item to this storage?
   • Do I need anything complex, or just append to a list?

🔍 Hint: Look at how Python's list.append() works
⚠️  What went wrong: Method "push" is not implemented
```

### Starter Code Improvements

Add learning prompts to starter files:

```python
# 🎯 Learning Goals:
# 1. Understand LIFO (Last-In-First-Out) principle
# 2. Learn how to use arrays/lists as stacks
# 3. See why Python doesn't have a built-in Stack class
#
# 💡 Before writing code:
# - Run `dsa test` to see what fails
# - Think: "What's the MINIMAL code to fix this specific test?"
# - Implement just that ONE thing
# - Test again

class Stack:
    pass
```

### Over-Engineering Detection

Add detection for when users write too much code at once and warn them:

```bash
$ dsa test

✓ create-class PASSED

⚠️  Learning Tip:
   We noticed you implemented push(), pop(), and peek()
   But only create-class was needed!
   
   💡 Try this: Only implement what the CURRENT test asks for
```

### Module Completion Comparison

After completing a module, show comparison with standard library:

```bash
🎉 All challenges completed!

📊 Your Implementation vs Standard Library:

Your Stack:
  - 45 lines of code
  - Methods: push, pop, peek, size, isEmpty

Python's list (standard):
  - 0 extra lines needed!
  - Methods: append, pop, [-1], len, not

💡 Insight: Python lists ARE stacks!
```

---

## Important Notes

### GitHub Integration

- **Organization:** `dsa-teacher`
- **GitHub App ID:** 2255169
- **Installation ID:** 93648759
- **Template Repos:** All 24 templates exist in dsa-teacher org
- **Status:** ✅ Working correctly (fixed Nov 8, 2025)

### Template Validation

- **Tested:** 24/24 templates (100% working)
- **Total Tests:** 120 individual test cases
- **Success Rate:** 100%
- **Production Ready:** YES

### C++ Type System Note

C++ templates use different patterns intentionally:
- **Stack & Queue:** Use C++ templates (`template<typename T>`)
- **Binary Search & Min Heap:** Use concrete `int` types

This is **pedagogical design** - simpler algorithms use concrete types to reduce cognitive load while learning.

---

## Troubleshooting

### CLI Installation Issues

**"Command not found: dsa"**
```bash
# Solution 1: Restart terminal
# Solution 2: Add to PATH
export PATH="$(npm config get prefix)/bin:$PATH"
```

**"pnpm: command not found"**
```bash
npm install -g pnpm
pnpm setup
# Restart terminal
```

### Project Creation Issues

**Verify API is working:**
```bash
curl https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1/modules | jq
```

**Check user ID format:**
```bash
# Use unique user ID
curl -X POST ... -H "x-user-id: learner-$(date +%s)-$(uuidgen)" ...
```

---

## Development Commands

### Deploy Functions
```bash
cd /Users/joudbitar/Code/Projects/hackathon
supabase functions deploy projects --project-ref mwlhxwbkuumjxpnvldli --no-verify-jwt
```

### Build CLI
```bash
cd cli
npm install
npm run build
pnpm link --global
```

### Run Web Dev Server
```bash
cd web
pnpm install
pnpm dev
```

### Test Integration
```bash
./verify-integration.sh  # From project root
```

---

## Key Files Reference

- **`README.md`** - Main project overview
- **`QUICK_START.md`** - Quick reference guide
- **`cli/README.md`** - CLI documentation
- **`cli/INSTALL.md`** - Installation guide
- **`web/README.md`** - Web app documentation
- **`supabase/functions/README.md`** - API reference
- **`aidocs/PROJECT_GUIDE.md`** - This file

---

## Success Criteria

The DSA Lab system is considered fully functional when:

✅ Users can create projects via API  
✅ GitHub repos are created automatically from templates  
✅ Config files are committed to repos  
✅ Users can clone and work on challenges  
✅ CLI can test and submit results  
✅ Dashboard updates in real-time  
✅ Progressive unlocking works correctly  
✅ All 24 templates work across all languages  

**Current Status:** All criteria met ✅

---

**End of Guide**

*This document supersedes all previous individual documentation files and serves as the single source of truth for AI developers working on DSA Lab.*

