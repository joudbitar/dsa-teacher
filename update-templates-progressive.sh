#!/bin/bash
# update-templates-progressive.sh
# Updates test runners in all 24 template repositories to support progressive unlocking
# This script is IDEMPOTENT and creates backups before any modifications

set -e

TEMPLATES_DIR="/Users/joudbitar/Code/Projects/dsa-templates"
BACKUP_DIR="${TEMPLATES_DIR}/.backups-$(date +%Y%m%d-%H%M%S)"

echo "🔧 DSA Templates Progressive Unlocking Update"
echo "=============================================="
echo ""
echo "Templates directory: $TEMPLATES_DIR"
echo "Backup directory: $BACKUP_DIR"
echo ""

if [ ! -d "$TEMPLATES_DIR" ]; then
  echo "❌ Templates directory not found: $TEMPLATES_DIR"
  exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"
echo "✓ Created backup directory"
echo ""

cd "$TEMPLATES_DIR"

# Get all template directories
TEMPLATES=($(ls -d template-dsa-* 2>/dev/null | sort))

if [ ${#TEMPLATES[@]} -eq 0 ]; then
  echo "❌ No templates found in $TEMPLATES_DIR"
  exit 1
fi

echo "Found ${#TEMPLATES[@]} templates to update"
echo ""

SUCCESS_COUNT=0
SKIP_COUNT=0

for template in "${TEMPLATES[@]}"; do
  echo "=============================================="
  echo "📦 $template"
  echo "=============================================="
  
  if [ ! -d "$template" ]; then
    echo "  ⚠️  Directory not found, skipping..."
    ((SKIP_COUNT++))
    continue
  fi
  
  # Extract module name from template name
  module=$(echo "$template" | sed 's/template-dsa-//' | sed 's/-ts$//' | sed 's/-js$//' | sed 's/-py$//' | sed 's/-java$//' | sed 's/-cpp$//' | sed 's/-go$//')
  lang=$(echo "$template" | sed 's/.*-//')
  
  cd "$template"
  
  # Update based on language
  case $lang in
    ts|js)
      if [ -f "tests/run.js" ]; then
        echo "  Updating Node.js runner for $module..."
        cp "tests/run.js" "$BACKUP_DIR/${template}_run.js.backup" 2>/dev/null || true
        
        # Use Python to update the file (more reliable than sed for complex replacements)
        python3 << EOPYTHON
import re
import json

# Read the existing file
with open('tests/run.js', 'r') as f:
    content = f.read()

# Generate the updated runner
output = '''#!/usr/bin/env node

import { exec } from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { promisify } from 'util';

const execPromise = promisify(exec);

function getCurrentChallengeIndex() {
  try {
    if (existsSync('dsa.config.json')) {
      const config = JSON.parse(readFileSync('dsa.config.json', 'utf-8'));
      return config.currentChallengeIndex || 0;
    }
  } catch (error) {
    console.error('Warning: Could not read dsa.config.json, defaulting to index 0');
  }
  return 0;
}

'''

# Extract testFiles array from original content
match = re.search(r'const testFiles = \[(.*?)\];', content, re.DOTALL)
if match:
    test_files_content = match.group(1).strip()
    output += f"const ALL_TESTS = [{test_files_content}];\n\n"
else:
    print("Warning: Could not extract testFiles, skipping", file=sys.stderr)
    sys.exit(1)

# Extract moduleId
module_match = re.search(r'moduleId:\s*["\']([^"\']+)["\']', content)
module_id = module_match.group(1) if module_match else '${module}'

output += f'''async function runTests() {{
  const currentChallengeIndex = getCurrentChallengeIndex();
  const testsToRun = ALL_TESTS.slice(0, currentChallengeIndex + 1);
  const lockedTests = ALL_TESTS.slice(currentChallengeIndex + 1);
  
  console.log('Running tests for: {module_id}');
  console.log(\`Current challenge: \${{currentChallengeIndex + 1}}/\${{ALL_TESTS.length}}\`);
  console.log('');
  
  const results = [];
  let passedCount = 0;

  for (const {{ file, slug }} of testsToRun) {{
    const extensions = ['.ts', '.js'];
    let testFile = null;
    
    for (const ext of extensions) {{
      if (existsSync(\`tests/\${{file}}\${{ext}}\`)) {{
        testFile = \`tests/\${{file}}\${{ext}}\`;
        break;
      }}
    }}
    
    if (!testFile) {{
      console.error(\`✗ \${{slug}} (test file not found)\`);
      results.push({{ subchallengeId: slug, passed: false, message: 'Test file not found' }});
      continue;
    }}
    
    try {{
      await execPromise(\`npx vitest run \${{testFile}} --run\`);
      results.push({{ subchallengeId: slug, passed: true }});
      passedCount++;
      console.log(\`✓ \${{slug}}\`);
    }} catch (error) {{
      const message = error.stderr || error.stdout || 'Test failed';
      results.push({{ subchallengeId: slug, passed: false, message: message.trim() }});
      console.log(\`✗ \${{slug}}\`);
    }}
  }}
  
  for (const {{ slug }} of lockedTests) {{
    results.push({{ subchallengeId: slug, passed: false, message: 'Challenge locked' }});
  }}

  const report = {{
    moduleId: '{module_id}',
    summary: \`\${{passedCount}}/\${{testsToRun.length}} tests passed (\${{lockedTests.length}} locked)\`,
    pass: passedCount === testsToRun.length,
    cases: results,
    currentChallengeIndex: currentChallengeIndex,
  }};

  writeFileSync('.dsa-report.json', JSON.stringify(report, null, 2));
  
  console.log('');
  console.log(\`Summary: \${{report.summary}}\`);
  process.exit(report.pass ? 0 : 1);
}}

runTests().catch(error => {{
  console.error('Test runner failed:', error);
  process.exit(1);
}});
'''

with open('tests/run.js', 'w') as f:
    f.write(output)
print("✅ Updated")
EOPYTHON
        
        if [ $? -eq 0 ]; then
          chmod +x tests/run.js
          ((SUCCESS_COUNT++))
        else
          echo "  ❌ Failed to update"
          ((SKIP_COUNT++))
        fi
      else
        echo "  ⚠️  tests/run.js not found"
        ((SKIP_COUNT++))
      fi
      ;;
      
    py)
      if [ -f "tests/run.py" ]; then
        echo "  Updating Python runner for $module..."
        cp "tests/run.py" "$BACKUP_DIR/${template}_run.py.backup" 2>/dev/null || true
        
        python3 << EOPYTHON
