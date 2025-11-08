function binarySearch(array, target) {
  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    const value = array[mid];
    if (value === target) {
      return mid;
    }
    if (value < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

module.exports = binarySearch;

