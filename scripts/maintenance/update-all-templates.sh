#!/bin/bash
# update-all-templates.sh
# Updates test runners in all 24 template repositories to support progressive unlocking
# This script is IDEMPOTENT and creates backups before any modifications

set -e

TEMPLATES_DIR="/Users/joudbitar/Code/Projects/dsa-templates"
BACKUP_DIR="${TEMPLATES_DIR}/.backups-$(date +%Y%m%d-%H%M%S)"

echo "🔧 DSA Templates Progressive Unlocking Update"
echo "=============================================="
echo ""
echo "This script will update all 24 template test runners to:"
echo "  - Read currentChallengeIndex from dsa.config.json"
echo "  - Only run tests up to current challenge"
echo "  - Add locked challenges to report"
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
FAIL_COUNT=0
SKIP_COUNT=0
FAILED_TEMPLATES=()

# ============================================
# Update Functions for Each Language
# ============================================

update_nodejs_runner() {
  local template=$1
  local module=$2
  
  echo "  Updating Node.js test runner..."
  
  # Create tests directory if it doesn't exist
  mkdir -p "$template/tests"
  
  # Backup if file exists
  if [ -f "$template/tests/run.js" ]; then
    cp "$template/tests/run.js" "$BACKUP_DIR/${template}_run.js.backup"
  fi
  
  # Determine test files based on module
  local test_config=""
  case $module in
    stack)
      test_config='      { file: "01-create-class.test", slug: "create-class" },
      { file: "02-push.test", slug: "push" },
      { file: "03-pop.test", slug: "pop" },
      { file: "04-peek.test", slug: "peek" },
      { file: "05-size.test", slug: "size" },'
      ;;
    queue)
      test_config='      { file: "01-create-class.test", slug: "create-class" },
      { file: "02-enqueue.test", slug: "enqueue" },
      { file: "03-dequeue.test", slug: "dequeue" },
      { file: "04-front.test", slug: "front" },
      { file: "05-size.test", slug: "size" },'
      ;;
    binary-search)
      test_config='      { file: "01-empty-array.test", slug: "empty-array" },
      { file: "02-found-index.test", slug: "found-index" },
      { file: "03-not-found.test", slug: "not-found" },
      { file: "04-bounds.test", slug: "bounds" },'
      ;;
    min-heap)
      test_config='      { file: "01-insert.test", slug: "insert" },
      { file: "02-heapify-up.test", slug: "heapify-up" },
      { file: "03-peek.test", slug: "peek" },
      { file: "04-extract.test", slug: "extract" },
      { file: "05-heapify-down.test", slug: "heapify-down" },
      { file: "06-size.test", slug: "size" },'
      ;;
  esac
  
  # Write updated runner
  cat > "$template/tests/run.js" << EOF
#!/usr/bin/env node

import { exec } from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Read current challenge index from dsa.config.json
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

// Module configuration
const MODULE_ID = '${module}';
const ALL_TESTS = [
${test_config}
];

