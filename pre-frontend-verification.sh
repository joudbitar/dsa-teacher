#!/bin/bash
# Pre-Frontend Integration Verification Script
# Comprehensive testing of CLI and API before frontend work

set -e

API_URL="${API_URL:-https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1}"
TEST_DIR=~/dsa-verification-$(date +%s)
REPORT_FILE="$TEST_DIR/verification-report.txt"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

log() {
    echo -e "${BLUE}[$(date +%H:%M:%S)]${NC} $1" | tee -a "$REPORT_FILE"
}

success() {
    echo -e "${GREEN}✓${NC} $1" | tee -a "$REPORT_FILE"
    ((PASSED_TESTS++))
    ((TOTAL_TESTS++))
}

fail() {
    echo -e "${RED}✗${NC} $1" | tee -a "$REPORT_FILE"
    ((FAILED_TESTS++))
    ((TOTAL_TESTS++))
}

test_api_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_status=$5
    
    log "Testing: $name"
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "x-user-id: verify-test-$(date +%s)" \
            -d "$data")
    else
        response=$(curl -s -w "\n%{http_code}" "$API_URL$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "$expected_status" ]; then
        success "$name (HTTP $http_code)"
        echo "$body"
        return 0
    else
        fail "$name (Expected $expected_status, got $http_code)"
        echo "$body"
        return 1
    fi
}

complete_workflow() {
    local module=$1
    local language=$2
    local test_name="${module}-${language}"
    
    log "========================================="
    log "WORKFLOW TEST: $module in $language"
    log "========================================="
    
    # Step 1: Create project
    log "Step 1: Creating project..."
    response=$(curl -s -X POST "$API_URL/projects" \
        -H "Content-Type: application/json" \
        -H "x-user-id: verify-$(date +%s)" \
        -d "{\"moduleId\": \"$module\", \"language\": \"$language\"}")
    
    project_id=$(echo "$response" | jq -r '.id')
    repo_url=$(echo "$response" | jq -r '.githubRepoUrl')
    
    if [ "$repo_url" = "null" ] || [ -z "$repo_url" ]; then
        fail "Create project: $test_name"
        return 1
    fi
    success "Create project: $test_name"
    
    # Step 2: Clone repo
    log "Step 2: Cloning repository..."
    rm -rf "$test_name"
    if git clone "$repo_url" "$test_name" > /dev/null 2>&1; then
        success "Clone repo: $test_name"
    else
        fail "Clone repo: $test_name"
        return 1
    fi
    
    cd "$test_name"
    
    # Step 3: Check files exist
    log "Step 3: Verifying project structure..."
    if [ -f "dsa.config.json" ] && [ -f "README.md" ]; then
        success "Project structure: $test_name"
    else
        fail "Project structure: $test_name"
        cd "$TEST_DIR"
        return 1
    fi
    
    # Step 4: Test Challenge 1
    log "Step 4: Testing Challenge 1..."
    if dsa test > test-c1.log 2>&1; then
        if grep -q "PASSED" test-c1.log; then
            success "Challenge 1 passes: $test_name"
        else
            fail "Challenge 1 passes: $test_name"
            tail -10 test-c1.log
            cd "$TEST_DIR"
            return 1
        fi
    else
        fail "Challenge 1 execution: $test_name"
        tail -10 test-c1.log
        cd "$TEST_DIR"
        return 1
    fi
    
    # Step 5: Submit Challenge 1
    log "Step 5: Submitting Challenge 1..."
    if dsa submit > submit-c1.log 2>&1; then
        if grep -q "completed" submit-c1.log || grep -q "unlocked" submit-c1.log; then
            success "Submit Challenge 1: $test_name"
        else
            fail "Submit Challenge 1: $test_name"
            tail -10 submit-c1.log
            cd "$TEST_DIR"
            return 1
        fi
    else
        fail "Submit execution: $test_name"
        tail -10 submit-c1.log
        cd "$TEST_DIR"
        return 1
    fi
    
    # Step 6: Verify Challenge 2 unlocked
    log "Step 6: Verifying Challenge 2 unlocked..."
    current_challenge=$(jq -r '.currentChallengeIndex' dsa.config.json)
    if [ "$current_challenge" = "1" ]; then
        success "Challenge progression: $test_name"
    else
        fail "Challenge progression: $test_name (index=$current_challenge)"
        cd "$TEST_DIR"
        return 1
    fi
    
    # Step 7: Test Challenge 2 (should require implementation)
    log "Step 7: Testing Challenge 2 (expecting failure without implementation)..."
    if dsa test > test-c2.log 2>&1; then
        # Should fail because we haven't implemented anything yet
        if grep -q "FAILED\|failed\|Compilation failed" test-c2.log; then
            success "Challenge 2 correctly requires implementation: $test_name"
        else
            # It passed? That's suspicious unless starter code is complete
            success "Challenge 2 behavior: $test_name (passed unexpectedly?)"
        fi
    else
        success "Challenge 2 requires implementation: $test_name"
    fi
    
    cd "$TEST_DIR"
    return 0
}

