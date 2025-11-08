#!/bin/bash
# Fix test file structure for ALL languages to support progressive unlocking
# Problem: Some languages compile all test code at once, breaking progressive discovery

set -e

TEMPLATES_DIR="/Users/joudbitar/Code/Projects/dsa-templates"

echo "🔧 Fixing test structures for progressive unlocking..."
echo "=================================================="

# Go templates - need separate test files
GO_TEMPLATES=(
  "template-dsa-stack-go"
  "template-dsa-queue-go"
  "template-dsa-binary-search-go"
  "template-dsa-min-heap-go"
)

fix_go_template() {
  local template=$1
  echo "📦 Fixing Go template: $template"
  cd "$TEMPLATES_DIR/$template"
  
  # Check if test file exists
  if [ ! -f stack_test.go ] && [ ! -f queue_test.go ] && [ ! -f binary_search_test.go ] && [ ! -f min_heap_test.go ]; then
    echo "  ⚠️  No test file found, skipping"
    return
  fi
  
  # Extract module name from directory
  module=$(echo $template | sed 's/template-dsa-//' | sed 's/-go$//')
  test_file="${module//-/_}_test.go"
  
  if [ ! -f "$test_file" ]; then
    echo "  ⚠️  Expected $test_file not found, skipping"
    return
  fi
  
  echo "  Splitting $test_file into separate files..."
  
  # Create tests directory if it doesn't exist
  mkdir -p tests
  
  # Split test file using awk to separate by function
  awk '
    BEGIN { filenum=1; filename=""; }
    /^func Test/ {
      if (filename != "") close(filename);
      testname = $2;
      gsub(/\(.*/, "", testname);
      filename = sprintf("tests/%02d_%s_test.go", filenum, tolower(testname));
      filenum++;
      print "package main" > filename;
      print "" >> filename;
      print "import \"testing\"" >> filename;
      print "" >> filename;
    }
    /^func Test/ { in_test=1; }
    in_test { print >> filename; }
    /^}$/ && in_test { in_test=0; }
  ' "$test_file"
  
  echo "  ✓ Split into $(ls tests/*_test.go 2>/dev/null | wc -l | tr -d ' ') files"
  
  # Update run.go to compile only unlocked tests
  if [ -f "tests/run.go" ]; then
    echo "  Updating tests/run.go to compile only unlocked tests..."
    # This will be handled separately for each module
  fi
}

# Java templates - already use JUnit with separate files (should be OK)
echo ""
echo "Checking Java templates..."
JAVA_TEMPLATES=(
  "template-dsa-stack-java"
  "template-dsa-queue-java"
  "template-dsa-binary-search-java"
  "template-dsa-min-heap-java"
)

for template in "${JAVA_TEMPLATES[@]}"; do
  if [ -d "$TEMPLATES_DIR/$template" ]; then
    cd "$TEMPLATES_DIR/$template"
    test_count=$(find src/test/java -name "Test*.java" 2>/dev/null | wc -l | tr -d ' ')
    echo "  $template: $test_count test files (✓ already separate)"
  fi
done

# C++ templates - check structure
echo ""
echo "Checking C++ templates..."
CPP_TEMPLATES=(
  "template-dsa-stack-cpp"
  "template-dsa-queue-cpp"
  "template-dsa-binary-search-cpp"
  "template-dsa-min-heap-cpp"
)

for template in "${CPP_TEMPLATES[@]}"; do
  if [ -d "$TEMPLATES_DIR/$template" ]; then
    cd "$TEMPLATES_DIR/$template"
    test_count=$(find tests -name "test_*.cpp" 2>/dev/null | wc -l | tr -d ' ')
    echo "  $template: $test_count test files"
  fi
done

echo ""
echo "=================================================="
echo "Starting Go template fixes..."
echo ""

for template in "${GO_TEMPLATES[@]}"; do
  if [ -d "$TEMPLATES_DIR/$template" ]; then
    fix_go_template "$template"
  else
    echo "⚠️  Template not found: $template"
  fi
done

echo ""
echo "✅ Test structure fixes complete!"
echo ""
echo "Next steps:"
echo "1. Update test runners to compile only unlocked test files"
echo "2. Test each language with progressive unlocking"
echo "3. Push updated templates to GitHub"

