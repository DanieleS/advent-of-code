import { day1 } from "./days/day1";
import { day2 } from "./days/day2";
import { day3 } from "./days/day3";
import { day4 } from "./days/day4";
import { ExecutionResult } from "./types/executionResult";
import { printResults } from "./utils";

// const result: ExecutionResult = await day1();
// const result: ExecutionResult = await day2();
// const result: ExecutionResult = await day3();
const result: ExecutionResult = await day4();

printResults(result);
