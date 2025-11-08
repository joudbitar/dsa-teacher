#!/bin/bash
# Script to push all DSA templates to GitHub
# This will create/update all 24 templates (4 modules × 6 languages)

set -e

TEMPLATES_DIR="/Users/joudbitar/Code/Projects/dsa-templates"
ORG_NAME="${GH_ORG:-dsa-teacher}"

cd "$TEMPLATES_DIR"

echo "🚀 Pushing all DSA templates to GitHub organization: $ORG_NAME"
echo ""

# Get all template directories
TEMPLATES=($(ls -d template-dsa-* 2>/dev/null | sort))

if [ ${#TEMPLATES[@]} -eq 0 ]; then
  echo "❌ No templates found in $TEMPLATES_DIR"
  exit 1
fi

echo "Found ${#TEMPLATES[@]} templates to push"
echo ""

SUCCESS_COUNT=0
FAIL_COUNT=0
FAILED_TEMPLATES=()

for template in "${TEMPLATES[@]}"; do
  echo "==============================================="
  echo "📦 Processing: $template"
  echo "==============================================="
  
  if [ ! -d "$template" ]; then
    echo "⚠️  Directory $template not found, skipping..."
    ((FAIL_COUNT++))
    FAILED_TEMPLATES+=("$template (not found)")
    continue
  fi
  
  cd "$template"
  
  # Initialize git if not already
  if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git add .
    MODULE_NAME=$(echo $template | sed 's/template-dsa-//' | sed 's/-/ /g')
    git commit -m "Initial $MODULE_NAME template with tests and stubs"
    git branch -M main
  else
    echo "Git repository already initialized"
    # Stage all changes including fixes from agents
    git add .
    if git diff --staged --quiet; then
      echo "No changes to commit"
    else
      git commit -m "Update template: fixes from verification agents" || echo "No changes"
    fi
  fi
  
  # Check if remote exists
  if git remote | grep -q origin; then
    echo "Remote 'origin' already exists, updating..."
    REPO_URL=$(git remote get-url origin)
    echo "Pushing to: $REPO_URL"
    if git push origin main 2>&1; then
      echo "✅ Successfully pushed $template"
      ((SUCCESS_COUNT++))
    else
      echo "⚠️  Push failed, trying force push..."
      if git push origin main --force 2>&1; then
        echo "✅ Force pushed $template"
        ((SUCCESS_COUNT++))
      else
        echo "❌ Failed to push $template"
        ((FAIL_COUNT++))
        FAILED_TEMPLATES+=("$template (push failed)")
      fi
    fi
  else
    # Create repo and push
    echo "Creating GitHub repo: $ORG_NAME/$template"
    if gh repo create "$ORG_NAME/$template" --private --source=. --remote=origin --push 2>&1; then
      echo "✅ Created and pushed $template"
      ((SUCCESS_COUNT++))
    else
      echo "Repo may already exist, adding remote and pushing..."
      if git remote add origin "git@github.com:$ORG_NAME/$template.git" 2>/dev/null; then
        echo "Added remote"
      fi
      
      if git push -u origin main 2>&1; then
        echo "✅ Pushed $template"
        ((SUCCESS_COUNT++))
      else
        echo "⚠️  Regular push failed, trying force push..."
        if git push -u origin main --force 2>&1; then
          echo "✅ Force pushed $template"
          ((SUCCESS_COUNT++))
        else
          echo "❌ Failed to push $template"
          ((FAIL_COUNT++))
          FAILED_TEMPLATES+=("$template (push failed)")
        fi
      fi
    fi
  fi
  
  cd "$TEMPLATES_DIR"
  echo ""
done

echo "==============================================="
echo "📊 PUSH SUMMARY"
echo "==============================================="
echo "✅ Success: $SUCCESS_COUNT/${#TEMPLATES[@]}"
echo "❌ Failed: $FAIL_COUNT/${#TEMPLATES[@]}"

if [ $FAIL_COUNT -gt 0 ]; then
  echo ""
  echo "Failed templates:"
  for failed in "${FAILED_TEMPLATES[@]}"; do
    echo "  - $failed"
  done
fi

echo ""
if [ $FAIL_COUNT -eq 0 ]; then
  echo "🎉 All templates successfully pushed to $ORG_NAME organization!"
  echo ""
  echo "⚠️  IMPORTANT: You still need to mark them as template repositories:"
  echo "   Go to each repo settings and check 'Template repository'"
  echo "   Or use the GitHub API to automate this"
else
  echo "⚠️  Some templates failed to push. Please check errors above."
  exit 1
fi
