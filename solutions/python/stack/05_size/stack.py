class Stack:
    def __init__(self) -> None:
        self._items = []

    def push(self, value) -> None:
        self._items.append(value)

    def pop(self):
        if self.is_empty():
            return None
        return self._items.pop()

    def peek(self):
        if self.is_empty():
            return None
        return self._items[-1]

    def size(self) -> int:
        return len(self._items)

    def is_empty(self) -> bool:
        return len(self._items) == 0

