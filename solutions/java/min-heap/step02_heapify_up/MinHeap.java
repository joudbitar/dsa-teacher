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

    private void swap(int i, int j) {
        int temp = items.get(i);
        items.set(i, items.get(j));
        items.set(j, temp);
    }
}

