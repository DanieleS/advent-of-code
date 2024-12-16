import type { PuzzleSolver } from "@aoc/framework";
import { Algebra } from "@aoc/framework/math";

type Point = [x: number, y: number];

function startingPositions(input: string[]): Point[] {
  return input.flatMap((row, y) =>
    row.split("").flatMap((cell, x) => {
      if (cell === "0") {
        return [[x, y] as Point];
      }

      return [];
    })
  );
}

function solvePuzzle1(input: string[]): number {
  const positions = startingPositions(input);

  const solveNextStep = (
    position: Point,
    foundNines = new Set<string>()
  ): number => {
    const currentHeight = input[position[1]][position[0]];

    if (currentHeight === "9") {
      if (foundNines.has(position.join())) {
        // Already found this 9
        return 0;
      }

      foundNines.add(position.join());
      return 1;
    }

    const nextPositions = (
      [
        [position[0] - 1, position[1]],
        [position[0] + 1, position[1]],
        [position[0], position[1] - 1],
        [position[0], position[1] + 1],
      ] as Point[]
    ).filter(
      (position) =>
        input[position[1]]?.[position[0]] === String(Number(currentHeight) + 1)
    );

    return nextPositions
      .map((p) => solveNextStep(p, foundNines))
      .reduce(Algebra.sum);
  };

  return positions.map((p) => solveNextStep(p)).reduce(Algebra.sum);
}

function solvePuzzle2(input: string[]): number {
  const positions = startingPositions(input);

  const solveNextStep = (position: Point): number => {
    const currentHeight = input[position[1]][position[0]];

    if (currentHeight === "9") {
      return 1;
    }

    const nextPositions = (
      [
        [position[0] - 1, position[1]],
        [position[0] + 1, position[1]],
        [position[0], position[1] - 1],
        [position[0], position[1] + 1],
      ] as Point[]
    ).filter(
      (position) =>
        input[position[1]]?.[position[0]] === String(Number(currentHeight) + 1)
    );

    return nextPositions.map(solveNextStep).reduce(Algebra.sum);
  };

  return positions.map(solveNextStep).reduce(Algebra.sum);
}

const solver: PuzzleSolver = async (input) => {
  return {
    puzzle1: solvePuzzle1(input),
    puzzle2: solvePuzzle2(input),
  };
};

export default solver;