import re

with open('tests/run.py', 'r') as f:
    content = f.read()

# Extract test files array
match = re.search(r'test_files\s*=\s*\[(.*?)\]', content, re.DOTALL)
if not match:
    print("Warning: Could not extract test_files", file=sys.stderr)
    exit(1)

test_files_content = match.group(1).strip()

# Extract module ID
module_match = re.search(r"['\"]moduleId['\"]:\s*['\"]([^'\"]+)['\"]", content)
module_id = module_match.group(1) if module_match else '${module}'

output = f'''#!/usr/bin/env python3
import subprocess
import json
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def get_current_challenge_index():
    try:
        if os.path.exists('dsa.config.json'):
            with open('dsa.config.json', 'r') as f:
                config = json.load(f)
                return config.get('currentChallengeIndex', 0)
    except Exception as e:
        print(f'Warning: Could not read dsa.config.json: {{e}}', file=sys.stderr)
    return 0

ALL_TESTS = [
{test_files_content}
]

def run_tests():
    current_challenge_index = get_current_challenge_index()
    tests_to_run = ALL_TESTS[:current_challenge_index + 1]
    locked_tests = ALL_TESTS[current_challenge_index + 1:]
    
    print(f"Running tests for: {module_id}")
    print(f"Current challenge: {{current_challenge_index + 1}}/{{len(ALL_TESTS)}}")
    print()
    
    results = []
    passed_count = 0
    
    env = os.environ.copy()
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    env['PYTHONPATH'] = project_root
    
    for test in tests_to_run:
        if not os.path.exists(test['file']):
            print(f"✗ {{test['slug']}} (file not found)")
            results.append({{
                'subchallengeId': test['slug'],
                'passed': False,
                'message': 'Test file not found'
            }})
            continue
        
        try:
            subprocess.run(
                ['pytest', test['file'], '-v'],
                check=True,
                capture_output=True,
                text=True,
                env=env
            )
            results.append({{'subchallengeId': test['slug'], 'passed': True}})
            passed_count += 1
            print(f"✓ {{test['slug']}}")
        except subprocess.CalledProcessError as e:
            message = e.stderr or e.stdout or 'Test failed'
            results.append({{
                'subchallengeId': test['slug'],
                'passed': False,
                'message': message.strip()
            }})
            print(f"✗ {{test['slug']}}")
    
    for test in locked_tests:
        results.append({{
            'subchallengeId': test['slug'],
            'passed': False,
            'message': 'Challenge locked'
        }})
    
    report = {{
        'moduleId': '{module_id}',
        'summary': f"{{passed_count}}/{{len(tests_to_run)}} tests passed ({{len(locked_tests)}} locked)",
        'pass': passed_count == len(tests_to_run),
        'cases': results,
        'currentChallengeIndex': current_challenge_index,
    }}
    
    with open('.dsa-report.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    print()
    print(f"Summary: {{report['summary']}}")
    sys.exit(0 if report['pass'] else 1)

if __name__ == '__main__':
    try:
        run_tests()
    except Exception as e:
        print(f"Test runner failed: {{e}}", file=sys.stderr)
        sys.exit(1)
'''

