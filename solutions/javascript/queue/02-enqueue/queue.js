class Queue {
  constructor() {
    this._items = [];
    this._head = 0;
  }

  enqueue(value) {
    this._items.push(value);
  }
}

module.exports = Queue;

