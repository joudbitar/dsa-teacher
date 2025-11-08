import { ChallengeData } from '../types'

export const sorting: ChallengeData = {
  id: 'sorting',
  title: 'Sorting Algorithms',
  level: 'Beginner',
  summary: 'Implement bubble, merge, quick, and heap sort.',
  description: 'Sorting is one of the most fundamental operations in computer science. Different algorithms have different tradeoffs: some are simple but slow, others are complex but fast. Understanding these algorithms develops your intuition for algorithm design and complexity analysis.',
  concept: 'Each sorting algorithm has different characteristics: Bubble sort is O(n²) but easy to understand. Merge sort is O(n log n) and stable, using divide-and-conquer. Quick sort is O(n log n) average-case and in-place, using partitioning. Heap sort is O(n log n) and in-place, using a heap. Understanding when to use each develops your algorithmic thinking.',
  benefits: [
    'Master fundamental algorithms used everywhere in programming',
    'Understand time complexity analysis (O(n²) vs O(n log n))',
    'Learn divide-and-conquer and partitioning techniques',
    'Build intuition for algorithm design tradeoffs',
    'Gain experience with in-place vs stable sorting algorithms'
  ],
  learningOutcome: 'Master fundamental algorithms used everywhere in programming and understand time complexity analysis.',
  coreSkills: [
    'Time complexity analysis',
    'Divide-and-conquer techniques',
    'Algorithm design tradeoffs'
  ],
  steps: [
    {
      step: 1,
      focus: 'Bubble Sort',
      challenge: 'Implement simple comparison-based sort',
      conceptGained: 'Basic sorting logic',
      visualization: 'Bars swapping animation'
    },
    {
      step: 2,
      focus: 'Merge Sort',
      challenge: 'Implement divide-and-conquer sort',
      conceptGained: 'Recursive splitting',
      visualization: 'Array splitting/merging'
    },
    {
      step: 3,
      focus: 'Quick Sort',
      challenge: 'Implement partition-based sort',
      conceptGained: 'Pivot selection',
      visualization: 'Partitioning animation'
    },
    {
      step: 4,
      focus: 'Heap Sort',
      challenge: 'Sort using heap structure',
      conceptGained: 'Heap operations',
      visualization: 'Heap building/sorting'
    },
    {
      step: 5,
      focus: 'Analysis',
      challenge: 'Compare time/space complexity',
      conceptGained: 'Algorithm tradeoffs',
      visualization: 'Performance charts'
    },
    {
      step: 6,
      focus: 'Integration Project',
      challenge: '"Leaderboard System"',
      conceptGained: 'Real-world sorting',
      visualization: 'Ranking animation'
    }
  ],
  subchallenges: ['Choose Language', 'Bubble sort', 'Merge sort', 'Quick sort', 'Heap sort', 'Analysis'],
  time: '60-90 min',
  integrationProject: {
    title: 'Leaderboard System',
    description: 'Build a game leaderboard that sorts players by score. Implement multiple sorting algorithms and compare their performance on different dataset sizes.'
  }
}
