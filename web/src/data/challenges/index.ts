// Export types
export type { ChallengeData } from './types'

// Export all challenges
import { stack } from './stack/index'
import { queue } from './queue/index'
import { binarySearch } from './binary-search/index'
import { minHeap } from './min-heap/index'
import { linkedList } from './linked-list/index'
import { hashTable } from './hash-table/index'
import { binaryTree } from './binary-tree/index'
import { graph } from './graph/index'
import { trie } from './trie/index'
import { bst } from './bst/index'
import { avlTree } from './avl-tree/index'
import { sorting } from './sorting/index'

// Export challenge data as a record for easy lookup
export const challengeData: Record<string, import('./types').ChallengeData> = {
  'stack': stack,
  'queue': queue,
  'binary-search': binarySearch,
  'min-heap': minHeap,
  'linked-list': linkedList,
  'hash-table': hashTable,
  'binary-tree': binaryTree,
  'graph': graph,
  'trie': trie,
  'bst': bst,
  'avl-tree': avlTree,
  'sorting': sorting,
}

// Also export individual challenges for direct imports if needed
export {
  stack,
  queue,
  binarySearch,
  minHeap,
  linkedList,
  hashTable,
  binaryTree,
  graph,
  trie,
  bst,
  avlTree,
  sorting,
}

