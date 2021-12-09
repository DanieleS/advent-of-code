use std::{
    collections::HashSet,
    fmt::{Display, Error, Formatter},
    fs::read_to_string,
};

struct SevenSegmentsDisplay {
    t: char,
    b: char,
    m: char,
    tl: char,
    tr: char,
    bl: char,
    br: char,
}

impl Display for SevenSegmentsDisplay {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        write!(f, "\n")?;
        write!(f, " {}{}{}{} \n", self.t, self.t, self.t, self.t)?;
        write!(f, "{}    {}\n", self.tl, self.tr)?;
        write!(f, "{}    {}\n", self.tl, self.tr)?;
        write!(f, " {}{}{}{} \n", self.m, self.m, self.m, self.m)?;
        write!(f, "{}    {}\n", self.bl, self.br)?;
        write!(f, "{}    {}\n", self.bl, self.br)?;
        write!(f, " {}{}{}{} \n", self.b, self.b, self.b, self.b)?;
        write!(f, "\n")?;
        Ok(())
    }
}

struct DisplayToDigit {
    digit: char,
    display: HashSet<char>,
}

impl SevenSegmentsDisplay {
    fn deduce(digits: &Vec<String>) -> SevenSegmentsDisplay {
        let one = str_to_set(digits.iter().find(|x| x.len() == 2).unwrap());
        let seven = str_to_set(digits.iter().find(|x| x.len() == 3).unwrap());
        let four = str_to_set(digits.iter().find(|x| x.len() == 4).unwrap());
        let eight = str_to_set(digits.iter().find(|x| x.len() == 7).unwrap());

        let five_segments = digits
            .iter()
            .filter(|x| x.len() == 5)
            .map(|n| str_to_set(n))
            .collect::<Vec<_>>();
        let six_segments = digits
            .iter()
            .filter(|x| x.len() == 6)
            .map(|n| str_to_set(n))
            .collect::<Vec<_>>();

        let mut temp = six_segments.clone();
        temp.push(one.clone());

        let br = temp
            .iter()
            .fold(eight.clone(), |acc, x| {
                acc.intersection(x).cloned().collect::<HashSet<_>>()
            })
            .into_iter()
            .next()
            .unwrap();

        let tr = {
            let mut one = one.clone();
            one.remove(&br);
            one.iter().next().unwrap().clone()
        };

        let t = seven
            .clone()
            .difference(&one)
            .cloned()
            .into_iter()
            .next()
            .unwrap();

        let mut temp = five_segments.clone();
        temp.push(four.clone());

        let m = temp
            .iter()
            .fold(eight.clone(), |acc, x| {
                acc.intersection(x).cloned().collect::<HashSet<_>>()
            })
            .into_iter()
            .next()
            .unwrap();

        let tl = {
            let mut four = four.clone();
            four.remove(&m);
            four.remove(&tr);
            four.remove(&br);
            four.iter().next().unwrap().clone()
        };

        let b = {
            let mut five_intersec = five_segments.iter().fold(eight.clone(), |acc, x| {
                acc.intersection(x).cloned().collect::<HashSet<_>>()
            });

            five_intersec.remove(&t);
            five_intersec.remove(&m);

            five_intersec.iter().next().unwrap().clone()
        };

        let bl = {
            let mut eight = eight.clone();
            eight.remove(&t);
            eight.remove(&tl);
            eight.remove(&tr);
            eight.remove(&m);
            eight.remove(&b);
            eight.remove(&br);

            eight.iter().next().unwrap().clone()
        };

        SevenSegmentsDisplay {
            t,
            b,
            m,
            tl,
            tr,
            bl,
            br,
        }
    }

    fn display(&self, value: &[char]) -> char {
        let zero = vec![self.t, self.tr, self.br, self.b, self.bl, self.tl];
        let one = vec![self.tr, self.br];
        let two = vec![self.t, self.tr, self.m, self.bl, self.b];
        let three = vec![self.t, self.tr, self.m, self.br, self.b];
        let four = vec![self.tr, self.m, self.tl, self.br];
        let five = vec![self.t, self.tl, self.m, self.br, self.b];
        let six = vec![self.t, self.tl, self.m, self.br, self.bl, self.b];
        let seven = vec![self.t, self.tr, self.br];
        let eight = vec![self.t, self.tr, self.br, self.b, self.bl, self.tl, self.m];
        let nine = vec![self.t, self.tr, self.tl, self.m, self.br, self.b];

        let numbers: Vec<DisplayToDigit> =
            [zero, one, two, three, four, five, six, seven, eight, nine]
                .iter()
                .enumerate()
                .map(|(i, n)| DisplayToDigit {
                    digit: i.to_string().chars().next().unwrap(),
                    display: n.iter().cloned().collect(),
                })
                .collect();

        numbers
            .iter()
            .find(|x| {
                x.display.len() == value.len()
                    && x.display
                        .difference(&value.iter().cloned().collect())
                        .count()
                        == 0
            })
            .unwrap()
            .digit
    }
}

fn str_to_set(str: &str) -> HashSet<char> {
    str.chars().collect::<HashSet<_>>()
}

struct InputRow {
    schemas: Vec<String>,
    values: Vec<String>,
}

fn load_input() -> Vec<InputRow> {
    let input = read_to_string("input/day8.txt").expect("Failed to read input");

    input.lines().map(parse_line).collect()
}

fn parse_line(line: &str) -> InputRow {
    let line_blocks = line.split("|").collect::<Vec<_>>();

    let schemas = line_blocks[0]
        .split_whitespace()
        .map(String::from)
        .collect::<Vec<_>>();
    let values = line_blocks[1]
        .split_whitespace()
        .map(String::from)
        .collect::<Vec<_>>();

    InputRow { schemas, values }
}

fn part_1(input: &Vec<InputRow>) {
    let total_digits = input.iter().fold(0, |acc, row| {
        row.values
            .iter()
            .filter(|n| n.len() == 2 || n.len() == 3 || n.len() == 4 || n.len() == 7)
            .count()
            + acc
    });

    println!("1, 4, 7, 8 digits count: {}", total_digits);
}

fn part_2(input: &Vec<InputRow>) {
    let mut sum = 0;

    for row in input {
        let display = SevenSegmentsDisplay::deduce(&row.schemas);

        let digits = row
            .values
            .iter()
            .map(|n| display.display(n.chars().collect::<Vec<_>>().as_slice()))
            .collect::<Vec<_>>();

        let result = digits
            .iter()
            .fold(String::new(), |acc, x| acc + &x.to_string())
            .parse::<i32>()
            .unwrap();

        sum += result;
    }

    println!("Sum: {}", sum);
}

pub fn main() {
    let input = load_input();

    part_1(&input);
    part_2(&input);
}
