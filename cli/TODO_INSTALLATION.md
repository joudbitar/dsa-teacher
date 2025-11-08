# ✅ TODO: Simplify CLI Installation - COMPLETED

## Problem ✅ SOLVED

Current installation required multiple manual steps:
1. `pnpm setup`
2. `pnpm link --global`
3. User must navigate to CLI directory
4. Different steps for different shells

This was **not user-friendly** and would confuse end users.

## Solution: Create Installation Script ✅ COMPLETED

### Status: ✅ DONE

Automated installation scripts have been created that handle all setup steps.

### Implementation Plan

#### Step 1: Create `scripts/install.sh` ✅

Location: `/Users/ethanambrossi/Desktop/HackPrinceton/dsa-teacher/cli/scripts/install.sh`

**Script should:**
- [x] Check if Node.js is installed (exit with error if not)
- [x] Check if pnpm is installed (install if not: `npm install -g pnpm`)
- [x] Run `pnpm setup` if needed
- [x] Install CLI globally using `pnpm link --global` (for dev) or `pnpm install -g` (for prod)
- [x] Verify installation (`dsa --version`)
- [x] Show success message with next steps
- [x] Handle errors gracefully with helpful messages
- [x] Support macOS, Linux, and Windows (WSL)

**Usage:**
```bash
# From project root or CLI directory
./cli/scripts/install.sh

# Or make it executable and run from anywhere
chmod +x cli/scripts/install.sh
./cli/scripts/install.sh
```

#### Step 2: Create `scripts/install.ps1` (Windows) ✅

For Windows users (PowerShell script). **COMPLETED**

#### Step 3: Update README ✅

Add clear installation instructions. **COMPLETED** - README now includes installation script instructions.

#### Step 4: Add to package.json ✅

Add install script. **COMPLETED** - Added `"install:cli": "./scripts/install.sh"` to package.json scripts.

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

