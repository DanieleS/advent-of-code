import type { PuzzleSolver } from "@aoc/framework";

type Block = {
  type: "file" | "empty";
  id?: number;
};

type Block2 = {
  type: "file" | "empty";
  size: number;
  id?: number;
};

function parseInput(input: string[]): Block[] {
  const row = input[0];

  const fs: Block[] = [];

  let id = 0;

  for (let i = 0; i < row.length; i++) {
    const type = i % 2 === 1 ? "empty" : "file";
    const count = parseInt(row[i]);

    for (let j = 0; j < count; j++) {
      fs.push({ type, id: type === "file" ? id : undefined });
    }

    if (type === "file") {
      id++;
    }
  }

  return fs;
}

function parseInput2(input: string[]): Block2[] {
  const row = input[0];

  const fs: Block2[] = [];

  let id = 0;

  for (let i = 0; i < row.length; i++) {
    const type = i % 2 === 1 ? "empty" : "file";
    const count = parseInt(row[i]);
    if (count === 0) {
      continue;
    }

    fs.push({ type, size: count, id: type === "file" ? id : undefined });

    if (type === "file") {
      id++;
    }
  }

  return fs;
}

function solvePuzzle1(input: string[]): number {
  const fs = parseInput(input);

  let lastEmpty = 0;
  for (let i = fs.length - 1; i >= 0; i--) {
    if (fs[i].type === "empty") {
      continue;
    }

    while (fs[lastEmpty].type === "file" && lastEmpty < i) {
      lastEmpty++;
    }

    if (lastEmpty >= i) {
      break;
    }

    fs[lastEmpty] = fs[i];
    fs[i] = { type: "empty" };
  }

  let checksum = 0;
  for (let i = 0; i <= lastEmpty; i++) {
    checksum += fs[i].id! * i;
  }

  return checksum;
}

function solvePuzzle2(input: string[]): number {
  const fs = parseInput2(input);

  for (let i = fs.length - 1; i >= 0; i--) {
    if (fs[i].type === "empty") {
      continue;
    }

    const file = fs[i];

    for (let j = 0; j < i; j++) {
      if (fs[j].type === "empty") {
        if (fs[j].size === file.size) {
          fs[j] = file;
          fs[i] = { type: "empty", size: file.size };
          break;
        } else if (fs[j].size > file.size) {
          fs.splice(j, 1, file, {
            type: "empty",
            size: fs[j].size - file.size,
          });
          fs[i + 1] = { type: "empty", size: file.size };
          i++;
          break;
        }
      }
    }
  }

  const expandedFs = fs.flatMap((block) =>
    Array.from({ length: block.size }, () => block)
  );

  let checksum = 0;
  for (let i = 0; i <= expandedFs.length; i++) {
    if (!expandedFs[i]) {
      continue;
    }
    checksum += (expandedFs[i].id ?? 0) * i;
  }

  return checksum;
}

const solver: PuzzleSolver = async (input) => {
  return {
    puzzle1: solvePuzzle1(input),
    puzzle2: solvePuzzle2(input),
  };
};

export default solver;
