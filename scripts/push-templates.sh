#!/bin/bash

# DSA Lab - Push Templates to GitHub
# Initializes git repos and pushes to GitHub organization

set -e

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Templates are in parent directory of the main repo
TEMPLATES_DIR="$SCRIPT_DIR/../../dsa-templates"
ORG_NAME="${1}"

if [ -z "$ORG_NAME" ]; then
  echo "❌ Error: Organization name required"
  echo "Usage: ./push-templates.sh YOUR_ORG_NAME"
  exit 1
fi

echo "🚀 Pushing templates to GitHub organization: $ORG_NAME"
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
  
  # Initialize git if not already
  if [ ! -d ".git" ]; then
    git init
    echo "  ✓ Git initialized"
  fi
  
  # Add all files
  git add .
  
  # Commit
  if git diff --staged --quiet; then
    echo "  ℹ No changes to commit"
  else
    git commit -m "Initial template setup with tests and skeleton code"
    echo "  ✓ Committed"
  fi
  
  # Set default branch to main
  git branch -M main
  
  echo ""
  echo "  📝 Next: Create the GitHub repository"
  echo "  Run this command (or create via GitHub UI):"
  echo ""
  echo "  gh repo create $ORG_NAME/$TEMPLATE --private --source=. --remote=origin"
  echo ""
  echo "  Or manually:"
  echo "  1. Go to https://github.com/organizations/$ORG_NAME/repositories/new"
  echo "  2. Name: $TEMPLATE"
  echo "  3. Private: ✓"
  echo "  4. Don't initialize with README"
  echo "  5. Then run:"
  echo ""
  echo "  git remote add origin git@github.com:$ORG_NAME/$TEMPLATE.git"
  echo "  git push -u origin main"
  echo ""
  
  read -p "  Press Enter when repository is created and you're ready to continue..."
  
  # Check if remote exists
  if git remote | grep -q "origin"; then
    echo "  ℹ Remote 'origin' already exists, skipping remote add"
  else
    # Try to add remote (will fail if user hasn't created repo yet)
    if git remote add origin "git@github.com:$ORG_NAME/$TEMPLATE.git" 2>/dev/null; then
      echo "  ✓ Remote added"
    else
      echo "  ℹ Remote already configured"
    fi
  fi
  
  # Push to GitHub
  echo "  🚀 Pushing to GitHub..."
  if git push -u origin main 2>/dev/null; then
    echo "  ✅ Pushed successfully!"
  else
    echo "  ⚠️  Push failed. Repository might not exist yet."
    echo "  Please create it on GitHub and try pushing manually:"
    echo "  cd $TEMPLATES_DIR/$TEMPLATE && git push -u origin main"
  fi
  
  # Set as template repository
  echo ""
  echo "  ⚙️  Final step: Mark as template repository"
  echo "  Go to: https://github.com/$ORG_NAME/$TEMPLATE/settings"
  echo "  Check: ☑ Template repository"
  echo ""
  
  read -p "  Press Enter to continue to next template..."
  echo ""
  echo "---"
  echo ""
done

echo ""
echo "🎉 All templates processed!"
echo ""
echo "📋 Checklist for each template:"
echo "  ✓ Code pushed to GitHub"
echo "  □ Mark as template repository (Settings → Template repository)"
echo "  □ Verify repository is private"
echo ""
echo "Quick links:"
for TEMPLATE in "${TEMPLATES[@]}"; do
  echo "  https://github.com/$ORG_NAME/$TEMPLATE/settings"
done
echo ""

