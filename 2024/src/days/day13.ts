import type { PuzzleSolver } from "@aoc/framework";
import { Algebra } from "@aoc/framework/math";

type Button = {
  x: number;
  y: number;
};

type Prize = {
  x: number;
  y: number;
};

type ClawMachine = {
  a: Button;
  b: Button;
  prize: Prize;
};

const buttonRegex = /^Button (?:A|B): X\+(\d+), Y\+(\d+)$/;
const prizeRegex = /^Prize: X=(\d+), Y=(\d+)$/;

function parseInput(input: string[], offset = 0): ClawMachine[] {
  const clawMachines: ClawMachine[] = [];
  for (let i = 0; i < input.length; i += 4) {
    const aMatch = input[i].match(buttonRegex);
    const bMatch = input[i + 1].match(buttonRegex);
    const prizeMatch = input[i + 2].match(prizeRegex);

    if (!aMatch || !bMatch || !prizeMatch) {
      throw new Error("Invalid input");
    }

    clawMachines.push({
      a: {
        x: parseInt(aMatch[1], 10),
        y: parseInt(aMatch[2], 10),
      },
      b: {
        x: parseInt(bMatch[1], 10),
        y: parseInt(bMatch[2], 10),
      },
      prize: {
        x: parseInt(prizeMatch[1], 10) + offset,
        y: parseInt(prizeMatch[2], 10) + offset,
      },
    });
  }

  return clawMachines;
}

type Equation = [x: number, y: number, result: number];
function solveSystem(
  equation1: Equation,
  equation2: Equation
): [x: number, y: number] {
  const [a1, b1, c1] = equation1;
  const [a2, b2, c2] = equation2;

  const det = a1 * b2 - a2 * b1;
  const detX = c1 * b2 - c2 * b1;
  const detY = a1 * c2 - a2 * c1;

  return [detX / det, detY / det];
}

function solvePuzzle1(input: string[]): number {
  const clawMachines = parseInput(input);

  return clawMachines
    .map((clawMachine) => {
      const [a, b] = solveSystem(
        [clawMachine.a.x, clawMachine.b.x, clawMachine.prize.x],
        [clawMachine.a.y, clawMachine.b.y, clawMachine.prize.y]
      );

      if (a < 0 || b < 0 || !Number.isInteger(a) || !Number.isInteger(b)) {
        return 0;
      }

      return a * 3 + b;
    })
    .reduce(Algebra.sum);
}

function solvePuzzle2(input: string[]): number {
  const clawMachines = parseInput(input, 10000000000000);

  return clawMachines
    .map((clawMachine) => {
      const [a, b] = solveSystem(
        [clawMachine.a.x, clawMachine.b.x, clawMachine.prize.x],
        [clawMachine.a.y, clawMachine.b.y, clawMachine.prize.y]
      );

      if (a < 0 || b < 0 || !Number.isInteger(a) || !Number.isInteger(b)) {
        return 0;
      }

      return a * 3 + b;
    })
    .reduce(Algebra.sum);
}

const solve: PuzzleSolver = async (input) => {
  return {
    puzzle1: solvePuzzle1(input),
    puzzle2: solvePuzzle2(input),
  };
};

export default solve;
