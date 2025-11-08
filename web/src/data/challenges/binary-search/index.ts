import { ChallengeData } from '../types'

export const binarySearch: ChallengeData = {
  id: 'binary-search',
  title: 'Binary Search',
  level: 'Beginner',
  summary: 'Find index in a sorted array.',
  description: 'Binary Search is an efficient algorithm for finding a target value within a sorted array or list. It works by repeatedly dividing the search range in half until the target value is found or the search interval becomes empty. Unlike linear search, which checks every element one by one, binary search eliminates half of the remaining elements with each comparison—making it extremely fast for large, sorted datasets. Binary search works only on sorted data and repeatedly halves the search space until the target is found, giving logarithmic efficiency.',
  concept: 'Binary search relies on key operations: compare the target value to the middle element of the current range; if the target equals the middle element, return its index (found); if the target is smaller, search in the left half; if the target is larger, search in the right half; continue until the element is found or the range is empty. You can implement binary search in two main ways: (1) Iterative Binary Search—uses a while loop and maintains start/end pointers, (2) Recursive Binary Search—calls itself with updated bounds until the target is found or the range is invalid. Time Complexity: Best Case O(1) (found in first comparison), Average/Worst Case O(log n). Space Complexity: O(1) for iterative, O(log n) for recursive (due to call stack).',
  benefits: [
    'Learn how to design algorithms with logarithmic complexity',
    'Understand the power of divide-and-conquer problem-solving',
    'Develop the foundation for search-based algorithms and optimization problems',
    'Improve reasoning about algorithm performance and runtime efficiency',
    'Build intuition for recursive thinking and boundary management',
    'Master one of the most important algorithmic patterns in computer science'
  ],
  learningOutcome: 'Master binary search and understand how to design algorithms with logarithmic complexity. Learn divide-and-conquer problem-solving techniques and develop the foundation for search-based algorithms, optimization problems, and efficient lookups. Build intuition for recursive thinking, boundary management, and algorithm performance analysis.',
  coreSkills: [
    'Divide-and-conquer thinking',
    'Time complexity analysis',
    'Edge case handling'
  ],
  steps: [
    {
      step: 1,
      focus: 'Basic Binary Search',
      challenge: 'Find target in sorted array',
      conceptGained: 'Divide-and-conquer logic',
      visualization: 'Array halves highlighting'
    },
    {
      step: 2,
      focus: 'Edge Cases',
      challenge: 'Handle empty array, single element, not found',
      conceptGained: 'Boundary conditions',
      visualization: 'Red/green validation'
    },
    {
      step: 3,
      focus: 'Lower Bound',
      challenge: 'Find first occurrence of target',
      conceptGained: 'Variant implementation',
      visualization: 'Leftmost highlight'
    },
    {
      step: 4,
      focus: 'Upper Bound',
      challenge: 'Find last occurrence of target',
      conceptGained: 'Rightmost search',
      visualization: 'Rightmost highlight'
    },
    {
      step: 5,
      focus: 'Search in Rotated Array',
      challenge: 'Handle rotated sorted array',
      conceptGained: 'Modified binary search',
      visualization: 'Rotation visualization'
    },
    {
      step: 6,
      focus: 'Integration Project',
      challenge: '"Library Book Finder"',
      conceptGained: 'Real-world search application',
      visualization: 'Book catalog search'
    }
  ],
  subchallenges: ['Choose Language', 'Empty array', 'Found index', 'Not found = -1', 'Bounds'],
  time: '20-30 min',
  integrationProject: {
    title: 'Library Book Finder',
    description: 'Build a library system that searches for books by ISBN using binary search. Handle book lookup, availability checking, and efficient catalog searching.'
  }
}
