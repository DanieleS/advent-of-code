import { ExecutionResult } from "./types/executionResult";
import { join } from "path";
import { readFile } from "fs/promises";

export function printResults(results: ExecutionResult) {
  console.log(`Results of Day ${results.day}`);
  console.log();
  console.log(`Puzzle 1:`);
  console.log(results.puzzle1);

  if (results.puzzle2) {
    console.log();
    console.log(`Puzzle 2:`);
    console.log(results.puzzle2);
  }
}

export async function loadInputFile(day: number): Promise<string[]> {
  const inputFilePath = join(import.meta.dir, "./input", `day${day}.txt`);

  const file = (await readFile(inputFilePath)).toString();

  return file.split("\n");
}
