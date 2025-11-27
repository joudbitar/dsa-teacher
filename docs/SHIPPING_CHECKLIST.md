# CLI Shipping Checklist

## ✅ Completed Testing

### Build & Compilation
- [x] TypeScript compiles without errors
- [x] All source files compile to `dist/`
- [x] No linting errors
- [x] All commands are present in `dist/commands/`
- [x] All libraries are present in `dist/lib/`

### Code Quality
- [x] Error handling implemented for update checks
- [x] Network failures handled gracefully (non-blocking)
- [x] Update check throttling fixed (only sets timestamp on success)
- [x] Dynamic imports wrapped in try-catch
- [x] All error paths have fallbacks

## 🧪 Required Testing Before Release

### 1. Manual CLI Testing (Critical Path)

#### Test `dsa test` command
```bash
# In a test project directory with dsa.config.json
dsa test
```
**Verify:**
- [ ] Test output displays correctly
- [ ] Loading animation works
- [ ] Error messages are cleaned/friendly
- [ ] Update notification appears (if update available) after 24h
- [ ] No errors when update check fails (network offline)
- [ ] Progress display shows correct challenge index
- [ ] Locked challenges are shown correctly

#### Test `dsa submit` command
```bash
dsa submit
```
**Verify:**
- [ ] Runs tests internally first
- [ ] Validates current challenge passed
- [ ] Submits to API correctly
- [ ] Updates local config file (`currentChallengeIndex`)
- [ ] Shows next challenge unlock message
- [ ] Update notification appears (if update available)
- [ ] Handles API errors gracefully (401, 404, network errors)

#### Test `dsa update` command
```bash
dsa update
```
**Verify:**
- [ ] Checks for updates correctly
- [ ] Shows current vs latest version
- [ ] Runs install script when update available
- [ ] Handles update failures gracefully
- [ ] Shows manual update instructions on failure
- [ ] Works when already on latest version

#### Test `dsa hint` command
```bash
dsa hint
```
**Verify:**
- [ ] Still works (no regressions)
- [ ] Update notification appears (if update available)

#### Test `dsa --help` and `dsa --version`
```bash
dsa --help
dsa --version
```
**Verify:**
- [ ] Help text includes `update` command
- [ ] Version displays correctly

### 2. Edge Case Testing

#### Network Failures
- [ ] Disconnect internet, run `dsa test` → should work (update check fails silently)
- [ ] Disconnect internet, run `dsa submit` → should show API error, not crash
- [ ] Disconnect internet, run `dsa update` → should show error with manual instructions

#### Update Check Throttling
- [ ] Run `dsa test` twice quickly → update check only happens once per 24h
- [ ] Manually delete `~/.dsa-cli-update-check` → should check again immediately
- [ ] Verify cache file is created in correct location

#### Error Scenarios
- [ ] Run commands outside project directory → should show helpful error
- [ ] Corrupt `dsa.config.json` → should show helpful error
- [ ] Missing required fields in config → should show helpful error
- [ ] Invalid API URL → should handle gracefully

### 3. Integration Testing

#### Full Workflow Test
1. [ ] Create new project (or use existing test project)
2. [ ] Run `dsa test` → verify output
3. [ ] Fix code to pass tests
4. [ ] Run `dsa test` → verify passing state
5. [ ] Run `dsa submit` → verify submission and unlock
6. [ ] Run `dsa test` → verify next challenge is unlocked
7. [ ] Complete all challenges → verify completion message

#### Cross-Platform Testing
- [ ] macOS (current)
- [ ] Linux (if possible)
- [ ] Windows (if possible, check path handling)

### 4. Update Mechanism Testing

#### Version Detection
- [ ] Verify `getCurrentVersion()` reads from `package.json` correctly
- [ ] Verify fallback to `CURRENT_VERSION` constant works
- [ ] Test version comparison logic with various versions

#### GitHub API Integration
- [ ] Verify GitHub releases API call works
- [ ] Verify fallback to package.json from main branch works
- [ ] Test with network timeout
- [ ] Test with invalid GitHub response

