use std::fs::read_to_string;

use regex::Regex;

enum InstructionCheckStatus {
    Valid,
    Incomplete(Vec<char>),
    Invalid(char),
}

fn load_input() -> Vec<InstructionCheckStatus> {
    let input = read_to_string("input/day10.txt").expect("Failed to read input");

    input
        .lines()
        .map(|line| line.to_string())
        .map(analyze_instruction)
        .collect()
}

fn analyze_instruction(instruction: String) -> InstructionCheckStatus {
    let mut instruction = String::from(instruction);

    let bracket_regex = Regex::new(r"(\(\)|\[\]|\{\}|<>)").unwrap();
    let closing_bracket_regex = Regex::new(r"(\)|\]|\}|>)").unwrap();

    let mut simplified = true;

    while simplified {
        simplified = false;

        if bracket_regex.is_match(&instruction) {
            simplified = true;
            instruction = bracket_regex.replace_all(&instruction, "").to_string();
        }
    }

    if instruction.len() == 0 {
        InstructionCheckStatus::Valid
    } else if closing_bracket_regex.is_match(&instruction) {
        let first_invalid_character = closing_bracket_regex.find(&instruction).unwrap().as_str();
        InstructionCheckStatus::Invalid(first_invalid_character.chars().next().unwrap())
    } else {
        let missing: Vec<char> = instruction
            .chars()
            .map(|c| match c {
                '(' => ')',
                '[' => ']',
                '{' => '}',
                '<' => '>',
                _ => panic!("Unexpected character: {}", c),
            })
            .rev()
            .collect();
        InstructionCheckStatus::Incomplete(missing)
    }
}

fn part_1(input: &Vec<InstructionCheckStatus>) {
    let invalid_instructions: Vec<&char> = input
        .iter()
        .filter_map(|status| match status {
            InstructionCheckStatus::Invalid(c) => Some(c),
            _ => None,
        })
        .collect();

    let syntax_points: i32 = invalid_instructions
        .iter()
        .map(|c| match c {
            ')' => 3,
            ']' => 57,
            '}' => 1197,
            '>' => 25137,
            _ => 0,
        })
        .sum();

    println!("Syntax error points: {}", syntax_points);
}

fn part_2(input: &Vec<InstructionCheckStatus>) {
    let missing_chars: Vec<&Vec<char>> = input
        .iter()
        .filter_map(|status| match status {
            InstructionCheckStatus::Incomplete(missing) => Some(missing),
            _ => None,
        })
        .collect();

    let mut missing_chars_points: Vec<u64> = missing_chars
        .iter()
        .map(|missing| {
            missing.iter().fold(0, |acc, c| {
                acc * 5
                    + match c {
                        ')' => 1,
                        ']' => 2,
                        '}' => 3,
                        '>' => 4,
                        _ => 0,
                    }
            })
        })
        .collect();

    missing_chars_points.sort();

    println!("Missing chars points: {:?}", missing_chars_points);
    println!(
        "Middle chars points: {:?}",
        missing_chars_points[missing_chars_points.len() / 2]
    );
}

pub fn main() {
    let input = load_input();

    part_1(&input);
    part_2(&input);
}
