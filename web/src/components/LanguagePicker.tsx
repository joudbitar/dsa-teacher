import React from 'react'
import { Code2, X, Check, History, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SiTypescript, SiPython, SiGo, SiCplusplus } from 'react-icons/si'
import { FaJava } from 'react-icons/fa'

// JavaScript logo - yellow square with black JS text (like Sanity.io style)
const JavaScriptLogo = ({ size = 32 }: { size?: number }) => (
  <div
    style={{
      width: size,
      height: size,
      backgroundColor: '#F7DF1E',
      borderRadius: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: '700',
      fontSize: `${size * 0.45}px`,
      color: '#000000',
      letterSpacing: '-0.5px',
    }}
  >
    JS
  </div>
)

// Language history (same for all data structures)
export const languageHistory: Record<string, string> = {
  typescript: 'TypeScript was created by Microsoft in 2012 as a typed superset of JavaScript. It adds static type checking to JavaScript, making it easier to build large-scale applications. TypeScript compiles to plain JavaScript and is widely adopted in enterprise environments.',
  python: 'Python was created by Guido van Rossum in 1991. It emphasizes code readability and simplicity. Python has become one of the most popular languages for data science, web development, and automation.',
  javascript: 'JavaScript was created by Brendan Eich in 1995 for Netscape Navigator. Originally designed for browser scripting, it has evolved into a full-stack language powering modern web applications through Node.js.',
  go: 'Go (Golang) was created by Google in 2009 by Robert Griesemer, Rob Pike, and Ken Thompson. Designed for simplicity, concurrency, and performance, Go is widely used in cloud infrastructure and microservices.',
  java: 'Java was created by James Gosling at Sun Microsystems in 1995. Designed as "write once, run anywhere," Java became the language of enterprise applications and Android development.',
  cpp: 'C++ was created by Bjarne Stroustrup in 1985 as an extension of C. It combines low-level control with high-level abstractions, making it ideal for system programming, game engines, and performance-critical applications.'
}

