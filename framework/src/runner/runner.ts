import { parseArgs } from "node:util";
import type { ExecutionResult } from "../types.js";
import { loadInputFile, printResults } from "./utils.js";

const {
  values: { file, input, day, test: isTest },
} = parseArgs({
  options: {
    day: {
      type: "string",
    },
    file: {
      type: "string",
    },
    input: {
      type: "string",
    },
    test: {
      type: "boolean",
    },
  },
});

if (!file) {
  throw new Error("No file specified");
}
if (!input) {
  throw new Error("No input specified");
}
if (!day) {
  throw new Error("No day specified");
}

const fn = await import(file);
const inputFile = await loadInputFile(input);

const result = (await fn.default(inputFile)) as ExecutionResult;

printResults(parseInt(day, 10), result, isTest);
