import type { PuzzleSolver } from "@aoc/framework";
import { Algebra } from "@aoc/framework/math";

type EquationQuestion = {
  result: number;
  factors: number[];
};

type Equation = {
  result: number;
  factors: [
    { factor: number },
    ...{ factor: number; operation: "+" | "*" | "||" }[]
  ];
};

const equationRegex = /^(\d+): (\d+(?: \d+)+)$/;

function parseInput(input: string[]): EquationQuestion[] {
  return input.map((line) => {
    const [, result, factors] = equationRegex.exec(line)!;

    return {
      result: parseInt(result, 10),
      factors: factors.split(" ").map((factor) => parseInt(factor, 10)),
    };
  });
}

function isEquationValid(equation: Equation): boolean {
  let result = equation.factors[0].factor;
  for (let i = 1; i < equation.factors.length; i++) {
    const { factor, operation } = equation.factors[i] as {
      factor: number;
      operation: "+" | "*";
    };
    if (operation === "+") {
      result += factor;
    } else if (operation === "*") {
      result *= factor;
    } else {
      result = parseInt(String(result) + String(factor));
    }
  }

  return result === equation.result;
}

function solveEquation(
  operators: ("+" | "*" | "||")[] = ["+", "*"]
): (equation: EquationQuestion) => Equation | null {
  return (equation) => {
    const factors = equation.factors.map((factor) => ({
      factor,
      operation: "+" as "+" | "*" | "||",
    }));

    function backtrack(index: number): boolean {
      if (index === factors.length) {
        const finalEquation: Equation = {
          result: equation.result,
          factors: [{ factor: factors[0].factor }, ...factors.slice(1)],
        };
        return isEquationValid(finalEquation);
      }

      for (const operator of operators) {
        factors[index].operation = operator;
        if (backtrack(index + 1)) {
          return true;
        }
      }

      return false;
    }

    if (backtrack(1)) {
      return {
        result: equation.result,
        factors: [{ factor: factors[0].factor }, ...factors.slice(1)],
      };
    }

    return null;
  };
}

function solvePuzzle1(input: string[]): number {
  const equations = parseInput(input);
  return equations
    .map(solveEquation(["+", "*"]))
    .filter((equation) => equation !== null)
    .map((equation) => equation.result)
    .reduce(Algebra.sum, 0);
}

function solvePuzzle2(input: string[]): number {
  const equations = parseInput(input);
  return equations
    .map(solveEquation(["+", "*", "||"]))
    .filter((equation) => equation !== null)
    .map((equation) => equation.result)
    .reduce(Algebra.sum, 0);
}

const solver: PuzzleSolver = async (input) => {
  return {
    puzzle1: solvePuzzle1(input),
    puzzle2: solvePuzzle2(input),
  };
};

export default solver;