// Real-world usage by data structure and language
export const realWorldUsage: Record<string, Record<string, string[]>> = {
  stack: {
    typescript: [
      'TypeScript\'s type system helps catch stack overflow errors at compile time',
      'React hooks use a stack internally to manage component state and effects',
      'TypeScript compilers use stacks for parsing and AST traversal',
      'Angular\'s dependency injection uses a stack to manage service resolution'
    ],
    python: [
      'Python\'s built-in list can be used as a stack with append() and pop() methods',
      'Used in web frameworks like Django and Flask for request handling and middleware stacks',
      'Python\'s call stack is fundamental to understanding recursion and function execution',
      'Data science libraries use stack-like structures for array operations and backtracking'
    ],
    javascript: [
      'Browser call stacks track function execution and help debug with stack traces',
      'React uses a virtual DOM stack for efficient component rendering and updates',
      'Express.js middleware stack processes HTTP requests in a LIFO order',
      'JavaScript arrays naturally support stack operations (push/pop) for managing state'
    ],
    go: [
      'Go\'s slice type can efficiently implement stacks with append() and slicing operations',
      'Used in Kubernetes and Docker for managing resource stacks and container orchestration',
      'Goroutines use stack-based memory management for concurrent execution',
      'Go\'s defer statements create a stack of cleanup operations executed in reverse order'
    ],
    java: [
      'Java\'s Stack class (java.util.Stack) is used for expression evaluation and parsing',
      'JVM call stack manages method invocations and exception handling',
      'Spring Framework uses stack-based dependency injection and bean management',
      'Android development uses activity stacks for navigation and back button behavior'
    ],
    cpp: [
      'C++ std::stack container is used in compilers for parsing and code generation',
      'Game engines like Unreal Engine use stacks for undo/redo systems and state management',
      'Operating systems use stack-based memory allocation for function calls',
      'High-frequency trading systems implement custom stacks for ultra-low latency operations'
    ]
  },
  queue: {
    typescript: [
      'TypeScript\'s async/await uses queues internally for managing promise chains',
      'Event-driven architectures use queues for handling user interactions and API calls',
      'TypeScript-based message brokers (like Bull) use queues for job processing',
      'React\'s concurrent mode uses queues for scheduling and prioritizing updates'
    ],
    python: [
      'Python\'s queue.Queue is used for thread-safe communication between threads',
      'Celery uses queues for distributed task processing in Django applications',
      'Python web servers use queues for handling HTTP requests and responses',
      'Data pipelines use queues for processing streams of data efficiently'
    ],
    javascript: [
      'Node.js event loop uses queues (callback queue, microtask queue) for async operations',
      'Message queues like RabbitMQ and Redis are used for decoupling services',
      'Browser task queues manage rendering, user input, and network requests',
      'Job queues in Node.js (Bull, Agenda) process background tasks asynchronously'
    ],
    go: [
      'Go channels implement queue-like behavior for goroutine communication',
      'Kubernetes uses queues for scheduling pods and managing workloads',
      'Go\'s buffered channels act as queues for producer-consumer patterns',
      'Message queue systems like NATS use Go for high-performance message routing'
    ],
    java: [
      'Java\'s BlockingQueue is used in thread pools and executor services',
      'Spring Integration uses queues for message-driven architectures',
      'Java Message Service (JMS) provides queue-based messaging for enterprise apps',
      'Android uses queues for managing UI updates and background tasks'
    ],
    cpp: [
      'C++ std::queue is used in operating systems for process scheduling',
      'Game engines use queues for event handling and frame processing',
      'Network stacks use queues for buffering packets and managing connections',
      'Real-time systems use lock-free queues for inter-thread communication'
    ]
  },
  'binary-search': {
    typescript: [
      'TypeScript\'s Array.findIndex() uses binary search internally for sorted arrays',
      'Database query optimizers use binary search for index lookups',
      'TypeScript-based search libraries use binary search for fast lookups',
      'Git uses binary search for finding commits in sorted commit history'
    ],
    python: [
      'Python\'s bisect module provides binary search functions for sorted lists',
      'NumPy uses binary search for finding insertion points in sorted arrays',
      'Database systems use binary search for index-based queries',
      'Python\'s sorted() function internally uses binary search for efficient sorting'
    ],
    javascript: [
      'JavaScript engines use binary search for optimizing property lookups in objects',
      'Search engines use binary search for finding documents in sorted indexes',
      'Browser APIs use binary search for efficient range queries',
      'JavaScript libraries use binary search for autocomplete and search features'
    ],
    go: [
      'Go\'s sort.Search() uses binary search for finding elements in sorted slices',
      'Database systems written in Go use binary search for index lookups',
      'Go\'s map implementation uses binary search for collision resolution',
      'Distributed systems use binary search for finding nodes in sorted key ranges'
    ],
    java: [
      'Java\'s Arrays.binarySearch() is used extensively in collections and algorithms',
      'Database systems like Hibernate use binary search for query optimization',
      'Java\'s TreeMap uses binary search internally for key lookups',
      'Search engines like Elasticsearch use binary search for document retrieval'
    ],
    cpp: [
      'C++ std::binary_search() is used in STL algorithms for efficient searching',
      'Database engines use binary search for B-tree index lookups',
      'Game engines use binary search for spatial partitioning and culling',
      'Operating systems use binary search for memory management and page tables'
    ]
  },
  'min-heap': {
    typescript: [
      'TypeScript-based priority queues use min-heaps for task scheduling',
      'Graph algorithms in TypeScript use min-heaps for Dijkstra\'s shortest path',
      'TypeScript event schedulers use min-heaps for time-based event ordering',
      'TypeScript-based game engines use heaps for AI decision-making'
    ],
    python: [
      'Python\'s heapq module provides min-heap functionality for priority queues',
      'Dijkstra\'s algorithm uses min-heaps for finding shortest paths in graphs',
      'Python\'s asyncio uses heaps for scheduling coroutines by priority',
      'Data processing pipelines use heaps for maintaining top-K elements'
    ],
    javascript: [
      'JavaScript priority queue libraries use min-heaps for task scheduling',
      'Graph algorithms use min-heaps for implementing Dijkstra\'s algorithm',
      'Browser engines use heaps for managing render priority and z-index',
      'Node.js uses heaps for scheduling timers and callbacks by priority'
    ],
    go: [
      'Go\'s container/heap package provides min-heap implementation',
      'Go-based schedulers use heaps for prioritizing goroutines and tasks',
      'Graph algorithms in Go use min-heaps for shortest path calculations',
      'Go\'s time package uses heaps internally for timer management'
    ],
    java: [
      'Java\'s PriorityQueue uses min-heaps for maintaining sorted elements',
      'Java-based schedulers use heaps for task prioritization',
      'Graph algorithms use heaps for implementing Dijkstra\'s and Prim\'s algorithms',
      'Java\'s garbage collector uses heaps for memory management'
    ],
    cpp: [
      'C++ std::priority_queue uses min-heaps for priority-based operations',
      'Game engines use heaps for AI pathfinding and decision-making',
      'Operating systems use heaps for process scheduling and priority queues',
      'C++ STL algorithms use heaps for partial sorting and top-K selection'
    ]
  },
  'linked-list': {
    typescript: [
      'TypeScript\'s arrays are implemented using linked lists in some JavaScript engines',
      'React\'s Fiber architecture uses linked lists for component tree traversal',
      'TypeScript-based undo/redo systems use linked lists for maintaining history',
      'Graph algorithms use linked lists for adjacency list representations'
    ],
    python: [
      'Python\'s list is implemented as a dynamic array, but linked lists are used in deque',
      'Python\'s collections.deque uses a doubly-linked list for O(1) operations',
      'Graph algorithms use linked lists for representing adjacency lists',
      'Python\'s garbage collector uses linked lists for tracking object references'
    ],
    javascript: [
      'JavaScript engines use linked lists for managing object property chains',
      'React\'s reconciliation algorithm uses linked lists for diffing components',
      'JavaScript\'s prototype chain is implemented using linked lists',
      'Event listeners are stored in linked lists for efficient iteration'
    ],
    go: [
      'Go\'s container/list package provides doubly-linked list implementation',
      'Go\'s garbage collector uses linked lists for tracking object references',
      'Go channels internally use linked lists for buffering messages',
      'Go\'s runtime uses linked lists for managing goroutine scheduling'
    ],
    java: [
      'Java\'s LinkedList class is used for frequent insertions and deletions',
      'Java\'s garbage collector uses linked lists for tracking object references',
      'Java collections use linked lists for implementing hash table collision chains',
      'Java\'s JVM uses linked lists for method resolution and class loading'
    ],
    cpp: [
      'C++ std::list provides doubly-linked list implementation',
      'C++ STL uses linked lists for implementing other containers',
      'Operating systems use linked lists for process control blocks',
      'Memory allocators use linked lists for managing free memory blocks'
    ]
  },
  'hash-table': {
    typescript: [
      'TypeScript objects and Maps use hash tables for O(1) key-value lookups',
      'TypeScript-based caches use hash tables for fast data retrieval',
      'React uses hash tables for component memoization and caching',
      'TypeScript compilers use hash tables for symbol tables and scopes'
    ],
    python: [
      'Python dictionaries are implemented using hash tables for O(1) average lookups',
      'Python\'s set uses hash tables for fast membership testing',
      'Django uses hash tables for session management and caching',
      'Python\'s namespace resolution uses hash tables for variable lookups'
    ],
    javascript: [
      'JavaScript objects and Maps use hash tables internally for property access',
      'Browser caches use hash tables for storing and retrieving resources',
      'JavaScript engines use hash tables for property lookups and prototype chains',
      'Node.js uses hash tables for module caching and require() resolution'
    ],
    go: [
      'Go maps are implemented using hash tables for efficient key-value storage',
      'Go\'s sync.Map uses hash tables for concurrent-safe operations',
      'Go web frameworks use hash tables for routing and parameter storage',
      'Go\'s garbage collector uses hash tables for tracking object references'
    ],
    java: [
      'Java\'s HashMap and Hashtable use hash tables for key-value storage',
      'Java\'s HashSet uses hash tables for fast set operations',
      'Spring Framework uses hash tables for bean storage and dependency injection',
      'Java\'s JVM uses hash tables for class loading and method resolution'
    ],
    cpp: [
      'C++ std::unordered_map uses hash tables for O(1) average lookups',
      'C++ std::unordered_set uses hash tables for fast set operations',
      'Game engines use hash tables for asset management and resource caching',
      'Operating systems use hash tables for file system indexing and inode tables'
    ]
  },
  'binary-tree': {
    typescript: [
      'TypeScript compilers use binary trees for representing abstract syntax trees (AST)',
      'React\'s virtual DOM uses tree structures for component hierarchies',
      'TypeScript-based expression parsers use binary trees for operator precedence',
      'TypeScript IDEs use trees for code navigation and symbol resolution'
    ],
    python: [
      'Python\'s AST module uses binary trees for representing code structure',
      'Python\'s xml.etree uses tree structures for parsing XML documents',
      'Django templates use tree structures for rendering component hierarchies',
      'Python\'s decision trees in machine learning use binary tree structures'
    ],
    javascript: [
      'JavaScript\'s DOM is a tree structure for representing HTML documents',
      'React\'s component tree uses binary tree concepts for rendering',
      'JavaScript parsers use binary trees for representing code structure',
      'Browser engines use trees for CSS selector matching and layout calculations'
    ],
    go: [
      'Go\'s AST package uses binary trees for representing Go code structure',
      'Go template engines use tree structures for parsing and rendering',
      'Go\'s encoding/xml uses trees for parsing XML documents',
      'Go-based compilers use trees for code generation and optimization'
    ],
    java: [
      'Java\'s DOM API uses tree structures for XML and HTML parsing',
      'Java compilers use binary trees for representing abstract syntax trees',
      'Java\'s Swing and JavaFX use tree structures for UI component hierarchies',
      'Java-based expression evaluators use binary trees for operator precedence'
    ],
    cpp: [
      'C++ compilers use binary trees for representing abstract syntax trees',
      'C++ STL doesn\'t have a tree container, but trees are used in map/set implementations',
      'Game engines use binary trees for spatial partitioning and scene graphs',
      'Operating systems use trees for file system hierarchies and directory structures'
    ]
  },
  graph: {
    typescript: [
      'TypeScript-based social networks use graphs for representing user connections',
      'TypeScript build tools use graphs for dependency resolution and task scheduling',
      'TypeScript-based routing systems use graphs for finding optimal paths',
      'TypeScript compilers use graphs for analyzing code dependencies'
    ],
    python: [
      'Python\'s NetworkX library uses graphs for network analysis and social networks',
      'Python web crawlers use graphs for representing website link structures',
      'Python machine learning uses graphs for neural network representations',
      'Python dependency managers use graphs for resolving package dependencies'
    ],
    javascript: [
      'JavaScript bundlers (Webpack, Vite) use graphs for module dependency resolution',
      'Social media platforms use graphs for representing user relationships',
      'JavaScript-based routing uses graphs for navigation and pathfinding',
      'Browser engines use graphs for CSS dependency resolution and layout'
    ],
    go: [
      'Go-based microservices use graphs for service dependency mapping',
      'Go build tools use graphs for package dependency resolution',
      'Go networking libraries use graphs for routing and pathfinding',
      'Kubernetes uses graphs for representing pod and service relationships'
    ],
    java: [
      'Java build tools (Maven, Gradle) use graphs for dependency resolution',
      'Java-based social networks use graphs for user relationship modeling',
      'Java routing frameworks use graphs for finding optimal paths',
      'Java compilers use graphs for analyzing class dependencies'
    ],
    cpp: [
      'C++ build systems use graphs for dependency resolution and compilation order',
      'Game engines use graphs for AI pathfinding and navigation meshes',
      'Operating systems use graphs for process scheduling and resource allocation',
      'C++ compilers use graphs for optimization and code generation'
    ]
  },
  trie: {
    typescript: [
      'TypeScript-based autocomplete systems use tries for fast prefix matching',
      'TypeScript routers use tries for efficient URL pattern matching',
      'TypeScript search engines use tries for indexing and querying text',
      'TypeScript IDEs use tries for code completion and symbol lookup'
    ],
    python: [
      'Python autocomplete libraries use tries for fast prefix searches',
      'Python routers (Django, Flask) use tries for URL routing',
      'Python search engines use tries for indexing documents and queries',
      'Python text processing uses tries for spell checking and word suggestions'
    ],
    javascript: [
      'JavaScript autocomplete libraries use tries for fast prefix matching',
      'JavaScript routers use tries for efficient route matching',
      'Browser address bars use tries for URL autocomplete and history',
      'JavaScript search engines use tries for indexing and querying'
    ],
    go: [
      'Go routers (Gorilla, Echo) use tries for efficient route matching',
      'Go-based search engines use tries for text indexing',
      'Go autocomplete systems use tries for fast prefix searches',
      'Go text processing uses tries for spell checking and suggestions'
    ],
    java: [
      'Java search engines (Lucene, Elasticsearch) use tries for text indexing',
      'Java routers use tries for efficient URL pattern matching',
      'Java autocomplete systems use tries for fast prefix matching',
      'Java IDEs use tries for code completion and symbol lookup'
    ],
    cpp: [
      'C++ search engines use tries for fast text indexing and querying',
      'C++ routers use tries for efficient pattern matching',
      'C++ autocomplete systems use tries for prefix searches',
      'C++ compilers use tries for symbol table lookups'
    ]
  },
  bst: {
    typescript: [
      'TypeScript-based databases use BSTs for maintaining sorted indexes',
      'TypeScript search systems use BSTs for range queries and lookups',
      'TypeScript caching systems use BSTs for maintaining sorted key-value pairs',
      'TypeScript compilers use BSTs for symbol table management'
    ],
    python: [
      'Python\'s sortedcontainers uses BSTs for maintaining sorted data structures',
      'Python databases use BSTs for index maintenance and range queries',
      'Python search systems use BSTs for efficient lookups and range operations',
      'Python caching libraries use BSTs for maintaining sorted caches'
    ],
    javascript: [
      'JavaScript databases use BSTs for maintaining sorted indexes',
      'JavaScript search systems use BSTs for range queries',
      'JavaScript caching systems use BSTs for sorted key-value storage',
      'Browser engines use BSTs for maintaining sorted data structures'
    ],
    go: [
      'Go databases use BSTs for index maintenance and range queries',
      'Go search systems use BSTs for efficient lookups',
      'Go caching libraries use BSTs for maintaining sorted data',
      'Go compilers use BSTs for symbol table management'
    ],
    java: [
      'Java\'s TreeMap uses BSTs (Red-Black trees) for sorted key-value storage',
      'Java databases use BSTs for index maintenance and queries',
      'Java search systems use BSTs for range queries and lookups',
      'Java caching frameworks use BSTs for maintaining sorted caches'
    ],
    cpp: [
      'C++ std::map uses BSTs (typically Red-Black trees) for sorted storage',
      'C++ databases use BSTs for index maintenance',
      'C++ search systems use BSTs for range queries',
      'C++ game engines use BSTs for spatial indexing and culling'
    ]
  },
  'avl-tree': {
    typescript: [
      'TypeScript databases use AVL trees for maintaining balanced sorted indexes',
      'TypeScript search systems use AVL trees for guaranteed O(log n) operations',
      'TypeScript caching systems use AVL trees for maintaining sorted data with balance',
      'TypeScript compilers use AVL trees for symbol table management'
    ],
    python: [
      'Python databases use AVL trees for balanced index maintenance',
      'Python search systems use AVL trees for guaranteed performance',
      'Python sorted data structures use AVL trees for maintaining balance',
      'Python caching systems use AVL trees for sorted storage'
    ],
    javascript: [
      'JavaScript databases use AVL trees for balanced sorted indexes',
      'JavaScript search systems use AVL trees for guaranteed O(log n) lookups',
      'JavaScript caching systems use AVL trees for maintaining sorted data',
      'Browser engines use AVL trees for balanced data structures'
    ],
    go: [
      'Go databases use AVL trees for balanced index maintenance',
      'Go search systems use AVL trees for guaranteed performance',
      'Go caching libraries use AVL trees for sorted storage',
      'Go compilers use AVL trees for symbol table management'
    ],
    java: [
      'Java databases use AVL trees for balanced index maintenance',
      'Java search systems use AVL trees for guaranteed O(log n) operations',
      'Java TreeMap implementations may use AVL trees for balance',
      'Java caching frameworks use AVL trees for sorted storage'
    ],
    cpp: [
      'C++ databases use AVL trees for balanced index maintenance',
      'C++ search systems use AVL trees for guaranteed performance',
      'C++ std::map implementations may use AVL trees',
      'C++ game engines use AVL trees for balanced spatial indexing'
    ]
  },
  sorting: {
    typescript: [
      'TypeScript\'s Array.sort() uses efficient sorting algorithms internally',
      'TypeScript-based data processing uses sorting for organizing and analyzing data',
      'TypeScript search systems use sorting as a preprocessing step for binary search',
      'TypeScript UI libraries use sorting for displaying ordered lists and tables'
    ],
    python: [
      'Python\'s list.sort() and sorted() use Timsort, a hybrid stable sorting algorithm',
      'Python data science libraries use sorting for data analysis and visualization',
      'Python databases use sorting for query results and index maintenance',
      'Python web frameworks use sorting for pagination and ordered data display'
    ],
    javascript: [
      'JavaScript\'s Array.sort() uses an efficient sorting algorithm (implementation-dependent)',
      'JavaScript data processing uses sorting for organizing and filtering data',
      'JavaScript search systems use sorting for preparing data for binary search',
      'JavaScript UI frameworks use sorting for displaying ordered lists and grids'
    ],
    go: [
      'Go\'s sort package provides efficient sorting algorithms for slices',
      'Go data processing uses sorting for organizing and analyzing data',
      'Go databases use sorting for query results and index maintenance',
      'Go web frameworks use sorting for API responses and data display'
    ],
    java: [
      'Java\'s Arrays.sort() and Collections.sort() use efficient sorting algorithms',
      'Java data processing uses sorting for organizing and analyzing large datasets',
      'Java databases use sorting for query optimization and result ordering',
      'Java UI frameworks use sorting for displaying ordered tables and lists'
    ],
    cpp: [
      'C++ std::sort() uses an efficient hybrid sorting algorithm (typically introsort)',
      'C++ data processing uses sorting for organizing and analyzing performance-critical data',
      'C++ databases use sorting for query optimization and index maintenance',
      'C++ game engines use sorting for rendering order and z-buffer management'
    ]
  }
}

