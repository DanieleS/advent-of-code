import { ExecutionResult } from "../types/executionResult";
import { loadInputFile, sumAll } from "../utils";

const rowRegex = /^(\d+)\s+(\d+)$/;

function parseInput(input: string[]): [number[], number[]] {
  return input
    .map((line) => {
      const [, left, right] = rowRegex.exec(line)!;
      return [parseInt(left, 10), parseInt(right, 10)];
    })
    .reduce(
      ([left, right], [l, r]) => {
        left.push(l);
        right.push(r);
        return [left, right];
      },
      [[], []] as [number[], number[]]
    );
}

function solvePuzzle1(input: string[]): number {
  const [left, right] = parseInput(input);

  const sLeft = left.toSorted((a, b) => a - b);
  const sRight = right.toSorted((a, b) => a - b);

  let sum = 0;
  for (let i = 0; i < sLeft.length; i++) {
    sum += Math.abs(sLeft[i] - sRight[i]);
  }

  return sum;
}

function solvePuzzle2(input: string[]): number {
  const [left, right] = parseInput(input);

  const count = right.reduce((acc, n) => {
    acc.set(n, (acc.get(n) ?? 0) + 1);
    return acc;
  }, new Map<number, number>());

  let sum = 0;
  for (let i = 0; i < left.length; i++) {
    sum += (count.get(left[i]) ?? 0) * left[i];
  }

  return sum;
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
