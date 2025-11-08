class Stack:
    def __init__(self) -> None:
        self._items = []

    def push(self, value) -> None:
        self._items.append(value)

    def pop(self):
        if not self._items:
            return None
        return self._items.pop()

    def peek(self):
        if not self._items:
            return None
        return self._items[-1]

