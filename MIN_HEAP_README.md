# Min-Heap Data Structure

## Table of Contents
1. [Overview](#overview)
2. [What is a Min-Heap?](#what-is-a-min-heap)
3. [Properties and Characteristics](#properties-and-characteristics)
4. [Array Representation](#array-representation)
5. [Core Operations](#core-operations)
6. [Time and Space Complexity](#time-and-space-complexity)
7. [Use Cases and Applications](#use-cases-and-applications)
8. [Implementation Guide](#implementation-guide)
9. [Visual Examples](#visual-examples)
10. [Common Pitfalls](#common-pitfalls)
11. [Practice Challenges](#practice-challenges)

---

## Overview

A **Min-Heap** is a complete binary tree data structure that maintains a specific ordering property: every parent node is smaller than or equal to its children. This structure enables efficient priority queue operations and serves as the foundation for heap sort and many graph algorithms like Dijkstra's shortest path.

**Level:** Intermediate  
**Time to Complete:** 45-60 minutes  
**Core Skills:** Index math, Property maintenance, Efficient sorting

---

## What is a Min-Heap?

A min-heap is a specialized tree-based data structure that satisfies the **heap property**:
- **Min-Heap Property:** For every node `i` (except the root), the value of the parent is less than or equal to the value of the node.

This means:
- The **smallest element is always at the root** (index 0)
- Every parent node is smaller than its children
- The tree is **complete** (all levels are filled except possibly the last, which is filled from left to right)

### Key Characteristics

1. **Complete Binary Tree:** All levels are completely filled except possibly the last level, which is filled from left to right
2. **Heap Property:** Parent nodes are always smaller than or equal to their children
3. **Array-Based:** Typically stored in an array for efficient access
4. **Dynamic Size:** Can grow and shrink as elements are added or removed

---

## Properties and Characteristics

### Heap Property
```
For any node at index i:
- Parent is at index: (i - 1) // 2
- Left child is at index: 2*i + 1
- Right child is at index: 2*i + 2
```

### Visual Structure
```
        1
       / \
      3   5
     / \ / \
    7  9 10 15
```

In array form: `[1, 3, 5, 7, 9, 10, 15]`

### Rules
- **Root (index 0):** Always contains the minimum element
- **Parent-Child Relationship:** Parent ≤ Children
- **Sibling Order:** No ordering constraint between siblings
- **Height:** O(log n) for n elements

---

## Array Representation

A min-heap is typically stored in an array where:
- Index 0 is the root
- For a node at index `i`:
  - Parent index: `(i - 1) // 2`
  - Left child index: `2*i + 1`
  - Right child index: `2*i + 2`

### Example
```
Tree:           Array: [1, 3, 5, 7, 9, 10, 15]
        1        Index:  0  1  2  3  4   5   6
       / \
      3   5
     / \ / \
    7  9 10 15
```

### Index Calculations
```python
def get_parent(index):
    return (index - 1) // 2

def get_left_child(index):
    return 2 * index + 1

def get_right_child(index):
    return 2 * index + 2
```

---

## Core Operations

### 1. Insert (O(log n))

Adds a new element to the heap while maintaining the min-heap property.

**Algorithm:**
1. Add the new element at the end of the array
2. Compare it with its parent
3. If the new element is smaller than its parent, swap them
4. Repeat step 3 until the heap property is satisfied (bubble up)

**Implementation:**
```python
def insert(self, value: int) -> None:
    self._items.append(value)
    self._bubble_up(len(self._items) - 1)

def _bubble_up(self, index: int) -> None:
    current = index
    while current > 0:
        parent = (current - 1) // 2
        if self._items[parent] <= self._items[current]:
            break
        self._items[parent], self._items[current] = (
            self._items[current],
            self._items[parent],
        )
        current = parent
```

**Example:**
```
Initial: [3, 5, 7]
Insert 1: [3, 5, 7, 1]
Bubble up: [1, 3, 7, 5]
```

### 2. Peek (O(1))

Returns the minimum element without removing it.

**Algorithm:**
1. Return the element at index 0 (root)
2. Return None/null if heap is empty

**Implementation:**
```python
def peek_min(self):
    if not self._items:
        return None
    return self._items[0]
```

**Example:**
```
Heap: [1, 3, 5, 7]
peek_min() → 1
Heap remains: [1, 3, 5, 7]
```

### 3. Extract Min (O(log n))

Removes and returns the minimum element from the heap.

**Algorithm:**
1. Store the root element (minimum)
2. Replace root with the last element in the heap
3. Remove the last element
4. Call `heapify_down(0)` to restore heap property
5. Return the original root value

**Implementation:**
```python
def extract_min(self):
    if not self._items:
        return None
    minimum = self._items[0]
    end = self._items.pop()
    if self._items:
        self._items[0] = end
        self._bubble_down(0)
    return minimum
```

**Example:**
```
Initial: [1, 3, 5, 7, 10]
extract_min() → 1
After: [3, 7, 5, 10]
```

### 4. Heapify Down (O(log n))

Moves an element down the tree to maintain the min-heap property after extraction.

**Algorithm:**
1. Compare the element with both children
2. Find the smallest among parent and children
3. If the smallest is not the parent, swap with the smallest child
4. Repeat until the heap property is satisfied or reaching a leaf

**Implementation:**
```python
def _bubble_down(self, index: int) -> None:
    length = len(self._items)
    current = index
    while True:
        left = current * 2 + 1
        right = current * 2 + 2
        smallest = current

        if left < length and self._items[left] < self._items[smallest]:
            smallest = left
        if right < length and self._items[right] < self._items[smallest]:
            smallest = right
        if smallest == current:
            break
        self._items[current], self._items[smallest] = (
            self._items[smallest],
            self._items[current],
        )
        current = smallest
```

**Example:**
```
Before: [10, 5, 3, 7]  (10 is out of place)
After heapify_down(0): [3, 5, 10, 7]
```

### 5. Size (O(1))

Returns the number of elements in the heap.

**Implementation:**
```python
def size(self) -> int:
    return len(self._items)
```

### 6. Is Empty (O(1))

Checks if the heap is empty.

**Implementation:**
```python
def is_empty(self) -> bool:
    return len(self._items) == 0
```

---

## Time and Space Complexity

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Insert | O(log n) | O(1) |
| Peek Min | O(1) | O(1) |
| Extract Min | O(log n) | O(1) |
| Heapify Up | O(log n) | O(1) |
| Heapify Down | O(log n) | O(1) |
| Size | O(1) | O(1) |
| Build Heap from Array | O(n) | O(1) |
| Heap Sort | O(n log n) | O(1) |

**Space Complexity:** O(n) for storing n elements

---

## Use Cases and Applications

### 1. Priority Queues
Min-heaps are the underlying data structure for priority queues, where elements are processed based on priority (lowest value = highest priority).

**Example:** Task scheduling, event simulation

### 2. Heap Sort
An efficient in-place sorting algorithm with O(n log n) time complexity.

**Algorithm:**
1. Build a min-heap from the array
2. Repeatedly extract the minimum element
3. Place extracted elements in sorted order

### 3. Graph Algorithms
- **Dijkstra's Shortest Path:** Uses a min-heap to efficiently find the next closest vertex
- **Prim's Minimum Spanning Tree:** Uses a min-heap to select the minimum weight edge

### 4. Operating System Scheduling
Process scheduling algorithms use priority queues (min-heaps) to determine which process to run next.

### 5. Merge K Sorted Lists
Efficiently merge multiple sorted lists by maintaining a min-heap of the current smallest elements from each list.

### 6. Finding K Smallest Elements
Extract the minimum k times to get the k smallest elements in O(k log n) time.

---

## Implementation Guide

### Step-by-Step Implementation

#### Step 1: Initialize the Heap
```python
class MinHeap:
    def __init__(self) -> None:
        self._items = []
```

#### Step 2: Implement Insert
```python
def insert(self, value: int) -> None:
    self._items.append(value)
    self._bubble_up(len(self._items) - 1)
```

#### Step 3: Implement Heapify Up
```python
def _bubble_up(self, index: int) -> None:
    current = index
    while current > 0:
        parent = (current - 1) // 2
        if self._items[parent] <= self._items[current]:
            break
        self._items[parent], self._items[current] = (
            self._items[current],
            self._items[parent],
        )
        current = parent
```

#### Step 4: Implement Peek
```python
def peek_min(self):
    if not self._items:
        return None
    return self._items[0]
```

#### Step 5: Implement Extract Min
```python
def extract_min(self):
    if not self._items:
        return None
    minimum = self._items[0]
    end = self._items.pop()
    if self._items:
        self._items[0] = end
        self._bubble_down(0)
    return minimum
```

#### Step 6: Implement Heapify Down
```python
def _bubble_down(self, index: int) -> None:
    length = len(self._items)
    current = index
    while True:
        left = current * 2 + 1
        right = current * 2 + 2
        smallest = current

        if left < length and self._items[left] < self._items[smallest]:
            smallest = left
        if right < length and self._items[right] < self._items[smallest]:
            smallest = right
        if smallest == current:
            break
        self._items[current], self._items[smallest] = (
            self._items[smallest],
            self._items[current],
        )
        current = smallest
```

#### Step 7: Implement Size and Helper Methods
```python
def size(self) -> int:
    return len(self._items)

def is_empty(self) -> bool:
    return len(self._items) == 0
```

### Complete Implementation

```python
class MinHeap:
    def __init__(self) -> None:
        self._items = []

    def insert(self, value: int) -> None:
        """Add an element and maintain the min-heap property."""
        self._items.append(value)
        self._bubble_up(len(self._items) - 1)

    def peek_min(self):
        """Return the minimum element without removing it."""
        if self.is_empty():
            return None
        return self._items[0]

    def extract_min(self):
        """Remove and return the minimum element."""
        if self.is_empty():
            return None
        minimum = self._items[0]
        end = self._items.pop()
        if not self.is_empty():
            self._items[0] = end
            self._bubble_down(0)
        return minimum

    def size(self) -> int:
        """Return the number of elements in the heap."""
        return len(self._items)

    def is_empty(self) -> bool:
        """Check if the heap is empty."""
        return len(self._items) == 0

    def _bubble_up(self, index: int) -> None:
        """Move an element up to maintain heap property."""
        current = index
        while current > 0:
            parent = (current - 1) // 2
            if self._items[parent] <= self._items[current]:
                break
            self._items[parent], self._items[current] = (
                self._items[current],
                self._items[parent],
            )
            current = parent

    def _bubble_down(self, index: int) -> None:
        """Move an element down to maintain heap property."""
        length = len(self._items)
        current = index
        while True:
            left = current * 2 + 1
            right = current * 2 + 2
            smallest = current

            if left < length and self._items[left] < self._items[smallest]:
                smallest = left
            if right < length and self._items[right] < self._items[smallest]:
                smallest = right
            if smallest == current:
                break
            self._items[current], self._items[smallest] = (
                self._items[smallest],
                self._items[current],
            )
            current = smallest
```

---

## Visual Examples

### Example 1: Inserting Elements

```
Step 1: Insert 5
Heap: [5]

Step 2: Insert 3
Heap: [3, 5]
Tree:    3
        /
       5

Step 3: Insert 7
Heap: [3, 5, 7]
Tree:    3
       / \
      5   7

Step 4: Insert 1
Heap: [1, 3, 7, 5]
Tree:      1
         / \
        3   7
       /
      5
```

### Example 2: Extracting Minimum

```
Initial: [1, 3, 5, 7, 10]
Tree:      1
       /     \
      3       5
     / \     /
    7  10   ...

Step 1: Extract 1, replace with 10
Heap: [10, 3, 5, 7]

Step 2: Heapify down
Compare 10 with children (3, 5)
Smallest is 3, swap
Heap: [3, 10, 5, 7]

Step 3: Continue heapify down
Compare 10 with child (7)
Smallest is 7, swap
Final: [3, 7, 5, 10]
```

---

## Common Pitfalls

### 1. Off-by-One Errors in Index Calculations
- **Wrong:** `parent = i / 2`
- **Correct:** `parent = (i - 1) // 2`

### 2. Forgetting to Check Array Bounds
Always check if indices are within bounds before accessing:
```python
if left < length and self._items[left] < self._items[smallest]:
```

### 3. Not Handling Empty Heap
Always check if the heap is empty before accessing the root:
```python
if self.is_empty():
    return None
```

### 4. Incorrect Comparison in Heapify Down
Make sure to compare with the **smallest** child, not just the left child.

### 5. Forgetting to Update Index After Swap
After swapping, update the current index to continue the process:
```python
current = parent  # in bubble_up
current = smallest  # in bubble_down
```

---

## Practice Challenges

### Challenge 1: Basic Operations
Implement a min-heap with the following operations:
- `insert(value)`
- `peek_min()`
- `extract_min()`
- `size()`

### Challenge 2: Heap Sort
Implement heap sort using your min-heap:
1. Build a min-heap from an array
2. Extract all elements in sorted order

### Challenge 3: Find K Smallest Elements
Given an array and integer k, find the k smallest elements using a min-heap.

### Challenge 4: Merge K Sorted Lists
Merge k sorted lists into one sorted list using a min-heap.

### Challenge 5: Priority Queue Application
Build a task management system where tasks are stored in a priority queue (min-heap). Users can add tasks with priorities, and the system always serves the highest priority task first.

---

## Learning Outcomes

By mastering the min-heap data structure, you will:

- ✅ Understand priority queues and how operating systems schedule processes
- ✅ Learn heap sort, an efficient in-place sorting algorithm
- ✅ Build the foundation for advanced algorithms like Dijkstra's and Prim's
- ✅ Develop skills in tree manipulation and array-based tree structures
- ✅ Gain experience with maintaining invariants in complex data structures
- ✅ Understand how priority-based retrieval and efficient sorting work

---

## Additional Resources

- **Heap Sort Algorithm:** Learn how to use heaps for sorting
- **Priority Queues:** Understand real-world applications
- **Graph Algorithms:** Explore Dijkstra's and Prim's algorithms
- **Max-Heap:** Compare with max-heap (opposite ordering)

---

## Summary

A min-heap is a powerful data structure that:
- Maintains the smallest element at the root
- Provides O(log n) insertion and extraction
- Enables efficient priority queue operations
- Forms the basis for heap sort and graph algorithms
- Uses array-based storage for efficient memory access

Mastering min-heaps will significantly enhance your understanding of efficient data structures and algorithms!

