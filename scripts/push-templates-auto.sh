#!/bin/bash

# DSA Lab - Automated Template Push (requires GitHub CLI)
# Creates repos and pushes in one go

set -e

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Templates are in parent directory of the main repo
TEMPLATES_DIR="$SCRIPT_DIR/../../dsa-templates"
ORG_NAME="${1}"

if [ -z "$ORG_NAME" ]; then
  echo "❌ Error: Organization name required"
  echo "Usage: ./push-templates-auto.sh YOUR_ORG_NAME"
  exit 1
fi

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
  echo "❌ Error: GitHub CLI (gh) not found"
  echo "Install it: brew install gh"
  echo "Or use the manual script: ./push-templates.sh $ORG_NAME"
  exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
  echo "❌ Error: Not authenticated with GitHub CLI"
  echo "Run: gh auth login"
  exit 1
fi

echo "🚀 Automatically creating and pushing templates to: $ORG_NAME"
echo ""

# Verify templates directory exists
if [ ! -d "$TEMPLATES_DIR" ]; then
  echo "❌ Error: Templates directory not found at: $TEMPLATES_DIR"
  echo ""
  echo "Did you run create-templates.sh first?"
  echo "Run: cd $SCRIPT_DIR && ./create-templates.sh"
  exit 1
fi

echo "📁 Templates directory: $TEMPLATES_DIR"
echo ""

TEMPLATES=(
  "template-dsa-stack-ts"
  "template-dsa-queue-ts"
  "template-dsa-binary-search-ts"
  "template-dsa-min-heap-ts"
)

for TEMPLATE in "${TEMPLATES[@]}"; do
  echo "📦 Processing $TEMPLATE..."
  cd "$TEMPLATES_DIR/$TEMPLATE"
  
  # Initialize git
  if [ ! -d ".git" ]; then
    git init
    echo "  ✓ Git initialized"
  fi
  
  # Add and commit
  git add .
  if ! git diff --staged --quiet; then
    git commit -m "Initial template setup with tests and skeleton code"
    echo "  ✓ Committed"
  fi
  
  # Set default branch
  git branch -M main
  
  # Create GitHub repo and push
  echo "  🌐 Creating GitHub repository..."
  if gh repo create "$ORG_NAME/$TEMPLATE" --private --source=. --remote=origin --push; then
    echo "  ✅ Repository created and pushed!"
  else
    echo "  ⚠️  Failed to create. It might already exist."
    echo "  Trying to push to existing repo..."
    if ! git remote | grep -q "origin"; then
      git remote add origin "git@github.com:$ORG_NAME/$TEMPLATE.git"
    fi
    git push -u origin main
  fi
  
  echo "  ⚙️  Setting as template repository..."
  gh repo edit "$ORG_NAME/$TEMPLATE" --enable-issues=false --enable-wiki=false
  
  # Note: gh CLI doesn't support setting template flag directly
  echo "  ⚠️  Manual step needed: Mark as template"
  echo "  → https://github.com/$ORG_NAME/$TEMPLATE/settings"
  echo ""
done

echo ""
echo "🎉 All templates created and pushed!"
echo ""
echo "⚠️  Final manual step for each repository:"
echo "Mark as 'Template repository' in Settings"
echo ""
echo "Quick links:"
for TEMPLATE in "${TEMPLATES[@]}"; do
  echo "  https://github.com/$ORG_NAME/$TEMPLATE/settings"
done
echo ""
echo "✅ Once marked as templates, they're ready to use!"
echo ""

