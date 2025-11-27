#!/bin/bash
# cleanup-templates.sh
# Removes unnecessary files from template repositories:
# - solutions/ directories
# - docs/ directories (if separate from README.md)
# - backup files (*.backup, .backup, etc.)

set -e

TEMPLATES_DIR="${1:-/Users/joudbitar/Code/Projects/dsa-templates}"

echo "🧹 Cleaning up template repositories"
echo "======================================"
echo ""
echo "Templates directory: $TEMPLATES_DIR"
echo ""

if [ ! -d "$TEMPLATES_DIR" ]; then
  echo "❌ Templates directory not found: $TEMPLATES_DIR"
  exit 1
fi

cd "$TEMPLATES_DIR"

# Get all template directories (only js, py, java)
TEMPLATES=($(ls -d template-dsa-*-js template-dsa-*-py template-dsa-*-java 2>/dev/null | sort))

if [ ${#TEMPLATES[@]} -eq 0 ]; then
  echo "❌ No supported templates found in $TEMPLATES_DIR"
  exit 1
fi

echo "Found ${#TEMPLATES[@]} templates to clean"
echo ""

SUCCESS_COUNT=0
CLEANED_COUNT=0

for template in "${TEMPLATES[@]}"; do
  echo "📦 $template"
  
  if [ ! -d "$template" ]; then
    echo "  ⚠️  Directory not found, skipping..."
    continue
  fi
  
  cd "$template"
  
  # Remove solutions/ directory
  if [ -d "solutions" ]; then
    echo "  🗑️  Removing solutions/ directory..."
    rm -rf solutions
    ((CLEANED_COUNT++))
  fi
  
  # Remove docs/ directory (but keep README.md)
  if [ -d "docs" ]; then
    echo "  🗑️  Removing docs/ directory..."
    rm -rf docs
    ((CLEANED_COUNT++))
  fi
  
  # Remove backup files
  BACKUP_FILES=$(find . -type f \( -name "*.backup" -o -name ".backup" -o -name "*~" -o -name "*.bak" \) 2>/dev/null | wc -l)
  if [ "$BACKUP_FILES" -gt 0 ]; then
    echo "  🗑️  Removing $BACKUP_FILES backup file(s)..."
    find . -type f \( -name "*.backup" -o -name ".backup" -o -name "*~" -o -name "*.bak" \) -delete 2>/dev/null || true
    ((CLEANED_COUNT++))
  fi
  
  # Remove .backups-* directories
  BACKUP_DIRS=$(find . -type d -name ".backups-*" 2>/dev/null | wc -l)
  if [ "$BACKUP_DIRS" -gt 0 ]; then
    echo "  🗑️  Removing $BACKUP_DIRS backup directory(ies)..."
    find . -type d -name ".backups-*" -exec rm -rf {} + 2>/dev/null || true
    ((CLEANED_COUNT++))
  fi
  
  echo "  ✅ Cleaned"
  ((SUCCESS_COUNT++))
  
  cd "$TEMPLATES_DIR"
  echo ""
done

echo "=============================================="
echo "📊 CLEANUP SUMMARY"
echo "=============================================="
echo "✅ Templates processed: $SUCCESS_COUNT/${#TEMPLATES[@]}"
echo "🗑️  Items removed: $CLEANED_COUNT"
echo ""

if [ $SUCCESS_COUNT -eq ${#TEMPLATES[@]} ]; then
  echo "🎉 All templates cleaned successfully!"
else
  echo "⚠️  Some templates may have been skipped."
fi

echo ""


