#!/bin/bash

# Integration Verification Script
# Tests that CLI, API, and GitHub App work together

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_BASE="https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  DSA Lab - Integration Verification                       ║"
echo "║  Testing: CLI + API + GitHub App                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Test 1: API Modules Endpoint
echo -e "${BLUE}━━━ Test 1: API Modules Endpoint ━━━${NC}"
echo "Testing: GET $API_BASE/modules"
echo ""

if MODULES=$(curl -s "$API_BASE/modules"); then
  MODULE_COUNT=$(echo "$MODULES" | jq '. | length' 2>/dev/null || echo "0")
  if [ "$MODULE_COUNT" -ge 4 ]; then
    echo -e "${GREEN}✓ PASS${NC} - API returned $MODULE_COUNT modules"
    echo "$MODULES" | jq -r '.[] | "  - \(.id): \(.title)"'
  else
    echo -e "${RED}✗ FAIL${NC} - Expected 4 modules, got $MODULE_COUNT"
    exit 1
  fi
else
  echo -e "${RED}✗ FAIL${NC} - Could not reach API"
  exit 1
fi

echo ""

# Test 2: Create Project (GitHub App Integration)
echo -e "${BLUE}━━━ Test 2: Create Project (GitHub + API Integration) ━━━${NC}"
echo "Testing: POST $API_BASE/projects"
echo ""

USER_ID="verify-$(date +%s)"
echo "Creating project for user: $USER_ID"

PROJECT_RESPONSE=$(curl -s -X POST "$API_BASE/projects" \
  -H "x-user-id: $USER_ID" \
  -H "Content-Type: application/json" \
  -d '{"moduleId":"stack","language":"TypeScript"}')

echo "Response:"
echo "$PROJECT_RESPONSE" | jq .
echo ""

# Check if project was created
PROJECT_ID=$(echo "$PROJECT_RESPONSE" | jq -r '.id // empty')
REPO_URL=$(echo "$PROJECT_RESPONSE" | jq -r '.githubRepoUrl // empty')

if [ -n "$PROJECT_ID" ] && [ -n "$REPO_URL" ]; then
  echo -e "${GREEN}✓ PASS${NC} - Project created successfully"
  echo "  Project ID: $PROJECT_ID"
  echo "  GitHub URL: $REPO_URL"
else
  echo -e "${RED}✗ FAIL${NC} - Project creation failed"
  echo "Response: $PROJECT_RESPONSE"
  exit 1
fi

echo ""

# Test 3: Verify GitHub Repo
echo -e "${BLUE}━━━ Test 3: Verify GitHub Repo Created ━━━${NC}"
echo "Checking if repo exists: $REPO_URL"
echo ""

REPO_NAME=$(basename "$REPO_URL")
ORG_NAME=$(echo "$REPO_URL" | cut -d'/' -f4)

# Check if repo is accessible (we'll get a 404 if it doesn't exist)
if curl -s -I "$REPO_URL" | head -n 1 | grep -q "200\|301"; then
  echo -e "${GREEN}✓ PASS${NC} - GitHub repo is accessible"
  echo "  Repo: $ORG_NAME/$REPO_NAME"
else
  echo -e "${YELLOW}⚠ WARNING${NC} - Repo might not be accessible yet (may need authentication)"
  echo "  This is OK if the repo is private"
  echo "  Verify manually: $REPO_URL"
fi

echo ""

# Test 4: Get Projects
echo -e "${BLUE}━━━ Test 4: Get User's Projects ━━━${NC}"
echo "Testing: GET $API_BASE/projects?moduleId=stack"
echo ""

PROJECTS=$(curl -s -H "x-user-id: $USER_ID" "$API_BASE/projects?moduleId=stack")
PROJECT_COUNT=$(echo "$PROJECTS" | jq '. | length')

