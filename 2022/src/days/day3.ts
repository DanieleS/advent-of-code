import { ExecutionResult } from "../types/executionResult";
import { loadInputFile } from "../utils";

type Rucksack = [compartment1: string, compartment2: string];

function parseRucksack(rucksack: string): Rucksack {
  const compartment1 = rucksack.substring(0, rucksack.length / 2);
  const compartment2 = rucksack.substring(rucksack.length / 2);

  return [compartment1, compartment2];
}

function findCommonItem(rucksack: Rucksack): string {
  const compartment1 = new Set([...rucksack[0]]);

  return [...rucksack[1]].find((s) => compartment1.has(s))!;
}

function calculateItemPriority(element: string): number {
  if (element >= "a" && element <= "z") {
    return element.charCodeAt(0) - 96;
  }

  return element.charCodeAt(0) - 38;
}

function intersecate<T>(s1: Set<T>, s2: Set<T>): Set<T> {
  const result = new Set<T>();
  for (const item of s2) {
    if (s1.has(item)) {
      result.add(item);
    }
  }

  return result;
}

function chunk<T>(arr: T[], chunkSize: number) {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    if (i % chunkSize === 0) {
      result.push([]);
    }

    result.at(-1)?.push(arr[i]);
  }

  return result;
}

function solvePuzzle1(input: string[]): number {
  return input.reduce((acc, input) => {
    const rucksack = parseRucksack(input);
    const commonItem = findCommonItem(rucksack);
    return acc + calculateItemPriority(commonItem);
  }, 0);
}

function solvePuzzle2(input: string[]): number {
  return chunk(input, 3).reduce((acc, input) => {
    const commonItemSet = intersecate(
      new Set([...input[0]]),
      intersecate(new Set([...input[1]]), new Set([...input[2]]))
    );

    return acc + calculateItemPriority([...commonItemSet][0]);
  }, 0);
}

export async function day3(): Promise<ExecutionResult> {
  const input = await loadInputFile(3);

  const puzzle1 = solvePuzzle1(input);
  const puzzle2 = solvePuzzle2(input);

  return {
    day: 3,
    puzzle1,
    puzzle2,
  };
}
