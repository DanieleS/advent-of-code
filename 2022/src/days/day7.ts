import { ExecutionResult } from "../types/executionResult";
import { loadInputFile, memoized } from "../utils";

type File = {
  name: string;
  size: number;
};

type Directory = {
  name: string;
  children: FsEntry[];
};

type FsEntry = File | Directory;

type Command =
  | {
      type: "cd";
      destination:
        | "back"
        | "root"
        | {
            dirName: string;
          };
    }
  | {
      type: "list";
    };

const cdRegex = /^\$ cd (.+)$/;

function parseCommand(input: string): Command {
  if (!input.startsWith("$")) {
    throw new Error("Invalid command");
  }

  const cdExecution = cdRegex.exec(input);
  if (cdExecution) {
    switch (cdExecution[1]) {
      case "/":
        return {
          type: "cd",
          destination: "root",
        };
      case "..":
        return {
          type: "cd",
          destination: "back",
        };
      default:
        return {
          type: "cd",
          destination: {
            dirName: cdExecution[1],
          },
        };
    }
  }

  return {
    type: "list",
  };
}

const navigateTo = function (root: Directory, path: string[]) {
  let result: Directory = root;
  for (const dir of path) {
    result = result.children.find((d) => d.name === dir) as Directory;
  }

  return result;
};

function createDirectoryTree(input: string[]) {
  const fileRegex = /^(dir|\d+) (.+)$/;

  const root: Directory = {
    name: "/",
    children: [],
  };
  let currentPath: string[] = [];
  let i = 0;
  while (i < input.length) {
    const command = parseCommand(input[i]);
    if (command.type === "cd") {
      if (command.destination === "root") {
        currentPath = [];
      } else if (command.destination === "back") {
        currentPath.pop();
      } else {
        currentPath.push(command.destination.dirName);
      }
      i++;
    } else {
      const currentDir = navigateTo(root, currentPath);
      while (input[++i] && !input[i].startsWith("$")) {
        const row = input[i];
        const [, dirOrSize, name] = fileRegex.exec(row)!;
        if (dirOrSize === "dir") {
          currentDir.children.push({
            name,
            children: [],
          });
        } else {
          currentDir.children.push({
            name,
            size: parseInt(dirOrSize),
          });
        }
      }
    }
  }

  return root;
}

function calculateSizeSmaller(root: Directory) {
  const under100kDir: number[] = [];

  const dfsGetSize = memoized(function (directory: Directory): number {
    const childrenSize = directory.children.reduce((acc, item) => {
      if ("children" in item) {
        return acc + dfsGetSize(item);
      }

      return acc + item.size;
    }, 0);

    if (childrenSize < 100_000) {
      under100kDir.push(childrenSize);
    }

    return childrenSize;
  });

  dfsGetSize(root);

  return under100kDir.reduce((acc, i) => acc + i, 0);
}

function calculateSizeToDelete(root: Directory) {
  const dirSizes: number[] = [];

  const dfsGetSize = memoized(function (directory: Directory): number {
    const childrenSize = directory.children.reduce((acc, item) => {
      if ("children" in item) {
        return acc + dfsGetSize(item);
      }

      return acc + item.size;
    }, 0);

    dirSizes.push(childrenSize);

    return childrenSize;
  });

  dfsGetSize(root);

  dirSizes.sort((a, b) => a - b);

  const totalConsumption = dirSizes.at(-1)!;

  const freeSpace = 70_000_000 - totalConsumption;

  return dirSizes.find((s) => s + freeSpace > 30_000_000)!;
}

function solvePuzzle1(input: string[]): number {
  const dirStructure = createDirectoryTree(input);

  return calculateSizeSmaller(dirStructure);
}

function solvePuzzle2(input: string[]): number {
  const dirStructure = createDirectoryTree(input);

  return calculateSizeToDelete(dirStructure);
}

export async function day7(): Promise<ExecutionResult> {
  const input = await loadInputFile(7);

  const puzzle1 = solvePuzzle1(input);
  const puzzle2 = solvePuzzle2(input);

  return {
    day: 7,
    puzzle1,
    puzzle2,
  };
}
