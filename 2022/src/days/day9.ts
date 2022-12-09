import { ExecutionResult } from "../types/executionResult";
import { loadInputFile, memoized } from "../utils";

type Direction = "R" | "U" | "L" | "D";
type Move = {
  direction: Direction;
  steps: number;
};

type Point = [x: number, y: number];
type RopeSegment = {
  current: Point;
  last: Point;
};
type VisitedPoint = `${number}-${number}`;
type Rope = [
  RopeSegment,
  RopeSegment,
  RopeSegment,
  RopeSegment,
  RopeSegment,
  RopeSegment,
  RopeSegment,
  RopeSegment,
  RopeSegment,
  RopeSegment
];

const moveRegex = /^(R|U|L|D) (\d+)$/;
function parseMove(input: string): Move {
  const result = moveRegex.exec(input);
  if (!result) {
    throw new Error("Invalid move!");
  }

  return {
    direction: result[1] as Direction,
    steps: parseInt(result[2]),
  };
}

function moveHead(head: RopeSegment, move: Direction): RopeSegment {
  const newHead: RopeSegment = { ...head, last: [...head.current] };
  switch (move) {
    case "D":
      newHead.current[1]--;
      break;
    case "U":
      newHead.current[1]++;
      break;
    case "L":
      newHead.current[0]--;
      break;
    case "R":
      newHead.current[0]++;
      break;
  }

  return newHead;
}

function isTailTooFar(tail: Point, head: Point) {
  if (Math.abs(tail[0] - head[0]) > 1) {
    return true;
  }
  if (Math.abs(tail[1] - head[1]) > 1) {
    return true;
  }

  return false;
}

function direction(from: Point, to: Point): Point {
  const x = to[0] - from[0];
  const y = to[1] - from[1];

  return [Math.sign(x), Math.sign(y)];
}

function follow(tail: RopeSegment, head: RopeSegment): RopeSegment {
  if (!isTailTooFar(tail.current, head.current)) {
    return tail;
  }

  const diff = direction(tail.current, head.current);
  const newPosition: Point = [
    tail.current[0] + diff[0],
    tail.current[1] + diff[1],
  ];

  return { current: newPosition, last: tail.current };
}

function solvePuzzle1(input: string[]): number {
  const moves = input.map(parseMove);

  const visitedPoints = new Set<VisitedPoint>(["0-0"]);

  let head: RopeSegment = { current: [0, 0], last: [0, 0] };
  let tail: RopeSegment = { current: [0, 0], last: [0, 0] };

  for (const move of moves) {
    for (let i = 0; i < move.steps; i++) {
      head = moveHead(head, move.direction);
      tail = follow(tail, head);

      visitedPoints.add(`${tail.current[0]}-${tail.current[1]}`);
    }
  }

  return visitedPoints.size;
}

function solvePuzzle2(input: string[]): number {
  const moves = input.map(parseMove);

  const visitedPoints = new Set<VisitedPoint>(["0-0"]);

  let rope: Rope = [
    { current: [0, 0], last: [0, 0] },
    { current: [0, 0], last: [0, 0] },
    { current: [0, 0], last: [0, 0] },
    { current: [0, 0], last: [0, 0] },
    { current: [0, 0], last: [0, 0] },
    { current: [0, 0], last: [0, 0] },
    { current: [0, 0], last: [0, 0] },
    { current: [0, 0], last: [0, 0] },
    { current: [0, 0], last: [0, 0] },
    { current: [0, 0], last: [0, 0] },
  ];

  for (const move of moves) {
    for (let i = 0; i < move.steps; i++) {
      rope[0] = moveHead(rope[0], move.direction);
      for (let i = 1; i < rope.length; i++) {
        rope[i] = follow(rope[i], rope[i - 1]);
      }

      const last = rope.at(-1)!.current;
      visitedPoints.add(`${last[0]}-${last[1]}`);
    }
  }

  return visitedPoints.size;
}

export async function day9(): Promise<ExecutionResult> {
  const input = await loadInputFile(9);

  const puzzle1 = solvePuzzle1(input);
  const puzzle2 = solvePuzzle2(input);

  return {
    day: 9,
    puzzle1,
    puzzle2,
  };
}
