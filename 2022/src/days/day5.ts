import { ExecutionResult } from "../types/executionResult";
import { loadInputFile } from "../utils";

type Crate = string;
type Stack = Crate[];
type State = Stack[];
type Move = {
  crates: number;
  from: number;
  to: number;
};

function parseInitialState(input: string[]): State {
  const inputReverse = [...input].reverse();
  inputReverse.shift();

  const parseRegex = /^\[([A-Z])\]/;

  const state: State = [];

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j += 4) {
      const str = input[i].substring(j);

      const parseResult = parseRegex.exec(str);
      if (parseResult) {
        if (state[j / 4]) {
          state[j / 4].push(parseResult[1]);
        } else {
          state[j / 4] = [parseResult[1]];
        }
      }
    }
  }

  return state;
}

const moveRegex = /move (\d+) from (\d+) to (\d+)/;
function parseMove(inputMove: string): Move {
  const result = moveRegex.exec(inputMove)!;

  return {
    crates: parseInt(result[1]),
    from: parseInt(result[2]),
    to: parseInt(result[3]),
  };
}

function parseInput(input: string[]): {
  moves: Move[];
  state: State;
} {
  const splitIndex = input.findIndex((r) => !r.trim());

  const stateInput = input.slice(0, splitIndex);

  const moves = input.slice(splitIndex + 1);

  return {
    moves: moves.map(parseMove),
    state: parseInitialState(stateInput),
  };
}

function solvePuzzle1(input: string[]): string {
  const { moves, state } = parseInput(input);

  for (const move of moves) {
    for (let i = 0; i < move.crates; i++) {
      state[move.to - 1].unshift(state[move.from - 1].shift()!);
    }
  }

  return state.map((s) => s.at(0)).join("");
}

function solvePuzzle2(input: string[]): string {
  const { moves, state } = parseInput(input);

  for (const move of moves) {
    let temp = [];
    for (let i = 0; i < move.crates; i++) {
      temp.unshift(state[move.from - 1].shift()!);
    }
    temp.reverse();
    state[move.to - 1].unshift(...temp);
  }

  return state.map((s) => s.at(0)).join("");
}

export async function day5(): Promise<ExecutionResult> {
  const input = await loadInputFile(5);

  const puzzle1 = solvePuzzle1(input);
  const puzzle2 = solvePuzzle2(input);

  return {
    day: 5,
    puzzle1,
    puzzle2,
  };
}
