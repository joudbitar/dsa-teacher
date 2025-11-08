#!/bin/bash
# Quick fix for any DSA repository with the auto-unlock bug
# Usage: Run this from inside your project directory
#   cd your-stack-py-repo
#   bash /path/to/fix-my-repo.sh

echo "🔧 Fixing auto-unlock bug in current repository..."
echo ""

# Check if we're in a DSA project
if [ ! -f "dsa.config.json" ]; then
    echo "❌ Error: dsa.config.json not found"
    echo "   Make sure you're in your project directory"
    exit 1
fi

# Find the test runner
RUNNER=""
if [ -f "tests/run.py" ]; then
    RUNNER="tests/run.py"
elif [ -f "tests/run.js" ]; then
    RUNNER="tests/run.js"
elif [ -f "tests/run.ts" ]; then
    RUNNER="tests/run.ts"
elif [ -f "tests/run.sh" ]; then
    RUNNER="tests/run.sh"
else
    echo "❌ Error: No test runner found in tests/"
    exit 1
fi

echo "Found test runner: $RUNNER"

# Check if it has the bug
if ! grep -q "Auto-unlock" "$RUNNER"; then
    echo "✅ Already fixed! No auto-unlock code found."
    exit 0
fi

echo "Found auto-unlock bug, fixing..."

# Create backup
cp "$RUNNER" "${RUNNER}.backup-$(date +%Y%m%d-%H%M%S)"
echo "✅ Backup created"

# Fix the file
python3 << 'EOF'
import re
import sys

runner = sys.argv[1]

with open(runner, 'r') as f:
    content = f.read()

# Remove auto-unlock section
patterns = [
    r'\n\s+# Auto-unlock next challenge.*?except Exception as e:.*?\n',
    r'\n\s+// Auto-unlock next challenge.*?}\n'
]

for pattern in patterns:
    content = re.sub(pattern, '\n', content, flags=re.DOTALL)

with open(runner, 'w') as f:
    f.write(content)

print("✅ Auto-unlock code removed")
EOF
python3 -c "import sys; sys.argv.append('$RUNNER')" "$RUNNER"

# Reset config to 0 if it got incremented
CURRENT_INDEX=$(python3 -c "import json; print(json.load(open('dsa.config.json'))['currentChallengeIndex'])")
if [ "$CURRENT_INDEX" != "0" ]; then
    echo ""
    echo "⚠️  Your currentChallengeIndex is $CURRENT_INDEX"
    read -p "Reset to 0? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        python3 -c "import json; c=json.load(open('dsa.config.json')); c['currentChallengeIndex']=0; json.dump(c, open('dsa.config.json','w'), indent=2)"
        echo "✅ Reset to 0"
    fi
fi

echo ""
echo "✅ Done! Now try:"
echo "   dsa test"
echo "   dsa submit"

