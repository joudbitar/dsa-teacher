import java.util.ArrayList;
import java.util.List;

public class Stack<T> {
    private final List<T> items;

    public Stack() {
        this.items = new ArrayList<>();
    }

    public void push(T value) {
        items.add(value);
    }

    public T pop() {
        if (items.isEmpty()) {
            return null;
        }
        return items.remove(items.size() - 1);
    }

    public T peek() {
        if (items.isEmpty()) {
            return null;
        }
        return items.get(items.size() - 1);
    }
}
