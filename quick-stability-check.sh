#!/bin/bash
# Quick Stability Check - Fast assessment before full verification

set -e

API_URL="https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "================================================="
echo "QUICK STABILITY CHECK"
echo "================================================="
echo ""

# 1. Check CLI
echo -n "Checking CLI installation... "
if command -v dsa &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC} dsa command not found"
    echo "Install with: cd cli && npm install -g ."
fi

# 2. Check API
echo -n "Checking API connectivity... "
response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/modules" 2>&1)
if [ "$response" = "200" ]; then
    echo -e "${GREEN}✓${NC}"
elif [ "$response" = "000" ]; then
    echo -e "${RED}✗${NC} Cannot reach API (network issue)"
else
    echo -e "${YELLOW}?${NC} API returned $response"
fi

# 3. Check templates are pushed
echo -n "Checking templates on GitHub... "
response=$(curl -s -o /dev/null -w "%{http_code}" "https://github.com/dsa-teacher/template-dsa-queue-java" 2>&1)
if [ "$response" = "200" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC} Template repos not accessible"
fi

# 4. Check template fixes
echo -n "Checking template test fixes... "
cd /Users/joudbitar/Code/Projects/dsa-templates
fixed_count=$(grep -r "assertDoesNotThrow.*enqueue" template-dsa-queue-*/tests/Test02* 2>/dev/null | wc -l | tr -d ' ')
if [ "$fixed_count" = "1" ]; then
    echo -e "${GREEN}✓${NC} (Java fixed)"
else
    echo -e "${RED}✗${NC} Expected 1 Java fix, found $fixed_count"
fi

# 5. Quick API test
echo -n "Testing API project creation... "
response=$(curl -s -X POST "$API_URL/projects" \
    -H "Content-Type: application/json" \
    -H "x-user-id: quick-check-$(date +%s)" \
    -d '{"moduleId": "queue", "language": "typescript"}' 2>&1)

if echo "$response" | jq -e '.githubRepoUrl' > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
    repo_url=$(echo "$response" | jq -r '.githubRepoUrl')
    echo "  Created: $repo_url"
else
    echo -e "${RED}✗${NC}"
    echo "  Response: $response"
fi

echo ""
echo "================================================="
echo "QUICK CHECK COMPLETE"
echo "================================================="
echo ""
echo "Next steps:"
echo "1. If all ✓ → Run full verification:"
echo "   ./pre-frontend-verification.sh"
echo ""
echo "2. If any ✗ → Fix issues and re-run quick check"
echo ""

