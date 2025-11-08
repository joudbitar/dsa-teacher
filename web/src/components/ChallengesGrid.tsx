import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Layers, Search, Minus, Code2, ChevronDown, ChevronUp, X } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { OrganicStep } from './OrganicStep'
import { TurtleProgress } from './TurtleProgress'
import { getChallengeProgress, calculateProgressPercentage } from '@/utils/challengeProgress'
import { challengeData } from '@/data/challenges'
import { useTheme } from '@/theme/ThemeContext'

// Icon mapping for different data structures
const iconMap: Record<string, any> = {
  stack: Layers,
  queue: Layers,
  'binary-search': Search,
  'min-heap': Minus,
  'linked-list': Minus,
}

// Function descriptions mapping for each data structure
const functionDescriptions: Record<string, Record<string, string>> = {
  'stack': {
    'push()': 'Add an element to the top of the stack',
    'pop()': 'Remove and return the top element from the stack',
    'peek()': 'Return the top element without removing it',
    'size()': 'Return the number of elements in the stack',
  },
  'queue': {
    'enqueue()': 'Add an element to the rear of the queue',
    'dequeue()': 'Remove and return the front element from the queue',
    'front()': 'Return the front element without removing it',
    'size()': 'Return the number of elements in the queue',
  },
  'binary-search': {
    'Empty array': 'Handle the case when the array is empty',
    'Found index': 'Return the index when the target is found',
    'Not found = -1': 'Return -1 when the target is not in the array',
    'Bounds': 'Handle boundary conditions correctly',
  },
  'min-heap': {
    'insert()': 'Add a new element to the heap and maintain heap property',
    'heapifyUp()': 'Bubble up an element to restore heap order',
    'peek()': 'Return the minimum element without removing it',
    'extract()': 'Remove and return the minimum element',
    'heapifyDown()': 'Bubble down an element to restore heap order',
    'size()': 'Return the number of elements in the heap',
  },
  'linked-list': {
    'insert()': 'Add a new node at a specified position',
    'delete()': 'Remove a node with a given value',
    'search()': 'Find and return a node with a given value',
    'reverse()': 'Reverse the order of nodes in the list',
  },
  'hash-table': {
    'Hash function': 'Convert a key to an array index',
    'Collision resolution': 'Handle cases where multiple keys map to the same index',
    'get()': 'Retrieve a value associated with a key',
    'set()': 'Store a key-value pair in the table',
    'delete()': 'Remove a key-value pair from the table',
  },
  'binary-tree': {
    'insert()': 'Add a new node to the tree maintaining structure',
    'inOrderTraversal()': 'Visit nodes in left-root-right order',
    'preOrderTraversal()': 'Visit nodes in root-left-right order',
    'postOrderTraversal()': 'Visit nodes in left-right-root order',
    'search()': 'Find a node with a given value',
  },
  'graph': {
    'Adjacency list': 'Represent the graph using an array of lists',
    'addEdge()': 'Connect two vertices with an edge',
    'bfs()': 'Traverse the graph using breadth-first search',
    'dfs()': 'Traverse the graph using depth-first search',
    'shortestPath()': 'Find the shortest path between two vertices',
  },
  'trie': {
    'insert()': 'Add a word to the trie',
    'search()': 'Check if a word exists in the trie',
    'prefixSearch()': 'Find all words with a given prefix',
    'delete()': 'Remove a word from the trie',
    'autoComplete()': 'Suggest words based on a prefix',
  },
  'bst': {
    'insert()': 'Add a node while maintaining BST property',
    'search()': 'Find a node with a given value',
    'delete()': 'Remove a node while maintaining BST property',
    'traversal()': 'Visit all nodes in sorted order',
    'balance()': 'Maintain tree balance for optimal performance',
  },
  'avl-tree': {
    'insert()': 'Add a node and rebalance if needed',
    'rotate()': 'Perform tree rotations to maintain balance',
    'balance()': 'Check and restore AVL tree balance property',
    'delete()': 'Remove a node and rebalance if needed',
    'search()': 'Find a node with a given value',
  },
  'sorting': {
    'Bubble sort': 'Sort using adjacent element comparisons',
    'Merge sort': 'Sort using divide and conquer approach',
    'Quick sort': 'Sort using partitioning and recursion',
    'Heap sort': 'Sort using heap data structure',
    'Analysis': 'Compare time and space complexity of algorithms',
  },
}

