use std::fs::read_to_string;

fn load_input() -> Vec<i32> {
    let input = read_to_string("input/day7.txt").expect("Failed to read input");

    input
        .split(",")
        .map(|x| x.parse::<i32>().unwrap())
        .collect()
}

fn median(nums: &Vec<i32>) -> i32 {
    let mut nums = nums.clone();
    nums.sort();
    let len = nums.len();
    nums[len / 2]
}

fn mean(nums: &Vec<i32>) -> i32 {
    nums.iter().sum::<i32>() / nums.len() as i32
}

fn compute_total_distance(nums: &Vec<i32>, to: i32, cost_fn: impl Fn(i32) -> i32) -> i32 {
    nums.iter().fold(0, |acc, x| acc + cost_fn((x - to).abs()))
}

fn part_1(input: &Vec<i32>) {
    let median = median(input);
    let distance = compute_total_distance(input, median, |n| n);

    println!("Median: {}", median);
    println!("Distance: {}", distance);
}

fn part_2(input: &Vec<i32>) {
    let mean = mean(input);
    let distance = compute_total_distance(input, mean, |n| n * (n + 1) / 2);

    println!("Mean: {}", mean);
    println!("Distance: {}", distance);
}

pub fn main() {
    let input = load_input();

    part_1(&input);
    part_2(&input);
}
