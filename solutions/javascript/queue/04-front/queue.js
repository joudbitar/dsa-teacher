class Queue {
  constructor() {
    this._items = [];
    this._head = 0;
  }

  enqueue(value) {
    this._items.push(value);
  }

  dequeue() {
    if (this._head >= this._items.length) {
      return undefined;
    }
    const value = this._items[this._head];
    this._head += 1;
    return value;
  }

  front() {
    if (this._head >= this._items.length) {
      return undefined;
    }
    return this._items[this._head];
  }
}

module.exports = Queue;
