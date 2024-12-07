import type { PuzzleSolver } from "@aoc/framework";

type Cell =
  | {
      type: "obstacle";
      obstacle: "#" | "O";
    }
  | {
      type: "empty";
      visited: false;
      visitedDirection: null;
    }
  | {
      type: "empty";
      visited: true;
      visitedDirection: [number, number];
    };

type Grid = Cell[][];

function parseInput(input: string[]): { grid: Grid; start: [number, number] } {
  let start: [number, number] = [0, 0];

  const grid = input.map((line, y) => {
    return line.split("").map((char, x): Cell => {
      if (char === "#") {
        return { type: "obstacle", obstacle: "#" };
      }

      if (char === "^") {
        start = [x, y];
      }

      return {
        type: "empty",
        visited: false,
        visitedDirection: null,
      };
    });
  });

  return { grid, start };
}

function solveGrid(grid: Grid, start: [number, number]): boolean {
  let direction: [number, number] = [0, -1];
  let currentPosition: [x: number, y: number] = [...start];

  const peek = () =>
    grid[currentPosition[1] + direction[1]]?.[
      currentPosition[0] + direction[0]
    ];

  while (true) {
    if (!grid[currentPosition[1]]?.[currentPosition[0]]) {
      break;
    }
    const oldCell = grid[currentPosition[1]][currentPosition[0]] as Extract<
      Cell,
      { type: "empty" }
    >;

    if (
      oldCell.visited &&
      oldCell.visitedDirection[0] === direction[0] &&
      oldCell.visitedDirection[1] === direction[1]
    ) {
      // We are in a loop
      return false;
    }

    oldCell.visited = true;
    oldCell.visitedDirection = direction;

    while (peek()?.type === "obstacle") {
      direction = [-direction[1], direction[0]];
    }

    currentPosition = [
      currentPosition[0] + direction[0],
      currentPosition[1] + direction[1],
    ];
  }

  return true;
}

const getVisitedCells = (grid: Grid) =>
  grid.flatMap((row, y) =>
    row.flatMap((cell, x) => {
      if (cell.type === "empty" && cell.visited) {
        return [{ cell: [x, y], direction: cell.visitedDirection } as const];
      }

      return [];
    })
  );

function solvePuzzle1(input: string[]): number {
  const { grid, start } = parseInput(input);

  solveGrid(grid, start);

  return grid.flat().filter((cell) => cell.type === "empty" && cell.visited)
    .length;
}

function solvePuzzle2(input: string[]): number {
  const { grid, start } = parseInput(input);

  const solvedGrid = structuredClone(grid);
  solveGrid(solvedGrid, start);

  const visitedCells = getVisitedCells(solvedGrid);

  const obstacles = new Set<string>();
  for (const visitedCell of visitedCells) {
    if (
      visitedCell.direction[0] === start[0] &&
      visitedCell.direction[1] === start[1]
    ) {
      continue;
    }

    const stepGrid = structuredClone(grid);
    stepGrid[visitedCell.cell[1]][visitedCell.cell[0]] = {
      type: "obstacle",
      obstacle: "O",
    };

    if (!solveGrid(stepGrid, start)) {
      obstacles.add(visitedCell.cell.join(","));
    }
  }

  return obstacles.size;
}

const solver: PuzzleSolver = async (input) => {
  return {
    puzzle1: solvePuzzle1(input),
    puzzle2: solvePuzzle2(input),
  };
};

export default solver;