with open('tests/run.py', 'w') as f:
    f.write(output)
print("✅ Updated")
EOPYTHON
        
        if [ $? -eq 0 ]; then
          chmod +x tests/run.py
          ((SUCCESS_COUNT++))
        else
          echo "  ❌ Failed to update"
          ((SKIP_COUNT++))
        fi
      else
        echo "  ⚠️  tests/run.py not found"
        ((SKIP_COUNT++))
      fi
      ;;
      
    go)
      if [ -f "tests/run.go" ]; then
        echo "  Updating Go runner for $module..."
        cp "tests/run.go" "$BACKUP_DIR/${template}_run.go.backup" 2>/dev/null || true
        
        python3 << EOPYTHON
import re

with open('tests/run.go', 'r') as f:
    content = f.read()

# Extract tests array
match = re.search(r'tests\s*:=\s*\[\]struct\s*\{[^}]+\}\s*\{(.*?)\}', content, re.DOTALL)
if not match:
    print("Warning: Could not extract tests array", file=sys.stderr)
    exit(1)

tests_content = match.group(1).strip()

# Extract module ID
module_match = re.search(r'ModuleID:\s*"([^"]+)"', content)
module_id = module_match.group(1) if module_match else '${module}'

output = f'''package main

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"strings"
)

type TestCase struct {{
	SubchallengeID string \`json:"subchallengeId"\`
	Passed         bool   \`json:"passed"\`
	Message        string \`json:"message,omitempty"\`
}}

type Report struct {{
	ModuleID              string     \`json:"moduleId"\`
	Summary               string     \`json:"summary"\`
	Pass                  bool       \`json:"pass"\`
	Cases                 []TestCase \`json:"cases"\`
	CurrentChallengeIndex int        \`json:"currentChallengeIndex"\`
}}

type Config struct {{
	CurrentChallengeIndex int \`json:"currentChallengeIndex"\`
}}

func getCurrentChallengeIndex() int {{
	data, err := os.ReadFile("dsa.config.json")
	if err != nil {{
		return 0
	}}
	
	var config Config
	if err := json.Unmarshal(data, &config); err != nil {{
		return 0
	}}
	
	return config.CurrentChallengeIndex
}}

func runTest(testName string, slug string) TestCase {{
	cmd := exec.Command("go", "test", "-run", testName, "-v")
	output, err := cmd.CombinedOutput()
	
	if err == nil && strings.Contains(string(output), "PASS") {{
		fmt.Printf("✓ %s\\n", slug)
		return TestCase{{SubchallengeID: slug, Passed: true}}
	}}
	
	fmt.Printf("✗ %s\\n", slug)
	return TestCase{{
		SubchallengeID: slug,
		Passed:         false,
		Message:        "Test failed",
	}}
}}

func main() {{
	allTests := []struct {{
		name string
		slug string
	}}{{
{tests_content}
	}}
	
	currentIndex := getCurrentChallengeIndex()
	testsToRun := allTests
	if currentIndex < len(allTests) {{
		testsToRun = allTests[:currentIndex+1]
	}}
	lockedCount := len(allTests) - len(testsToRun)
	
	fmt.Printf("Running tests for: {module_id}\\n")
	fmt.Printf("Current challenge: %d/%d\\n", currentIndex+1, len(allTests))
	fmt.Println()
	
	var results []TestCase
	passedCount := 0
	
	for _, test := range testsToRun {{
		result := runTest(test.name, test.slug)
		results = append(results, result)
		if result.Passed {{
			passedCount++
		}}
	}}
	
	for i := len(testsToRun); i < len(allTests); i++ {{
		results = append(results, TestCase{{
			SubchallengeID: allTests[i].slug,
			Passed:         false,
			Message:        "Challenge locked",
		}})
	}}
	
	summary := fmt.Sprintf("%d/%d tests passed (%d locked)", passedCount, len(testsToRun), lockedCount)
	report := Report{{
		ModuleID:              "{module_id}",
		Summary:               summary,
		Pass:                  passedCount == len(testsToRun),
		Cases:                 results,
		CurrentChallengeIndex: currentIndex,
	}}
	
	data, _ := json.MarshalIndent(report, "", "  ")
	os.WriteFile(".dsa-report.json", data, 0644)
	
	fmt.Printf("\\nSummary: %s\\n", report.Summary)
	
	if report.Pass {{
		os.Exit(0)
	}} else {{
		os.Exit(1)
	}}
}}
'''

