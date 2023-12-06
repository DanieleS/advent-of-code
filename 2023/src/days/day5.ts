import { ExecutionResult } from "../types/executionResult";
import { inRange, loadInputFile, multAll, sumAll } from "../utils";

type Range = {
  from: number;
  to: number;
};

type PuzzleMap = {
  sourceStart: number;
  destinationStart: number;
  range: number;
};

function parseSeeds(input: string): number[] {
  const seeds = input
    .replace("seeds: ", "")
    .trim()
    .split(" ")
    .map((n) => parseInt(n));

  return seeds;
}

function parseMap(input: string): PuzzleMap[] {
  const rawMap = input.split("\n").slice(1);

  return rawMap.map((row) => {
    const [, rawDestination, rawSource, rawRange] = /^(\d+) (\d+) (\d+)$/.exec(
      row
    )!;
    return {
      sourceStart: parseInt(rawSource),
      destinationStart: parseInt(rawDestination),
      range: parseInt(rawRange),
    };
  });
}

const mapNumber = (maps: PuzzleMap[][]) => (number: number) => {
  let temp = number;

  for (const group of maps) {
    for (const map of group) {
      if (inRange(temp, map.sourceStart, map.sourceStart + map.range)) {
        temp = temp - map.sourceStart + map.destinationStart;
        break;
      }
    }
  }

  return temp;
};

function parseSeedRanges(input: string) {
  const numbers = parseSeeds(input);
  const ranges: Range[] = [];

  for (let i = 0; i < numbers.length; i += 2) {
    ranges.push({
      from: numbers[i],
      to: numbers[i] + numbers[i + 1],
    });
  }

  return ranges;
}

const mapRange =
  (maps: PuzzleMap[][]) =>
  (ranges: Range[]): Range[] => {
    if (!maps.length) {
      return ranges;
    }
    const [map, ...remainingMaps] = maps;

    const punchHole = (
      range: Range,
      from: number,
      to: number
    ): null | {
      hole: Range;
      before: Range | null;
      after: Range | null;
    } => {
      if (to < range.from || from > range.to) {
        return null;
      }

      if (from <= range.from && to >= range.to) {
        return {
          hole: range,
          before: null,
          after: null,
        };
      }

      if (from >= range.from && to <= range.to) {
        return {
          hole: {
            from,
            to,
          },
          before:
            from === range.from
              ? null
              : {
                  from: range.from,
                  to: from - 1,
                },
          after:
            to === range.to
              ? null
              : {
                  from: to + 1,
                  to: range.to,
                },
        };
      }

      return {
        hole: {
          from: Math.max(from, range.from),
          to: Math.min(to, range.to),
        },
        before:
          from > range.from
            ? {
                from: Math.min(from - 1, range.from),
                to: from - 1,
              }
            : null,
        after:
          to < range.to
            ? {
                from: Math.min(to + 1, range.to),
                to: to - 1,
              }
            : null,
      };
    };

    let mappedRanges = [...ranges];
    let result: Range[] = [];

    for (const row of map) {
      const remainingRanges: Range[] = [];
      for (const range of mappedRanges) {
        const holeResult = punchHole(
          range,
          row.sourceStart,
          row.range + row.sourceStart
        );

        if (!holeResult) {
          remainingRanges.push(range);
        } else {
          const { hole, before, after } = holeResult;

          result.push({
            from: hole.from - row.sourceStart + row.destinationStart,
            to: hole.to - row.sourceStart + row.destinationStart,
          });

          if (before) {
            remainingRanges.push(before);
          }
          if (after) {
            remainingRanges.push(after);
          }
        }
      }

      mappedRanges = remainingRanges;
    }

    return mapRange(remainingMaps)(result.concat(mappedRanges));
  };

function solvePuzzle1(input: string[]): number {
  const [rawSeeds, ...rawMaps] = input.join("\n").split("\n\n");
  const seeds = parseSeeds(rawSeeds);
  const maps = rawMaps.map(parseMap);

  const mapped = seeds.map(mapNumber(maps));

  return Math.min(...mapped);
}

function solvePuzzle2(input: string[]): number {
  const [rawSeeds, ...rawMaps] = input.join("\n").split("\n\n");

  const seeds = parseSeedRanges(rawSeeds);
  const maps = rawMaps.map(parseMap);

  const ranges = mapRange(maps)(seeds);

  return Math.min(...ranges.map((r) => r.from));
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
