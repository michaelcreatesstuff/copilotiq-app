export default class Node {
  constructor(value, weight) {
    this.value = value;
    this.weight = weight;
    this.next = null;
    this.previous = null;
  }
}
