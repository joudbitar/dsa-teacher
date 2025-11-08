class Stack {
  constructor() {
    this._items = [];
  }

  push(value) {
    this._items.push(value);
  }

  pop() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this._items.pop();
  }

  peek() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this._items[this._items.length - 1];
  }

  size() {
    return this._items.length;
  }

  isEmpty() {
    return this._items.length === 0;
  }
}

module.exports = Stack;

