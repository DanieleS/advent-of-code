import { ExecutionResult } from "../types/executionResult";
import { loadInputFile, sumAll } from "../utils";

function solvePuzzle1(input: string[]): number {
  const firstDigitRegex = /^[^\d]*(\d)/;
  const lastDigitRegex = /(\d)[^\d]*$/;
  const parseRow = (row: string) => {
    const firstDigit = firstDigitRegex.exec(row)![1];
    const lastDigit = lastDigitRegex.exec(row)![1];

    return parseInt(firstDigit + lastDigit);
  };

  return sumAll(input.map(parseRow));
}

function toNumber(number: string) {
  switch (number) {
    case "one":
      return "1";
    case "two":
      return "2";
    case "three":
      return "3";
    case "four":
      return "4";
    case "five":
      return "5";
    case "six":
      return "6";
    case "seven":
      return "7";
    case "eight":
      return "8";
    case "nine":
      return "9";
    default:
      return number;
  }
}

function solvePuzzle2(input: string[]): number {
  const digiWord = "one|two|three|four|five|six|seven|eight|nine";
  const firstDigitRegex = new RegExp(`(\\d|${digiWord})`);
  const lastDigitRegex = new RegExp(`.*(\\d|${digiWord})`);
  const parseRow = (row: string) => {
    const firstDigit = firstDigitRegex.exec(row)![1];
    const lastDigit = lastDigitRegex.exec(row)![1];

    return parseInt(toNumber(firstDigit) + toNumber(lastDigit));
  };

  return sumAll(input.map(parseRow));
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
