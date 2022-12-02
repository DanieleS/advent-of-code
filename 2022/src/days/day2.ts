import { ExecutionResult } from "../types/executionResult";
import { loadInputFile } from "../utils";

type Move = "rock" | "paper" | "scissor";
type MatchResult = "defeat" | "draw" | "victory";

const points = {
  rock: 1,
  paper: 2,
  scissor: 3,
};
const moveOrder = ["rock", "paper", "scissor"] as const;

const encryptedOpponentMove = {
  A: "rock",
  B: "paper",
  C: "scissor",
} as const;

const encryptedMyMove = {
  X: "rock",
  Y: "paper",
  Z: "scissor",
} as const;

const matchResult = {
  X: "defeat",
  Y: "draw",
  Z: "victory",
} as const;

function calculateResultPoints(opponentMove: Move, myMove: Move): number {
  if (opponentMove === myMove) {
    return 3;
  }
  if (
    moveOrder.indexOf(myMove) - moveOrder.indexOf(opponentMove) === 1 ||
    (moveOrder.indexOf(myMove) === 0 && moveOrder.indexOf(opponentMove) === 2)
  ) {
    return 6;
  }

  return 0;
}

function guessedParseMove(input: string): { opponent: Move; me: Move } {
  const [opponentEncrypted, myEncrypted] = input.split(" ");

  return {
    opponent: encryptedOpponentMove[opponentEncrypted as "A" | "B" | "C"],
    me: encryptedMyMove[myEncrypted as "X" | "Y" | "Z"],
  };
}

function getMoveBasedOnResult(opponentMove: Move, result: MatchResult): Move {
  if (result === "draw") {
    return opponentMove;
  }

  if (result === "victory") {
    return moveOrder.at(
      (moveOrder.indexOf(opponentMove) + 1) % moveOrder.length
    ) as Move;
  }

  return moveOrder.at(
    (moveOrder.indexOf(opponentMove) - 1) % moveOrder.length
  ) as Move;
}

function realParseMove(input: string): { opponent: Move; me: Move } {
  const [opponentEncrypted, result] = input.split(" ");

  const opponent = encryptedOpponentMove[opponentEncrypted as "A" | "B" | "C"];

  return {
    opponent,
    me: getMoveBasedOnResult(opponent, matchResult[result as "X" | "Y" | "Z"]),
  };
}

function solvePuzzle1(input: string[]): number {
  const matches = input.map(guessedParseMove);

  const totalPoints = matches.reduce((acc, match) => {
    const movePoints = points[match.me];
    const matchPoints = calculateResultPoints(match.opponent, match.me);

    return acc + movePoints + matchPoints;
  }, 0);

  return totalPoints;
}

function solvePuzzle2(input: string[]): number {
  const matches = input.map(realParseMove);

  const totalPoints = matches.reduce((acc, match) => {
    const movePoints = points[match.me];
    const matchPoints = calculateResultPoints(match.opponent, match.me);

    return acc + movePoints + matchPoints;
  }, 0);

  return totalPoints;
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