#### Install Script Integration
- [ ] Verify `dsa update` calls install script correctly
- [ ] Test update process end-to-end (if possible in test environment)
- [ ] Verify update preserves user's PATH configuration

## 📝 Documentation Updates Required

### 1. Update CLI README
- [ ] Add `dsa update` command to command list
- [ ] Document update checking behavior
- [ ] Add troubleshooting section for update issues

### 2. Update Main README
- [ ] Add `dsa update` to command reference table
- [ ] Document automatic update notifications

### 3. Update CLI Reference Docs
- [ ] Add `dsa update` command documentation
- [ ] Document update checking frequency (24h)
- [ ] Document cache file location (`~/.dsa-cli-update-check`)

## 🚀 Release Process

### Pre-Release Checklist
- [ ] All tests pass
- [ ] Version number updated in `cli/package.json`
- [ ] Version number updated in `cli/src/lib/checkUpdate.ts` (CURRENT_VERSION constant)
- [ ] CHANGELOG.md updated (if exists)
- [ ] All documentation updated
- [ ] Build tested: `cd cli && npm run build`
- [ ] Verify `dist/` contains all files

### Release Steps
1. [ ] **Commit all changes**
   ```bash
   git add cli/
   git commit -m "feat(cli): Add update command and automatic update checking"
   ```

2. [ ] **Tag release** (if using semantic versioning)
   ```bash
   git tag -a v0.1.1 -m "CLI v0.1.1: Add update command"
   git push origin main --tags
   ```

3. [ ] **Create GitHub Release** (optional but recommended)
   - Go to GitHub releases page
   - Create new release with tag `v0.1.1`
   - Add release notes describing new features

4. [ ] **Verify Install Script**
   - Test install script works with new version
   - Verify install script pulls from correct branch/tag

5. [ ] **Test Fresh Installation**
   ```bash
   # On a clean system or VM
   curl -fsSL https://raw.githubusercontent.com/joudbitar/dsa-teacher/main/scripts/install-cli.sh | bash
   dsa --version  # Should show new version
   dsa update     # Should work
   ```

### Post-Release Verification
- [ ] Verify `dsa --version` shows correct version for new installs
- [ ] Verify `dsa update` detects new version correctly
- [ ] Monitor for any user-reported issues
- [ ] Check GitHub releases API returns correct version

## 🔍 Code Review Checklist

### Update Feature
- [x] Update check is non-blocking (doesn't slow down commands)
- [x] Update check failures are silent (don't interrupt workflow)
- [x] Update check throttled to once per 24 hours
- [x] Cache file location is correct (`~/.dsa-cli-update-check`)
- [x] Version comparison logic is correct
- [x] GitHub API fallback works
- [x] Update command handles errors gracefully

### Error Handling
- [x] All network calls wrapped in try-catch
- [x] Dynamic imports wrapped in try-catch
- [x] File operations have error handling
- [x] User-friendly error messages

### Code Quality
- [x] No hardcoded paths (uses environment variables)
- [x] No console.log in production code (uses chalk)
- [x] Consistent error handling patterns
- [x] TypeScript types are correct

## 🐛 Known Issues / Future Improvements

### Current Limitations
1. **Update check cache**: If update check fails, we don't retry until 24h passes
   - **Status**: Acceptable for non-blocking feature
   - **Future**: Could implement exponential backoff

2. **Update command**: Requires internet and curl/bash
   - **Status**: Acceptable, matches installation method
   - **Future**: Could add alternative update methods

3. **Version detection**: Falls back to hardcoded constant if package.json read fails
   - **Status**: Acceptable fallback
   - **Future**: Could improve error handling

### Future Enhancements
- [ ] Add `--check-update` flag to force update check
- [ ] Add `--skip-update-check` flag for CI/CD environments
- [ ] Add update check timeout configuration
- [ ] Add telemetry for update check success/failure rates
- [ ] Add support for pre-release versions (alpha/beta)

## ✅ Sign-Off

**Ready for Release:** ☐ Yes ☐ No

**Tested By:** _________________  
**Date:** _________________  
**Version:** _________________

**Notes:**
_________________________________________________
_________________________________________________
_________________________________________________

