use std::fs::read_to_string;

#[derive(Debug, Clone)]
struct Lanternfish {
    timer: i8,
}

impl Lanternfish {
    fn new(timer: i8) -> Lanternfish {
        Lanternfish { timer }
    }

    fn next(&mut self) -> Option<Lanternfish> {
        self.timer -= 1;

        if self.timer == -1 {
            self.timer = 6;
            Some(Lanternfish::new(8))
        } else {
            None
        }
    }
}

fn load_input() -> Vec<Lanternfish> {
    let input = read_to_string("input/day6.txt").expect("Failed to read input");

    input
        .split(",")
        .map(|n| n.parse::<i8>().unwrap())
        .map(Lanternfish::new)
        .collect()
}

fn part_1(input: Vec<Lanternfish>) {
    let mut pool = input;

    for _ in 0..80 {
        let mut new_fishes: Vec<Lanternfish> = pool.iter_mut().filter_map(|f| f.next()).collect();

        pool.append(&mut new_fishes);
    }

    println!("Pool size: {}", pool.len());
}

pub fn main() {
    let input = load_input();

    part_1(input.clone());
}
