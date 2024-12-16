import type { PuzzleSolver } from "@aoc/framework";
import { Algebra } from "@aoc/framework/math";

type PageRules = Map<number, number[]>;

type Update = number[];

function parseInput(input: string[]) {
  const clonedInput = [...input];
  const rules: PageRules = new Map();
  let row: undefined | string;
  while ((row = clonedInput.shift())) {
    const [page, afterPage] = row.split("|").map(Number);

    if (!rules.has(page)) {
      rules.set(page, []);
    }

    rules.get(page)?.push(afterPage);
  }

  const updates: Update[] = clonedInput.map((row) =>
    row.split(",").map(Number)
  );

  return { rules, updates };
}

function checkUpdate(update: number[], rules: PageRules) {
  const visitedPages = new Set<number>();
  for (const page of update) {
    const rule = rules.get(page);
    visitedPages.add(page);

    if (!rule) {
      continue;
    }

    for (const pageRule of rule) {
      if (visitedPages.has(pageRule)) {
        return false;
      }
    }
  }

  return true;
}

function fixUpdate(update: number[], rules: PageRules) {
  return update.toSorted((a, b) => {
    const aRules = rules.get(a) || [];
    const bRules = rules.get(b) || [];

    if (aRules.includes(b)) {
      return -1;
    }

    if (bRules.includes(a)) {
      return 1;
    }

    return 0;
  });
}

function getMiddlePage(update: number[]) {
  return update[Math.floor(update.length / 2)];
}

function solvePuzzle1(input: string[]): number {
  const { rules, updates } = parseInput(input);

  return updates
    .filter((update) => checkUpdate(update, rules))
    .map(getMiddlePage)
    .reduce(Algebra.sum, 0);
}

function solvePuzzle2(input: string[]): number {
  const { rules, updates } = parseInput(input);

  return updates
    .filter((update) => !checkUpdate(update, rules))
    .map((update) => fixUpdate(update, rules))
    .map(getMiddlePage)
    .reduce(Algebra.sum, 0);
}

const solver: PuzzleSolver = async (input) => {
  return {
    puzzle1: solvePuzzle1(input),
    puzzle2: solvePuzzle2(input),
  };
};

export default solver;
