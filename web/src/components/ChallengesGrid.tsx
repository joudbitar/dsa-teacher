import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Layers, Search, Minus, Code2 } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { OrganicStep } from './OrganicStep'
import { TurtleProgress } from './TurtleProgress'
import { getChallengeProgress, calculateProgressPercentage } from '@/utils/challengeProgress'
import { challengeData } from '@/data/challenges'

// Icon mapping for different data structures
const iconMap: Record<string, any> = {
  stack: Layers,
  queue: Layers,
  'binary-search': Search,
  'min-heap': Minus,
  'linked-list': Minus,
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
    subchallenges: ['Insert', 'Heapify up', 'Peek', 'Extract', 'Heapify down', 'Size'],
    time: '45-60 min',
  },
  {
    id: 'linked-list',
    title: 'Build a Linked List',
    level: 'Beginner',
    summary: 'Implement insertion, deletion, and traversal.',
    subchallenges: ['Create node', 'Insert', 'Delete', 'Search', 'Reverse'],
    time: '45-60 min',
  },
  {
    id: 'hash-table',
    title: 'Build a Hash Table',
    level: 'Intermediate',
    summary: 'Implement hash function, collision handling, get/set.',
    subchallenges: ['Hash function', 'Collision resolution', 'Get', 'Set', 'Delete'],
    time: '60-90 min',
  },
  {
    id: 'binary-tree',
    title: 'Build a Binary Tree',
    level: 'Intermediate',
    summary: 'Implement insertion, traversal, and search.',
    subchallenges: ['Insert', 'In-order traversal', 'Pre-order', 'Post-order', 'Search'],
    time: '60-90 min',
  },
  {
    id: 'graph',
    title: 'Build a Graph',
    level: 'Advanced',
    summary: 'Implement adjacency list, BFS, and DFS.',
    subchallenges: ['Adjacency list', 'Add edge', 'BFS', 'DFS', 'Shortest path'],
    time: '90-120 min',
  },
  {
    id: 'trie',
    title: 'Build a Trie',
    level: 'Intermediate',
    summary: 'Implement prefix tree for efficient string operations.',
    subchallenges: ['Insert', 'Search', 'Prefix search', 'Delete', 'Auto-complete'],
    time: '60-90 min',
  },
  {
    id: 'bst',
    title: 'Build a Binary Search Tree',
    level: 'Intermediate',
    summary: 'Implement self-balancing tree with insertion and deletion.',
    subchallenges: ['Insert', 'Search', 'Delete', 'Traversal', 'Balance'],
    time: '60-90 min',
  },
  {
    id: 'avl-tree',
    title: 'Build an AVL Tree',
    level: 'Advanced',
    summary: 'Implement self-balancing binary search tree.',
    subchallenges: ['Insert', 'Rotate', 'Balance', 'Delete', 'Search'],
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

export function ChallengesGrid() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>({})
  const location = useLocation()

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

  return (
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 challenges-page">
      {allModules.map((module) => {
        const Icon = iconMap[module.id] || Code2
        const isHovered = hoveredId === module.id
        const isIntermediate = module.level === 'Intermediate'
        const isAdvanced = module.level === 'Advanced'
        const progress = moduleProgress[module.id] || 0
        
        return (
          <div
            key={module.id}
            onMouseEnter={() => setHoveredId(module.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="transition-none"
            style={{ transform: 'none' }}
          >
            <Link
              to={`/challenges/${module.id}`}
              className="block"
              style={{ transform: 'none' }}
            >
              <OrganicStep
                isCurrent={false}
                isCompleted={progress === 100}
                className="p-6 h-full"
              >
                {/* Icon and Title */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-mono">{module.title}</h3>
                      <p className="text-xs text-muted-foreground font-mono">{module.time}</p>
                    </div>
                  </div>
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

                {/* Summary */}
                <p className="text-sm text-muted-foreground mb-4 font-mono">{module.summary}</p>

                {/* Subchallenges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {module.subchallenges.slice(0, 3).map((sub, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded-full bg-primary text-primary-foreground font-medium font-mono"
                    >
                      {sub}
                    </span>
                  ))}
                  {module.subchallenges.length > 3 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-primary text-primary-foreground font-medium font-mono">
                      +{module.subchallenges.length - 3} more
                    </span>
                  )}
                </div>

                {/* Turtle Progress */}
                <div className="mb-4">
                  <TurtleProgress progress={progress} />
                </div>

                {/* Hover Effect */}
                {isHovered && (
                  <div className="flex items-center justify-between text-sm text-primary font-medium font-mono">
                    <span>Start building →</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </OrganicStep>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

