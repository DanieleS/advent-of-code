use std::fs::read_to_string;

struct Point {
    x: u32,
    y: u32,
    value: u8,
}

impl Point {
    fn new(x: u32, y: u32, value: u8) -> Point {
        Point { x, y, value }
    }
}

struct Heightmap {
    data: Vec<Vec<u8>>,
}

struct Basin {
    data: Vec<u8>,
}

impl Heightmap {
    fn from(input: &str) -> Self {
        let data: Vec<Vec<u8>> = input
            .lines()
            .map(|line| {
                line.chars()
                    .map(|c| c.to_digit(10).unwrap() as u8)
                    .collect()
            })
            .collect();

        Heightmap { data }
    }

    fn find_low_points(&self) -> Vec<Point> {
        let mut low_points: Vec<Point> = vec![];

        for row in 0..self.data.len() {
            for col in 0..self.data[row].len() {
                let point = self.data[row][col];

                let mut adjacent_points: Vec<u8> = vec![];

                if row > 0 {
                    adjacent_points.push(self.data[row - 1][col]);
                }

                if row < self.data.len() - 1 {
                    adjacent_points.push(self.data[row + 1][col]);
                }

                if col > 0 {
                    adjacent_points.push(self.data[row][col - 1]);
                }

                if col < self.data[row].len() - 1 {
                    adjacent_points.push(self.data[row][col + 1]);
                }

                if adjacent_points.iter().all(|p| *p > point) {
                    low_points.push(Point::new(col as u32, row as u32, point));
                }
            }
        }

        low_points
    }
}

fn load_input() -> Heightmap {
    let input = read_to_string("input/day9.txt").expect("Failed to read input");

    Heightmap::from(&input)
}

fn part_1(input: &Heightmap) {
    let low_points = input.find_low_points();

    println!(
        "Low points sum: {}",
        low_points.iter().map(|p| (p.value + 1) as u32).sum::<u32>()
    );
}

pub fn main() {
    let input = load_input();

    part_1(&input)
}
