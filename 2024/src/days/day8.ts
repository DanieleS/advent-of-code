import type { PuzzleSolver } from "@aoc/framework";

type Point = [x: number, y: number];

type Antenna = {
  point: Point;
  frequency: string;
};

function parseInput(input: string[]): {
  antennas: Antenna[];
  map: {
    width: number;
    height: number;
  };
} {
  const width = input[0].length;
  const height = input.length;

  const antennas: Antenna[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const char = input[y][x];
      if (char === ".") {
        continue;
      }

      antennas.push({
        point: [x, y],
        frequency: char,
      });
    }
  }

  return {
    antennas,
    map: {
      width,
      height,
    },
  };
}

function solvePuzzle1(input: string[]): number {
  const { antennas, map } = parseInput(input);

  const antennaMap = new Map<string, Point[]>();

  for (const antenna of antennas) {
    if (antennaMap.has(antenna.frequency)) {
      antennaMap.get(antenna.frequency)!.push(antenna.point);
    } else {
      antennaMap.set(antenna.frequency, [antenna.point]);
    }
  }

  const antinode = new Set<string>();

  for (const frequency of antennaMap.keys()) {
    const points = antennaMap.get(frequency)!;

    for (let i = 0; i < points.length; i++) {
      const point1 = points[i];
      for (let j = i + 1; j < points.length; j++) {
        const point2 = points[j];
        const dx = point2[0] - point1[0];
        const dy = point2[1] - point1[1];

        const antinodePoint1 = [point1[0] - dx, point1[1] - dy];
        if (
          antinodePoint1[0] >= 0 &&
          antinodePoint1[0] < map.width &&
          antinodePoint1[1] >= 0 &&
          antinodePoint1[1] < map.height
        ) {
          antinode.add(antinodePoint1.toString());
        }

        const antinodePoint2 = [point2[0] + dx, point2[1] + dy];
        if (
          antinodePoint2[0] >= 0 &&
          antinodePoint2[0] < map.width &&
          antinodePoint2[1] >= 0 &&
          antinodePoint2[1] < map.height
        ) {
          antinode.add(antinodePoint2.toString());
        }
      }
    }
  }

  return antinode.size;
}

function solvePuzzle2(input: string[]): number {
  const { antennas, map } = parseInput(input);

  const antennaMap = new Map<string, Point[]>();

  for (const antenna of antennas) {
    if (antennaMap.has(antenna.frequency)) {
      antennaMap.get(antenna.frequency)!.push(antenna.point);
    } else {
      antennaMap.set(antenna.frequency, [antenna.point]);
    }
  }

  const antinode = new Set<string>();

  for (const frequency of antennaMap.keys()) {
    const points = antennaMap.get(frequency)!;

    if (points.length === 1) {
      continue;
    }

    for (let i = 0; i < points.length; i++) {
      const point1 = points[i];
      antinode.add(point1.toString());
      for (let j = i + 1; j < points.length; j++) {
        const point2 = points[j];
        const dx = point2[0] - point1[0];
        const dy = point2[1] - point1[1];

        const antinodePoint1 = [point1[0] - dx, point1[1] - dy];
        while (
          antinodePoint1[0] >= 0 &&
          antinodePoint1[0] < map.width &&
          antinodePoint1[1] >= 0 &&
          antinodePoint1[1] < map.height
        ) {
          antinode.add(antinodePoint1.toString());
          antinodePoint1[0] -= dx;
          antinodePoint1[1] -= dy;
        }

        const antinodePoint2 = [point2[0] + dx, point2[1] + dy];
        while (
          antinodePoint2[0] >= 0 &&
          antinodePoint2[0] < map.width &&
          antinodePoint2[1] >= 0 &&
          antinodePoint2[1] < map.height
        ) {
          antinode.add(antinodePoint2.toString());
          antinodePoint2[0] += dx;
          antinodePoint2[1] += dy;
        }
      }
    }
  }

  return antinode.size;
}

const solver: PuzzleSolver = async (input) => {
  return {
    puzzle1: solvePuzzle1(input),
    puzzle2: solvePuzzle2(input),
  };
};

export default solver;
