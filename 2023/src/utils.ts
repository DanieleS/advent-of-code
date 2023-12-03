import { ExecutionResult } from "./types/executionResult";
import { join } from "path";
import { readFile } from "fs/promises";

export function printResults(results: ExecutionResult) {
  console.log(`Results of Day ${results.day}`);
  console.log();
  console.log(`Puzzle 1:`);
  console.log(results.puzzle1);

  if (typeof results.puzzle2 === "number") {
    console.log();
    console.log(`Puzzle 2:`);
    console.log(results.puzzle2);
  }
}

export async function loadInputFile(day: number): Promise<string[]> {
  const inputFilePath = join(import.meta.dir, "./input", `day${day}.txt`);

  const file = (await readFile(inputFilePath)).toString();

  return file.split("\n");
}

export function memoized<I extends object, O>(
  fn: (input: I) => O
): (input: I) => O {
  const results = new WeakMap<I, O>();
  return (input) => {
    const memoedResult = results.get(input);
    if (memoedResult) {
      return memoedResult;
    }

    const result = fn(input);
    results.set(input, result);

    return result;
  };
}

export function sumAll(arr: number[]): number {
  return arr.reduce((acc, n) => acc + n, 0);
}

export function multAll(arr: number[]): number {
  return arr.reduce((acc, n) => acc * n, 1);
}
