class MinHeap {
  constructor() {
    this._items = [];
  }

  insert(value) {
    this._items.push(value);
  }
}

module.exports = MinHeap;
