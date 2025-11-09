class MinHeap:
    def __init__(self) -> None:
        self._items = []

    def insert(self, value) -> None:
        self._items.append(value)
        self._bubble_up(len(self._items) - 1)

    def peek_min(self):
        if not self._items:
            return None
        return self._items[0]

    def _bubble_up(self, index: int) -> None:
        current = index
        while current > 0:
            parent = (current - 1) // 2
            if self._items[parent] <= self._items[current]:
                break
            # Swap parent and current
            temp = self._items[current]
            self._items[current] = self._items[parent]
            self._items[parent] = temp
            current = parent

