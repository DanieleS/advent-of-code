import { ExecutionResult } from "../types/executionResult";
import { loadInputFile } from "../utils";

function solvePuzzle1(input: string[]): number {
  let maxCalories = 0;
  let currentElfCalories = 0;

  for (const snack of input) {
    if (!snack) {
      maxCalories =
        maxCalories > currentElfCalories ? maxCalories : currentElfCalories;
      currentElfCalories = 0;
    } else {
      currentElfCalories += parseInt(snack);
    }
  }

  return maxCalories;
}

function solvePuzzle2(input: string[]): number {
  const elves: number[] = [0];
  for (const snack of input) {
    if (!snack) {
      elves.push(0);
    } else {
      elves[elves.length - 1] += parseInt(snack);
    }
  }

  elves.sort((a, b) => b - a);

  return elves[0] + elves[1] + elves[2];
}

export async function day1(): Promise<ExecutionResult> {
  const input = await loadInputFile(1);
  const puzzle1 = solvePuzzle1(input);
  const puzzle2 = solvePuzzle2(input);

  return {
    day: 1,
    puzzle1,
    puzzle2,
  };
}
