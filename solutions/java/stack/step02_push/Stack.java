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
}
