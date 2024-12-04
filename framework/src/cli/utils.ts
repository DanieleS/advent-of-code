import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";

export async function loadInputFile(day: number): Promise<string[]> {
  const inputFilePath = join(import.meta.dirname, "./input", `day${day}.txt`);

  const file = (await readFile(inputFilePath)).toString();

  return file.split("\n");
}

export async function getLatestDay(): Promise<number> {
  const days = await readdir(resolve(process.cwd(), "src/days"));
  const latestDay = days
    .map((day) => parseInt(day.replace("day", ""), 10))
    .filter((day) => !isNaN(day))
    .sort((a, b) => a - b)
    .pop();

  if (!latestDay) {
    throw new Error("No days found");
  }

  return latestDay;
}

export async function getDayFilePath(day: number) {
  return resolve(process.cwd(), "src/days", `day${day}.ts`);
}

export async function getDayInputPath(day: number, isTest: boolean) {
  return resolve(
    process.cwd(),
    "src/input",
    `day${day}.${isTest ? "test." : ""}txt`
  );
}
