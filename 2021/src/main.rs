mod day1;
mod day2;
mod day3;

use dialoguer::Select;

fn main() -> std::io::Result<()> {
    let days = [day1::main, day2::main, day3::main];

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