const languages: Array<{
  id: string
  name: string
  ext: string
  logo: React.ComponentType<any>
  color: string
  isCustom?: boolean
}> = [
  { id: 'typescript', name: 'TypeScript', ext: 'ts', logo: SiTypescript, color: '#3178C6' },
  { id: 'python', name: 'Python', ext: 'py', logo: SiPython, color: '#3776AB' },
  { id: 'javascript', name: 'JavaScript', ext: 'js', logo: JavaScriptLogo, color: '#F7DF1E', isCustom: true },
  { id: 'go', name: 'Go', ext: 'go', logo: SiGo, color: '#00ADD8' },
  { id: 'java', name: 'Java', ext: 'java', logo: FaJava, color: '#ED8B00' },
  { id: 'cpp', name: 'C++', ext: 'cpp', logo: SiCplusplus, color: '#00599C' },
]

interface LanguagePickerProps {
  selectedLanguage?: string
  onSelect: (language: string | undefined) => void
  dataStructureId?: string // e.g., 'stack', 'queue', 'binary-search', etc.
}

export function LanguagePicker({ selectedLanguage, onSelect, dataStructureId = 'stack' }: LanguagePickerProps) {
  const handleLanguageClick = (langId: string) => {
    if (selectedLanguage === langId) {
      onSelect(undefined)
    } else {
      onSelect(langId)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-muted p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Code2 className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-bold font-mono">Choose Your Language</h2>
        </div>
        {selectedLanguage && (
          <button
            onClick={() => onSelect(undefined)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground mb-6 font-mono">
        Select the programming language you want to use for this challenge. You'll get a template repository with starter code and tests.
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {languages.map((lang) => {
          const isSelected = selectedLanguage === lang.id
          const Logo = lang.logo
          
          return (
            <button
              key={lang.id}
              onClick={() => handleLanguageClick(lang.id)}
              className={cn(
                "text-center transition-all flex flex-col items-center justify-center gap-1 relative bg-transparent",
                "hover:opacity-80"
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center">
                {lang.isCustom ? (
                  <Logo size={44} />
                ) : (
                  <Logo size={44} color={lang.color} />
                )}
              </div>
              <div className="flex flex-col items-center">
                <p className={cn(
                  "font-semibold text-[9px] leading-tight font-mono",
                  isSelected ? "text-accent" : "text-foreground"
                )}>
                  {lang.name}
                </p>
              </div>
              {isSelected && (
                <div className="absolute top-0 right-0">
                  <Check className="h-2.5 w-2.5 text-accent" />
                </div>
              )}
            </button>
          )
        })}
      </div>

    </div>
  )
}

