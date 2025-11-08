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

  extractMin() {
    if (this._items.length === 0) {
      return undefined;
    }
    const min = this._items[0];
    const end = this._items.pop();
    if (this._items.length > 0) {
      this._items[0] = end;
      this._bubbleDown(0);
    }
    return min;
  }

  _bubbleUp(index) {
    let current = index;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (this._items[parent] <= this._items[current]) {
        break;
      }
      this._swap(parent, current);
      current = parent;
    }
  }

  _bubbleDown(index) {
    let current = index;
    const length = this._items.length;
    while (true) {
      const left = current * 2 + 1;
      const right = current * 2 + 2;
      let smallest = current;

      if (left < length && this._items[left] < this._items[smallest]) {
        smallest = left;
      }
      if (right < length && this._items[right] < this._items[smallest]) {
        smallest = right;
      }
      if (smallest === current) {
        break;
      }
      this._swap(current, smallest);
      current = smallest;
    }
  }

  _swap(i, j) {
    const temp = this._items[i];
    this._items[i] = this._items[j];
    this._items[j] = temp;
  }
}

module.exports = MinHeap;

