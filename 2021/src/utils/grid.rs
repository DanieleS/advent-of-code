#[derive(Clone, Debug)]
pub struct Grid<T> {
    width: usize,
    pub data: Vec<T>,
}

type Point = (usize, usize);

impl<T> Grid<T> {
    pub fn from_input_chars(input: &str, f: impl Fn(char) -> T) -> Self {
        let width = input.lines().next().unwrap().len();
        let data: Vec<_> = input.lines().flat_map(|line| line.chars()).map(f).collect();

        Self { width, data }
    }

    pub fn w(&self) -> usize {
        self.width
    }

    pub fn h(&self) -> usize {
        self.data.len() / self.width
    }

    pub fn get(&self, (x, y): Point) -> Option<&T> {
        if x >= self.width {
            None
        } else {
            self.data.get(y * self.width + x)
        }
    }

    pub fn get_mut(&mut self, (x, y): Point) -> Option<&mut T> {
        if x >= self.width {
            None
        } else {
            self.data.get_mut(y * self.width + x)
        }
    }

    #[allow(dead_code)]
    pub fn plus_neighbours(&self, (x, y): Point) -> impl Iterator<Item = Point> {
        let iter = [(0, -1), (-1, 0), (1, 0), (0, 1)]
            .iter()
            .map(move |(dx, dy)| (x as isize + dx, y as isize + dy));
        self.ifilter_in_bounds(iter)
    }

    pub fn square_neighbours(&self, (x, y): Point) -> impl Iterator<Item = Point> {
        let iter = [
            (-1, -1),
            (0, -1),
            (1, -1),
            (-1, 0),
            (1, 0),
            (-1, 1),
            (0, 1),
            (1, 1),
        ]
        .iter()
        .map(move |(dx, dy)| (x as isize + dx, y as isize + dy));
        self.ifilter_in_bounds(iter)
    }

    pub fn ifilter_in_bounds(
        &self,
        iter: impl Iterator<Item = (isize, isize)>,
    ) -> impl Iterator<Item = Point> {
        let (width, height) = (self.width as isize, self.h() as isize);
        iter.filter(move |&(x, y)| 0 <= x && x < width && 0 <= y && y < height)
            .map(|(x, y)| (x as usize, y as usize))
    }
}

impl<T> std::ops::Index<Point> for Grid<T> {
    type Output = T;
    fn index(&self, (x, y): Point) -> &Self::Output {
        self.get((x, y)).expect("Index out of bounds")
    }
}

impl<T> std::ops::IndexMut<Point> for Grid<T> {
    fn index_mut(&mut self, (x, y): Point) -> &mut Self::Output {
        self.get_mut((x, y)).expect("Index out of bounds")
    }
}

impl<T> std::fmt::Display for Grid<T>
where
    T: std::fmt::Display,
{
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        for y in 0..self.h() {
            for x in 0..self.w() {
                write!(f, "{}", self[(x, y)])?;
            }
            write!(f, "\n")?;
        }
        Ok(())
    }
}
