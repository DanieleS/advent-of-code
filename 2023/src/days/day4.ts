import { ExecutionResult } from "../types/executionResult";
import { loadInputFile, multAll, sumAll } from "../utils";

type Card = {
  id: number;
  numbers: Set<number>;
  winning: Set<number>;
};

const cardRegex = /^Card +(\d+): ([\d\s]+) \| +([\d\s]+)$/;

function parseNumbers(numbers: string): number[] {
  return numbers
    .replaceAll("  ", " ")
    .split(" ")
    .map((n) => parseInt(n));
}

function parseCard(input: string): Card {
  const [, id, rawWinning, rawNumbers] = cardRegex.exec(input)!;
  const winning = parseNumbers(rawWinning);
  const numbers = parseNumbers(rawNumbers);

  return {
    id: parseInt(id),
    winning: new Set(winning),
    numbers: new Set(numbers),
  };
}

function cardPoints(card: Card): number {
  const winning = Array.from(card.winning);

  return winning.reduce((acc, w) => {
    if (!card.numbers.has(w)) {
      return acc;
    }

    if (acc === 0) {
      return 1;
    }

    return acc * 2;
  }, 0);
}

function solvePuzzle1(input: string[]): number {
  const cards = input.map(parseCard);
  return sumAll(cards.map(cardPoints));
}

function cardWinningNumbers(card: Card): number {
  const winning = Array.from(card.winning);

  return winning.reduce((acc, w) => {
    if (!card.numbers.has(w)) {
      return acc;
    }

    if (acc === 0) {
      return 1;
    }

    return acc + 1;
  }, 0);
}

function solvePuzzle2(input: string[]): number {
  const cards = input.map(parseCard);

  const queue = [...cards];
  let scratchcards = 0;

  let card: Card | undefined;

  while ((card = queue.shift())) {
    const winningNumbers = cardWinningNumbers(card);

    if (winningNumbers) {
      const cardsToBeAdded = cards.slice(card.id, card.id + winningNumbers);

      queue.unshift(...cardsToBeAdded);
    }

    scratchcards++;
  }

  return scratchcards;
}

export async function day4(): Promise<ExecutionResult> {
  const input = await loadInputFile(4);
  const puzzle1 = solvePuzzle1(input);
  const puzzle2 = solvePuzzle2(input);

  return {
    day: 4,
    puzzle1,
    puzzle2,
  };
}
