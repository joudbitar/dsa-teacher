class MinHeap:
    def __init__(self) -> None:
        self._items = []

    def insert(self, value) -> None:
        self._items.append(value)
        self._bubble_up(len(self._items) - 1)

    def peek_min(self):
        if self.is_empty():
            return None
        return self._items[0]

    def extract_min(self):
        if self.is_empty():
            return None
        minimum = self._items[0]
        end = self._items.pop()
        if not self.is_empty():
            self._items[0] = end
            self._bubble_down(0)
        return minimum

    def size(self) -> int:
        return len(self._items)

    def is_empty(self) -> bool:
        return len(self._items) == 0

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

