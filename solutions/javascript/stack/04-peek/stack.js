class Stack {
  constructor() {
    this._items = [];
  }

  push(value) {
    this._items.push(value);
  }

  pop() {
    if (this._items.length === 0) {
      return undefined;
    }
    return this._items.pop();
  }

  peek() {
    if (this._items.length === 0) {
      return undefined;
    }
    return this._items[this._items.length - 1];
  }
}

module.exports = Stack;

