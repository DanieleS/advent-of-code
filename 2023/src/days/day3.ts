import { ExecutionResult } from "../types/executionResult";
import { loadInputFile, multAll, sumAll } from "../utils";

type Number = {
  number: number;
  position: {
    row: number;
    column: number;
    span: number;
  };
};

type Symbol = {
  symbol: string;
  position: {
    row: number;
    column: number;
  };
  matchedNumber: Number;
};

function parseNumbers(row: string, rowIndex: number) {
  const numberRegex = /\d+/g;

  let match: string | undefined;
  const numbers: Number[] = [];
  while ((match = numberRegex.exec(row)?.[0])) {
    numbers.push({
      number: parseInt(match),
      position: {
        row: rowIndex,
        column: numberRegex.lastIndex - match.length,
        span: match.length,
      },
    });
  }
  return numbers;
}

const symbolRegex = /^[^\.\d]$/;

const hasSmbolAdjacent =
  (matrix: string[]) =>
  (number: Number): false | Symbol => {
    const checkRow = (row: number) => {
      for (
        let i = Math.max(0, number.position.column - 1);
        i <
        Math.min(
          matrix[row].length,
          number.position.column + number.position.span + 1
        );
        i++
      ) {
        if (symbolRegex.test(matrix[row][i])) {
          return {
            matchedNumber: number,
            position: {
              row,
              column: i,
            },
            symbol: matrix[row][i],
          } satisfies Symbol;
        }
      }
      return false;
    };
    if (number.position.row > 0 && checkRow(number.position.row - 1)) {
      const result = checkRow(number.position.row - 1);
      if (result) return result;
    }
    if (number.position.row < matrix.length - 1) {
      const result = checkRow(number.position.row + 1);
      if (result) return result;
    }

    if (
      number.position.column > 0 &&
      symbolRegex.test(matrix[number.position.row][number.position.column - 1])
    ) {
      return {
        matchedNumber: number,
        position: {
          row: number.position.row,
          column: number.position.column - 1,
        },
        symbol: matrix[number.position.row][number.position.column - 1],
      } satisfies Symbol;
    }

    if (
      number.position.column + number.position.span <
        matrix[number.position.row].length &&
      symbolRegex.test(
        matrix[number.position.row][
          number.position.column + number.position.span
        ]
      )
    ) {
      return {
        matchedNumber: number,
        position: {
          row: number.position.row,
          column: number.position.column + number.position.span,
        },
        symbol:
          matrix[number.position.row][
            number.position.column + number.position.span
          ],
      } satisfies Symbol;
    }

    return false;
  };

function solvePuzzle1(input: string[]): number {
  const numbers = input.flatMap(parseNumbers);

  const partNumbers = numbers.filter(hasSmbolAdjacent(input));

  return sumAll(partNumbers.map((n) => n.number));
}

function solvePuzzle2(input: string[]): number {
  const numbers = input.flatMap(parseNumbers);

  const gears = numbers
    .map(hasSmbolAdjacent(input))
    .flatMap((symbol) => (symbol ? [symbol] : []))
    .filter((symbol) => symbol.symbol === "*");

  const gearsMap = new Map<`${number}-${number}`, Number[]>();
  for (const gear of gears) {
    const coords: `${number}-${number}` = `${gear.position.row}-${gear.position.column}`;

    const gearNumbers = gearsMap.get(coords) ?? [];
    gearsMap.set(coords, [...gearNumbers, gear.matchedNumber]);
  }

  const matchedNumbers = Array.from(gearsMap.values()).filter(
    (mn) => mn.length === 2
  );

  return sumAll(matchedNumbers.map((mn) => multAll(mn.map((n) => n.number))));
}

export async function day3(): Promise<ExecutionResult> {
  const input = await loadInputFile(3);
  const puzzle1 = solvePuzzle1(input);
  const puzzle2 = solvePuzzle2(input);

  return {
    day: 3,
    puzzle1,
    puzzle2,
  };
}
