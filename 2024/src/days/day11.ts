import type { PuzzleSolver } from "@aoc/framework";

function parseInput(input: string[]): number[] {
  return input[0].split(" ").map((line) => parseInt(line, 10));
}

function solve(stones: number[], times = 25): number {
  const memo = new Map<number, number[]>();
  const frequencyMap = new Map<number, number>();

  stones.forEach((stone) => {
    frequencyMap.set(stone, (frequencyMap.get(stone) || 0) + 1);
  });

  for (let i = 0; i < times; i++) {
    const newFrequencyMap = new Map<number, number>();

    frequencyMap.forEach((count, stone) => {
      let transformedStones: number[];

      if (memo.has(stone)) {
        transformedStones = memo.get(stone)!;
      } else {
        if (stone === 0) {
          transformedStones = [1];
        } else if (stone.toString().length % 2 === 0) {
          const stoneStr = stone.toString();
          transformedStones = [
            parseInt(stoneStr.substring(0, stoneStr.length / 2), 10),
            parseInt(stoneStr.substring(stoneStr.length / 2), 10),
          ];
        } else {
          transformedStones = [stone * 2024];
        }
        memo.set(stone, transformedStones);
      }

      transformedStones.forEach((newStone) => {
        newFrequencyMap.set(
          newStone,
          (newFrequencyMap.get(newStone) || 0) + count
        );
      });
    });

    frequencyMap.clear();
    newFrequencyMap.forEach((count, stone) => {
      frequencyMap.set(stone, count);
    });
  }

  let totalStones = 0;
  frequencyMap.forEach((count) => {
    totalStones += count;
  });

  return totalStones;
}

function solvePuzzle1(input: string[]): number {
  const stones = parseInput(input);
  return solve(stones);
}

function solvePuzzle2(input: string[]): number {
  const stones = parseInput(input);
  return solve(stones, 75);
}

const solver: PuzzleSolver = async (input) => {
  return {
    puzzle1: solvePuzzle1(input),
    puzzle2: solvePuzzle2(input),
  };
};

export default solver;
