use std::{collections::HashSet, fs::read_to_string};

#[derive(Debug)]
struct Cell {
    value: u8,
    visited: bool,
}

#[derive(Debug, PartialEq, Eq, Hash, Clone)]
struct Point {
    x: usize,
    y: usize,
    value: u8,
}

impl Point {
    fn new(x: usize, y: usize, value: u8) -> Point {
        Point { x, y, value }
    }
}

#[derive(Debug, Clone)]
struct Basin {
    data: Vec<u8>,
}

impl Basin {
    fn size(&self) -> usize {
        self.data.len()
    }

    fn from_point(point: &Point, grid: &mut Vec<Vec<Cell>>) -> Self {
        let mut basin_points: HashSet<Point> = HashSet::new();
        basin_points.insert(point.clone());

        grid[point.y][point.x].visited = true;

        let mut expanded = true;

        while expanded {
            let mut new_points: HashSet<Point> = HashSet::new();
            expanded = false;
            for point in basin_points.iter() {
                let x = point.x;
                let y = point.y;

                if x > 0 && grid[y][x - 1].value < 9 && !grid[y][x - 1].visited {
                    grid[y][x - 1].visited = true;
                    new_points.insert(Point::new(x - 1, y, grid[y][x - 1].value));
                    expanded = true;
                }

                if y > 0 && grid[y - 1][x].value < 9 && !grid[y - 1][x].visited {
                    grid[y - 1][x].visited = true;
                    new_points.insert(Point::new(x, y - 1, grid[y - 1][x].value));
                    expanded = true;
                }

                if x < grid[0].len() - 1 && grid[y][x + 1].value < 9 && !grid[y][x + 1].visited {
                    grid[y][x + 1].visited = true;
                    new_points.insert(Point::new(x + 1, y, grid[y][x + 1].value));
                    expanded = true;
                }
                if y < grid.len() - 1 && grid[y + 1][x].value < 9 && !grid[y + 1][x].visited {
                    grid[y + 1][x].visited = true;
                    new_points.insert(Point::new(x, y + 1, grid[y + 1][x].value));
                    expanded = true;
                }
            }
            basin_points = basin_points.union(&mut new_points).cloned().collect();
        }

        Self {
            data: basin_points.iter().map(|p| p.value).collect(),
        }
    }
}

impl PartialEq for Basin {
    fn eq(&self, other: &Basin) -> bool {
        self.size() == other.size()
    }
}

impl Eq for Basin {}

impl PartialOrd for Basin {
    fn partial_cmp(&self, other: &Basin) -> Option<std::cmp::Ordering> {
        if self.size() < other.size() {
            Some(std::cmp::Ordering::Less)
        } else if self.size() > other.size() {
            Some(std::cmp::Ordering::Greater)
        } else {
            Some(std::cmp::Ordering::Equal)
        }
    }
}

impl Ord for Basin {
    fn cmp(&self, other: &Basin) -> std::cmp::Ordering {
        self.partial_cmp(other).unwrap()
    }
}

struct Heightmap {
    data: Vec<Vec<u8>>,
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
                    low_points.push(Point::new(col, row, point));
                }
            }
        }

        low_points
    }

    fn to_cell_grid(&self) -> Vec<Vec<Cell>> {
        let mut grid: Vec<Vec<Cell>> = vec![];

        for row in 0..self.data.len() {
            let mut row_vec: Vec<Cell> = vec![];

            for col in 0..self.data[row].len() {
                row_vec.push(Cell {
                    value: self.data[row][col],
                    visited: false,
                });
            }

            grid.push(row_vec);
        }

        grid
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

fn part_2(input: &Heightmap) {
    let low_points = input.find_low_points();

    let mut basins = low_points
        .iter()
        .map(|p| Basin::from_point(p, &mut input.to_cell_grid()))
        .collect::<Vec<Basin>>();

    basins.sort();

    let rev_basin: Vec<&Basin> = basins.iter().rev().collect();

    let top_3_basin = [rev_basin[0], rev_basin[1], rev_basin[2]];

    println!(
        "Top 3 basins sizes: {:?}",
        top_3_basin.iter().map(|b| b.size()).collect::<Vec<usize>>()
    );
    println!(
        "Top 3 basins sum: {}",
        top_3_basin
            .iter()
            .map(|b| b.size())
            .fold(1, |acc, x| acc * x)
    );
}

pub fn main() {
    let input = load_input();

    part_1(&input);
    part_2(&input);
}