with open('tests/run.go', 'w') as f:
    f.write(output)
print("✅ Updated")
EOPYTHON
        
        if [ $? -eq 0 ]; then
          ((SUCCESS_COUNT++))
        else
          echo "  ❌ Failed to update"
          ((SKIP_COUNT++))
        fi
      else
        echo "  ⚠️  tests/run.go not found"
        ((SKIP_COUNT++))
      fi
      ;;
      
    java)
      if [ -f "src/test/java/TestRunner.java" ]; then
        echo "  Updating Java runner for $module..."
        cp "src/test/java/TestRunner.java" "$BACKUP_DIR/${template}_TestRunner.java.backup" 2>/dev/null || true
        
        python3 << EOPYTHON
import re

with open('src/test/java/TestRunner.java', 'r') as f:
    content = f.read()

# Extract testMap entries
match = re.search(r'testMap\.put\([^;]+;', content)
if not match:
    print("Warning: Could not extract testMap", file=sys.stderr)
    exit(1)

# Find all testMap.put statements
test_map_entries = re.findall(r'testMap\.put\(([^)]+)\);', content)

# Extract module ID
module_match = re.search(r'new Report\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+\)', content)
module_id_match = re.search(r'"([^"]+)"', content)
module_id = '${module}'
if module_id_match:
    # Try to find moduleId value
    for match in re.finditer(r'moduleId["\']?\s*[:=]\s*["\']([^"\']+)["\']', content):
        module_id = match.group(1)
        break

