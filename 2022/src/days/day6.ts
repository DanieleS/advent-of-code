import { ExecutionResult } from "../types/executionResult";
import { loadInputFile } from "../utils";

function findSignalIndex(input: string, differentChars: number): number {
  const inputArray = [...input];
  for (let i = 0; i < inputArray.length; i++) {
    const checkSet = new Set<string>();
    for (let j = 0; j < differentChars; j++) {
      checkSet.add(inputArray[i + j]);
    }

    if (checkSet.size === differentChars) {
      return i + differentChars;
    }
  }
  return -1;
}

function solvePuzzle1(input: string[]): number {
  return findSignalIndex(input[0], 4);
}

function solvePuzzle2(input: string[]): number {
  return findSignalIndex(input[0], 14);
}

export async function day6(): Promise<ExecutionResult> {
  const input = await loadInputFile(6);

  const puzzle1 = solvePuzzle1(input);
  const puzzle2 = solvePuzzle2(input);

  return {
    day: 6,
    puzzle1,
    puzzle2,
  };
}
