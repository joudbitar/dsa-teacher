#!/bin/bash
# Fix auto-unlock in all 24 templates (4 modules × 6 languages)

set -e

TEMPLATES_DIR="/Users/joudbitar/Code/Projects/dsa-templates"
cd "$TEMPLATES_DIR"

echo "🔧 Fixing auto-unlock in all templates..."
echo ""

FIXED_COUNT=0
SKIPPED_COUNT=0

# Function to fix Java/C++ run.sh files (Python embedded)
fix_bash_python_runner() {
    local file=$1
    local template=$2
    
    # Check if it already has auto-unlock
    if grep -q "Auto-unlock next challenge" "$file"; then
        echo "  ⏭️  Already has auto-unlock"
        ((SKIPPED_COUNT++))
        return
    fi
    
    # Add auto-unlock before the final print statement
    python3 - "$file" << 'PYTHON_FIX'
import sys
import re

file_path = sys.argv[1]

with open(file_path, 'r') as f:
    content = f.read()

# Find the pattern: json.dump(report, f, indent=2) followed by print and sys.exit
old_pattern = r'''(with open\("\.dsa-report\.json", "w"\) as f:\n\s+json\.dump\(report, f, indent=2\))\n\n(print\(f?"\\nSummary:)'''

new_code = r'''\1

# Auto-unlock next challenge if all tests passed and more challenges exist
if report["pass"] and len(locked_tests) > 0:
    new_index = current_index + 1
    try:
        with open('dsa.config.json', 'r') as f:
            config = json.load(f)
        config['currentChallengeIndex'] = new_index
        with open('dsa.config.json', 'w') as f:
            json.dump(config, f, indent=2)
        print(f"✓ Challenge unlocked! Next: {locked_tests[0][1]}")
    except Exception as e:
        print(f"Warning: Could not update config: {e}", file=sys.stderr)

\2'''

content_new = re.sub(old_pattern, new_code, content)

if content_new != content:
    with open(file_path, 'w') as f:
        f.write(content_new)
    print("  ✅ Fixed")
    sys.exit(0)
else:
    print("  ⚠️  Pattern not found, manual fix needed")
    sys.exit(1)
PYTHON_FIX
    
    if [ $? -eq 0 ]; then
        ((FIXED_COUNT++))
    else
        ((SKIPPED_COUNT++))
    fi
}

# Function to fix Python run.py files
fix_python_runner() {
    local file=$1
    local template=$2
    
    # Check if it already has auto-unlock
    if grep -q "Auto-unlock next challenge" "$file"; then
        echo "  ⏭️  Already has auto-unlock"
        ((SKIPPED_COUNT++))
        return
    fi
    
    python3 - "$file" << 'PYTHON_FIX'
import sys
import re

file_path = sys.argv[1]

with open(file_path, 'r') as f:
    content = f.read()

# Find the pattern after writing the report
old_pattern = r'''(    with open\('\.dsa-report\.json', 'w'\) as f:\n\s+json\.dump\(report, f, indent=2\))\n\n(    print\(\)\n    print\(f"Summary:)'''

new_code = r'''\1
    
    # Auto-unlock next challenge if all tests passed and more challenges exist
    if report['pass'] and len(locked_tests) > 0:
        new_index = current_challenge_index + 1
        try:
            with open('dsa.config.json', 'r') as f:
                config = json.load(f)
            config['currentChallengeIndex'] = new_index
            with open('dsa.config.json', 'w') as f:
                json.dump(config, f, indent=2)
            print(f"✓ Challenge unlocked! Next: {locked_tests[0]['slug']}")
        except Exception as e:
            print(f"Warning: Could not update config: {e}", file=sys.stderr)

\2'''

content_new = re.sub(old_pattern, new_code, content)

if content_new != content:
    with open(file_path, 'w') as f:
        f.write(content_new)
    print("  ✅ Fixed")
    sys.exit(0)
else:
    print("  ⚠️  Pattern not found, manual fix needed")
    sys.exit(1)
PYTHON_FIX
    
    if [ $? -eq 0 ]; then
        ((FIXED_COUNT++))
    else
        ((SKIPPED_COUNT++))
    fi
}

