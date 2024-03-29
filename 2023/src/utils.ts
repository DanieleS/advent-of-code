import { ExecutionResult } from "./types/executionResult";
import { join } from "path";
import { readFile } from "fs/promises";

export function printResults(results: ExecutionResult) {
  console.log(`Results of Day ${results.day}`);
  console.log();
  console.log(`Puzzle 1:`);
  console.log(results.puzzle1);

  if (
    typeof results.puzzle2 === "number" ||
    typeof results.puzzle2 === "string"
  ) {
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

export const debugFn =
  <T extends unknown[], R>(fn: (...args: T) => R): ((...args: T) => R) =>
  (...args) => {
    const result = fn(...args);

    console.log(...args, result);

    return result;
  };

export function sumAll(arr: number[]): number {
  return arr.reduce((acc, n) => acc + n, 0);
}

export function multAll(arr: number[]): number {
  return arr.reduce((acc, n) => acc * n, 1);
}

export function inRange(number: number, min: number, max: number) {
  return number >= min && number < max;
}

export function gcd(a: bigint, b: bigint): bigint {
  if (b === 0n) {
    return a;
  }
  return gcd(b, a % b);
}

export function lcm(a: bigint, b: bigint): bigint {
  return (a * b) / gcd(a, b);
}

export function lcmMultiple(numbers: bigint[]): bigint {
  if (numbers.length === 0) {
    return 0n;
  }
  let result = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    result = lcm(result, numbers[i]);
  }
  return result;
}
