use std::fs::read_to_string;

pub fn load_input() -> Vec<i32> {
    let input = read_to_string("input/day1.txt").expect("Failed to read input");
    input
        .lines()
        .map(|line| line.parse::<i32>().unwrap())
        .collect()
}

pub fn calculate_increases(input: &Vec<i32>) -> i32 {
    let mut increases = 0;
    let mut last_depth = i32::MAX;
    for depth in input {
        if depth > &last_depth {
            increases += 1;
        }

        last_depth = depth.clone();
    }

    increases
}

pub fn main() {
    let input = load_input();

    println!("Part 1: {}", calculate_increases(&input));

    let windowed_input: Vec<i32> = input
        .windows(3)
        .map(|window| window.iter().sum::<i32>())
        .collect();

    println!("Part 2: {}", calculate_increases(&windowed_input));
}
