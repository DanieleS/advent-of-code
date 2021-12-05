use regex::Regex;
use std::{collections::HashSet, fmt::Display, fs::read_to_string};

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
struct Point {
    x: i32,
    y: i32,
}

impl Display for Point {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_fmt(format_args!("({}, {})", self.x, self.y))
    }
}

fn series(from: i32, to: i32) -> Vec<i32> {
    if from == to {
        Vec::new()
    } else {
        if from < to {
            (from..=to).collect()
        } else {
            (to..=from).rev().collect()
        }
    }
}

#[derive(Debug)]
struct Line {
    from: Point,
    to: Point,
}

impl Line {
    fn from_string(input: &str) -> Line {
        let line_regex =
            Regex::new(r"(?P<fromx>\d+),(?P<fromy>\d+) -> (?P<tox>\d+),(?P<toy>\d+)").unwrap();

        let groups = line_regex.captures(input).unwrap();

        let from = Point {
            x: groups["fromx"].parse().unwrap(),
            y: groups["fromy"].parse().unwrap(),
        };

        let to = Point {
            x: groups["tox"].parse().unwrap(),
            y: groups["toy"].parse().unwrap(),
        };

        Line { from, to }
    }

    fn is_horizontal_vertical(&self) -> bool {
        self.from.x == self.to.x || self.from.y == self.to.y
    }

    fn points(&self) -> Vec<Point> {
        let series_x = series(self.from.x, self.to.x);
        let series_y = series(self.from.y, self.to.y);

        let points = if self.is_horizontal_vertical() {
            if series_x.len() > series_y.len() {
                series_x
                    .iter()
                    .map(|x| Point {
                        x: *x,
                        y: self.from.y,
                    })
                    .collect()
            } else {
                series_y
                    .iter()
                    .map(|y| Point {
                        y: *y,
                        x: self.from.x,
                    })
                    .collect()
            }
        } else {
            series_x
                .iter()
                .zip(series_y)
                .map(|(x, y)| Point { x: *x, y })
                .collect()
        };

        points
    }
}

impl Display for Line {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_fmt(format_args!("{} -> {}", self.from, self.to))
    }
}

#[derive(Debug)]
struct Board {
    rows: Vec<Vec<i32>>,
    overlapping_points: HashSet<Point>,
}

impl Board {
    fn new(width: i32, height: i32) -> Board {
        let row = vec![0; (width + 1) as usize];

        let mut rows: Vec<Vec<i32>> = Vec::new();
        for _ in 0..(height + 1) {
            rows.push(row.clone())
        }

        Board {
            rows,
            overlapping_points: HashSet::new(),
        }
    }

    fn increment(&mut self, point: Point) {
        let Point { x, y } = point;

        self.rows[y as usize][x as usize] += 1;

        if self.rows[y as usize][x as usize] > 1 {
            self.overlapping_points.insert(point.clone());
        }
    }

    fn draw_line(&mut self, line: &Line) {
        let line_points = line.points();

        for point in line_points {
            self.increment(point)
        }
    }
}

impl Display for Board {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        for row in self.rows.iter() {
            let row_str: Vec<String> = row
                .iter()
                .map(|n| {
                    if *n == 0 {
                        String::from(".")
                    } else {
                        n.to_string()
                    }
                })
                .collect();
            f.write_fmt(format_args!("{}\n", row_str.join(""))).unwrap();
        }

        Ok(())
    }
}

fn parse_input() -> Vec<Line> {
    let input = read_to_string("input/day5.txt").expect("Failed to read input");

    input.lines().map(Line::from_string).collect()
}

fn create_booard_from_lines(lines: &Vec<&Line>) -> Board {
    let mut max_x = 0;
    let mut max_y = 0;

    for line in lines {
        if line.from.x > max_x {
            max_x = line.from.x;
        }
        if line.to.x > max_x {
            max_x = line.to.x;
        }
        if line.from.y > max_y {
            max_y = line.from.y;
        }
        if line.to.y > max_y {
            max_y = line.to.y;
        }
    }

    Board::new(max_x, max_y)
}

fn part_1(input: &Vec<Line>) {
    let lines: Vec<&Line> = input
        .iter()
        .filter(|line| line.is_horizontal_vertical())
        .collect();

    let mut board = create_booard_from_lines(&lines);

    for line in lines {
        board.draw_line(line)
    }

    println!(
        "Lines overlaps in {} points",
        board.overlapping_points.len()
    );
}

fn part_2(input: &Vec<Line>) {
    let lines: Vec<&Line> = input.iter().collect();

    let mut board = create_booard_from_lines(&lines);

    for line in lines {
        board.draw_line(line)
    }

    println!(
        "Lines (straight & diagonal) overlaps in {} points",
        board.overlapping_points.len()
    );
}

pub fn main() {
    let input = parse_input();

    part_1(&input);
    part_2(&input);
}
