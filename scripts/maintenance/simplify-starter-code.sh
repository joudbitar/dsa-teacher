#!/bin/bash
# simplify-starter-code.sh
# Creates minimal starter code files in all templates
# Just tells users to write code - no method stubs, no challenge hints

set -e

TEMPLATES_DIR="/Users/joudbitar/Code/Projects/dsa-templates"

echo "🧹 Simplifying starter code in all templates"
echo "=============================================="
echo ""

if [ ! -d "$TEMPLATES_DIR" ]; then
  echo "❌ Templates directory not found: $TEMPLATES_DIR"
  exit 1
fi

cd "$TEMPLATES_DIR"

SUCCESS_COUNT=0
SKIP_COUNT=0

# TypeScript templates
for module in stack queue binary-search min-heap; do
  template="template-dsa-${module}-ts"
  if [ -d "$template/src" ]; then
    echo "📦 $template"
    
    # Determine the main file name
    case $module in
      binary-search)
        filename="binarySearch.ts"
        ;;
      min-heap)
        filename="MinHeap.ts"
        ;;
      *)
        filename="$(echo $module | sed 's/-//g').ts"
        ;;
    esac
    
    cat > "$template/src/$filename" << 'EOF'
// Write your code here
// The tests will guide you on what to implement

EOF
    echo "  ✅ Simplified src/$filename"
    ((SUCCESS_COUNT++))
  fi
done

# JavaScript templates
for module in stack queue binary-search min-heap; do
  template="template-dsa-${module}-js"
  if [ -d "$template/src" ]; then
    echo "📦 $template"
    
    case $module in
      binary-search)
        filename="binarySearch.js"
        ;;
      min-heap)
        filename="MinHeap.js"
        ;;
      *)
        filename="$(echo $module | sed 's/-//g').js"
        ;;
    esac
    
    cat > "$template/src/$filename" << 'EOF'
// Write your code here
// The tests will guide you on what to implement

EOF
    echo "  ✅ Simplified src/$filename"
    ((SUCCESS_COUNT++))
  fi
done

# Python templates
for module in stack queue binary-search min-heap; do
  template="template-dsa-${module}-py"
  if [ -d "$template/src" ]; then
    echo "📦 $template"
    
    case $module in
      binary-search)
        filename="binary_search.py"
        ;;
      min-heap)
        filename="min_heap.py"
        ;;
      *)
        filename="${module//-/_}.py"
        ;;
    esac
    
    cat > "$template/src/$filename" << 'EOF'
# Write your code here
# The tests will guide you on what to implement

EOF
    echo "  ✅ Simplified src/$filename"
    ((SUCCESS_COUNT++))
  fi
done

# Go templates
for module in stack queue binary-search min-heap; do
  template="template-dsa-${module}-go"
  if [ -d "$template" ]; then
    echo "📦 $template"
    
    case $module in
      binary-search)
        filename="binary_search.go"
        ;;
      min-heap)
        filename="min_heap.go"
        ;;
      *)
        filename="${module//-/_}.go"
        ;;
    esac
    
    cat > "$template/$filename" << 'EOF'
package main

// Write your code here
// The tests will guide you on what to implement

EOF
    echo "  ✅ Simplified $filename"
    ((SUCCESS_COUNT++))
  fi
done

# Java templates
for module in stack queue binary-search min-heap; do
  template="template-dsa-${module}-java"
  if [ -d "$template/src/main/java" ]; then
    echo "📦 $template"
    
    case $module in
      binary-search)
        classname="BinarySearch"
        ;;
      min-heap)
        classname="MinHeap"
        ;;
      queue)
        classname="Queue"
        ;;
      stack)
        classname="Stack"
        ;;
    esac
    
    cat > "$template/src/main/java/${classname}.java" << EOF
// Write your code here
// The tests will guide you on what to implement

public class ${classname} {
    
}
EOF
    echo "  ✅ Simplified src/main/java/${classname}.java"
    ((SUCCESS_COUNT++))
  fi
done

# C++ templates
for module in stack queue binary-search min-heap; do
  template="template-dsa-${module}-cpp"
  if [ -d "$template/src" ]; then
    echo "📦 $template"
    
    case $module in
      binary-search)
        filename="binary_search"
        ;;
      min-heap)
        filename="min_heap"
        ;;
      *)
        filename="${module//-/_}"
        ;;
    esac
    
    cat > "$template/src/${filename}.h" << 'EOF'
// Write your code here
// The tests will guide you on what to implement

EOF
    echo "  ✅ Simplified src/${filename}.h"
    ((SUCCESS_COUNT++))
  fi
done

echo ""
echo "=============================================="
echo "📊 SUMMARY"
echo "=============================================="
echo "✅ Simplified: $SUCCESS_COUNT files"
echo "⚠️  Skipped: $SKIP_COUNT files"
echo ""
echo "✨ All starter code is now minimal!"
echo ""

