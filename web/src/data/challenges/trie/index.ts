import { ChallengeData } from '../types'

export const trie: ChallengeData = {
  id: 'trie',
  title: 'Build a Trie',
  level: 'Intermediate',
  summary: 'Implement prefix tree for efficient string operations.',
  description: 'A trie (prefix tree) is a tree-like data structure optimized for storing and searching strings. Unlike hash tables, tries excel at prefix matching and autocomplete. They\'re used in search engines, spell checkers, and IP routing tables.',
  concept: 'Each node in a trie represents a character, and paths from root to leaf spell out words. This structure allows efficient prefix searches—you can find all words starting with a prefix by traversing from the root. The key operations are insert, search, and prefix search. Trades space for time, enabling O(m) search where m is the length of the word.',
  benefits: [
    'Understand how autocomplete and search suggestions work',
    'Learn space-time tradeoffs in string processing',
    'Build efficient prefix matching systems',
    'Develop skills in tree structures for string data',
    'Gain experience with applications in text processing and search'
  ],
  learningOutcome: 'Understand space-time tradeoffs in string processing and build efficient prefix matching systems.',
  coreSkills: [
    'String processing',
    'Prefix matching',
    'Tree structures for strings'
  ],
  steps: [
    {
      step: 1,
      focus: 'Node Structure',
      challenge: 'Create trie node with children map',
      conceptGained: 'Character-based tree',
      visualization: 'Tree of characters'
    },
    {
      step: 2,
      focus: 'Insert',
      challenge: 'Add word to trie',
      conceptGained: 'Path creation',
      visualization: 'Path highlighting'
    },
    {
      step: 3,
      focus: 'Search',
      challenge: 'Find exact word in trie',
      conceptGained: 'Path traversal',
      visualization: 'Path validation'
    },
    {
      step: 4,
      focus: 'Prefix Search',
      challenge: 'Find all words with prefix',
      conceptGained: 'DFS traversal',
      visualization: 'Branch exploration'
    },
    {
      step: 5,
      focus: 'Delete',
      challenge: 'Remove word and clean up',
      conceptGained: 'Memory management',
      visualization: 'Node removal'
    },
    {
      step: 6,
      focus: 'Integration Project',
      challenge: '"Autocomplete System"',
      conceptGained: 'Real-world application',
      visualization: 'Dropdown suggestions'
    }
  ],
  subchallenges: ['Choose Language', 'Insert', 'Search', 'Prefix search', 'Delete', 'Auto-complete'],
  time: '60-90 min',
  integrationProject: {
    title: 'Autocomplete System',
    description: 'Build an autocomplete system that suggests words as users type. Store a dictionary in a trie and provide instant prefix-based suggestions.'
  }
}
