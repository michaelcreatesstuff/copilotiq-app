import Node from './Node';
import Queue from '../Queue';

export default class UndirectedGraph {
  constructor() {
    this.nodes = new Map();
  }

  addEdge(source, destination, weight) {
    const sourceNode = this.addVertex(source, weight);
    const destinationNode = this.addVertex(destination, weight);

    sourceNode.addAdjacent(destinationNode);

    destinationNode.addAdjacent(sourceNode);

    return [sourceNode, destinationNode];
  }

  addVertex(value, weight) {
    if (this.nodes.has(value)) {
      return this.nodes.get(value);
    } else {
      const vertex = new Node(value, weight);
      this.nodes.set(value, vertex);
      return vertex;
    }
  }

  removeVertex(value) {
    const current = this.nodes.get(value);
    if (current) {
      for (const node of this.nodes.values()) {
        node.removeAdjacent(current);
      }
    }
    return this.nodes.delete(value);
  }

  removeEdge(source, destination) {
    const sourceNode = this.nodes.get(source);
    const destinationNode = this.nodes.get(destination);

    if (sourceNode && destinationNode) {
      sourceNode.removeAdjacent(destinationNode);
      destinationNode.removeAdjacent(sourceNode);
    }

    return [sourceNode, destinationNode];
  }

  *bfs(first) {
    const visited = new Map();
    const visitList = new Queue();

    visitList.add(first);

    while (!visitList.isEmpty()) {
      const node = visitList.remove();
      if (node && !visited.has(node)) {
        yield node;
        visited.set(node);
        node.getAdjacents().forEach((adj) => visitList.add(adj));
      }
    }
  }
}