# Function to fix Node.js run.js files (TypeScript/JavaScript)
fix_node_runner() {
    local file=$1
    local template=$2
    
    # Check if it already has auto-unlock
    if grep -q "Auto-unlock next challenge" "$file"; then
        echo "  ⏭️  Already has auto-unlock"
        ((SKIPPED_COUNT++))
        return
    fi
    
    python3 - "$file" << 'PYTHON_FIX'
import sys
import re

file_path = sys.argv[1]

with open(file_path, 'r') as f:
    content = f.read()

# Find the pattern after writing the report
old_pattern = r'''(  writeFileSync\('\.dsa-report\.json', JSON\.stringify\(report, null, 2\)\);)\n\s+(console\.log\(''\);)'''

new_code = r'''\1
  
  // Auto-unlock next challenge if all tests passed and more challenges exist
  if (report.pass && lockedTests.length > 0) {
    try {
      const config = JSON.parse(readFileSync('dsa.config.json', 'utf-8'));
      config.currentChallengeIndex = currentChallengeIndex + 1;
      writeFileSync('dsa.config.json', JSON.stringify(config, null, 2));
      console.log(`✓ Challenge unlocked! Next: ${lockedTests[0].slug}`);
    } catch (error) {
      console.error('Warning: Could not update config:', error.message);
    }
  }

  \2'''

content_new = re.sub(old_pattern, new_code, content)

if content_new != content:
    with open(file_path, 'w') as f:
        f.write(content_new)
    print("  ✅ Fixed")
    sys.exit(0)
else:
    print("  ⚠️  Pattern not found, manual fix needed")
    sys.exit(1)
PYTHON_FIX
    
    if [ $? -eq 0 ]; then
        ((FIXED_COUNT++))
    else
        ((SKIPPED_COUNT++))
    fi
}

# Function to fix Go run.go files
fix_go_runner() {
    local file=$1
    local template=$2
    
    # Check if it already has auto-unlock
    if grep -q "Auto-unlock next challenge" "$file"; then
        echo "  ⏭️  Already has auto-unlock"
        ((SKIPPED_COUNT++))
        return
    fi
    
    python3 - "$file" << 'PYTHON_FIX'
import sys
import re

file_path = sys.argv[1]

with open(file_path, 'r') as f:
    content = f.read()

# Find the pattern after writing the report
old_pattern = r'''(\tdata, _ := json\.MarshalIndent\(report, "", "  "\)\n\tos\.WriteFile\("\.dsa-report\.json", data, 0644\))\n\s+(\tfmt\.Printf\("\\nSummary:)'''

new_code = r'''\1
	
	// Auto-unlock next challenge if all tests passed and more challenges exist
	if report.Pass && lockedCount > 0 {
		configData, err := os.ReadFile("dsa.config.json")
		if err == nil {
			var config map[string]interface{}
			if err := json.Unmarshal(configData, &config); err == nil {
				config["currentChallengeIndex"] = currentIndex + 1
				updatedConfig, _ := json.MarshalIndent(config, "", "  ")
				os.WriteFile("dsa.config.json", updatedConfig, 0644)
				fmt.Printf("✓ Challenge unlocked! Next: %s\n", allTests[currentIndex+1].slug)
			}
		}
	}

\2'''

content_new = re.sub(old_pattern, new_code, content)

if content_new != content:
    with open(file_path, 'w') as f:
        f.write(content_new)
    print("  ✅ Fixed")
    sys.exit(0)
else:
    print("  ⚠️  Pattern not found, manual fix needed")
    sys.exit(1)
PYTHON_FIX
    
    if [ $? -eq 0 ]; then
        ((FIXED_COUNT++))
    else
        ((SKIPPED_COUNT++))
    fi
}

# Process all templates
for template in template-dsa-*/; do
    template=${template%/}
    echo "📦 $template"
    
    # Detect language and fix appropriate runner
    if [ -f "$template/tests/run.sh" ]; then
        if [[ "$template" == *"-java" ]] || [[ "$template" == *"-cpp" ]]; then
            fix_bash_python_runner "$template/tests/run.sh" "$template"
        fi
    elif [ -f "$template/tests/run.py" ]; then
        fix_python_runner "$template/tests/run.py" "$template"
    elif [ -f "$template/tests/run.js" ]; then
        fix_node_runner "$template/tests/run.js" "$template"
    elif [ -f "$template/tests/run.go" ]; then
        fix_go_runner "$template/tests/run.go" "$template"
    else
        echo "  ⚠️  No test runner found"
        ((SKIPPED_COUNT++))
    fi
    echo ""
done

echo ""
echo "✅ Fixed: $FIXED_COUNT templates"
echo "⏭️  Skipped: $SKIPPED_COUNT templates"
echo ""
echo "🎉 Done! All templates updated with auto-unlock functionality."