# Reconstruct the testMap puts
test_map_code = ""
for entry in test_map_entries:
    test_map_code += f"        testMap.put({entry});\\n"

if not test_map_code:
    print("Warning: No testMap entries found", file=sys.stderr)
    exit(1)

output = f'''import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.junit.platform.engine.discovery.DiscoverySelectors;
import org.junit.platform.launcher.Launcher;
import org.junit.platform.launcher.LauncherDiscoveryRequest;
import org.junit.platform.launcher.core.LauncherDiscoveryRequestBuilder;
import org.junit.platform.launcher.core.LauncherFactory;
import org.junit.platform.launcher.listeners.SummaryGeneratingListener;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.*;

public class TestRunner {{
    
    static class TestCase {{
        String subchallengeId;
        boolean passed;
        String message;
        
        TestCase(String subchallengeId, boolean passed) {{
            this.subchallengeId = subchallengeId;
            this.passed = passed;
        }}
        
        TestCase(String subchallengeId, boolean passed, String message) {{
            this.subchallengeId = subchallengeId;
            this.passed = passed;
            this.message = message;
        }}
    }}
    
    static class Report {{
        String moduleId;
        String summary;
        boolean pass;
        List<TestCase> cases;
        int currentChallengeIndex;
        
        Report(String moduleId, String summary, boolean pass, List<TestCase> cases, int currentChallengeIndex) {{
            this.moduleId = moduleId;
            this.summary = summary;
            this.pass = pass;
            this.cases = cases;
            this.currentChallengeIndex = currentChallengeIndex;
        }}
    }}
    
    static class Config {{
        int currentChallengeIndex;
    }}
    
    static int getCurrentChallengeIndex() {{
        try (FileReader reader = new FileReader("dsa.config.json")) {{
            Gson gson = new Gson();
            Config config = gson.fromJson(reader, Config.class);
            return config.currentChallengeIndex;
        }} catch (Exception e) {{
            return 0;
        }}
    }}
    
    public static void main(String[] args) {{
        Map<String, String> allTests = new LinkedHashMap<>();
{test_map_code}        
        int currentIndex = getCurrentChallengeIndex();
        List<Map.Entry<String, String>> testsList = new ArrayList<>(allTests.entrySet());
        List<Map.Entry<String, String>> testsToRun = testsList.subList(0, Math.min(currentIndex + 1, testsList.size()));
        int lockedCount = testsList.size() - testsToRun.size();
        
        System.out.println("Running tests for: {module_id}");
        System.out.println("Current challenge: " + (currentIndex + 1) + "/" + testsList.size());
        System.out.println();
        
        List<TestCase> results = new ArrayList<>();
        int passedCount = 0;
        
        for (Map.Entry<String, String> entry : testsToRun) {{
            String testClass = entry.getKey();
            String slug = entry.getValue();
            
            try {{
                LauncherDiscoveryRequest request = LauncherDiscoveryRequestBuilder.request()
                    .selectors(DiscoverySelectors.selectClass(testClass))
                    .build();
                
                Launcher launcher = LauncherFactory.create();
                SummaryGeneratingListener listener = new SummaryGeneratingListener();
                launcher.registerTestExecutionListeners(listener);
                launcher.execute(request);
                
                boolean passed = listener.getSummary().getFailures().isEmpty();
                if (passed) {{
                    System.out.println("✓ " + slug);
                    results.add(new TestCase(slug, true));
                    passedCount++;
                }} else {{
                    System.out.println("✗ " + slug);
                    String message = listener.getSummary().getFailures().get(0)
                        .getException().getMessage();
                    results.add(new TestCase(slug, false, message));
                }}
            }} catch (Exception e) {{
                System.out.println("✗ " + slug);
                results.add(new TestCase(slug, false, e.getMessage()));
            }}
        }}
        
        for (int i = testsToRun.size(); i < testsList.size(); i++) {{
            results.add(new TestCase(testsList.get(i).getValue(), false, "Challenge locked"));
        }}
        
        String summary = passedCount + "/" + testsToRun.size() + " tests passed (" + lockedCount + " locked)";
        boolean pass = passedCount == testsToRun.size();
        Report report = new Report("{module_id}", summary, pass, results, currentIndex);
        
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        try (FileWriter writer = new FileWriter(".dsa-report.json")) {{
            gson.toJson(report, writer);
        }} catch (IOException e) {{
            e.printStackTrace();
        }}
        
        System.out.println("\\nSummary: " + summary);
        System.exit(pass ? 0 : 1);
    }}
}}
'''

