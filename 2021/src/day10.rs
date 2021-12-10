use std::fs::read_to_string;

use regex::Regex;

enum InstructionCheckStatus {
    Valid,
    Incomplete,
    Invalid(char),
}

fn load_input() -> Vec<String> {
    let input = read_to_string("input/day10.txt").expect("Failed to read input");

    input.lines().map(|line| line.to_string()).collect()
}

fn simplify_instruction(instruction: &str) -> InstructionCheckStatus {
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
        InstructionCheckStatus::Incomplete
    }
}

fn part_1(input: &Vec<String>) {
    let invalid_instructions: Vec<char> = input
        .iter()
        .map(|line| simplify_instruction(line))
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

pub fn main() {
    let input = load_input();

    part_1(&input);
}
