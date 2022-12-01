import { ExecutionResult } from "./types/executionResult";

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
