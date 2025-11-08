class Queue:
    def __init__(self) -> None:
        self._items = []
        self._head = 0

    def enqueue(self, value) -> None:
        self._items.append(value)

    def dequeue(self):
        if self._head >= len(self._items):
            return None
        value = self._items[self._head]
        self._head += 1
        return value

