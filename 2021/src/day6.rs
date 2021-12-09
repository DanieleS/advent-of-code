use std::fs::read_to_string;

type Fishes = [u64; 9];

fn load_input() -> Fishes {
    let input = read_to_string("input/day6.txt").expect("Failed to read input");

    let mut fishes = [0; 9];

    for n in input.split(",") {
        fishes[n.parse::<usize>().expect("Invalid input")] += 1;
    }

    fishes
}

fn simulate_fishes(fishes: Fishes, days: usize) -> u64 {
    let mut fishes = fishes.clone();
    for _ in 0..days {
        fishes.rotate_left(1);
        fishes[6] += fishes[8];
    }
    fishes.iter().sum()
}

fn part_1(input: Fishes) {
    let result = simulate_fishes(input, 80);

    println!("Part 1: {}", result);
}

fn part_2(input: Fishes) {
    let result = simulate_fishes(input, 256);

    println!("Part 2: {}", result);
}

pub fn main() {
    let input = load_input();

    part_1(input.clone());
    part_2(input.clone());
}
