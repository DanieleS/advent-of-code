import { ExecutionResult } from "../types/executionResult";
import { loadInputFile, sumAll } from "../utils";

type Report = number[];

function parseInput(input: string[]): Report[] {
  return input.map((line) => line.split(" ").map((n) => parseInt(n, 10)));
}

const isSorted =
  (fn: (a: number, b: number) => boolean) =>
  (arr: number[]): boolean => {
    for (let i = 1; i < arr.length; i++) {
      if (!fn(arr[i - 1], arr[i])) {
        return false;
      }
    }

    return true;
  };

const or =
  <T extends unknown[]>(
    fn1: (...args: T) => boolean,
    fn2: (...args: T) => boolean
  ) =>
  (...args: T): boolean =>
    fn1(...args) || fn2(...args);

const and =
  <T extends unknown[]>(
    fn1: (...args: T) => boolean,
    fn2: (...args: T) => boolean
  ) =>
  (...args: T): boolean =>
    fn1(...args) && fn2(...args);

const isSortedAsc = isSorted((a, b) => a < b);
const isSortedDesc = isSorted((a, b) => a > b);

const diffs = (arr: number[]): number[] =>
  arr.map((n, i) => (!i ? 0 : n - arr[i - 1])).slice(1);

const maxDiff =
  (level: number = 3) =>
  (arr: number[]): boolean => {
    const diffs = arr.map((n, i) => (!i ? 0 : n - arr[i - 1])).map(Math.abs);
    const max = Math.max(...diffs);
    return max <= level;
  };

const isValid = and(or(isSortedDesc, isSortedAsc), maxDiff());

function solvePuzzle1(input: string[]): number {
  const reports = parseInput(input);

  const validReports = reports.filter(isValid);

  return validReports.length;
}

function checkReportErrorCorrection(report: Report): boolean {
  if (isValid(report)) {
    return true;
  }

  for (let i = 0; i < report.length; i++) {
    const copy = [...report];
    copy.splice(i, 1);
    if (isValid(copy)) {
      return true;
    }
  }

  return false;
}

function solvePuzzle2(input: string[]): number {
  const reports = parseInput(input);

  const validReports = reports.filter(checkReportErrorCorrection);

  return validReports.length;
}

export async function day2(): Promise<ExecutionResult> {
  const input = await loadInputFile(2);
  const puzzle1 = solvePuzzle1(input);
  const puzzle2 = solvePuzzle2(input);

  return {
    day: 2,
    puzzle1,
    puzzle2,
  };
}
