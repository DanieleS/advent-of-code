import { ExecutionResult } from "../types/executionResult";
import { loadInputFile } from "../utils";

type ElfAssignments = {
  from: number;
  to: number;
};

const elfRegex = /^(\d+)-(\d+)$/;
function parseElf(elf: string): ElfAssignments {
  const [, from, to] = elfRegex.exec(elf)!;

  return {
    from: parseInt(from),
    to: parseInt(to),
  };
}

function firstElfContainsSecond(
  elf1: ElfAssignments,
  elf2: ElfAssignments
): boolean {
  return elf1.from <= elf2.from && elf1.to >= elf2.to;
}

function elvesOverlaps(elf1: ElfAssignments, elf2: ElfAssignments): boolean {
  return elf1.from <= elf2.from && elf1.to >= elf2.from;
}

function solvePuzzle1(input: string[]): number {
  return input.reduce((acc, pair) => {
    const [elf1s, elf2s] = pair.split(",");
    const elf1 = parseElf(elf1s);
    const elf2 = parseElf(elf2s);

    const overlaps =
      firstElfContainsSecond(elf1, elf2) || firstElfContainsSecond(elf2, elf1);

    return acc + (overlaps ? 1 : 0);
  }, 0);
}

function solvePuzzle2(input: string[]): number {
  return input.reduce((acc, pair) => {
    const [elf1s, elf2s] = pair.split(",");
    const elf1 = parseElf(elf1s);
    const elf2 = parseElf(elf2s);

    const overlaps = elvesOverlaps(elf1, elf2) || elvesOverlaps(elf2, elf1);

    return acc + (overlaps ? 1 : 0);
  }, 0);
}

export async function day4(): Promise<ExecutionResult> {
  const input = await loadInputFile(4);

  const puzzle1 = solvePuzzle1(input);
  const puzzle2 = solvePuzzle2(input);

  return {
    day: 4,
    puzzle1,
    puzzle2,
  };
}
