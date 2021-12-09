use std::fs::read_to_string;

struct InputRow {
    schemas: Vec<String>,
    values: Vec<String>,
}

fn load_input() -> Vec<InputRow> {
    let input = read_to_string("input/day8.txt").expect("Failed to read input");

    input.lines().map(parse_line).collect()
}

fn parse_line(line: &str) -> InputRow {
    let line_blocks = line.split("|").collect::<Vec<_>>();

    let schemas = line_blocks[0]
        .split_whitespace()
        .map(String::from)
        .collect::<Vec<_>>();
    let values = line_blocks[1]
        .split_whitespace()
        .map(String::from)
        .collect::<Vec<_>>();

    InputRow { schemas, values }
}

fn part_1(input: &Vec<InputRow>) {
    let total_digits = input.iter().fold(0, |acc, row| {
        row.values
            .iter()
            .filter(|n| n.len() == 2 || n.len() == 3 || n.len() == 4 || n.len() == 7)
            .count()
            + acc
    });

    println!("1, 4, 7, 8 digits count: {}", total_digits);
}

pub fn main() {
    let input = load_input();

    part_1(&input);
}
