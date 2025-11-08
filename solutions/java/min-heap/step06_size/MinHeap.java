import java.util.ArrayList;
import java.util.List;

public class MinHeap {
    private final List<Integer> items;

    public MinHeap() {
        this.items = new ArrayList<>();
    }

    public void insert(int value) {
        items.add(value);
        bubbleUp(items.size() - 1);
    }

    public Integer peekMin() {
        if (isEmpty()) {
            return null;
        }
        return items.get(0);
    }

    public Integer extractMin() {
        if (isEmpty()) {
            return null;
        }
        int minimum = items.get(0);
        int end = items.remove(items.size() - 1);
        if (!isEmpty()) {
            items.set(0, end);
            bubbleDown(0);
        }
        return minimum;
    }

    public int size() {
        return items.size();
    }

    public boolean isEmpty() {
        return items.isEmpty();
    }

    private void bubbleUp(int index) {
        int current = index;
        while (current > 0) {
            int parent = (current - 1) / 2;
            if (items.get(parent) <= items.get(current)) {
                break;
            }
            swap(parent, current);
            current = parent;
        }
    }

    private void bubbleDown(int index) {
        int current = index;
        int length = items.size();
        while (true) {
            int left = current * 2 + 1;
            int right = current * 2 + 2;
            int smallest = current;

            if (left < length && items.get(left) < items.get(smallest)) {
                smallest = left;
            }
            if (right < length && items.get(right) < items.get(smallest)) {
                smallest = right;
            }
            if (smallest == current) {
                break;
            }
            swap(current, smallest);
            current = smallest;
        }
    }

    private void swap(int i, int j) {
        int temp = items.get(i);
        items.set(i, items.get(j));
        items.set(j, temp);
    }
}
