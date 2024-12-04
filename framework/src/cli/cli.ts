import { execSync } from "node:child_process";
import * as path from "node:path";
import { parseArgs } from "node:util";
import { getDayFilePath, getDayInputPath, getLatestDay } from "./utils.js";

const {
  values: { day, test: isTest },
} = parseArgs({
  options: {
    day: {
      type: "string",
      short: "d",
      default: "latest",
    },
    test: {
      type: "boolean",
      short: "t",
      default: false,
    },
  },
});

const selectedDay = day === "latest" ? await getLatestDay() : parseInt(day, 10);

const dayFilePath = await getDayFilePath(selectedDay);
const dayInputPath = await getDayInputPath(selectedDay, isTest);

const runnerPath = path.resolve(import.meta.dirname, "../runner/runner.js");

execSync(
  `node --disable-warning=ExperimentalWarning --experimental-strip-types ${runnerPath} --day ${selectedDay} --file ${dayFilePath} --input ${dayInputPath} ${
    isTest ? "--test" : ""
  }`,
  {
    stdio: "inherit",
  }
);
