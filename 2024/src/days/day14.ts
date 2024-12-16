import type { PuzzleSolver } from "@aoc/framework";
import { Algebra, Modulo, Vector } from "@aoc/framework/math";

const robotRegex = /^p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)$/;

type Robot = {
  position: Vector.Vector2d;
  velocity: Vector.Vector2d;
};

const GRID_WIDTH = 101;
const GRID_HEIGHT = 103;

function parseInput(input: string[]): Robot[] {
  return input
    .map((l) => robotRegex.exec(l)!)
    .map(
      ([, px, py, vx, vy]) =>
        ({
          position: new Vector.Vector2d(parseInt(px), parseInt(py)),
          velocity: new Vector.Vector2d(parseInt(vx), parseInt(vy)),
        } satisfies Robot)
    );
}

function solvePuzzle1(input: string[]): number {
  const robots = parseInput(input);
  const finalPositions = robots.map((robot) => {
    const velocityAfter100 = robot.velocity.multiply(100);

    const position = robot.position.add(velocityAfter100);

    const x = Algebra.positiveMod(position.x, GRID_WIDTH);
    const y = Algebra.positiveMod(position.y, GRID_HEIGHT);

    return [x, y] satisfies [number, number];
  });

  const quadrants = {
    topLeft: 0,
    topRight: 0,
    bottomLeft: 0,
    bottomRight: 0,
  };

  for (const [x, y] of finalPositions) {
    if (x < Math.floor(GRID_WIDTH / 2) && y < Math.floor(GRID_HEIGHT / 2)) {
      quadrants.topLeft++;
    } else if (
      x >= Math.ceil(GRID_WIDTH / 2) &&
      y < Math.floor(GRID_HEIGHT / 2)
    ) {
      quadrants.topRight++;
    } else if (
      x < Math.floor(GRID_WIDTH / 2) &&
      y >= Math.ceil(GRID_HEIGHT / 2)
    ) {
      quadrants.bottomLeft++;
    } else if (
      x >= Math.ceil(GRID_WIDTH / 2) &&
      y >= Math.ceil(GRID_HEIGHT / 2)
    ) {
      quadrants.bottomRight++;
    }
  }

  return Object.values(quadrants).reduce(Algebra.multiply);
}

function solvePuzzle2(input: string[]): number {
  // Numbers obtained from manual solution. See day14.manual.ts
  const modW = new Modulo.Modulo(33, 103);
  const modH = new Modulo.Modulo(84, 101);

  const result = Modulo.chineseTheorem(modW, modH);
  return result.n;
}

const solve: PuzzleSolver = async (input) => {
  return {
    puzzle1: solvePuzzle1(input),
    puzzle2: solvePuzzle2(input),
  };
};

export default solve;
