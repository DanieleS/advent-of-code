use std::fs::read_to_string;

pub fn main() {
    let input = read_to_string("./input/day1.txt").unwrap();
    let mut increases = 0;
    let mut last_depth = i32::MAX;
    for line in input.lines() {
        let depth = line.parse::<i32>().unwrap();
        if depth > last_depth {
            increases += 1;
        }

        last_depth = depth;
    }

    println!("increases: {}", increases);
}
