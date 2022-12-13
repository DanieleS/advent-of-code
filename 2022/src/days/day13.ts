import { ExecutionResult } from "../types/executionResult";
import { loadInputFile } from "../utils";

type Packet = number | Packet[];
type Couple = [Packet[], Packet[]];

function parseInput(input: string[]): Couple[] {
  const couples: Couple[] = [];

  for (let i = 0; i < input.length; i += 3) {
    const left = JSON.parse(input[i]);
    const right = JSON.parse(input[i + 1]);

    couples.push([left, right]);
  }

  return couples;
}

function isNumber(n: Packet): n is number {
  return typeof n === "number";
}

function isOrderCorrect(left: Packet[], right: Packet[]): boolean {
  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    const ln = left[i];
    const rn = right[i];

    if (isNumber(ln) && isNumber(rn) && ln !== rn) {
      return ln < rn;
    }

    if (isNumber(ln) && Array.isArray(rn)) {
      return isOrderCorrect([ln], rn);
    }

    if (Array.isArray(ln) && isNumber(rn)) {
      return isOrderCorrect(ln, [rn]);
    }

    if (Array.isArray(ln) && Array.isArray(rn) && (ln.length || rn.length)) {
      return isOrderCorrect(ln, rn);
    }
  }

  if (left.length > right.length) {
    return false;
  }

  return true;
}

function solvePuzzle1(input: string[]): number {
  const couples = parseInput(input);

  const result = couples
    .map(([left, right], i) => (isOrderCorrect(left, right) ? i + 1 : 0))
    .reduce((acc, n) => acc + n, 0);

  return result;
}

function solvePuzzle2(input: string[]): number {
  const couples = parseInput(input);

  const divider1 = [[2]];
  const divider2 = [[6]];
  const packets: Packet[][] = couples.flat(1);
  packets.push(divider1, divider2);

  packets.sort((left, right) => {
    if (isOrderCorrect(left, right)) {
      return -1;
    }
    return 1;
  });

  return (packets.indexOf(divider1) + 1) * (packets.indexOf(divider2) + 1);
}

export async function day13(): Promise<ExecutionResult> {
  const input = await loadInputFile(13);

  const puzzle1 = solvePuzzle1(input);
  const puzzle2 = solvePuzzle2(input);

  return {
    day: 13,
    puzzle1,
    puzzle2,
  };
}