with open('src/test/java/TestRunner.java', 'w') as f:
    f.write(output)
print("✅ Updated")
EOPYTHON
        
        if [ $? -eq 0 ]; then
          ((SUCCESS_COUNT++))
        else
          echo "  ❌ Failed to update"
          ((SKIP_COUNT++))
        fi
      else
        echo "  ⚠️  src/test/java/TestRunner.java not found"
        ((SKIP_COUNT++))
      fi
      ;;
      
    cpp)
      if [ -f "tests/run.sh" ]; then
        echo "  Updating C++ runner for $module..."
        cp "tests/run.sh" "$BACKUP_DIR/${template}_run.sh.backup" 2>/dev/null || true
        
        python3 << EOPYTHON
import re

with open('tests/run.sh', 'r') as f:
    content = f.read()

# Extract test mapping dictionary
match = re.search(r'test_mapping\s*=\s*\{(.*?)\}', content, re.DOTALL)
if not match:
    print("Warning: Could not extract test_mapping", file=sys.stderr)
    exit(1)

test_mapping_content = match.group(1).strip()

# Convert to Python list format
test_entries = []
for line in test_mapping_content.split('\\n'):
    line = line.strip()
    if line and ':' in line:
        parts = line.replace('"', '').replace(',', '').split(':')
        if len(parts) == 2:
            test_name = parts[0].strip()
            slug = parts[1].strip()
            test_entries.append(f'    ("{test_name}", "{slug}"),')

test_list = '\\n'.join(test_entries)

# Extract module ID and test executable
module_match = re.search(r'"moduleId":\s*"([^"]+)"', content)
module_id = module_match.group(1) if module_match else '${module}'

# Extract test executable name
exec_match = re.search(r'\\./([^\\s]+)\\s+--gtest_output', content)
test_exec = exec_match.group(1) if exec_match else f"{module_id.replace('-', '_')}_tests"

