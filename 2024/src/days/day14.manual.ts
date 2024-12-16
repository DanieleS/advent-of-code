import { Algebra, Vector } from "@aoc/framework/math";
import fs from "node:fs/promises";
import readline from "node:readline";
import { clear } from "node:console";

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

function printGrid(positions: [number, number][]) {
  for (let h = 0; h < GRID_HEIGHT; h++) {
    let line = "";
    for (let w = 0; w < GRID_WIDTH; w++) {
      const robots = positions.filter(([x, y]) => x === w && y === h);
      line += robots.length > 0 ? robots.length : ".";
    }

    console.log(line);
  }
}

const file = await fs.readFile("../input/day14.txt", "utf-8");
const robots = parseInput(file.split("\n"));

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf-8");
let i = 7861;

function render(index: number) {
  const finalPositions = robots.map((robot) => {
    const velocityAfter100 = robot.velocity.multiply(index);

    const position = robot.position.add(velocityAfter100);

    const x = Algebra.positiveMod(position.x, GRID_WIDTH);
    const y = Algebra.positiveMod(position.y, GRID_HEIGHT);

    return [x, y] satisfies [number, number];
  });
  clear();

  console.log("--------------------");
  console.log(index);
  console.log("--------------------");

  printGrid(finalPositions);
}

process.stdin.on("data", (e: any) => {
  if (e === "\u001b") {
    process.exit(0);
  }

  if (e === "\u001b\u005b\u0044" && i > 0) {
    i--;
  } else if (e === "\u001b\u005b\u0043") {
    i++;
  }

  render(i);
});

render(i);
