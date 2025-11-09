#!/bin/bash
# Remove auto-unlock from all templates - it should only happen in `dsa submit`
#
# This fixes the bug where:
# 1. User runs `dsa test` and passes challenge 0
# 2. Test runner auto-updates config to challenge 1
# 3. User runs `dsa submit`
# 4. Submit internally runs test, which now shows challenge 1
# 5. Validation fails because challenge 1 isn't implemented yet

set -e

TEMPLATES_DIR="/Users/joudbitar/Code/Projects/dsa-templates"

if [ ! -d "$TEMPLATES_DIR" ]; then
    echo "❌ Templates directory not found: $TEMPLATES_DIR"
    echo "Please update the TEMPLATES_DIR variable in this script"
    exit 1
fi

echo "📁 Using templates directory: $TEMPLATES_DIR"

cd "$TEMPLATES_DIR"

echo "🔧 Removing auto-unlock from all templates..."
echo ""

FIXED_COUNT=0
SKIPPED_COUNT=0

# Function to remove auto-unlock from Python run.py files
fix_python_runner() {
    local file=$1
    local template=$2
    
    # Check if it has auto-unlock
    if ! grep -q "Auto-unlock next challenge" "$file"; then
        echo "  ✓  Already clean (no auto-unlock)"
        ((SKIPPED_COUNT++))
        return
    fi
    
    echo "  🔧 Removing auto-unlock..."
    
    # Use Python to remove the auto-unlock section
    python3 - "$file" << 'PYTHON_FIX'
import sys
import re

file_path = sys.argv[1]

with open(file_path, 'r') as f:
    content = f.read()

# Remove the auto-unlock section (everything between json.dump and the final print)
# Pattern to match:
# - json.dump(report, f, indent=2)
# - newlines
# - Auto-unlock comment through the except block
# - newlines
# - print() or print(f"...")

pattern = r'''(with open\('\.dsa-report\.json', 'w'\) as f:\s+json\.dump\(report, f, indent=2\))
\s*
# Auto-unlock next challenge.*?
if report\['pass'\] and len\(locked_tests\) > 0:.*?
except Exception as e:.*?
\s*
(print\(\))'''

replacement = r'''\1
    
\2'''

# Apply the replacement
new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# If pattern didn't match, try alternate pattern
if new_content == content:
    # Try pattern with "pass" instead of ['pass']
    pattern = r'''(with open\('\.dsa-report\.json', 'w'\) as f:\s+json\.dump\(report, f, indent=2\))
\s*
# Auto-unlock next challenge.*?
if report\["pass"\] and len\(locked_tests\) > 0:.*?
except Exception as e:.*?
\s*
(print\(\))'''
    
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(file_path, 'w') as f:
    f.write(new_content)

print("  ✓ Removed auto-unlock section")
PYTHON_FIX

    ((FIXED_COUNT++))
}

# Function to remove auto-unlock from bash/Python runners (Java/C++/Go)
fix_bash_python_runner() {
    local file=$1
    local template=$2
    
    # Check if it has auto-unlock
    if ! grep -q "Auto-unlock next challenge" "$file"; then
        echo "  ✓  Already clean (no auto-unlock)"
        ((SKIPPED_COUNT++))
        return
    fi
    
    echo "  🔧 Removing auto-unlock..."
    
    # Use Python to remove the auto-unlock section from embedded Python
    python3 - "$file" << 'PYTHON_FIX'
import sys
import re

file_path = sys.argv[1]

with open(file_path, 'r') as f:
    content = f.read()

# Remove the auto-unlock section from embedded Python script
pattern = r'''(with open\("\.dsa-report\.json", "w"\) as f:\n\s+json\.dump\(report, f, indent=2\))
\s*
# Auto-unlock next challenge.*?
if report\["pass"\] and len\(locked_tests\) > 0:.*?
except Exception as e:.*?
\s*
(print\(\))'''

replacement = r'''\1
    
\2'''

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(file_path, 'w') as f:
    f.write(new_content)

print("  ✓ Removed auto-unlock section")
PYTHON_FIX

    ((FIXED_COUNT++))
}

# Function to remove auto-unlock from Node.js runners
fix_node_runner() {
    local file=$1
    local template=$2
    
    # Check if it has auto-unlock
    if ! grep -q "Auto-unlock next challenge" "$file"; then
        echo "  ✓  Already clean (no auto-unlock)"
        ((SKIPPED_COUNT++))
        return
    fi
    
    echo "  🔧 Removing auto-unlock..."
    
    # Use sed to remove the auto-unlock section
    # Find and remove everything from "// Auto-unlock" to the closing brace before writeFileSync
    sed -i.bak '/\/\/ Auto-unlock next challenge/,/^  }$/d' "$file"
    rm -f "${file}.bak"
    
    ((FIXED_COUNT++))
    echo "  ✓ Removed auto-unlock section"
}

# Process all templates
MODULES=("stack" "queue" "binary-search" "min-heap")

for module in "${MODULES[@]}"; do
    echo "📦 Processing module: $module"
    
    # Python
    if [ -f "template-dsa-${module}-py/tests/run.py" ]; then
        echo "  → Python runner"
        fix_python_runner "template-dsa-${module}-py/tests/run.py" "$module"
    fi
    
    # JavaScript
    if [ -f "template-dsa-${module}-js/tests/run.js" ]; then
        echo "  → JavaScript runner"
        fix_node_runner "template-dsa-${module}-js/tests/run.js" "$module"
    fi
    
    # TypeScript
    if [ -f "template-dsa-${module}-ts/tests/run.ts" ]; then
        echo "  → TypeScript runner"
        fix_node_runner "template-dsa-${module}-ts/tests/run.ts" "$module"
    fi
    
    # Java
    if [ -f "template-dsa-${module}-java/tests/run.sh" ]; then
        echo "  → Java runner"
        fix_bash_python_runner "template-dsa-${module}-java/tests/run.sh" "$module"
    fi
    
    # C++
    if [ -f "template-dsa-${module}-cpp/tests/run.sh" ]; then
        echo "  → C++ runner"
        fix_bash_python_runner "template-dsa-${module}-cpp/tests/run.sh" "$module"
    fi
    
    # Go
    if [ -f "template-dsa-${module}-go/tests/run.sh" ]; then
        echo "  → Go runner"
        fix_bash_python_runner "template-dsa-${module}-go/tests/run.sh" "$module"
    fi
    
    echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Complete!"
echo "   Fixed: $FIXED_COUNT templates"
echo "   Skipped: $SKIPPED_COUNT templates (already clean)"
echo ""
echo "📝 Summary of changes:"
echo "   - Removed auto-unlock code from test runners"
echo "   - Config updates now ONLY happen in 'dsa submit'"
echo "   - Test runners report currentChallengeIndex but don't modify it"
echo ""
echo "🚀 Next steps:"
echo "   1. Push all template changes to GitHub"
echo "   2. Existing user repos will need to be updated or recreated"
echo "   3. Test the fix with: dsa test && dsa submit"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

