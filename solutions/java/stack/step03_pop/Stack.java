public class Stack<T> {
    private Object[] items;
    private int top;
    private static final int INITIAL_CAPACITY = 10;

    public Stack() {
        this.items = new Object[INITIAL_CAPACITY];
        this.top = -1;
    }

    public void push(T value) {
        if (top == items.length - 1) {
            resize();
        }
        items[++top] = value;
    }

    @SuppressWarnings("unchecked")
    public T pop() {
        if (top == -1) {
            return null;
        }
        T value = (T) items[top];
        items[top--] = null; // Help garbage collection
        return value;
    }

    private void resize() {
        Object[] newItems = new Object[items.length * 2];
        System.arraycopy(items, 0, newItems, 0, items.length);
        items = newItems;
    }
}
