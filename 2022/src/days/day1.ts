import { ExecutionResult } from "../types/executionResult";
import { loadInputFile } from "../utils";

async function solvePuzzle1(): Promise<string> {
  const input = await loadInputFile(1);

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

  return String(maxCalories);
}

async function solvePuzzle2(): Promise<string> {
  const input = await loadInputFile(1);

  const elves: number[] = [0];
  for (const snack of input) {
    if (!snack) {
      elves.push(0);
    } else {
      elves[elves.length - 1] += parseInt(snack);
    }
  }

  elves.sort((a, b) => b - a);

  return String(elves[0] + elves[1] + elves[2]);
}

export async function day1(): Promise<ExecutionResult> {
  const puzzle1 = await solvePuzzle1();
  const puzzle2 = await solvePuzzle2();

  return {
    day: 1,
    puzzle1,
    puzzle2,
  };
}
