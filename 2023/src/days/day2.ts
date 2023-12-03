import { ExecutionResult } from "../types/executionResult";
import { loadInputFile, multAll, sumAll } from "../utils";

type Cube = "blue" | "red" | "green";
type CubeSet = Record<Cube, number>;

type Game = {
  id: number;
  revelations: CubeSet[];
};

function parseGame(input: string): Game {
  const gameRegex = /^Game (\d+): (.*)$/;
  const revelationRegex = /^(\d+) (red|blue|green)$/;
  const [, id, rawRevelations] = gameRegex.exec(input)!;
  const revelations = rawRevelations
    .split(";")
    .map((s) => s.trim())
    .map(
      (s) =>
        Object.fromEntries(
          s
            .split(",")
            .map((s) => s.trim())
            .map((s) => {
              const [, num, color] = revelationRegex.exec(s)!;

              return [color, parseInt(num)] as const;
            })
        ) as CubeSet
    );

  const game = { id: parseInt(id), revelations };

  return game;
}

function isGamePossible(checkAgainst: CubeSet): (game: Game) => boolean {
  const checkCubeSet = (set: CubeSet) =>
    Object.entries(set).every(
      ([color, num]) => checkAgainst[color as Cube] >= num
    );

  return (game) => game.revelations.every(checkCubeSet);
}

function solvePuzzle1(input: string[]): number {
  const gameToCheck: CubeSet = {
    red: 12,
    green: 13,
    blue: 14,
  };

  const games = input.map(parseGame);
  const possibleGames = games.filter(isGamePossible(gameToCheck));

  return sumAll(possibleGames.map((game) => game.id));
}

function calculateMinCubes(game: Game): Partial<CubeSet> {
  const cubes: Partial<CubeSet> = {};

  for (const revelation of game.revelations) {
    for (const cube in revelation) {
      if ((cubes[cube as Cube] ?? 0) < revelation[cube as Cube]) {
        cubes[cube as Cube] = revelation[cube as Cube];
      }
    }
  }

  console.log(`Game ${game.id} is composed of min: `, cubes);
  return cubes;
}

function calculatePower(set: Partial<CubeSet>): number {
  return multAll(Object.values(set));
}

function solvePuzzle2(input: string[]): number {
  const games = input.map(parseGame);
  const gamePowers = games.map(calculateMinCubes).map(calculatePower);

  return sumAll(gamePowers);
}

export async function day2(): Promise<ExecutionResult> {
  const input = await loadInputFile(2);
  const puzzle1 = solvePuzzle1(input);
  const puzzle2 = solvePuzzle2(input);

  return {
    day: 2,
    puzzle1,
    puzzle2,
  };
}
