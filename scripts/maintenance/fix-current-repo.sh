#!/bin/bash
# Quick fix for the current user's Python stack repository
# Removes the auto-unlock that's causing dsa submit to fail

echo "🔧 Fixing auto-unlock in your Python stack repository..."
echo ""

# Find Python stack repos in common locations
POSSIBLE_PATHS=(
    "$HOME/test/*stack-py"
    "$HOME/*stack-py"
    "$PWD/../*stack-py"
    "$PWD/*stack-py"
)

REPO_FOUND=false

for pattern in "${POSSIBLE_PATHS[@]}"; do
    for repo in $pattern; do
        if [ -d "$repo/tests" ] && [ -f "$repo/tests/run.py" ]; then
            echo "Found repository: $repo"
            
            # Check if it has the auto-unlock bug
            if grep -q "Auto-unlock next challenge" "$repo/tests/run.py"; then
                echo "  → Has auto-unlock bug, fixing..."
                
                # Create a backup
                cp "$repo/tests/run.py" "$repo/tests/run.py.backup"
                echo "  → Backup created: tests/run.py.backup"
                
                # Remove the auto-unlock section
                python3 << PYTHON_FIX
import re

file_path = "$repo/tests/run.py"

with open(file_path, 'r') as f:
    content = f.read()

# Remove the auto-unlock section
pattern = r'''(    with open\('\.dsa-report\.json', 'w'\) as f:\s+json\.dump\(report, f, indent=2\))
\s+
    # Auto-unlock next challenge.*?
    try:.*?
    except Exception as e:.*?
\s+
    (print\(\))'''

replacement = r'''\1
    
    \2'''

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(file_path, 'w') as f:
    f.write(new_content)

print("  ✓ Fixed!")
PYTHON_FIX
                
                REPO_FOUND=true
                
                # Also reset the config to the correct index
                if [ -f "$repo/dsa.config.json" ]; then
                    echo ""
                    echo "📝 Note: Your dsa.config.json may have an incorrect index"
                    echo "   Current config:"
                    grep -A1 "currentChallengeIndex" "$repo/dsa.config.json" | head -1
                    echo ""
                    echo "   If this doesn't match your actual progress, edit it manually"
                    echo "   or use the 'Restart' button in the web app"
                fi
                
                echo ""
                echo "✅ Fixed! Now try:"
                echo "   cd $repo"
                echo "   dsa test"
                echo "   dsa submit"
            else
                echo "  → Already fixed or doesn't have auto-unlock"
                REPO_FOUND=true
            fi
        fi
    done
done

if [ "$REPO_FOUND" = false ]; then
    echo "❌ Could not find your Python stack repository"
    echo ""
    echo "To fix manually:"
    echo "1. Go to your stack repository"
    echo "2. Edit tests/run.py"
    echo "3. Remove lines 92-103 (the 'Auto-unlock next challenge' section)"
    echo "4. Save and run: dsa test && dsa submit"
fi

