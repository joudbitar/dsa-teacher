class Queue:
    def __init__(self) -> None:
        self._items = []
        self._head = 0

    def enqueue(self, value) -> None:
        self._items.append(value)

    def dequeue(self):
        if self.is_empty():
            return None
        value = self._items[self._head]
        self._head += 1
        if self._head > len(self._items) // 2:
            self._items = self._items[self._head :]
            self._head = 0
        return value

    def front(self):
        if self.is_empty():
            return None
        return self._items[self._head]

    def size(self) -> int:
        return len(self._items) - self._head

    def is_empty(self) -> bool:
        return self.size() == 0

