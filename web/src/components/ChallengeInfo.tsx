import React from "react";
import {
  Code2,
  Lightbulb,
  Target,
  CheckCircle2,
  AlertCircle,
  Check,
  Copy,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ChallengeSteps } from "./ChallengeSteps";
import { ChallengeData } from "@/data/challenges/types";
import { getSubchallengeInstruction } from "@/data/subchallenge-instructions";

interface TimelineStep {
  id: string;
  name: string;
  completed: boolean;
}

interface ChallengeInfoProps {
  title: string;
  summary: string;
  description: string;
  concept: string;
  benefits: string[];
  githubRepoUrl?: string;
  challengeData?: ChallengeData;
  currentStepIndex?: number;
  timelineSteps?: TimelineStep[];
  selectedLanguage?: string;
  onStartChallenge?: (language: string) => void;
  isCreatingProject?: boolean;
  projectError?: string | null;
  moduleId?: string; // e.g., 'stack', 'min-heap'
  subchallengeName?: string; // e.g., 'Insert', 'Heapify up'
  onNewAttempt?: () => void; // Callback to go back to language selection
}

export function ChallengeInfo({
  title,
  summary,
  description,
  concept,
  benefits,
  githubRepoUrl,
  challengeData,
  currentStepIndex = 0,
  timelineSteps: _timelineSteps = [], // Reserved for future use
  selectedLanguage,
  onStartChallenge,
  isCreatingProject = false,
  projectError = null,
  moduleId,
  onNewAttempt: _onNewAttempt,
  subchallengeName,
}: ChallengeInfoProps) {
  const [copied, setCopied] = React.useState(false);
  // Step 0 = Choose Language
  // Step 1+ = Challenge steps
  const isLanguageStep = currentStepIndex === 0;
  const challengeStepIndex = currentStepIndex > 0 ? currentStepIndex - 1 : -1;
  const currentStep = challengeData?.steps[challengeStepIndex];
  // const currentTimelineStep = timelineSteps[currentStepIndex] // Reserved for future use

  // Get detailed instructions for the current subchallenge
  const instruction =
    moduleId && subchallengeName
      ? getSubchallengeInstruction(moduleId, subchallengeName)
      : null;

  // Helper to generate dynamic page title
  const getPageTitle = (): string => {
    // If on language selection step, show simplified challenge name
    if (isLanguageStep) {
      // Remove "Build a " prefix if present, otherwise just use the title
      return title.replace(/^Build a /i, "").replace(/^Build /i, "");
    }
    
    // If we have instruction with a title, use that
    if (instruction?.title) {
      // Extract the main action from instruction title
      // e.g., "Implement enqueue() Method" -> "Implement enqueue()"
      // e.g., "Create Queue Class" -> "Create Queue Class"
      return instruction.title.replace(/ Method$/, "").replace(/ Helper Method$/, "");
    }
    
    // If we have a subchallenge name, format it nicely
    if (subchallengeName && subchallengeName !== "Choose Language") {
      // Capitalize and format the subchallenge name
      const formatted = subchallengeName
        .split(/(?=[A-Z])/)
        .join(" ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      return formatted;
    }
    
    // Fallback to simplified challenge name
    return title.replace(/^Build a /i, "").replace(/^Build /i, "");
  };

  // Helper to generate dynamic page subheading
  const getPageSubheading = (): string => {
    // If on language selection step, show challenge summary
    if (isLanguageStep) {
      return summary;
    }
    
    // If we have instruction with an objective, use that
    if (instruction?.objective) {
      return instruction.objective;
    }
    
    // Fallback to challenge summary
    return summary;
  };

  // Helper to get display name for language
  const getLanguageDisplayName = (lang: string) => {
    const displayNames: Record<string, string> = {
      typescript: "TypeScript",
      javascript: "JavaScript",
      python: "Python",
      go: "Go",
      java: "Java",
      "c++": "C++",
    };
    return displayNames[lang.toLowerCase()] || lang;
  };

  // Helper to map language to syntax highlighter language
  const getSyntaxLanguage = (lang: string): string => {
    const langMap: Record<string, string> = {
      python: "python",
      java: "java",
      javascript: "javascript",
      typescript: "typescript",
      go: "go",
      "c++": "cpp",
    };
    return langMap[lang.toLowerCase()] || "javascript";
  };

  // Helper to get stack example code for selected language
  const getStackExample = (lang: string): string => {
    const examples: Record<string, string> = {
      python: `# Example: Reverse a string using stack
def reverse_string(s):
    stack = []
    
    # Push all characters onto the stack
    for char in s:
        stack.append(char)
    
    reversed_str = ""
    # Pop all characters from the stack
    while stack:
        reversed_str += stack.pop()
    
    return reversed_str


# Usage
result = reverse_string("STACK")
print(result)  # Output: KCATS`,
      
      java: `// Example: Reverse a string using stack
import java.util.Stack;

public class StackExample {
    public static String reverseString(String s) {
        Stack<Character> stack = new Stack<>();
        
        // Push all characters onto the stack
        for (char c : s.toCharArray()) {
            stack.push(c);
        }
        
        StringBuilder reversed = new StringBuilder();
        // Pop all characters from the stack
        while (!stack.isEmpty()) {
            reversed.append(stack.pop());
        }
        
        return reversed.toString();
    }
    
    public static void main(String[] args) {
        String result = reverseString("STACK");
        System.out.println(result);  // Output: KCATS
    }
}`,
      
      javascript: `// Example: Reverse a string using stack
function reverseString(s) {
    const stack = [];
    
    // Push all characters onto the stack
    for (let char of s) {
        stack.push(char);
    }
    
    let reversed = "";
    // Pop all characters from the stack
    while (stack.length > 0) {
        reversed += stack.pop();
    }
    
    return reversed;
}


// Usage
const result = reverseString("STACK");
console.log(result);  // Output: KCATS`,
      
      typescript: `// Example: Reverse a string using stack
function reverseString(s: string): string {
    const stack: string[] = [];
    
    // Push all characters onto the stack
    for (const char of s) {
        stack.push(char);
    }
    
    let reversed = "";
    // Pop all characters from the stack
    while (stack.length > 0) {
        const char = stack.pop();
        if (char) {
            reversed += char;
        }
    }
    
    return reversed;
}


// Usage
const result = reverseString("STACK");
console.log(result);  // Output: KCATS`,
    };
    
    return examples[lang.toLowerCase()] || examples.javascript;
  };

  // Helper to get queue example code for selected language
  const getQueueExample = (lang: string): string => {
    const examples: Record<string, string> = {
      python: `# Example: Simulate a ticket counter using queue
def simulate_ticket_counter(customers):
    queue = []
    
    # Enqueue all customers
    for name in customers:
        queue.append(name)
    
    print("Serving customers:")
    # Dequeue and serve customers in FIFO order
    while queue:
        print("Now serving:", queue.pop(0))


# Usage
simulate_ticket_counter(["Alice", "Bob", "Charlie", "Diana"])
# Output:
# Serving customers:
# Now serving: Alice
# Now serving: Bob
# Now serving: Charlie
# Now serving: Diana`,
      
      java: `// Example: Simulate a ticket counter using queue
import java.util.LinkedList;
import java.util.Queue;

public class QueueExample {
    public static void simulateTicketCounter(String[] customers) {
        Queue<String> queue = new LinkedList<>();
        
        // Enqueue all customers
        for (String name : customers) {
            queue.offer(name);
        }
        
        System.out.println("Serving customers:");
        // Dequeue and serve customers in FIFO order
        while (!queue.isEmpty()) {
            System.out.println("Now serving: " + queue.poll());
        }
    }
    
    public static void main(String[] args) {
        String[] customers = {"Alice", "Bob", "Charlie", "Diana"};
        simulateTicketCounter(customers);
        // Output:
        // Serving customers:
        // Now serving: Alice
        // Now serving: Bob
        // Now serving: Charlie
        // Now serving: Diana
    }
}`,
      
      javascript: `// Example: Simulate a ticket counter using queue
function simulateTicketCounter(customers) {
    const queue = [];
    
    // Enqueue all customers
    for (let name of customers) {
        queue.push(name);
    }
    
    console.log("Serving customers:");
    // Dequeue and serve customers in FIFO order
    while (queue.length > 0) {
        console.log("Now serving:", queue.shift());
    }
}


// Usage
simulateTicketCounter(["Alice", "Bob", "Charlie", "Diana"]);
// Output:
// Serving customers:
// Now serving: Alice
// Now serving: Bob
// Now serving: Charlie
// Now serving: Diana`,
      
      typescript: `// Example: Simulate a ticket counter using queue
function simulateTicketCounter(customers: string[]): void {
    const queue: string[] = [];
    
    // Enqueue all customers
    for (const name of customers) {
        queue.push(name);
    }
    
    console.log("Serving customers:");
    // Dequeue and serve customers in FIFO order
    while (queue.length > 0) {
        const customer = queue.shift();
        if (customer) {
            console.log("Now serving:", customer);
        }
    }
}


// Usage
simulateTicketCounter(["Alice", "Bob", "Charlie", "Diana"]);
// Output:
// Serving customers:
// Now serving: Alice
// Now serving: Bob
// Now serving: Charlie
// Now serving: Diana`,
    };
    
    return examples[lang.toLowerCase()] || examples.javascript;
  };

  // Helper to get binary search example code for selected language
  const getBinarySearchExample = (lang: string): string => {
    const examples: Record<string, string> = {
      python: `# Example: Binary Search (Iterative Implementation)
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1  # target not found


# Usage
numbers = [1, 3, 5, 7, 9, 11]
print(binary_search(numbers, 7))  # Output: 3
print(binary_search(numbers, 10))  # Output: -1

# Step-by-step example: [2, 4, 6, 8, 10, 12, 14], target = 10
# Step 1: left=0, right=6, mid=3, arr[3]=8 → 10 > 8 → search right
# Step 2: left=4, right=6, mid=5, arr[5]=12 → 10 < 12 → search left
# Step 3: left=4, right=4, mid=4, arr[4]=10 → found at index 4!`,
      
      java: `// Example: Binary Search (Iterative Implementation)
public class BinarySearchExample {
    public static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1;  // target not found
    }
    
    public static void main(String[] args) {
        int[] numbers = {1, 3, 5, 7, 9, 11};
        System.out.println(binarySearch(numbers, 7));  // Output: 3
        System.out.println(binarySearch(numbers, 10)); // Output: -1
        
        // Step-by-step example: [2, 4, 6, 8, 10, 12, 14], target = 10
        // Step 1: left=0, right=6, mid=3, arr[3]=8 → 10 > 8 → search right
        // Step 2: left=4, right=6, mid=5, arr[5]=12 → 10 < 12 → search left
        // Step 3: left=4, right=4, mid=4, arr[4]=10 → found at index 4!
    }
}`,
      
      javascript: `// Example: Binary Search (Iterative Implementation)
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;  // target not found
}


// Usage
const numbers = [1, 3, 5, 7, 9, 11];
console.log(binarySearch(numbers, 7));  // Output: 3
console.log(binarySearch(numbers, 10)); // Output: -1

// Step-by-step example: [2, 4, 6, 8, 10, 12, 14], target = 10
// Step 1: left=0, right=6, mid=3, arr[3]=8 → 10 > 8 → search right
// Step 2: left=4, right=6, mid=5, arr[5]=12 → 10 < 12 → search left
// Step 3: left=4, right=4, mid=4, arr[4]=10 → found at index 4!`,
    };
    
    return examples[lang.toLowerCase()] || examples.javascript;
  };

  // Helper to get min heap example code for selected language
  const getMinHeapExample = (lang: string): string => {
    const examples: Record<string, string> = {
      python: `# Example: Min Heap (Array Implementation)
class MinHeap:
    def __init__(self):
        self.heap = []
    
    def insert(self, val):
        self.heap.append(val)
        self._heapify_up(len(self.heap) - 1)
    
    def extract_min(self):
        if not self.heap:
            raise IndexError("extract_min from empty heap")
        if len(self.heap) == 1:
            return self.heap.pop()
        root = self.heap[0]
        self.heap[0] = self.heap.pop()
        self._heapify_down(0)
        return root
    
    def peek_min(self):
        if not self.heap:
            raise IndexError("peek_min from empty heap")
        return self.heap[0]
    
    def size(self):
        return len(self.heap)
    
    def is_empty(self):
        return len(self.heap) == 0
    
    def _heapify_up(self, index):
        parent = (index - 1) // 2
        if index > 0 and self.heap[index] < self.heap[parent]:
            self.heap[index], self.heap[parent] = self.heap[parent], self.heap[index]
            self._heapify_up(parent)
    
    def _heapify_down(self, index):
        smallest = index
        left = 2 * index + 1
        right = 2 * index + 2
        
        if left < len(self.heap) and self.heap[left] < self.heap[smallest]:
            smallest = left
        if right < len(self.heap) and self.heap[right] < self.heap[smallest]:
            smallest = right
        
        if smallest != index:
            self.heap[index], self.heap[smallest] = self.heap[smallest], self.heap[index]
            self._heapify_down(smallest)


# Usage
heap = MinHeap()
heap.insert(5)  # [5]
heap.insert(3)  # [3, 5] - 3 bubbles up
heap.insert(8)  # [3, 5, 8]
heap.insert(1)  # [1, 3, 8, 5] - 1 bubbles up
heap.insert(6)  # [1, 3, 8, 5, 6]

print(heap.peek_min())  # Output: 1
print(heap.extract_min())  # Output: 1, heap becomes [3, 5, 8, 6]`,
      
      java: `// Example: Min Heap (Array Implementation)
import java.util.ArrayList;
import java.util.List;

public class MinHeap {
    private List<Integer> heap;
    
    public MinHeap() {
        heap = new ArrayList<>();
    }
    
    public void insert(int val) {
        heap.add(val);
        heapifyUp(heap.size() - 1);
    }
    
    public int extractMin() {
        if (heap.isEmpty()) {
            throw new IllegalStateException("extractMin from empty heap");
        }
        if (heap.size() == 1) {
            return heap.remove(0);
        }
        int root = heap.get(0);
        heap.set(0, heap.remove(heap.size() - 1));
        heapifyDown(0);
        return root;
    }
    
    public int peekMin() {
        if (heap.isEmpty()) {
            throw new IllegalStateException("peekMin from empty heap");
        }
        return heap.get(0);
    }
    
    public int size() {
        return heap.size();
    }
    
    public boolean isEmpty() {
        return heap.isEmpty();
    }
    
    private void heapifyUp(int index) {
        int parent = (index - 1) / 2;
        if (index > 0 && heap.get(index) < heap.get(parent)) {
            swap(index, parent);
            heapifyUp(parent);
        }
    }
    
    private void heapifyDown(int index) {
        int smallest = index;
        int left = 2 * index + 1;
        int right = 2 * index + 2;
        
        if (left < heap.size() && heap.get(left) < heap.get(smallest)) {
            smallest = left;
        }
        if (right < heap.size() && heap.get(right) < heap.get(smallest)) {
            smallest = right;
        }
        
        if (smallest != index) {
            swap(index, smallest);
            heapifyDown(smallest);
        }
    }
    
    private void swap(int i, int j) {
        int temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }
    
    public static void main(String[] args) {
        MinHeap heap = new MinHeap();
        heap.insert(5);  // [5]
        heap.insert(3);  // [3, 5] - 3 bubbles up
        heap.insert(8);  // [3, 5, 8]
        heap.insert(1);  // [1, 3, 8, 5] - 1 bubbles up
        heap.insert(6);  // [1, 3, 8, 5, 6]
        
        System.out.println(heap.peekMin());      // Output: 1
        System.out.println(heap.extractMin());   // Output: 1, heap becomes [3, 5, 8, 6]
    }
}`,
      
      javascript: `// Example: Min Heap (Array Implementation)
class MinHeap {
    constructor() {
        this.heap = [];
    }
    
    insert(val) {
        this.heap.push(val);
        this.heapifyUp(this.heap.length - 1);
    }
    
    extractMin() {
        if (this.heap.length === 0) {
            throw new Error("extractMin from empty heap");
        }
        if (this.heap.length === 1) {
            return this.heap.pop();
        }
        const root = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return root;
    }
    
    peekMin() {
        if (this.heap.length === 0) {
            throw new Error("peekMin from empty heap");
        }
        return this.heap[0];
    }
    
    size() {
        return this.heap.length;
    }
    
    isEmpty() {
        return this.heap.length === 0;
    }
    
    heapifyUp(index) {
        const parent = Math.floor((index - 1) / 2);
        if (index > 0 && this.heap[index] < this.heap[parent]) {
            [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
            this.heapifyUp(parent);
        }
    }
    
    heapifyDown(index) {
        let smallest = index;
        const left = 2 * index + 1;
        const right = 2 * index + 2;
        
        if (left < this.heap.length && this.heap[left] < this.heap[smallest]) {
            smallest = left;
        }
        if (right < this.heap.length && this.heap[right] < this.heap[smallest]) {
            smallest = right;
        }
        
        if (smallest !== index) {
            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            this.heapifyDown(smallest);
        }
    }
}


// Usage
const heap = new MinHeap();
heap.insert(5);  // [5]
heap.insert(3);  // [3, 5] - 3 bubbles up
heap.insert(8);  // [3, 5, 8]
heap.insert(1);  // [1, 3, 8, 5] - 1 bubbles up
heap.insert(6);  // [1, 3, 8, 5, 6]

console.log(heap.peekMin());      // Output: 1
console.log(heap.extractMin());   // Output: 1, heap becomes [3, 5, 8, 6]`,
    };
    
    return examples[lang.toLowerCase()] || examples.javascript;
  };

  // Copy to clipboard handler
  const handleCopy = async () => {
    if (githubRepoUrl) {
      await navigator.clipboard.writeText(`git clone ${githubRepoUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 space-y-8">
      {/* Repository Box - Show at top if repo exists */}
      {githubRepoUrl && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4 text-center">
          <h2 className="text-2xl font-bold">Repository Created!</h2>
          <p className="text-muted-foreground">
            Your project repository has been created. Clone it to get started:
          </p>

          <div className="bg-muted rounded-lg p-4 font-mono text-sm">
            <div className="flex items-center justify-between">
              <code className="flex-1 text-foreground">git clone {githubRepoUrl}</code>
              <button
                onClick={handleCopy}
                className="ml-4 px-3 py-1 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            After cloning, run{" "}
            <code className="px-2 py-1 rounded bg-muted text-accent">
              dsa test
            </code>{" "}
            to check your progress.
          </p>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-4">{getPageTitle()}</h1>
        <p className="text-xl text-muted-foreground">{getPageSubheading()}</p>
      </div>

      {/* Step 0: Language Selection - Show general info */}
      {isLanguageStep && (
        <>
          {/* Description */}
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-foreground/90 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Concept Explanation */}
          <div className="rounded-xl border border-border bg-muted p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
                <Lightbulb className="h-5 w-5 text-accent" />
              </div>
              <h2 className="text-2xl font-bold">Understanding the Concept</h2>
            </div>
            <p className="text-foreground/90 leading-relaxed">{concept}</p>
          </div>

          {/* How This Helps You */}
          <div className="rounded-xl border border-border bg-muted p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 border border-success/20">
                <Target className="h-5 w-5 text-success" />
              </div>
              <h2 className="text-2xl font-bold">How This Helps You</h2>
            </div>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 mt-0.5">
                    <span className="text-xs font-bold text-accent">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-foreground/90">{benefit}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Code Example - Stack Usage */}
          {moduleId === 'stack' && (
            <div className="rounded-xl border border-border bg-muted p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
                  <Code2 className="h-5 w-5 text-accent" />
                </div>
                <h2 className="text-2xl font-bold">Example: Using a Stack</h2>
              </div>
              <p className="text-foreground/90 mb-4">
                Here's how to use a stack to reverse a string. Select a language to see the example:
              </p>
              {selectedLanguage ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border overflow-hidden">
                    <SyntaxHighlighter
                      language={getSyntaxLanguage(selectedLanguage)}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        lineHeight: "1.5",
                      }}
                      showLineNumbers={false}
                    >
                      {getStackExample(selectedLanguage)}
                    </SyntaxHighlighter>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This example demonstrates the LIFO principle: characters are pushed onto the stack,
                    then popped in reverse order to create the reversed string.
                  </p>
                </div>
              ) : (
                <div className="bg-background rounded-lg border border-border p-4 text-center text-muted-foreground">
                  <p>Select a language above to see a code example</p>
                </div>
              )}
            </div>
          )}

          {/* Code Example - Queue Usage */}
          {moduleId === 'queue' && (
            <div className="rounded-xl border border-border bg-muted p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
                  <Code2 className="h-5 w-5 text-accent" />
                </div>
                <h2 className="text-2xl font-bold">Example: Simulating a Ticket Counter</h2>
              </div>
              <p className="text-foreground/90 mb-4">
                Here's how to use a queue to simulate a ticket counter. Select a language to see the example:
              </p>
              {selectedLanguage ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border overflow-hidden">
                    <SyntaxHighlighter
                      language={getSyntaxLanguage(selectedLanguage)}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        lineHeight: "1.5",
                      }}
                      showLineNumbers={false}
                    >
                      {getQueueExample(selectedLanguage)}
                    </SyntaxHighlighter>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This example demonstrates the FIFO principle: customers join the queue in order,
                    and are served in the same order they arrived—just like a real ticket counter.
                  </p>
                </div>
              ) : (
                <div className="bg-background rounded-lg border border-border p-4 text-center text-muted-foreground">
                  <p>Select a language above to see a code example</p>
                </div>
              )}
            </div>
          )}

          {/* Code Example - Binary Search Usage */}
          {moduleId === 'binary-search' && (
            <div className="rounded-xl border border-border bg-muted p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
                  <Code2 className="h-5 w-5 text-accent" />
                </div>
                <h2 className="text-2xl font-bold">Example: Binary Search Implementation</h2>
              </div>
              <p className="text-foreground/90 mb-4">
                Here's an iterative binary search implementation. Select a language to see the example:
              </p>
              {selectedLanguage ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border overflow-hidden">
                    <SyntaxHighlighter
                      language={getSyntaxLanguage(selectedLanguage)}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        lineHeight: "1.5",
                      }}
                      showLineNumbers={false}
                    >
                      {getBinarySearchExample(selectedLanguage)}
                    </SyntaxHighlighter>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This example demonstrates the divide-and-conquer approach: each comparison eliminates half of the remaining elements,
                    achieving O(log n) time complexity. The algorithm repeatedly halves the search space until the target is found.
                  </p>
                </div>
              ) : (
                <div className="bg-background rounded-lg border border-border p-4 text-center text-muted-foreground">
                  <p>Select a language above to see a code example</p>
                </div>
              )}
            </div>
          )}

          {/* Code Example - Min Heap Usage */}
          {moduleId === 'min-heap' && (
            <div className="rounded-xl border border-border bg-muted p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
                  <Code2 className="h-5 w-5 text-accent" />
                </div>
                <h2 className="text-2xl font-bold">Example: Min Heap Implementation</h2>
              </div>
              <p className="text-foreground/90 mb-4">
                Here's a complete Min Heap implementation using an array. Select a language to see the example:
              </p>
              {selectedLanguage ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border overflow-hidden">
                    <SyntaxHighlighter
                      language={getSyntaxLanguage(selectedLanguage)}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        lineHeight: "1.5",
                      }}
                      showLineNumbers={false}
                    >
                      {getMinHeapExample(selectedLanguage)}
                    </SyntaxHighlighter>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This example demonstrates the complete Min Heap with insert, extractMin, peekMin, and helper methods.
                    The heap maintains the min-heap property where each parent is smaller than its children.
                    Elements bubble up when inserted and bubble down when the minimum is extracted.
                  </p>
                </div>
              ) : (
                <div className="bg-background rounded-lg border border-border p-4 text-center text-muted-foreground">
                  <p>Select a language above to see a code example</p>
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {projectError && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
              <div className="space-y-2">
                <p className="text-destructive font-semibold">Error creating project:</p>
                <p className="text-destructive whitespace-pre-wrap text-sm">{projectError}</p>
              </div>
            </div>
          )}

          {/* Start Button */}
          {!githubRepoUrl && (
            <div className="py-4">
              {!selectedLanguage ? (
                <button
                  disabled
                  className="px-6 py-3 rounded-lg bg-muted text-muted-foreground cursor-not-allowed font-medium"
                >
                  Select a language to continue
                </button>
              ) : (
                <button
                  onClick={() => onStartChallenge?.(selectedLanguage)}
                  disabled={isCreatingProject}
                  className="px-6 py-3 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 font-medium transition-colors font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingProject ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Creating repository...
                    </span>
                  ) : (
                    `Start with ${getLanguageDisplayName(selectedLanguage)}`
                  )}
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Step 1+: Show detailed coding instructions */}
      {!isLanguageStep && instruction && (
        <div className="space-y-6">
          {/* Objective */}
          <div className="rounded-xl border border-border bg-muted p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <h2 className="text-2xl font-bold">{instruction.title}</h2>
            </div>
            <p className="text-lg text-foreground/90">
              {instruction.objective}
            </p>
          </div>

          {/* Method Signature */}
          {selectedLanguage &&
            instruction.methodSignature[selectedLanguage.toLowerCase()] && (
              <div className="rounded-xl border border-border bg-muted p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Code2 className="h-5 w-5 text-accent" />
                  <h3 className="text-xl font-bold">Method Signature</h3>
                </div>
                <div className="rounded-lg border border-border bg-background p-4 font-mono text-sm overflow-x-auto">
                  <code className="text-accent">
                    {
                      instruction.methodSignature[
                        selectedLanguage.toLowerCase()
                      ]
                    }
                  </code>
                </div>
              </div>
            )}

          {/* Requirements */}
          <div className="rounded-xl border border-border bg-muted p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <h3 className="text-xl font-bold">Requirements</h3>
            </div>
            <ul className="space-y-2">
              {instruction.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/90">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Examples */}
          <div className="rounded-xl border border-border bg-muted p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="h-5 w-5 text-accent" />
              <h3 className="text-xl font-bold">Examples</h3>
            </div>
            <div className="space-y-4">
              {instruction.examples.map((example, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-background p-4 space-y-3"
                >
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-2">
                      Input:
                    </div>
                    <pre className="font-mono text-sm text-foreground/90 whitespace-pre-wrap">
                      {example.input}
                    </pre>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-2">
                      Output:
                    </div>
                    <pre className="font-mono text-sm text-success whitespace-pre-wrap">
                      {example.output}
                    </pre>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-2">
                      Explanation:
                    </div>
                    <p className="text-sm text-foreground/90">
                      {example.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hints */}
          <div className="rounded-xl border border-border bg-muted p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="h-5 w-5 text-warning" />
              <h3 className="text-xl font-bold">Hints</h3>
            </div>
            <ul className="space-y-2">
              {instruction.hints.map((hint, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-warning mt-0.5">💡</span>
                  <span className="text-foreground/90">{hint}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Edge Cases */}
          <div className="rounded-xl border border-border bg-muted p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <h3 className="text-xl font-bold">Edge Cases to Test</h3>
            </div>
            <ul className="space-y-2">
              {instruction.edgeCases.map((edge, i) => (
                <li key={i} className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/90">{edge}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Fallback: Show old step format if no instruction found */}
      {!isLanguageStep && !instruction && currentStep && challengeData && (
        <ChallengeSteps
          steps={challengeData.steps}
          learningOutcome={challengeData.learningOutcome}
          coreSkills={challengeData.coreSkills}
          integrationProject={challengeData.integrationProject}
          currentStepIndex={challengeStepIndex}
          showOnlyCurrentStep={true}
        />
      )}

    </div>
  );
}
