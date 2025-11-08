class Stack:
    def __init__(self) -> None:
        self._items = []

    def push(self, value) -> None:
        self._items.append(value)

