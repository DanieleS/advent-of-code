import { ExecutionResult } from "../types/executionResult";
import { debugFn, loadInputFile, sumAll } from "../utils";

const cards = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
] as const;
const cardsWithJolly = [
  "A",
  "K",
  "Q",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "J",
] as const;
type Card = (typeof cards)[number];

type Hand = [Card, Card, Card, Card, Card];
type Bid = {
  hand: Hand;
  bid: number;
};

const handTypes = [
  "five",
  "four",
  "full",
  "three",
  "two-pair",
  "one-pair",
  "high-card",
] as const;

type HandType = (typeof handTypes)[number];

function parseBid(input: string): Bid {
  const regex = /^([^\s]{5}) (\d+)$/;

  const [, rawHand, rawBid] = regex.exec(input)!;

  return {
    hand: rawHand.split("") as Hand,
    bid: parseInt(rawBid),
  };
}

function handType(hand: Card[]): HandType {
  const cardsCount = hand.reduce((acc, c) => {
    return {
      ...acc,
      [c]: acc[c] ? acc[c] + 1 : 1,
    };
  }, {} as Record<Card, number>);

  if (Object.values(cardsCount).includes(5)) {
    return "five";
  }
  if (Object.values(cardsCount).includes(4)) {
    return "four";
  }
  if (
    Object.values(cardsCount).includes(3) &&
    Object.values(cardsCount).includes(2)
  ) {
    return "full";
  }
  if (Object.values(cardsCount).includes(3)) {
    return "three";
  }

  const pairCard = Object.entries(cardsCount).find(([, count]) => count === 2);
  if (
    pairCard &&
    Object.entries(cardsCount).find(
      ([card, count]) => card !== pairCard[0] && count === 2
    )
  ) {
    return "two-pair";
  }

  if (Object.values(cardsCount).includes(2)) {
    return "one-pair";
  }

  return "high-card";
}

const handTypeWithJolly = (hand: Hand): HandType => {
  const handWithoutJollies = hand.filter((c) => c !== "J");
  const jollies = 5 - handWithoutJollies.length;
  const typeWithoutJollies = handType(handWithoutJollies);

  if (!jollies) {
    return typeWithoutJollies;
  }

  if (jollies === 1) {
    if (typeWithoutJollies === "one-pair") {
      return "three";
    }

    if (typeWithoutJollies === "two-pair") {
      return "full";
    }

    if (typeWithoutJollies === "three") {
      return "four";
    }
    return handTypes[handTypes.indexOf(typeWithoutJollies) - 1];
  }

  if (jollies === 2) {
    if (typeWithoutJollies === "three") {
      return "five";
    }

    if (typeWithoutJollies === "one-pair") {
      return "four";
    }

    if (typeWithoutJollies === "high-card") {
      return "three";
    }
  }

  if (jollies === 3) {
    if (typeWithoutJollies === "one-pair") {
      return "five";
    }

    if (typeWithoutJollies === "high-card") {
      return "four";
    }
  }

  return "five";
};

const sortHands =
  (cardsOrder: readonly Card[]) =>
  (
    a: { hand: Hand; type: HandType },
    b: { hand: Hand; type: HandType }
  ): number => {
    const aPower = handTypes.indexOf(a.type);
    const bPower = handTypes.indexOf(b.type);

    if (aPower !== bPower) {
      return bPower - aPower;
    }

    for (let i = 0; i < 5; i++) {
      const aPower = cardsOrder.indexOf(a.hand[i]);
      const bPower = cardsOrder.indexOf(b.hand[i]);

      if (aPower !== bPower) {
        return bPower - aPower;
      }
    }

    return 0;
  };

function solvePuzzle1(input: string[]): number {
  const bids = input.map(parseBid);

  const bidPowers = bids.map((bid) => ({
    ...bid,
    type: handType(bid.hand),
  }));

  const sorted = bidPowers.sort(sortHands(cards));

  return sumAll(sorted.map((b, i) => b.bid * (i + 1)));
}

function solvePuzzle2(input: string[]): number {
  const bids = input.map(parseBid);

  const bidPowers = bids.map((bid) => ({
    ...bid,
    type: handTypeWithJolly(bid.hand),
  }));

  const sorted = bidPowers.sort(sortHands(cardsWithJolly));

  return sumAll(sorted.map((b, i) => b.bid * (i + 1)));
}

export async function day6(): Promise<ExecutionResult> {
  const input = await loadInputFile(6);
  const puzzle1 = solvePuzzle1(input);
  const puzzle2 = solvePuzzle2(input);

  return {
    day: 6,
    puzzle1,
    puzzle2,
  };
}
