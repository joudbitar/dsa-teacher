# Manual Testing Guide

## Quick Start

### Option 1: Test from CLI directory (Recommended)

```bash
# Navigate to your test project
cd /Users/ethanambrossi/Desktop/HackPrinceton/dsa-teacher/test-project

# Run commands using node directly
node ../cli/dist/index.js test
node ../cli/dist/index.js submit
```

### Option 2: Install globally (for easier testing)

```bash
# From the project root
cd /Users/ethanambrossi/Desktop/HackPrinceton/dsa-teacher
pnpm install -g ./cli

# Then you can use `dsa` command from anywhere
cd test-project
dsa test
dsa submit
```

### Option 3: Use npm link (for development)

```bash
# From the CLI directory
cd /Users/ethanambrossi/Desktop/HackPrinceton/dsa-teacher/cli
pnpm link --global

# Then use `dsa` command from anywhere
cd ../test-project
dsa test
dsa submit
```

## Step-by-Step Manual Testing

### 1. Test the `dsa test` Command

```bash
# Navigate to test project
cd /Users/ethanambrossi/Desktop/HackPrinceton/dsa-teacher/test-project

# Run test command
node ../cli/dist/index.js test
```

**Expected Output:**
- Shows "Running tests: [testCommand]"
- Displays test command output
- Shows colored results:
  - ✓ Green checkmarks for passed tests
  - ✗ Red X marks for failed tests
- Displays summary and individual test results

### 2. Test the `dsa submit` Command

```bash
# Make sure you have a valid report file first
cd /Users/ethanambrossi/Desktop/HackPrinceton/dsa-teacher/test-project

# Run submit command
node ../cli/dist/index.js submit
```

**Expected Behavior:**
1. Runs tests first (calls `test` internally)
2. Checks git status
3. If uncommitted changes, prompts: "Uncommitted changes. Continue? (y/N)"
4. Attempts to POST to API
5. Shows success or error message

**Note:** This will fail on API call unless you have a running server at `http://localhost:3000`. That's expected - you can verify the flow works up to the API call.

### 3. Test Error Cases

#### Missing Config File

```bash
# Go to a directory without dsa.config.json
cd /tmp
node /Users/ethanambrossi/Desktop/HackPrinceton/dsa-teacher/cli/dist/index.js test
```

**Expected:** Error message: "Not a DSA project. Run this command inside a cloned challenge repo."

#### Invalid Config JSON

```bash
cd /Users/ethanambrossi/Desktop/HackPrinceton/dsa-teacher/test-project

# Create invalid JSON
echo '{ invalid json' > dsa.config.json

node ../cli/dist/index.js test
```

**Expected:** Error message about invalid JSON

#### Missing Report File

```bash
cd /Users/ethanambrossi/Desktop/HackPrinceton/dsa-teacher/test-project

# Remove report file
rm .dsa-report.json

node ../cli/dist/index.js test
```

**Expected:** Error message: "No report file found. Run `dsa test` first."

#### Invalid Report Structure

```bash
cd /Users/ethanambrossi/Desktop/HackPrinceton/dsa-teacher/test-project

# Create invalid report
echo '{"moduleId": "stack", "pass": "not boolean"}' > .dsa-report.json

node ../cli/dist/index.js test
```

**Expected:** Error message about invalid report structure

### 4. Test Help and Version

```bash
# Show help
node ../cli/dist/index.js --help

# Show version
node ../cli/dist/index.js --version

# Unknown command
node ../cli/dist/index.js unknown-command
```

### 5. Test Config Search Up Directory Tree

```bash
# Create nested directories
cd /Users/ethanambrossi/Desktop/HackPrinceton/dsa-teacher/test-project
mkdir -p subdir/deep/nested

# Run from nested directory (should find config in parent)
cd subdir/deep/nested
node ../../../../cli/dist/index.js test
```

**Expected:** Should find `dsa.config.json` in the parent directory

### 6. Test Git Integration

```bash
cd /Users/ethanambrossi/Desktop/HackPrinceton/dsa-teacher/test-project

# Check git status (should show uncommitted files)
git status

# The submit command should detect this
node ../cli/dist/index.js submit
```

**Expected:** Should prompt about uncommitted changes

## Testing with Real API (Optional)

If you have the API server running:

1. Update `dsa.config.json` with real values:
   ```json
   {
     "projectId": "your-real-project-id",
     "projectToken": "your-real-token",
     "apiUrl": "http://localhost:3000"
   }
   ```

2. Run `dsa submit` - should successfully POST to API

## Quick Test Checklist

- [ ] `dsa test` shows colored output
- [ ] `dsa test` displays test results correctly
- [ ] `dsa submit` runs tests first
- [ ] `dsa submit` checks git status
- [ ] `dsa submit` prompts for uncommitted changes
- [ ] Missing config shows helpful error
- [ ] Invalid config shows helpful error
- [ ] Missing report shows helpful error
- [ ] Invalid report shows helpful error
- [ ] Help command works
- [ ] Version command works
- [ ] Unknown command shows error
- [ ] Config search works from subdirectories

## Troubleshooting

### "Cannot find module" errors

Make sure you're running from the correct directory and the build completed:
```bash
cd /Users/ethanambrossi/Desktop/HackPrinceton/dsa-teacher/cli
pnpm build
```

### "Command not found: dsa"

If using global install, make sure pnpm global bin is in your PATH:
```bash
export PATH="$(pnpm config get prefix)/bin:$PATH"
```

Or use the direct node command instead:
```bash
node /path/to/cli/dist/index.js test
```

### Colors not showing

Colors should work in most terminals. If they don't show, check:
- Terminal supports ANSI colors
- No `NO_COLOR` environment variable set
- Terminal is not in a mode that strips colors

