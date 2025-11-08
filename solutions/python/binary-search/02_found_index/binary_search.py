from typing import Sequence, Any


def binary_search(sequence: Sequence[Any], target: Any) -> int | None:
    left = 0
    right = len(sequence) - 1

    while left <= right:
        mid = (left + right) // 2
        value = sequence[mid]
        if value == target:
            return mid
        if value < target:
            left = mid + 1
        else:
            right = mid - 1

    # "Not found" handling comes next.
    return None

