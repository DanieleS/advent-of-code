use std::fs::read_to_string;

type ReportRow = Vec<bool>;

fn load_input() -> Vec<ReportRow> {
    let input = read_to_string("input/day3.txt").expect("Failed to read input");
    let output: Vec<ReportRow> = input.lines().map(parse_row).collect();

    output
}

fn parse_row(row: &str) -> ReportRow {
    let row_items: Vec<char> = row.chars().collect();

    row_items.iter().map(|&b| b == '0').collect()
}

fn get_counters(input: &Vec<ReportRow>) -> Vec<usize> {
    let mut counters: Vec<usize> = Vec::new();

    for n in 0..input[0].len() {
        let mut sum = 0;
        for b in input {
            if b[n] {
                sum += 1;
            }
        }

        counters.push(sum);
    }

    counters
}

fn counters_to_rate(counters: &Vec<usize>, condition: impl Fn(&usize) -> bool) -> isize {
    let rate_strings: Vec<&str> = counters
        .iter()
        .map(|n| if condition(n) { "1" } else { "0" })
        .collect();

    isize::from_str_radix(&rate_strings.join(""), 2).unwrap()
}

fn part_1(input: &Vec<ReportRow>) {
    println!("Part 1");
    let counters = get_counters(input);
    let gamma_rate = counters_to_rate(&counters, |n| *n > input.len() / 2);
    let epsilon_rate = counters_to_rate(&counters, |n| *n < input.len() / 2);
    println!("Gamma rate: {}", gamma_rate);
    println!("Epsilon rate: {}", epsilon_rate);

    println!("Gamma x Epsilon: {}", gamma_rate * epsilon_rate);
}

pub fn main() {
    let input = load_input();

    part_1(&input);
}
