# TODO: Simplify CLI Installation

## Problem

Current installation requires multiple manual steps:
1. `pnpm setup`
2. `pnpm link --global`
3. User must navigate to CLI directory
4. Different steps for different shells

This is **not user-friendly** and will confuse end users.

## Solution: Create Installation Script

### Priority: HIGH ⚠️

Create an automated installation script that handles all setup steps.

### Implementation Plan

#### Step 1: Create `scripts/install.sh`

Location: `/Users/ethanambrossi/Desktop/HackPrinceton/dsa-teacher/cli/scripts/install.sh`

**Script should:**
- [ ] Check if Node.js is installed (exit with error if not)
- [ ] Check if pnpm is installed (install if not: `npm install -g pnpm`)
- [ ] Run `pnpm setup` if needed
- [ ] Install CLI globally using `pnpm link --global` (for dev) or `pnpm install -g` (for prod)
- [ ] Verify installation (`dsa --version`)
- [ ] Show success message with next steps
- [ ] Handle errors gracefully with helpful messages
- [ ] Support macOS, Linux, and Windows (WSL)

**Usage:**
```bash
# From project root or CLI directory
./cli/scripts/install.sh

# Or make it executable and run from anywhere
chmod +x cli/scripts/install.sh
./cli/scripts/install.sh
```

#### Step 2: Create `scripts/install.ps1` (Windows)

For Windows users (PowerShell script).

#### Step 3: Update README

Add clear installation instructions:
```markdown
## Installation

### Quick Install (Recommended)
```bash
./cli/scripts/install.sh
```

### Manual Install
[Current manual steps]
```

#### Step 4: Add to package.json

Add install script:
```json
{
  "scripts": {
    "install:cli": "node scripts/install.js || ./scripts/install.sh"
  }
}
```

#### Step 5: Consider npm publish (Future)

For production, publish to npm:
- Package name: `@dsa/cli`
- Users install: `pnpm install -g @dsa/cli`
- No manual setup needed

## Alternative: Use npm instead of pnpm link

Consider using `npm link` instead, which might be simpler:
```bash
cd cli
npm link
```

But this still requires manual steps.

## Best Solution for MVP

**Create `install.sh` script** that:
1. Automates all setup
2. Can be run with one command
3. Works for both development and end users
4. Provides clear error messages

## Testing Checklist

After creating script, test:
- [ ] Fresh macOS installation
- [ ] Fresh Linux installation  
- [ ] Windows WSL
- [ ] With pnpm already installed
- [ ] Without pnpm (should install it)
- [ ] With existing dsa installation (should handle gracefully)
- [ ] Error cases (no Node.js, no internet, etc.)

## Related Files

- `cli/INSTALLATION.md` - Installation documentation
- `cli/README.md` - Should reference installation script
- `README.md` (root) - Should have CLI installation section

