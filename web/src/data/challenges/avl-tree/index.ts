import { ChallengeData } from '../types'

export const avlTree: ChallengeData = {
  id: 'avl-tree',
  title: 'Build an AVL Tree',
  level: 'Advanced',
  summary: 'Implement self-balancing binary search tree.',
  description: 'AVL trees are self-balancing binary search trees that maintain height balance through rotations. Named after their inventors (Adelson-Velsky and Landis), they guarantee O(log n) operations by ensuring the height difference between left and right subtrees never exceeds 1.',
  concept: 'AVL trees maintain balance through tree rotations (left and right rotations, and their combinations). After each insertion or deletion, you check the balance factor (height difference) and perform rotations if needed. The four cases are: left-left, right-right, left-right, and right-left. This balancing ensures the tree remains approximately balanced, maintaining O(log n) performance.',
  benefits: [
    'Understand how databases maintain index balance for performance',
    'Learn rotation algorithms used in many tree data structures',
    'Build systems that need guaranteed O(log n) operations',
    'Develop skills in complex tree manipulation and balancing',
    'Gain experience with maintaining invariants in dynamic structures'
  ],
  learningOutcome: 'Understand how databases maintain index balance for performance and learn rotation algorithms used in many tree data structures.',
  coreSkills: [
    'Tree rotations',
    'Balance factor management',
    'Complex tree manipulation'
  ],
  steps: [
    {
      step: 1,
      focus: 'Height Calculation',
      challenge: 'Compute node height recursively',
      conceptGained: 'Tree depth tracking',
      visualization: 'Height labels'
    },
    {
      step: 2,
      focus: 'Balance Factor',
      challenge: 'Calculate left-right height difference',
      conceptGained: 'Balance detection',
      visualization: 'Balance indicator'
    },
    {
      step: 3,
      focus: 'Rotations',
      challenge: 'Implement left and right rotations',
      conceptGained: 'Tree restructuring',
      visualization: 'Rotation animation'
    },
    {
      step: 4,
      focus: 'Insert with Balancing',
      challenge: 'Insert and rebalance if needed',
      conceptGained: 'Insertion strategy',
      visualization: 'Auto-balancing'
    },
    {
      step: 5,
      focus: 'Delete with Balancing',
      challenge: 'Delete and rebalance if needed',
      conceptGained: 'Deletion strategy',
      visualization: 'Post-deletion balance'
    },
    {
      step: 6,
      focus: 'Integration Project',
      challenge: '"Database Index Simulator"',
      conceptGained: 'Real-world balancing',
      visualization: 'Index tree visualization'
    }
  ],
  subchallenges: ['Choose Language', 'Insert', 'Rotate', 'Balance', 'Delete', 'Search'],
  time: '90-120 min',
  integrationProject: {
    title: 'Database Index Simulator',
    description: 'Simulate a database index using an AVL tree. Insert records, maintain sorted order, and demonstrate how self-balancing ensures consistent O(log n) lookup performance.'
  }
}
