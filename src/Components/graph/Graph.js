import Node from './Node';
import Queue from '../Queue';
import Stack from '../Stack';

export default class UndirectedGraph {
  constructor() {
    this.nodes = new Map();
    this.nEdges = 0;
    this.nVertices = 0;
  }

  addEdge(source, destination, weight) {
    const sourceNode = this.addVertex(source, weight);
    const destinationNode = this.addVertex(destination, weight);

    sourceNode.addAdjacent(destinationNode);

    destinationNode.addAdjacent(sourceNode);

    this.nEdges++;

    return [sourceNode, destinationNode];
  }

  addVertex(value, weight) {
    if (this.nodes.has(value)) {
      return this.nodes.get(value);
    } else {
      const vertex = new Node(value, weight);
      this.nodes.set(value, vertex);
      this.nVertices++;
      return vertex;
    }
  }

  removeVertex(value) {
    const current = this.nodes.get(value);
    if (current) {
      for (const node of this.nodes.values()) {
        node.removeAdjacent(current);
        this.nVertices--;
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
      this.nEdges--;
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

  bfsGetNthConnection(first, nthLevel) {
    const visited = new Map();
    const visitList = new Queue();
    const distances = new Map();
    const nthConnection = [];
    // first node has an edge length of 0
    visitList.add(first);
    let i = 0;

    while (i < nthLevel) {
      while (!visitList.isEmpty()) {
        const node = visitList.remove();
        if (!distances.has(node)) {
          distances.set(node, i);
        }
        if (distances.get(node) === nthLevel) {
          nthConnection.push({ node: node, distance: nthLevel });
        }
        if (node && !visited.has(node)) {
          visited.set(node);
        }
        node.getAdjacents().forEach((adj) => {
          if (!distances.has(adj)) {
            visitList.add(adj);
            distances.set(adj, distances.get(node) + 1);
          }
        });
      }
      i++;
    }

    return { distances, nthConnection };
  }

  *dfs(first) {
    const visited = new Map();
    const visitList = new Stack();

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