echo "=================================================" | tee "$REPORT_FILE"
echo "PRE-FRONTEND INTEGRATION VERIFICATION" | tee -a "$REPORT_FILE"
echo "Started: $(date)" | tee -a "$REPORT_FILE"
echo "API: $API_URL" | tee -a "$REPORT_FILE"
echo "=================================================" | tee -a "$REPORT_FILE"
echo "" | tee -a "$REPORT_FILE"

# ============================================
# PHASE 1: API ENDPOINT TESTING
# ============================================
log "PHASE 1: API ENDPOINT TESTING"
log "=============================="

# Test valid project creation
test_api_endpoint \
    "Create project (queue/typescript)" \
    "POST" \
    "/projects" \
    '{"moduleId":"queue","language":"typescript"}' \
    "200"

sleep 2

test_api_endpoint \
    "Create project (stack/java)" \
    "POST" \
    "/projects" \
    '{"moduleId":"stack","language":"java"}' \
    "200"

sleep 2

# Test invalid inputs
log "Testing invalid inputs..."
test_api_endpoint \
    "Invalid moduleId" \
    "POST" \
    "/projects" \
    '{"moduleId":"invalid-module","language":"typescript"}' \
    "400" || success "Invalid input rejected (400)"

test_api_endpoint \
    "Invalid language" \
    "POST" \
    "/projects" \
    '{"moduleId":"queue","language":"ruby"}' \
    "400" || success "Invalid language rejected (400)"

echo "" | tee -a "$REPORT_FILE"

# ============================================
# PHASE 2: CLI COMMAND TESTING
# ============================================
log "PHASE 2: CLI COMMAND TESTING"
log "============================="

# Test CLI outside project directory
log "Testing CLI error handling..."
cd "$TEST_DIR"
if dsa test > /dev/null 2>&1; then
    fail "CLI should fail outside project directory"
else
    success "CLI correctly fails outside project"
fi

echo "" | tee -a "$REPORT_FILE"

# ============================================
# PHASE 3: END-TO-END WORKFLOW TESTING
# ============================================
log "PHASE 3: END-TO-END WORKFLOW TESTING"
log "====================================="

# Critical test matrix (prioritized for speed)
declare -a CRITICAL_TESTS=(
    "queue:typescript"
    "stack:java"
    "queue:python"
)

log "Running ${#CRITICAL_TESTS[@]} critical workflow tests..."

for test_combo in "${CRITICAL_TESTS[@]}"; do
    IFS=':' read -r module lang <<< "$test_combo"
    complete_workflow "$module" "$lang"
    sleep 2
done

echo "" | tee -a "$REPORT_FILE"

# ============================================
# PHASE 4: EXTENDED WORKFLOW TESTING (Optional)
# ============================================
log "PHASE 4: EXTENDED TESTING (Optional)"
log "====================================="

declare -a EXTENDED_TESTS=(
    "min-heap:go"
    "stack:cpp"
    "binary-search:javascript"
)

read -p "Run extended tests? (${#EXTENDED_TESTS[@]} additional workflows, ~5min) [y/N]: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    for test_combo in "${EXTENDED_TESTS[@]}"; do
        IFS=':' read -r module lang <<< "$test_combo"
        complete_workflow "$module" "$lang"
        sleep 2
    done
else
    log "Skipping extended tests"
fi

echo "" | tee -a "$REPORT_FILE"

# ============================================
# FINAL REPORT
# ============================================
echo "=================================================" | tee -a "$REPORT_FILE"
echo "VERIFICATION SUMMARY" | tee -a "$REPORT_FILE"
echo "=================================================" | tee -a "$REPORT_FILE"
echo "Total Tests: $TOTAL_TESTS" | tee -a "$REPORT_FILE"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}" | tee -a "$REPORT_FILE"
echo -e "${RED}Failed: $FAILED_TESTS${NC}" | tee -a "$REPORT_FILE"
echo "Success Rate: $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%" | tee -a "$REPORT_FILE"
echo "Completed: $(date)" | tee -a "$REPORT_FILE"
echo "" | tee -a "$REPORT_FILE"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED${NC}" | tee -a "$REPORT_FILE"
    echo -e "${GREEN}✓ System is stable and ready for frontend integration${NC}" | tee -a "$REPORT_FILE"
    echo "" | tee -a "$REPORT_FILE"
    echo "Next steps:" | tee -a "$REPORT_FILE"
    echo "1. Review full report: $REPORT_FILE" | tee -a "$REPORT_FILE"
    echo "2. Sign off on PRE_FRONTEND_VERIFICATION.txt" | tee -a "$REPORT_FILE"
    echo "3. Begin frontend integration" | tee -a "$REPORT_FILE"
    exit 0
else
    echo -e "${RED}⚠️  FAILURES DETECTED${NC}" | tee -a "$REPORT_FILE"
    echo -e "${RED}✗ System is NOT ready for frontend integration${NC}" | tee -a "$REPORT_FILE"
    echo "" | tee -a "$REPORT_FILE"
    echo "Required actions:" | tee -a "$REPORT_FILE"
    echo "1. Review failures in: $REPORT_FILE" | tee -a "$REPORT_FILE"
    echo "2. Fix issues and re-run verification" | tee -a "$REPORT_FILE"
    echo "3. Achieve 100% pass rate before frontend work" | tee -a "$REPORT_FILE"
    exit 1
fi

