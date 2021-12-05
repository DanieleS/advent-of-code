use std::fs::read_to_string;

#[derive(Clone, Debug)]
struct Cell {
    value: i8,
    checked: bool,
}

impl Cell {
    fn new(value: i8) -> Cell {
        Cell {
            value,
            checked: false,
        }
    }
}

#[derive(Clone)]
struct Board {
    rows: Vec<Vec<Cell>>,
}

fn check_rows_winning(board: &Board) -> bool {
    board.rows.iter().fold(false, |acc, row| {
        acc || row.iter().fold(true, |acc, cell| acc && cell.checked)
    })
}
fn check_columns_winning(board: &Board) -> bool {
    let mut winning = false;
    for n in 0..board.rows[0].len() {
        let mut w = true;

        for r in board.rows.iter() {
            w = w && r[n].checked
        }

        if w {
            winning = true
        }
    }

    winning
}

impl Board {
    fn is_winning(self: &Self) -> bool {
        let row_is_winning = check_rows_winning(self);
        let column_is_winning = check_columns_winning(self);

        row_is_winning || column_is_winning
    }

    fn sum_unckecked(self: &Self) -> i32 {
        self.rows.iter().fold(0, |acc, row| {
            acc + row.iter().fold(0, |acc, cell| {
                if !cell.checked {
                    acc + cell.value as i32
                } else {
                    acc
                }
            })
        })
    }

    fn check_cell(self: &mut Self, value: i8) {
        for row in self.rows.iter_mut() {
            for cell in row {
                if cell.value == value {
                    cell.checked = true
                }
            }
        }
    }
}

#[derive(Clone)]
struct Input {
    draws: Vec<i8>,
    boards: Vec<Board>,
}

fn parse_draws(input: &Vec<&str>) -> Vec<i8> {
    let draws_line = input[0];

    draws_line
        .split(",")
        .map(|n| n.parse::<i8>().unwrap())
        .collect()
}

fn parse_board(input: &[&str]) -> Board {
    let rows: Vec<Vec<Cell>> = input
        .iter()
        .map(|line| {
            line.split_whitespace()
                .map(|n| n.parse::<i8>().unwrap())
                .map(Cell::new)
                .collect()
        })
        .collect();

    Board { rows }
}

fn parse_boards(input: &Vec<&str>) -> Vec<Board> {
    let mut board_start_index = 2; // First board start at line 3

    let mut boards: Vec<Board> = Vec::new();

    while board_start_index < input.len() {
        boards.push(parse_board(
            &input[board_start_index..board_start_index + 5],
        ));

        board_start_index += 6;
    }

    boards
}

fn parse_input() -> Input {
    let input = read_to_string("input/day4.txt").expect("Failed to read input");

    let lines = input.lines().collect();
    let draws = parse_draws(&lines);
    let boards = parse_boards(&lines);

    Input { draws, boards }
}

fn get_winning_board(boards: &Vec<Board>) -> Option<&Board> {
    boards.iter().find(|board| board.is_winning())
}

fn part_1(mut input: Input) {
    let mut current_draw = 0;
    let mut last_draw: i8 = 0;
    while get_winning_board(&input.boards).is_none() && current_draw < input.draws.len() {
        last_draw = input.draws[current_draw];

        for b in input.boards.iter_mut() {
            b.check_cell(last_draw);
        }

        current_draw += 1
    }

    if let Some(winning_board) = get_winning_board(&input.boards) {
        println!(
            "Winning board unchecked cells sum: {}",
            winning_board.sum_unckecked()
        );
        println!("Last number drawn: {}", last_draw);
        println!(
            "Winning board score: {}",
            winning_board.sum_unckecked() * last_draw as i32
        )
    }
}

pub fn main() {
    let input = parse_input();

    part_1(input.clone());
}
