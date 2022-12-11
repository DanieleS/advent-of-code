import { ExecutionResult } from "../types/executionResult";
import { loadInputFile, memoized } from "../utils";

type Noop = { instruction: "noop" };
type AddX = { instruction: "addx"; value: number };
type Instruction = Noop | AddX;

const addXRegex = /^addx (-?\d+)$/;
function parseInstruction(input: string): Instruction {
  if (input === "noop") {
    return { instruction: "noop" };
  }

  const addxRegexResult = addXRegex.exec(input);
  if (!addxRegexResult) {
    throw new Error(`Cannot parse the instruction: ${input}`);
  }

  return {
    instruction: "addx",
    value: parseInt(addxRegexResult[1]),
  };
}

function solvePuzzle1(input: string[]): number {
  const instructions = input.map(parseInstruction);

  let signalStrength = 0;
  let cycle = 0;
  let X = 1;

  const checkCycle = () => {
    if (cycle === 20 || (cycle - 20) % 40 === 0) {
      signalStrength += cycle * X;
    }
  };

  for (const instruction of instructions) {
    if (instruction.instruction === "noop") {
      cycle++;
      checkCycle();
    } else {
      cycle++;
      checkCycle();
      cycle++;
      checkCycle();
      X += instruction.value;
    }
  }

  return signalStrength;
}

function solvePuzzle2(input: string[]): string {
  const instructions = input.map(parseInstruction);

  const status: number[] = [];
  let screen = "";
  let cycle = 0;
  let X = 1;

  const pushStatus = () => {
    status.push(X);
  };

  for (const instruction of instructions) {
    if (instruction.instruction === "noop") {
      cycle++;
      pushStatus();
    } else {
      cycle++;
      pushStatus();
      cycle++;
      pushStatus();
      X += instruction.value;
    }
  }

  const shouldRenderPixel = (x: number, i: number) => {
    const currentStatus = status[i];
    return (
      x - 1 === currentStatus || x === currentStatus || x + 1 === currentStatus
    );
  };

  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 40; x++) {
      screen += shouldRenderPixel(x, x + y * 40) ? "#" : ".";
    }
    screen += "\n";
  }

  return screen;
}

export async function day10(): Promise<ExecutionResult> {
  const input = await loadInputFile(10);

  const puzzle1 = solvePuzzle1(input);
  const puzzle2 = solvePuzzle2(input);

  return {
    day: 10,
    puzzle1,
    puzzle2,
  };
}
