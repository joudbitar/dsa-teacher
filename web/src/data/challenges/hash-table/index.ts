import { ChallengeData } from '../types'

export const hashTable: ChallengeData = {
  id: 'hash-table',
  title: 'Build a Hash Table',
  level: 'Intermediate',
  summary: 'Implement hash function, collision handling, get/set.',
  description: 'Hash tables are one of the most practical data structures, enabling O(1) average-case lookup, insertion, and deletion. They power dictionaries, caches, and databases. Understanding how they work—including hash functions and collision resolution—is essential for any serious programmer.',
  concept: 'Hash tables use a hash function to map keys to array indices. The challenge is handling collisions (when two keys map to the same index). Common strategies include chaining (linked lists at each index) and open addressing (probing for the next available slot). A good hash function distributes keys uniformly to minimize collisions.',
  benefits: [
    'Understand how databases and caches achieve fast lookups',
    'Learn collision resolution strategies used in real-world systems',
    'Build intuition for time-space tradeoffs in algorithm design',
    'Develop skills in designing good hash functions',
    'Gain experience with load factor management and rehashing'
  ],
  learningOutcome: 'Grasp constant-time lookup, collision handling, and design tradeoffs of hash-based storage.',
  coreSkills: [
    'Constant-time reasoning',
    'Collision strategies',
    'Hash design trade-offs'
  ],
  steps: [
    {
      step: 1,
      focus: 'Hash Function',
      challenge: 'Write a hash mod function',
      conceptGained: 'Deterministic mapping',
      visualization: 'Keys mapping to buckets'
    },
    {
      step: 2,
      focus: 'Collisions',
      challenge: 'Handle with chaining',
      conceptGained: 'Linked structures inside buckets',
      visualization: 'Multiple items per bin'
    },
    {
      step: 3,
      focus: 'Open Addressing',
      challenge: 'Implement linear probing',
      conceptGained: 'Load factor awareness',
      visualization: 'Probing animation'
    },
    {
      step: 4,
      focus: 'Resizing',
      challenge: 'Double capacity + rehash',
      conceptGained: 'Data migration',
      visualization: 'Rehashing animation'
    },
    {
      step: 5,
      focus: 'Key Deletion',
      challenge: 'Implement tombstones',
      conceptGained: 'Deletion strategy',
      visualization: 'Gray-out bucket'
    },
    {
      step: 6,
      focus: 'Integration Project',
      challenge: '"Username Lookup" system',
      conceptGained: 'Dictionary simulation',
      visualization: 'Typeahead animation'
    }
  ],
  subchallenges: ['Choose Language', 'Hash function', 'Collision resolution', 'Get', 'Set', 'Delete'],
  time: '60-90 min',
  integrationProject: {
    title: 'Username Lookup System',
    description: 'Build a fast username lookup system that supports user registration, login verification, and typeahead suggestions using hash table operations.'
  }
}
