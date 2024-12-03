import { ExecutionResult } from "../types/executionResult";
import { loadInputFile, sumAll } from "../utils";

const mulRegex = /mul\((\d+),(\d+)\)/g;
const doRegex = /do\(\)/g;
const dontRegex = /don\'t\(\)/g;

function solvePuzzle1(input: string[]): number {
  mulRegex.lastIndex = 0;
  let sum = 0;

  let match: null | RegExpExecArray = null;
  while ((match = mulRegex.exec(input[0]))) {
    const a = parseInt(match[1]);
    const b = parseInt(match[2]);
    sum += a * b;
  }
  return sum;
}

function regexIndexes(regex: RegExp, input: string): number[] {
  if (!regex.global) {
    throw new Error("Regex must be global");
  }

  let match: null | RegExpExecArray = null;
  let indexes: number[] = [];
  while ((match = regex.exec(input))) {
    indexes.push(match.index);
  }
  return indexes;
}

function isEnabled(
  index: number,
  doIndexes: number[],
  dontIndexes: number[]
): boolean {
  const maxDoIndex = Math.max(...doIndexes.filter((i) => i < index));
  const maxDontIndex = Math.max(...dontIndexes.filter((i) => i < index));

  if (
    maxDoIndex > maxDontIndex ||
    (maxDoIndex === -Infinity && maxDontIndex === -Infinity)
  ) {
    return true;
  }

  return false;
}

function solvePuzzle2(input: string[]): number {
  mulRegex.lastIndex = 0;
  let sum = 0;

  const doIndexes = regexIndexes(doRegex, input[0]);
  const dontIndexes = regexIndexes(dontRegex, input[0]);

  let match: null | RegExpExecArray = null;
  while ((match = mulRegex.exec(input[0]))) {
    if (isEnabled(match.index, doIndexes, dontIndexes)) {
      const a = parseInt(match[1]);
      const b = parseInt(match[2]);
      sum += a * b;
    }
  }
  return sum;
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
