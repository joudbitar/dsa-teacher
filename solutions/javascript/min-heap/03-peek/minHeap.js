class MinHeap {
  constructor() {
    this._items = [];
  }

  insert(value) {
    this._items.push(value);
    this._bubbleUp(this._items.length - 1);
  }

  peekMin() {
    if (this._items.length === 0) {
      return undefined;
    }
    return this._items[0];
  }

  _bubbleUp(index) {
    let current = index;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (this._items[parent] <= this._items[current]) {
        break;
      }
      const temp = this._items[parent];
      this._items[parent] = this._items[current];
      this._items[current] = temp;
      current = parent;
    }
  }
}

module.exports = MinHeap;

