import java.util.ArrayList;
import java.util.List;

public class Queue<T> {
    private final List<T> items;
    private int head;

    public Queue() {
        this.items = new ArrayList<>();
        this.head = 0;
    }

    public void enqueue(T value) {
        items.add(value);
    }

    public T dequeue() {
        if (isEmpty()) {
            return null;
        }
        T value = items.get(head);
        head += 1;
        if (head > items.size() / 2) {
            items.subList(0, head).clear();
            head = 0;
        }
        return value;
    }

    public T front() {
        if (isEmpty()) {
            return null;
        }
        return items.get(head);
    }

    public int size() {
        return items.size() - head;
    }

    public boolean isEmpty() {
        return size() == 0;
    }
}

