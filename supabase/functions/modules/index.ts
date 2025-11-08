import { corsHeaders, handleCors, jsonResponse } from '../_shared/cors.ts';

const modules = [
  {
    "id": "stack",
    "title": "Build a Stack",
    "level": "Beginner",
    "summary": "Implement push, pop, peek, size.",
    "subchallenges": ["Create class", "push()", "pop()", "peek()", "size()"],
    "template": "template-dsa-stack",
    "languages": ["TypeScript", "JavaScript", "Python", "Java", "C++", "Go"]
  },
  {
    "id": "queue",
    "title": "Build a Queue",
    "level": "Beginner",
    "summary": "Circular buffer with enqueue/dequeue.",
    "subchallenges": ["Create class", "enqueue()", "dequeue()", "front()", "size()"],
    "template": "template-dsa-queue",
    "languages": ["TypeScript", "JavaScript", "Python", "Java", "C++", "Go"]
  },
  {
    "id": "binary-search",
    "title": "Binary Search",
    "level": "Beginner",
    "summary": "Find index in a sorted array.",
    "subchallenges": ["Empty array", "Found index", "Not found = -1", "Bounds"],
    "template": "template-dsa-binary-search",
    "languages": ["TypeScript", "JavaScript", "Python", "Java", "C++", "Go"]
  },
  {
    "id": "min-heap",
    "title": "Build a Min-Heap",
    "level": "Intermediate",
    "summary": "Insert, peekMin, extractMin, heapify.",
    "subchallenges": ["Insert", "Heapify up", "Peek", "Extract", "Heapify down", "Size"],
    "template": "template-dsa-min-heap",
    "languages": ["TypeScript", "JavaScript", "Python", "Java", "C++", "Go"]
  }
];

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  return jsonResponse(modules);
});

