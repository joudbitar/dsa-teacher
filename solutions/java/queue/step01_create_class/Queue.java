import java.util.ArrayList;
import java.util.List;

public class Queue<T> {
    private final List<T> items;
    private int head;

    public Queue() {
        this.items = new ArrayList<>();
        this.head = 0;
    }
}
