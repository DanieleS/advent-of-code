use std::fs::read_to_string;

#[derive(Debug)]
enum Command {
    FORWARD(i32),
    DOWN(i32),
    UP(i32),
}

fn load_input() -> Vec<Command> {
    let input = read_to_string("input/day2.txt").expect("Failed to read input");
    let output: Vec<Command> = input.lines().map(parse_row).collect();

    output
}

fn parse_direction(direction: &str, units: i32) -> Command {
    match direction {
        "forward" => Command::FORWARD(units),
        "down" => Command::DOWN(units),
        _ => Command::UP(units),
    }
}

fn parse_row(row: &str) -> Command {
    let row_items: Vec<&str> = row.split_whitespace().collect();

    let units: i32 = row_items[1].parse().unwrap();
    parse_direction(row_items[0], units)
}

fn part_1(input: &Vec<Command>) {
    let mut position = 0;
    let mut depth = 0;

    for command in input {
        match command {
            Command::FORWARD(unit) => position += unit,
            Command::UP(unit) => depth -= unit,
            Command::DOWN(unit) => depth += unit,
        }
    }

    println!("Part 1");

    println!("Position is {}", position);
    println!("Depth is {}", depth);

    println!("Product is {}", position * depth);
}

fn part_2(input: &Vec<Command>) {
    let mut position = 0;
    let mut depth = 0;
    let mut aim = 0;

    for command in input {
        match command {
            Command::FORWARD(unit) => {
                position += unit;
                depth += aim * unit;
            }
            Command::UP(unit) => aim -= unit,
            Command::DOWN(unit) => aim += unit,
        }
    }

    println!("Part 2");

    println!("Position is {}", position);
    println!("Depth is {}", depth);
    println!("Aim is {}", aim);

    println!("Product is {}", position * depth);
}

pub fn main() {
    let input = load_input();

    part_1(&input);
    part_2(&input);
}
