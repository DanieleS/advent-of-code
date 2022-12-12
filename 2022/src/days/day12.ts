import { ExecutionResult } from "../types/executionResult";
import { loadInputFile, memoized } from "../utils";

type Point = [x: number, y: number];

type Node = {
  position: Point;
  altitude: number;
  poi: null | "start" | "end";
};

type Edge = [from: Node, to: Node];

function arePointsEquals(point1: Point, point2: Point): boolean {
  return point1[0] === point2[0] && point1[1] === point2[1];
}

class Graph {
  #nodes: Node[] = [];
  #edges: Edge[] = [];

  addNode(node: Node) {
    this.#nodes.push(node);
  }

  addEdge(edge: Edge) {
    this.#edges.push(edge);
  }

  getNodeByPoint(point: Point) {
    return this.#nodes.find((node) => arePointsEquals(point, node.position));
  }

  getAdjacentNodes(node: Node) {
    return this.#edges
      .filter(([from]) => arePointsEquals(node.position, from.position))
      .map((edge) => edge[1]);
  }

  get nodes() {
    return [...this.#nodes];
  }

  get edges() {
    return [...this.#edges];
  }

  get startingPoint() {
    return this.#nodes.find((node) => node.poi === "start")!;
  }

  get destinationPoint() {
    return this.#nodes.find((node) => node.poi === "end")!;
  }
}

function parseInput(input: string[]): Graph {
  const matrix = input.map((row) => row.split(""));

  const createNodeComponents = (altitude: string) => {
    if (altitude === "S") {
      return {
        altitude: 0,
        poi: "start" as const,
      };
    }

    if (altitude === "E") {
      return {
        altitude: 25,
        poi: "end" as const,
      };
    }

    return {
      altitude: altitude.charCodeAt(0) - 97,
      poi: null,
    };
  };

  const isNotTooSteep = (altitude1: number, altitude2: number) =>
    Math.abs(altitude1 - altitude2) <= 1;

  const graph = new Graph();

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const value = matrix[y][x];

      const left = graph.getNodeByPoint([x - 1, y]);
      const up = graph.getNodeByPoint([x, y - 1]);

      const node: Node = {
        ...createNodeComponents(value),
        position: [x, y],
      };

      if (left && isNotTooSteep(left.altitude, node.altitude)) {
        graph.addEdge([left, node]);
        graph.addEdge([node, left]);
      } else if (left) {
        if (left.altitude < node.altitude) {
          graph.addEdge([left, node]);
        } else {
          graph.addEdge([node, left]);
        }
      }

      if (up && isNotTooSteep(up.altitude, node.altitude)) {
        graph.addEdge([up, node]);
        graph.addEdge([node, up]);
      } else if (up) {
        if (up.altitude < node.altitude) {
          graph.addEdge([up, node]);
        } else {
          graph.addEdge([node, up]);
        }
      }

      graph.addNode(node);
    }
  }

  return graph;
}

function minimumPath(graph: Graph) {
  const dist = new Map<Node, number>();
  const prev = new Map<Node, Node | null>();
  const queue = new Set<Node>();

  for (const node of graph.nodes) {
    dist.set(node, Infinity);
    prev.set(node, null);
    queue.add(node);
  }

  const start = graph.destinationPoint;
  dist.set(start, 0);

  function findLower() {
    let minDist = Infinity;
    let node: Node | null = null;

    for (const n of queue) {
      const d = dist.get(n)!;
      if (d < minDist) {
        minDist = d;
        node = n;
      }
    }

    return node!;
  }

  while (queue.size > 0) {
    const u = findLower();
    queue.delete(u);

    if (!u) {
      break;
    }

    const neighbor = graph.getAdjacentNodes(u);
    for (const n of neighbor) {
      if (queue.has(n)) {
        const alt = dist.get(u)! + 1;
        if (alt < dist.get(n)!) {
          dist.set(n, alt);
          prev.set(n, u);
        }
      }
    }
  }

  return dist;
}

function solvePuzzle1(input: string[]): number {
  const graph = parseInput(input);

  const dist = minimumPath(graph);

  return dist.get(graph.startingPoint)!;
}

function solvePuzzle2(input: string[]): number {
  const graph = parseInput(input);

  const dist = minimumPath(graph);

  const lowestDist = [...dist]
    .filter(([node]) => node.altitude === 0)
    .map(([, steps]) => steps);

  return Math.min(...lowestDist);
}

export async function day12(): Promise<ExecutionResult> {
  const input = await loadInputFile(12);

  const puzzle1 = solvePuzzle1(input);
  const puzzle2 = solvePuzzle2(input);

  return {
    day: 12,
    puzzle1,
    puzzle2,
  };
}
