public class Stack<T> {
    private Object[] items;
    private int top;
    private static final int INITIAL_CAPACITY = 10;

    public Stack() {
        this.items = new Object[INITIAL_CAPACITY];
        this.top = -1;
    }
}
