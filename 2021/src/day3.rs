use std::fs::read_to_string;

type ReportRow = Vec<bool>;

fn load_input() -> Vec<ReportRow> {
    let input = read_to_string("input/day3.txt").expect("Failed to read input");
    let output: Vec<ReportRow> = input.lines().map(parse_row).collect();

    output
}

fn parse_row(row: &str) -> ReportRow {
    let row_items: Vec<char> = row.chars().collect();

    row_items.iter().map(|&b| b == '1').collect()
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

fn vector_to_number(input: &Vec<bool>) -> i32 {
    let char_input: Vec<&str> = input.iter().map(|n| if *n { "1" } else { "0" }).collect();

    i32::from_str_radix(&char_input.join(""), 2).unwrap()
}

fn counters_to_rate(counters: &Vec<usize>, condition: impl Fn(&usize) -> bool) -> i32 {
    let rate_strings: Vec<bool> = counters.iter().map(|n| condition(n)).collect();

    vector_to_number(&rate_strings)
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

fn most_common_digit(input: &Vec<ReportRow>, column: usize) -> bool {
    let counter: usize = input
        .iter()
        .fold(0, |acc, row| if row[column] { acc + 1 } else { acc });

    let result = if counter == input.len() || counter == 0 {
        input[0][column]
    } else if counter as f32 == (input.len() as f32 / 2 as f32) {
        true
    } else {
        (counter as f32) > input.len() as f32 / 2 as f32
    };

    result
}

fn least_common_digit(input: &Vec<ReportRow>, column: usize) -> bool {
    let counter: usize = input
        .iter()
        .fold(0, |acc, row| if row[column] { acc + 1 } else { acc });

    let result = if counter == input.len() || counter == 0 {
        input[0][column]
    } else if counter as f32 == (input.len() as f32 / 2 as f32) {
        false
    } else {
        (counter as f32) < input.len() as f32 / 2 as f32
    };

    result
}

fn find_value_from_report(input: &Vec<ReportRow>, most_common: bool) -> i32 {
    let mut input: Vec<ReportRow> = input.clone();

    let digits_len = input[0].len();

    let common_digit_fn = if most_common {
        most_common_digit
    } else {
        least_common_digit
    };

    for n in 0..digits_len {
        if input.len() > 1 {
            let common = common_digit_fn(&input, n);
            input = input
                .iter()
                .filter(|row| row[n] == common)
                .cloned()
                .collect();
        }
    }

    vector_to_number(&input[0])
}

fn part_2(input: &Vec<ReportRow>) {
    println!("Part 2");

    let oxygen_generator = find_value_from_report(input, true);
    let co2_scrubber = find_value_from_report(input, false);

    println!("Oxygen generator rating: {}", oxygen_generator);
    println!("CO2 scrubber rating: {}", co2_scrubber);

    println!("Life support rating: {}", oxygen_generator * co2_scrubber);
}

pub fn main() {
    let input = load_input();

    part_1(&input);
    part_2(&input);
}
