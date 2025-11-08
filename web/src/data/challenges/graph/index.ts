import { ChallengeData } from '../types'

export const graph: ChallengeData = {
  id: 'graph',
  title: 'Build a Graph',
  level: 'Advanced',
  summary: 'Implement adjacency list, BFS, and DFS.',
  description: 'Graphs are the most general data structure, representing relationships between entities. They model networks, social connections, dependencies, and spatial relationships. Understanding graph algorithms (BFS, DFS, shortest paths) is essential for solving complex problems in many domains.',
  concept: 'Graphs consist of vertices (nodes) and edges (connections). You can represent them as adjacency lists (array of lists) or adjacency matrices. Breadth-first search (BFS) explores level by level using a queue, while depth-first search (DFS) goes deep before backtracking using recursion or a stack. BFS finds shortest paths in unweighted graphs, while DFS is useful for cycle detection and topological sorting.',
  benefits: [
    'Understand how social networks and recommendation systems work',
    'Learn algorithms used in route planning and network analysis',
    'Build systems that model relationships and dependencies',
    'Develop skills in graph traversal and path-finding algorithms',
    'Gain experience with complex problem-solving using graph theory'
  ],
  learningOutcome: 'Model relationships and explore connectivity, pathfinding, and traversal complexity.',
  coreSkills: [
    'Traversal and search',
    'Graph modeling',
    'Algorithm optimization'
  ],
  steps: [
    {
      step: 1,
      focus: 'Representation',
      challenge: 'Build adjacency list/matrix',
      conceptGained: 'Memory vs performance tradeoff',
      visualization: 'Node graph diagram'
    },
    {
      step: 2,
      focus: 'BFS & DFS',
      challenge: 'Implement traversal',
      conceptGained: 'Recursive vs iterative',
      visualization: 'Expanding node waves'
    },
    {
      step: 3,
      focus: 'Shortest Path',
      challenge: 'Dijkstra / BFS (unweighted)',
      conceptGained: 'Weight-based optimization',
      visualization: 'Path glow animation'
    },
    {
      step: 4,
      focus: 'Detect Cycles',
      challenge: 'DFS coloring method',
      conceptGained: 'Graph invariants',
      visualization: 'Loop highlight'
    },
    {
      step: 5,
      focus: 'Connected Components',
      challenge: 'Count subgraphs',
      conceptGained: 'Disjoint analysis',
      visualization: 'Color cluster visual'
    },
    {
      step: 6,
      focus: 'Integration Project',
      challenge: '"Social Network Recommender"',
      conceptGained: 'Graph search in action',
      visualization: 'People-network graph'
    }
  ],
  subchallenges: ['Choose Language', 'Adjacency list', 'Add edge', 'BFS', 'DFS', 'Shortest path'],
  time: '90-120 min',
  integrationProject: {
    title: 'Social Network Recommender',
    description: 'Build a social network system that models friendships as a graph. Implement friend suggestions based on mutual connections using BFS to find friends-of-friends.'
  }
}