// Mock modules data - in production this would come from API
const allModules = [
  {
    id: 'stack',
    title: 'Build a Stack',
    level: 'Beginner',
    summary: 'Implement push, pop, peek, size.',
    subchallenges: ['Create class', 'push()', 'pop()', 'peek()', 'size()'],
    time: '30-45 min',
  },
  {
    id: 'queue',
    title: 'Build a Queue',
    level: 'Beginner',
    summary: 'Circular buffer with enqueue/dequeue.',
    subchallenges: ['Create class', 'enqueue()', 'dequeue()', 'front()', 'size()'],
    time: '30-45 min',
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    level: 'Beginner',
    summary: 'Find index in a sorted array.',
    subchallenges: ['Empty array', 'Found index', 'Not found = -1', 'Bounds'],
    time: '20-30 min',
  },
  {
    id: 'min-heap',
    title: 'Build a Min-Heap',
    level: 'Intermediate',
    summary: 'Insert, peekMin, extractMin, heapify.',
    subchallenges: ['insert()', 'heapifyUp()', 'peek()', 'extract()', 'heapifyDown()', 'size()'],
    time: '45-60 min',
  },
  {
    id: 'linked-list',
    title: 'Build a Linked List',
    level: 'Beginner',
    summary: 'Implement insertion, deletion, and traversal.',
    subchallenges: ['Create node', 'insert()', 'delete()', 'search()', 'reverse()'],
    time: '45-60 min',
  },
  {
    id: 'hash-table',
    title: 'Build a Hash Table',
    level: 'Intermediate',
    summary: 'Implement hash function, collision handling, get/set.',
    subchallenges: ['Hash function', 'Collision resolution', 'get()', 'set()', 'delete()'],
    time: '60-90 min',
  },
  {
    id: 'binary-tree',
    title: 'Build a Binary Tree',
    level: 'Intermediate',
    summary: 'Implement insertion, traversal, and search.',
    subchallenges: ['insert()', 'inOrderTraversal()', 'preOrderTraversal()', 'postOrderTraversal()', 'search()'],
    time: '60-90 min',
  },
  {
    id: 'graph',
    title: 'Build a Graph',
    level: 'Advanced',
    summary: 'Implement adjacency list, BFS, and DFS.',
    subchallenges: ['Adjacency list', 'addEdge()', 'bfs()', 'dfs()', 'shortestPath()'],
    time: '90-120 min',
  },
  {
    id: 'trie',
    title: 'Build a Trie',
    level: 'Intermediate',
    summary: 'Implement prefix tree for efficient string operations.',
    subchallenges: ['insert()', 'search()', 'prefixSearch()', 'delete()', 'autoComplete()'],
    time: '60-90 min',
  },
  {
    id: 'bst',
    title: 'Build a Binary Search Tree',
    level: 'Intermediate',
    summary: 'Implement self-balancing tree with insertion and deletion.',
    subchallenges: ['insert()', 'search()', 'delete()', 'traversal()', 'balance()'],
    time: '60-90 min',
  },
  {
    id: 'avl-tree',
    title: 'Build an AVL Tree',
    level: 'Advanced',
    summary: 'Implement self-balancing binary search tree.',
    subchallenges: ['insert()', 'rotate()', 'balance()', 'delete()', 'search()'],
    time: '90-120 min',
  },
  {
    id: 'sorting',
    title: 'Sorting Algorithms',
    level: 'Beginner',
    summary: 'Implement bubble, merge, quick, and heap sort.',
    subchallenges: ['Bubble sort', 'Merge sort', 'Quick sort', 'Heap sort', 'Analysis'],
    time: '60-90 min',
  },
]

