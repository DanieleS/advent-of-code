import { ExecutionResult } from "../types/executionResult";
import { lcmMultiple, loadInputFile, multAll, sumAll } from "../utils";

type Direction = "left" | "right";
type Movement = Direction[];
type Network = Map<string, Record<Direction, string>>;

function parseInput(input: string[]): {
  movement: Movement;
  network: Network;
} {
  const [rawMovement, , ...rawNetwork] = input;

  const movement: Movement = rawMovement
    .split("")
    .map((d) => (d === "L" ? "left" : "right"));

  const networkRowRegex = /^(\w{3}) = \((\w{3}), (\w{3})\)$/;

  const network: Network = new Map(
    rawNetwork.map((value) => {
      const [, position, left, right] = networkRowRegex.exec(value)!;

      return [
        position,
        {
          left,
          right,
        },
      ];
    })
  );

  return {
    movement,
    network,
  };
}

function solvePuzzle1(input: string[]): number {
  const { movement, network } = parseInput(input);

  let steps = 0;
  let currentPos = "AAA";
  let position = 0;

  while (true) {
    if (currentPos === "ZZZ") {
      break;
    }

    steps++;
    const move = movement[position];
    position = (position + 1) % movement.length;

    currentPos = network.get(currentPos)![move];
  }

  return steps;
}

function findLoop(
  startFrom: string,
  movement: Movement,
  network: Network
): Record<string, number> {
  let steps = 0;
  let currentPos = startFrom;
  let position = 0;

  const memory: Map<`${string}-${number}`, number> = new Map();

  while (true) {
    memory.set(`${currentPos}-${position}`, steps);

    const move = movement[position];
    position = (position + 1) % movement.length;
    steps++;

    currentPos = network.get(currentPos)![move];

    if (memory.has(`${currentPos}-${position}`)) {
      break;
    }
  }

  return Object.fromEntries(
    Array.from(memory)
      .map(([key, value]) => {
        return [key.split("-")[0], value] as const;
      })
      .filter(([key]) => key.endsWith("Z"))
  );
}

function solvePuzzle2(input: string[]): string {
  const { movement, network } = parseInput(input);

  const state = Array.from(network.keys()).flatMap((key) => {
    if (!key.endsWith("A")) {
      return [];
    }

    return Object.values(findLoop(key, movement, network))[0];
  });

  const result = lcmMultiple(state.map(BigInt));
  return result.toString();
}

export async function day8(): Promise<ExecutionResult> {
  const input = await loadInputFile(8);
  const puzzle1 = solvePuzzle1(input);
  const puzzle2 = solvePuzzle2(input);

  return {
    day: 8,
    puzzle1,
    puzzle2,
  };
}
