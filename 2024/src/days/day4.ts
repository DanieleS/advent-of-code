import type { PuzzleSolver } from "@aoc/framework";

function checkDirection(
  s: string,
  start: [number, number],
  input: string[],
  vector: [number, number]
): boolean {
  for (let i = 0; i < s.length; i++) {
    const newRow = start[0] + i * vector[0];
    const newCol = start[1] + i * vector[1];
    if (
      newRow < 0 ||
      newRow >= input.length ||
      newCol < 0 ||
      newCol >= input[0].length ||
      input[newRow][newCol] !== s[i]
    ) {
      return false;
    }
  }
  return true;
}

function compare(s: string, start: [number, number], input: string[]) {
  if (input[start[0]][start[1]] !== s[0]) {
    return 0;
  }

  const matches = [
    checkDirection(s, start, input, [1, 0]),
    checkDirection(s, start, input, [0, 1]),
    checkDirection(s, start, input, [-1, 0]),
    checkDirection(s, start, input, [0, -1]),
    checkDirection(s, start, input, [1, 1]),
    checkDirection(s, start, input, [-1, -1]),
    checkDirection(s, start, input, [-1, 1]),
    checkDirection(s, start, input, [1, -1]),
  ].filter((m) => m).length;

  return matches;
}

function solvePuzzle1(input: string[]): number {
  let xmasCount = 0;
  for (let y = 0; y < input[0].length; y++) {
    for (let x = 0; x < input.length; x++) {
      const compareResult = compare("XMAS", [y, x], input);

      xmasCount += compareResult;
    }
  }

  return xmasCount;
}

function solvePuzzle2(input: string[]): number {
  let xmasCount = 0;

  const target = "MAS";

  for (let y = 1; y < input[0].length - 1; y++) {
    for (let x = 1; x < input.length - 1; x++) {
      if (input[y][x] === "A") {
        const matches = [
          checkDirection(target, [y - 1, x - 1], input, [1, 1]),
          checkDirection(target, [y + 1, x + 1], input, [-1, -1]),
          checkDirection(target, [y + 1, x - 1], input, [-1, 1]),
          checkDirection(target, [y - 1, x + 1], input, [1, -1]),
        ];

        if (matches.filter((m) => m).length === 2) {
          xmasCount++;
        }
      }
    }
  }

  return xmasCount;
}

const solver: PuzzleSolver = async (input) => {
  return {
    puzzle1: solvePuzzle1(input),
    puzzle2: solvePuzzle2(input),
  };
};

export default solver;
