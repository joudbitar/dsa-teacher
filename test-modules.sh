#!/bin/bash
# Simple automated test script for DSA Lab modules
# Tests that challenges don't require size() before the size challenge

API_URL="https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1"
TEST_DIR=~/dsa-testing
RESULTS_FILE="$TEST_DIR/test-results.txt"

# Test combinations to check
declare -a TESTS=(
    "queue:java"
    "queue:cpp"
    "stack:go"
    "min-heap:java"
    "stack:python"
    "queue:typescript"
)

mkdir -p "$TEST_DIR"
cd "$TEST_DIR"
echo "=== DSA Lab Module Testing ===" > "$RESULTS_FILE"
echo "Date: $(date)" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

test_module() {
    local MODULE=$1
    local LANG=$2
    local TEST_NAME="${MODULE}-${LANG}"
    
    echo ""
    echo "========================================="
    echo "Testing: $MODULE in $LANG"
    echo "========================================="
    
    # Create project
    echo "Creating project..."
    curl -s -X POST "$API_URL/projects" \
        -H "Content-Type: application/json" \
        -H "x-user-id: agent-test-$(date +%s)" \
        -d "{\"moduleId\": \"$MODULE\", \"language\": \"$LANG\"}" \
        > "${TEST_NAME}.json"
    
    REPO_URL=$(jq -r '.githubRepoUrl' "${TEST_NAME}.json")
    
    if [ "$REPO_URL" = "null" ] || [ -z "$REPO_URL" ]; then
        echo "❌ FAILED: Could not create project for $MODULE + $LANG"
        echo "❌ $TEST_NAME: Project creation failed" >> "$RESULTS_FILE"
        return 1
    fi
    
    echo "Repo URL: $REPO_URL"
    
    # Clone repo
    rm -rf "$TEST_NAME"
    git clone "$REPO_URL" "$TEST_NAME" 2>&1 | grep -v "Cloning"
    cd "$TEST_NAME"
    
    # Test Challenge 1
    echo ""
    echo "--- Testing Challenge 1 (should pass with starter code) ---"
    dsa test > "${TEST_NAME}-c1.log" 2>&1
    
    if grep -q "PASSED" "${TEST_NAME}-c1.log"; then
        echo "✅ Challenge 1: PASSED"
        echo "✅ $TEST_NAME Challenge 1: PASSED" >> "$RESULTS_FILE"
    else
        echo "❌ Challenge 1: FAILED"
        echo "Error output:"
        tail -20 "${TEST_NAME}-c1.log"
        echo "❌ $TEST_NAME Challenge 1: FAILED" >> "$RESULTS_FILE"
        cd "$TEST_DIR"
        return 1
    fi
    
    # Submit Challenge 1
    dsa submit > /dev/null 2>&1
    
    # Test Challenge 2 - check for size() errors
    echo ""
    echo "--- Testing Challenge 2 (checking for size() dependencies) ---"
    dsa test > "${TEST_NAME}-c2.log" 2>&1
    
    # Check if it's complaining about missing size()
    if grep -qi "cannot find.*size" "${TEST_NAME}-c2.log" || \
       grep -qi "undefined.*size" "${TEST_NAME}-c2.log" || \
       grep -qi "size.*not defined" "${TEST_NAME}-c2.log"; then
        echo "❌ Challenge 2: STILL REQUIRES size()"
        echo "Found size() dependency:"
        grep -i "size" "${TEST_NAME}-c2.log" | head -5
        echo "❌ $TEST_NAME Challenge 2: STILL REQUIRES size()" >> "$RESULTS_FILE"
        cd "$TEST_DIR"
        return 1
    else
        echo "✅ Challenge 2: No size() dependency found"
        echo "✅ $TEST_NAME Challenge 2: No size() dependency" >> "$RESULTS_FILE"
    fi
    
    cd "$TEST_DIR"
    return 0
}

# Run all tests
PASSED=0
FAILED=0

for test_combo in "${TESTS[@]}"; do
    IFS=':' read -r module lang <<< "$test_combo"
    
    if test_module "$module" "$lang"; then
        ((PASSED++))
    else
        ((FAILED++))
    fi
    
    echo ""
    sleep 2  # Rate limiting
done

# Summary
echo "" | tee -a "$RESULTS_FILE"
echo "=========================================" | tee -a "$RESULTS_FILE"
echo "SUMMARY" | tee -a "$RESULTS_FILE"
echo "=========================================" | tee -a "$RESULTS_FILE"
echo "Total tests: $((PASSED + FAILED))" | tee -a "$RESULTS_FILE"
echo "Passed: $PASSED" | tee -a "$RESULTS_FILE"
echo "Failed: $FAILED" | tee -a "$RESULTS_FILE"
echo "" | tee -a "$RESULTS_FILE"
echo "Full results saved to: $RESULTS_FILE"

if [ $FAILED -eq 0 ]; then
    echo "🎉 All tests passed!"
    exit 0
else
    echo "⚠️  Some tests failed. Check logs in $TEST_DIR"
    exit 1
fi

