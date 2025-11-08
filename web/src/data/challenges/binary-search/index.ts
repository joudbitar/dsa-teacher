import { ChallengeData } from '../types'

export const binarySearch: ChallengeData = {
  id: 'binary-search',
  title: 'Binary Search',
  level: 'Beginner',
  summary: 'Find index in a sorted array.',
  description: 'Binary search is one of the most elegant and efficient search algorithms. Instead of checking every element (O(n)), it repeatedly divides the search space in half, achieving O(log n) time complexity. This algorithm demonstrates the power of divide-and-conquer thinking.',
  concept: 'Binary search works by comparing the target value to the middle element of a sorted array. If they match, you\'re done. If the target is smaller, search the left half; if larger, search the right half. The key insight is that the array must be sorted, which allows you to eliminate half of the remaining elements with each comparison.',
  benefits: [
    'Master one of the most important algorithms in computer science',
    'Understand divide-and-conquer problem-solving techniques',
    'Learn to think in terms of time complexity (O(log n) vs O(n))',
    'Build intuition for how databases and search engines index data',
    'Develop skills in handling edge cases and off-by-one errors'
  ],
  learningOutcome: 'Master one of the most important algorithms in computer science and understand divide-and-conquer problem-solving techniques.',
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
