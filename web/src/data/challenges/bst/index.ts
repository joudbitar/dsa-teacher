import { ChallengeData } from '../types'

export const bst: ChallengeData = {
  id: 'bst',
  title: 'Build a Binary Search Tree',
  level: 'Intermediate',
  summary: 'Implement self-balancing tree with insertion and deletion.',
  description: 'A binary search tree (BST) maintains sorted order while enabling efficient search, insertion, and deletion. Each node\'s left subtree contains smaller values, and the right subtree contains larger values. BSTs bridge the gap between arrays (fast search) and linked lists (fast insertion).',
  concept: 'BSTs maintain the invariant: for any node, all values in the left subtree are smaller, and all values in the right subtree are larger. This property enables O(log n) search in balanced trees. Insertion and deletion must preserve this property. The challenge is maintaining balance—unbalanced trees degrade to O(n) performance.',
  benefits: [
    'Understand how databases index data for fast lookups',
    'Learn the foundation for self-balancing trees (AVL, Red-Black)',
    'Build systems that need sorted data with dynamic updates',
    'Develop skills in maintaining tree invariants',
    'Gain experience with recursive tree algorithms'
  ],
  learningOutcome: 'Learn efficient insertion, search, and deletion while preserving sorted order.',
  coreSkills: [
    'Ordered recursion',
    'Deletion logic',
    'Invariant preservation'
  ],
  steps: [
    {
      step: 1,
      focus: 'Insert/Search',
      challenge: 'Implement with comparison',
      conceptGained: 'Ordered access',
      visualization: 'Highlight traversal'
    },
    {
      step: 2,
      focus: 'Delete Node',
      challenge: 'Handle 3 cases',
      conceptGained: 'Structural re-linking',
      visualization: 'Nodes collapsing/replacing'
    },
    {
      step: 3,
      focus: 'Min/Max & Successor',
      challenge: 'Implement helper functions',
      conceptGained: 'Extremes in data',
      visualization: 'Highlight extremes'
    },
    {
      step: 4,
      focus: 'Validate BST',
      challenge: 'Verify ordering invariants',
      conceptGained: 'Recursive correctness',
      visualization: 'Red/green checks'
    },
    {
      step: 5,
      focus: 'Self-balancing Concept',
      challenge: 'Introduce AVL rotations (conceptually)',
      conceptGained: 'Performance intuition',
      visualization: 'Balancing animation'
    },
    {
      step: 6,
      focus: 'Integration Project',
      challenge: '"Contact Directory"',
      conceptGained: 'Realistic search operations',
      visualization: 'Scrollable contacts tree'
    }
  ],
  subchallenges: ['Choose Language', 'Insert', 'Search', 'Delete', 'Traversal', 'Balance'],
  time: '60-90 min',
  integrationProject: {
    title: 'Contact Directory',
    description: 'Build a contact management system with sorted storage, fast lookup, and efficient insertion/deletion using a BST structure.'
  }
}
