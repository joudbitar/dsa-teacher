import { Link } from 'react-router-dom'
import { ArrowRight, Layers, Search, Minus, Code2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

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
    progress: 0,
  },
  {
    id: 'queue',
    title: 'Build a Queue',
    level: 'Beginner',
    summary: 'Circular buffer with enqueue/dequeue.',
    subchallenges: ['Create class', 'enqueue()', 'dequeue()', 'front()', 'size()'],
    time: '30-45 min',
    progress: 0,
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    level: 'Beginner',
    summary: 'Find index in a sorted array.',
    subchallenges: ['Empty array', 'Found index', 'Not found = -1', 'Bounds'],
    time: '20-30 min',
    progress: 0,
  },
  {
    id: 'min-heap',
    title: 'Build a Min-Heap',
    level: 'Intermediate',
    summary: 'Insert, peekMin, extractMin, heapify.',
    subchallenges: ['Insert', 'Heapify up', 'Peek', 'Extract', 'Heapify down', 'Size'],
    time: '45-60 min',
    progress: 0,
  },
  {
    id: 'linked-list',
    title: 'Build a Linked List',
    level: 'Beginner',
    summary: 'Implement insertion, deletion, and traversal.',
    subchallenges: ['Create node', 'Insert', 'Delete', 'Search', 'Reverse'],
    time: '45-60 min',
    progress: 0,
  },
  {
    id: 'hash-table',
    title: 'Build a Hash Table',
    level: 'Intermediate',
    summary: 'Implement hash function, collision handling, get/set.',
    subchallenges: ['Hash function', 'Collision resolution', 'Get', 'Set', 'Delete'],
    time: '60-90 min',
    progress: 0,
  },
  {
    id: 'binary-tree',
    title: 'Build a Binary Tree',
    level: 'Intermediate',
    summary: 'Implement insertion, traversal, and search.',
    subchallenges: ['Insert', 'In-order traversal', 'Pre-order', 'Post-order', 'Search'],
    time: '60-90 min',
    progress: 0,
  },
  {
    id: 'graph',
    title: 'Build a Graph',
    level: 'Advanced',
    summary: 'Implement adjacency list, BFS, and DFS.',
    subchallenges: ['Adjacency list', 'Add edge', 'BFS', 'DFS', 'Shortest path'],
    time: '90-120 min',
    progress: 0,
  },
  {
    id: 'trie',
    title: 'Build a Trie',
    level: 'Intermediate',
    summary: 'Implement prefix tree for efficient string operations.',
    subchallenges: ['Insert', 'Search', 'Prefix search', 'Delete', 'Auto-complete'],
    time: '60-90 min',
    progress: 0,
  },
  {
    id: 'bst',
    title: 'Build a Binary Search Tree',
    level: 'Intermediate',
    summary: 'Implement self-balancing tree with insertion and deletion.',
    subchallenges: ['Insert', 'Search', 'Delete', 'Traversal', 'Balance'],
    time: '60-90 min',
    progress: 0,
  },
  {
    id: 'avl-tree',
    title: 'Build an AVL Tree',
    level: 'Advanced',
    summary: 'Implement self-balancing binary search tree.',
    subchallenges: ['Insert', 'Rotate', 'Balance', 'Delete', 'Search'],
    time: '90-120 min',
    progress: 0,
  },
  {
    id: 'sorting',
    title: 'Sorting Algorithms',
    level: 'Beginner',
    summary: 'Implement bubble, merge, quick, and heap sort.',
    subchallenges: ['Bubble sort', 'Merge sort', 'Quick sort', 'Heap sort', 'Analysis'],
    time: '60-90 min',
    progress: 0,
  },
]

export function ChallengesGrid() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
      {allModules.map((module) => {
        const Icon = iconMap[module.id] || Code2
        const isHovered = hoveredId === module.id
        const isIntermediate = module.level === 'Intermediate'
        const isAdvanced = module.level === 'Advanced'
        
        return (
          <div
            key={module.id}
            onMouseEnter={() => setHoveredId(module.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <Link
              to={`/challenges/${module.id}`}
              className={cn(
                "block rounded-xl border border-border bg-card p-6 transition-all h-full",
                "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20"
              )}
            >
              {/* Icon and Title */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{module.title}</h3>
                    <p className="text-xs text-muted-foreground">{module.time}</p>
                  </div>
                </div>
                <span className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium",
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
              <p className="text-sm text-muted-foreground mb-4">{module.summary}</p>

              {/* Subchallenges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {module.subchallenges.slice(0, 3).map((sub, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 rounded-full bg-muted border border-border text-muted-foreground"
                  >
                    {sub}
                  </span>
                ))}
                {module.subchallenges.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-muted border border-border text-muted-foreground">
                    +{module.subchallenges.length - 3} more
                  </span>
                )}
              </div>

              {/* Progress Ring */}
              <div className="relative w-16 h-16 mb-4">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-success"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - module.progress / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">{module.progress}%</span>
                </div>
              </div>

              {/* Hover Effect */}
              {isHovered && (
                <div className="flex items-center justify-between text-sm text-primary font-medium">
                  <span>Start building →</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Link>
          </div>
        )
      })}
    </div>
  )
}