output = f'''#!/bin/bash
# C++/CMake test runner with progressive unlocking

mkdir -p build
cd build
cmake .. > /dev/null 2>&1
cmake --build . > /dev/null 2>&1

./{test_exec} --gtest_output=json:test_results.json > /dev/null 2>&1
test_exit_code=$?

cd ..
python3 << 'PYTHON_SCRIPT'
import json
import sys
import os

def get_current_challenge_index():
    try:
        if os.path.exists('dsa.config.json'):
            with open('dsa.config.json', 'r') as f:
                config = json.load(f)
                return config.get('currentChallengeIndex', 0)
    except Exception as e:
        print(f'Warning: Could not read dsa.config.json: {{e}}', file=sys.stderr)
    return 0

MODULE_ID = '{module_id}'

all_tests = [
{test_list}
]

current_index = get_current_challenge_index()
tests_to_run = all_tests[:current_index + 1]
locked_tests = all_tests[current_index + 1:]

print(f"Running tests for: {{MODULE_ID}}")
print(f"Current challenge: {{current_index + 1}}/{{len(all_tests)}}")
print()

try:
    with open("build/test_results.json", "r") as f:
        gtest_results = json.load(f)
    
    test_results_map = {{}}
    for test_suite in gtest_results.get("testsuites", []):
        for test_case in test_suite.get("testsuite", []):
            test_name = test_case.get("name", "")
            has_failures = test_case.get("failures") is not None and len(test_case.get("failures", [])) > 0
            passed = test_case.get("status") == "RUN" and test_case.get("result") == "COMPLETED" and not has_failures
            failure_msg = test_case.get("failures", [{{}}])[0].get("failure", "Test failed") if test_case.get("failures") else None
            test_results_map[test_name] = (passed, failure_msg)
    
    cases = []
    passed_count = 0
    
    for test_name, slug in tests_to_run:
        if test_name in test_results_map:
            passed, failure_msg = test_results_map[test_name]
            if passed:
                cases.append({{"subchallengeId": slug, "passed": True}})
                passed_count += 1
                print(f"✓ {{slug}}")
            else:
                cases.append({{"subchallengeId": slug, "passed": False, "message": failure_msg or "Test failed"}})
                print(f"✗ {{slug}}")
        else:
            cases.append({{"subchallengeId": slug, "passed": False, "message": "Test not found"}})
            print(f"✗ {{slug}}")
    
    for test_name, slug in locked_tests:
        cases.append({{"subchallengeId": slug, "passed": False, "message": "Challenge locked"}})
    
    total_run = len(tests_to_run)
    report = {{
        "moduleId": MODULE_ID,
        "summary": f"{{passed_count}}/{{total_run}} tests passed ({{len(locked_tests)}} locked)",
        "pass": passed_count == total_run,
        "cases": cases,
        "currentChallengeIndex": current_index,
    }}
    
    with open(".dsa-report.json", "w") as f:
        json.dump(report, f, indent=2)
    
    print(f"\\nSummary: {{report['summary']}}")
    sys.exit(0 if report["pass"] else 1)

except Exception as e:
    cases = []
    for test_name, slug in tests_to_run:
        cases.append({{"subchallengeId": slug, "passed": False, "message": str(e)}})
    for test_name, slug in locked_tests:
        cases.append({{"subchallengeId": slug, "passed": False, "message": "Challenge locked"}})
    
    report = {{
        "moduleId": MODULE_ID,
        "summary": f"0/{{len(tests_to_run)}} tests passed ({{len(locked_tests)}} locked)",
        "pass": False,
        "cases": cases,
        "currentChallengeIndex": current_index,
    }}
    
    with open(".dsa-report.json", "w") as f:
        json.dump(report, f, indent=2)
    
    print("✗ Tests failed to run")
    print(f"\\nSummary: {{report['summary']}}")
    sys.exit(1)
PYTHON_SCRIPT
'''

with open('tests/run.sh', 'w') as f:
    f.write(output)
print("✅ Updated")
EOPYTHON
        
        if [ $? -eq 0 ]; then
          chmod +x tests/run.sh
          ((SUCCESS_COUNT++))
        else
          echo "  ❌ Failed to update"
          ((SKIP_COUNT++))
        fi
      else
        echo "  ⚠️  tests/run.sh not found"
        ((SKIP_COUNT++))
      fi
      ;;
      
    *)
      echo "  ⚠️  Unknown language: $lang"
      ((SKIP_COUNT++))
      ;;
  esac
  
  cd "$TEMPLATES_DIR"
  echo ""
done

echo "=============================================="
echo "📊 UPDATE SUMMARY"
echo "=============================================="
echo "✅ Success: $SUCCESS_COUNT/${#TEMPLATES[@]}"
echo "⚠️  Skipped: $SKIP_COUNT/${#TEMPLATES[@]}"
echo ""
echo "💾 Backups saved to: $BACKUP_DIR"
echo ""

if [ $SUCCESS_COUNT -eq ${#TEMPLATES[@]} ]; then
  echo "🎉 All templates successfully updated!"
else
  echo "⚠️  Review output above for any issues."
fi

echo ""

