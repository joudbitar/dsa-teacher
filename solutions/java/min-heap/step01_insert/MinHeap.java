import java.util.ArrayList;
import java.util.List;

public class MinHeap {
    private final List<Integer> items;

    public MinHeap() {
        this.items = new ArrayList<>();
    }

    public void insert(int value) {
        items.add(value);
    }

    public boolean isEmpty() {
        return items.isEmpty();
    }
}