async function runTests() {
  const currentChallengeIndex = getCurrentChallengeIndex();
  
  // Only run tests up to and including current challenge
  const testsToRun = ALL_TESTS.slice(0, currentChallengeIndex + 1);
  const lockedTests = ALL_TESTS.slice(currentChallengeIndex + 1);
  
  console.log(\`Running tests for: \${MODULE_ID}\`);
  console.log(\`Current challenge: \${currentChallengeIndex + 1}/\${ALL_TESTS.length}\`);
  console.log('');
  
  const results = [];
  let passedCount = 0;

  for (const { file, slug } of testsToRun) {
    // Try both .ts and .js extensions
    const extensions = ['.ts', '.js'];
    let testFile = null;
    
    for (const ext of extensions) {
      if (existsSync(\`tests/\${file}\${ext}\`)) {
        testFile = \`tests/\${file}\${ext}\`;
        break;
      }
    }
    
    if (!testFile) {
      console.error(\`✗ \${slug} (test file not found)\`);
      results.push({ subchallengeId: slug, passed: false, message: 'Test file not found' });
      continue;
    }
    
    try {
      await execPromise(\`npx vitest run \${testFile} --run\`);
      results.push({ subchallengeId: slug, passed: true });
      passedCount++;
      console.log(\`✓ \${slug}\`);
    } catch (error) {
      const message = error.stderr || error.stdout || 'Test failed';
      results.push({ subchallengeId: slug, passed: false, message: message.trim() });
      console.log(\`✗ \${slug}\`);
    }
  }
  
  // Add locked challenges to report
  for (const { slug } of lockedTests) {
    results.push({ subchallengeId: slug, passed: false, message: 'Challenge locked' });
  }

  const report = {
    moduleId: MODULE_ID,
    summary: \`\${passedCount}/\${testsToRun.length} tests passed (\${lockedTests.length} locked)\`,
    pass: passedCount === testsToRun.length,
    cases: results,
    currentChallengeIndex: currentChallengeIndex,
  };

  writeFileSync('.dsa-report.json', JSON.stringify(report, null, 2));
  
  console.log('');
  console.log(\`Summary: \${report.summary}\`);
  process.exit(report.pass ? 0 : 1);
}

runTests().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});
EOF
  
  chmod +x "$template/tests/run.js"
  echo "  ✅ Updated Node.js runner"
}

update_python_runner() {
  local template=$1
  local module=$2
  
  echo "  Updating Python test runner..."
  
  # Create tests directory if it doesn't exist
  mkdir -p "$template/tests"
  
  # Backup if file exists
  if [ -f "$template/tests/run.py" ]; then
    cp "$template/tests/run.py" "$BACKUP_DIR/${template}_run.py.backup"
  fi
  
  # Determine test files based on module
  local test_config=""
  case $module in
    stack)
      test_config="    {'file': 'tests/test_01_create_class.py', 'slug': 'create-class'},
    {'file': 'tests/test_02_push.py', 'slug': 'push'},
    {'file': 'tests/test_03_pop.py', 'slug': 'pop'},
    {'file': 'tests/test_04_peek.py', 'slug': 'peek'},
    {'file': 'tests/test_05_size.py', 'slug': 'size'},"
      ;;
    queue)
      test_config="    {'file': 'tests/test_01_create_class.py', 'slug': 'create-class'},
    {'file': 'tests/test_02_enqueue.py', 'slug': 'enqueue'},
    {'file': 'tests/test_03_dequeue.py', 'slug': 'dequeue'},
    {'file': 'tests/test_04_front.py', 'slug': 'front'},
    {'file': 'tests/test_05_size.py', 'slug': 'size'},"
      ;;
    binary-search)
      test_config="    {'file': 'tests/test_01_empty_array.py', 'slug': 'empty-array'},
    {'file': 'tests/test_02_found_index.py', 'slug': 'found-index'},
    {'file': 'tests/test_03_not_found.py', 'slug': 'not-found'},
    {'file': 'tests/test_04_bounds.py', 'slug': 'bounds'},"
      ;;
    min-heap)
      test_config="    {'file': 'tests/test_01_insert.py', 'slug': 'insert'},
    {'file': 'tests/test_02_heapify_up.py', 'slug': 'heapify-up'},
    {'file': 'tests/test_03_peek.py', 'slug': 'peek'},
    {'file': 'tests/test_04_extract.py', 'slug': 'extract'},
    {'file': 'tests/test_05_heapify_down.py', 'slug': 'heapify-down'},
    {'file': 'tests/test_06_size.py', 'slug': 'size'},"
      ;;
  esac
  
  # Write updated runner
  cat > "$template/tests/run.py" << 'PYTHON_EOF'
#!/usr/bin/env python3
import subprocess
import json
import sys
import os

# Add project root to Python path so tests can import from src
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def get_current_challenge_index():
    """Read current challenge index from dsa.config.json"""
    try:
        if os.path.exists('dsa.config.json'):
            with open('dsa.config.json', 'r') as f:
                config = json.load(f)
                return config.get('currentChallengeIndex', 0)
    except Exception as e:
        print(f'Warning: Could not read dsa.config.json: {e}', file=sys.stderr)
    return 0

# Module configuration
MODULE_ID = 'MODULE_PLACEHOLDER'
ALL_TESTS = [
TEST_CONFIG_PLACEHOLDER
]

def run_tests():
    current_challenge_index = get_current_challenge_index()
    
    # Only run tests up to and including current challenge
    tests_to_run = ALL_TESTS[:current_challenge_index + 1]
    locked_tests = ALL_TESTS[current_challenge_index + 1:]
    
    print(f"Running tests for: {MODULE_ID}")
    print(f"Current challenge: {current_challenge_index + 1}/{len(ALL_TESTS)}")
    print()
    
    results = []
    passed_count = 0
    
    # Set PYTHONPATH to project root so tests can import from src
    env = os.environ.copy()
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    env['PYTHONPATH'] = project_root
    
    for test in tests_to_run:
        if not os.path.exists(test['file']):
            print(f"✗ {test['slug']} (file not found)")
            results.append({
                'subchallengeId': test['slug'],
                'passed': False,
                'message': 'Test file not found'
            })
            continue
        
        try:
            subprocess.run(
                ['pytest', test['file'], '-v'],
                check=True,
                capture_output=True,
                text=True,
                env=env
            )
            results.append({'subchallengeId': test['slug'], 'passed': True})
            passed_count += 1
            print(f"✓ {test['slug']}")
        except subprocess.CalledProcessError as e:
            message = e.stderr or e.stdout or 'Test failed'
            results.append({
                'subchallengeId': test['slug'],
                'passed': False,
                'message': message.strip()
            })
            print(f"✗ {test['slug']}")
    
    # Add locked challenges to report
    for test in locked_tests:
        results.append({
            'subchallengeId': test['slug'],
            'passed': False,
            'message': 'Challenge locked'
        })
    
    report = {
        'moduleId': MODULE_ID,
        'summary': f"{passed_count}/{len(tests_to_run)} tests passed ({len(locked_tests)} locked)",
        'pass': passed_count == len(tests_to_run),
        'cases': results,
        'currentChallengeIndex': current_challenge_index,
    }
    
    with open('.dsa-report.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    print()
    print(f"Summary: {report['summary']}")
    sys.exit(0 if report['pass'] else 1)

if __name__ == '__main__':
    try:
        run_tests()
    except Exception as e:
        print(f"Test runner failed: {e}", file=sys.stderr)
        sys.exit(1)
PYTHON_EOF
  
  # Replace placeholders
  sed -i '' "s/MODULE_PLACEHOLDER/${module}/g" "$template/tests/run.py"
  sed -i '' "s|TEST_CONFIG_PLACEHOLDER|${test_config}|g" "$template/tests/run.py"
  
  chmod +x "$template/tests/run.py"
  echo "  ✅ Updated Python runner"
}

update_go_runner() {
  local template=$1
  local module=$2
  
  echo "  Updating Go test runner..."
  
  # Create tests directory if it doesn't exist
  mkdir -p "$template/tests"
  
  # Backup if file exists
  if [ -f "$template/tests/run.go" ]; then
    cp "$template/tests/run.go" "$BACKUP_DIR/${template}_run.go.backup"
  fi
  
  # Determine test mapping based on module
  local test_config=""
  case $module in
    stack)
      test_config='		{"TestCreateStack", "create-class"},
		{"TestPush", "push"},
		{"TestPop", "pop"},
		{"TestPeek", "peek"},
		{"TestSize", "size"},'
      ;;
    queue)
      test_config='		{"TestCreateQueue", "create-class"},
		{"TestEnqueue", "enqueue"},
		{"TestDequeue", "dequeue"},
		{"TestFront", "front"},
		{"TestSize", "size"},'
      ;;
    binary-search)
      test_config='		{"TestEmptyArray", "empty-array"},
		{"TestFoundIndex", "found-index"},
		{"TestNotFound", "not-found"},
		{"TestBounds", "bounds"},'
      ;;
    min-heap)
      test_config='		{"TestInsert", "insert"},
		{"TestHeapifyUp", "heapify-up"},
		{"TestPeek", "peek"},
		{"TestExtract", "extract"},
		{"TestHeapifyDown", "heapify-down"},
		{"TestSize", "size"},'
      ;;
  esac
  
  # Write updated runner
  cat > "$template/tests/run.go" << 'GO_EOF'
package main

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"strings"
)

type TestCase struct {
	SubchallengeID string `json:"subchallengeId"`
	Passed         bool   `json:"passed"`
	Message        string `json:"message,omitempty"`
}

type Report struct {
	ModuleID              string     `json:"moduleId"`
	Summary               string     `json:"summary"`
	Pass                  bool       `json:"pass"`
	Cases                 []TestCase `json:"cases"`
	CurrentChallengeIndex int        `json:"currentChallengeIndex"`
}

type Config struct {
	CurrentChallengeIndex int `json:"currentChallengeIndex"`
}

func getCurrentChallengeIndex() int {
	data, err := os.ReadFile("dsa.config.json")
	if err != nil {
		return 0
	}
	
	var config Config
	if err := json.Unmarshal(data, &config); err != nil {
		return 0
	}
	
	return config.CurrentChallengeIndex
}

func runTest(testName string, slug string) TestCase {
	cmd := exec.Command("go", "test", "-run", testName, "-v")
	output, err := cmd.CombinedOutput()
	
	if err == nil && strings.Contains(string(output), "PASS") {
		fmt.Printf("✓ %s\n", slug)
		return TestCase{SubchallengeID: slug, Passed: true}
	}
	
	fmt.Printf("✗ %s\n", slug)
	return TestCase{
		SubchallengeID: slug,
		Passed:         false,
		Message:        "Test failed",
	}
}

func main() {
	allTests := []struct {
		name string
		slug string
	}{
TEST_CONFIG_PLACEHOLDER
	}
	
	currentIndex := getCurrentChallengeIndex()
	testsToRun := allTests
	if currentIndex < len(allTests) {
		testsToRun = allTests[:currentIndex+1]
	}
	lockedCount := len(allTests) - len(testsToRun)
	
	fmt.Printf("Running tests for: MODULE_PLACEHOLDER\n")
	fmt.Printf("Current challenge: %d/%d\n", currentIndex+1, len(allTests))
	fmt.Println()
	
	var results []TestCase
	passedCount := 0
	
	for _, test := range testsToRun {
		result := runTest(test.name, test.slug)
		results = append(results, result)
		if result.Passed {
			passedCount++
		}
	}
	
	// Add locked challenges
	for i := len(testsToRun); i < len(allTests); i++ {
		results = append(results, TestCase{
			SubchallengeID: allTests[i].slug,
			Passed:         false,
			Message:        "Challenge locked",
		})
	}
	
	summary := fmt.Sprintf("%d/%d tests passed (%d locked)", passedCount, len(testsToRun), lockedCount)
	report := Report{
		ModuleID:              "MODULE_PLACEHOLDER",
		Summary:               summary,
		Pass:                  passedCount == len(testsToRun),
		Cases:                 results,
		CurrentChallengeIndex: currentIndex,
	}
	
	data, _ := json.MarshalIndent(report, "", "  ")
	os.WriteFile(".dsa-report.json", data, 0644)
	
	fmt.Printf("\nSummary: %s\n", report.Summary)
	
	if report.Pass {
		os.Exit(0)
	} else {
		os.Exit(1)
	}
}
GO_EOF
  
  # Replace placeholders
  sed -i '' "s/MODULE_PLACEHOLDER/${module}/g" "$template/tests/run.go"
  sed -i '' "s|TEST_CONFIG_PLACEHOLDER|${test_config}|g" "$template/tests/run.go"
  
  echo "  ✅ Updated Go runner"
}

update_java_runner() {
  local template=$1
  local module=$2
  
  echo "  Updating Java test runner..."
  
  # Create directory if it doesn't exist
  mkdir -p "$template/src/test/java"
  
  # Backup if file exists
  if [ -f "$template/src/test/java/TestRunner.java" ]; then
    cp "$template/src/test/java/TestRunner.java" "$BACKUP_DIR/${template}_TestRunner.java.backup"
  fi
  
  # Determine test mapping based on module
  local test_config=""
  case $module in
    stack)
      test_config='        testMap.put("Test01CreateClass", "create-class");
        testMap.put("Test02Push", "push");
        testMap.put("Test03Pop", "pop");
        testMap.put("Test04Peek", "peek");
        testMap.put("Test05Size", "size");'
      ;;
    queue)
      test_config='        testMap.put("Test01CreateClass", "create-class");
        testMap.put("Test02Enqueue", "enqueue");
        testMap.put("Test03Dequeue", "dequeue");
        testMap.put("Test04Front", "front");
        testMap.put("Test05Size", "size");'
      ;;
    binary-search)
      test_config='        testMap.put("Test01EmptyArray", "empty-array");
        testMap.put("Test02FoundIndex", "found-index");
        testMap.put("Test03NotFound", "not-found");
        testMap.put("Test04Bounds", "bounds");'
      ;;
    min-heap)
      test_config='        testMap.put("Test01Insert", "insert");
        testMap.put("Test02HeapifyUp", "heapify-up");
        testMap.put("Test03Peek", "peek");
        testMap.put("Test04Extract", "extract");
        testMap.put("Test05HeapifyDown", "heapify-down");
        testMap.put("Test06Size", "size");'
      ;;
  esac
  
  # Write updated runner
  cat > "$template/src/test/java/TestRunner.java" << 'JAVA_EOF'
import com.google.gson.Gson;
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

public class TestRunner {
    
    static class TestCase {
        String subchallengeId;
        boolean passed;
        String message;
        
        TestCase(String subchallengeId, boolean passed) {
            this.subchallengeId = subchallengeId;
            this.passed = passed;
        }
        
        TestCase(String subchallengeId, boolean passed, String message) {
            this.subchallengeId = subchallengeId;
            this.passed = passed;
            this.message = message;
        }
    }
    
    static class Report {
        String moduleId;
        String summary;
        boolean pass;
        List<TestCase> cases;
        int currentChallengeIndex;
        
        Report(String moduleId, String summary, boolean pass, List<TestCase> cases, int currentChallengeIndex) {
            this.moduleId = moduleId;
            this.summary = summary;
            this.pass = pass;
            this.cases = cases;
            this.currentChallengeIndex = currentChallengeIndex;
        }
    }
    
    static class Config {
        int currentChallengeIndex;
    }
    
    static int getCurrentChallengeIndex() {
        try (FileReader reader = new FileReader("dsa.config.json")) {
            Gson gson = new Gson();
            Config config = gson.fromJson(reader, Config.class);
            return config.currentChallengeIndex;
        } catch (Exception e) {
            return 0;
        }
    }
    
    public static void main(String[] args) {
        Map<String, String> allTests = new LinkedHashMap<>();
TEST_MAPPING_PLACEHOLDER
        
        int currentIndex = getCurrentChallengeIndex();
        List<Map.Entry<String, String>> testsList = new ArrayList<>(allTests.entrySet());
        List<Map.Entry<String, String>> testsToRun = testsList.subList(0, Math.min(currentIndex + 1, testsList.size()));
        int lockedCount = testsList.size() - testsToRun.size();
        
        System.out.println("Running tests for: MODULE_PLACEHOLDER");
        System.out.println("Current challenge: " + (currentIndex + 1) + "/" + testsList.size());
        System.out.println();
        
        List<TestCase> results = new ArrayList<>();
        int passedCount = 0;
        
        for (Map.Entry<String, String> entry : testsToRun) {
            String testClass = entry.getKey();
            String slug = entry.getValue();
            
            try {
                LauncherDiscoveryRequest request = LauncherDiscoveryRequestBuilder.request()
                    .selectors(DiscoverySelectors.selectClass(testClass))
                    .build();
                
                Launcher launcher = LauncherFactory.create();
                SummaryGeneratingListener listener = new SummaryGeneratingListener();
                launcher.registerTestExecutionListeners(listener);
                launcher.execute(request);
                
                boolean passed = listener.getSummary().getFailures().isEmpty();
                if (passed) {
                    System.out.println("✓ " + slug);
                    results.add(new TestCase(slug, true));
                    passedCount++;
                } else {
                    System.out.println("✗ " + slug);
                    String message = listener.getSummary().getFailures().get(0)
                        .getException().getMessage();
                    results.add(new TestCase(slug, false, message));
                }
            } catch (Exception e) {
                System.out.println("✗ " + slug);
                results.add(new TestCase(slug, false, e.getMessage()));
            }
        }
        
        // Add locked challenges
        for (int i = testsToRun.size(); i < testsList.size(); i++) {
            results.add(new TestCase(testsList.get(i).getValue(), false, "Challenge locked"));
        }
        
        String summary = passedCount + "/" + testsToRun.size() + " tests passed (" + lockedCount + " locked)";
        boolean pass = passedCount == testsToRun.size();
        Report report = new Report("MODULE_PLACEHOLDER", summary, pass, results, currentIndex);
        
        // Write JSON report
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        try (FileWriter writer = new FileWriter(".dsa-report.json")) {
            gson.toJson(report, writer);
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        System.out.println("\nSummary: " + summary);
        System.exit(pass ? 0 : 1);
    }
}
JAVA_EOF
  
  # Replace placeholders
  sed -i '' "s/MODULE_PLACEHOLDER/${module}/g" "$template/src/test/java/TestRunner.java"
  sed -i '' "s|TEST_MAPPING_PLACEHOLDER|${test_config}|g" "$template/src/test/java/TestRunner.java"
  
  echo "  ✅ Updated Java runner"
}

update_cpp_runner() {
  local template=$1
  local module=$2
  
  echo "  Updating C++ test runner..."
  
  # Create tests directory if it doesn't exist
  mkdir -p "$template/tests"
  
  # Backup if file exists
  if [ -f "$template/tests/run.sh" ]; then
    cp "$template/tests/run.sh" "$BACKUP_DIR/${template}_run.sh.backup"
  fi
  
  # Determine test mapping based on module
  local test_mapping=""
  case $module in
    stack)
      test_mapping='    "CreateClass": "create-class",
    "Push": "push",
    "Pop": "pop",
    "Peek": "peek",
    "Size": "size"'
      ;;
    queue)
      test_mapping='    "CreateClass": "create-class",
    "Enqueue": "enqueue",
    "Dequeue": "dequeue",
    "Front": "front",
    "Size": "size"'
      ;;
    binary-search)
      test_mapping='    "EmptyArray": "empty-array",
    "FoundIndex": "found-index",
    "NotFound": "not-found",
    "Bounds": "bounds"'
      ;;
    min-heap)
      test_mapping='    "Insert": "insert",
    "HeapifyUp": "heapify-up",
    "Peek": "peek",
    "Extract": "extract",
    "HeapifyDown": "heapify-down",
    "Size": "size"'
      ;;
  esac
  
  # Write updated runner
  cat > "$template/tests/run.sh" << 'CPP_EOF'
#!/bin/bash
# C++/CMake test runner that generates .dsa-report.json with progressive unlocking

# Build the project
mkdir -p build
cd build
cmake .. > /dev/null 2>&1
cmake --build . > /dev/null 2>&1

# Run tests and capture output
./MODULE_TESTS_PLACEHOLDER --gtest_output=json:test_results.json > /dev/null 2>&1
test_exit_code=$?

# Parse Google Test JSON output and convert to .dsa-report.json format
cd ..
python3 << 'PYTHON_SCRIPT'
import json
import sys
import os

def get_current_challenge_index():
    """Read current challenge index from dsa.config.json"""
    try:
        if os.path.exists('dsa.config.json'):
            with open('dsa.config.json', 'r') as f:
                config = json.load(f)
                return config.get('currentChallengeIndex', 0)
    except Exception as e:
        print(f'Warning: Could not read dsa.config.json: {e}', file=sys.stderr)
    return 0

# Module configuration
MODULE_ID = 'MODULE_PLACEHOLDER'

# Test name to slug mapping
all_tests = [
TEST_MAPPING_LIST_PLACEHOLDER
]

current_index = get_current_challenge_index()
tests_to_run = all_tests[:current_index + 1]
locked_tests = all_tests[current_index + 1:]

print(f"Running tests for: {MODULE_ID}")
print(f"Current challenge: {current_index + 1}/{len(all_tests)}")
print()

try:
    with open("build/test_results.json", "r") as f:
        gtest_results = json.load(f)
    
    # Create map of test results
    test_results_map = {}
    for test_suite in gtest_results.get("testsuites", []):
        for test_case in test_suite.get("testsuite", []):
            test_name = test_case.get("name", "")
            has_failures = test_case.get("failures") is not None and len(test_case.get("failures", [])) > 0
            passed = test_case.get("status") == "RUN" and test_case.get("result") == "COMPLETED" and not has_failures
            failure_msg = test_case.get("failures", [{}])[0].get("failure", "Test failed") if test_case.get("failures") else None
            test_results_map[test_name] = (passed, failure_msg)
    
    cases = []
    passed_count = 0
    
    # Process tests to run
    for test_name, slug in tests_to_run:
        if test_name in test_results_map:
            passed, failure_msg = test_results_map[test_name]
            if passed:
                cases.append({"subchallengeId": slug, "passed": True})
                passed_count += 1
                print(f"✓ {slug}")
            else:
                cases.append({"subchallengeId": slug, "passed": False, "message": failure_msg or "Test failed"})
                print(f"✗ {slug}")
        else:
            # Test didn't run
            cases.append({"subchallengeId": slug, "passed": False, "message": "Test not found"})
            print(f"✗ {slug}")
    
    # Add locked tests
    for test_name, slug in locked_tests:
        cases.append({"subchallengeId": slug, "passed": False, "message": "Challenge locked"})
    
    total_run = len(tests_to_run)
    report = {
        "moduleId": MODULE_ID,
        "summary": f"{passed_count}/{total_run} tests passed ({len(locked_tests)} locked)",
        "pass": passed_count == total_run,
        "cases": cases,
        "currentChallengeIndex": current_index,
    }
    
    with open(".dsa-report.json", "w") as f:
        json.dump(report, f, indent=2)
    
    print(f"\nSummary: {report['summary']}")
    sys.exit(0 if report["pass"] else 1)

except Exception as e:
    # Fallback if JSON parsing fails
    cases = []
    for test_name, slug in tests_to_run:
        cases.append({"subchallengeId": slug, "passed": False, "message": str(e)})
    for test_name, slug in locked_tests:
        cases.append({"subchallengeId": slug, "passed": False, "message": "Challenge locked"})
    
    report = {
        "moduleId": MODULE_ID,
        "summary": f"0/{len(tests_to_run)} tests passed ({len(locked_tests)} locked)",
        "pass": False,
        "cases": cases,
        "currentChallengeIndex": current_index,
    }
    
    with open(".dsa-report.json", "w") as f:
        json.dump(report, f, indent=2)
    
    print("✗ Tests failed to run")
    print(f"\nSummary: {report['summary']}")
    sys.exit(1)
PYTHON_SCRIPT
CPP_EOF
  
  # Convert test mapping to Python list format
  local test_list=""
  case $module in
    stack)
      test_list='    ("CreateClass", "create-class"),
    ("Push", "push"),
    ("Pop", "pop"),
    ("Peek", "peek"),
    ("Size", "size"),'
      ;;
    queue)
      test_list='    ("CreateClass", "create-class"),
    ("Enqueue", "enqueue"),
    ("Dequeue", "dequeue"),
    ("Front", "front"),
    ("Size", "size"),'
      ;;
    binary-search)
      test_list='    ("EmptyArray", "empty-array"),
    ("FoundIndex", "found-index"),
    ("NotFound", "not-found"),
    ("Bounds", "bounds"),'
      ;;
    min-heap)
      test_list='    ("Insert", "insert"),
    ("HeapifyUp", "heapify-up"),
    ("Peek", "peek"),
    ("Extract", "extract"),
    ("HeapifyDown", "heapify-down"),
    ("Size", "size"),'
      ;;
  esac
  
  # Replace placeholders
  local module_tests="${module//-/_}_tests"
  sed -i '' "s/MODULE_PLACEHOLDER/${module}/g" "$template/tests/run.sh"
  sed -i '' "s/MODULE_TESTS_PLACEHOLDER/${module_tests}/g" "$template/tests/run.sh"
  sed -i '' "s|TEST_MAPPING_LIST_PLACEHOLDER|${test_list}|g" "$template/tests/run.sh"
  
  chmod +x "$template/tests/run.sh"
  echo "  ✅ Updated C++ runner"
}

# ============================================
# Main Update Loop
# ============================================

for template in "${TEMPLATES[@]}"; do
  echo "=============================================="
  echo "📦 Processing: $template"
  echo "=============================================="
  
  if [ ! -d "$template" ]; then
    echo "  ⚠️  Directory not found, skipping..."
    ((SKIP_COUNT++))
    continue
  fi
  
  # Extract module name from template name
  # e.g., template-dsa-stack-ts -> stack
  module=$(echo "$template" | sed 's/template-dsa-//' | sed 's/-ts$//' | sed 's/-js$//' | sed 's/-py$//' | sed 's/-java$//' | sed 's/-cpp$//' | sed 's/-go$//')
  lang=$(echo "$template" | sed 's/.*-//')
  
  echo "  Module: $module | Language: $lang"
  
  cd "$template"
  
  # Update based on language
  case $lang in
    ts|js)
      if [ -f "tests/run.js" ]; then
        update_nodejs_runner "$template" "$module"
        ((SUCCESS_COUNT++))
      else
        echo "  ⚠️  tests/run.js not found, skipping..."
        ((SKIP_COUNT++))
      fi
      ;;
    py)
      if [ -f "tests/run.py" ]; then
        update_python_runner "$template" "$module"
        ((SUCCESS_COUNT++))
      else
        echo "  ⚠️  tests/run.py not found, skipping..."
        ((SKIP_COUNT++))
      fi
      ;;
    go)
      if [ -f "tests/run.go" ]; then
        update_go_runner "$template" "$module"
        ((SUCCESS_COUNT++))
      else
        echo "  ⚠️  tests/run.go not found, skipping..."
        ((SKIP_COUNT++))
      fi
      ;;
    java)
      if [ -f "src/test/java/TestRunner.java" ]; then
        update_java_runner "$template" "$module"
        ((SUCCESS_COUNT++))
      else
        echo "  ⚠️  src/test/java/TestRunner.java not found, skipping..."
        ((SKIP_COUNT++))
      fi
      ;;
    cpp)
      if [ -f "tests/run.sh" ]; then
        update_cpp_runner "$template" "$module"
        ((SUCCESS_COUNT++))
      else
        echo "  ⚠️  tests/run.sh not found, skipping..."
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
  echo ""
  echo "Next steps:"
  echo "  1. Review changes in a few templates"
  echo "  2. Test with a sample project"
  echo "  3. Push updates: ./push-all-templates.sh"
else
  echo "⚠️  Some templates were skipped. Please review output above."
fi

echo ""

