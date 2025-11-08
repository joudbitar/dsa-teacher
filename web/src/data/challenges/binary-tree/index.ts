import { ChallengeData } from '../types'

export const binaryTree: ChallengeData = {
  id: 'binary-tree',
  title: 'Build a Binary Tree',
  level: 'Intermediate',
  summary: 'Implement insertion, traversal, and search.',
  description: 'Binary trees are hierarchical data structures where each node has at most two children. They\'re the foundation for many advanced structures like binary search trees, heaps, and expression trees. Understanding tree traversal is crucial for solving many algorithmic problems.',
  concept: 'A binary tree consists of nodes with at most two children (left and right). The three main traversal orders are: in-order (left, root, right), pre-order (root, left, right), and post-order (left, right, root). Each traversal serves different purposes—in-order gives sorted order for BSTs, pre-order is useful for copying trees, and post-order is used in expression evaluation.',
  benefits: [
    'Understand hierarchical data structures used in file systems and DOM',
    'Learn tree traversal algorithms essential for many coding interviews',
    'Build the foundation for binary search trees and balanced trees',
    'Develop skills in recursive thinking and tree manipulation',
    'Gain experience with depth-first and breadth-first traversal'
  ],
  learningOutcome: 'Understand hierarchical structures, parent-child relationships, and traversal mechanisms.',
  coreSkills: [
    'Recursive traversal',
    'Combining structures',
    'Spatial visualization'
  ],
  steps: [
    {
      step: 1,
      focus: 'Node Linking',
      challenge: 'Construct simple tree',
      conceptGained: 'Recursion of data',
      visualization: 'Branch drawing'
    },
    {
      step: 2,
      focus: 'Traversals',
      challenge: 'Implement pre/in/post order',
      conceptGained: 'Depth-first vs breadth-first',
      visualization: 'Animated traversal paths'
    },
    {
      step: 3,
      focus: 'Height / Size',
      challenge: 'Compute dynamically',
      conceptGained: 'Recursive depth',
      visualization: 'Expanding layers'
    },
    {
      step: 4,
      focus: 'Balanced Check',
      challenge: 'Verify height difference ≤ 1',
      conceptGained: 'Recursion + condition',
      visualization: 'Scale animation'
    },
    {
      step: 5,
      focus: 'Level-order',
      challenge: 'BFS using queue',
      conceptGained: 'Combining DS concepts',
      visualization: 'Layer-wise lighting'
    },
    {
      step: 6,
      focus: 'Integration Project',
      challenge: '"Expression Tree Evaluator"',
      conceptGained: 'Postfix evaluation',
      visualization: 'Expression collapse animation'
    }
  ],
  subchallenges: ['Choose Language', 'Insert', 'In-order traversal', 'Pre-order', 'Post-order', 'Search'],
  time: '60-90 min',
  integrationProject: {
    title: 'Expression Tree Evaluator',
    description: 'Build a system that constructs binary expression trees from infix notation and evaluates them using post-order traversal. Support basic arithmetic operations.'
  }
}
