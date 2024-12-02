import { day1 } from "./days/day1";
import { day2 } from "./days/day2";
import { ExecutionResult } from "./types/executionResult";
import { printResults } from "./utils";

// const result: ExecutionResult = await day1();
const result: ExecutionResult = await day2();

printResults(result);