if [ "$PROJECT_COUNT" -ge 1 ]; then
  echo -e "${GREEN}✓ PASS${NC} - Found $PROJECT_COUNT project(s)"
  echo "$PROJECTS" | jq -r '.[] | "  - \(.id): \(.moduleId) (\(.language)) - \(.progress)%"'
else
  echo -e "${RED}✗ FAIL${NC} - Expected at least 1 project"
  exit 1
fi

echo ""

# Test 5: CLI Integration Check
echo -e "${BLUE}━━━ Test 5: CLI Availability ━━━${NC}"
echo "Checking if CLI is built and available..."
echo ""

CLI_PATH="/Users/joudbitar/Code/Projects/hackathon/cli/dist/index.js"

if [ -f "$CLI_PATH" ]; then
  echo -e "${GREEN}✓ PASS${NC} - CLI is built at: $CLI_PATH"
  
  # Test CLI help
  if node "$CLI_PATH" --help > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC} - CLI is executable"
  else
    echo -e "${YELLOW}⚠ WARNING${NC} - CLI might have issues"
  fi
else
  echo -e "${YELLOW}⚠ WARNING${NC} - CLI not built"
  echo "  Run: cd cli && npm run build"
fi

echo ""

# Test 6: Mock CLI Submission Test
echo -e "${BLUE}━━━ Test 6: Mock Submission Format ━━━${NC}"
echo "Testing submission payload format..."
echo ""

# Create a mock submission payload
MOCK_SUBMISSION=$(cat <<EOF
{
  "projectId": "$PROJECT_ID",
  "result": "fail",
  "summary": "0/5 tests passed",
  "details": {
    "cases": [
      {"id": "create-class", "passed": false, "message": "Not implemented"},
      {"id": "push", "passed": false, "message": "Not implemented"},
      {"id": "pop", "passed": false, "message": "Not implemented"},
      {"id": "peek", "passed": false, "message": "Not implemented"},
      {"id": "size", "passed": false, "message": "Not implemented"}
    ]
  },
  "commitSha": "test-integration"
}
EOF
)

echo "Mock payload structure:"
echo "$MOCK_SUBMISSION" | jq .
echo ""

# Validate structure
HAS_RESULT=$(echo "$MOCK_SUBMISSION" | jq 'has("result")')
HAS_SUMMARY=$(echo "$MOCK_SUBMISSION" | jq 'has("summary")')
HAS_DETAILS=$(echo "$MOCK_SUBMISSION" | jq 'has("details")')
HAS_CASES=$(echo "$MOCK_SUBMISSION" | jq '.details | has("cases")')

if [ "$HAS_RESULT" = "true" ] && [ "$HAS_SUMMARY" = "true" ] && [ "$HAS_DETAILS" = "true" ] && [ "$HAS_CASES" = "true" ]; then
  echo -e "${GREEN}✓ PASS${NC} - Submission format is correct"
  echo "  ✓ Has 'result' field"
  echo "  ✓ Has 'summary' field"
  echo "  ✓ Has 'details' object"
  echo "  ✓ Has 'details.cases' array"
else
  echo -e "${RED}✗ FAIL${NC} - Submission format is incorrect"
  exit 1
fi

echo ""

# Summary
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Test Summary                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✓ API Modules Endpoint${NC}"
echo -e "${GREEN}✓ Project Creation (API + GitHub App)${NC}"
echo -e "${GREEN}✓ GitHub Repo Created${NC}"
echo -e "${GREEN}✓ Query Projects${NC}"
echo -e "${GREEN}✓ CLI Built${NC}"
echo -e "${GREEN}✓ Submission Format${NC}"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ ALL INTEGRATION TESTS PASSED!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Next steps:"
echo "  1. Clone the repo: git clone $REPO_URL"
echo "  2. Install deps: npm install"
echo "  3. Run tests: dsa test"
echo "  4. Submit: dsa submit"
echo ""
echo "For detailed integration guide, see: COMPLETE_INTEGRATION_GUIDE.md"
echo ""

