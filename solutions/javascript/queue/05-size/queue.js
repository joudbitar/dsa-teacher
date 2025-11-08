class Queue {
  constructor() {
    this._items = [];
    this._head = 0;
  }

  enqueue(value) {
    this._items.push(value);
  }

  dequeue() {
    if (this.isEmpty()) {
      return undefined;
    }
    const value = this._items[this._head];
    this._head += 1;
    if (this._head > this._items.length / 2) {
      this._items = this._items.slice(this._head);
      this._head = 0;
    }
    return value;
  }

  front() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this._items[this._head];
  }

  size() {
    return this._items.length - this._head;
  }

  isEmpty() {
    return this.size() === 0;
  }
}

module.exports = Queue;

