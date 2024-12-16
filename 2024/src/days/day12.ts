import type { PuzzleSolver } from "@aoc/framework";
import { Algebra } from "@aoc/framework/math";

type Grid = string[];
type Group = Set<string>;
type Position = [x: number, y: number];
type Side = [
  from: Position,
  to: Position,
  direction: "up" | "down" | "left" | "right"
];

const directions: Position[] = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const mapDirection = (
  direction: Position
): "up" | "down" | "left" | "right" => {
  if (direction[0] === 0 && direction[1] === 1) {
    return "down";
  }
  if (direction[0] === 0 && direction[1] === -1) {
    return "up";
  }
  if (direction[0] === 1 && direction[1] === 0) {
    return "right";
  }
  if (direction[0] === -1 && direction[1] === 0) {
    return "left";
  }

  throw new Error("Invalid direction");
};

function findGroups(grid: Grid): Map<string, Group[]> {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = new Set<string>();
  const groups = new Map<string, Group[]>();

  const getNeighbors = ([x, y]: Position): Position[] => {
    return directions
      .map(([dx, dy]): Position => [dx + x, dy + y])
      .filter(([x, y]) => x >= 0 && x < cols && y >= 0 && y < rows);
  };

  const dfs = ([x, y]: Position, letter: string): Group => {
    const pos = `${x},${y}`;
    if (visited.has(pos) || grid[y][x] !== letter) {
      return new Set();
    }

    visited.add(pos);
    const group = new Set([pos]);

    for (const position of getNeighbors([x, y])) {
      const subGroup = dfs(position, letter);
      subGroup.forEach((p) => group.add(p));
    }

    return group;
  };

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const pos = `${x},${y}`;
      if (!visited.has(pos)) {
        const letter = grid[y][x];
        const group = dfs([x, y], letter);
        if (group.size > 0) {
          if (!groups.has(letter)) {
            groups.set(letter, []);
          }
          groups.get(letter)!.push(group);
        }
      }
    }
  }

  return groups;
}

function calculateArea(group: Group) {
  return group.size;
}

function calculatePerimeter(group: Group) {
  let perimeter = 0;
  group.forEach((pos) => {
    const [x, y] = pos.split(",").map((n) => parseInt(n, 10));
    for (const [dx, dy] of directions) {
      const neighbor = `${x + dx},${y + dy}`;
      if (!group.has(neighbor)) {
        perimeter++;
      }
    }
  });
  return perimeter;
}

function getEdge(position: Position, direction: Position): Side {
  const [x, y] = position;
  const [dx, dy] = direction;

  const mappedDirection = mapDirection(direction);

  if (dx === 0 && dy === -1) {
    return [[x, y], [x + 1, y], mappedDirection];
  } else if (dx === 0 && dy === 1) {
    return [[x, y + 1], [x + 1, y + 1], mappedDirection];
  } else if (dx === -1 && dy === 0) {
    // Moving left
    return [[x, y], [x, y + 1], mappedDirection];
  } else if (dx === 1 && dy === 0) {
    // Moving right
    return [[x + 1, y], [x + 1, y + 1], mappedDirection];
  } else {
    throw new Error("Invalid delta vector");
  }
}

function edgeDirection(edge: Side): "horizontal" | "vertical" {
  const [[x1, y1], [x2, y2]] = edge;
  if (x1 === x2) {
    return "vertical";
  } else if (y1 === y2) {
    return "horizontal";
  } else {
    throw new Error("Invalid edge");
  }
}

function calculateSides(group: Group): number {
  const sides: Side[] = [];

  const addSide = (from: Position, direction: Position) => {
    const edge = getEdge(from, direction);
    sides.push(edge);
  };

  group.forEach((pos) => {
    const [x, y] = pos.split(",").map((n) => parseInt(n, 10));
    for (const [dx, dy] of directions) {
      const neighbor = `${x + dx},${y + dy}`;
      if (!group.has(neighbor)) {
        addSide([x, y], [dx, dy]);
      }
    }
  });

  const mergedSides: Side[] = [];

  while (sides.length > 0) {
    const edge = sides.pop()!;
    const overlappingSides = mergedSides.filter(
      (side) =>
        edgeDirection(side) === edgeDirection(edge) &&
        side[2] === edge[2] &&
        (side[0].toString() === edge[0].toString() ||
          side[1].toString() === edge[1].toString() ||
          side[0].toString() === edge[1].toString() ||
          side[1].toString() === edge[0].toString() ||
          (side[0][0] <= edge[1][0] &&
            side[1][0] >= edge[0][0] &&
            side[0][1] <= edge[1][1] &&
            side[1][1] >= edge[0][1]))
    );

    if (overlappingSides.length > 0) {
      const newSide: Side = [
        [
          Math.min(edge[0][0], ...overlappingSides.map((s) => s[0][0])),
          Math.min(edge[0][1], ...overlappingSides.map((s) => s[0][1])),
        ],
        [
          Math.max(edge[1][0], ...overlappingSides.map((s) => s[1][0])),
          Math.max(edge[1][1], ...overlappingSides.map((s) => s[1][1])),
        ],
        edge[2],
      ];

      overlappingSides.forEach((side) =>
        mergedSides.splice(mergedSides.indexOf(side), 1)
      );
      mergedSides.push(newSide);
    } else {
      mergedSides.push(edge);
    }
  }

  return mergedSides.length;
}

function solvePuzzle1(input: string[]): number {
  const groups = findGroups(input);
  return groups
    .values()
    .flatMap((groups) =>
      groups.map((group) => ({
        area: calculateArea(group),
        perimeter: calculatePerimeter(group),
      }))
    )
    .map(({ area, perimeter }) => area * perimeter)
    .reduce(Algebra.sum);
}

function solvePuzzle2(input: string[]): number {
  const groups = findGroups(input);
  return groups
    .entries()
    .flatMap(([letter, groups]) =>
      groups.map((group) => ({
        area: calculateArea(group),
        sides: calculateSides(group),
      }))
    )
    .map(({ area, sides }) => area * sides)
    .reduce(Algebra.sum);
}

const solver: PuzzleSolver = async (input) => {
  return {
    puzzle1: solvePuzzle1(input),
    puzzle2: solvePuzzle2(input),
  };
};

export default solver;
