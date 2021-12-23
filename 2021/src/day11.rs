use std::fs::read_to_string;

use super::utils::grid::Grid;

fn load_input() -> Grid<u8> {
    let input = read_to_string("input/day11.txt").expect("Failed to read input");

    Grid::from_input_chars(&input, |c| c.to_digit(10).unwrap() as u8)
}

fn step(grid: &mut Grid<u8>, queue: &mut Vec<(usize, usize)>) -> usize {
    for (x, y) in itertools::iproduct!(0..grid.w(), 0..grid.h()) {
        queue.push((x, y));
        while let Some((x, y)) = queue.pop() {
            if grid[(x, y)] == 9 {
                queue.extend(grid.square_neighbours((x, y)));
            }
            grid[(x, y)] += 1;
        }
    }

    // println!("{}", grid);

    grid.data
        .iter_mut()
        .filter(|v| **v > 9)
        .map(|cell| *cell = 0)
        .count()
}

fn part_1(grid: &Grid<u8>) {
    let mut grid = grid.clone();
    let mut queue = Vec::new();

    let sum: usize = (0..100).map(|_| step(&mut grid, &mut queue)).sum();

    println!("Sum: {}", sum);
}

fn part_2(grid: &Grid<u8>) {
    let mut grid = grid.clone();
    let mut queue = Vec::new();

    let mut step_number = 1;

    let first_flash: usize = loop {
        if step(&mut grid, &mut queue) == 100 {
            break step_number;
        }

        step_number += 1;
    };

    println!("Step: {}", first_flash);
}

pub fn main() {
    let input = load_input();

    part_1(&input);
    part_2(&input);
}