// Categorize challenges as Data Structure or Algorithm
const challengeType: Record<string, 'Data Structure' | 'Algorithm'> = {
  'stack': 'Data Structure',
  'queue': 'Data Structure',
  'linked-list': 'Data Structure',
  'hash-table': 'Data Structure',
  'binary-tree': 'Data Structure',
  'graph': 'Data Structure',
  'trie': 'Data Structure',
  'bst': 'Data Structure',
  'avl-tree': 'Data Structure',
  'min-heap': 'Data Structure',
  'binary-search': 'Algorithm',
  'sorting': 'Algorithm',
}

export function ChallengesGrid() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>({})
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All')
  const [typeFilter, setTypeFilter] = useState<string>('All')
  const location = useLocation()
  const { textColor, backgroundColor, borderColor, secondaryTextColor, accentGreen } = useTheme()

  // Function to load and update progress
  const updateProgress = useCallback(() => {
    const progress: Record<string, number> = {}
    
    allModules.forEach((module) => {
      const savedProgress = getChallengeProgress(module.id)
      const challenge = challengeData[module.id]
      
      if (savedProgress && challenge) {
        // Total steps = challenge steps + 1 (for "Choose Language" step)
        const totalSteps = challenge.steps.length + 1
        // Ensure completedSteps is an array and calculate progress
        const completedStepsArray = Array.isArray(savedProgress.completedSteps) 
          ? savedProgress.completedSteps 
          : []
        const calculatedProgress = calculateProgressPercentage(completedStepsArray, totalSteps)
        progress[module.id] = calculatedProgress
      } else {
        progress[module.id] = 0
      }
    })
    
    setModuleProgress(progress)
  }, [])

  // Load progress for all modules
  useEffect(() => {
    updateProgress()
  }, [location.pathname]) // Reload when navigating to Challenges page

  // Also reload on window focus (when user switches back to the tab)
  useEffect(() => {
    const handleFocus = () => {
      updateProgress()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  // Listen for custom event to refresh progress when it changes in ChallengeDetail
  useEffect(() => {
    const handleProgressUpdate = () => {
      // Refresh progress when any challenge progress is updated
      updateProgress()
    }

    // Listen for custom event fired when progress is updated
    window.addEventListener('challenge-progress-updated', handleProgressUpdate)
    return () => window.removeEventListener('challenge-progress-updated', handleProgressUpdate)
  }, [updateProgress])

  // Filter and sort challenges
  const filterAndSortModules = (modules: typeof allModules) => {
    let filtered = modules.filter(module => {
      // Filter by difficulty
      if (difficultyFilter !== 'All' && module.level !== difficultyFilter) {
        return false
      }
      // Filter by type
      if (typeFilter !== 'All') {
        const moduleType = challengeType[module.id] || 'Data Structure'
        if (moduleType !== typeFilter) {
          return false
        }
      }
      return true
    })

    // Sort by type (Data Structures first, then Algorithms)
    filtered.sort((a, b) => {
      const typeA = challengeType[a.id] || 'Data Structure'
      const typeB = challengeType[b.id] || 'Data Structure'
      if (typeA !== typeB) {
        return typeA === 'Data Structure' ? -1 : 1
      }
      // If same type, sort by title
      return a.title.localeCompare(b.title)
    })

    return filtered
  }

  // Separate challenges into "In Progress" and "All Challenges"
  const inProgressModules = filterAndSortModules(
    allModules.filter(module => {
      const progress = moduleProgress[module.id] || 0
      return progress > 0 && progress < 100
    })
  )

  const allChallengesModules = filterAndSortModules(
    allModules.filter(module => {
      const progress = moduleProgress[module.id] || 0
      return progress === 0 || progress === 100
    })
  )

  // Convert hex to rgba for opacity
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const renderChallengeItem = (module: typeof allModules[0]) => {
    const Icon = iconMap[module.id] || Code2
    const isIntermediate = module.level === 'Intermediate'
    const isAdvanced = module.level === 'Advanced'
    const progress = moduleProgress[module.id] || 0
    const isExpanded = expandedIds.has(module.id)
    
    return (
      <div
        key={module.id}
        className="mb-4"
        style={{ borderColor: borderColor }}
      >
        <OrganicStep
          isCurrent={false}
          isCompleted={progress === 100}
          className="p-4"
        >
          {/* Card Header: Icon, Title, Level Badge - Clickable to toggle */}
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => {
              setExpandedIds(prev => {
                const newSet = new Set(prev)
                if (newSet.has(module.id)) {
                  newSet.delete(module.id)
                } else {
                  newSet.add(module.id)
                }
                return newSet
              })
            }}
          >
            <div className="flex items-center gap-3 flex-1">
              <div 
                className="flex h-10 w-10 items-center justify-center rounded-lg border"
                style={{
                  backgroundColor: backgroundColor,
                  borderColor: borderColor,
                }}
              >
                <Icon className="h-5 w-5" style={{ color: textColor }} />
              </div>
              <h3 
                className="text-lg font-bold font-mono flex-1"
                style={{ color: textColor }}
              >
                {module.title}
              </h3>
              <span className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium font-mono",
                isAdvanced
                  ? "bg-destructive/20 text-destructive"
                  : isIntermediate
                  ? "bg-warning/20 text-warning"
                  : "bg-success/20 text-success"
              )}>
                {module.level}
              </span>
            </div>
            <div className="ml-2">
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" style={{ color: textColor }} />
              ) : (
                <ChevronDown className="h-5 w-5" style={{ color: textColor }} />
              )}
            </div>
          </div>

          {/* Dropdown Content: Time, Learning Goals, Implement, Progress */}
          {isExpanded && (() => {
            // Get full challenge data if available
            const challenge = challengeData[module.id]
            const learningOutcome = challenge?.learningOutcome || ''
            
            // Filter subchallenges to show only methods (exclude "Choose Language" and "Create class")
            const methodsToImplement = module.subchallenges.filter(
              sub => !sub.toLowerCase().includes('choose language') && 
                     !sub.toLowerCase().includes('create class') &&
                     !sub.toLowerCase().includes('create node')
            )
            
            return (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: borderColor }}>
                {/* Time Estimate */}
                <div className="mb-4">
                  <p className="text-sm font-mono" style={{ color: secondaryTextColor }}>
                    <span className="font-semibold text-base" style={{ color: textColor }}>Time:</span> {module.time}
                  </p>
                </div>

                {/* Learning Goals */}
                {learningOutcome && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold font-mono mb-2 text-base" style={{ color: textColor }}>
                      Learning goals:
                    </p>
                    <p className="text-sm font-mono" style={{ color: secondaryTextColor }}>
                      {learningOutcome}
                    </p>
                  </div>
                )}

                {/* Implement */}
                {methodsToImplement.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold font-mono mb-2 text-base" style={{ color: textColor }}>
                      Implement:
                    </p>
                    <ul className="list-none space-y-2">
                      {methodsToImplement.map((method, i) => {
                        const description = functionDescriptions[module.id]?.[method] || ''
                        return (
                          <li key={i} className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-mono" style={{ color: secondaryTextColor }}>
                                -
                              </span>
                              <code 
                                className="text-sm font-mono px-2 py-0.5 rounded"
                                style={{
                                  backgroundColor: hexToRgba(textColor, 0.1),
                                  color: textColor,
                                  border: `1px solid ${hexToRgba(textColor, 0.2)}`,
                                }}
                              >
                                {method}
                              </code>
                            </div>
                            {description && (
                              <p className="text-xs font-mono ml-6" style={{ color: secondaryTextColor }}>
                                {description}
                              </p>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}

                {/* Progress Indicator */}
                {progress > 0 && (
                  <div className="mb-4">
                    <TurtleProgress progress={progress} />
                  </div>
                )}

                {/* Begin Button - Accent Green */}
                <Link
                  to={`/challenges/${module.id}`}
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg font-bold transition-all hover:opacity-90 hover:scale-[1.02] font-mono"
                  style={{
                    backgroundColor: accentGreen,
                    color: backgroundColor,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Begin</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )
          })()}
        </OrganicStep>
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* In Progress Section */}
      {inProgressModules.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 
              className="text-2xl font-bold font-mono"
              style={{ color: textColor }}
            >
              In Progress
            </h2>
            {/* Horizontal Filters */}
            <div className="flex items-center gap-3">
              {/* Difficulty Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold" style={{ color: textColor }}>Difficulty:</span>
                <div className="flex gap-1">
                  {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficultyFilter(level)}
                      className={cn(
                        "px-3 py-1 rounded text-xs font-mono transition-all",
                        difficultyFilter === level
                          ? "font-semibold"
                          : "opacity-70 hover:opacity-100"
                      )}
                      style={{
                        backgroundColor: difficultyFilter === level ? hexToRgba(textColor, 0.15) : 'transparent',
                        color: textColor,
                        border: `1px solid ${difficultyFilter === level ? borderColor : 'transparent'}`,
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold" style={{ color: textColor }}>Type:</span>
                <div className="flex gap-1">
                  {['All', 'Data Structure', 'Algorithm'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      className={cn(
                        "px-3 py-1 rounded text-xs font-mono transition-all",
                        typeFilter === type
                          ? "font-semibold"
                          : "opacity-70 hover:opacity-100"
                      )}
                      style={{
                        backgroundColor: typeFilter === type ? hexToRgba(textColor, 0.15) : 'transparent',
                        color: textColor,
                        border: `1px solid ${typeFilter === type ? borderColor : 'transparent'}`,
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              {(difficultyFilter !== 'All' || typeFilter !== 'All') && (
                <button
                  onClick={() => {
                    setDifficultyFilter('All')
                    setTypeFilter('All')
                  }}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono transition-all hover:opacity-80"
                  style={{
                    backgroundColor: hexToRgba(textColor, 0.1),
                    color: textColor,
                  }}
                  title="Reset Filters"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            {inProgressModules.map(module => renderChallengeItem(module))}
          </div>
        </div>
      )}

      {/* All Challenges Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 
            className="text-2xl font-bold font-mono"
            style={{ color: textColor }}
          >
            {inProgressModules.length > 0 ? 'All Challenges' : 'Challenges'}
          </h2>
          {/* Horizontal Filters */}
          <div className="flex items-center gap-3">
            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold" style={{ color: textColor }}>Difficulty:</span>
              <div className="flex gap-1">
                {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficultyFilter(level)}
                    className={cn(
                      "px-3 py-1 rounded text-xs font-mono transition-all",
                      difficultyFilter === level
                        ? "font-semibold"
                        : "opacity-70 hover:opacity-100"
                    )}
                    style={{
                      backgroundColor: difficultyFilter === level ? hexToRgba(textColor, 0.15) : 'transparent',
                      color: textColor,
                      border: `1px solid ${difficultyFilter === level ? borderColor : 'transparent'}`,
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold" style={{ color: textColor }}>Type:</span>
              <div className="flex gap-1">
                {['All', 'Data Structure', 'Algorithm'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={cn(
                      "px-3 py-1 rounded text-xs font-mono transition-all",
                      typeFilter === type
                        ? "font-semibold"
                        : "opacity-70 hover:opacity-100"
                    )}
                    style={{
                      backgroundColor: typeFilter === type ? hexToRgba(textColor, 0.15) : 'transparent',
                      color: textColor,
                      border: `1px solid ${typeFilter === type ? borderColor : 'transparent'}`,
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            {(difficultyFilter !== 'All' || typeFilter !== 'All') && (
              <button
                onClick={() => {
                  setDifficultyFilter('All')
                  setTypeFilter('All')
                }}
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono transition-all hover:opacity-80"
                style={{
                  backgroundColor: hexToRgba(textColor, 0.1),
                  color: textColor,
                }}
                title="Reset Filters"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
        <div className="space-y-2">
          {allChallengesModules.length > 0 ? (
            allChallengesModules.map(module => renderChallengeItem(module))
          ) : (
            <p className="text-sm font-mono" style={{ color: secondaryTextColor }}>
              No challenges match the selected filters.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

