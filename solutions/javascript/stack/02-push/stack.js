class Stack {
  constructor() {
    this._items = [];
  }

  push(value) {
    this._items.push(value);
  }
}

module.exports = Stack;
