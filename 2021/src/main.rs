mod day1;
mod day2;
mod day3;
mod day4;
mod day5;
mod day6;
mod day7;
mod day8;
mod day9;

use dialoguer::Select;

fn main() -> std::io::Result<()> {
    let days = [
        day1::main,
        day2::main,
        day3::main,
        day4::main,
        day5::main,
        day6::main,
        day7::main,
        day8::main,
        day9::main,
    ];

    let options: Vec<String> = days
        .iter()
        .enumerate()
        .map(|(i, _)| format!("Day {}", i + 1))
        .collect();

    println!("Select the day to be executed:");

    let selection = Select::new().items(&options).default(0).interact()?;

    days[selection]();

    Ok(())
}
