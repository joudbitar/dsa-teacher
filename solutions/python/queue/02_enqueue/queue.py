class Queue:
    def __init__(self) -> None:
        self._items = []
        self._head = 0

    def enqueue(self, value) -> None:
        self._items.append(value)

