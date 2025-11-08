#!/bin/bash
# Script to mark all DSA repositories as GitHub template repositories

set -e

ORG_NAME="${GH_ORG:-dsa-teacher}"

echo "🔧 Marking all repositories in $ORG_NAME as template repositories..."
echo ""

# Get all repositories in the organization that start with "template-dsa-"
REPOS=$(gh repo list "$ORG_NAME" --limit 100 --json name --jq '.[] | select(.name | startswith("template-dsa-")) | .name')

if [ -z "$REPOS" ]; then
  echo "❌ No template repositories found in $ORG_NAME organization"
  exit 1
fi

SUCCESS_COUNT=0
FAIL_COUNT=0
TOTAL_COUNT=$(echo "$REPOS" | wc -l | tr -d ' ')

echo "Found $TOTAL_COUNT template repositories"
echo ""

for repo in $REPOS; do
  echo "Processing: $repo"
  
  # Use GitHub API to mark repository as template
  if gh api -X PATCH "/repos/$ORG_NAME/$repo" -f is_template=true > /dev/null 2>&1; then
    echo "✅ $repo marked as template"
    ((SUCCESS_COUNT++))
  else
    echo "❌ Failed to mark $repo as template"
    ((FAIL_COUNT++))
  fi
done

echo ""
echo "==============================================="
echo "📊 SUMMARY"
echo "==============================================="
echo "✅ Success: $SUCCESS_COUNT/$TOTAL_COUNT"
echo "❌ Failed: $FAIL_COUNT/$TOTAL_COUNT"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
  echo "🎉 All repositories successfully marked as templates!"
else
  echo "⚠️  Some repositories failed. Please check errors above."
  exit 1
fi

