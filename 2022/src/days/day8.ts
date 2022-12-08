import { ExecutionResult } from "../types/executionResult";
import { loadInputFile, memoized } from "../utils";

type Tree = {
  height: number;
  visible: boolean;
};

function solvePuzzle1(input: string[]): number {
  const forest: Tree[][] = input.map((row) =>
    row.split("").map((t) => ({
      height: parseInt(t),
      visible: false,
    }))
  );

  for (let y = 0; y < forest.length; y++) {
    let highest = -1;
    for (let x = 0; x < forest[y].length; x++) {
      if (forest[y][x].height > highest) {
        forest[y][x].visible = true;
        highest = forest[y][x].height;
      }
    }
  }

  for (let y = 0; y < forest.length; y++) {
    let highest = -1;
    for (let x = forest[y].length - 1; x >= 0; x--) {
      if (forest[y][x].height > highest) {
        forest[y][x].visible = true;
        highest = forest[y][x].height;
      }
    }
  }

  for (let x = 0; x < forest[0].length; x++) {
    let highest = -1;
    for (let y = 0; y < forest.length; y++) {
      if (forest[y][x].height > highest) {
        forest[y][x].visible = true;
        highest = forest[y][x].height;
      }
    }
  }

  for (let x = 0; x < forest[0].length; x++) {
    let highest = -1;
    for (let y = forest.length - 1; y >= 0; y--) {
      if (forest[y][x].height > highest) {
        forest[y][x].visible = true;
        highest = forest[y][x].height;
      }
    }
  }

  return forest.reduce(
    (acc, i) => acc + i.reduce((acc, i) => (i.visible ? 1 : 0) + acc, 0),
    0
  );
}

function solvePuzzle2(input: string[]): number {
  const forest: number[][] = input.map((row) =>
    row.split("").map((t) => parseInt(t))
  );

  let highestScore = 0;

  for (let y = 0; y < forest.length; y++) {
    for (let x = 0; x < forest[y].length; x++) {
      const tree = forest[y][x];
      let left = 0;
      for (let xd = x - 1; xd >= 0; xd--) {
        if (forest[y][xd] < tree) {
          left++;
        } else {
          left++;
          break;
        }
      }
      let right = 0;
      for (let xd = x + 1; xd < forest[y].length; xd++) {
        if (forest[y][xd] < tree) {
          right++;
        } else {
          right++;
          break;
        }
      }
      let top = 0;
      for (let yd = y - 1; yd >= 0; yd--) {
        if (forest[yd][x] < tree) {
          top++;
        } else {
          top++;
          break;
        }
      }
      let bottom = 0;
      for (let yd = y + 1; yd < forest.length; yd++) {
        if (forest[yd][x] < tree) {
          bottom++;
        } else {
          bottom++;
          break;
        }
      }

      const score = top * left * bottom * right;
      if (score > highestScore) {
        highestScore = score;
      }
    }
  }

  return highestScore;
}

export async function day8(): Promise<ExecutionResult> {
  const input = await loadInputFile(8);

  const puzzle1 = solvePuzzle1(input);
  const puzzle2 = solvePuzzle2(input);

  return {
    day: 8,
    puzzle1,
    puzzle2,
  };
}
