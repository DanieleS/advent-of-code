import { readFile } from "node:fs/promises";
import chalk from "chalk";
import type { ExecutionResult } from "../types.js";

export function printResults(day: number, results: ExecutionResult) {
  console.log(
    chalk.greenBright("Results of ") + chalk.red.bold.underline(`Day ${day}`)
  );
  console.log();
  console.log(chalk.bgYellow.bold(" Puzzle 1 "), results.puzzle1);

  console.log();
  console.log(
    chalk.bgYellow.bold(" Puzzle 2 "),
    typeof results.puzzle2 === "number" || typeof results.puzzle2 === "string"
      ? results.puzzle2
      : "-"
  );
}

export async function loadInputFile(inputFilePath: string): Promise<string[]> {
  const file = (await readFile(inputFilePath)).toString();

  return file.split("\n");
}
